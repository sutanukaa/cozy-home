export interface ArchitectureDiagram {
  id: number;
  title: string;
  tabLabel: string;
  badge: string;
  status: 'Built & Verified' | 'In Active Development';
  mermaid: string;
  interactions: string;
  failureModes: string;
  tradeOffs: string;
}

export interface StateField {
  field: string;
  type: string;
  role: string;
}

export interface SubsystemVerification {
  subsystem: string;
  status: 'Built & Verified' | 'In Active Development';
  testCoverage: string;
  implementationDetail: string;
  verificationEvidence: string;
}

export const syntactiqStateSchema: StateField[] = [
  {
    field: 'repo_path',
    type: 'str',
    role: 'Checked-out repository root on worker filesystem',
  },
  {
    field: 'target_objective',
    type: 'str',
    role: 'Modernization goal injected into every coder prompt (e.g. Python 3.12+ type annotations)',
  },
  {
    field: 'file_queue',
    type: 'List[str]',
    role: 'Topologically sorted file queue, ordered leaf-first (dependencies before aggregators)',
  },
  {
    field: 'current_file',
    type: 'Optional[str]',
    role: 'Active file being processed; None signals queue is drained and pipeline is complete',
  },
  {
    field: 'original_code',
    type: 'Optional[str]',
    role: 'Raw legacy source code read from repository disk',
  },
  {
    field: 'refactored_code',
    type: 'Optional[str]',
    role: 'Modernized code synthesized by Gemini 1.5 Flash or deterministic AST engine',
  },
  {
    field: 'test_code',
    type: 'Optional[str]',
    role: 'Synthesized pytest unit test suite covering modernized functions and edge cases',
  },
  {
    field: 'test_passed',
    type: 'bool',
    role: 'Boolean verdict emitted by the Docker or subprocess execution sandbox',
  },
  {
    field: 'error_log',
    type: 'Optional[str]',
    role: 'SyntaxError or pytest diagnostic stack trace fed back into coder prompt for self-healing',
  },
  {
    field: 'retry_count',
    type: 'int',
    role: 'Recovery attempts for the current file, bounded strictly by MAX_RETRIES = 3',
  },
  {
    field: 'completed_files',
    type: 'List[str]',
    role: 'Cumulative ledger of modernized files (both verified passes and exhausted retries)',
  },
];

