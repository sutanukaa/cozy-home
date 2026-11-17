export interface RecipeMetric {
  value: string;
  label: string;
  sublabel?: string;
}

export interface RecipeScreenshot {
  src: string;
  alt: string;
  caption: string;
  badge: string;
}

export interface RecipeSystemSection {
  title: string;
  ownership: string;
  badgeColor?: string;
  summary: string;
  achievements: string[];
  techTags: string[];
}

export interface RecipeDocument {
  title: string;
  url: string;
}

export interface Recipe {
  id: string;
  title: string;
  org: string;
  location?: string;
  period: string;
  kind: 'work' | 'education' | 'other';
  category: string;
  tagline: string;
  summary: string;
  documents?: RecipeDocument[];
  metrics?: RecipeMetric[];
  screenshots?: RecipeScreenshot[];
  systemSections?: RecipeSystemSection[];
  bullets: string[];
  keyProjects?: {
    name: string;
    description: string;
    tags: string[];
  }[];
  ingredients: string[];
}

export const recipes: Recipe[] = [
  {
    id: 'updesk',
    title: 'Software Development Engineering Intern',
    org: 'Updesk Private Limited',
    location: 'Ludhiana, India (Remote)',
    period: 'February 2026 – July 2026',
    kind: 'work',
    category: 'Industry Experience',
    tagline: 'AI CRO platform, 18-signal behavioral trigger engine & Shopify merchant agents',
    summary:
      'Engineered high-throughput CRO platform systems, autonomous AI merchant analytics agents, and on-site behavioral intervention runtimes for DynoWeb across hundreds of Shopify stores.',
    documents: [
      {
        title: 'Letter of Recommendation',
        url: '/assets/work/Letter%20of%20Recommendation.pdf',
      },
      {
        title: 'Internship Completion Letter',
        url: '/assets/work/Internship%20Completion%20Letter.pdf',
      },
    ],
    metrics: [
      {
        value: '74',
        label: 'Stores Installed',
        sublabel: 'Active Shopify merchant stores',
      },
      {
        value: '1.3M+',
        label: 'Click Events Tracked',
        sublabel: '80K+ sessions in last 30 days',
      },
      {
        value: '77 Models',
        label: '143 Routes · 1,300+ Tests',
        sublabel: 'Robust multi-tenant Postgres / Prisma architecture',
      },
      {
        value: '648 Commits',
        label: 'Production Commits',
        sublabel: 'Git author: sutanukaa',
      },
    ],
    screenshots: [
      {
        src: '/assets/work/dynoweb-smartnudge.jpg',
        alt: 'DynoWeb SmartNudge Visual Editor',
        badge: 'SmartNudge · Solo, End-to-End',
        caption:
          'SmartNudge Visual Editor: Figma-style layers, 18-signal behavioral triggers, real-time iframe canvas preview, and author-time WCAG-AA contrast auto-fix linting.',
      },
      {
        src: '/assets/work/dynoweb-dashboard.jpg',
        alt: 'DynoWeb Merchant Dashboard and Telemetry',
        badge: 'DynoWeb · Core Merchant Platform',
        caption:
          'DynoWeb Shopify Admin Dashboard: Real-time telemetry, store pulse, CRO health score, proactive agent suggestions, and holdout-verified incremental revenue attribution.',
      },
    ],
    systemSections: [
      {
        title: 'SmartNudge On-Site Behavioral Engine',
        ownership: 'SOLO, end-to-end · 249 commits',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        summary:
          'Architected and built the entire SmartNudge subsystem from UX design to the edge trigger engine, visual editor, Brand DNA system, and holdout attribution.',
        achievements: [
          'Engineered an edge-driven 18-signal browser trigger engine (exit intent, scroll velocity, dwell ticks, cart abandonment, frustration signals) with a custom mobile upward-flick discriminator (450ms settle window).',
          'Built a dual-renderer contract ensuring preview iframes and live storefronts render byte-identically from persisted design tokens, sharing an element-visibility package guarded by tests.',
          'Built Brand DNA from scratch: multi-page crawler, deterministic 4-tier color extraction cascade (Shopify brand settings, theme JSON, Gemini Vision on logo/OG, role-ranked CSS) with provenance tracking, and a 6-archetype classifier with gamma-correct WCAG contrast.',
          'Implemented holdout-based revenue attribution (deterministic 10% counterfactual bucketing within a 30-minute pre-order window) reporting true incremental revenue lift.',
          'Built statistically honest A/B testing: two-proportion Z-test requiring ≥50 samples/side and p < 0.05 before declaring a winner, with immediate serve-time loser suppression.',
        ],
        techTags: ['TypeScript', 'Edge Runtime', 'Framer Motion', 'Zod', 'Prisma', 'WCAG-AA'],
      },
      {
        title: 'DynoAgent Anti-Hallucination & Reliability',
        ownership: 'TEAM (my part: reliability, grounding, tools & billing)',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        summary:
          'Led data-grounding and reliability engineering for a production Gemini 2.5 Flash conversational agent operating over ~70 native tools and Composio Shopify admin actions.',
        achievements: [
          'Stale-data self-heal gate: automated fallback recomputing from raw PageView events when daily rollups fall below 90% completeness, reconciling the agent with source-of-truth dashboards.',
          'Killed "laundered hallucinations": returned pre-slice totals computed across all matching rows before display limiting so the model quotes ground truth instead of inventing arithmetic.',
          'Causal-claim guardrails: attached attribution-leakage caveats to Direct-traffic breakdowns to prevent unsubstantiated brand recall claims.',
          'Fixed tool-selection bugs (keyword gaps + plural over-stemming: "sources" → "sourc") with a 23-case regression test suite.',
          'Monetization: designed and shipped the AI Assistant add-on as a second Shopify subscription line item with webhook-driven monthly quota recomputation.',
        ],
        techTags: ['Gemini 2.5 Flash', 'Vercel AI SDK', 'Data Grounding', 'Shopify Billing', 'Composio'],
      },
      {
        title: 'Trust & Honesty Engineering',
        ownership: 'SOLO, cross-cutting initiative',
        badgeColor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        summary:
          'Championed an engineering through-line closing gaps where the product previously misled merchants or silently degraded.',
        achievements: [
          'Built tracking-blackout detection: pure, unit-tested detector alerting merchants via daily cron when theme updates disable the embed, solving an issue invisible to activity-filtered crons.',
          'Surfaced bot-traffic filtering as a real, falsifiable number in settings, counting requests rather than invented sessions.',
          'Audited merchant-facing pricing copy against enforced code constraints, ensuring no marketing claims exceeded code capabilities.',
          'Engineered durable SEO undo: built append-only SeoAutofixLog preserving before-value payloads across reloads.',
        ],
        techTags: ['Observability', 'Cron Pipelines', 'Telemetry', 'Postgres'],
      },
      {
        title: 'AI Session-Replay Summaries & Performance',
        ownership: 'SOLO · Summary & culprit layers',
        badgeColor: 'bg-purple-100 text-purple-800 border-purple-200',
        summary:
          'Shipped one-click AI session-replay reads and Lighthouse 13-resilient JavaScript performance culprit extraction.',
        achievements: [
          'Turned raw rrweb timelines into 4-paragraph actionable behavioral reads on Gemini 2.5 Flash, solving reasoning token budget exhaustion by disabling thinkingBudget for narrative tasks.',
          'Engineered budget-reserved monthly cap metering, 1-hour failure cooldowns, and race-safe persistence (updateMany WHERE summary IS NULL).',
          'Built named JS speed culprit extraction from Lighthouse/PSI audits, routing third-party app fixes to merchants and raw script fixes with exact URLs to developers.',
        ],
        techTags: ['Gemini 2.5 Flash', 'rrweb', 'Lighthouse 13', 'Performance Auditing'],
      },
    ],
    bullets: [
      'Designed and built SmartNudge solo end-to-end on DynoWeb (249 commits), delivering an 18-signal browser trigger engine, Figma-style visual editor, Brand DNA styling, and holdout-based revenue attribution.',
      'Owned anti-hallucination and data-grounding on DynoAgent: engineered self-heal gates, pre-slice totals, and causal-claim guardrails, reconciling agent answers with source-of-truth dashboards.',
      'Drove cross-cutting trust initiatives: tracking-blackout detection, transparent bot filtering counters, pricing copy honesty, and durable SEO undo logs.',
      'Shipped AI session-replay summaries with cached Gemini 2.5 Flash pipelines and named JS speed culprit performance extraction.',
    ],
    ingredients: [
      'TypeScript',
      'React Router v7',
      'Prisma',
      'PostgreSQL',
      'Vercel AI SDK',
      'Gemini 2.5 Flash',
      'Shopify App Bridge',
      'Google Cloud Run',
      'Tailwind CSS',
    ],
  },
  {
    id: 'buybox',
    title: 'Frontend Developer Intern',
    org: 'BuyBox Pvt. Ltd.',
    location: 'Zimbabwe (Remote)',
    period: 'January 2025 – June 2025',
    kind: 'work',
    category: 'Industry Experience',
    tagline: 'React Native consumer mobile app & React seller web platform',
    summary:
      'Engineered the cross-platform React Native consumer e-commerce mobile application alongside the responsive React web platform for sellers and catalog management.',
    screenshots: [
      {
        src: '/assets/work/buybox-seller-web.jpg',
        alt: 'BuyBox Seller Web Platform',
        badge: 'React · Seller & Storefront Web',
        caption:
          'BuyBox Seller & Storefront Web built with React: responsive product showcase, category discovery, merchant onboarding, and shopping services.',
      },
      {
        src: '/assets/work/buybox-mobile-home.jpg',
        alt: 'BuyBox Mobile App - Home',
        badge: 'React Native · Mobile App',
        caption:
          'BuyBox Consumer Mobile App built with React Native: Skincare, fashion, and electronics campaign banners, curated departments, and 5-tab bottom navigation.',
      },
      {
        src: '/assets/work/buybox-mobile-market.jpg',
        alt: 'BuyBox Mobile App - Market & Groceries',
        badge: 'React Native · Market & Catalog',
        caption:
          'BuyBox Mobile Market & Storefront built with React Native: Featured stores carousel, real-time groceries and food catalog, and rapid one-tap add-to-cart.',
      },
    ],
    systemSections: [
      {
        title: 'Consumer E-Commerce Mobile App',
        ownership: 'React Native · Cross-Platform Mobile',
        badgeColor: 'bg-amber-100 text-amber-800 border-amber-200',
        summary:
          'Built the native cross-platform mobile shopping application from scratch using React Native, delivering a smooth 60fps shopping experience across smartphones.',
        achievements: [
          'Engineered core shopping flows: interactive home feed with multi-tier campaign banners, curated department cards, and custom bottom-tab navigation.',
          'Built the Market & Stores discovery hub: featured merchant carousels, category filtering (Groceries, Health & Beauty, Fashion), and rapid one-tap add-to-cart interactions.',
          'Optimized virtualized product lists (FlatList) with image caching, skeleton loaders, and debounced search for sub-second rendering across diverse network conditions.',
        ],
        techTags: ['React Native', 'Mobile UI/UX', 'Cross-Platform', 'State Management', 'REST APIs'],
      },
      {
        title: 'Seller & Storefront Web Platform',
        ownership: 'React · Web Frontend',
        badgeColor: 'bg-rose-100 text-rose-800 border-rose-200',
        summary:
          'Built the responsive web application in React for merchant onboarding, catalog exploration, and seller operations.',
        achievements: [
          'Designed and implemented the high-conversion storefront landing and seller registration portal with pixel-perfect responsive layouts.',
          'Modeled flexible product schemas and attribute filters, integrating real-time inventory synchronization with backend microservices.',
          'Constructed dynamic seller dashboards for tracking live orders, customer analytics, and product restocking alerts.',
        ],
        techTags: ['React', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'REST APIs'],
      },
    ],
    bullets: [
      'Built the actual cross-platform consumer e-commerce mobile application using React Native, featuring campaign feeds, market store discovery, and one-tap checkout.',
      'Developed the responsive seller website using React, enabling merchants to onboard, manage multi-category catalogs, and review sales telemetry.',
      'Modeled flexible product schemas and attribute filters, integrating real-time inventory synchronization with backend microservices.',
      'Engineered smooth 60fps micro-interactions, responsive mobile views, and sub-second page transitions.',
    ],
    ingredients: [
      'React Native',
      'React',
      'TypeScript',
      'Tailwind CSS',
      'Framer Motion',
      'REST APIs',
      'Git / GitHub',
    ],
  },
  {
    id: 'hackathons',
    title: 'Hackathon Champion & Podium Finisher',
    org: 'Global & National Competitive Circuits',
    location: 'India & International',
    period: '2024 – 2025',
    kind: 'other',
    category: 'Hackathons & Honors',
    tagline: '1st Place Winner out of 650+ international teams • Podium finishes at IIT Dhanbad & DevNexus',
    summary:
      'Podium finishes and champion titles across prestigious global and national competitive hackathons.',
    metrics: [
      {
        value: '1st Place',
        label: '100Agents Global Hackathon',
        sublabel: 'Winner out of 650+ international teams',
      },
      {
        value: '1st Runner Up',
        label: "Hackfest '25 at IIT (ISM) Dhanbad",
        sublabel: 'National hackathon podium finish',
      },
      {
        value: '2nd Runner Up',
        label: 'DevNexus',
        sublabel: 'Podium finisher among 300+ teams',
      },
    ],
    bullets: [
      '1st Place Winner — 100Agents Global Hackathon (Winner out of 650+ international teams)',
      "1st Runner Up — Hackfest '25 at IIT (ISM) Dhanbad (National Hackathon Podium)",
      '2nd Runner Up — DevNexus (Podium finish among 300+ competitive teams)',
    ],
    ingredients: [
      'Rapid Prototyping',
      'System Architecture',
      'Competitive Coding',
      'Full-Stack Engineering',
      'Team Leadership',
    ],
  },
];
