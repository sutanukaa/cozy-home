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

export interface BloomStage {
  stage: string;
  window: string;
  duration: string;
  visualState: string;
  noteStatus: string;
}

export interface BloomInvariant {
  id: number;
  invariant: string;
  enforcement: string;
  failureImpact: string;
}

export const bloomStages: BloomStage[] = [
  {
    stage: 'Seed',
    window: '[0h, 11h)',
    duration: '11 hours',
    visualState: 'Soil mound with the seed partly visible. No stem.',
    noteStatus: 'Sealed. Note key is absent from all payloads.',
  },
  {
    stage: 'Sprout',
    window: '[11h, 29h)',
    duration: '18 hours',
    visualState: 'Short curved stem with two cotyledon leaves.',
    noteStatus: 'Sealed. Confidential bytes remain in PostgreSQL.',
  },
  {
    stage: 'Seedling',
    window: '[29h, 54h)',
    duration: '25 hours',
    visualState: 'Upright stem with the first true leaf pairs.',
    noteStatus: 'Sealed. Zero network transmission of secret.',
  },
  {
    stage: 'Bud',
    window: '[54h, 72h)',
    duration: '18 hours',
    visualState: 'Full stem and leaves; closed bud tinted with variety color. Countdown active.',
    noteStatus: 'Sealed. Only the countdown timer is visible.',
  },
  {
    stage: 'Bloom',
    window: '[72h, ∞)',
    duration: 'Absorbing',
    visualState: 'Open blossom with variety-specific petals and vibrant center.',
    noteStatus: 'Unsealed. SQL time gate opens; note is returned and rendered.',
  },
];

export const bloomInvariants: BloomInvariant[] = [
  {
    id: 1,
    invariant: 'Stage Purity',
    enforcement: 'Pure function resolveStage(elapsedMs) in lib/seed.ts. Only input is elapsed time on database clock.',
    failureImpact: 'Water count, visitor inputs, and client device clocks cannot alter growth progression or unlock early.',
  },
  {
    id: 2,
    invariant: 'Early Silence',
    enforcement: 'Dual-layer gate: PostgreSQL SQL CASE statement inside get_plant + toPlantView TypeScript whitelist filter.',
    failureImpact: 'Secret note bytes never leave database into HTML, RSC flight payload, JSON, headers, or metadata before 72h.',
  },
  {
    id: 3,
    invariant: 'One Clock Authority',
    enforcement: 'Database now() in UTC is the sole time authority. Application server and client clocks are never queried.',
    failureImpact: 'Prevents client-side clock tampering and application server clock skew vulnerabilities.',
  },
  {
    id: 4,
    invariant: 'Immutable Birth',
    enforcement: 'PostgreSQL plants_guard trigger raises exception 23514 if created_at is altered on UPDATE.',
    failureImpact: 'Prevents backdating plant creation timestamps to trigger premature bloom transitions.',
  },
  {
    id: 5,
    invariant: 'Monotonic Water Counter',
    enforcement: 'Atomic single-statement UPDATE plants SET water_count = water_count + 1 + trigger rejection on decrement.',
    failureImpact: 'Eliminates lost updates under concurrent watering spikes without needing heavy distributed locks.',
  },
];

