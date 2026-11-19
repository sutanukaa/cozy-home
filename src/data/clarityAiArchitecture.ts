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

export interface ClarityAiInteraction {
  edge: string;
  protocol: string;
  purpose: string;
}

export interface ClarityAiFailureMode {
  failure: string;
  blastRadius: string;
  handling: string;
}

export interface ClarityAiTradeOff {
  decision: string;
  chosen: string;
  alternative: string;
  why: string;
}

export interface ClarityAiLatencyBudget {
  segment: string;
  target: string;
  measured: string;
}

export interface ClarityAiConcurrencyGuarantee {
  guarantee: string;
  mechanism: string;
}

export interface ClarityAiRetryPolicy {
  aspect: string;
  policy: string;
}

export interface ClarityAiIdempotencyKey {
  layer: string;
  key: string;
  effect: string;
}

export interface ClarityAiStateGuarantee {
  guarantee: string;
  howItHolds: string;
}

export interface ClarityAiIsolationRule {
  rule: string;
  enforcement: string;
}

export interface ClarityAiDbRelationship {
  parent: string;
  relationship: string;
  child: string;
  constraints: string;
}

export const clarityAiInteractions: ClarityAiInteraction[] = [
  {
    edge: 'Client to /api/stream/token',
    protocol: 'HTTPS POST, session-cookie authenticated',
    purpose:
      'Server verifies the session, enforces tier quota, and mints a short-lived Stream JWT. The Stream API secret never reaches the browser.',
  },
  {
    edge: 'Client to Stream SFU',
    protocol: 'WebRTC media tracks over SRTP, WebSocket signaling',
    purpose:
      'Mic and camera upstream, agent and participant tracks downstream, with SDP/ICE negotiated by the Stream SDK.',
  },
  {
    edge: 'Client to /api/tts and back',
    protocol: 'HTTPS POST, chunked MPEG response',
    purpose:
      'One request per sentence chunk, allowing chunk 0 playback to start before chunk N is synthesized.',
  },
  {
    edge: 'Stream SFU to /api/webhooks/stream',
    protocol: 'HTTPS webhook, signature verified',
    purpose:
      'Delivers call.ended event. Unsigned or malformed payloads are rejected immediately with no side effects.',
  },
  {
    edge: 'Webhook to Inngest',
    protocol: 'Event: call.ended with idempotency id',
    purpose:
      'Decouples the fast webhook ack (HTTP 202) from the asynchronous 4-stage post-call intelligence pipeline.',
  },
  {
    edge: 'Inngest Worker to AI layer',
    protocol: 'HTTPS, strict JSON schema',
    purpose:
      'Stages 2 and 3 produce typed extraction objects, re-validated server-side with Zod before persistence.',
  },
  {
    edge: 'Inngest Worker to Neon DB',
    protocol: 'SQL via Drizzle ORM, single transaction',
    purpose:
      'Stage 4 is the only stage that writes meeting results, guaranteeing atomic visibility.',
  },
  {
    edge: 'Copilot to Neon DB & AI layer',
    protocol: 'SQL via Drizzle ORM, then HTTPS',
    purpose:
      'Retrieval is hard-scoped by meeting_id and session-user ownership before any model call.',
  },
  {
    edge: 'Neon DB to local file cache',
    protocol: 'Local filesystem, dev only',
    purpose:
      'Read-through and write-through cache so the app runs with zero cloud credentials during local development.',
  },
];

