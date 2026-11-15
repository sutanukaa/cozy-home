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

export interface TickeaseInvariant {
  id: number;
  invariant: string;
  enforcement: string;
  failureImpact: string;
}

export interface TickeaseTableSchema {
  table: string;
  columns: string;
  constraints: string;
  rlsPolicies: string;
}

export const tickeaseInvariants: TickeaseInvariant[] = [
  {
    id: 1,
    invariant: 'No Oversell',
    enforcement: 'SELECT ... FOR UPDATE row-lock inside reserve_tickets RPC + CHECK (sold <= capacity) constraint.',
    failureImpact: 'Eliminates inventory race conditions under heavy concurrent checkout spikes.',
  },
  {
    id: 2,
    invariant: 'One Admission per Ticket',
    enforcement: 'Atomic status transition (issued -> checked_in) serialized via SELECT FOR UPDATE in check_in_ticket RPC.',
    failureImpact: 'Prevents duplicate door entries across multiple concurrent mobile gate scanners.',
  },
  {
    id: 3,
    invariant: 'Unforgeable Tokens',
    enforcement: 'HMAC-SHA256 signatures derived with HKDF per event key, verified with crypto.timingSafeEqual before DB lock.',
    failureImpact: 'Prevents token forgery, unauthorized access, and cross-event ticket substitution.',
  },
  {
    id: 4,
    invariant: 'Database-Level Authorization',
    enforcement: 'Supabase PostgreSQL Row-Level Security (RLS) with auth.uid() init-plan evaluation on all tables.',
    failureImpact: 'Protects multi-tenant organizer isolation even if application-tier route handlers have defects.',
  },
  {
    id: 5,
    invariant: 'Read-Only Grounded AI Assistant',
    enforcement: 'SSE streaming proxy with strictly delimited reference data, zero database write permissions, and URL allowlist.',
    failureImpact: 'Prevents prompt injection attacks from mutating data or hallucinating event pricing/availability.',
  },
];

export const tickeaseTables: TickeaseTableSchema[] = [
  {
    table: 'events',
    columns: 'id (PK), organizer_id (FK), slug, title, status, starts_at, ends_at, venue, schedule, speakers, theme, schema_version, updated_at',
    constraints: "UNIQUE(slug), CHECK (slug ~ '^[a-z0-9-]{3,63}$'), CHECK (ends_at > starts_at)",
    rlsPolicies: "SELECT for anon where status = 'published'; SELECT, UPDATE, DELETE, INSERT where organizer_id = auth.uid()",
  },
  {
    table: 'ticket_tiers',
    columns: 'id (PK), event_id (FK), name, price_minor, currency, capacity, sold, sales_start, sales_end',
    constraints: 'UNIQUE(event_id, name), CHECK (price_minor >= 0), CHECK (capacity > 0), CHECK (sold >= 0 AND sold <= capacity)',
    rlsPolicies: "SELECT where parent event is published; Organizer manage through event ownership; UPDATE on sold restricted to RPCs",
  },
  {
    table: 'orders',
    columns: 'id (PK), event_id (FK), tier_id (FK), buyer_id (FK), buyer_email, quantity, status, total_minor, payment_ref, idempotency_key, chat_session_id, expires_at, created_at',
    constraints: 'UNIQUE(idempotency_key), CHECK (quantity BETWEEN 1 AND 10)',
    rlsPolicies: 'Buyer SELECT where buyer_id = auth.uid(); Organizer SELECT through event ownership; Client mutations denied',
  },
  {
    table: 'tickets',
    columns: 'id (PK), order_id (FK), event_id (FK denormalized), tier_id (FK), serial, token_version, status, checked_in_at, checked_in_by',
    constraints: "UNIQUE(order_id, serial), CHECK ((status = 'checked_in') = (checked_in_at IS NOT NULL))",
    rlsPolicies: 'Holder SELECT through buyer_id; Staff SELECT through is_event_staff(event_id); Mutated strictly via check_in_ticket',
  },
  {
    table: 'check_in_logs',
    columns: 'id (identity PK), scan_id (UUID), ticket_id (FK), event_id (FK), scanner_id (FK), outcome, device_seq, client_ts, scanned_at',
    constraints: 'UNIQUE(scan_id), Append-only table (UPDATE/DELETE revoked)',
    rlsPolicies: 'Organizer and staff SELECT; Client INSERT revoked; Populated solely within security definer check_in_ticket RPC',
  },
];

