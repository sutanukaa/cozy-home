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

export interface ScrapbookAudioAction {
  action: string;
  trigger: string;
  sourceNodes: string;
  filter: string;
  envelope: string;
  spatialTransform: string;
}

export interface ScrapbookInvariant {
  id: number;
  invariant: string;
  enforcement: string;
  failureImpact: string;
}

export interface ScrapbookBudget {
  budget: string;
  limit: string;
  policy: string;
}

export const scrapbookBudgets: ScrapbookBudget[] = [
  {
    budget: 'Frame budget',
    limit: '16.7 ms (60 Hz) / 8.3 ms (120 Hz)',
    policy:
      'Pointer handling must not allocate, must not read DOM layout (offsetWidth, getBoundingClientRect cached at pending), and writes directly to motion values without triggering React renders.',
  },
  {
    budget: 'Memory budget',
    limit: '48 MB per 12MP decoded photo',
    policy:
      'Display variants are downscaled to ceil(cssWidth * min(DPR, 2)). Full-res files used solely by export worker. will-change: transform set only while lifted. Bitmaps closed with close().',
  },
  {
    budget: 'Audio policy',
    limit: 'Strict browser gesture activation',
    policy:
      'Zero audio plays without prior user gesture (HTML activation event). Engine drops and never queues on suspended contexts, avoiding burst catch-up noise. Max 8 concurrent voices.',
  },
];

export const scrapbookInvariants: ScrapbookInvariant[] = [
  {
    id: 1,
    invariant: 'One Source of Truth for Transforms',
    enforcement: 'Rendered matrix equals committed state matrix at rest. Motion values are ephemeral and never serialized.',
    failureImpact: 'Eliminates drift between transient drag physics and persistent document layout.',
  },
  {
    id: 2,
    invariant: 'Strict Gesture Ownership',
    enforcement: 'At any millisecond, an item has at most one gesture owner (drag, rotate, or pinch). Only the owner writes motion values.',
    failureImpact: 'Prevents pointer conflict jitter when multi-touch fingers land or gesture ownership transitions mid-drag.',
  },
  {
    id: 3,
    invariant: 'Stacking Order is a Pure Array',
    enforcement: 'Stacking order per page is an array of IDs bottom-to-top. Rendered z-indexes are derived as dense ranks (1..n).',
    failureImpact: 'No element stores its own z value. Prevents DOM reordering thrash, focus drops, and image re-decoding.',
  },
  {
    id: 4,
    invariant: 'Recoverable Position (MIN_VISIBLE)',
    enforcement: 'Rotated AABB clamp bounds center coordinates so at least MIN_VISIBLE (32px) remains inside the page boundary.',
    failureImpact: 'Guarantees items can never be dragged or rotated beyond reach into ungrabbable coordinates.',
  },
  {
    id: 5,
    invariant: 'Sound Follows Discrete Gestures',
    enforcement: 'Audio triggers strictly on discrete interaction events (peel, place, snap, flip) and never on raw pointermove.',
    failureImpact: 'Eliminates zipper noise and machine-gun audio repetition; drops voices gracefully if audio context is suspended.',
  },
  {
    id: 6,
    invariant: 'Lossless Round Trip',
    enforcement: 'deserialize(serialize(state)) === state with stable key sorting and coordinate quantization to 0.1.',
    failureImpact: 'Guarantees deterministic JSON generation, enabling byte-for-byte change detection and reliable IndexedDB caching.',
  },
  {
    id: 7,
    invariant: 'DOM & Export Render Parity',
    enforcement: 'DOM CSS transforms and canvas export worker share the exact same affine matrix formula and pre-measured text line breaks.',
    failureImpact: 'Eliminates layout discrepancy, word wrapping shifts, and focal-point crop drift during high-resolution PNG export.',
  },
];

