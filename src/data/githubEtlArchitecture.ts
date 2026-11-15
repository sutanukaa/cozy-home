export interface ArchitectureDiagram {
  id: number;
  title: string;
  tabLabel: string;
  badge: string;
  mermaid: string;
  interactions: string;
  failureModes: string;
  tradeOffs: string;
}

export interface EtlTableSchema {
  table: string;
  primaryKey: string;
  columns: string;
  writeStrategy: string;
  rationale: string;
}

export interface EtlDerivedField {
  field: string;
  computedWhere: string;
  definition: string;
  notes: string;
}

export const githubEtlTables: EtlTableSchema[] = [
  {
    table: 'repos',
    primaryKey: 'id',
    columns: 'id, full_name (UNIQUE), stars, open_issues, fetched_at',
    writeStrategy: 'ON CONFLICT(id) DO UPDATE',
    rationale: 'Holds latest popularity and backlog counters per repository. fetched_at records data freshness for dashboard and debugging.',
  },
  {
    table: 'commits',
    primaryKey: 'sha',
    columns: 'sha, repo, author, message, committed_at',
    writeStrategy: 'INSERT OR IGNORE',
    rationale: 'A commit is content-addressed and immutable: the same sha always means the same content. Ignoring duplicates is always safe.',
  },
  {
    table: 'pull_requests',
    primaryKey: 'id',
    columns: 'id, repo, number, title, author, state, created_at, merged_at, hours_to_merge',
    writeStrategy: 'ON CONFLICT(id) DO UPDATE',
    rationale: 'Pull requests change state over time (open -> merged/closed) and titles can be edited. Rows must mirror latest state.',
  },
  {
    table: 'watchlist',
    primaryKey: 'none declared (UNIQUE repo recommended)',
    columns: 'repo, added_at',
    writeStrategy: 'INSERT OR IGNORE',
    rationale: 'Operator-managed watchlist defining repositories monitored by the SQL anomaly alert engine.',
  },
];

export const githubEtlDerivedFields: EtlDerivedField[] = [
  {
    field: 'hours_to_merge',
    computedWhere: 'Transform time in pipeline.py (stored)',
    definition: '(merged_at - created_at) in hours',
    notes: 'NULL when merged_at is NULL (open or closed without merge). Pure function of two timestamps, deterministic on upsert.',
  },
  {
    field: 'UTC timestamps',
    computedWhere: 'Transform time in pipeline.py',
    definition: 'ISO 8601 UTC strings (YYYY-MM-DDTHH:MM:SSZ)',
    notes: 'Standardized format ensures julianday(), date(), and strftime() evaluate properly and string sorting matches chronological order.',
  },
  {
    field: 'days_idle',
    computedWhere: 'Query time in alerts.py',
    definition: "julianday('now') - julianday(MAX(committed_at))",
    notes: 'Not stored; dynamically evaluated relative to the execution timestamp of alerts.py.',
  },
  {
    field: 'Top 5 contributors',
    computedWhere: 'Query time in analytics.py',
    definition: 'ROW_NUMBER() per repository by commit count',
    notes: 'Window function evaluated over aggregated commits grouped by repository and author.',
  },
  {
    field: 'Running commit total',
    computedWhere: 'Query time in analytics.py',
    definition: 'SUM(COUNT(*)) OVER (PARTITION BY repo ORDER BY date(committed_at))',
    notes: 'Cumulative window aggregation per repository across historical time buckets.',
  },
  {
    field: 'Merge speed rank',
    computedWhere: 'Query time in analytics.py',
    definition: 'RANK() OVER (PARTITION BY repo ORDER BY hours_to_merge)',
    notes: 'Computed strictly over merged pull requests (WHERE merged_at IS NOT NULL).',
  },
  {
    field: 'Weekly commit velocity',
    computedWhere: 'Query time in analytics.py',
    definition: "strftime('%Y-W%W', committed_at) bucket count",
    notes: 'Monday-based week of the year aggregation measuring velocity trends over time.',
  },
];

