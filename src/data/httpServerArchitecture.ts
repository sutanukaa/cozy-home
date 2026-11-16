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

export interface HttpServerInvariant {
  id: number;
  invariant: string;
  enforcement: string;
  failureImpact: string;
}

export interface HttpServerLimit {
  limit: string;
  value: string;
  overLimitBehavior: string;
}

export interface HttpStatusMapping {
  code: number;
  phrase: string;
  trigger: string;
}

export interface HttpParserTransition {
  currentState: string;
  inputByte: string;
  nextState: string;
  bufferAction: string;
  errorCondition: string;
}

export const httpServerInvariants: HttpServerInvariant[] = [
  {
    id: 1,
    invariant: 'Bounded Memory',
    enforcement: 'Zero allocation on request path. Every buffer sized at startup with mmap guard pages. Memory ceiling = worker count × ~88 KiB.',
    failureImpact: 'Eliminates memory leaks, fragmentation, and out-of-memory crashes under traffic surges.',
  },
  {
    id: 2,
    invariant: 'Bounded Time',
    enforcement: 'Every wait has an absolute deadline measured on CLOCK_MONOTONIC: recv, send, sendfile, idle keep-alive, and lingering close.',
    failureImpact: 'Prevents slowloris and slow-client attacks from holding worker threads indefinitely.',
  },
  {
    id: 3,
    invariant: 'Descriptor Ownership',
    enforcement: 'Accepted socket moves strictly main thread → queue → single worker. File descriptor belongs to worker. Closed exactly once on all exits.',
    failureImpact: 'Prevents descriptor leaks, double-close races, and CLOSE_WAIT accumulation.',
  },
  {
    id: 4,
    invariant: 'Parser Safety & Split Invariance',
    enforcement: 'Parser reads only buf[0..filled), writes only its own state struct, and produces {offset, len} slices. Results are invariant to TCP packet splitting.',
    failureImpact: 'Immune to buffer overruns, off-by-one reads, and partial-packet desync vulnerabilities.',
  },
  {
    id: 5,
    invariant: 'Framing Integrity',
    enforcement: 'Connection reused only if previous message was fully framed and consumed. Any parsing ambiguity or smuggle indicator forces Connection: close.',
    failureImpact: 'Guarantees absolute immunity against HTTP request smuggling and response splitting.',
  },
  {
    id: 6,
    invariant: 'Kernel-Enforced Path Containment',
    enforcement: 'openat2() with RESOLVE_BENEATH and RESOLVE_NO_SYMLINKS relative to root_fd. Sanitization layer lints dot segments before syscall.',
    failureImpact: 'Mathematically prevents directory traversal (../), symlink escape, and race-condition escapes.',
  },
  {
    id: 7,
    invariant: 'Response Integrity',
    enforcement: 'Body bytes sent must exactly equal declared Content-Length. If sendfile() is truncated by file modification, connection is aborted immediately.',
    failureImpact: 'Prevents corrupted TCP streams from delivering truncated bodies to keep-alive clients.',
  },
  {
    id: 8,
    invariant: 'No Signal-Induced Death',
    enforcement: 'SIGPIPE ignored process-wide. Termination signals (SIGINT/SIGTERM) blocked on workers, handled exclusively on main thread via self-pipe.',
    failureImpact: 'Prevents peer disconnects from killing the server and ensures clean graceful drain on shutdown.',
  },
];