export const scrapbookAudioActions: ScrapbookAudioAction[] = [
  {
    action: 'Peel',
    trigger: 'Pointer lifts item off page',
    sourceNodes: 'White noise AudioBufferSourceNode (looped, random offset) + Sawtooth LFO (28-42 Hz tremolo, depth 0.5)',
    filter: 'Bandpass, 900 Hz rising to 3200 Hz over 280 ms (exponential), Q 2.2',
    envelope: 'Attack 20 ms, peak 0.26, decay 300 ms, total 340 ms',
    spatialTransform: 'Lift: scale 1.00 -> 1.06, translateY 0 -> -4 px',
  },
  {
    action: 'Place',
    trigger: 'Pointer releases item',
    sourceNodes: 'Sine OscillatorNode 150 Hz falling to 60 Hz over 70 ms + Noise burst paper slap',
    filter: 'Noise path: lowpass 1400 Hz, Q 0.7 dB. Sine path: none',
    envelope: 'Sine: attack 2 ms, peak 0.40, decay 110 ms. Noise: attack 1 ms, peak 0.18, decay 40 ms',
    spatialTransform: 'Settle: scale 1.06 -> 1.00, translateY -4 -> 0 px, spring (stiffness 420, damping 32)',
  },
  {
    action: 'Flip',
    trigger: 'Page index changes',
    sourceNodes: 'White noise AudioBufferSourceNode',
    filter: 'Bandpass, 1800 Hz falling to 700 Hz over 280 ms, Q 0.8',
    envelope: 'Attack 40 ms, peak 0.30, decay 260 ms, total 320 ms',
    spatialTransform: 'Page rotateY 0 -> -180 deg, perspective 1800 px, spine origin',
  },
  {
    action: 'Click',
    trigger: 'Rotation crosses 15-deg snap step or item selected',
    sourceNodes: 'Triangle OscillatorNode 1800 Hz falling to 900 Hz over 18 ms',
    filter: 'Bandpass 2200 Hz, Q 4',
    envelope: 'Attack 0.5 ms, peak 0.12, decay 28 ms',
    spatialTransform: 'Rotation theta snaps to round(theta / 15) * 15 deg',
  },
  {
    action: 'Rustle',
    trigger: 'Drag speed sampled per frame (max 30 Hz)',
    sourceNodes: 'White noise AudioBufferSourceNode (looped)',
    filter: 'Bandpass, cutoff 1500 + 2500*v Hz, Q 0.7',
    envelope: 'Gain target 0.08*v (tau 30 ms). Fade out 120 ms on release',
    spatialTransform: 'Translation T(x, y) per frame. v = clamp(speed / 1800, 0, 1)',
  },
];