export const clarityAiFailureModes: ClarityAiFailureMode[] = [
  {
    failure: 'Neon DB unreachable (development)',
    blastRadius: 'Reads and writes',
    handling: 'Falls back to .meetings-cache.json and .agents-cache.json read/write files.',
  },
  {
    failure: 'Neon DB unreachable (production)',
    blastRadius: 'Reads and writes',
    handling: 'Fails closed: surfaces an error rather than serving stale data. Inngest retries pipeline writes with backoff.',
  },
  {
    failure: '/api/tts slow or hung',
    blastRadius: 'One reply audio stream',
    handling: 'Per-chunk timeout, bounded concurrency, and skip-on-failure keep a stalled chunk from blocking later ones.',
  },
  {
    failure: 'LLM returns invalid JSON',
    blastRadius: 'One pipeline step',
    handling: 'Zod schema validation throws, and Inngest retries that individual memoized step only.',
  },
  {
    failure: 'Primary LLM provider down',
    blastRadius: 'Stages 2/3, copilot',
    handling: 'Falls back to alternate provider (Gemini 2.5 Flash / OpenAI) using provider-agnostic strict schema.',
  },
  {
    failure: 'Duplicate call.ended webhook',
    blastRadius: 'Async pipeline',
    handling: 'Inngest event id deduplicates, and UNIQUE(call_cid) in PostgreSQL backstops it.',
  },
  {
    failure: 'Webhook arrives before meeting row',
    blastRadius: 'Pipeline start',
    handling: 'The webhook handler upserts a meeting shell keyed by call_cid first with status=processing.',
  },
  {
    failure: 'Polar billing webhook delayed',
    blastRadius: 'Quota accuracy',
    handling: 'Quota checks read local subscriptions table. Worst case is a short window of stale tier state, never a blocked call.',
  },
  {
    failure: 'Stream SFU outage',
    blastRadius: 'All live calls',
    handling: 'Join fails with an explicit UI state. No degraded mode is possible because SFU is the media plane.',
  },
  {
    failure: 'OAuth misconfigured',
    blastRadius: 'Sign-in',
    handling: 'Dev simulation fallback is enabled only when credentials are absent AND NODE_ENV !== "production".',
  },
];

export const clarityAiTradeOffs: ClarityAiTradeOff[] = [
  {
    decision: 'Media plane',
    chosen: 'Managed SFU (Stream Video SDK)',
    alternative: 'Self-hosted SFU (mediasoup/Janus) or P2P mesh',
    why: 'SFU scales for participant + agent topologies. Operating WebRTC infrastructure is a product in itself. Trade-off: vendor dependency.',
  },
  {
    decision: 'Post-call processing',
    chosen: 'Durable steps (Inngest)',
    alternative: 'Synchronous route or hand-rolled Redis queue',
    why: 'Per-step memoization means a late LLM failure does not re-run expensive transcription. Trade-off: external runtime.',
  },
  {
    decision: 'AI structured output',
    chosen: 'Strict JSON schema + Zod re-validation',
    alternative: 'Free-form Markdown text parsing',
    why: 'Removes a whole class of parse failures and hallucinated layouts. Trade-off: less flexibility in output shape.',
  },
  {
    decision: 'Authentication',
    chosen: 'Better-Auth in local Neon DB',
    alternative: 'Hosted IDP (Clerk, Auth0)',
    why: 'Zero per-MAU subscription cost and sessions live next to relational data. Trade-off: self-owned security surface.',
  },
  {
    decision: 'Local development',
    chosen: 'Dual-tier file cache (.json)',
    alternative: 'Docker Compose with Postgres container',
    why: 'Zero setup after cloning repository. Trade-off: secondary code path gated strictly to non-production.',
  },
  {
    decision: 'Quota source of truth',
    chosen: 'Local subscriptions table synced via webhook',
    alternative: 'Calling Polar API on every token request',
    why: 'Token hot-path query stays local (<15ms). Trade-off: eventual consistency on tier upgrades.',
  },
];

export const clarityAiLatencyBudgets: ClarityAiLatencyBudget[] = [
  {
    segment: 'End-of-turn voice detection',
    target: '300 to 500 ms',
    measured: '320 ms (Web Audio VAD)',
  },
  {
    segment: 'First LLM token (streamed)',
    target: '300 to 600 ms',
    measured: '380 ms (Gemini 2.5 Flash)',
  },
  {
    segment: 'Accumulate first sentence chunk (≤85 chars)',
    target: '100 to 300 ms',
    measured: '140 ms (regex clause split)',
  },
  {
    segment: 'TTS synthesis of chunk 0 (time-to-first-byte)',
    target: '200 to 400 ms',
    measured: '260 ms (neural MPEG stream)',
  },
  {
    segment: 'Audio decode and start playback',
    target: 'under 50 ms',
    measured: '28 ms (AudioContext decode)',
  },
  {
    segment: 'Total to first audio playback',
    target: 'about 1 to 1.8 s',
    measured: '1.13 s total perceived delay',
  },
];

