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
    tagline: 'Autonomous multi-agent platform for AST-driven legacy codebase refactoring and automated pull requests.',
    overview:
      'An asynchronous multi-agent engine engineered to decompose, analyze, and modernize legacy software repositories. Parses source code into Concrete Syntax Trees using Tree-sitter, constructs an acyclic dependency graph with NetworkX, and schedules refactoring tasks leaf-first. Persists intermediate diffs and AST metrics to PostgreSQL and automates GitHub pull requests. Winner of the 100Agents Global Hackathon (1st out of 650 teams worldwide).',
    architecture: [
      'AST & Syntax Analysis: Tree-sitter and native Python AST parsing to extract function signatures, control flows, and module dependencies.',
      'Dependency Graph Decomposition: NetworkX Directed Acyclic Graph (DAG) construction with cycle-breaking algorithms and topological sorting.',
      'Asynchronous Agent Pipeline: Distributed Celery task queue backed by Redis with a shared typed state machine coordinating Architect, Coder, and Test Generator agents.',
      'Verification & Telemetry: In-memory syntax verification, automated fork-branch-push workflows, and Next.js / React Flow visual telemetry dashboard.',
    ],
    technicalHighlights: [
      'Winner of 100Agents Global Hackathon (Ranked 1st among 650 international teams).',
      'Topological execution order with operator-defined edge overrides taking precedence over inferred dependencies.',
      'Automated fork-and-PR pipeline verified by opening a real pull request on python-validators/validators.',
    ],
    keyFeatures: [
      'Tree-sitter Concrete Syntax Tree (CST) parsing',
      'NetworkX DAG dependency analysis with cycle breaking',
      'Celery and Redis asynchronous multi-agent coordination',
      'Automated pytest scaffold generation and verification',
      'React Flow interactive graph dashboard',
    ],
    tags: ['Python', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Tree-sitter', 'NetworkX', 'Next.js', 'Docker'],
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