export const tickeaseDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'System Topology & Event Lifecycle Architecture',
    tabLabel: '01 · System Topology',
    badge: 'Next.js 15 · Supabase RLS · Expo Mobile',
    mermaid: `flowchart LR
  subgraph ORG["Organizer dashboard"]
    O1["Organizer portal<br/>Next.js, authenticated"]
    O2["Event creation form<br/>Zod-validated metadata"]
  end

  subgraph API["API and server actions"]
    A1["createEvent and publishEvent<br/>server actions"]
    A2["Dynamic site compiler<br/>metadata to page model"]
    A3["ISR route /e/[slug]<br/>revalidateTag on publish"]
    A4["Chat proxy<br/>/api/chat"]
    A5["Order and signing service<br/>/api/orders, /api/webhooks/payment"]
    A6["Check-in verify route<br/>/api/checkin/verify"]
  end

  subgraph ATT["Attendee web"]
    C1["Attendee browser"]
    C2["Event landing page<br/>OG tags, agenda, tiers"]
    C3["Embedded AI assistant widget"]
  end

  subgraph DB["Supabase"]
    D1[("PostgreSQL<br/>events, tiers, orders, tickets, logs")]
    D2[("Storage<br/>banners, speaker images")]
    D3["RPC reserve_tickets"]
    D4["RPC check_in_ticket"]
  end

  subgraph MOB["Mobile scanner"]
    M1["Expo check-in app<br/>staff JWT"]
    M2["Local scan queue<br/>SQLite"]
  end

  R1["Rejected: schema validation error"]
  R2["Rejected: tier sold out, 409"]
  R3["Rejected: already used or invalid, 409 or 422"]

  O1 --> O2
  O2 --> A1
  A1 --> D1
  A1 --> D2
  A1 -->|"revalidateTag event:slug"| A3
  D1 -->|"published row"| A2
  A2 --> A3
  A3 --> C2
  C1 --> C2
  C2 --> C3
  C3 -->|"messages"| A4
  A4 -->|"read-only context"| D1
  C2 -->|"checkout"| A5
  A5 --> D3
  D3 --> D1
  M1 -->|"POST token"| A6
  A6 --> D4
  D4 --> D1
  M1 --> M2
  M2 -->|"replay on reconnect"| A6
  A1 -.->|"invalid"| R1
  D3 -.->|"sold + qty > capacity"| R2
  D4 -.->|"rejected"| R3

  classDef client fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef admin fill:#EDE9FE,stroke:#C4B5FD,color:#1E293B
  classDef api fill:#DCFCE7,stroke:#86EFAC,color:#1E293B
  classDef db fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef mobile fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B
  classDef fail fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class C1,C2,C3 client
  class O1,O2 admin
  class A1,A2,A3,A4,A5,A6 api
  class D1,D2,D3,D4 db
  class M1,M2 mobile
  class R1,R2,R3 fail

  linkStyle 20,21,22 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'Organizers submit Zod-validated metadata to createEvent server actions, persisting records in Supabase PostgreSQL under strict RLS policies. publishEvent triggers on-demand ISR revalidation via revalidateTag. The site compiler converts metadata into optimized event pages. Checkout invokes reserve_tickets with idempotency keys, and staff check in attendees via the Expo mobile scanner communicating with check_in_ticket.',
    failureModes:
      'Oversell contention is prevented by row-level locking (SELECT FOR UPDATE) on the tier record, rejecting concurrent excess checkouts with HTTP 409 sold_out. Abandoned reservations are reclaimed by a 1-minute pg_cron cleaner job decrementing sold counts. Draft events are shielded from public access by database RLS.',
    tradeOffs:
      'Incremental Static Regeneration (ISR) with tagged on-demand revalidation provides ultra-low latency CDN edge caching for landing pages, while dynamic tier availability is polled with a short 5-second TTL. Database-level RLS provides absolute security against application bugs compared to middleware-only checks.',
  },
  {
    id: 2,
    title: 'Cryptographic QR Ticket Generation & Atomic Check-in Protocol',
    tabLabel: '02 · QR & Check-in Protocol',
    badge: 'HMAC-SHA256 · Atomic DB Mutex · Expo Gate Scanner',
    mermaid: `sequenceDiagram
  autonumber
  participant B as Attendee browser
  participant S as Next.js server
  participant P as Payment provider
  participant DB as Supabase PostgreSQL
  participant G as Expo gate scanner

  rect rgb(219, 234, 254)
    B->>S: POST /api/orders (tier_id, qty) with Idempotency-Key
  end

  rect rgb(254, 243, 199)
    S->>DB: rpc reserve_tickets(tier_id, qty, key)
    Note over DB: BEGIN, SELECT tier FOR UPDATE, check sold + qty <= capacity, UPDATE sold, INSERT order pending
  end

  alt tier sold out
    rect rgb(255, 228, 230)
      DB-->>S: error sold_out
      S-->>B: 409 sold_out, no payment created
    end
  else reserved
    DB-->>S: order_id, expires_at
    S->>P: create payment intent for order_id
    S-->>B: client secret
    B->>P: confirm payment
    P->>S: POST /api/webhooks/payment (provider signature)
    S->>DB: rpc finalize_order(order_id, payment_ref)
    Note over DB: status pending to paid, INSERT N tickets, COMMIT
  end

  rect rgb(220, 252, 231)
    Note over S: payload = v1 . ticket_id . event_id . tier_id . token_version
    Note over S: sig = HMAC-SHA256(event_key, payload), event_key = HKDF(master, event_id)
    Note over S: token = base64url(payload) . base64url(sig)
    S-->>B: ticket token for QR rendering
  end

  rect rgb(204, 251, 241)
    G->>G: camera decodes QR, generates scan_id
    G->>S: POST /api/checkin/verify (token, scan_id, device_seq) with staff JWT
  end

  rect rgb(220, 252, 231)
    S->>S: parse, recompute HMAC, timingSafeEqual
  end

  alt signature invalid or malformed
    rect rgb(255, 228, 230)
      S->>DB: rpc log_rejection(invalid_signature, scan_id)
      S-->>G: 422 invalid_signature
    end
  else signature valid
    rect rgb(254, 243, 199)
      S->>DB: rpc check_in_ticket(ticket_id, event_id, token_version, scan_id, device_seq)
      Note over DB: BEGIN, dedupe on scan_id, SELECT ticket FOR UPDATE
    end
    alt status is checked_in
      rect rgb(255, 228, 230)
        DB-->>S: already_used, original checked_in_at
        S-->>G: 409 already_used
      end
    else status is issued
      Note over DB: UPDATE status checked_in, checked_in_at now, INSERT log accepted, COMMIT
      DB-->>S: accepted
      S-->>G: 200 admit
    end
  end

  Note over G: Offline: scans queue locally with scan_id, replay on reconnect in device_seq order`,
    interactions:
      'Tickets are cryptographically signed using HMAC-SHA256 with keys derived per-event via HKDF. When scanned at the gate by the Expo mobile app, the server first verifies signature validity with timingSafeEqual before acquiring row locks in check_in_ticket. The transaction commits the status change and writes an append-only audit record in check_in_logs atomically.',
    failureModes:
      'Concurrent scan collision: two staff scanning the same QR simultaneously serialize on the ticket row lock; the first receives accepted while the second receives already_used. Transient network disconnects are de-duplicated by client-generated scan_id UUIDs, returning the original outcome without false double-scan rejections.',
    tradeOffs:
      'Server-side HMAC signing avoids storing device keys on user phones, at the cost of requiring server connectivity for verification. Offline gate operation uses pre-downloaded hash manifests and an idempotent SQLite scan replay queue.',
  },
  {
    id: 3,
    title: 'Embedded AI Attendee Assistant & Telemetry Pipeline',
    tabLabel: '03 · AI Assistant & Telemetry',
    badge: 'SSE Stream · Delimited Grounding · Funnel Analytics',
    mermaid: `flowchart TD
  V["Browser visitor session<br/>anonymous session id"]
  W["Chat widget<br/>React island, SSE client"]
  P1["Chat proxy /api/chat<br/>validate, rate limit"]
  CB["Context builder<br/>scoped by event slug"]
  X1["Agenda and speakers<br/>cached, tag event:slug"]
  X2["Tier availability<br/>live read, 5 s cache"]
  X3["Venue FAQ<br/>organizer metadata"]
  PA["Prompt assembly<br/>system rules plus delimited context"]
  LLM["LLM generation stream"]
  GR["Output guard<br/>link allowlist, length cap"]
  TL["Telemetry logger<br/>/api/telemetry"]
  DBT[("chat_sessions, chat_events")]
  AGG["Funnel analytics<br/>organizer dashboard"]
  CTA["Tier checkout link click"]
  ORD["Checkout and payment webhook<br/>carries chat_session_id"]
  F1["Rejected: rate limit exceeded, 429"]
  F2["Rejected: injection or out of scope"]
  F3["LLM timeout: static FAQ fallback"]

  V --> W
  W -->|"POST message and session token"| P1
  P1 --> CB
  CB --> X1
  CB --> X2
  CB --> X3
  X1 --> PA
  X2 --> PA
  X3 --> PA
  PA --> LLM
  LLM -->|"token stream"| GR
  GR -->|"SSE chunks"| W
  W -->|"widget_open, message_sent, cta_click"| TL
  GR -->|"answered, latency, tokens"| TL
  TL --> DBT
  W --> CTA
  CTA --> ORD
  ORD --> DBT
  DBT --> AGG
  P1 -.->|"over limit"| F1
  P1 -.->|"flagged"| F2
  LLM -.->|"timeout or error"| F3
  F3 -.->|"degraded answer"| W

  classDef client fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef admin fill:#EDE9FE,stroke:#C4B5FD,color:#1E293B
  classDef api fill:#DCFCE7,stroke:#86EFAC,color:#1E293B
  classDef db fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef fail fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class V,W,CTA client
  class AGG admin
  class P1,CB,PA,LLM,GR,TL,ORD api
  class X1,X2,X3,DBT db
  class F1,F2,F3 fail

  linkStyle 19,20,21,22 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'The embedded chat widget connects to /api/chat with an anonymous session cookie. The context builder merges cached agenda/speakers, fresh ticket tier availability (5s TTL), and organizer FAQs into an isolated prompt template. Responses stream over Server-Sent Events (SSE), and conversion funnel events (session -> open -> chat -> checkout -> payment) are logged to Supabase.',
    failureModes:
      'Prompt injection defense: system prompt boundaries delimit reference data, the model has zero write tools, and output links are filtered against a strict domain allowlist. Provider timeouts trigger graceful degradation to a static FAQ response. Rate limits protect against denial-of-wallet abuse.',
    tradeOffs:
      'API proxy architecture adds a network hop but protects secret API keys and enforces grounding constraints. Storing chat sessions in PostgreSQL simplifies funnel attribution queries joining against orders, while raw conversation logs are subject to a 30-day privacy retention lifecycle.',
  },
];