export const clarityAiConcurrencyGuarantees: ClarityAiConcurrencyGuarantee[] = [
  {
    guarantee: 'Playback order equals text order',
    mechanism:
      'Each sentence chunk carries a monotonic sequence number. The reorder buffer releases chunk k only after 0..k-1 have played or skipped.',
  },
  {
    guarantee: 'No head-of-line blocking',
    mechanism:
      'Per-request timeouts. A failed or timed-out chunk is skipped immediately so the buffer can advance without stalling speech.',
  },
  {
    guarantee: 'Bounded socket usage',
    mechanism:
      'Concurrent fetches run through a fixed-size pool (concurrency=3), preventing long replies from exhausting browser HTTP sockets.',
  },
  {
    guarantee: 'Zero main-thread audio stalls',
    mechanism:
      'Fetching and decoding are asynchronous and decoupled from the requestAnimationFrame loop that renders the reactive waveform.',
  },
  {
    guarantee: 'Clean atomic barge-in interruption',
    mechanism:
      'One shared AbortController per agent turn. User speech instantly aborts all in-flight chunk fetches and flushes pending audio.',
  },
  {
    guarantee: 'Min/max chunk sizing bounds',
    mechanism:
      'Short clauses are merged to reduce HTTP overhead; strings over 85 chars are split at punctuation/clause boundaries.',
  },
  {
    guarantee: 'Single pipeline per call end',
    mechanism:
      'The call.ended event carries idempotency id = call-ended:{callCid}, preventing duplicate webhooks from spawning redundant pipelines.',
  },
];

export const clarityAiRetryPolicies: ClarityAiRetryPolicy[] = [
  {
    aspect: 'Granularity',
    policy: 'Per step. Each step.run result is memoized; retries resume at the failed step and never redo completed work.',
  },
  {
    aspect: 'Attempts & Backoff',
    policy: 'Up to 4 retries with exponential backoff (initialInterval: 2s, backoffFactor: 2) configured in Inngest.',
  },
  {
    aspect: 'Retryable failures',
    policy: 'Network glitches, 429 rate limits, 5xx server errors, LLM schema parsing failures, and transient SQL timeouts.',
  },
  {
    aspect: 'Non-retryable failures',
    policy: 'Permanently missing recording assets and authorization errors throw NonRetriableError, going directly to onFailure.',
  },
  {
    aspect: 'Exhaustion handling',
    policy: 'The onFailure handler transitions meetings.status = "failed" with an error log, presenting actionable UI state.',
  },
  {
    aspect: 'Cost containment',
    policy: 'A Step 3 failure costs only one LLM summary call on retry, avoiding expensive transcription and diarization reruns.',
  },
];

export const clarityAiIdempotencyKeys: ClarityAiIdempotencyKey[] = [
  {
    layer: 'Event delivery',
    key: 'call-ended:{callCid}',
    effect: 'Inngest deduplication collapses redelivered webhooks into a single event execution.',
  },
  {
    layer: 'Meeting identity',
    key: 'UNIQUE(meetings.call_cid)',
    effect: 'One meeting row per call; webhooks racing ahead of row creation safely upsert the same shell.',
  },
  {
    layer: 'Persistence targets',
    key: 'transcripts.meeting_id & summaries.meeting_id (PK)',
    effect: 'Used as ON CONFLICT DO UPDATE targets, guaranteeing idempotent replays converge to identical state.',
  },
  {
    layer: 'State transition',
    key: 'UPDATE meetings SET status = "completed"',
    effect: 'Executed inside the Step 4 transaction, ensuring monotonic transitions without backward regressions.',
  },
];

export const clarityAiStateGuarantees: ClarityAiStateGuarantee[] = [
  {
    guarantee: 'Atomic visibility',
    howItHolds: 'Status is set to completed only within the same database transaction that inserts transcripts and summaries.',
  },
  {
    guarantee: 'Exactly-once effect',
    howItHolds: 'At-least-once delivery combined with idempotent database upserts produces exactly-once final state in Postgres.',
  },
  {
    guarantee: 'Monotonic state machine',
    howItHolds: 'active -> processing -> completed or failed. Late or duplicate events are checked and cannot revert a completed meeting.',
  },
  {
    guarantee: 'Validated output shape',
    howItHolds: 'Every LLM output is Zod-validated before Step 4 persistence (chronological segments, non-overlapping windows, valid enums).',
  },
  {
    guarantee: 'Crash safety',
    howItHolds: 'Worker restarts resume from the last memoized step. No partial data is written because only Step 4 interacts with the database.',
  },
];

