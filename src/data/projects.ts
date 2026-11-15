export interface Project {
  slug: string;
  title: string;
  blurb: string;
  tags: string[];
  emoji: string;
  links: { live?: string; code?: string };
  status: 'shipped' | 'building';
}

export const projects: Project[] = [
  {
    slug: 'rag-document-qa',
    title: 'RAG Document Q&A Chatbot',
    blurb: 'Production-ready RAG system built from scratch with Gemini embeddings, ChromaDB vector search, hybrid retrieval, and automated CI eval harnesses.',
    tags: ['Python', 'FastAPI', 'Gemini API', 'ChromaDB', 'Next.js', 'Docker'],
    emoji: '🤖',
    links: { code: 'https://github.com/sutanukaa' },
    status: 'shipped',
  },
  {
    slug: 'syntactiq',
    title: 'Syntactiq Code Modernization',
    blurb: 'Automated legacy codebase modernizer using Tree-sitter AST parsing, NetworkX dependency graphs, and an async Celery/Redis multi-agent pipeline.',
    tags: ['Python', 'FastAPI', 'Celery', 'Redis', 'PostgreSQL', 'Tree-sitter', 'Next.js'],
    emoji: '⚡',
    links: { code: 'https://github.com/sutanukaa' },
    status: 'shipped',
  },
  {
    slug: 'a-little-scrapbook',
    title: 'A Little Scrapbook',
    blurb: 'A soft, whimsical personal scrapbook web experience filled with playful interactions and warm aesthetic touches.',
    tags: ['Next.js', 'React', 'Tailwind CSS', 'Framer Motion'],
    emoji: '📒',
    links: { live: 'https://a-little-scrapbook.vercel.app/' },
    status: 'shipped',
  },
  {
    slug: 'bloom-for-youu',
    title: 'Bloom for Youu',
    blurb: 'A gentle, animated digital flower bouquet created as a heartfelt gift on the web.',
    tags: ['React', 'JavaScript', 'CSS Animations', 'Framer Motion'],
    emoji: '🌸',
    links: { live: 'https://bloom-for-youu.vercel.app/' },
    status: 'shipped',
  },
];