export const bloomDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'System Topology & Server-Side Secret Sealing',
    tabLabel: '01 · System Topology',
    badge: 'Next.js 15 · Dual-Layer Gate · Capability URLs',
    mermaid: `flowchart LR
  subgraph SENDER["Sender"]
    S1["Creation form<br/>note, variety, sender name"]
  end

  subgraph SRV["Server route handlers"]
    R1["POST /api/plant<br/>Zod validate, rate limit"]
    R2["Share link builder<br/>/p/[id]"]
    R3["GET /p/[id]<br/>server component"]
    F1{"Payload filter<br/>is stage bloom"}
  end

  subgraph DB["Supabase PostgreSQL"]
    D1[("plants<br/>id, created_at, variety, water_count")]
    D2[("plant_secrets<br/>plant_id, note")]
    D3["RPC create_plant"]
    D4["RPC get_plant<br/>time gate on database clock"]
  end

  subgraph ENG["Temporal engine"]
    T1["resolveStage in lib/seed.ts<br/>pure function of elapsed_ms"]
  end

  subgraph RCP["Recipient"]
    C1["Recipient browser"]
    C2["Client render<br/>SVG renderer and Framer Motion"]
  end

  Z1["Sealed payload<br/>note key absent"]
  Z2["Unsealed payload<br/>note included"]
  X1["Rejected: 422 invalid body"]
  X2["Rejected: 429 rate limited"]
  X3["Rejected: 404 unknown id"]

  S1 -->|"POST body"| R1
  R1 -->|"rpc"| D3
  D3 --> D1
  D3 --> D2
  R1 -->|"201 id, plantedAt, bloomsAt"| R2
  R2 -->|"link shared out of band"| C1
  C1 -->|"GET"| R3
  R3 -->|"rpc get_plant id"| D4
  D1 --> D4
  D2 -->|"read only inside gate"| D4
  D4 -->|"row, elapsed_ms, gated note"| T1
  T1 --> F1
  F1 -->|"stage before bloom"| Z1
  F1 -->|"stage is bloom"| Z2
  Z1 --> C2
  Z2 --> C2
  R1 -.->|"invalid"| X1
  R1 -.->|"over limit"| X2
  R3 -.->|"no row"| X3

  classDef client fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef server fill:#DCFCE7,stroke:#86EFAC,color:#1E293B
  classDef db fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef engine fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B
  classDef sealed fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class S1,C1,C2 client
  class R1,R2,R3,F1 server
  class D1,D2,D3,D4 db
  class T1 engine
  class Z1,X1,X2,X3 sealed

  linkStyle 12,14,16,17,18 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'Sender creates a gift via POST /api/plant, inserting records into plants and plant_secrets in one transaction. Access is secured via 122-bit entropy capability URLs (/p/[id]). On read, get_plant evaluates elapsed milliseconds and gates the note in SQL. The application server maps elapsed time via pure resolveStage and enforces a strict TypeScript discriminated union whitelist where sealed responses contain no note key or length metadata.',
    failureModes:
      'Client DevTools or network sniffing: Zero confidential bytes leave PostgreSQL before 72 hours. Defends against clock manipulation by ignoring client timestamps. Defends against time-zone daylight saving shifts by calculating duration using interval 72 hours rather than calendar days. RLS and revoked anon privileges prevent table enumeration via PostgREST.',
    tradeOffs:
      'Server-side payload stripping vs client-side encryption: Client-side time-lock decryption with browser keys fails because the recipient can manipulate local runtime execution. Splitting plant_secrets into an isolated table prevents accidental leaks from wide SELECT * or change feeds at the cost of a single JOIN.',
  },
  {
    id: 2,
    title: 'Deterministic Growth State Resolution',
    tabLabel: '02 · Deterministic State',
    badge: 'Zero-Cron · Pure Temporal Function · Absorbing Bloom',
    mermaid: `stateDiagram-v2
  direction LR

  classDef sealed fill:#FFE4E6,stroke:#EF4444,stroke-dasharray:5 5,color:#7F1D1D
  classDef open fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B

  [*] --> Seed : POST api plant fixes created_at
  Seed --> Sprout : elapsed reaches 11h
  Sprout --> Seedling : elapsed reaches 29h
  Seedling --> Bud : elapsed reaches 54h
  Bud --> Bloom : elapsed reaches 72h
  Bloom --> Bloom : every later read, absorbing

  Seed : Seed, 0h to 11h, note sealed
  Sprout : Sprout, 11h to 29h, note sealed
  Seedling : Seedling, 29h to 54h, note sealed
  Bud : Bud, 54h to 72h, note sealed
  Bloom : Bloom, 72h and later, note unsealed

  class Seed,Sprout,Seedling,Bud sealed
  class Bloom open`,
    interactions:
      'Growth stage is not stored as a mutable database column and requires zero cron daemon jobs. State is evaluated on-demand as a pure function: elapsed_ms = floor(db.now() - created_at). Stages are totally ordered (Seed -> Sprout -> Seedling -> Bud -> Bloom). An unread plant resolves instantly and accurately to Bloom on first access without scheduled catch-up jobs.',
    failureModes:
      'Negative elapsed time (e.g. database clock failover adjustments) is clamped to zero (Seed) to prevent execution errors. Precision mismatch between PostgreSQL microseconds and JS milliseconds is normalized by flooring elapsed_ms in SQL, ensuring SQL and TypeScript gates agree at every millisecond boundary.',
    tradeOffs:
      'Stateless mathematical evaluation vs cron mutations: Eliminates missed cron runs, cron failure alerts, write amplification, and thundering-herd database stampedes at the 72-hour mark. Eliminates mutable stage flags that could be corrupted by bad worker updates.',
  },
  {
    id: 3,
    title: 'Transactional Watering Interaction & Telemetry Flow',
    tabLabel: '03 · Micro-Interaction Flow',
    badge: 'Atomic DB Mutex · Supabase Realtime · Token Bucket',
    mermaid: `sequenceDiagram
  autonumber
  participant V as Visitor
  participant UI as Plant UI
  participant API as Route handler
  participant DB as Supabase PostgreSQL
  participant RT as Realtime channel
  participant O as Other viewers

  rect rgb(219, 234, 254)
    V->>UI: tap watering can
    Note over UI: optimistic wiggle, pending count raised, shown count is confirmed plus pending
    UI->>API: POST /api/plant/[id]/water
  end

  rect rgb(220, 252, 231)
    API->>API: validate uuid, token bucket check
  end

  alt over limit
    rect rgb(255, 228, 230)
      API-->>UI: 429 with Retry-After
      Note over UI: roll back pending count, stop wiggle, show cooldown
    end
  else within limit
    rect rgb(254, 243, 199)
      API->>DB: rpc water_plant(id)
      Note over DB: UPDATE plants SET water_count = water_count + 1 WHERE id = id RETURNING water_count. Row lock held until commit
      DB-->>API: new count n, or null
    end
    alt no such plant
      rect rgb(255, 228, 230)
        API-->>UI: 404
        Note over UI: roll back pending count
      end
    else counted
      API-->>UI: 200 waterCount n
      Note over UI: confirmed becomes max of confirmed and n, pending lowered
      rect rgb(220, 252, 231)
        API-)RT: broadcast on plant channel, waterCount n
      end
      RT-)O: waterCount n
      Note over O: confirmed becomes max of confirmed and n, soft remote wiggle
    end
  end

  rect rgb(204, 251, 241)
    Note over UI,DB: Stage is not touched. stage depends on created_at and database time only
  end`,
    interactions:
      'Visitor taps the watering can, triggering an optimistic Framer Motion spring rotation and incrementing a pending UI counter. The client sends POST /api/plant/[id]/water. After token bucket rate limiting, the server invokes water_plant, executing an atomic single-statement update with row-level locking. The server publishes a lightweight integer broadcast over Supabase Realtime channel plant:<id> to notify concurrent viewers.',
    failureModes:
      'Lost updates are eliminated by single-statement row-level locking. Over-rate spam triggers HTTP 429 Retry-After and rolls back optimistic UI counters. Out-of-order Realtime broadcast arrivals are converged via monotonic max(confirmed, incoming) reconciliation. Realtime dropouts do not impact core watering.',
    tradeOffs:
      'Realtime Broadcast vs table change feeds: Server broadcast isolates live feeds to a single integer payload, preventing accidental exposure of new table columns or secret notes. Optimistic client wiggle ensures immediate tactile feedback without waiting for round-trip network latency.',
  },
];
