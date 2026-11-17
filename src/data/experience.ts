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
    location: 'Ludhiana, India (Remote / Hybrid)',
    period: 'February 2026 – July 2026',
    kind: 'work',
    category: 'Industry Experience',
    tagline: 'AI CRO platform, 18-signal behavioral trigger engine & Shopify merchant agents',
    summary:
      'Engineered conversion rate optimization (CRO) platforms and enterprise AI analytics pipelines integrated with Shopify merchant stores.',
    bullets: [
      'Designed and built SmartNudge solo end-to-end on DynoWeb (AI-driven Shopify CRO platform), delivering an 18-signal browser behavioral trigger engine, Figma-style visual editor, and real-time A/B testing.',
      'Owned anti-hallucination and data-grounding on DynoAgent (Gemini analytics agent): engineered self-heal gates, pre-slice totals verification, and causal-claim guardrails to guarantee factual accuracy.',
      'Shipped AI session-replay summaries with cached Gemini LLM pipelines, automated funnel anomaly detection, and Lighthouse performance suggestions.',
      'Built type-safe Prisma & PostgreSQL data schemas and containerized microservices deployed to Google Cloud Run, adhering strictly to Shopify App Bridge and Polaris UX guidelines.',
    ],
    keyProjects: [
      {
        name: 'SmartNudge Behavioral Engine',
        description:
          '18-signal client-side engine evaluating exit intent, scroll velocity, cart abandonment, and frustration clicks to trigger hyper-targeted on-page nudges without latency.',
        tags: ['TypeScript', 'Browser APIs', 'Figma-style Editor'],
      },
      {
        name: 'DynoAgent Anti-Hallucination Pipeline',
        description:
          'Grounding framework enforcing pre-slice verification, deterministic totals comparison, and LLM budget caching for Shopify merchant analytics queries.',
        tags: ['Gemini API', 'Vercel AI SDK', 'Data Grounding'],
      },
    ],
    ingredients: [
      'TypeScript',
      'React Router v7',
      'Prisma',
      'PostgreSQL',
      'Vercel AI SDK',
      'Gemini API',
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
    tagline: 'High-performance responsive e-commerce storefront, catalog & seller dashboards',
    summary:
      'Spearheaded frontend architecture and user interface engineering for modern e-commerce storefronts and administrative portals.',
    bullets: [
      'Led the end-to-end design and responsive development of the e-commerce storefront for BuyBox, optimizing checkout flows, search discovery, and product detail pages.',
      'Modeled flexible product schemas and attribute filters, integrating real-time inventory synchronization with backend microservices.',
      'Built responsive seller and admin dashboards featuring live order telemetry, inventory alerts, and customer analytics.',
      'Engineered smooth 60fps micro-interactions, responsive mobile views, and sub-second page transitions using Next.js and Tailwind CSS.',
    ],
    keyProjects: [
      {
        name: 'Storefront Checkout & Catalog Flow',
        description:
          'Streamlined multi-step checkout with instant coupon validation, order summary calculations, and responsive mobile optimization.',
        tags: ['Next.js', 'Tailwind CSS', 'Framer Motion'],
      },
      {
        name: 'Seller Telemetry Dashboard',
        description:
          'Interactive seller portal displaying real-time revenue graphs, pending shipments, and inventory restocking triggers.',
        tags: ['TypeScript', 'REST APIs', 'UI/UX'],
      },
    ],
    ingredients: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'REST APIs', 'Git / GitHub'],
  },
  {
    id: 'rcciit',
    title: 'B.Tech in Computer Science and Engineering',
    org: 'RCC Institute of Information Technology (RCCIIT)',
    location: 'Kolkata, West Bengal, India',
    period: 'August 2023 – Present (Expected 2027)',
    kind: 'education',
    category: 'Education & Academics',
    tagline: 'Undergraduate Computer Science • 8.08 CGPA • Systems & Software Architecture',
    summary:
      'Undergraduate student with an 8.08 CGPA, active competitive programmer, hackathon builder, and core campus technical contributor.',
    bullets: [
      'Current Cumulative GPA: 8.08 / 10.0.',
      'Core Coursework: Data Structures & Algorithms, Operating Systems, Database Management Systems, Computer Networks, Object-Oriented Programming, and Software Engineering.',
      'Active developer and mentor across college tech communities, conducting workshops on modern full-stack web architecture and competitive coding.',
    ],
    ingredients: [
      'Data Structures',
      'Algorithms',
      'System Design',
      'Operating Systems',
      'Database Systems',
      'Computer Networks',
    ],
  },
  {
    id: 'hackathons',
    title: 'Hackathon Achievements & Honors',
    org: 'National & Global Competitive Circuits',
    location: 'India & International',
    period: '2025 – 2026',
    kind: 'other',
    category: 'Honors & Recognition',
    tagline: 'Podium finishes across 650+ international teams in autonomous AI & systems',
    summary:
      'Recognized on prestigious hackathon podiums for building innovative autonomous multi-agent systems and high-concurrency tooling.',
    bullets: [
      'Winner (1st Place) – 100Agents Global Hackathon: Placed 1st among 650+ international teams building autonomous multi-agent workflow systems.',
      '1st Runner Up – Hackfest \'25 at IIT (ISM) Dhanbad: Architected and presented high-concurrency distributed developer tooling under 36 hours.',
      '2nd Runner Up – DevNexus: Finalist and podium finisher among 300+ competitive developer teams.',
    ],
    keyProjects: [
      {
        name: '100Agents 1st Place Autonomous Multi-Agent System',
        description:
          'Orchestrated collaborative LLM agent swarms with dynamic role-delegation, shared memory boards, and deterministic safety checks.',
        tags: ['AI Agents', 'Multi-Agent Systems', '1st Place'],
      },
    ],
    ingredients: ['Autonomous AI Agents', 'Distributed Systems', 'Rapid Prototyping', 'System Architecture', 'Team Leadership'],
  },
];