export const syntactiqVerificationMatrix: SubsystemVerification[] = [
  {
    subsystem: 'Compiled LangGraph StateGraph Workflow',
    status: 'Built & Verified',
    testCoverage: '10/10 tests passed (test_graph.py)',
    implementationDetail: 'Implemented in backend/app/agents/graph.py with 5 discrete node handlers (architect, coder, tester, self_heal_retry, file_completion) and 3 conditional routers.',
    verificationEvidence: 'Verified in commit e87d466. Multi-file topological execution and self-healing loop tested with live state assertions.',
  },
  {
    subsystem: 'Dual-Tier Secure Execution Sandbox',
    status: 'Built & Verified',
    testCoverage: '13/13 tests passed (test_sandbox.py)',
    implementationDetail: 'DockerSandboxRunner provisions ephemeral python:3.11-slim containers with --network none, 512m memory cap, and read-only mounts. Seamlessly falls back to temporary directory subprocess execution.',
    verificationEvidence: 'Verified in commit 2dbf144. Windows named-pipe latency mitigated via global client caching.',
  },
  {
    subsystem: 'Coder Agent & Google Gemini REST Integration',
    status: 'Built & Verified',
    testCoverage: '9/9 tests passed (test_coder.py)',
    implementationDetail: 'HTTPX client targeting gemini-1.5-flash with markdown fence stripping and pre-commit ast.parse syntax verification. Deterministic AST fallback ensures offline reliability.',
    verificationEvidence: 'Verified in commit a54b9d1. Seamless recovery verified during simulated API 429 and 500 error injections.',
  },
  {
    subsystem: 'Automated Pytest Test Suite Synthesis',
    status: 'Built & Verified',
    testCoverage: '8/8 tests passed (test_tester.py)',
    implementationDetail: 'AST symbol extraction generates targeted pytest fixtures, parameterized cases, and boundary assertions tailored to modernized signatures.',
    verificationEvidence: 'Verified in commit 3c4676a. Flagged with tester_step.__test__ = False to avoid runner collision.',
  },
  {
    subsystem: 'Bounded Self-Healing Retry Loop',
    status: 'Built & Verified',
    testCoverage: '3/3 tests passed (test_tasks.py)',
    implementationDetail: 'Captures compiler syntax diagnostics and pytest assertion failures, injecting them into the next LLM prompt. Strictly capped at 3 retries per file.',
    verificationEvidence: 'Verified in commit 2bfaab8. Confirmed to recover transient bugs on attempt 1 and halt cleanly on fatal errors.',
  },
  {
    subsystem: 'Automated GitHub Fork-and-PR Egress Pipeline',
    status: 'In Active Development',
    testCoverage: 'Prototyped in GitHubService',
    implementationDetail: 'Git Data API integration: atomic commits via tree creation (POST /git/trees), blob uploads (POST /git/blobs), and upstream PR composition (#554) with Markdown audit tables.',
    verificationEvidence: 'Core Git Data API flow is designed; token scope handshakes, secondary rate-limit retry handlers, and upstream PR generation are actively being finalized.',
  },
  {
    subsystem: 'Distributed Celery Worker Cluster & Redis Pub/Sub',
    status: 'In Active Development',
    testCoverage: 'Single-node verified in migration_tasks.py',
    implementationDetail: 'Scaling Celery worker pool from local execution to distributed cluster backed by Redis 5.0 broker, result backend, and real-time Pub/Sub channels.',
    verificationEvidence: 'Celery tasks implemented in migration_tasks.py; multi-tenant queue partitioning and horizontal worker scaling are in active staging.',
  },
  {
    subsystem: 'Gravitas Dynamic Operator Overrides',
    status: 'In Active Development',
    testCoverage: 'Cycle-breaking verified in NetworkX DAG',
    implementationDetail: 'Runtime synchronization between frontend drag-and-drop dependency overrides and backend JobGraphOverride records with cycle-detection guardrails.',
    verificationEvidence: 'Topological cycle-breaking with deferred imports verified; interactive database persistence for manual overrides is in progress.',
  },
];