export const httpServerLimits: HttpServerLimit[] = [
  { limit: 'METHOD_MAX', value: '16 bytes', overLimitBehavior: '501 Not Implemented' },
  { limit: 'URI_MAX', value: '8192 bytes (RFC 9112)', overLimitBehavior: '414 URI Too Long' },
  { limit: 'HEAD_MAX', value: '16384 bytes (Request line + headers)', overLimitBehavior: '431 Request Header Fields Too Large (414 if in reqline)' },
  { limit: 'MAX_HEADERS', value: '64 entries (16 bytes each)', overLimitBehavior: '431 Request Header Fields Too Large' },
  { limit: 'BODY_MAX', value: '65536 bytes (64 KiB buffer ceiling)', overLimitBehavior: '413 Content Too Large (evaluated before body read)' },
  { limit: 'HEAD_TIMEOUT', value: '10 s from first byte', overLimitBehavior: '408 Request Timeout, lingering close' },
  { limit: 'IDLE_TIMEOUT', value: '5 s (adaptive under load)', overLimitBehavior: 'Silent close, frees worker immediately' },
  { limit: 'BODY_TIMEOUT', value: '15 s', overLimitBehavior: '408 Request Timeout, then close' },
  { limit: 'SEND_STALL', value: '10 s without forward progress', overLimitBehavior: 'Abort connection immediately' },
  { limit: 'KEEPALIVE_MAX', value: '100 requests per connection', overLimitBehavior: 'Connection: close on the 100th response' },
  { limit: 'QCAP', value: '1024 task queue slots', overLimitBehavior: '503 Service Unavailable shed with pre-built constant' },
  { limit: 'LINGER_DRAIN', value: '2 s or 64 KiB drained', overLimitBehavior: 'close() socket descriptor' },
  { limit: 'WORKERS', value: 'clamp(2 × cpu_count, 8, 256)', overLimitBehavior: 'Fixed pre-threaded worker pool' },
];

export const httpStatusMappings: HttpStatusMapping[] = [
  { code: 200, phrase: 'OK', trigger: 'Static file served successfully, or HEAD of servable file' },
  { code: 301, phrase: 'Moved Permanently', trigger: 'Directory requested without trailing slash (Location: path/)' },
  { code: 304, phrase: 'Not Modified', trigger: 'Conditional request matched (If-None-Match weak ETag comparison)' },
  { code: 400, phrase: 'Bad Request', trigger: 'Malformed syntax, missing/duplicate Host, space before colon, smuggling indicator' },
  { code: 403, phrase: 'Forbidden', trigger: '.. segment, dotfile (.git, .env), containment violation, permission denied' },
  { code: 404, phrase: 'Not Found', trigger: 'File does not exist, directory without index.html, non-regular file' },
  { code: 405, phrase: 'Method Not Allowed', trigger: 'Known method not permitted on resource (POST on static file; carries Allow)' },
  { code: 408, phrase: 'Request Timeout', trigger: 'Absolute HEAD_TIMEOUT or BODY_TIMEOUT deadline expired' },
  { code: 411, phrase: 'Length Required', trigger: 'POST request without Content-Length header' },
  { code: 413, phrase: 'Content Too Large', trigger: 'Declared Content-Length exceeds BODY_MAX (64 KiB)' },
  { code: 414, phrase: 'URI Too Long', trigger: 'Request target exceeds URI_MAX (8192 bytes)' },
  { code: 431, phrase: 'Request Header Fields Too Large', trigger: 'Header bytes exceed HEAD_MAX or header count > 64' },
  { code: 500, phrase: 'Internal Server Error', trigger: 'Header buffer truncation in snprintf, unexpected system errno' },
  { code: 501, phrase: 'Not Implemented', trigger: 'Unknown method (case-sensitive), any Transfer-Encoding request' },
  { code: 503, phrase: 'Service Unavailable', trigger: 'Task queue full, descriptor exhaustion (EMFILE), server shutting down' },
  { code: 505, phrase: 'HTTP Version Not Supported', trigger: 'Major version other than 1 (e.g. HTTP/2.0, HTTP/0.9)' },
];

