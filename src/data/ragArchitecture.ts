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

export const ragConstants = [
  { name: 'CHUNK_SIZE / CHUNK_OVERLAP / Stride', value: '1000 / 200 / 800 characters' },
  { name: 'Embedding Model & Dims', value: 'gemini-embedding-001, Matryoshka-truncated to 768-dim' },
  { name: 'Task Types', value: 'RETRIEVAL_DOCUMENT (Ingest), RETRIEVAL_QUERY (Query)' },
  { name: 'Candidate Retrieval (K_fuse)', value: '20 per retriever (Dense & Sparse)' },
  { name: 'RRF Smoothing Constant', value: '60' },
  { name: 'Reranker Output (TOP_K)', value: '5 chunks' },
  { name: 'Synthetic CI Eval Gate', value: 'N = 8 chunks, fail if mean keyword recall < 50%' },
];

export const ragDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'Complete System Architecture and Container Topology',
    tabLabel: '01 · System Topology',
    badge: 'Docker Compose · Multi-Container',
    mermaid: `flowchart LR
  user(["Browser\\nend user"])

  subgraph COMPOSE["Docker Compose network"]
    direction LR
    subgraph WEB["web container · Next.js · :3000"]
      direction TB
      ui("React chat UI\\nfetch + ReadableStream SSE reader")
      proxy("Server-side session proxy\\ninjects x-user and x-chats-secret")
    end
    subgraph API["api container · FastAPI · :8000"]
      direction TB
      router("Routers\\n/ingest · /ask · /ask/stream · /chats")
      pipeline("Retrieval pipeline\\nrewrite → hybrid → RRF → rerank")
      bm25("BM25Okapi\\nin-memory sparse index")
    end
    subgraph STATE["Persistent state"]
      direction TB
      chroma[("ChromaDB PersistentClient\\nHNSW · cosine · 768-dim\\nvolume ./chroma_db")]
      sqlite[("SQLite chats.sqlite3\\nuser, id, title, messages, updated")]
    end
  end

  subgraph GENAI["External · Google GenAI Cloud · HTTPS"]
    direction TB
    emb("gemini-embedding-001\\nembed_content")
    lite("gemini-flash-lite-latest\\nquery rewrite · rerank · eval")
    gen("gemini-flash-lite / gemini-1.5-pro\\ngrounded generation")
  end

  user -->|"HTTPS :3000"| ui
  ui -->|"fetch /api/* · JSON + session cookie"| proxy
  proxy -->|"POST /ask, /ask/stream · application/json"| router
  proxy -->|"POST /ingest · multipart PDF"| router
  proxy -->|"GET, POST /chats · x-user + x-chats-secret"| router
  router -.->|"SSE: sources → token* → done"| proxy
  proxy -.->|"text/event-stream pass-through"| ui

  router -->|"parameterized SQL · per-user rows"| sqlite
  router -->|"add: ids, embeddings 768-dim, documents, metadatas"| chroma
  router -->|"rebuild_bm25() after each ingest"| bm25
  router --> pipeline
  pipeline -->|"query vector 768-dim · n_results=20 · where source"| chroma
  chroma -->|"ids, documents, distances"| pipeline
  pipeline -->|"word tokens → top-20 scores"| bm25

  router -->|"contents ≤100 · RETRIEVAL_DOCUMENT → 768-dim"| emb
  pipeline -->|"RETRIEVAL_QUERY → 768-dim"| emb
  pipeline -->|"rewrite + rerank prompts → text / JSON index array"| lite
  router -->|"context + question → token stream"| gen

  classDef fe fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef llm fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  class user,ui,proxy fe
  class router,pipeline api
  class bm25,chroma,sqlite store
  class emb,lite,gen llm
  style COMPOSE fill:#F8FAFC,stroke:#94A3B8,stroke-width:2px,stroke-dasharray: 6 4
  style WEB fill:#EFF6FF,stroke:#2563EB,stroke-width:2px
  style API fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  style STATE fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  style GENAI fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px`,
    interactions:
      'The browser never communicates directly with FastAPI. Every call is routed through the Next.js container, whose server-side session handler resolves authenticated user identity and forwards requests with two trusted internal headers: x-user and x-chats-secret. The two containers are decoupled: web owns the UI and session state, while api owns retrieval, persistent data, and all Gemini LLM interactions, ensuring API keys never reach the client bundle. The only stateful pieces are the ./chroma_db volume (HNSW graph plus documents and metadata) and chats.sqlite3; the BM25 index is derived state held in the API process memory. Streaming responses flow back as text/event-stream, which the Next.js proxy pipes through unbuffered.',
    failureModes:
      'Three external dependencies can fail independently: the Google Gemini API (429s, 5xx, timeouts), the Chroma volume (a missing mount means an empty corpus after restart), and SQLite (file locking under concurrent writers). Each Gemini call site enforces an explicit timeout and its own degradation rule: query rewrite falls back to the raw user question, rerank falls back to RRF order, embedding failure aborts the request with a 5xx, and a mid-stream generation failure is reported in-band as an error SSE event because HTTP headers are already sent. Because BM25 lives in memory, the invariant to enforce is that it is rebuilt from the Chroma corpus on API startup as well as after each ingest, otherwise dense and sparse indexes silently diverge.',
    tradeOffs:
      'Operating without LangChain trades off generic pre-built wrappers for minimal, fully predictable latency: each request has a countable number of network hops (1 rewrite, 1 query embedding, 1 vector query, 1 rerank, 1 generation stream), each independently timed and loggable. Embedded Chroma plus SQLite keeps deployment to two lightweight containers and one volume, which is ideal for a single-node service but caps horizontal scaling: two API replicas would each maintain separate BM25 indexes and contend on SQLite file locks. The upgrade path to multi-node scale is a managed vector store (e.g. pgvector or Qdrant) and Postgres for chats.',
  },
  {
    id: 2,
    title: 'Dual-Index Ingestion Pipeline (Dense Vector + Sparse Lexical)',
    tabLabel: '02 · Ingestion Pipeline',
    badge: 'Batched Embeddings · BM25 Rebuild',
    mermaid: `flowchart TD
  client(["Client\\nmultipart/form-data · file=*.pdf"])

  subgraph API["FastAPI · POST /ingest"]
    direction TB
    handler("UploadFile handler\\nread bytes · validate PDF")
    extract("pypdf.PdfReader\\nextract_text() per page → one text stream")
    chunk("Recursive sliding-window chunker\\nsize 1000 · overlap 200 · stride 800")
    batch("Batcher\\nslices of 100 chunks")
    upsert("Collection write\\nids, embeddings, documents, metadatas")
    rebuild("rebuild_bm25()\\nBM25Okapi over word tokens, lowercased\\nsynchronous, full rebuild")
  end

  subgraph WIN["Sliding window · 20% overlap insurance"]
    direction LR
    w0["chunk 0\\nchars 0–1000"] ---|"200 shared"| w1["chunk 1\\nchars 800–1800"] ---|"200 shared"| w2["chunk 2\\nchars 1600–2600"]
  end

  subgraph GENAI["Google GenAI Cloud"]
    emb("gemini-embedding-001\\nembed_content · RETRIEVAL_DOCUMENT\\noutput dimensionality 768")
  end

  subgraph STORES["Dual index"]
    direction LR
    chroma[("ChromaDB persistent collection\\nHNSW · cosine · volume ./chroma_db\\nmetadata: source, chunk")]
    bm25[("BM25Okapi\\nin-memory lexical index")]
  end

  fail(["4xx / 5xx error response\\nabort before any index write"])

  client -->|"POST /ingest"| handler
  handler -->|"PDF bytes"| extract
  extract -->|"full text + filename"| chunk
  chunk --> WIN
  chunk -->|"N chunks: text, source, chunk index"| batch
  batch -->|"contents[≤100] · task_type=RETRIEVAL_DOCUMENT"| emb
  emb -->|"vectors: ≤100 × 768 float32"| upsert
  upsert -->|"persist HNSW + documents"| chroma
  chroma -->|"all documents (full corpus)"| rebuild
  rebuild --> bm25
  rebuild -->|"200 OK · JSON ingest summary"| client

  handler -.->|"not a PDF → 4xx"| fail
  extract -.->|"corrupt / encrypted / no text layer → 4xx"| fail
  emb -.->|"429 / 5xx after retries → 502"| fail

  classDef fe fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef llm fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef bad fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class client fe
  class handler,extract,chunk,batch,upsert,rebuild,w0,w1,w2 api
  class chroma,bm25 store
  class emb llm
  class fail bad
  style API fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  style WIN fill:#ECFDF5,stroke:#10B981,stroke-dasharray: 4 3
  style GENAI fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  style STORES fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  linkStyle 13,14,15 stroke:#DC2626,stroke-dasharray: 5 4`,
    interactions:
      'POST /ingest receives a multipart PDF, pypdf.PdfReader extracts raw text across all pages, and the chunker slides a 1,000-character window with a stride of 800, so adjacent chunks share 200 characters (~20%). That overlap serves as boundary insurance: sentences clipped at boundaries remain whole in at least one chunk, keeping dense embeddings and sparse BM25 tokens intact. Chunks are embedded in batches of 100 with task_type=RETRIEVAL_DOCUMENT, truncated to 768 dimensions, and committed to ChromaDB with {"source": filename, "chunk": index} metadata. Only after the dense write succeeds does rebuild_bm25() re-tokenize the corpus and atomically swap the in-memory BM25 index.',
    failureModes:
      'The pipeline admits no corrupt partial state: an ingestion request that crashes after 3 of 10 embedding batches leaves a partially indexed document that retrieves inconsistently. The enforced invariant embeds every batch upfront, commits to Chroma once, and uses deterministic IDs (filename-chunk_index) so retried uploads upsert cleanly instead of duplicating. Scanned PDFs with no OCR text return an immediate 400 error. Embedding calls utilize bounded exponential backoff on 429 rate limits, and synchronous BM25 rebuilding guarantees read-your-writes consistency for subsequent queries.',
    tradeOffs:
      'A character-based sliding window is deterministic, fast, and simple to audit, though it lacks structural awareness for tables and code snippets. Full in-memory BM25 rebuilding is O(corpus), which takes mere milliseconds for thousands of chunks but requires persistence at scale. Truncating gemini-embedding-001 to 768 dimensions reduces vector storage and HNSW RAM consumption by 4x versus the 3072-dimension default, while Matryoshka representation learning ensures semantic accuracy degrades gracefully.',
  },
  {
    id: 3,
    title: 'Multi-Stage Hybrid Retrieval, RRF Fusion and LLM Reranking',
    tabLabel: '03 · Hybrid Retrieval',
    badge: 'Reciprocal Rank Fusion · Cross-Encoder',
    mermaid: `flowchart TD
  q(["User question + chat history\\nfrom POST /ask or /ask/stream"])

  subgraph S0["Stage 0 · Conversational query rewrite"]
    direction TB
    rw("rewrite_question()\\ngemini-flash-lite-latest")
    raw("Raw question\\nfallback")
  end

  fan{{"Parallel fan-out\\nstandalone query"}}

  subgraph S1["Stage 1 · Candidate generation (optimise recall)"]
    direction LR
    subgraph DENSE["Dense retriever"]
      direction TB
      de("embed_content\\nRETRIEVAL_QUERY · 768-dim")
      dq[("ChromaDB HNSW\\ncosine · n_results = 20\\noptional where source")]
    end
    subgraph SPARSE["Sparse retriever"]
      direction TB
      st("Tokenize\\nword tokens, lowercase")
      sb[("BM25Okapi.get_scores\\ntop 20 by score")]
    end
  end

  rrf("Reciprocal Rank Fusion\\nRRF(d) = Σ over m of 1 / (60 + rank_m(d))\\nm ∈ dense, sparse")

  subgraph S2["Stage 2 · Listwise rerank (optimise precision)"]
    direction TB
    rr("Cross-encoder style reranker\\ngemini-flash-lite-latest\\none prompt: query + chunks [0]..[19]")
    parse{"JSON array parses?\\ne.g. 0, 3, 7, 1, 12"}
  end

  top5("TOP_K = 5 chunks")
  ctx("Prompt context assembly\\none header per document + chunk text")
  out(["To Grounded Generation\\nanswer synthesis"])

  q -->|"question + prior turns"| rw
  rw -->|"standalone search query"| fan
  rw -.->|"LLM error or timeout"| raw
  raw -.->|"use raw query"| fan

  fan -->|"query"| de
  de -->|"query vector 768-dim"| dq
  fan -->|"query"| st
  st -->|"token list"| sb

  dq -->|"20 ranked ids (rank 1 = best)"| rrf
  sb -->|"20 ranked ids (rank 1 = best)"| rrf
  rrf -->|"union ≤ 40 → sort by RRF desc → keep top 20"| rr
  rr -->|"raw model text"| parse
  parse -->|"yes: dedupe, bounds-check, take 5"| top5
  parse -.->|"no: fall back to RRF order, first 5"| top5
  top5 -->|"5 × text + metadata source, chunk"| ctx
  ctx --> out

  classDef fe fill:#DBEAFE,stroke:#2563EB,stroke-width:1.5px,color:#1E3A8A
  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef llm fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef bad fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class q,out fe
  class fan,st,rrf,parse,top5,ctx api
  class dq,sb store
  class rw,de,rr llm
  class raw bad
  style S0 fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  style S1 fill:#F8FAFC,stroke:#94A3B8,stroke-width:2px
  style DENSE fill:#FFFBEB,stroke:#D97706
  style SPARSE fill:#FFFBEB,stroke:#D97706
  style S2 fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  linkStyle 2,3,13 stroke:#DC2626,stroke-dasharray: 5 4`,
    interactions:
      'The conversational rewriter resolves anaphora (e.g., "what about the second clause?") using chat history, transforming follow-ups into standalone queries. Dense and sparse retrievers execute in parallel: the dense path embeds the query with RETRIEVAL_QUERY and retrieves the 20 nearest chunks from ChromaDB; the sparse path scores the query against BM25Okapi word frequencies for the top 20 exact matches. Reciprocal Rank Fusion (RRF) normalizes the candidate lists by rank score: 1 / (60 + rank). The top 20 fused candidates are numbered [0] to [19] and passed to gemini-flash-lite-latest in a single listwise prompt, which emits a JSON index array of the top 5 most relevant chunks.',
    failureModes:
      'Every LLM step has a deterministic failure exit: a query rewrite timeout falls back to the literal user question; a reranking failure falls back to raw RRF order truncated to TOP_K = 5. The rerank parser sanitizes output against 0 <= i < len(candidates) and deduplicates indices. Source document filtering is applied across both retrievers: natively via where={"source": filename} in ChromaDB, and via metadata masking in the BM25 candidate loop so foreign documents never leak into filtered queries.',
    tradeOffs:
      'RRF is chosen over score normalization because cosine similarity and BM25 scores operate on incomparable mathematical scales, where min-max normalization is easily skewed by outliers. A chunk ranked #1 on only one list scores 1/61 (~0.0164), while a chunk ranked #20 on both lists scores 2/80 (0.025), ensuring multi-retriever consensus outweighs isolated matches. Two-stage retrieval combines high recall from fast approximate nearest neighbors with the cross-encoder precision of an LLM reranker, reducing context length to ~5,000 characters and eliminating the "Lost in the Middle" syndrome.',
  },
  {
    id: 4,
    title: 'Grounded Answer Synthesis and SSE Streaming',
    tabLabel: '04 · SSE Synthesis',
    badge: 'Server-Sent Events · Real-Time',
    mermaid: `sequenceDiagram
  autonumber
  participant B as Browser (fetch + ReadableStream)
  participant N as Next.js proxy
  participant F as FastAPI /ask/stream
  participant R as Retrieval pipeline
  participant G as Gemini chat model

  B->>N: POST /api/ask/stream {question, history, source?}
  N->>F: POST /ask/stream · x-user, x-chats-secret
  F->>R: retrieve(question, history, source)
  R-->>F: top 5 chunks [{text, source, chunk}]

  Note over F: Assemble context: one header per document, chunk text beneath<br/>System rules: 1 use ONLY context · 2 cite [filename.pdf] · 3 suppress chunk indices · 4 refuse if absent

  F-->>N: 200 text/event-stream · Cache-Control no-cache · X-Accel-Buffering no
  F-->>N: data: {"type":"sources","sources":[{"source":"a.pdf","chunk":3}]}
  N-->>B: forward bytes unbuffered
  Note over B: Render citation chips before the first token

  F->>G: generate_content_stream(system rules + context + question)
  activate G
  loop each streamed delta
    G-->>F: text delta
    F-->>N: data: {"type":"token","text":"..."}
    N-->>B: forward bytes unbuffered
    B->>B: append token, re-render markdown
  end
  deactivate G

  alt generation finished
    F-->>N: data: {"type":"done"}
  else upstream error mid-stream
    F-->>N: data: {"type":"error","message":"..."}
  end
  N-->>B: stream closes · reader resolves
  Note over B,F: Client disconnect cancels the generator so Gemini stops billing`,
    interactions:
      'The streaming endpoint executes the retrieval pipeline to completion before opening the StreamingResponse, dispatching SSE frames in an exact protocol sequence: an initial sources frame, a continuous sequence of token frames, and a terminating done or error frame. Emitting sources first enables the browser UI to paint document citation chips immediately before text generation starts. The prompt enforces four invariants: answer strictly using context, cite documents by [filename.pdf], suppress internal chunk numbers, and explicitly refuse if the answer is missing. The browser consumes the stream via fetch and a ReadableStream reader.',
    failureModes:
      'Because HTTP headers and status 200 are sent upfront, mid-stream failures cannot alter the HTTP status code and must be reported in-band via data: {"type": "error"}. The frontend client treats any stream closing without done or error as an unexpected termination. Intermediary reverse proxies require X-Accel-Buffering: no to prevent response buffering. When the user cancels or closes the browser tab, the generator aborts, terminating the Gemini streaming session to avoid billing superfluous tokens.',
    tradeOffs:
      'Server-Sent Events (SSE) operates over standard HTTP, making it simpler, lighter, and more proxy-friendly than WebSockets for unidirectional token streaming. Emitting citations before answer generation is a deliberate trust design choice: visitors verify document provenance while the answer streams, even if the model concludes with a refusal.',
  },
  {
    id: 5,
    title: 'Synthetic Evaluation Harness and CI Gating (eval.py)',
    tabLabel: '05 · Synthetic Eval',
    badge: 'Automated CI Gate · Zero-Labeled Data',
    mermaid: `flowchart TD
  start(["python eval.py\\nCI job step"])

  subgraph CORPUS["Ground-truth corpus"]
    direction TB
    load[("ChromaDB collection.get()\\ndocuments + metadatas")]
    sample("random.sample · N = 8 chunks")
  end

  subgraph GEN["Synthetic Q&A generation"]
    direction TB
    qa("gemini-flash-lite-latest\\nstrictly from the chunk text:\\n1 question + 3-5 lowercase keywords")
    valid{"valid JSON?"}
  end

  subgraph SUT["System under test"]
    direction TB
    ask("HTTP POST /ask\\n{question}")
    rag("Full RAG pipeline\\nDiagrams 3 and 4")
  end

  subgraph SCORE["Scoring"]
    direction TB
    kr("Keyword recall\\nhits / number of expected keywords\\nhit = keyword found in lowercased answer")
    ca("Citation accuracy\\n1 if expected source filename is in sources, else 0")
  end

  agg("Aggregate over cases\\nmean keyword recall · mean citation accuracy")
  gate{"mean keyword recall < 50%?"}
  fail(["sys.exit(1)\\nCI job fails · merge blocked"])
  pass(["exit 0\\nCI job passes · metrics logged"])
  skip("skip sample · log")

  start --> load
  load -->|"ids, documents, metadatas"| sample
  sample -->|"chunk text + source filename"| qa
  qa -->|"model text"| valid
  valid -->|"yes: question, keywords[], source"| ask
  valid -.->|"no"| skip
  ask --> rag
  rag -->|"200 {answer, sources: [{source, chunk}]}"| kr
  rag -->|"sources[].source"| ca
  kr -->|"per-case recall 0..1"| agg
  ca -->|"per-case 0 or 1"| agg
  agg --> gate
  gate -->|"yes"| fail
  gate -->|"no"| pass

  classDef api fill:#DCFCE7,stroke:#16A34A,stroke-width:1.5px,color:#14532D
  classDef store fill:#FEF3C7,stroke:#D97706,stroke-width:1.5px,color:#78350F
  classDef llm fill:#EDE9FE,stroke:#7C3AED,stroke-width:1.5px,color:#4C1D95
  classDef ev fill:#FFE4E6,stroke:#E11D48,stroke-width:1.5px,color:#881337
  classDef ok fill:#D1FAE5,stroke:#059669,stroke-width:1.5px,color:#064E3B
  classDef bad fill:#FEE2E2,stroke:#DC2626,stroke-width:1.5px,color:#7F1D1D
  class start,sample,kr,ca,agg,gate,skip ev
  class load store
  class qa llm
  class ask,rag,valid api
  class pass ok
  class fail bad
  style CORPUS fill:#FFFBEB,stroke:#D97706,stroke-width:2px
  style GEN fill:#F5F3FF,stroke:#7C3AED,stroke-width:2px
  style SUT fill:#F0FDF4,stroke:#16A34A,stroke-width:2px
  style SCORE fill:#FFF1F2,stroke:#E11D48,stroke-width:2px
  linkStyle 5 stroke:#DC2626,stroke-dasharray: 5 4`,
    interactions:
      'The evaluation harness operates with zero human-labeled ground truth. It samples N = 8 random chunks from the live ChromaDB collection and prompts gemini-flash-lite-latest to generate one factual question and 3-5 lowercase keywords derived strictly from that chunk. Each synthetic query is dispatched to the production POST /ask endpoint, exercising rewrite, hybrid retrieval, RRF, reranking, and generation. Scoring evaluates two deterministic metrics: Keyword Recall (fraction of expected keywords found in the answer) and Citation Accuracy (whether the originating PDF filename was cited).',
    failureModes:
      'The evaluation harness is designed as an automated regression guard. If an API request throws an error or times out, it is assigned a score of 0.0 rather than being dropped, ensuring outages fail the CI build. The hard failure threshold sys.exit(1) trips if overall mean keyword recall drops below 50%, blocking code merging or automated deployment.',
    tradeOffs:
      'Lexical keyword recall is an unpretentious proxy metric: it rewards answers that preserve original factual terms while incurring zero additional model costs at scoring time. A 50% baseline acts as an automated smoke alarm protecting against pipeline regressions, chunking boundary anomalies, or vector retrieval degradations.',
  },
  {
    id: 6,
    title: 'Session Proxy, State Isolation and Shared-Secret Security Boundary',
    tabLabel: '06 · Session Security',
    badge: 'Shared Secret Auth · SQLite Isolation',
    mermaid: `sequenceDiagram
  autonumber
  participant B as Browser
  participant S as Next.js server (session handler)
  participant A as FastAPI /chats router
  participant D as SQLite chats.sqlite3

  rect rgb(219, 234, 254)
    Note over B,S: Untrusted zone. The browser holds only a session cookie
    B->>S: GET /api/chats · Cookie: session
    S->>S: verify session, resolve user id
  end

  rect rgb(254, 243, 199)
    Note over S,A: Trust boundary. The shared secret exists only in server-side env
    S->>A: GET /chats · x-user: alice · x-chats-secret: ****
    A->>A: constant-time compare of x-chats-secret with server secret
    alt secret missing or wrong
      A-->>S: 401 or 403 · no database access
      S-->>B: 401
    else secret valid
      A->>D: SELECT id, title, updated FROM chats WHERE user = ? ORDER BY updated DESC
      D-->>A: rows for this user only
      A-->>S: 200 [{id, title, updated}]
      S-->>B: 200 JSON
    end
  end

  rect rgb(220, 252, 231)
    Note over B,D: Write path. Rows are keyed by (user, id), so one user cannot touch another's chat
    B->>S: POST /api/chats {id, title, messages}
    S->>A: POST /chats · x-user + x-chats-secret
    A->>A: constant-time compare
    A->>D: INSERT ... ON CONFLICT (user, id) DO UPDATE · messages as JSON · updated = now
    D-->>A: ok
    A-->>S: 200
    S-->>B: 200
  end`,
    interactions:
      'Browser clients authenticate exclusively with the Next.js frontend application via session cookies. The Next.js server-side route handler decodes the session, verifies identity, and makes server-to-server calls to FastAPI injecting x-user and x-chats-secret. FastAPI enforces constant-time secret comparison and scopes all SQLite queries strictly by user, using (user, id) as the composite primary key. The CHATS_SECRET environment variable is strictly server-side, never exposed to the client bundle or network inspection.',
    failureModes:
      'Any missing or invalid shared secret immediately returns HTTP 401 without querying the database. All user parameters are bound as parameterized SQL values to prevent SQL injection. In SQLite, WAL (Write-Ahead Logging) mode and busy timeouts are configured to serialize concurrent writes cleanly without raising database locked exceptions.',
    tradeOffs:
      'A server-to-server shared secret combined with trusted identity headers delivers a simple, robust microservice authentication boundary without introducing OAuth token issuance or JWT validation overhead into the Python layer. Storing chat histories as JSON payloads in a single row optimizes transactional writes and reads for multi-turn sessions.',
  },
];