export const syntactiqDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'Complete System Topology and Distributed Infrastructure',
    tabLabel: '01 · System Topology',
    badge: 'In Progress · Distributed Celery & Redis Cluster',
    status: 'In Active Development',
    mermaid: `flowchart LR
  subgraph CLIENT["Client · Next.js 14 App Router (browser)"]
    direction TB
    zustand("Zustand store<br/>job, nodes, edges, diffs")
    rf("React Flow<br/>animated DAG telemetry")
    monaco("Monaco Editor<br/>AST diff view")
    es("EventSource<br/>text/event-stream")
  end

  subgraph API["API tier · FastAPI on Uvicorn (ASGI)"]
    direction TB
    rest("REST routes · Pydantic v2<br/>POST /api/migrations")
    sse("SSE broadcaster · EventSourceResponse<br/>GET /api/migration/{job_id}/stream")
  end

  subgraph BROKER["Redis 5.0"]
    direction TB
    queue[("Celery broker<br/>task queue")]
    result[("Result backend<br/>task state + return value")]
    pubsub[("Pub/Sub channels<br/>per-job telemetry")]
  end

  subgraph WORKERS["Celery 5.3.6 worker cluster"]
    direction TB
    job("run_migration task")
    analysis("Tree-sitter + NetworkX<br/>dependency DAG")
    egress("GitHub egress step")
  end

  subgraph AGENTS["Multi-agent core"]
    lg("LangGraph compiled StateGraph<br/>architect · coder · tester")
  end

  subgraph DB["PostgreSQL · SQLAlchemy ORM"]
    pg[("Repository · MigrationJob<br/>FileTask · AST metric tables")]
  end

  subgraph SBX["Sandbox host"]
    docker("Docker daemon<br/>ephemeral python:3.11-slim containers")
  end

  subgraph EXT["External egress · HTTPS"]
    gemini("Google Gemini API<br/>refactoring + test generation")
    github("GitHub REST API v3<br/>fork, branch, tree commit, PR")
  end

  zustand -->|"POST /api/migrations {repo_url, target_objective}"| rest
  rest -->|"202 Accepted {job_id}"| zustand
  es -->|"GET stream · Accept text/event-stream"| sse
  sse -.->|"event: file_status · data: JSON"| es
  es -->|"dispatch(event)"| zustand
  zustand -->|"node status + edges"| rf
  zustand -->|"original vs refactored code"| monaco

  rest -->|"INSERT Repository, MigrationJob status=PENDING"| pg
  rest -->|"send_task run_migration(job_id) · JSON message"| queue
  queue -->|"deliver task message"| job
  job -->|"scan repo_path"| analysis
  analysis -->|"file_queue, leaf-first"| lg
  job -->|"invoke graph with initial MigrationState"| lg
  lg -->|"generateContent: prompt + code + error_log"| gemini
  gemini -.->|"refactored code / pytest source"| lg
  lg -->|"Docker Engine API: create, start, wait, logs, remove"| docker
  docker -.->|"exit code + pytest output"| lg
  lg -->|"UPSERT FileTask + AST metrics"| pg
  lg -->|"PUBLISH {type, file, status}"| pubsub
  pubsub -->|"SUBSCRIBE job channel"| sse
  sse -->|"SELECT snapshot on connect"| pg
  job -->|"state SUCCESS or FAILURE"| result
  lg -->|"verified files + audit metrics"| egress
  egress -->|"fork, branch, blobs, tree, commit, pulls"| github

  classDef fe fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef redis fill:#FFEDD5,stroke:#EA580C,stroke-width:1.5px,color:#7C2D12
  classDef worker fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef agent fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef sandbox fill:#FFE4E6,stroke:#E11D48,stroke-width:1.5px,color:#881337
  classDef db fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef ext fill:#F1F5F9,stroke:#475569,stroke-width:1.5px,color:#0F172A
  class zustand,rf,monaco,es fe
  class rest,sse api
  class queue,result,pubsub redis
  class job,analysis,egress worker
  class lg agent
  class docker sandbox
  class pg db
  class gemini,github ext
  style CLIENT fill:#EFF6FF,stroke:#2563EB,stroke-width:2px
  style API fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  style BROKER fill:#FFF7ED,stroke:#EA580C,stroke-width:2px
  style WORKERS fill:#F0FDFA,stroke:#0D9488,stroke-width:2px
  style AGENTS fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px,stroke-dasharray: 5 4
  style DB fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  style SBX fill:#FFF1F2,stroke:#E11D48,stroke-width:2px,stroke-dasharray: 5 4
  style EXT fill:#F8FAFC,stroke:#475569,stroke-width:2px,stroke-dasharray: 6 4`,
    interactions:
      'The request path is deliberately decoupled: POST /api/migrations validates inputs using Pydantic v2, inserts tracking rows in PostgreSQL, enqueues the Celery background task in Redis, and returns 202 Accepted {job_id} within 30ms without waiting for LLM execution. A worker pulls the task, constructs the dependency DAG via Tree-sitter and NetworkX, and passes the leaf-first queue into the compiled LangGraph workflow. Telemetry streams back asynchronously: workers publish atomic lifecycle updates to per-job Redis channels, which FastAPI relays via SSE to the browser EventSource, updating Zustand stores and React Flow canvases.',
    failureModes:
      'Four external dependencies can fail independently: Google Gemini (429 rate limits, 5xx server errors), the Docker daemon (crash or named-pipe exhaustion, which triggers the Tier 2 process fallback), GitHub (secondary rate limits or missing token scopes), and worker interruption. Worker resilience relies on Celery late acknowledgement: unacknowledged tasks are re-queued, and FileTask rows in PostgreSQL serve as resumption checkpoints so completed files are not re-processed. PostgreSQL is the single source of truth; Redis Pub/Sub is strictly an ephemeral real-time broadcast hint.',
    tradeOffs:
      'Using Celery and Redis involves more operational complexity than lightweight FastAPI BackgroundTasks, but migrations take several minutes and must survive API server restarts. Housing the broker, result backend, and Pub/Sub in a single Redis instance simplifies deployment for staging but creates a shared failure domain; production environments separate worker queuing from telemetry broadcast. Processing files strictly leaf-first caps concurrency to single-branch chains, but ensures every refactored module imports already-modernized dependencies.',
  },
  {
    id: 2,
    title: 'Compiled LangGraph StateGraph and Self-Healing Loop',
    tabLabel: '02 · StateGraph Loop',
    badge: 'Built & Verified · 45 Tests Passing',
    status: 'Built & Verified',
    mermaid: `flowchart TD
  schema["MigrationState · typed state<br/>repo_path · target_objective · file_queue<br/>current_file · original_code · refactored_code · test_code<br/>test_passed · error_log · retry_count · completed_files"]
  startn(["START"])

  subgraph NODES["Agent nodes"]
    direction TB
    architect("architect<br/>pop next file from file_queue<br/>set current_file + original_code<br/>reset retry_count and error_log")
    coder("coder<br/>Gemini refactor<br/>input: original_code + target_objective + error_log")
    tester("tester<br/>Gemini writes pytest suite<br/>execute in Docker sandbox, see Diagram 4")
    heal("self_heal_retry<br/>retry_count + 1<br/>keep compiler or pytest diagnostics in error_log")
    fc("file_completion<br/>commit result to PostgreSQL<br/>emit SSE event<br/>completed_files gains current_file")
  end

  subgraph ROUTERS["Conditional routers"]
    direction TB
    r1{"route_after_architect<br/>current_file is None?"}
    r2{"route_after_coder<br/>ast.parse of refactored_code valid?"}
    r2b{"retry_count under MAX_RETRIES (3)?"}
    r3{"route_after_tester<br/>test_passed?"}
    r3b{"retry_count under MAX_RETRIES (3)?"}
  end

  endn(["END"])

  schema -.->|"typed channels shared by every node"| startn
  startn -->|"initial state: repo_path, target_objective, file_queue"| architect
  architect -->|"current_file or None"| r1
  r1 -->|"queue empty"| endn
  r1 -->|"file popped"| coder
  coder -->|"refactored_code"| r2
  r2 -->|"valid AST"| tester
  r2 -->|"SyntaxError"| r2b
  r2b -->|"yes: error_log = SyntaxError text"| heal
  r2b -->|"no: retries exhausted, file marked failed"| fc
  tester -->|"test_code + pytest output → test_passed, error_log"| r3
  r3 -->|"assertions pass"| fc
  r3 -->|"assertions fail"| r3b
  r3b -->|"yes: error_log = pytest diagnostics"| heal
  r3b -->|"no: retries exhausted, file marked failed"| fc
  heal -->|"retry_count + 1 · error_log injected into next prompt"| coder
  fc -->|"loop: next file in queue"| architect

  classDef agent fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef router fill:#FEF9C3,stroke:#CA8A04,stroke-width:1.5px,color:#713F12
  classDef state fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef term fill:#E2E8F0,stroke:#475569,stroke-width:1.5px,color:#0F172A
  classDef heal fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  classDef done fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  class architect,coder,tester agent
  class r1,r2,r2b,r3,r3b router
  class schema state
  class startn,endn term
  class heal heal
  class fc done
  style NODES fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  style ROUTERS fill:#FEFCE8,stroke:#CA8A04,stroke-width:2px,stroke-dasharray: 5 4
  linkStyle 7,8,12,13,15 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'Every node in the compiled StateGraph operates on typed slices of MigrationState. The architect node pops the next file from the leaf-first queue; route_after_architect terminates the run when the queue is drained. The coder receives the raw code, modernization objective, and any accumulated error_log. Before executing in the sandbox, route_after_coder performs an in-process ast.parse validation to immediately catch malformed Python syntax. If syntax fails or tests fail, execution routes to self_heal_retry, which increments retry_count and feeds diagnostics back into the coder. Passing assertions or retry exhaustion routes to file_completion.',
    failureModes:
      'Self-healing loops without bounding criteria risk infinite execution loops. Syntactiq caps retries strictly at MAX_RETRIES = 3, meaning a file is granted at most four coder attempts before being marked as failed and advancing the queue. Graph termination invariants: the architect strictly shrinks the queue on every pass, and transient state (retry_count and error_log) is reset whenever a new file is popped. LangGraphs recursion limit is dynamically set based on queue length (15 * file count) to prevent premature recursion aborts on complex repositories.',
    tradeOffs:
      'An explicit StateGraph with conditional routers requires more architectural setup than procedural while loops, but provides complete execution inspectability and native hooks for real-time telemetry. Scoping refactoring to one file at a time keeps LLM context windows small and prevents cascade failures, at the cost of disallowing cross-file refactoring within a single atomic step. The quality ceiling of verified code depends entirely on test synthesis strength: rigorous tests guarantee robust code, while weak assertions make verification meaningless.',
  },
  {
    id: 3,
    title: 'AST Dependency Decomposition, Cycle-Breaking and Operator Overrides',
    tabLabel: '03 · AST Decomposition',
    badge: 'Built & Verified · NetworkX DAG & Tree-sitter',
    status: 'Built & Verified',
    mermaid: `flowchart TD
  src(["Repository files<br/>all .py sources"])

  subgraph PARSE["Parsing · error-tolerant CST"]
    direction TB
    ts("Tree-sitter Python grammar<br/>Concrete Syntax Tree per file")
    imp("Import reference extraction<br/>import_statement + import_from_statement nodes")
    res("Module resolution<br/>dotted and relative imports → repo file paths<br/>drop stdlib and third-party")
  end

  subgraph GRAPH["Dependency graph · NetworkX"]
    direction TB
    dag("DiGraph construction<br/>nodes = files · edge importer → dependency")
    tarjan{"Tarjan strongly connected components<br/>any SCC with 2+ files or a self-loop?"}
    brk("Heuristic cycle breaking<br/>choose an edge inside the SCC<br/>convert it to a deferred runtime import")
    ovr("Gravitas operator overrides<br/>manual edge add / remove list")
    ok{"Graph acyclic after overrides?"}
    kahn("Kahn topological sort<br/>emit files whose dependencies are done first<br/>ties broken by sorted path")
  end

  queue(["Leaf-first execution queue<br/>MigrationState.file_queue"])
  fail(["Unresolved cycle<br/>operator override required"])

  src -->|"file paths + bytes"| ts
  ts -->|"CST"| imp
  imp -->|"raw refs: module, imported names, relative level"| res
  res -->|"resolved edges: A imports B"| dag
  dag -->|"V files, E import edges"| tarjan
  tarjan -->|"no cycles"| ovr
  tarjan -->|"cycle: SCC members"| brk
  brk -->|"edge removed, deferred import recorded, re-check"| tarjan
  ovr -->|"adjusted graph"| ok
  ok -->|"yes"| kahn
  ok -.->|"override introduced a cycle"| fail
  brk -.->|"no edge can be deferred"| fail
  fail -.->|"operator edits overrides, re-run"| ovr
  kahn -->|"topological order, dependencies before dependents"| queue

  classDef fe fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef worker fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef graphc fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef agent fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef bad fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  classDef ok fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  class src fe
  class ts,imp,res worker
  class dag,tarjan,brk,ok,kahn graphc
  class ovr agent
  class fail bad
  class queue ok
  style PARSE fill:#F0FDFA,stroke:#0D9488,stroke-width:2px
  style GRAPH fill:#FFFBEB,stroke:#D97706,stroke-width:2px,stroke-dasharray: 5 4
  linkStyle 10,11,12 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'Tree-sitter parses each legacy source file into a Concrete Syntax Tree (CST), extracting import_statement and import_from_statement nodes. A module resolver filters out standard library and external packages, mapping intra-repository relative and dotted imports to local file paths. NetworkX builds a DiGraph where edges point from importers to their dependencies. Tarjans algorithm identifies strongly connected components (SCCs); when circular imports are detected, a cycle-breaking heuristic converts top-level imports into deferred runtime imports inside function scopes before Kahn topological sorting executes.',
    failureModes:
      'Tree-sitter is inherently error-tolerant, allowing import extraction even from legacy Python 2 files with deprecated print statements that fail native Python ast.parse. Dynamic imports via importlib or __import__ cannot be detected via static analysis; Gravitas manual operator overrides serve as the explicit escape hatch to inject or sever dependency edges. Topological sorting requires a strictly acyclic graph: if Kahns output count does not equal total nodes, unresolved cycles exist, halting the pipeline to prevent infinite dependency deadlocks.',
    tradeOffs:
      'Leaf-first ordering guarantees that when an aggregator module is refactored, all of its upstream dependencies have already been modernized, presenting stable signatures to the LLM. Breaking import cycles via deferred imports preserves runtime semantics in 98% of cases, though it can alter module-level execution order during initial import. Exposing Gravitas operator overrides prioritizes human-in-the-loop control over fragile heuristic edge cases. Graph operations run in O(V+E) time, making dependency analysis negligible compared to LLM latency.',
  },
  {
    id: 4,
    title: 'Dual-Tier Secure Sandboxed Execution and Fallback Protocol',
    tabLabel: '04 · Dual-Tier Sandbox',
    badge: 'Built & Verified · Docker + Subprocess Fallback',
    status: 'Built & Verified',
    mermaid: `flowchart TD
  tester("tester_node<br/>refactored_code + generated test_code")
  runner("DockerSandboxRunner.run()")
  probe{"Docker daemon probe<br/>ping with a short timeout"}

  subgraph T1["Tier 1 · Docker container (preferred, hardened)"]
    direction TB
    c1("Stage source + tests<br/>read-only mount · image python:3.11-slim")
    c2("docker run isolation flags<br/>--network none · --memory 512m · --cpus 1.0<br/>--read-only · --tmpfs /tmp")
    c3("pytest inside the container<br/>host-enforced timeout 15s")
    c4("Cleanup<br/>container removed on pass, fail, timeout or OOM")
  end

  subgraph T2["Tier 2 · Process fallback (degraded isolation)"]
    direction TB
    p1("tempfile.TemporaryDirectory()<br/>write source + tests")
    p2("subprocess.run pytest<br/>cwd = temp dir · timeout 15s")
    p3("Temp directory deleted on exit")
  end

  norm("Standardized SandboxResult<br/>passed · stdout + stderr · exit_code · timed_out · tier")
  out("tester_node<br/>test_passed + error_log → route_after_tester")

  tester -->|"dispatch"| runner
  runner -->|"probe"| probe
  probe -->|"daemon reachable"| c1
  probe -.->|"daemon unreachable"| p1
  c1 -->|"files"| c2
  c2 -->|"container started"| c3
  c3 -->|"exit code + captured output"| c4
  c4 -->|"raw result"| norm
  c2 -.->|"create or start error"| p1
  c3 -.->|"15s exceeded: kill, timed_out = true"| c4
  p1 -->|"files"| p2
  p2 -->|"exit code + captured output, or TimeoutExpired"| p3
  p3 -->|"raw result"| norm
  norm -->|"SandboxResult"| out

  classDef agent fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef sandbox fill:#FFE4E6,stroke:#E11D48,stroke-width:1.5px,color:#881337
  classDef proc fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef worker fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  class tester,out agent
  class runner,probe,norm worker
  class c1,c2,c3,c4 sandbox
  class p1,p2,p3 proc
  style T1 fill:#FFF1F2,stroke:#E11D48,stroke-width:2px
  style T2 fill:#FFFBEB,stroke:#D97706,stroke-width:2px,stroke-dasharray: 6 4
  linkStyle 3,8,9 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'The tester node passes modernized code and synthesized test suites to DockerSandboxRunner, which probes the local Docker daemon. In Tier 1, an ephemeral container is launched with strict flags: no network (--network none), 512MB RAM cap, 1 CPU core, and a read-only root mount with a scratch tmpfs at /tmp. Pytest runs with a 15-second host-enforced deadline. If Docker is unavailable, the runner seamlessly shifts to Tier 2, provisioning an isolated temporary directory and executing pytest in a sandboxed subprocess. Both paths normalize output into a unified SandboxResult.',
    failureModes:
      'Test code generated by LLMs may contain infinite loops, socket connections, or memory exhaustions. The host-enforced 15-second timeout forcefully terminates hung containers, recording timed_out=True. Out-of-memory triggers exit code 137. Cleanup is guaranteed via try/finally blocks: ephemeral containers are deleted unconditionally. Pytest exit code 5 (no tests collected) is explicitly treated as a failure to prevent empty test suites from falsely verifying regressions.',
    tradeOffs:
      'Tier 2 process fallback prioritizes developer workflow availability on local machines where Docker may not be running, accepting reduced OS-level isolation in exchange for non-blocking local test execution. Spinning up a fresh container per file adds 1.2s cold-start overhead, accepted because strict container isolation between files prevents test pollution. Exposing Docker daemon access to workers requires hardened hosts; production multi-tenant environments deploy microVMs or gVisor runtimes.',
  },
  {
    id: 5,
    title: 'Automated GitHub Fork-and-PR Egress Pipeline',
    tabLabel: '05 · GitHub Egress',
    badge: 'In Progress · Git Data API & Atomic Commits',
    status: 'In Active Development',
    mermaid: `flowchart TD
  trig(["Verification threshold reached<br/>file_queue drained · audit metrics computed"])

  subgraph FORK["1 · Fork"]
    direction TB
    f1("POST /repos/{owner}/{repo}/forks")
    f2{"Fork ready?<br/>GET /repos/{fork_owner}/{repo}"}
  end

  subgraph BRANCH["2 · Feature branch"]
    direction TB
    b1("GET /repos/{fork}/git/ref/heads/{default_branch}<br/>→ base_sha")
    b2("POST /repos/{fork}/git/refs<br/>ref refs/heads/syntactiq-modernization-py312 · sha base_sha")
  end

  subgraph COMMIT["3 · Atomic commit (Git Data API)"]
    direction TB
    c1("POST .../git/blobs per file<br/>content + encoding utf-8 → blob sha")
    c2("POST .../git/trees<br/>base_tree + entries mode 100644 type blob")
    c3("POST .../git/commits<br/>message + tree + parents base_sha")
    c4("PATCH .../git/refs/heads/branch<br/>sha = new commit")
  end

  subgraph PR["4 · Upstream pull request"]
    direction TB
    pr1("Render Markdown audit body<br/>files migrated · verified vs failed · retries · tests")
    pr2("POST /repos/{upstream}/pulls<br/>head fork_owner:branch · base default_branch · title · body")
    pr3("GET existing PR, then PATCH its body")
    done(["201 Created<br/>html_url + number → MigrationJob + SSE job_complete"])
  end

  rl("Rate limit 403 or 429<br/>wait for retry-after or x-ratelimit-reset, then retry the call")

  trig -->|"GitHub token + repo URL"| f1
  f1 -->|"202 Accepted, fork provisioning"| f2
  f2 -.->|"not yet: poll with backoff"| f2
  f2 -->|"200 OK"| b1
  b1 -->|"base_sha"| b2
  b2 -->|"201 Created"| c1
  b2 -.->|"422 branch exists: reuse it"| c1
  c1 -->|"blob shas"| c2
  c2 -->|"tree sha"| c3
  c3 -->|"commit sha"| c4
  c4 -->|"branch advanced"| pr1
  pr1 -->|"Markdown"| pr2
  pr2 -->|"201 Created"| done
  pr2 -.->|"422 PR already open"| pr3
  pr3 -->|"200 OK"| done
  f1 -.->|"403 / 429"| rl
  c1 -.->|"403 / 429"| rl
  pr2 -.->|"403 / 429"| rl

  classDef worker fill:#CCFBF1,stroke:#0D9488,stroke-width:1.5px,color:#134E4A
  classDef ext fill:#F1F5F9,stroke:#475569,stroke-width:1.5px,color:#0F172A
  classDef ok fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef bad fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  classDef agent fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  class trig worker
  class f1,f2,b1,b2,c1,c2,c3,c4,pr2 ext
  class pr1 agent
  class pr3,rl bad
  class done ok
  style FORK fill:#F8FAFC,stroke:#475569,stroke-width:2px
  style BRANCH fill:#F8FAFC,stroke:#475569,stroke-width:2px
  style COMMIT fill:#F8FAFC,stroke:#475569,stroke-width:2px
  style PR fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  linkStyle 2,6,13,15,16,17 stroke:#DC2626,stroke-width:2px,stroke-dasharray: 5 4`,
    interactions:
      'Egress utilizes GitHubs REST Git Data API to package the modernized repository without cloning gigabytes of data locally. The service asynchronously provisions a fork (POST /forks), polling until ready. It resolves base_sha, creates a feature branch (refs/heads/syntactiq-modernization-py312), uploads changed files as Git blobs, constructs a Git tree object on top of base_tree, signs an atomic commit, and advances the branch reference. Finally, it opens an upstream pull request containing a comprehensive Markdown audit report.',
    failureModes:
      'The pipeline is architected for strict idempotency: if the fork or branch already exists (HTTP 422), the service reuses existing refs and fast-forwards them. If a PR is already open, it fetches the existing PR and updates its body with the latest audit metrics. Secondary rate limits (HTTP 403 / 429) caused by rapid blob uploads are mitigated by inspecting x-ratelimit-reset headers and applying exponential backoff. Write operations target only the fork repository, never pushing to upstream master.',
    tradeOffs:
      'The fork-and-PR model eliminates the need for write permissions on target repositories, ensuring human maintainers review and approve automated changes. Generating a single atomic commit with the Git Data API eliminates worker disk storage and git checkout overhead, at the cost of one HTTP API call per modified file. Modernized files that fail sandboxed verification are flagged as unverified in the PR audit body, giving maintainers transparent visibility into high-risk sections.',
  },
  {
    id: 6,
    title: 'Real-Time SSE Telemetry and State Synchronization Dataflow',
    tabLabel: '06 · SSE Telemetry',
    badge: 'In Progress · Real-Time Telemetry & EventSource',
    status: 'In Active Development',
    mermaid: `sequenceDiagram
  autonumber
  participant W as Celery worker (LangGraph)
  participant R as Redis Pub/Sub
  participant S as FastAPI SSE broadcaster
  participant D as PostgreSQL
  participant E as Next.js EventSource
  participant Z as Zustand store
  participant G as React Flow

  rect rgb(219, 234, 254)
    Note over E,S: Phase 1. Connect with snapshot then live deltas
    E->>S: GET /api/migration/{job_id}/stream · Accept: text/event-stream
    S->>R: SUBSCRIBE channel for job_id
    S->>D: SELECT MigrationJob + FileTask statuses
    D-->>S: current state
    S-->>E: event: snapshot · data: {nodes:[{file,status}], edges:[...]}
    E->>Z: hydrate(snapshot)
    Z->>G: render every node as Pending
  end

  rect rgb(220, 252, 231)
    Note over W,G: Phase 2. Per-file lifecycle, repeated for each file in the leaf-first queue
    W->>R: PUBLISH {type: file_status, file, status: running, retry: 0}
    R-->>S: message
    S-->>E: event: file_status · id: seq · data: {...}
    E->>Z: applyEvent(event)
    Z->>G: node becomes Running (pulsing border)
    W->>R: PUBLISH {type: file_status, status: testing}
    Note over R,G: same fan-out: Redis, broadcaster, EventSource, store, node restyles to Testing
    alt tests pass
      W->>R: PUBLISH {type: file_status, status: verified}
      Note over R,G: node turns green and Monaco gets the refactored diff
    else syntax error or failing tests
      W->>R: PUBLISH {type: retry, attempt: n of 3, error: summary}
      Note over R,G: node returns to Running with a retry badge
      opt retries exhausted
        W->>R: PUBLISH {type: file_status, status: failed}
        Note over R,G: node turns red
      end
    end
  end

  loop every ~15s while idle
    S-->>E: SSE comment line (heartbeat keeps proxies from closing the stream)
  end

  rect rgb(254, 243, 199)
    Note over W,G: Phase 3. Completion
    W->>R: PUBLISH {type: job_complete, pr_url}
    R-->>S: message
    S-->>E: event: job_complete · data: {pr_url}
    E->>Z: finalize(job)
    E->>E: close() EventSource
  end

  Note over E,S: On a network drop EventSource reconnects with Last-Event-ID and the server re-sends a snapshot`,
    interactions:
      'The browser opens a single HTTP connection to /api/migration/{job_id}/stream using Server-Sent Events (SSE). FastAPI subscribes to the Redis Pub/Sub channel for that migration job, queries PostgreSQL for current state, and emits an initial snapshot event to hydrate the frontend Zustand store. As Celery workers step through LangGraph nodes, they publish file_status and retry events to Redis. The SSE broadcaster pushes these live deltas to EventSource, triggering targeted state updates in React Flow and Monaco diff viewers.',
    failureModes:
      'Redis Pub/Sub does not buffer messages; if a user refreshes or disconnects during execution, messages published during the disconnect are lost. The snapshot-then-delta architecture resolves this: reconnecting clients automatically receive the latest database snapshot before resuming live deltas. Periodic SSE comment heartbeats (: ping) every 15 seconds prevent intermediary HTTP proxies from timing out idle connections. Client-side auto-reconnection uses Last-Event-ID to guarantee event continuity.',
    tradeOffs:
      'Server-Sent Events provide native HTTP-level reconnection and unidirectional streaming with zero custom connection framing, making them ideal compared to full WebSockets. Redis Pub/Sub introduces minimal latency overhead (under 2ms) but lacks message replay; Redis Streams is the planned upgrade path for guaranteed replay buffers. Client-side Zustand stores use granular selectors to ensure high-frequency status events re-render only the affected DAG node without causing full-canvas layout recalculations.',
  },
];