export const httpParserTransitions: HttpParserTransition[] = [
  { currentState: 'START', inputByte: 'tchar', nextState: 'READ_METHOD', bufferAction: 'method.off = i, method.len = 1', errorCondition: 'none' },
  { currentState: 'START', inputByte: 'CR', nextState: 'START_LF', bufferAction: 'none', errorCondition: 'more than one leading blank line: 400' },
  { currentState: 'START_LF', inputByte: 'LF', nextState: 'START', bufferAction: 'blank_lines++', errorCondition: 'any other byte: 400' },
  { currentState: 'READ_METHOD', inputByte: 'tchar', nextState: 'READ_METHOD', bufferAction: 'extend method', errorCondition: 'method.len > 16: 501' },
  { currentState: 'READ_METHOD', inputByte: 'SP', nextState: 'READ_URI', bufferAction: 'close method slice, classify GET/HEAD/POST, uri.off = i + 1', errorCondition: 'any other byte: 400' },
  { currentState: 'READ_URI', inputByte: 'VCHAR', nextState: 'READ_URI', bufferAction: 'extend uri', errorCondition: 'uri.len > 8192: 414' },
  { currentState: 'READ_URI', inputByte: 'SP', nextState: 'READ_VERSION', bufferAction: 'close uri slice, ver.off = i + 1, ver.len = 0', errorCondition: 'uri.len == 0: 400' },
  { currentState: 'READ_URI', inputByte: 'CR, LF, HT, CTL, OBS', nextState: 'HTTP_ERROR', bufferAction: 'none', errorCondition: '400 (rejects HTTP/0.9 requests with no version)' },
  { currentState: 'READ_VERSION', inputByte: 'VCHAR', nextState: 'READ_VERSION', bufferAction: 'extend version', errorCondition: 'ver.len > 8: 400' },
  { currentState: 'READ_VERSION', inputByte: 'CR', nextState: 'REQLINE_LF', bufferAction: 'validate slice as HTTP/digit.digit, set minor', errorCondition: 'malformed: 400; major != 1: 505' },
  { currentState: 'REQLINE_LF', inputByte: 'LF', nextState: 'CRLF_CHECK', bufferAction: 'none', errorCondition: 'bare CR: 400' },
  { currentState: 'CRLF_CHECK', inputByte: 'tchar', nextState: 'READ_HEADER_KEY', bufferAction: 'key.off = i, key.len = 1', errorCondition: 'nhdr >= 64: 431' },
  { currentState: 'CRLF_CHECK', inputByte: 'CR', nextState: 'FINAL_LF', bufferAction: 'none', errorCondition: 'none' },
  { currentState: 'CRLF_CHECK', inputByte: 'SP or HT', nextState: 'HTTP_ERROR', bufferAction: 'none', errorCondition: 'obsolete line folding: 400' },
  { currentState: 'READ_HEADER_KEY', inputByte: 'tchar', nextState: 'READ_HEADER_KEY', bufferAction: 'extend key', errorCondition: 'none' },
  { currentState: 'READ_HEADER_KEY', inputByte: 'colon', nextState: 'READ_HEADER_OWS', bufferAction: 'close key slice', errorCondition: 'none' },
  { currentState: 'READ_HEADER_KEY', inputByte: 'SP or HT', nextState: 'HTTP_ERROR', bufferAction: 'none', errorCondition: 'whitespace before colon: 400' },
  { currentState: 'READ_HEADER_OWS', inputByte: 'SP or HT', nextState: 'READ_HEADER_OWS', bufferAction: 'skip optional whitespace', errorCondition: 'none' },
  { currentState: 'READ_HEADER_OWS', inputByte: 'VCHAR or OBS', nextState: 'READ_HEADER_VAL', bufferAction: 'val.off = i, val.len = 1', errorCondition: 'none' },
  { currentState: 'READ_HEADER_OWS', inputByte: 'CR', nextState: 'HEADER_LF', bufferAction: 'val is empty slice', errorCondition: 'none' },
  { currentState: 'READ_HEADER_VAL', inputByte: 'value byte', nextState: 'READ_HEADER_VAL', bufferAction: 'extend value', errorCondition: 'head > HEAD_MAX: 431' },
  { currentState: 'READ_HEADER_VAL', inputByte: 'CR', nextState: 'HEADER_LF', bufferAction: 'trim trailing SP and HT from value', errorCondition: 'none' },
  { currentState: 'READ_HEADER_VAL', inputByte: 'LF or CTL', nextState: 'HTTP_ERROR', bufferAction: 'none', errorCondition: 'bare LF or NUL/control byte: 400' },
  { currentState: 'HEADER_LF', inputByte: 'LF', nextState: 'CRLF_CHECK', bufferAction: 'push {key, val}, nhdr++', errorCondition: 'bare CR: 400' },
  { currentState: 'FINAL_LF', inputByte: 'LF', nextState: 'READ_BODY or DISPATCH', bufferAction: 'head_end = i + 1, run semantic validation', errorCondition: 'validation failure: 400, 411, 413, or 501' },
  { currentState: 'READ_BODY', inputByte: 'counted block', nextState: 'DISPATCH', bufferAction: 'consume min(available, remaining) bytes', errorCondition: 'deadline expired: 408' },
  { currentState: 'DISPATCH', inputByte: 'none', nextState: 'START or close', bufferAction: 'handler runs, consume() shifts pipelined bytes', errorCondition: 'none' },
];