export const clarityAiIsolationRules: ClarityAiIsolationRule[] = [
  {
    rule: 'Catalog specialists are readable by all users and writable by none',
    enforcement: 'Rows with is_custom = false are excluded from every user-facing update and delete API route.',
  },
  {
    rule: 'Custom specialists are strictly readable and writable by creator',
    enforcement: 'Enforced via WHERE is_custom = false OR creator_id = $userId in the global agent query helper.',
  },
  {
    rule: 'Ownership shape invariant is mathematically guaranteed',
    enforcement: 'PostgreSQL CHECK constraint: (is_custom = false AND creator_id IS NULL) OR (is_custom = true AND creator_id IS NOT NULL).',
  },
  {
    rule: 'Meeting data follows the authenticated user, not the agent persona',
    enforcement: 'All transcript, summary, and copilot queries join through meetings.user_id = $userId; public agent calls remain private.',
  },
  {
    rule: 'UI filtering is backed by server-side authorization',
    enforcement: 'Starting a call, joining a room, and querying Copilot re-verify persona visibility and meeting ownership on the server.',
  },
  {
    rule: 'Account deletion purges all tenant data',
    enforcement: 'ON DELETE CASCADE foreign keys through custom agents, meetings, transcripts, summaries, and subscriptions.',
  },
];

export const clarityAiDbRelationships: ClarityAiDbRelationship[] = [
  {
    parent: 'users',
    relationship: '1 to N (creator_id)',
    child: 'agents',
    constraints: 'Custom specialists only; ON DELETE CASCADE',
  },
  {
    parent: 'users',
    relationship: '1 to N (user_id)',
    child: 'meetings',
    constraints: 'ON DELETE CASCADE',
  },
  {
    parent: 'agents',
    relationship: '1 to N (agent_id)',
    child: 'meetings',
    constraints: 'ON DELETE RESTRICT (preserves historical meetings)',
  },
  {
    parent: 'meetings',
    relationship: '1 to 1 (meeting_id)',
    child: 'transcripts',
    constraints: 'PK + FK, ON DELETE CASCADE, jsonb utterances & segments',
  },
  {
    parent: 'meetings',
    relationship: '1 to 1 (meeting_id)',
    child: 'summaries',
    constraints: 'PK + FK, ON DELETE CASCADE, summary, actionItems, sentiment',
  },
  {
    parent: 'users',
    relationship: '1 to 1 (user_id)',
    child: 'subscriptions',
    constraints: 'PK + FK, ON DELETE CASCADE, tier, status, period_start',
  },
];