export const githubEtlDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'Complete Batch ETL Architecture & GitHub Actions Orchestration',
    tabLabel: '01 · System Topology',
    badge: 'GitHub Actions · SQLite Batch Pipeline',
    mermaid: `flowchart LR
  subgraph SCHED["GitHub Actions / scheduler"]
    direction TB
    cron(["Cron trigger<br/>0 6 * * * (06:00 UTC)"])
    runner("Ubuntu runner job<br/>checkout, Python 3.12, GITHUB_TOKEN")
    restore("actions/cache@v4 restore<br/>github.db from the previous run")
    hook("Live app webhook<br/>POST refresh signal with shared secret")
    art("actions/upload-artifact@v4<br/>github.db snapshot")
    save("actions/cache@v4 save<br/>post-job step, only if the job succeeded")
  end

  subgraph EXTRACT["Extraction and API"]
    direction TB
    ext("Extraction worker, pipeline.py<br/>per_page=100, follows Link rel=next")
    rl("Rate limit handler<br/>reads x-ratelimit-remaining and x-ratelimit-reset")
  end

  api("GitHub REST API v3<br/>api.github.com")

  subgraph TRANSFORM["Ingestion and transforms"]
    direction TB
    tr("Transformation engine<br/>flatten nested JSON, parse UTC, hours_to_merge")
    load("Idempotent loader<br/>INSERT OR IGNORE and ON CONFLICT DO UPDATE")
  end

  subgraph STORE["Storage / SQLite"]
    db[("SQLite github.db<br/>repos, commits, pull_requests, watchlist")]
  end

  subgraph ANALYSIS["Analytics and alerts"]
    direction TB
    an("analytics.py<br/>window-function SQL")
    al("alerts.py<br/>SQL anomaly rules")
  end

  subgraph CLIENT["Client / UI"]
    ui("Next.js dashboard<br/>Better-SQLite3 read-only queries")
  end

  fail(["Run fails<br/>non-zero exit, cache not saved, previous cache entry stays current"])

  cron -->|"schedule event on the default branch"| runner
  runner -->|"restore with key prefix match"| restore
  restore -->|"github.db present, or empty on a cache miss"| ext
  ext -->|"GET repos, commits, pulls with Bearer token"| api
  api -->|"JSON pages plus Link and x-ratelimit headers"| ext
  ext -->|"403 or 429 with remaining 0"| rl
  rl -->|"sleep until reset, then retry the page"| ext
  rl -->|"required wait exceeds the job budget"| fail
  ext -->|"raw nested JSON records"| tr
  tr -->|"tidy rows with UTC timestamps and hours_to_merge"| load
  load -->|"upserts, one transaction per repository"| db
  load -->|"database is locked after busy timeout"| fail
  db -->|"SELECT with window functions"| an
  an -->|"exit 0, then run rules"| al
  db -->|"SELECT rule queries"| al
  al -->|"POST /repos/{repo}/issues, label etl-alert"| api
  al -->|"issue creation rejected: 403 or 404"| fail
  al -->|"exit 0"| hook
  hook -->|"POST refresh request"| ui
  hook -->|"step complete"| art
  art -->|"job succeeded: post-job cache save"| save
  save -->|"new cache entry, restored by the next daily run"| restore
  db -->|"read-only SELECT on github.db"| ui

  classDef sched fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef xform fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef client fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef bad fill:#FFE4E6,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class cron,runner,restore,hook,art,save sched
  class ext,api api
  class rl,fail bad
  class tr,load,an,al xform
  class db store
  class ui client
  style SCHED fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  style EXTRACT fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  style TRANSFORM fill:#F0FDFA,stroke:#0D9488,stroke-width:2px
  style ANALYSIS fill:#F0FDFA,stroke:#0D9488,stroke-width:2px,stroke-dasharray: 5 4
  style STORE fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  style CLIENT fill:#EFF6FF,stroke:#2563EB,stroke-width:2px
  linkStyle 5,6,7,11,16 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'Scheduled GitHub Actions cron fires daily at 06:00 UTC. The worker restores the cached SQLite database, queries paginated GitHub REST API endpoints with Bearer authentication following Link headers, flattens payloads, computes derived fields, and performs idempotent upserts wrapped in transactions. On completion, analytics and alerts execute, a webhook notifies the Next.js UI, and a fresh database cache artifact is saved.',
    failureModes:
      'Rate limit ceilings (1,000 req/hr GITHUB_TOKEN or 5,000 req/hr PAT) trigger 403/429 with x-ratelimit-remaining: 0; the worker sleeps until x-ratelimit-reset or fails loudly if the wait exceeds the workflow budget. Cache evictions fall back to CREATE TABLE IF NOT EXISTS schema initialization. Concurrent execution is mitigated via workflow concurrency groups.',
    tradeOffs:
      'SQLite single-file database eliminates hosted database maintenance costs and enables direct shared-memory reads via Better-SQLite3, but relies on GitHub Actions caching for persistence. Daily batch cron execution eliminates Kafka/webhook operational overhead at the cost of up to 24-hour metric staleness.',
  },
  {
    id: 2,
    title: 'Idempotent Load Protocol & Schema Invariants',
    tabLabel: '02 · Idempotent Loading',
    badge: 'Conditional SQL Routing · SQLite Upserts',
    mermaid: `flowchart TD
  rawc(["Raw commit payloads<br/>GET /repos/{repo}/commits pages"])
  rawp(["Raw pull request payloads<br/>GET /repos/{repo}/pulls pages"])
  rawr(["Repository payload<br/>GET /repos/{repo}"])

  subgraph TRANSFORM["Ingestion and transforms"]
    direction TB
    flat("Flatten nested JSON<br/>commit.author.name, commit.committer.date, user.login")
    utc("Parse timestamps to UTC ISO 8601<br/>YYYY-MM-DDTHH:MM:SSZ")
    dedupe("In-batch deduplication<br/>one record per key, latest wins")
    key{"Composite key resolution<br/>which entity is this record?"}
    derive("Derived calculation<br/>hours_to_merge = (merged_at - created_at) in hours<br/>NULL if merged_at is NULL")
  end

  subgraph LOAD["Conditional SQL routing, one transaction per repository"]
    direction TB
    insc("INSERT OR IGNORE INTO commits<br/>conflict target: sha")
    upp("INSERT INTO pull_requests ... ON CONFLICT(id) DO UPDATE<br/>title, state, merged_at, hours_to_merge")
    upr("INSERT INTO repos ... ON CONFLICT(id) DO UPDATE<br/>stars, open_issues, fetched_at")
  end

  subgraph STORE["Storage / SQLite"]
    db[("github.db<br/>commits PK sha, pull_requests PK id, repos PK id")]
  end

  reject("Reject record<br/>missing key or unparseable timestamp, log and skip")
  locked("database is locked<br/>retry within busy timeout, then roll back and abort")

  rawc -->|"JSON array, up to 100 per page"| flat
  rawp -->|"JSON array, up to 100 per page"| flat
  rawr -->|"single JSON object"| flat
  flat -->|"flat dicts"| utc
  utc -->|"normalized dicts"| dedupe
  dedupe -->|"unique records"| key
  key -->|"commit: key is sha, 40 hex, immutable"| insc
  key -->|"pull request: key is id, global, mutable"| derive
  derive -->|"row including hours_to_merge"| upp
  key -->|"repository: key is id"| upr
  insc -->|"new sha inserted, known sha is a no-op"| db
  upp -->|"new id inserted, known id updates mutable columns"| db
  upr -->|"insert, or refresh counters"| db
  flat -->|"missing sha or id"| reject
  utc -->|"timestamp parse failure"| reject
  insc -->|"SQLITE_BUSY"| locked
  upp -->|"SQLITE_BUSY"| locked

  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef xform fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef bad fill:#FFE4E6,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class rawc,rawp,rawr api
  class flat,utc,dedupe,key,derive,insc,upp,upr xform
  class db store
  class reject,locked bad
  style TRANSFORM fill:#F0FDFA,stroke:#0D9488,stroke-width:2px
  style LOAD fill:#F0FDFA,stroke:#0D9488,stroke-width:2px,stroke-dasharray: 5 4
  style STORE fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  linkStyle 13,14,15,16 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'Nested API JSON is flattened into scalar properties and timestamps are standardized to UTC ISO 8601 strings. Records undergo memory deduplication before conditional database routing: immutable commits are routed to INSERT OR IGNORE based on sha, while mutable pull requests route to ON CONFLICT(id) DO UPDATE to capture status and hours_to_merge transitions.',
    failureModes:
      'Corrupt records missing primary keys or containing unparseable dates are logged and rejected without crashing the batch. SQLite lock contention (SQLITE_BUSY) is handled with busy_timeout; if expired, the repository transaction rolls back cleanly, preserving atomicity.',
    tradeOffs:
      'INSERT OR IGNORE vs ON CONFLICT DO UPDATE: avoids heavy INSERT OR REPLACE operations which delete and re-insert rows (destabilizing rowids). Computing hours_to_merge during transformation simplifies SQL queries and enables indexing, at the cost of requiring a migration if the metric formula evolves.',
  },
  {
    id: 3,
    title: 'Automated Alert Engine & Issue Escalation Pipeline',
    tabLabel: '03 · Anomaly Alerts',
    badge: 'SQL Rules · REST Issue Escalation',
    mermaid: `flowchart TD
  trig(["Workflow step after analytics.py<br/>same daily 06:00 UTC run"])
  start("alerts.py starts<br/>opens github.db")

  subgraph RULES["SQL heuristic evaluations (SQLite)"]
    direction TB
    r1("Rule 1: inactivity<br/>days_idle = julianday('now') - julianday(MAX(committed_at))")
    r2("Rule 2: merge slowdown<br/>trailing 30-day average hours_to_merge versus overall average")
  end

  g1{"Gate 1<br/>days_idle greater than 30?"}
  g2{"Gate 2<br/>recent average greater than 2 times overall average?"}
  dedupe{"Open issue labeled etl-alert<br/>already exists for this rule? (recommended check)"}
  post("POST /repos/{repo}/issues<br/>JSON: title, body, labels [etl-alert]")
  done(["201 Created<br/>issue number and html_url logged"])
  quiet(["No alert<br/>repository is healthy"])
  skip(["Skip<br/>duplicate issue not filed"])
  err("Escalation failed<br/>403 or 429: back off and retry, 404 or 410: log and continue")

  trig -->|"invoke python alerts.py"| start
  start -->|"watchlist repositories"| r1
  start -->|"watchlist repositories"| r2
  r1 -->|"rows: repo, days_idle"| g1
  r2 -->|"rows: repo, recent_avg, overall_avg"| g2
  g1 -->|"no"| quiet
  g2 -->|"no"| quiet
  g1 -->|"yes: stale repository finding"| dedupe
  g2 -->|"yes: merge slowdown finding"| dedupe
  dedupe -->|"GET /repos/{repo}/issues?labels=etl-alert&state=open returns empty"| post
  dedupe -->|"returns an open issue"| skip
  post -->|"201 Created"| done
  post -->|"non-2xx response"| err

  classDef sched fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef xform fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef bad fill:#FFE4E6,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class trig sched
  class start,g1,g2,dedupe xform
  class r1,r2 store
  class post,done,quiet,skip api
  class err bad
  style RULES fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  linkStyle 12 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'alerts.py opens the freshly populated database and runs analytical SQL heuristic queries across repositories in the watchlist: checking for inactive repositories (idle > 30 days) and PR merge bottlenecks (trailing 30-day average > 2x historical average). When conditions trigger, open issue deduplication is performed before filing an automated GitHub Issue tagged with etl-alert.',
    failureModes:
      'Permission scoping: GITHUB_TOKEN can only open issues in the pipeline repository; writing to external target repositories requires an authorized PAT or App token. 403/404/410 errors are logged and skipped per repository without failing the entire run. Issue deduplication prevents flooding trackers with duplicate alerts on consecutive days.',
    tradeOffs:
      'Deterministic SQL threshold rules provide zero-blackbox clarity and easy maintenance, but can be sensitive to variance in small repositories. Filing issues directly in GitHub keeps alert triage adjacent to code, but carries up to 24-hour alerting latency compared to webhook-based real-time push alerts.',
  },
  {
    id: 4,
    title: 'Analytical SQL Engine & Window Functions',
    tabLabel: '04 · Window Analytics',
    badge: 'SQLite 3.25+ · Window Functions',
    mermaid: `sequenceDiagram
  autonumber
  participant A as analytics.py (sqlite3)
  participant Q as SQLite query engine
  participant T as commits and pull_requests tables
  participant O as Output (Actions log, dashboard)

  Note over Q: Window functions require SQLite 3.25 or newer

  rect rgb(220, 252, 231)
    Note over A,O: Query 1. Top 5 contributors per repo
    A->>Q: SELECT repo, author, n FROM (SELECT repo, author, COUNT(*) AS n, ROW_NUMBER() OVER (PARTITION BY repo ORDER BY COUNT(*) DESC) AS rn FROM commits GROUP BY repo, author) WHERE rn at most 5
    Q->>T: scan commits
    T-->>Q: rows
    Note over Q: GROUP BY first collapses to one row per repo and author. The window step then partitions by repo, sorts by count descending and numbers rows 1..n. The outer WHERE keeps rn at most 5.
    Q-->>A: up to 5 rows per repo
    A-->>O: top contributors
  end

  rect rgb(204, 251, 241)
    Note over A,O: Query 2. Running total of commits
    A->>Q: SELECT repo, date(committed_at) AS day, COUNT(*) AS n, SUM(COUNT(*)) OVER (PARTITION BY repo ORDER BY date(committed_at)) AS running_total FROM commits GROUP BY repo, day
    Q->>T: scan commits
    T-->>Q: rows
    Note over Q: Daily counts are summed cumulatively within each repo. The default frame is RANGE from UNBOUNDED PRECEDING to CURRENT ROW, so each day adds to the prior total.
    Q-->>A: one row per repo and day
    A-->>O: cumulative commit curve
  end

  rect rgb(254, 243, 199)
    Note over A,O: Query 3. Merge speed ranking
    A->>Q: SELECT repo, number, hours_to_merge, RANK() OVER (PARTITION BY repo ORDER BY hours_to_merge) AS speed_rank FROM pull_requests WHERE merged_at IS NOT NULL
    Q->>T: filter merged pull requests
    T-->>Q: rows
    Note over Q: Partition by repo, sort ascending, rank 1 is the fastest. Ties share a rank and the next rank skips ahead.
    Q-->>A: ranked pull requests
    A-->>O: fastest and slowest merges
  end

  rect rgb(237, 233, 254)
    Note over A,O: Query 4. Weekly commit velocity
    A->>Q: SELECT repo, strftime of committed_at as year-week, COUNT(*) AS commits FROM commits GROUP BY repo, week ORDER BY repo, week
    Q->>T: scan commits
    T-->>Q: rows
    Note over Q: A plain aggregation, no window step. The week label uses the Monday-based week of the year.
    Q-->>A: weekly counts per repo
    A-->>O: velocity trend
  end`,
    interactions:
      'analytics.py executes 4 analytical SQL queries leveraging SQLite window functions. It computes top 5 contributors per repository via ROW_NUMBER() OVER partitions, cumulative commit growth using SUM(COUNT(*)) OVER frames, PR merge speed rankings using RANK() OVER hours_to_merge, and weekly velocity buckets.',
    failureModes:
      'Window functions require SQLite >= 3.25. SQLite sorts NULL values first in ascending order, necessitating WHERE merged_at IS NOT NULL to avoid unmerged PRs occupying rank 1. Tie-breaking behavior: ROW_NUMBER() resolves ties arbitrarily whereas RANK() produces gaps.',
    tradeOffs:
      'On-demand SQL computation guarantees real-time adherence to the latest database load without maintaining redundant materialized aggregate tables. SQLite single-threaded analytical scans are well-suited for tens of thousands of records; migration to DuckDB or PostgreSQL is recommended if dataset scales past millions of rows.',
  },
];