export const scrapbookDiagrams: ArchitectureDiagram[] = [
  {
    id: 1,
    title: 'Spatial Canvas Architecture & Drag-and-Drop Pipeline',
    tabLabel: '01 · Spatial Physics Pipeline',
    badge: 'Framer Motion · Damped Harmonic Oscillator · Rotated AABB Clamping',
    mermaid: `flowchart TD
  subgraph UI["UI and canvas layer"]
    P1["Pointer events<br/>pointerdown, pointermove, pointerup, pointercancel<br/>touch-action none, pointer capture"]
    R1["Canvas render<br/>page container scaled by k, items as layers"]
  end

  subgraph ENG["Interaction engine, Framer Motion"]
    G1["Gesture recognizer<br/>idle, pending, drag, rotate, pinch, settle"]
    M1["Motion values<br/>x, y, rotate, scale"]
    S1["Spring solver<br/>damped oscillator: stiffness, damping, mass"]
    V1["Velocity sway<br/>useVelocity of x to rotation offset"]
    B1["Boundary solver<br/>rotated bounding box clamp, MIN_VISIBLE"]
    T1["Transform matrix<br/>T(x,y) R(theta) S(s)"]
    Z1["Lift band<br/>z = LIFT_BASE + rank"]
    Z2["Commit on release<br/>move id to top of order array"]
  end

  subgraph ST["State and persistence"]
    ST1["Layout store commit<br/>transform and order in one transaction"]
    SV1["Debounced save<br/>see diagram 3"]
  end

  AU["Audio scheduler<br/>see diagram 2"]

  E1["Boundary hit: elastic resistance, spring back"]
  E2["pointercancel: revert to pre-gesture transform"]
  E3["Input faster than frames: coalesce"]

  P1 --> G1
  G1 -->|"deltas in logical units"| M1
  M1 --> S1
  M1 -->|"x velocity"| V1
  S1 --> B1
  B1 --> T1
  V1 -->|"sway offset"| T1
  T1 --> Z1
  Z1 --> R1
  G1 -->|"lift, snap, release"| AU
  G1 -->|"pointerup"| Z2
  Z2 --> ST1
  ST1 --> SV1
  B1 -.->|"outside limits"| E1
  E1 -.->|"target set to clamped value"| S1
  G1 -.->|"pointercancel"| E2
  P1 -.->|"events faster than frames"| E3
  E3 -.->|"one update per frame"| G1

  classDef ui fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef engine fill:#CCFBF1,stroke:#5EEAD4,color:#1E293B
  classDef audio fill:#EDE9FE,stroke:#C4B5FD,color:#1E293B
  classDef state fill:#FEF3C7,stroke:#FCD34D,color:#1E293B
  classDef err fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class P1,R1 ui
  class G1,M1,S1,V1,B1,T1,Z1,Z2 engine
  class AU audio
  class ST1,SV1 state
  class E1,E2,E3 err

  linkStyle 13,14,15,16,17 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'Coordinates are stored in logical units independent of viewport or DPR. Pointer events map through MotionConfig transformPagePoint dividing screen deltas by scale factor k. Items use dragListener={false} and custom recognizers to discriminate taps, drags, rotate handles, and two-finger pinches. Boundary solver computes rotated axis-aligned bounding boxes (AABB) using trigonometric half-extents to ensure at least MIN_VISIBLE (32px) remains inside the page boundary.',
    failureModes:
      'Pointer cancellation (incoming phone call, scroll takeover): Handled via pointercancel which reverts motion values to pre-gesture state without modifying stacking order. Fast dragging coalesces dense 240Hz inputs to one update per display frame. Layout reading thrash is eliminated by caching page bounding client rect at pointerdown.',
    tradeOffs:
      'DOM + CSS transforms vs Canvas/WebGL: DOM provides native accessibility tree, text selection, and native IME input while effortlessly supporting up to 300 layers per page. Motion values update element styles directly on each frame, completely bypassing React component re-rendering during active drags.',
  },
  {
    id: 2,
    title: 'Procedural Web Audio Synthesis Graph',
    tabLabel: '02 · Web Audio Synthesis Graph',
    badge: 'Web Audio API · Stick-Slip Tremolo · Zero-Asset Synthesizer',
    mermaid: `flowchart LR
  subgraph TRG["Triggers, UI layer"]
    T1["Lift event<br/>peel"]
    T2["Release event<br/>place"]
    T3["Rotation snap crossing<br/>click"]
    T4["Page index change<br/>flip"]
    T5["Drag speed, per frame<br/>rustle level"]
  end

  SC["Sound scheduler<br/>voice cap 8, throttle per sound, humanize"]
  CTX["AudioContext singleton<br/>state check, resume on gesture"]
  DROP["Dropped: context not running or voice cap reached"]

  subgraph PEEL["Peel voice"]
    PN["AudioBufferSourceNode<br/>white noise, loop, random offset"]
    PF["BiquadFilterNode<br/>bandpass 900 to 3200 Hz, Q 2.2"]
    PL["OscillatorNode sawtooth<br/>LFO 28 to 42 Hz"]
    PA["GainNode<br/>stick-slip tremolo, base 0.5"]
    PE["GainNode<br/>exponential envelope"]
  end

  subgraph PLACE["Place voice"]
    SO["OscillatorNode sine<br/>150 to 60 Hz"]
    SE["GainNode<br/>exponential envelope"]
    SN["AudioBufferSourceNode<br/>white noise"]
    SF["BiquadFilterNode<br/>lowpass 1400 Hz"]
    SG["GainNode<br/>exponential envelope"]
  end

  subgraph CLICK["Click voice"]
    CO["OscillatorNode triangle<br/>1800 to 900 Hz"]
    CF["BiquadFilterNode<br/>bandpass 2200 Hz, Q 4"]
    CE["GainNode<br/>exponential envelope"]
  end

  subgraph FLIP["Flip voice"]
    FN["AudioBufferSourceNode<br/>white noise"]
    FF["BiquadFilterNode<br/>bandpass 1800 to 700 Hz"]
    FE["GainNode<br/>exponential envelope"]
  end

  subgraph RUST["Rustle voice, continuous"]
    RN["AudioBufferSourceNode<br/>white noise, loop"]
    RF["BiquadFilterNode<br/>bandpass, cutoff follows speed"]
    RG["GainNode<br/>level follows speed"]
  end

  MG["Master GainNode<br/>volume and mute"]
  MC["DynamicsCompressorNode<br/>limiter"]
  DS["AudioContext.destination<br/>speakers"]
  CLN["Voice cleanup<br/>onended: disconnect every node, release slot"]

  T1 --> SC
  T2 --> SC
  T3 --> SC
  T4 --> SC
  T5 --> SC
  SC --> CTX
  CTX -.->|"suspended or capped"| DROP
  CTX --> PN
  CTX --> PL
  CTX --> SO
  CTX --> SN
  CTX --> CO
  CTX --> FN
  CTX --> RN
  PN --> PF
  PF --> PA
  PL -->|"modulates gain"| PA
  PA --> PE
  PE --> MG
  SO --> SE
  SE --> MG
  SN --> SF
  SF --> SG
  SG --> MG
  CO --> CF
  CF --> CE
  CE --> MG
  FN --> FF
  FF --> FE
  FE --> MG
  RN --> RF
  RF --> RG
  RG --> MG
  MG --> MC
  MC --> DS
  PEEL -.-> CLN
  PLACE -.-> CLN
  CLICK -.-> CLN
  FLIP -.-> CLN

  classDef ui fill:#DBEAFE,stroke:#93C5FD,color:#1E293B
  classDef audio fill:#EDE9FE,stroke:#C4B5FD,color:#1E293B
  classDef err fill:#FFE4E6,stroke:#EF4444,color:#7F1D1D,stroke-dasharray:5 5

  class T1,T2,T3,T4,T5 ui
  class SC,CTX,PN,PF,PL,PA,PE,SO,SE,SN,SF,SG,CO,CF,CE,FN,FF,FE,RN,RF,RG,MG,MC,DS,CLN audio
  class DROP err

  linkStyle 6 stroke:#EF4444,stroke-width:2px,stroke-dasharray:5 5`,
    interactions:
      'All tactile audio is generated purely in real-time via Web Audio API nodes with zero external MP3/WAV network requests. A singleton AudioContext on globalThis persists across React Strict Mode re-mounts. Peel features a tape-release stick-slip tremolo modulated by a 28-42 Hz sawtooth LFO over bandpass-filtered noise. Place layers a sine thump and lowpass noise burst. Continuous rustle tracks drag velocity, updating filter cutoff and gain at 30 Hz using setTargetAtTime smoothing.',
    failureModes:
      'Autoplay policy: If the context is suspended, sounds are dropped immediately and never queued, preventing sound-burst cascades when resumed. Unlocked via global capture listeners on pointerup, keydown, and touchend. Memory leaks are prevented by calling disconnect() on all nodes and releasing voice slots inside onended callbacks.',
    tradeOffs:
      'Procedural synthesis vs Static Audio Samples: Procedural synthesis requires zero bandwidth, introduces zero decoding latency, enables infinite non-repetitive micro-variations (detune +/-50 cents, gain +/-1.5 dB, velocity scaling), and couples directly to physical drag velocities. A single 2-second shared noise buffer (384 KB) powers all noise voices.',
  },
  {
    id: 3,
    title: 'Multi-Page State Synchronization & Export Pipeline',
    tabLabel: '03 · Multi-Page Sync & Export',
    badge: 'IndexedDB Draft · If-Match Revisions · OffscreenCanvas Worker',
    mermaid: `sequenceDiagram
  autonumber
  participant U as Visitor
  participant UI as Canvas UI
  participant ST as Layout store
  participant SR as Serializer
  participant ID as IndexedDB draft
  participant API as Route handler
  participant DB as Backend storage
  participant W as Export worker

  rect rgb(219, 234, 254)
    U->>UI: flip to next page
  end

  rect rgb(204, 251, 241)
    UI->>ST: commit active page, flush any gesture in flight
    Note over ST: pointercancel if a drag is active, then validate invariants and bump page revision
  end

  par flip presentation
    rect rgb(219, 234, 254)
      UI->>UI: run flip animation and fire flip sound
    end
  and persistence
    rect rgb(254, 243, 199)
      ST->>SR: serialize page from committed state
      Note over SR: stable key order, numbers quantized to 0.1, ids unique, bounds clamped
      SR->>ID: write draft first
      SR->>API: PUT /api/albums/:id/pages/:pageId with If-Match revision
      API->>DB: conditional update where revision equals expected
    end
  end

  alt revision mismatch
    rect rgb(255, 228, 230)
      DB-->>API: zero rows updated
      API-->>SR: 409 with server version
      SR->>ST: conflict, keep local draft and ask which version to keep
    end
  else network failure
    rect rgb(255, 228, 230)
      API--xSR: timeout or 5xx
      Note over SR: retain draft, retry with backoff, show unsaved indicator
    end
  else accepted
    DB-->>API: new revision
    API-->>SR: 200 with revision and updatedAt
    SR->>ST: acknowledge, clear dirty flag
  end

  rect rgb(219, 234, 254)
    U->>UI: export page
    UI->>SR: immutable snapshot of page and assets
    UI->>W: postMessage doc and scale
  end

  rect rgb(254, 243, 199)
    W->>W: fetch assets with CORS, createImageBitmap, load fonts
    Note over W: OffscreenCanvas at scale S, items drawn in array order using the shared matrix
  end

  alt canvas tainted or too large
    rect rgb(255, 228, 230)
      W-->>UI: error, then retry with a lower scale or report which asset blocked export
    end
  else rendered
    W->>W: convertToBlob as PNG, close bitmaps, release canvas
    W-->>UI: payload with blob, width, height, pageId
    UI-->>U: download through an object URL, then revoke it
  end`,
    interactions:
      'Page flips automatically commit active gestures and flush pending motions via pointercancel. The serializer writes canonical quantized JSON to an IndexedDB draft first, then debounces network writes via PUT /api/albums/:id/pages/:pageId with If-Match revision headers. Export offloads rendering to a dedicated Web Worker running an OffscreenCanvas, loading custom fonts via FontFace and rendering elements using the exact same transform matrix as the DOM.',
    failureModes:
      'Concurrent revision conflict: Server detects stale revision and responds with HTTP 409 Conflict. Client preserves local IndexedDB draft and prompts resolution without losing edits. Tainted canvas: Cross-origin assets are fetched with CORS mode before bitmap generation; export errors report offending asset URLs. Memory exhaustion is bounded by capping max export resolution at 16.7 million pixels.',
    tradeOffs:
      'OffscreenCanvas Worker vs DOM foreignObject SVG: OffscreenCanvas decouples heavy bitmap rasterization from the main UI thread, prevents main-thread jank, avoids Safari SVG foreignObject rendering bugs, and enables true high-DPI print-resolution PNG exports without cloning the active DOM.',
  },
];
