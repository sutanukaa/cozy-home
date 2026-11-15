export interface Recipe {
  title: string;
  org: string;
  period: string;
  kind: 'work' | 'education' | 'other';
  bullets: string[];
  ingredients: string[];
}

export const recipes: Recipe[] = [
  {
    title: 'Software Development Engineering Intern',
    org: 'Updesk Private Limited (Ludhiana, India)',
    period: 'February 2026 – July 2026',
    kind: 'work',
    bullets: [
      'Worked on DynoWeb (AI-powered Shopify CRO platform): designed and built SmartNudge solo end-to-end with an 18-signal browser trigger engine, Figma-style visual editor, and A/B testing.',
      'Owned anti-hallucination and data-grounding on DynoAgent (Gemini analytics agent): engineered self-heal gates, pre-slice totals, and causal-claim guardrails.',
      'Shipped AI session-replay summaries with cached Gemini pipelines and Lighthouse audit suggestions.',
    ],
    ingredients: ['TypeScript', 'React Router v7', 'Prisma', 'PostgreSQL', 'Vercel AI SDK', 'Gemini API', 'Shopify APIs', 'Google Cloud Run'],
  },
  {
    title: 'Frontend Developer Intern',
    org: 'BuyBox Pvt. Ltd. (Zimbabwe)',
    period: 'January 2025 – June 2025',
    kind: 'work',
    bullets: [
      'Led the end-to-end design and development of the responsive e-commerce interface for BuyBox.',
      'Collaborated across backend teams for checkout flows, product pages, and analytics dashboards with optimized performance.',
    ],
    ingredients: ['TypeScript', 'Next.js', 'Tailwind CSS', 'Framer Motion', 'GitHub'],
  },
  {
    title: 'B.Tech in Computer Science and Engineering',
    org: 'RCC Institute of Information Technology (RCCIIT), Kolkata',
    period: 'August 2023 – Present',
    kind: 'education',
    bullets: [
      'Current CGPA: 8.08 / 10.0',
      'Active competitive programmer, hackathon winner, and full-stack software builder.',
    ],
    ingredients: ['Algorithms', 'Data Structures', 'Database Systems', 'Software Engineering'],
  },
  {
    title: 'Hackathon Achievements & Honors',
    org: 'Global & National Hackathons',
    period: '2025 – 2026',
    kind: 'other',
    bullets: [
      'Winner (1st Place) – 100Agents Hackathon: placed 1st among 650+ international teams.',
      '1st Runner Up – Hackfest \'25 at IIT (ISM) Dhanbad.',
      '2nd Runner Up – DevNexus among 300 participating teams.',
    ],
    ingredients: ['AI Agents', 'System Architecture', 'Rapid Prototyping', 'Team Leadership'],
  },
];
