export interface SkillDeepDive {
  title: string;
  category: 'Frontend & UI' | 'Backend & APIs' | 'AI & Data' | 'Tools & DevOps';
  catalogCode: string;
  status: 'Daily Driver' | 'Production' | 'Specialty' | 'Active';
  iconName: string;
  masterySummary: string;
  whatIBuilt: string[];
  keyHighlights: string[];
}

export const SKILL_DEEP_DIVES: Record<string, SkillDeepDive> = {
  // =========================================================================
  // 1. FRONTEND & UI (8 Skills)
  // =========================================================================
  TypeScript: {
    title: 'TypeScript',
    category: 'Frontend & UI',
    catalogCode: 'FE-01',
    status: 'Daily Driver',
    iconName: 'skill-frontend',
    masterySummary:
      'My primary language and daily driver for full-stack web and systems development. Fluent in strict-mode type systems, complex generics, conditional types, discriminated unions, and end-to-end schema validation.',
    whatIBuilt: [
      'Built DynoWeb CRO platform at Updesk: engineered solo the SmartNudge behavioral engine and Figma-style WYSIWYG editor with strict WCAG-AA contrast linting.',
      'Designed typed multi-agent StateGraph workflows and AST dependency decomposition in Syntactiq (1st place out of 650 teams at 100Agents Hackathon).',
      'Engineered A Little Scrapbook with strict motion-value transforms, Rotated AABB boundary solvers, and OffscreenCanvas web worker pipelines.',
      'Constructed complete full-stack type safety across Next.js 15 App Router, React Router v7, Prisma ORM, and Supabase PostgreSQL RLS policies.',
    ],
    keyHighlights: [
      'Strict type safety from database query to client micro-interaction.',
      'Zero-any policy across mission-critical application pipelines.',
      'Custom discriminated union state machines for complex multi-stage flows.',
    ],
  },

  'Next.js': {
    title: 'Next.js',
    category: 'Frontend & UI',
    catalogCode: 'FE-02',
    status: 'Daily Driver',
    iconName: 'skill-frontend',
    masterySummary:
      'My framework of choice for modern production web applications. Deep expertise in Next.js 14 and 15 App Router, React Server Components (RSC), server actions, dynamic routing, and edge rendering.',
    whatIBuilt: [
      'Engineered this cozy interactive pink home portfolio with 16:9 diorama rooms, zero-flash CSS day/night phase scripts, and React Portals.',
      'Architected A Little Scrapbook: Next.js 15 spatial canvas running at 120 Hz with IndexedDB draft storage and zero layout thrashing.',
      'Developed Tickease: automated dynamic landing page compilation from event metadata schemas with instant SEO optimization.',
      'Built interactive analytical dashboards for the RAG Document Q&A engine and GitHub Activity ETL telemetry pipelines.',
    ],
    keyHighlights: [
      'Strict client vs. server component boundary discipline.',
      'Zero hydration mismatch architectures with inline theme scripts.',
      'Sub-100ms First Contentful Paint (FCP) and optimal Core Web Vitals.',
    ],
  },

  'React.js': {
    title: 'React.js',
    category: 'Frontend & UI',
    catalogCode: 'FE-03',
    status: 'Daily Driver',
    iconName: 'skill-frontend',
    masterySummary:
      'Comprehensive mastery of React 18 & 19 paradigms. Expert in custom hook composition, concurrent features, suspense boundaries, ref-based performance optimizations, and spatial UI engines.',
    whatIBuilt: [
      'Built a full-featured Figma-style visual editor for Updesk: drag-and-drop layer reordering, live font contrast checking, and AI Brand-DNA styling.',
      'Engineered Syntactiq’s interactive code visualization dashboard using React Flow for AST dependency DAGs and cycle-breaking.',
      'Constructed modular dollhouse cutaway UI components (RoomScene, diorama hotspots, interactive desktop computer OS, and audio engines).',
      'Implemented responsive mobile-adaptive modal overlays with backdrop blur, focus trapping, and keyboard navigation parity.',
    ],
    keyHighlights: [
      'Ref-driven animations avoiding unnecessary component re-renders.',
      'Custom headless state engines using Zustand, React Context, and Portals.',
      'Accessibility-first design honoring prefers-reduced-motion and WCAG standards.',
    ],
  },

  JavaScript: {
    title: 'JavaScript',
    category: 'Frontend & UI',
    catalogCode: 'FE-04',
    status: 'Daily Driver',
    iconName: 'skill-frontend',
    masterySummary:
      'Deep fluency in ECMAScript standards, asynchronous event loops, V8 engine internals, memory lifecycle management, and high-performance Web APIs.',
    whatIBuilt: [
      'Built an 18-signal browser behavioral trigger engine at Updesk: detects exit intent, scroll velocity, cart abandonment, and frustration clicks in real time.',
      'Synthesized a zero-asset Web Audio synthesis engine generating real-time tape peels, placement thumps, and frequency-filtered rustle.',
      'Created multi-threaded OffscreenCanvas image rendering in dedicated Web Workers without blocking the main browser thread.',
      'Authored automated canvas and pixel-manipulation scripts for alpha-channel extraction and image coordinate calibration.',
    ],
    keyHighlights: [
      'Deep understanding of microtask queues, event bubbling, and memory leaks.',
      'Expertise in Web Audio API, Web Workers, Canvas, and Pointer Events.',
      'High frame-rate 60/120 Hz animation loops using requestAnimationFrame.',
    ],
  },

  'Tailwind CSS': {
    title: 'Tailwind CSS',
    category: 'Frontend & UI',
    catalogCode: 'FE-05',
    status: 'Daily Driver',
    iconName: 'skill-frontend',
    masterySummary:
      'Expert in utility-first responsive styling, custom design system configuration, CSS variable token architectures, and theme-switching engines.',
    whatIBuilt: [
      'Crafted the bespoke Cozy Home design system: semantic color tokens (bg-wall, text-ink, bg-paper) automatically flipping across 4 diurnal phases.',
      'Built responsive layouts perfectly scaled from 375px mobile screens to large desktop monitors across 6 illustrated diorama rooms.',
      'Engineered paper textures, washi-tape decorations, antique etched brass accents, and glassmorphic blurred backdrops.',
      'Designed responsive dashboard interfaces for BuyBox, Syntactiq, and Tickease with pixel-level alignment.',
    ],
    keyHighlights: [
      'Zero arbitrary hardcoded colors; 100% tokenized design systems.',
      'Fluid typography and responsive container queries.',
      'Handcrafted scrapbook aesthetic combined with modern clean utility classes.',
    ],
  },

  'Framer Motion': {
    title: 'Framer Motion',
    category: 'Frontend & UI',
    catalogCode: 'FE-06',
    status: 'Production',
    iconName: 'skill-frontend',
    masterySummary:
      'Advanced implementation of declarative physics animations, gesture tracking, layout transitions, spring physics, and shared element layout morphing.',
    whatIBuilt: [
      'Engineered A Little Scrapbook’s spatial physics canvas: damped harmonic oscillators (k=420, c=32, zeta=0.78) with velocity-derived rotation sway.',
      'Created multi-stage interactive zoom flows: room hotspots zooming into full-screen 4-drawer cabinets, open drawers, and clipboards.',
      'Implemented Bloom For You’s procedural SVG flower growth transitions and interactive watering can animations.',
      'Built tactile page-turning, drawer-sliding, and book-opening spreads across the entire portfolio.',
    ],
    keyHighlights: [
      'Motion values writing directly to DOM transforms bypassing React render cycles.',
      'Mathematical boundary clamping preventing elements from escaping viewports.',
      'Strict respect for prefers-reduced-motion accessibility media queries.',
    ],
  },

  'React Native': {
    title: 'React Native',
    category: 'Frontend & UI',
    catalogCode: 'FE-07',
    status: 'Production',
    iconName: 'skill-frontend',
    masterySummary:
      'Hands-on experience developing cross-platform iOS and Android applications using Expo, native camera bridges, and offline-first state synchronization.',
    whatIBuilt: [
      'Developed the Tickease mobile event organizer app with real-time camera QR ticket scanning and cryptographic validation.',
      'Engineered offline-first check-in caching allowing venue staff to scan tickets even in low-connectivity event environments.',
      'Built mobile attendee dashboards displaying purchased passes, dynamic event schedules, and live venue announcements.',
    ],
    keyHighlights: [
      'High-throughput barcode/QR scanning integration with sub-second feedback.',
      'Responsive native layouts supporting varied mobile device aspect ratios.',
      'Secure credential storage and token authentication across mobile sessions.',
    ],
  },

  Polaris: {
    title: 'Polaris',
    category: 'Frontend & UI',
    catalogCode: 'FE-08',
    status: 'Production',
    iconName: 'skill-frontend',
    masterySummary:
      'Professional production experience implementing Shopify’s official design system (Polaris) for merchant-facing administrative applications and analytics suites.',
    whatIBuilt: [
      'Built merchant administrative portals for DynoWeb at Updesk, adhering strictly to Shopify App Bridge and Polaris UX guidelines.',
      'Constructed conversion-rate analytics tables, A/B test split-configuration panels, and audience cohort filtering views.',
      'Implemented accessible merchant onboarding flows and Shopify subscription billing management interfaces.',
    ],
    keyHighlights: [
      'Full compliance with Shopify merchant accessibility and UX design standards.',
      'Seamless integration with Shopify App Bridge and embedded admin iframes.',
      'High-density data tables with sorting, filtering, and bulk actions.',
    ],
  },

  // =========================================================================
  // 2. BACKEND & APIS (9 Skills)
  // =========================================================================
  FastAPI: {
    title: 'FastAPI',
    category: 'Backend & APIs',
    catalogCode: 'BE-01',
    status: 'Daily Driver',
    iconName: 'skill-backend',
    masterySummary:
      'My primary Python framework for high-throughput asynchronous REST microservices, AI pipelines, Pydantic data validation, and OpenAPI documentation.',
    whatIBuilt: [
      'Built the backend of the RAG Document Q&A engine from scratch: multipart PDF streaming, vector search routing, and server-sent streaming responses.',
      'Engineered the REST ingestion API for Syntactiq: coordinates code repository uploads, AST analysis triggers, and task status polling.',
      'Constructed synthetic evaluation harnesses and automated test endpoints validating answer recall and citation precision.',
    ],
    keyHighlights: [
      'Async/await concurrency handling concurrent multipart uploads efficiently.',
      'Strict request/response validation through comprehensive Pydantic schemas.',
      'Automatic, interactive Swagger/OpenAPI documentation generation.',
    ],
  },

  'Node.js': {
    title: 'Node.js',
    category: 'Backend & APIs',
    catalogCode: 'BE-02',
    status: 'Daily Driver',
    iconName: 'skill-backend',
    masterySummary:
      'Deep proficiency in the Node.js runtime, asynchronous I/O, event-driven architectures, file-system buffer pipelines, and server-side automation.',
    whatIBuilt: [
      'Authored automated headless image processing pipelines using Sharp for pixel extraction, alpha transparency masking, and coordinate calibration.',
      'Implemented Next.js server actions, API route handlers, and SSR data-fetching pipelines across portfolio and commercial apps.',
      'Built custom tooling for build verification, asset checking, and automated git workflow integration.',
    ],
    keyHighlights: [
      'Buffer manipulation and raw stream processing for media and assets.',
      'Robust error-handling patterns across asynchronous event streams.',
      'Production deployment on serverless edge networks and Docker containers.',
    ],
  },

  'Express.js': {
    title: 'Express.js',
    category: 'Backend & APIs',
    catalogCode: 'BE-03',
    status: 'Production',
    iconName: 'skill-backend',
    masterySummary:
      'Strong foundation in classic Node.js server architecture: RESTful endpoint routing, custom middleware chaining, security headers, and webhook receivers.',
    whatIBuilt: [
      'Built backend authentication and user management microservices with JWT verification and bcrypt password hashing.',
      'Developed webhook ingress endpoints for Shopify app lifecycle events and billing subscription updates.',
      'Implemented rate-limiting, CORS policies, request logging, and graceful server shutdown protocols.',
    ],
    keyHighlights: [
      'Clean middleware architecture for authentication, validation, and error logging.',
      'Idempotent webhook handling protecting against duplicate network deliveries.',
      'Integration with PostgreSQL and MongoDB database persistence layers.',
    ],
  },

  Celery: {
    title: 'Celery',
    category: 'Backend & APIs',
    catalogCode: 'BE-04',
    status: 'Production',
    iconName: 'skill-backend',
    masterySummary:
      'Distributed task queue architecture in Python. Expert in asynchronous task dispatch, worker concurrency, failure retry strategies, and pipeline orchestration.',
    whatIBuilt: [
      'Engineered Syntactiq’s multi-agent execution pipeline: dispatched asynchronous Architect, Coder, and Test Generator tasks with shared typed state.',
      'Implemented exponential backoff retry algorithms for self-healing syntax recovery and unit test execution.',
      'Coordinated background repository cloning, AST extraction, and Docker sandbox test runs without blocking user-facing APIs.',
    ],
    keyHighlights: [
      'Distributed task coordination across decoupled worker processes.',
      'Task monitoring and progress reporting via Redis Pub/Sub channels.',
      'Robust error containment preventing single-task failures from halting clusters.',
    ],
  },

  Redis: {
    title: 'Redis',
    category: 'Backend & APIs',
    catalogCode: 'BE-05',
    status: 'Daily Driver',
    iconName: 'skill-backend',
    masterySummary:
      'In-memory data structure store used extensively for high-speed caching, message brokering, pub/sub telemetry, and distributed rate limiting.',
    whatIBuilt: [
      'Configured Redis as the high-throughput task broker and result backend for Celery distributed worker clusters in Syntactiq.',
      'Implemented LLM budget-reserved caching at Updesk: cached expensive Gemini analysis outputs to prevent redundant API calls.',
      'Built real-time agent execution progress pub/sub channels streaming live AST modernization updates to the frontend dashboard.',
    ],
    keyHighlights: [
      'Sub-millisecond data retrieval for cached sessions and agent state.',
      'Atomic key increments and TTL expirations for API rate-limiting.',
      'Pub/sub messaging patterns linking decoupled backend microservices.',
    ],
  },

  PostgreSQL: {
    title: 'PostgreSQL',
    category: 'Backend & APIs',
    catalogCode: 'BE-06',
    status: 'Daily Driver',
    iconName: 'skill-backend',
    masterySummary:
      'My primary relational database. Advanced query design, schema normalization, ACID transaction management, indexing strategies, and JSONB handling.',
    whatIBuilt: [
      'Designed relational schemas for Syntactiq: stored repository migration sessions, AST diff metrics, and generated pytest scaffolds with strict foreign keys.',
      'Engineered Tickease ticketing data models: transactional ticket reservations, inventory tier quotas, and audit logs.',
      'Authored complex analytical SQL queries with window functions (ROW_NUMBER, SUM OVER) for contributor velocity in the GitHub ETL pipeline.',
    ],
    keyHighlights: [
      'ACID transaction guarantees preventing overselling and race conditions.',
      'Optimized B-tree and composite indexing for high-frequency lookup paths.',
      'Row-Level Security (RLS) policies guaranteeing multi-tenant data isolation.',
    ],
  },

  Prisma: {
    title: 'Prisma',
    category: 'Backend & APIs',
    catalogCode: 'BE-07',
    status: 'Daily Driver',
    iconName: 'skill-backend',
    masterySummary:
      'Daily driver ORM for TypeScript and Node.js. Schema definition, automated migration workflows, relation querying, and type-safe database queries.',
    whatIBuilt: [
      'Maintained type-safe data access for the DynoWeb Shopify CRO platform at Updesk across user sessions, nudges, and conversion metrics.',
      'Engineered database schemas and automated Prisma migrations for full-stack Next.js and React Router applications.',
      'Structured nested eager-loading queries avoiding N+1 database performance bottlenecks.',
    ],
    keyHighlights: [
      '100% end-to-end type safety synchronized with database schemas.',
      'Deterministic migration history trackable in version control.',
      'Safe, parameterized queries preventing SQL injection vulnerabilities.',
    ],
  },

  Supabase: {
    title: 'Supabase',
    category: 'Backend & APIs',
    catalogCode: 'BE-08',
    status: 'Production',
    iconName: 'skill-backend',
    masterySummary:
      'Production experience deploying backend-as-a-service architectures: PostgreSQL persistence, Row-Level Security (RLS), and secure API endpoints.',
    whatIBuilt: [
      'Implemented the temporal secret-sealing engine for Bloom For You: messages locked securely in PostgreSQL until the 72-hour bloom threshold matures.',
      'Built Tickease data layer with cryptographic Row-Level Security (RLS) policies ensuring event organizers only access their own tenant records.',
      'Integrated real-time database change listeners for live check-in telemetry and attendee registration counts.',
    ],
    keyHighlights: [
      'Declarative Row-Level Security policies enforced directly at the database engine.',
      'Server-side sealed payloads inaccessible to client-side reverse-engineering.',
      'Instant REST and WebSocket APIs auto-generated from PostgreSQL schemas.',
    ],
  },

  MongoDB: {
    title: 'MongoDB',
    category: 'Backend & APIs',
    catalogCode: 'BE-09',
    status: 'Production',
    iconName: 'skill-backend',
    masterySummary:
      'Proficiency in NoSQL document database modeling, flexible JSON document collections, aggregation pipelines, and Mongoose ODM schemas.',
    whatIBuilt: [
      'Modeled flexible e-commerce product catalogs and attribute schemas for BuyBox e-commerce platform.',
      'Constructed aggregation pipelines for user activity telemetry, session replay event streams, and unstructured logging.',
      'Implemented compound index structures optimized for document lookup and text search queries.',
    ],
    keyHighlights: [
      'Flexible schema design adapting easily to evolving product specifications.',
      'Multi-stage aggregation pipelines for telemetry summarization.',
      'Mongoose middleware hooks for data validation and timestamp auditing.',
    ],
  },

  // =========================================================================
  // 3. AI & DATA (6 Skills)
  // =========================================================================
  'Gemini API': {
    title: 'Gemini API',
    category: 'AI & Data',
    catalogCode: 'AI-01',
    status: 'Daily Driver',
    iconName: 'skill-ai',
    masterySummary:
      'Expert in building production LLM systems with Google Gemini (1.5 Pro, 1.5 Flash, text-embedding-004): multi-agent loops, structured outputs, and guardrails.',
    whatIBuilt: [
      'Owned anti-hallucination and data-grounding on DynoAgent at Updesk: built stale-rollup gates, pre-slice totals, and causal-claim guardrails.',
      'Built the Coder & Self-Healing Agent in Syntactiq: generates modern Python 3.12 code, recovers from AST parse errors, and synthesizes pytests.',
      'Generated dense 768-dimensional semantic embeddings for the RAG Document Q&A pipeline with zero LangChain overhead.',
      'Shipped race-safe, budget-reserved session-replay AI summaries summarizing user browser interactions.',
    ],
    keyHighlights: [
      'Anti-hallucination guardrails reconciling LLM outputs with source-of-truth databases.',
      'Bounded self-healing retry loops capturing syntax errors and pytest assertion traces.',
      'Optimal model routing: pairing Gemini Flash for speed with Pro for deep reasoning.',
    ],
  },

  RAG: {
    title: 'RAG',
    category: 'AI & Data',
    catalogCode: 'AI-02',
    status: 'Production',
    iconName: 'skill-ai',
    masterySummary:
      'Architected end-to-end Retrieval-Augmented Generation systems from scratch without heavy frameworks, prioritizing low latency, source citations, and evaluation.',
    whatIBuilt: [
      'Built the RAG Document Q&A Engine from scratch: ingested heterogeneous PDFs, chunked text recursively with overlap, and indexed vectors in ChromaDB.',
      'Engineered top-k cosine similarity search with context injection guardrails forcing responses to cite verbatim source document chunks.',
      'Authored a synthetic evaluation test harness (eval.py) auto-generating queries from ingested text and scoring recall/accuracy to gate CI pipelines.',
    ],
    keyHighlights: [
      'Clean ~150-line explicit core pipeline avoiding LangChain abstractions.',
      'Synthetic eval suite gating continuous integration pipelines on regression.',
      'Zero-hallucination guardrails rejecting queries outside ingested document scope.',
    ],
  },

  'Vector Embeddings': {
    title: 'Vector Embeddings',
    category: 'AI & Data',
    catalogCode: 'AI-03',
    status: 'Production',
    iconName: 'skill-ai',
    masterySummary:
      'Deep practical understanding of dense vector representations, embedding models, dimensional spaces, similarity distance metrics, and chunking strategies.',
    whatIBuilt: [
      'Generated semantic vector embeddings using Gemini text-embedding-004 across multi-page PDF documents.',
      'Engineered chunking strategies: tested recursive character chunking (1,000 characters with 200-character overlap) to balance semantic fidelity and noise.',
      'Implemented cosine similarity matching algorithms and vector distance ranking for accurate passage retrieval.',
    ],
    keyHighlights: [
      'Tuned chunk overlap parameters preventing semantic truncation across chunk boundaries.',
      'Normalized vector spaces ensuring deterministic cosine similarity calculations.',
      'Efficient batch embedding pipelines minimizing API network roundtrips.',
    ],
  },

  ChromaDB: {
    title: 'ChromaDB',
    category: 'AI & Data',
    catalogCode: 'AI-04',
    status: 'Production',
    iconName: 'skill-ai',
    masterySummary:
      'Production deployment and querying of ChromaDB vector store: collection management, metadata indexing, nearest-neighbor searches, and persistence.',
    whatIBuilt: [
      'Deployed ChromaDB as the dedicated vector index backend for the RAG Document Q&A engine.',
      'Created persistent vector collections with metadata schemas storing document IDs, page numbers, and verbatim text chunks.',
      'Engineered metadata-filtered vector queries enabling fast scoped search across specific document subsets.',
    ],
    keyHighlights: [
      'Sub-50ms nearest-neighbor vector similarity retrieval.',
      'Persistent on-disk vector storage containerized seamlessly via Docker Compose.',
      'Metadata filtering combining keyword constraints with dense vector matching.',
    ],
  },

  'Vercel AI SDK': {
    title: 'Vercel AI SDK',
    category: 'AI & Data',
    catalogCode: 'AI-05',
    status: 'Production',
    iconName: 'skill-ai',
    masterySummary:
      'Proficiency in streaming AI responses, UI chat hooks, structured JSON output generation, and server-side token streaming pipelines.',
    whatIBuilt: [
      'Implemented streaming chat interfaces in DynoAgent at Updesk, delivering smooth real-time token rendering for merchant analytics queries.',
      'Built embedded conversational attendee assistance widgets in Tickease with structured tool calls and event schedule resolution.',
      'Engineered server-side streaming route handlers with backpressure management and client-side abort controllers.',
    ],
    keyHighlights: [
      'Zero-latency streaming text rendering with automatic markdown parsing.',
      'Type-safe structured data generation using Zod schemas.',
      'Seamless integration with Next.js App Router and React Server Components.',
    ],
  },

  'ETL Pipelines': {
    title: 'ETL Pipelines',
    category: 'AI & Data',
    catalogCode: 'AI-06',
    status: 'Production',
    iconName: 'skill-ai',
    masterySummary:
      'End-to-end data engineering: automated extraction, schema transformation, idempotent loading, data cleaning, and relational SQL analytics.',
    whatIBuilt: [
      'Engineered the GitHub Activity ETL Pipeline: daily scheduled batch pipeline extracting commits, PRs, and metrics via paginated REST APIs.',
      'Implemented idempotent database loading in SQLite: INSERT OR IGNORE for commits and ON CONFLICT DO UPDATE for pull requests.',
      'Computed derived transform metrics (e.g., hours_to_merge) and analytical SQL window functions (ROW_NUMBER, SUM OVER) for contributor velocity.',
      'Automated headless pipeline execution via GitHub Actions cron workflows with persistent database artifact caching.',
    ],
    keyHighlights: [
      'Idempotent ingestion safely re-runnable without duplicating historical records.',
      'Automated rate-limit handling and token rotation under GitHub REST API quotas.',
      'SQL window function analytics generating multi-dimensional velocity metrics.',
    ],
  },

  // =========================================================================
  // 4. TOOLS & DEVOPS (6 Skills)
  // =========================================================================
  Docker: {
    title: 'Docker',
    category: 'Tools & DevOps',
    catalogCode: 'TL-01',
    status: 'Daily Driver',
    iconName: 'skill-tools',
    masterySummary:
      'Containerization, multi-stage builds, isolated execution sandboxes, environment parity, and multi-service orchestration with Docker Compose.',
    whatIBuilt: [
      'Engineered a dual-tier secure sandbox in Syntactiq: ephemeral Docker container (python:3.11-slim, --network none, 512MB RAM cap) safely testing generated code.',
      'Orchestrated multi-container production environments with Docker Compose for the RAG Document Q&A engine (FastAPI, ChromaDB, Next.js).',
      'Created optimized multi-stage Dockerfiles minimizing production image sizes down to minimal lightweight runtimes.',
    ],
    keyHighlights: [
      'Network-isolated (--network none) ephemeral sandboxing for arbitrary code execution.',
      'Multi-stage Docker builds reducing image sizes and stripping build dependencies.',
      'Complete local and cloud runtime environment reproducibility.',
    ],
  },

  'Git & GitHub': {
    title: 'Git & GitHub',
    category: 'Tools & DevOps',
    catalogCode: 'TL-02',
    status: 'Daily Driver',
    iconName: 'skill-tools',
    masterySummary:
      'Daily driver version control mastery: atomic commits, rebase workflows, conflict resolution, PR reviews, and programmatic Git Data API automation.',
    whatIBuilt: [
      'Maintained clean, semantic git histories with conventional commit standards across all projects and open-source contributions.',
      'Programmatically integrated GitHub OAuth and the Git Data API in Syntactiq: automated fork, branch creation, atomic tree commits, and live PR openings.',
      'Successfully opened automated modernization pull requests on major open-source repositories like python-validators/validators.',
    ],
    keyHighlights: [
      'Programmatic Git Data API automation: creating trees, blobs, and commits via code.',
      'Strict trunk-based and feature-branch collaboration standards.',
      'Deep familiarity with git reflogs, interactive rebasing, and bisect debugging.',
    ],
  },

  'GitHub Actions': {
    title: 'GitHub Actions',
    category: 'Tools & DevOps',
    catalogCode: 'TL-03',
    status: 'Production',
    iconName: 'skill-tools',
    masterySummary:
      'Automated CI/CD pipelines, test runners, scheduled cron workflows, artifact caching, and automated deployment triggers.',
    whatIBuilt: [
      'Authored automated continuous integration workflows executing pytest suites, TypeScript typecheck, and ESLint on every push and PR.',
      'Engineered scheduled cron workflows (06:00 UTC daily) for the GitHub Activity ETL pipeline with cross-run database state caching.',
      'Constructed CI regression gates in the RAG pipeline that evaluate synthetic answer recall and fail builds if recall drops below 50%.',
    ],
    keyHighlights: [
      'Automated quality gating preventing broken code from reaching main branches.',
      'Dependency and build artifact caching speeding up pipeline execution times.',
      'Headless scheduled cron orchestration without dedicated server infrastructure.',
    ],
  },

  'Google Cloud Run': {
    title: 'Google Cloud Run',
    category: 'Tools & DevOps',
    catalogCode: 'TL-04',
    status: 'Production',
    iconName: 'skill-tools',
    masterySummary:
      'Serverless containerized backend deployment, automatic horizontal scaling, traffic management, and cloud secret injection.',
    whatIBuilt: [
      'Deployed production API backends and containerized microservices for DynoWeb at Updesk on Google Cloud Run.',
      'Configured zero-scaling auto-concurrency reducing idle infrastructure costs during low-traffic periods.',
      'Integrated Google Secret Manager for environment variable injection and secure API key management.',
    ],
    keyHighlights: [
      'Fully managed serverless container runtime with sub-second scale-up.',
      'Zero-downtime revision rollouts and blue/green traffic splitting.',
      'Secure IAM roles and Cloud Secret Manager credential management.',
    ],
  },

  Vercel: {
    title: 'Vercel',
    category: 'Tools & DevOps',
    catalogCode: 'TL-05',
    status: 'Daily Driver',
    iconName: 'skill-tools',
    masterySummary:
      'Edge deployment, serverless function runtimes, preview deployment staging, custom domain routing, and web analytics integration.',
    whatIBuilt: [
      'Deployed production Next.js applications including this Cozy Home portfolio, A Little Scrapbook, Bloom For You, and Tickease.',
      'Configured automated preview deployments per pull request enabling immediate visual regression testing.',
      'Managed edge caching headers, custom domain DNS records, and real-time Web Vitals performance telemetry.',
    ],
    keyHighlights: [
      'Global Edge Network caching ensuring worldwide sub-second TTFB.',
      'Automated zero-config continuous deployment synchronized with GitHub.',
      'Edge functions minimizing latency for regional API requests.',
    ],
  },

  Postman: {
    title: 'Postman',
    category: 'Tools & DevOps',
    catalogCode: 'TL-06',
    status: 'Daily Driver',
    iconName: 'skill-tools',
    masterySummary:
      'API contract validation, endpoint testing collections, environment variable management, pre-request scripts, and mock servers.',
    whatIBuilt: [
      'Constructed comprehensive automated API test suites for FastAPI, Express, and Shopify REST API integrations.',
      'Wrote JavaScript pre-request scripts for dynamic HMAC signature generation and bearer token authorization.',
      'Validated payload contracts, response schema invariants, and HTTP status code edge cases across microservice endpoints.',
    ],
    keyHighlights: [
      'Automated test assertions validating response schemas and response times.',
      'Dynamic environment variable chaining linking multi-step authentication flows.',
      'Comprehensive collection exports for developer onboarding and team sharing.',
    ],
  },
};
