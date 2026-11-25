export interface Project {
  slug: string;
  title: string;
  tagline: string;
  overview: string;
  architecture: string[];
  technicalHighlights: string[];
  keyFeatures: string[];
  tags: string[];
  links: { live?: string; code?: string };
  status: 'Production' | 'Shipped' | 'Active' | 'Currently Building';
}

export const projects: Project[] = [
  {
    slug: 'clarity-ai',
    title: 'ClarityAI',
    tagline: 'Real-time WebRTC video calls with specialized AI personas, low-latency chunked neural TTS, and event-driven Inngest post-meeting intelligence suite.',
    overview:
      'A full-stack, real-time AI video interaction and automated meeting intelligence SaaS. Conduct live WebRTC video and voice conversations with specialized AI agents powered by Stream Video SFU, sub-second sentence-chunked neural TTS playback with zero-latency barge-in interruption, and real-time Web Audio API waveform visualizers. Post-call workflows are orchestrated via an event-driven Inngest pipeline featuring durable step-function retries, speaker diarization, Gemini 2.5 Flash topic segmentation, action item extraction, and meeting-scoped grounded Copilot RAG with millisecond timestamp jump links.',
    architecture: [
      'WebRTC Media Plane: Stream Video SFU cluster routing low-latency audio/video tracks over SRTP with Web Audio AnalyserNode waveform telemetry.',
      'Chunked Neural Voice Synthesis: Concurrent sentence-split TTS synthesis (<85 chars per chunk) with client-side reorder buffer and atomic barge-in abort controllers.',
      'Durable Inngest Intelligence Pipeline: 4-stage memoized workflow executing transcription, speaker diarization, topic segmentation, and atomic Drizzle ORM transaction persistence.',
      'Multi-Tenant Scoping & Custom Specialists: Unified visibility predicate ensuring user-created agents remain strictly private while public catalog specialists are universally accessible.',
      'Grounded Meeting Copilot: Meeting-scoped RAG retrieval with timestamped citation jump links and strict server-side JSON schema validation.',
    ],
    technicalHighlights: [
      'Engineered sub-second perceived voice latency (1.0-1.8s time-to-first-audio) by parallelizing TTS chunk generation ahead of playback.',
      'Durable 4-stage post-meeting pipeline with per-step memoization, ensuring zero re-transcription cost on downstream LLM retries.',
      'Atomic database persistence via Drizzle ORM and Neon PostgreSQL, guaranteeing meetings never enter completed status without full transcripts.',
      'Strict multi-tenant boundary: custom AI specialists and private meeting transcripts are cryptographically and query-scoped to the authenticated session owner.',
    ],
    keyFeatures: [
      'Real-time WebRTC audio/video calls with interactive AI specialists',
      'Sentence-chunked neural TTS streaming with reactive Web Audio waveform',
      'Atomic user barge-in interruption with zero-delay buffer flushing',
      'Event-driven Inngest post-call pipeline with 4-stage memoized retry DAG',
      'Automated speaker diarization, topic segmentation, and action item extraction',
      'Meeting-scoped grounded Copilot with direct timestamp jump links',
      'Better-Auth session management with Google OAuth 2.0 and Polar SaaS billing',
    ],
    tags: [
      'Next.js 15',
      'React 19',
      'Stream Video',
      'WebRTC',
      'Inngest',
      'Google Gemini',
      'OpenAI',
      'Drizzle ORM',
      'Neon PostgreSQL',
      'Better-Auth',
      'TypeScript',
      'Tailwind CSS',
    ],
    links: {
      live: 'https://preflight-gold.vercel.app/',
      code: 'https://github.com/sutanukaa/preflight',
    },
    status: 'Production',
  },
  {
    slug: 'syntactiq',
    title: 'Syntactiq Code Modernization',
    tagline: 'Autonomous multi-agent platform for AST-driven legacy codebase refactoring, sandbox verification, and automated PRs.',
    overview:
      'An autonomous multi-agent platform in active development designed to ingest legacy source repositories, analyze dependency graphs via Tree-sitter and NetworkX, modernize language idioms to Python 3.12+, synthesize unit tests in ephemeral Docker sandboxes, and open verified GitHub pull requests. Core LangGraph StateGraph workflows, dual-tier Docker sandboxing, and bounded self-healing retry loops are fully implemented and verified with 45 automated unit tests; distributed Celery clusters and GitHub Git Data API egress are actively being completed. Winner of the 100Agents Global Hackathon (1st out of 650 teams worldwide).',
    architecture: [
      'Compiled LangGraph StateGraph: Typed MigrationState coordinating Architect, Coder, Tester, Self-Heal Retry, and File Completion nodes with conditional routing.',
      'Dual-Tier Secure Sandboxing: Ephemeral Docker container (python:3.11-slim, --network none, 512MB RAM cap) with automated zero-delay subprocess fallback.',
      'AST Dependency Decomposition: Concrete Syntax Tree parsing via Tree-sitter and NetworkX DAG cycle-breaking (Tarjan SCC + deferred runtime imports).',
      'Coder Agent & Bounded Self-Healing: Gemini 1.5 Flash REST client with ast.parse validation and bounded 3-retry diagnostic recovery.',
      'In Progress: Automated GitHub Fork-and-PR egress pipeline (Git Data API atomic commits) and real-time distributed Celery + Redis Pub/Sub cluster.',
    ],
    technicalHighlights: [
      'Currently in active development with 45 automated unit tests verifying StateGraph routing, Docker container isolation, and self-healing recovery.',
      'Dual-tier execution engine: hardened Docker container sandbox with seamless subprocess fallback on systems without Docker.',
      'Bounded self-healing retry loop: captures compiler syntax errors and pytest assertion traces, injecting them into the next coder prompt.',
      'Winner of 100Agents Global Hackathon (Ranked 1st among 650 international teams worldwide).',
    ],
    keyFeatures: [
      'Compiled LangGraph StateGraph with conditional self-healing edges',
      'Dual-tier Docker and subprocess sandbox execution runner',
      'Tree-sitter Concrete Syntax Tree (CST) and import extraction',
      'NetworkX DAG dependency analysis with Tarjan cycle breaking',
      'Bounded 3-attempt self-healing retry loop with error feedback',
      'Next.js 14 App Router, Zustand, and React Flow DAG telemetry',
    ],
    tags: ['Python 3.12', 'LangGraph', 'Docker', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Tree-sitter', 'Next.js 14', 'Gemini API'],
    links: {
      code: 'https://github.com/sutanukaa',
    },
    status: 'Currently Building',
  },
  {
    slug: 'rag-document-qa',
    title: 'RAG Document Q&A Engine',
    tagline: 'End-to-end Retrieval-Augmented Generation pipeline built from scratch without LLM orchestration frameworks.',
    overview:
      'A production-oriented Retrieval-Augmented Generation system built in plain Python and FastAPI, avoiding heavy abstraction frameworks like LangChain. Ingests heterogeneous PDF documents, generates semantic embeddings via the Gemini API, and performs vector similarity search in ChromaDB. Synthesizes answers grounded strictly in retrieved context chunks with verbatim source citations.',
    architecture: [
      'Document Ingestion: Multipart streaming with pypdf, text normalization, and recursive character chunking (1,000 characters with 200-character overlap).',
      'Vector Store & Indexing: ChromaDB vector indexing with cosine similarity matching against Gemini text-embedding-004 vectors.',
      'Context Synthesis: Top-k similarity retrieval, context injection, and hallucination guardrails requiring exact source document citations.',
      'Synthetic CI Evaluation: Automated evaluation harness (eval.py) that samples corpus chunks, generates test queries, and scores keyword recall and citation accuracy to gate CI pipelines.',
    ],
    technicalHighlights: [
      'Zero LangChain dependency: Clean, explicit ~150-line core pipeline for minimal latency and full observability.',
      'Synthetic eval suite that auto-generates test suites from ingested corpus and exits non-zero if recall falls below 50%.',
      'Containerized deployment using Docker Compose with decoupled Next.js web interface and FastAPI backend.',
    ],
    keyFeatures: [
      'Multi-document PDF ingestion and vectorization',
      'Cosine similarity retrieval with source citations',
      'Synthetic evaluation test harness gating CI',
      'Docker Compose containerized deployment',
      'Interactive Swagger / OpenAPI documentation',
    ],
    tags: ['Python', 'FastAPI', 'ChromaDB', 'Gemini API', 'Docker', 'Next.js', 'Pydantic'],
    links: {
      code: 'https://github.com/sutanukaa/rag-chatbot',
    },
    status: 'Production',
  },
  {
    slug: 'github-etl',
    title: 'GitHub Activity ETL Pipeline',
    tagline: 'Automated batch ETL pipeline extracting GitHub telemetry with SQLite upserts and SQL analytics.',
    overview:
      'A daily scheduled batch ETL pipeline engineered in Python and SQLite that extracts repository commits, pull requests, and engagement metrics from public GitHub repositories via REST APIs. Transforms nested JSON payloads into tidy relational tables with derived metrics such as hours_to_merge, enforces idempotent loads (INSERT OR IGNORE for commits, ON CONFLICT DO UPDATE for PRs), and executes analytical window function queries. Deployed with automated daily GitHub Actions cron workflows and paired with an interactive Next.js analytics dashboard.',
    architecture: [
      'Extract & Rate-Limit Handling: Paginated REST API extraction with token authentication (5,000 req/hr ceiling) targeting watchlist repositories.',
      'Transform & Feature Derivation: JSON normalization, ISO timestamp parsing to UTC, and derived features (e.g. hours_to_merge computed at transform time).',
      'Idempotent Load: SQLite relational schemas with composite primary keys (sha for commits, id for PRs) ensuring zero duplicate writes on repeated runs.',
      'Analytical Window Queries: Advanced SQL analytics computing running totals, rolling averages, and top contributors per repository using ROW_NUMBER() and SUM() OVER partition windows.',
      'Automated CI/CD Cron: GitHub Actions scheduled workflow running daily at 06:00 UTC with persistent database artifact caching.',
    ],
    technicalHighlights: [
      'Idempotent batch ingestion: Safe to re-run at any time without duplicating historical records or corrupting running aggregations.',
      'SQL window functions for multi-dimensional repository analytics and contributor velocity ranking.',
      'Automated headless orchestration using GitHub Actions cron with database state caching between runs.',
      'Interactive Next.js analytics dashboard powered by Better-SQLite3 and Tailwind CSS.',
    ],
    keyFeatures: [
      'Paginated GitHub REST API extraction',
      'Idempotent SQLite upserts (ON CONFLICT DO UPDATE)',
      'Derived transform fields (hours_to_merge)',
      'Advanced SQL analytics with window functions',
      'Daily GitHub Actions cron scheduling',
      'Next.js analytical dashboard interface',
    ],
    tags: ['Python', 'SQLite', 'GitHub Actions', 'ETL', 'SQL', 'Next.js', 'REST API', 'Data Engineering'],
    links: {
      code: 'https://github.com/sutanukaa/github-etl',
    },
    status: 'Production',
  },
  {
    slug: 'tickease',
    title: 'Tickease',
    tagline: 'Event management platform with automated site generation and embedded conversational AI assistants.',
    overview:
      'A full-stack event lifecycle and ticketing platform designed for event organizers to launch, manage, and monetize events. Features automated dynamic landing page generation from event metadata schemas, embedded AI chatbots providing real-time attendee support and conversion telemetry, cryptographically secure QR ticket validation, and live analytics dashboards.',
    architecture: [
      'Automated Page Generation: Next.js dynamic routing and template compilation that instantly provisions customized, SEO-optimized event landing pages upon event creation.',
      'Embedded Conversational Assistant: Context-aware AI chatbot widget embedded into each event site to resolve attendee questions, session schedules, and ticketing queries.',
      'Cryptographic Ticketing & QR Verification: Server-generated secure ticket tokens with unique QR code verification payloads, validated via transactional Supabase PostgreSQL records.',
      'Live Telemetry & Analytics: Real-time event analytics tracking registration velocity, ticket tier inventory quotas, and attendee engagement metrics.',
    ],
    technicalHighlights: [
      'Automated site compilation transforming structured event parameters into production-ready web interfaces.',
      'Embedded context-aware AI chatbot handling attendee support and collecting conversion telemetry.',
      'Tamper-resistant QR ticket verification with instantaneous check-in validation.',
      'Transactional database backend with Supabase Row-Level Security (RLS) guaranteeing data isolation.',
    ],
    keyFeatures: [
      'Instant automated event website generation',
      'Embedded conversational AI attendee assistant',
      'Multi-tier ticket inventory and checkout workflows',
      'Real-time registration analytics and sales metrics',
      'Mobile-optimized QR code ticket check-in',
    ],
    tags: ['Next.js', 'React Native', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'AI Chatbots', 'Expo'],
    links: {
      code: 'https://github.com/sutanukaa',
    },
    status: 'Shipped',
  },
  {
    slug: 'bloom-for-youu',
    title: 'Bloom For You',
    tagline: 'State-driven digital flower lifecycle engine with tamper-proof temporal secret delivery.',
    overview:
      'A full-stack web application exploring anticipation and temporal gifting. Users plant digital flowers embedded with secret encrypted messages that require 72 real-world hours to bloom. Employs deterministic elapsed-time state computation, ensuring confidential payloads remain server-side and inaccessible to client-side DOM inspection or network reverse-engineering until the target timestamp matures.',
    architecture: [
      'Deterministic Temporal State Engine: State transitions (Seed at 0h, Sprout at 11h, Seedling at 29h, Bud at 54h, Bloom at 72h) evaluated on-demand from immutable UTC creation timestamps without recurring server cron jobs.',
      'Server-Side Secret Sealing: Secret note payload is stored in Supabase PostgreSQL and excluded from all API responses until the bloom threshold is reached.',
      'Micro-Interaction Protocol: Visitor watering interactions increment transactional PostgreSQL counter records, triggering reactive SVG animations without altering growth timing.',
    ],
    technicalHighlights: [
      'Zero-cron deterministic state resolution derived purely from elapsed UTC timestamps.',
      'Cryptographically isolated server-side payload delivery eliminating client-side inspection vulnerabilities.',
      'Multi-stage procedural SVG rendering with smooth Framer Motion transitions.',
    ],
    keyFeatures: [
      '72-hour deterministic temporal growth engine',
      'Server-side sealed secret note delivery',
      'Transactional visitor watering interactions',
      'Procedural multi-stage SVG plant graphics',
      'Supabase PostgreSQL persistence',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Supabase', 'PostgreSQL', 'Tailwind CSS', 'Framer Motion'],
    links: {
      live: 'https://bloom-for-youu.vercel.app/',
      code: 'https://github.com/sutanukaa/bloom-for-you',
    },
    status: 'Shipped',
  },
  {
    slug: 'a-little-scrapbook',
    title: 'A Little Scrapbook',
    tagline: 'Tactile digital scrapbook engine with physics-driven spatial transforms, procedural Web Audio synthesis, and worker canvas export.',
    overview:
      'A production-grade client-side application engineered with Next.js 15, React 19, TypeScript, and Framer Motion, delivering a tactile, scrapbook-inspired spatial canvas. Operates within rigorous budgets: 16.7ms (60 Hz) / 8.3ms (120 Hz) frame budget with zero layout reads during drag, a 48 MB bitmap memory cap with downscaled display variants, and a zero-asset procedural Web Audio synthesis graph that eliminates external audio network latency.',
    architecture: [
      'Spatial Physics Canvas: Framer Motion motion values bypassing React re-renders, evaluated with damped harmonic oscillators (k=420, c=32, zeta=0.78), velocity-derived rotation sway, and rotated AABB trigonometric boundary clamping guaranteeing MIN_VISIBLE (32px) recovery.',
      'Procedural Web Audio Engine: Real-time synthesis graph with single-use audio nodes and a shared 384 KB noise buffer; generates tape peels (sawtooth LFO stick-slip tremolo at 28-42 Hz), placement thumps (sine + lowpass burst), rotation snap clicks, and speed-modulated continuous rustle.',
      'Local-First Persistence & If-Match Sync: Serializer enforcing canonical quantized JSON (0.1 precision), writing first to IndexedDB draft storage before debounced network PUT requests guarded by monotonic If-Match revision headers and keepalive payloads.',
      'OffscreenCanvas Worker Export: Multi-page high-DPI PNG export pipeline executing in a dedicated Web Worker (capped at 16.7M pixels) sharing the exact same affine matrix formula and pre-measured text wrapping lines as the DOM.',
    ],
    technicalHighlights: [
      'Strict 16.7ms frame budget: Motion values write directly to element styles without triggering React component renders; page rect and item dimensions cached at pointerdown.',
      'Zero-asset Web Audio synthesis: Tactile sound effects generated in real-time from oscillators and filtered noise buffers, completely eliminating MP3/WAV network latency and decoding pauses.',
      'Seven system invariants: Guarantees single-gesture ownership, transform-to-state parity, dense z-index ranks derived from pure arrays, and recoverable boundary positions.',
      'Decoupled OffscreenCanvas worker export that rasterizes print-resolution PNGs without freezing the main browser UI thread.',
    ],
    keyFeatures: [
      'Spatial physics canvas with spring-settled drag, rotate, and pinch',
      'Procedural Web Audio synthesis (peel, place, click, flip, rustle)',
      'Rotated AABB boundary collision solver with MIN_VISIBLE recovery',
      'Local-first IndexedDB draft storage with If-Match revision sync',
      'OffscreenCanvas Web Worker export with exact DOM render parity',
      'Keyboard accessibility parity with 15-degree rotation snapping',
    ],
    tags: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Audio API', 'OffscreenCanvas', 'IndexedDB'],
    links: {
      live: 'https://a-little-scrapbook.vercel.app/',
      code: 'https://github.com/sutanukaa/digialbum',
    },
    status: 'Shipped',
  },
  {
    slug: 'http-server',
    title: 'Custom HTTP/1.1 Server in C',
    tagline: 'High-performance, zero-allocation HTTP/1.1 server in C with DFA parser, openat2 sandbox & sendfile.',
    overview:
      'A low-level HTTP/1.1 server engineered from scratch in C99/C11 with zero runtime dependencies beyond libc and pthreads. Features a deterministic finite automaton (DFA) protocol parser, bounded memory per worker (~88 KiB), openat2 kernel-level path containment, and zero-copy sendfile asset streaming.',
    architecture: [
      'Pre-Threaded Concurrency: Non-blocking listener using accept4(SOCK_NONBLOCK | SOCK_CLOEXEC) and self-pipe shutdown feeding a mutex/condvar ring queue with 503 load shedding.',
      'Zero-Copy DFA Tokenizer: 256-entry byte-class DFA producing slice_t {offset, len} views into mmap guard-paged buffers with strict split-invariance and smuggling rejection.',
      'Kernel-Level Containment & I/O: Relative directory traversal sandboxing via openat2(RESOLVE_BENEATH | RESOLVE_NO_SYMLINKS) and kernel page-cache streaming via sendfile().',
    ],
    technicalHighlights: [
      'Bounded memory footprint: Zero allocation on request path; fixed ~88 KiB per worker with PROT_NONE guard pages.',
      'Absolute monotonic deadlines: poll()-driven recv, send, sendfile, and adaptive keep-alive bounded against Slowloris attacks.',
      'Smuggling & desync immunity: Rejects Transfer-Encoding + Content-Length combos, space-before-colon, and obsolete line folding.',
      'Zero-copy file streaming: Headers coalesced with MSG_MORE; direct page cache transfers capped at 1 MiB per sendfile chunk.',
      'Lingering close: Graceful shutdown(SHUT_WR) draining up to 64 KiB to prevent client-side TCP connection resets.',
    ],
    keyFeatures: [
      'Hand-written zero-copy HTTP/1.1 DFA parser',
      'openat2() kernel-enforced directory containment',
      'Pre-threaded worker pool with non-blocking sockets',
      'Zero-copy sendfile() static asset pipeline',
      'Case-insensitive FNV-1a hash table MIME resolver',
      'Weak ETag and If-None-Match 304 caching',
      'Process-wide SIGPIPE immunity and self-pipe signal handling',
    ],
    tags: ['C11', 'POSIX Sockets', 'Linux Systems', 'HTTP/1.1', 'Pthreads', 'sendfile', 'openat2', 'DFA'],
    links: {
      code: 'https://github.com/sutanukaa/http-server',
    },
    status: 'Shipped',
  },
];
