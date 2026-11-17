export interface CodeSnippet {
  language: string;
  code: string;
  caption?: string;
}

export interface BlogSection {
  heading: string;
  paragraphs: string[];
  codeSnippet?: CodeSnippet;
  callout?: {
    type: 'tip' | 'note' | 'highlight';
    title?: string;
    text: string;
  };
}

export interface TechnicalBlog {
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  readTime: string;
  category: string;
  badge: string;
  tags: string[];
  summary: string;
  sections: BlogSection[];
}

export const technicalBlogs: TechnicalBlog[] = [
  {
    slug: 'syntactiq-langgraph-docker-sandboxing',
    title: 'Autonomous Code Modernization with LangGraph & Docker Sandboxes',
    subtitle: 'Designing bounded self-healing agents and AST dependency graphs that refactor legacy codebases safely.',
    date: 'Nov 2026',
    readTime: '5 min read',
    category: 'Multi-Agent Systems',
    badge: '100Agents Hackathon Winner (1st / 650 teams)',
    tags: ['LangGraph', 'Python 3.12', 'Docker', 'Tree-sitter', 'NetworkX', 'Self-Healing'],
    summary:
      'How we architected Syntactiq, an autonomous multi-agent platform that traverses legacy codebases, resolves circular import DAGs, modernizes syntax via Gemini, and compiles unit tests inside hardened Docker sandboxes.',
    sections: [
      {
        heading: '1. The Problem with Naive LLM Refactoring',
        paragraphs: [
          'Most AI refactoring tools treat codebases like isolated text snippets. When you feed a legacy Python 2.7 or 3.6 script into a prompt, LLMs happily invent nonexistent module paths, break circular imports, and hallucinate passing tests.',
          'To build Syntactiq, we needed deterministic boundaries: a strict StateGraph pipeline that validates every syntax transition using concrete AST parsers and runs generated tests in disposable, zero-network sandboxes before a human ever sees a PR.',
        ],
        callout: {
          type: 'highlight',
          title: 'Core Philosophy',
          text: 'Never trust LLM output without an AST parser checking grammar and an ephemeral sandbox verifying runtime assertions.',
        },
      },
      {
        heading: '2. The StateGraph & Ephemeral Docker Execution',
        paragraphs: [
          'The architecture uses a compiled LangGraph StateGraph with conditional edges. When the Architect decomposes dependencies into a NetworkX DAG, the Coder writes modern syntax, and the Tester executes pytest inside an isolated container.',
          'If an assertion fails, the traceback is piped into a bounded 3-attempt diagnostic loop rather than failing immediately.',
        ],
        codeSnippet: {
          language: 'python',
          caption: 'StateGraph node conditional retry edge',
          code: `@dataclass\nclass MigrationState:\n    file_path: str\n    ast_tree: Any\n    modernized_code: str = ""\n    test_output: str = ""\n    retry_count: int = 0\n    is_verified: bool = False\n\ndef route_verification(state: MigrationState) -> str:\n    if state.is_verified:\n        return "git_commit_node"\n    if state.retry_count < 3:\n        return "self_heal_retry_node"\n    return "human_fallback_node"`,
        },
      },
      {
        heading: '3. Lessons from Production',
        paragraphs: [
          'Docker container spin-up overhead (even with python:3.11-slim) required pre-warmed container pooling and a zero-delay local subprocess runner fallback for developer environments without Docker daemons.',
          'Tree-sitter AST queries proved 10x faster than regex or Python native ast.parse for polyglot import extraction across thousands of repository files.',
        ],
        callout: {
          type: 'tip',
          title: 'Benchmark',
          text: 'Bounded 3-turn self-healing resolved 82% of syntax and import mismatches without requiring human intervention.',
        },
      },
    ],
  },
  {
    slug: 'rag-from-scratch-without-frameworks',
    title: 'Why We Built a Production RAG Engine from Scratch Without Frameworks',
    subtitle: 'Escaping framework lock-in: recursive chunking, ChromaDB vector indexing, and synthetic CI evals.',
    date: 'Oct 2026',
    readTime: '4 min read',
    category: 'AI & Information Retrieval',
    badge: 'Production Deployed',
    tags: ['RAG', 'ChromaDB', 'FastAPI', 'Gemini Embeddings', 'CI/CD Evals'],
    summary:
      'Frameworks like LangChain make getting started easy, but obscure performance bottlenecks and error handling. Here is why writing our own ingestion, chunking, and evaluation harness resulted in a leaner, more verifiable retrieval engine.',
    sections: [
      {
        heading: '1. The Hidden Cost of Abstraction Layers',
        paragraphs: [
          'When building a production RAG system, 80% of real-world bugs stem from chunking boundary truncation, vector distance calibration, and silent context degradation. Third-party chain wrappers make inspecting raw embedding payloads and vector similarities painful to debug.',
          'By relying purely on FastAPI, ChromaDB, and the official Google GenAI SDK, our codebase went from 40 transitive dependencies to 6, with instantaneous startup times and zero mystery latency.',
        ],
      },
      {
        heading: '2. Recursive Chunking & Source-Grounding Guardrails',
        paragraphs: [
          'We implemented recursive character chunking with an explicit 1,000-character window and 200-character sliding overlap, prioritizing natural paragraph and sentence boundaries.',
          'Every synthesized answer is forced to return verbatim excerpt citations with similarity distance metrics. If the cosine similarity drops below 0.68, the model responds with an honest "Information not found in ingested context" rather than hallucinating.',
        ],
        codeSnippet: {
          language: 'python',
          caption: 'Strict retrieval guardrail with similarity threshold',
          code: `def query_context(query: str, top_k: int = 4, threshold: float = 0.68):\n    query_vector = embed_text(query)\n    results = vector_db.query(\n        query_embeddings=[query_vector],\n        n_results=top_k\n    )\n    valid_chunks = [\n        chunk for chunk, dist in zip(results['documents'][0], results['distances'][0])\n        if (1.0 - dist) >= threshold\n    ]\n    if not valid_chunks:\n        return None, "NO_GROUNDED_CONTEXT"\n    return assemble_context(valid_chunks), "VALID"`,
        },
      },
      {
        heading: '3. Automated Synthetic CI Evaluation',
        paragraphs: [
          'Rather than relying on vibes to test prompt changes, we created an eval.py script in our CI pipeline. On every git push, it samples 30 random document chunks, synthesizes questions, tests retrieval hit-rates, and fails the build if answer citation accuracy drops below 95%.',
        ],
        callout: {
          type: 'note',
          title: 'CI Gate',
          text: 'Synthetic evaluation prevents retrieval regressions before new prompt configurations ever hit staging.',
        },
      },
    ],
  },
  {
    slug: 'writing-concurrent-http-server-pure-python',
    title: 'Writing a Concurrent HTTP/1.1 Server in Pure Python from Sockets Up',
    subtitle: 'Demystifying TCP sockets, thread pooling, HTTP keep-alive, and chunked transfer encoding.',
    date: 'Sep 2026',
    readTime: '4 min read',
    category: 'Systems & Networking',
    badge: 'Zero Dependencies',
    tags: ['Sockets', 'TCP/IP', 'HTTP/1.1', 'Threading', 'Concurrency'],
    summary:
      'Understanding high-level web frameworks begins with understanding the socket layer. We built a zero-dependency HTTP/1.1 server implementing connection pooling, binary file streaming, and HTTP protocol compliance.',
    sections: [
      {
        heading: '1. Peeling Back the Protocol',
        paragraphs: [
          'Modern frameworks like Express, FastAPI, and Next.js hide the mechanics of byte streams. But beneath every web API is a stream of raw bytes arriving over an OS file descriptor. Parsing headers manually teaches you how HTTP/1.1 actually works: CRLF delimiters, Content-Length boundaries, and connection state.',
        ],
      },
      {
        heading: '2. Thread Pool Architecture & Persistent Connections',
        paragraphs: [
          'To handle concurrent clients without spawning runaway threads that overwhelm the OS, we implemented a bounded ThreadPoolExecutor combined with SO_REUSEADDR socket options.',
          'Supporting Connection: keep-alive required maintaining client socket state across multiple request/response cycles with a strict 15-second idle timeout.',
        ],
        codeSnippet: {
          language: 'python',
          caption: 'Bounded socket listener with thread worker pool',
          code: `def start_server(host: str = "0.0.0.0", port: int = 8080, max_workers: int = 16):\n    server_sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    server_sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\n    server_sock.bind((host, port))\n    server_sock.listen(128)\n    \n    with ThreadPoolExecutor(max_workers=max_workers) as pool:\n        while True:\n            client_sock, addr = server_sock.accept()\n            pool.submit(handle_client_connection, client_sock, addr)`,
        },
      },
      {
        heading: '3. What High-Level Frameworks Get Right',
        paragraphs: [
          'Writing your own socket server gives you immense respect for production ASGI/WSGI servers like Uvicorn and Gunicorn. Managing TLS handshakes, chunked multipart uploads, and memory buffers at scale is where production servers truly shine.',
        ],
        callout: {
          type: 'tip',
          title: 'Takeaway',
          text: 'Building low-level systems is the fastest way to become fearless when debugging production network errors.',
        },
      },
    ],
  },
];
