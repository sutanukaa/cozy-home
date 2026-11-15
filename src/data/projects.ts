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
    tagline: 'Component-driven digital scrapbook engine featuring drag-and-drop spatial layouts and audio synthesis.',
    overview:
      'A web application engineered with Next.js, TypeScript, and Framer Motion, delivering a tactile, scrapbook-inspired spatial canvas. Implements physics-based drag interactions, dynamic z-indexing, rotatable sticker elements, and a procedural Web Audio API soundscape without external audio asset bottlenecks.',
    architecture: [
      'Spatial Physics Canvas: Gesture-driven bounding box transforms and collision boundaries using Framer Motion drag gestures and spring physics.',
      'Web Audio Synthesis: Custom audio engine generating real-time paper flips, clicks, and tape peeling sound effects procedurally via Web Audio API oscillators.',
      'State & Responsive Layout: Persistent layout state with theme-adaptive styling and keyboard accessibility.',
    ],
    technicalHighlights: [
      'Procedural Web Audio API sound effects eliminating external MP3/WAV network latency and asset overhead.',
      'Hardware-accelerated CSS transforms and spring physics maintaining 60 FPS performance across touch and mouse inputs.',
      'Modular sticker and scrapbook component architecture.',
    ],
    keyFeatures: [
      'Interactive draggable canvas with spring physics',
      'Procedural Web Audio API sound synthesis',
      'Multi-page scrapbook navigation and sticker pinning',
      'Accessible keyboard controls and responsive touch handling',
    ],
    tags: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Web Audio API'],
    links: {
      live: 'https://a-little-scrapbook.vercel.app/',
      code: 'https://github.com/sutanukaa/digialbum',
    },
    status: 'Shipped',
  },
  {
    slug: 'http-server',
    title: 'Custom HTTP/1.1 Server in C',
    tagline: 'Low-level multithreaded HTTP server written from scratch using POSIX socket APIs.',
    overview:
      'A lightweight HTTP/1.1 web server built from scratch in C with zero external runtime dependencies. Implements raw TCP socket programming, manual HTTP request line and header tokenization, concurrent connection handling, and static file serving with MIME type resolution.',
    architecture: [
      'POSIX Sockets: Direct socket(), bind(), listen(), and accept() system calls managing non-blocking TCP connections.',
      'Request Tokenization: Custom zero-copy parser extracting HTTP methods (GET, POST), URI paths, query strings, and headers into structured memory buffers.',
      'File I/O & Concurrency: Efficient buffer management with chunked send() / recv() operations, preventing buffer overruns and memory leaks.',
    ],
    technicalHighlights: [
      'Zero external dependencies: Pure C implementation compiling with GCC and Make.',
      'Custom zero-copy HTTP/1.1 protocol parser with error handling for malformed requests.',
      'Robust static asset delivery with MIME type mapping and accurate HTTP status code generation.',
    ],
    keyFeatures: [
      'Raw POSIX socket network programming',
      'HTTP/1.1 request line and header parser',
      'Static file serving with Content-Type header resolution',
      'Thread-safe connection handling and memory management',
    ],
    tags: ['C', 'POSIX Sockets', 'Linux', 'GCC', 'Make', 'HTTP/1.1', 'Systems Programming'],
    links: {
      code: 'https://github.com/sutanukaa/http-server',
    },
    status: 'Active',
  },
];