export const httpServerDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'POSIX Socket Lifecycle & Concurrency Pipeline',
    tabLabel: 'Socket & Pool Pipeline',
    badge: 'Thread Pool & Network I/O',
    mermaid: `flowchart LR
  subgraph CLI["Client and TCP stream"]
    CL["Client<br/>SYN, ACK, request bytes"]
    KQ["Kernel accept queue<br/>completed handshakes<br/>size min(backlog, somaxconn)"]
  end

  subgraph LIS["Listener and socket API, main thread"]
    L1["socket<br/>AF_INET, SOCK_STREAM, SOCK_NONBLOCK, SOCK_CLOEXEC"]
    L2["setsockopt<br/>SO_REUSEADDR"]
    L3["bind<br/>0.0.0.0:8080"]
    L4["listen<br/>backlog SOMAXCONN"]
    L5["poll<br/>listen fd and wake pipe"]
    L6["accept4 loop<br/>drain until EAGAIN"]
    L7["Per-connection setup<br/>TCP_NODELAY, deadline stamp"]
    D0{"Queue has room"}
    SG["SIGINT or SIGTERM<br/>handler writes wake pipe"]
    GS["Graceful shutdown<br/>close listener, set closed flag, broadcast, join"]
  end

  subgraph POOL["Thread pool and concurrency"]
    Q["Task queue<br/>ring buffer of fds<br/>mutex and condition variable"]
    WK["Worker thread, N identical<br/>cond wait, pop fd, own buffers"]
    R1["recv loop<br/>poll with absolute deadline"]
    D1{"Keep-alive"}
    C1["Lingering close<br/>shutdown SHUT_WR, drain, close"]
  end

  subgraph PRS["Request parser"]
    P1["HTTP DFA<br/>zero-copy slices, see diagram 2"]
  end

  subgraph FIO["File system and I/O"]
    H1["Process request<br/>route, static handler, see diagram 3"]
    S1["send and sendfile<br/>poll POLLOUT on EAGAIN"]
  end

  X1["Rejected: 503 shed, queue full or EMFILE"]
  X2["Rejected: 4xx or 5xx from parser or handler"]
  X3["Rejected: timeout 408, peer reset, EPIPE"]

  CL -->|"three-way handshake in kernel"| KQ
  L1 --> L2
  L2 --> L3
  L3 --> L4
  L4 --> L5
  KQ -->|"listen fd readable"| L5
  L5 -->|"readable"| L6
  L6 -->|"client fd"| L7
  L7 --> D0
  D0 -->|"yes: lock, push, unlock, signal"| Q
  Q -->|"wakes one worker"| WK
  WK --> R1
  R1 -->|"bytes appended to rbuf"| P1
  P1 -->|"DISPATCH"| H1
  H1 --> S1
  S1 --> D1
  D1 -->|"yes: reset parser, next request"| R1
  D1 -->|"no: close requested or limit reached"| C1
  L6 -->|"EAGAIN: wait again"| L5
  SG --> L5
  L5 -->|"wake pipe readable"| GS
  GS -->|"closed flag, broadcast"| Q
  D0 -.->|"full"| X1
  L6 -.->|"EMFILE or ENFILE"| X1
  P1 -.->|"malformed"| X2
  H1 -.->|"handler error status"| X2
  X2 -.->|"error response, then close"| C1
  R1 -.->|"deadline or ECONNRESET"| X3
  S1 -.->|"EPIPE or ECONNRESET"| X3
  X3 -.->|"close without response"| C1

  classDef client fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef listener fill:#DCFCE7,stroke:#86EFAC,color:#1E293B
  classDef pool fill:#EDE9FE,stroke:#C4B5FD,color:#1E293B
  classDef parser fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B
  classDef io fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef err fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class CL,KQ client
  class L1,L2,L3,L4,L5,L6,L7,D0,SG,GS listener
  class Q,WK,R1,D1,C1 pool
  class P1 parser
  class H1,S1 io
  class X1,X2,X3 err

  linkStyle 22,23,24,25,26,27,28,29 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'The listener thread operates on non-blocking sockets with accept4() in a tight drain loop, setting TCP_NODELAY immediately and offloading accepted fds into a fixed-capacity ring buffer queue guarded by a mutex and condition variable. Pre-threaded worker threads pop fds without allocation, executing a poll()-driven recv loop bounded by absolute monotonic deadlines.',
    failureModes:
      'Descriptor exhaustion (EMFILE) is mitigated via a pre-allocated spare /dev/null descriptor closed temporarily to accept and shed with 503. Slowloris drip attacks fail against absolute monotonic HEAD_TIMEOUT. Idle keep-alive connections are dynamically dropped when queue depth spikes. Lingering close drains up to 64 KiB or 2s to prevent client RST generation.',
    tradeOffs:
      'A pre-threaded worker pool provides strict memory bounding (~88 KiB per worker) and linear, easily auditable control flow compared to epoll state machines. While epoll supports tens of thousands of idle connections per core, blocking-style workers are optimal for controlled workloads with hard memory ceilings and bounded concurrency.',
  },
  {
    id: 2,
    title: 'Zero-Copy HTTP Protocol Parser State Machine',
    tabLabel: 'HTTP/1.1 Parser DFA',
    badge: 'Deterministic Finite Automaton',
    mermaid: `stateDiagram-v2
  classDef parser fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B
  classDef io fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef err fill:#FFE4E6,stroke:#EF4444,stroke-dasharray:5 5,color:#7F1D1D

  [*] --> START : new connection or next keep-alive request
  START --> START_LF : CR, one leading blank line allowed
  START_LF --> START : LF
  START --> READ_METHOD : tchar, mark method start
  READ_METHOD --> READ_METHOD : tchar, extend method slice
  READ_METHOD --> READ_URI : SP, close method slice
  READ_URI --> READ_URI : VCHAR, extend uri slice
  READ_URI --> READ_VERSION : SP, close uri slice
  READ_VERSION --> READ_VERSION : VCHAR, extend version slice
  READ_VERSION --> REQLINE_LF : CR, validate HTTP/1.x
  REQLINE_LF --> CRLF_CHECK : LF
  CRLF_CHECK --> READ_HEADER_KEY : tchar, mark key start
  READ_HEADER_KEY --> READ_HEADER_KEY : tchar, extend key slice
  READ_HEADER_KEY --> READ_HEADER_OWS : colon, close key slice
  READ_HEADER_OWS --> READ_HEADER_OWS : SP or HT, skip
  READ_HEADER_OWS --> READ_HEADER_VAL : value byte, mark value start
  READ_HEADER_OWS --> HEADER_LF : CR, empty value
  READ_HEADER_VAL --> READ_HEADER_VAL : value byte, extend value slice
  READ_HEADER_VAL --> HEADER_LF : CR, trim trailing SP and HT
  HEADER_LF --> CRLF_CHECK : LF, push header pair
  CRLF_CHECK --> FINAL_LF : CR, empty line begins
  FINAL_LF --> READ_BODY : LF, head valid and Content-Length above zero
  FINAL_LF --> DISPATCH : LF, head valid and no body
  READ_BODY --> DISPATCH : body bytes received equal Content-Length
  DISPATCH --> START : response sent, keep-alive, reset parser
  DISPATCH --> [*] : close requested
  READ_METHOD --> HTTP_ERROR : bad byte 400, method too long 501
  READ_URI --> HTTP_ERROR : empty or too long 414, control byte 400
  READ_VERSION --> HTTP_ERROR : malformed 400, major not 1 gives 505
  READ_HEADER_KEY --> HTTP_ERROR : space before colon 400
  READ_HEADER_VAL --> HTTP_ERROR : bare LF or control byte 400
  CRLF_CHECK --> HTTP_ERROR : obsolete folding 400, too many headers 431
  FINAL_LF --> HTTP_ERROR : Host or framing or size violation 400 411 413 501
  READ_BODY --> HTTP_ERROR : deadline expired 408
  HTTP_ERROR --> [*] : send error response, lingering close

  class START,START_LF,READ_METHOD,READ_URI,READ_VERSION,REQLINE_LF,CRLF_CHECK,READ_HEADER_KEY,READ_HEADER_OWS,READ_HEADER_VAL,HEADER_LF,FINAL_LF,READ_BODY parser
  class DISPATCH io
  class HTTP_ERROR err`,
    interactions:
      'The parser is a pure deterministic finite automaton over a 256-entry byte-class table (CLS) operating strictly on slice_t {offset, len} structures referencing the contiguous receive buffer. It requires no dynamic memory allocation and maintains split invariance across arbitrary recv() boundaries.',
    failureModes:
      'Rejects HTTP request smuggling vectors: forbids Transfer-Encoding combined with Content-Length, rejects conflicting duplicate Content-Length headers, forbids whitespace preceding header colons, bans obsolete line folding (OBS-FOLD), and terminates immediately on bare LFs or control bytes.',
    tradeOffs:
      'Zero-copy slice offsets remain valid strictly until the subsequent consume() call shifts pipelined bytes with memmove(). Hand-written state transitions prioritize auditability and zero dependencies over SSE4.2 SIMD vectorization.',
  },
  {
    id: 3,
    title: 'Static File Streaming & Header Assembly Pipeline',
    tabLabel: 'File I/O & Streaming',
    badge: 'Kernel Zero-Copy Sendfile',
    mermaid: `sequenceDiagram
  autonumber
  participant C as Client
  participant W as Worker thread
  participant M as MIME table
  participant FS as Kernel VFS and page cache
  participant N as Kernel TCP socket

  rect rgb(204, 251, 241)
    Note over W: DISPATCH reached, request GET /img/logo.png HTTP/1.1, Host present
  end

  rect rgb(237, 233, 254)
    W->>W: split query, percent-decode once, reject NUL and control bytes, reject dot segments, collapse slashes
  end

  alt unsafe or malformed path
    rect rgb(255, 228, 230)
      W->>N: 400 or 403 with Connection close
      N->>C: error response
    end
  else path accepted
    rect rgb(254, 243, 199)
      W->>FS: openat2 root_fd, relpath, RESOLVE_BENEATH and RESOLVE_NO_SYMLINKS, O_RDONLY, O_CLOEXEC, O_NONBLOCK
    end
    alt open failed
      rect rgb(255, 228, 230)
        FS-->>W: ENOENT or ENOTDIR gives 404, EACCES or EXDEV or ELOOP gives 403, EMFILE gives 503
        W->>N: error response
        N->>C: status line and headers
      end
    else fd opened
      W->>FS: fstat fd
      FS-->>W: st_mode, st_size, st_mtime
      Note over W: require S_ISREG, a directory gives 301 or an index.html retry
      W->>M: lookup extension, case-insensitive FNV-1a probe
      M-->>W: Content-Type, or application/octet-stream
      alt conditional request matches
        W->>N: send 304 headers only, no MSG_MORE
        N->>C: 304 Not Modified
      else full response
        W->>W: snprintf headers into worker buffer, check return value against buffer size
        W->>N: send headers with MSG_MORE and MSG_NOSIGNAL
        loop until sent equals st_size
          W->>FS: sendfile sock, fd, offset, min of remaining and 1 MiB
          FS->>N: page cache pages queued to socket
          N->>C: TCP segments
          Note over W: EAGAIN gives poll POLLOUT with deadline, EINTR retries
        end
      end
      W->>FS: close file fd
    end
  end

  alt connection stays open
    Note over W: keep-alive, return to recv with idle deadline
  else close
    W->>N: shutdown SHUT_WR
    N->>C: FIN
    W->>N: recv and discard until EOF or 2 s
    W->>N: close socket fd
  end`,
    interactions:
      'Path processing decodes percent-encoded bytes exactly once, sanitizing NULs and dot segments before passing the relative path to openat2() with RESOLVE_BENEATH and RESOLVE_NO_SYMLINKS. fstat() validates regular file status. Headers are assembled with snprintf() truncation guards, flushed with MSG_MORE, and the payload is streamed directly from kernel page cache via sendfile() in 1 MiB chunks.',
    failureModes:
      'Kernel-level path traversal defense eliminates TOCTOU races with concurrent renames. If a file is truncated during transfer, sendfile() returns early; the connection is aborted immediately without reuse to maintain response framing integrity. EAGAIN on full socket buffers triggers poll(POLLOUT) bounded by SEND_STALL.',
    tradeOffs:
      'sendfile() avoids user-space context switches and cache pollution entirely. For small files (<32 KiB), pread() combined with writev() saves syscall overhead. An in-memory MIME table with FNV-1a linear probing avoids disk lookups on hot paths.',
  },
];
