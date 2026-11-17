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
    badge: '100Agents Winner (1st / 650 teams)',
    tags: ['LangGraph', 'Docker', 'Python 3.12', 'Tree-sitter'],
    summary:
      'How we architected Syntactiq: an autonomous multi-agent platform using LangGraph StateGraph, Tree-sitter AST cycle-breaking, and isolated Docker sandbox verification.',
    sections: [
      {
        heading: '1. Deterministic Multi-Agent Pipelines',
        paragraphs: [
          'Naive LLM refactoring frequently invents invalid module paths and breaks circular imports. To solve this, Syntactiq coordinates Architect, Coder, and Tester nodes across a compiled LangGraph StateGraph.',
          'Every migration runs inside disposable, zero-network Docker sandboxes. Failures trigger a bounded 3-turn diagnostic loop with compiler traceback injection rather than blindly hallucinating fixes.',
        ],
        callout: {
          type: 'highlight',
          title: 'Core Rule',
          text: 'Every LLM code modification must pass AST syntax parsing and automated sandbox pytest verification before opening a PR.',
        },
      },
      {
        heading: '2. Ephemeral Sandbox & StateGraph Routing',
        paragraphs: [
          'The state machine routes files through verification nodes. When tests pass, atomic commits are staged via the GitHub Git Data API; on assertion failure, tracebacks feed the self-healing node.',
        ],
        codeSnippet: {
          language: 'python',
          caption: 'StateGraph verification router',
          code: `@dataclass\nclass MigrationState:\n    file_path: str\n    ast_tree: Any\n    modernized_code: str = ""\n    retry_count: int = 0\n    is_verified: bool = False\n\ndef route_verification(state: MigrationState) -> str:\n    if state.is_verified:\n        return "git_commit_node"\n    if state.retry_count < 3:\n        return "self_heal_retry_node"\n    return "human_fallback_node"`,
        },
      },
      {
        heading: '3. Production Benchmarks',
        paragraphs: [
          'Tree-sitter queries proved 10x faster than native ast.parse for polyglot import extraction across thousands of repository files.',
        ],
        callout: {
          type: 'tip',
          title: 'Benchmark',
          text: 'Bounded 3-turn self-healing resolved 82% of syntax errors without human intervention.',
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
    tags: ['Sockets', 'TCP/IP', 'HTTP/1.1', 'Threading'],
    summary:
      'Understanding high-level frameworks begins at the socket layer. We built a zero-dependency concurrent HTTP/1.1 server implementing keep-alive and connection pooling.',
    sections: [
      {
        heading: '1. Raw Sockets & Protocol Parsing',
        paragraphs: [
          'Modern web APIs abstract away socket file descriptors. Writing a raw socket listener teaches you the true mechanics of HTTP/1.1: CRLF byte delimiters, chunked streaming, and connection state management.',
          'A bounded ThreadPoolExecutor combined with SO_REUSEADDR socket options prevents thread exhaustion during traffic spikes.',
        ],
      },
      {
        heading: '2. Thread Pool & Persistent Connections',
        paragraphs: [
          'Supporting Connection: keep-alive required maintaining socket state across multiple request/response cycles with a strict 15-second idle timeout.',
        ],
        codeSnippet: {
          language: 'python',
          caption: 'Socket listener with worker thread pool',
          code: `def start_server(host: str = "0.0.0.0", port: int = 8080, max_workers: int = 16):\n    sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)\n    sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)\n    sock.bind((host, port))\n    sock.listen(128)\n    \n    with ThreadPoolExecutor(max_workers=max_workers) as pool:\n        while True:\n            client_sock, addr = sock.accept()\n            pool.submit(handle_client_connection, client_sock, addr)`,
        },
      },
      {
        heading: '3. Architectural Takeaways',
        paragraphs: [
          'Building low-level systems is the fastest way to become fearless when debugging production timeouts, TCP resets, and proxy bottlenecks.',
        ],
        callout: {
          type: 'tip',
          title: 'Takeaway',
          text: 'Mastering the socket layer demystifies ASGI/WSGI servers like Uvicorn and Gunicorn.',
        },
      },
    ],
  },
];