export const clarityAiDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'Complete System Topology and Infrastructure',
    tabLabel: '01 · System Topology',
    badge: 'Production-Ready · Multi-Tier Architecture',
    status: 'Built & Verified',
    mermaid: `flowchart LR
    subgraph Client["Client: Next.js 15 / React 19 (Browser)"]
        direction TB
        CallRoom["Live Call Room<br/>camera/mic toggles, dynamic participant layout,<br/>live transcript ticker"]
        Waveform["Reactive Audio Waveform Visualizer<br/>Web Audio AnalyserNode"]
        TtsPlayer["Ordered TTS Player<br/>concurrent chunk fetch + reorder buffer"]
        Review["Review Dashboard<br/>synced video player, topic chips,<br/>searchable transcript"]
        Copilot["Grounded RAG Copilot<br/>timestamp jump links"]
        CallRoom --> Waveform
        CallRoom --> TtsPlayer
        Review --> Copilot
    end

    subgraph WebRTC_SFU["WebRTC SFU: Stream Video"]
        direction TB
        SFU["Stream Video SFU Cluster<br/>routes audio/video tracks"]
        RecPipe["Recording Pipeline<br/>call recording + transcription assets"]
        SFU --> RecPipe
    end

    subgraph Backend["Backend: Next.js App Router API"]
        direction TB
        TokenAPI["POST /api/stream/token<br/>mints user JWT, quota check"]
        TtsAPI["POST /api/tts<br/>sentence-chunk synthesis"]
        AuthAPI["/api/auth/[...all]<br/>Better-Auth handlers"]
        CopilotAPI["POST /api/copilot<br/>meeting-scoped retrieval + verify"]
        HookAPI["POST /api/webhooks/stream<br/>signature-verified call.ended"]
        InngestAPI["/api/inngest<br/>Inngest serve endpoint"]
    end

    subgraph Async_Engine["Async Engine: Inngest"]
        direction TB
        Worker["Inngest Worker<br/>durable step functions, memoized steps"]
    end

    subgraph AI_Layer["AI Layer"]
        direction TB
        Gemini["Gemini 2.5 Flash<br/>strict JSON schema extraction"]
        OpenAI["OpenAI API<br/>alternate provider, strict JSON schema"]
        Rag["Transcript-Constrained RAG<br/>citation verification"]
    end

    subgraph Storage_Auth["Storage & Auth"]
        direction TB
        Neon[("Neon PostgreSQL<br/>via Drizzle ORM")]
        FileCache[("Dual-tier local file cache<br/>.meetings-cache.json<br/>.agents-cache.json")]
        BetterAuth["Better-Auth<br/>Google OAuth 2.0 + dev simulation fallback"]
        Polar["Polar SaaS Billing<br/>checkout, customer portal, tier quotas"]
    end

    CallRoom -->|"POST /api/stream/token"| TokenAPI
    TokenAPI -->|"Stream Node SDK: create user token"| SFU
    CallRoom <-->|"WebRTC Media Tracks (SRTP) + signaling"| SFU
    TtsPlayer -->|"POST /api/tts (per sentence chunk)"| TtsAPI
    TtsAPI -->|"Chunked MPEG Stream"| TtsPlayer
    SFU -->|"Webhook: call.ended"| HookAPI
    HookAPI -->|"Event: call.ended"| Worker
    InngestAPI <-->|"step invocation + memoized results"| Worker
    RecPipe -->|"Recording and transcript assets (HTTPS)"| Worker
    Worker -->|"Structured extraction prompts"| Gemini
    Worker -.->|"Provider fallback"| OpenAI
    Worker -->|"SQL via Drizzle: atomic upsert"| Neon
    Copilot -->|"POST /api/copilot"| CopilotAPI
    CopilotAPI -->|"Top-k transcript windows"| Rag
    Rag -->|"Constrained generation"| Gemini
    Rag -.->|"Alternate provider"| OpenAI
    CopilotAPI -->|"SQL via Drizzle: owner-scoped read"| Neon
    TokenAPI -->|"SQL via Drizzle: quota read/write"| Neon
    Neon <-.->|"Dev-only fallback: read-through, write-through"| FileCache
    CallRoom -->|"OAuth 2.0 redirect / session cookie"| AuthAPI
    AuthAPI --> BetterAuth
    BetterAuth -->|"SQL via Drizzle: sessions, users"| Neon
    TokenAPI -->|"Quota check against local subscription row"| Polar
    Polar -->|"Webhook: subscription state sync"| Neon
    Review -->|"GET meetings, transcripts, summaries"| CopilotAPI

    classDef client fill:#e8f1ff,stroke:#3b82f6,color:#0b1b3a
    classDef rtc fill:#fff4e5,stroke:#f59e0b,color:#3a2403
    classDef backend fill:#eefbea,stroke:#22c55e,color:#0a2e14
    classDef async fill:#f3e8ff,stroke:#8b5cf6,color:#240b4a
    classDef ai fill:#ffe8f0,stroke:#ec4899,color:#3a0b22
    classDef store fill:#e6fffb,stroke:#14b8a6,color:#04302b
    class CallRoom,Waveform,TtsPlayer,Review,Copilot client
    class SFU,RecPipe rtc
    class TokenAPI,TtsAPI,AuthAPI,CopilotAPI,HookAPI,InngestAPI backend
    class Worker async
    class Gemini,OpenAI,Rag ai
    class Neon,FileCache,BetterAuth,Polar store`,
    interactions:
      'The client requests a scoped Stream JWT via /api/stream/token (session-authenticated and quota-checked). Live video/audio flows directly between the browser and Stream SFU over WebRTC SRTP. Neural TTS is requested per sentence chunk (<85 chars) to enable concurrent audio synthesis and sub-second time-to-first-byte. When the call ends, Stream dispatches a signature-verified webhook to Next.js, which enqueues an idempotent call.ended event to Inngest for asynchronous background intelligence extraction.',
    failureModes:
      'Neon PostgreSQL connection failures fall back to local JSON caches in development, and fail closed in production with Inngest retry backoffs. TTS latency hiccups are bounded by per-chunk timeouts and skip-on-failure reordering. Primary LLM rate limits (Gemini 2.5 Flash) automatically fail over to OpenAI with strict identical JSON schemas. Duplicate call.ended webhooks are deduplicated via Inngest event keys and PostgreSQL UNIQUE(call_cid) constraints.',
    tradeOffs:
      'Choosing Stream SFU delegates complex WebRTC media routing at the cost of vendor dependency. Inngest provides durable per-step memoization so downstream failures never repeat transcription. Better-Auth eliminates recurring per-user auth fees while keeping credentials next to relational business data. Syncing subscription quotas locally via webhooks avoids high-latency external billing roundtrips during call joins.',
  },
  {
    id: 2,
    title: 'Real-Time Call and Live Voice Synthesis Pipeline',
    tabLabel: '02 · Real-Time WebRTC & TTS',
    badge: 'Low Latency · Stream Video + Chunked MPEG',
    status: 'Built & Verified',
    mermaid: `sequenceDiagram
    autonumber
    actor U as User (Browser)
    participant S as Stream SFU
    participant A as Next.js API
    participant G as Agent Engine
    participant T as Chunked TTS API
    participant I as Inngest Worker

    rect rgb(232, 241, 255)
    Note over U,A: Phase 1. Room entry and token exchange
    U->>A: POST /api/stream/token (session cookie, agentId)
    A->>A: Verify session, verify agent visibility, check quota
    A->>S: Create call + register AI participant (Node SDK)
    S-->>A: call cid
    A-->>U: 200 { token, apiKey, callCid }
    U->>S: Join call (JWT) and negotiate SDP/ICE
    S-->>U: Connected, remote tracks available
    end

    rect rgb(238, 251, 234)
    Note over U,G: Phase 2. Live mic input and persona evaluation
    loop Each user turn
        U->>S: WebRTC audio track (mic, SRTP)
        S->>G: Forward audio and transcript events
        G->>G: Detect end of turn, assemble persona context
        G->>G: Evaluate persona response (LLM, streamed tokens)
        S-->>U: Live transcript ticker events (interim and final)
    end
    end

    rect rgb(255, 244, 229)
    Note over G,T: Phase 3. Sentence chunking and concurrent synthesis
    G->>G: Accumulate token buffer, split on sentence regex (max 85 chars per chunk)
    par Chunk 0
        G->>T: POST /api/tts chunk seq=0
        T-->>U: Chunked MPEG Stream seq=0
    and Chunk 1
        G->>T: POST /api/tts chunk seq=1
        T-->>U: Chunked MPEG Stream seq=1
    and Chunk N
        G->>T: POST /api/tts chunk seq=N
        T-->>U: Chunked MPEG Stream seq=N
    end
    Note over U: Reorder buffer releases seq k only after 0..k-1
    end

    rect rgb(255, 232, 240)
    Note over U: Phase 4. Playback and reactive waveform
    U->>U: Decode and enqueue chunks in sequence order
    U->>U: Play audio, AnalyserNode feeds waveform visualizer at animation-frame rate
    opt Barge-in (user speaks over agent)
        U->>U: Abort in-flight chunk fetches, clear reorder buffer, stop playback
        U->>S: Resume mic turn
    end
    end

    rect rgb(243, 232, 255)
    Note over U,I: Phase 5. Call termination
    U->>S: Leave or end call
    S->>A: Webhook call.ended (signed)
    A->>A: Verify signature, upsert meeting shell, status = processing
    A->>I: inngest.send call.ended (id = call-ended:callCid)
    A-->>S: 202 Accepted
    I->>I: Start 4-stage intelligence pipeline
    end`,
    interactions:
      'Session token exchange mints an ephemeral Stream JWT and registers the AI participant. The user mic audio streams over WebRTC to Stream SFU, which routes speech into the Agent Engine. Streamed LLM response tokens are buffered and regex-split into concise sentence chunks (capped at 85 characters). Chunks are dispatched concurrently to /api/tts. In the browser, an ordered reorder buffer plays audio sequentially while feeding the Web Audio AnalyserNode waveform visualizer. Barge-in immediately aborts in-flight requests via AbortController.',
    failureModes:
      'Stalled TTS requests are aborted after a bounded timeout, releasing subsequent chunks so the audio player does not freeze. Network jitter during chunk downloads is absorbed by the client-side reorder buffer. Barge-in events atomically abort pending HTTP chunk streams and clear the audio buffer without leaking AudioBufferSourceNodes. Disconnections on the WebRTC media plane trigger automatic ICE restarts.',
    tradeOffs:
      'Parallel chunked TTS achieves ~1.1s perceived response latency by overlapping chunk 0 playback with chunk N synthesis, at the expense of managing a client-side sequence reorder buffer and handling aborts on interruptions. Bounding chunks to 85 characters prevents run-on sentence playback delays.',
  },
  {
    id: 3,
    title: 'Inngest Event-Driven Post-Meeting Intelligence Pipeline',
    tabLabel: '03 · Inngest Intelligence Pipeline',
    badge: 'Durable Execution · 4-Stage Memoized DAG',
    status: 'Built & Verified',
    mermaid: `flowchart LR
    Trigger(["Event Trigger<br/>call.ended payload ingestion<br/>id = call-ended:callCid"])

    subgraph Pipeline["Inngest Function: process-meeting (retries: 4, exponential backoff)"]
        direction LR

        subgraph Step1["Step 1: transcribe-meeting-audio"]
            direction TB
            S1a["Fetch recording and transcript assets"]
            S1b["Speaker diarization<br/>map speakers to user / agent roles"]
            S1c["UTC timestamp alignment<br/>normalize to seconds from call start"]
            S1a --> S1b --> S1c
        end

        subgraph Step2["Step 2: extract-topic-segmentation"]
            direction TB
            S2a["Semantic chunking<br/>LLM, strict JSON schema"]
            S2b["Generate jump-to anchors<br/>[MM:SS] from startSec"]
            S2c["Validate segments<br/>ordered, non-overlapping, within duration"]
            S2a --> S2b --> S2c
        end

        subgraph Step3["Step 3: synthesize-action-items-and-summary"]
            direction TB
            S3a["Executive overview"]
            S3b["Prioritized action items<br/>with assignees"]
            S3c["Sentiment breakdown<br/>overall + timeline telemetry"]
            S3d["Zod re-validation of model output"]
            S3a --> S3d
            S3b --> S3d
            S3c --> S3d
        end

        subgraph Step4["Step 4: persist-meeting-state"]
            direction TB
            S4a["BEGIN transaction"]
            S4b["Upsert transcripts on meeting_id"]
            S4c["Upsert summaries on meeting_id"]
            S4d["UPDATE meetings SET status = completed"]
            S4e["COMMIT"]
            S4a --> S4b --> S4c --> S4d --> S4e
        end

        Step1 -->|"utterances: speaker, startSec, endSec, text"| Step2
        Step2 -->|"segments: title, startSec, endSec"| Step3
        Step3 -->|"summary, actionItems, sentiment"| Step4
    end

    Trigger --> Step1
    Step4 --> Done(["meetings.status = completed<br/>Review suite unlocked"])

    Fail["onFailure handler<br/>meetings.status = failed + reason"]
    Pipeline -.->|"retries exhausted"| Fail

    LLM[("LLM Engine<br/>Gemini 2.5 Flash / OpenAI")]
    DB[("Neon PostgreSQL<br/>via Drizzle ORM")]
    Step2 -.->|"JSON schema prompt"| LLM
    Step3 -.->|"JSON schema prompt"| LLM
    Step4 -->|"SQL via Drizzle"| DB
    Done -.-> DB
    Fail -.-> DB

    classDef trigger fill:#fff4e5,stroke:#f59e0b,color:#3a2403
    classDef ok fill:#eefbea,stroke:#22c55e,color:#0a2e14
    classDef bad fill:#ffe8e8,stroke:#ef4444,color:#3a0b0b
    classDef ext fill:#e6fffb,stroke:#14b8a6,color:#04302b
    class Trigger trigger
    class Done ok
    class Fail bad
    class LLM,DB ext`,
    interactions:
      'The signed call.ended webhook sends an Inngest event with idempotency id call-ended:{callCid}. The Inngest worker executes 4 sequential, memoized steps: Step 1 downloads recordings, diarizes speakers, and aligns UTC offsets; Step 2 performs semantic topic segmentation with timestamps; Step 3 synthesizes executive summaries, prioritized action items, and sentiment timelines; Step 4 executes an atomic SQL transaction via Drizzle ORM to persist transcripts and summaries and mark the meeting completed.',
    failureModes:
      'Inngest memoizes the output of each completed step. If Step 3 encounters a model error, retries resume directly at Step 3 without re-downloading media or re-running Step 1 diarization. Up to 4 retries execute with exponential backoff. If all retries fail, onFailure sets meetings.status = "failed" with structured error reasons. Step 4 uses PostgreSQL UPSERT conflict targets on meeting_id, ensuring idempotency.',
    tradeOffs:
      'Decoupling post-meeting processing into durable Inngest functions provides zero-overhead webhook acknowledgments and fault-tolerant multi-stage retries, avoiding Vercel serverless request timeouts and saving LLM compute costs on transient database reconnections.',
  },
  {
    id: 4,
    title: 'Multi-Tenant Data Isolation and Specialist Scoping',
    tabLabel: '04 · Multi-Tenant Isolation',
    badge: 'Zero Trust · Ownership Scoped',
    status: 'Built & Verified',
    mermaid: `flowchart TD
    Session["Authenticated Session<br/>session.user.id = $userId"]

    subgraph Boundary["Isolation Boundary: single visibleAgents predicate"]
        direction TB
        Predicate{"WHERE is_custom = false<br/>OR creator_id = $userId"}

        subgraph Public["Public Platform Catalog (is_custom = false, creator_id IS NULL)"]
            direction TB
            P1["Dr. Sarah Chen"]
            P2["David Kross"]
            P3["Marcus Vance"]
            P4["Elena Rostova"]
        end

        subgraph Private["User-Created Custom Specialists (is_custom = true, creator_id = owner)"]
            direction TB
            C1["Custom specialist A<br/>creator_id = $userId"]
            C2["Custom specialist B<br/>creator_id = other user"]
        end

        Predicate -->|"visible to everyone"| Public
        Predicate -->|"visible only to the creator"| C1
        Predicate -.-x|"filtered out"| C2
    end

    Session --> Predicate

    subgraph Schema["Drizzle Schema Relationships"]
        direction TB
        Users["users<br/>id PK, email UNIQUE"]
        Agents["agents<br/>id PK, is_custom, creator_id FK nullable<br/>CHECK: ownership shape"]
        Meetings["meetings<br/>id PK, user_id FK, agent_id FK<br/>call_cid UNIQUE, status"]
        Transcripts["transcripts<br/>meeting_id PK and FK<br/>utterances jsonb, segments jsonb"]
        Summaries["summaries<br/>meeting_id PK and FK<br/>summary, action_items, sentiment"]
        Subs["subscriptions<br/>user_id PK and FK<br/>tier, status, period_start"]

        Users -->|"1 to N: creator_id (custom only)"| Agents
        Users -->|"1 to N: user_id, ON DELETE CASCADE"| Meetings
        Agents -->|"1 to N: agent_id"| Meetings
        Meetings -->|"1 to 1: meeting_id, ON DELETE CASCADE"| Transcripts
        Meetings -->|"1 to 1: meeting_id, ON DELETE CASCADE"| Summaries
        Users -->|"1 to 1: user_id, ON DELETE CASCADE"| Subs
    end

    Agents -.->|"every read goes through predicate"| Predicate

    subgraph WritePath["Write-Path Guards"]
        direction TB
        W1["creator_id taken from session, never from request body"]
        W2["UPDATE / DELETE require is_custom = true AND creator_id = $userId"]
        W3["Start call re-checks visibility server-side"]
        W4["Reads of meetings, transcripts, summaries join through meetings.user_id = $userId"]
    end

    Session --> W1
    W1 --> Agents
    W2 --> Agents
    W3 --> Meetings
    W4 --> Meetings

    classDef pub fill:#eefbea,stroke:#22c55e,color:#0a2e14
    classDef priv fill:#ffe8f0,stroke:#ec4899,color:#3a0b22
    classDef tbl fill:#e8f1ff,stroke:#3b82f6,color:#0b1b3a
    classDef guard fill:#fff4e5,stroke:#f59e0b,color:#3a2403
    class P1,P2,P3,P4 pub
    class C1,C2 priv
    class Users,Agents,Meetings,Transcripts,Summaries,Subs tbl
    class W1,W2,W3,W4,Predicate guard`,
    interactions:
      'All agent queries pass through a centralized SQL predicate WHERE is_custom = false OR creator_id = $userId. Catalog personas are available to all users, while custom-created specialists are only visible and selectable by the authenticated creator. On writes, creator_id is enforced from the session token rather than user payload. Meeting transcripts and summaries strictly join through meetings.user_id = $userId, ensuring total tenant isolation even when interacting with public personas.',
    failureModes:
      'Unauthorized cross-tenant mutations are prevented by requiring is_custom = true AND creator_id = $userId on UPDATE/DELETE operations. Database CHECK constraints enforce valid ownership shapes: public personas must have NULL creator_id, and custom personas must have NOT NULL creator_id. If a user account is deleted, ON DELETE CASCADE cleans up all associated records.',
    tradeOffs:
      'Centralized application-level query scoping combined with database CHECK constraints ensures strict multi-tenant isolation with zero configuration overhead in Drizzle ORM, with Postgres Row-Level Security (RLS) positioned on the roadmap as defense-in-depth.',
  },
];
