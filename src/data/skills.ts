export interface Shelf {
  name: string;
  emoji: string;
  books: string[];
}

export const shelves: Shelf[] = [
  {
    name: 'Frontend & UI',
    emoji: '🎀',
    books: ['TypeScript', 'JavaScript', 'Next.js', 'React.js', 'React Native', 'Tailwind CSS', 'Framer Motion', 'Polaris'],
  },
  {
    name: 'Backend & APIs',
    emoji: '🧁',
    books: ['FastAPI', 'Node.js', 'Express.js', 'Celery', 'Redis', 'PostgreSQL', 'Prisma', 'MongoDB', 'Supabase'],
  },
  {
    name: 'AI & Data',
    emoji: '🪄',
    books: ['Gemini API', 'RAG', 'Vector Embeddings', 'ChromaDB', 'Vercel AI SDK', 'ETL Pipelines'],
  },
  {
    name: 'Tools & DevOps',
    emoji: '🧰',
    books: ['Docker', 'Git & GitHub', 'GitHub Actions', 'Google Cloud Run', 'Vercel', 'Postman'],
  },
];

export const currentlyLearning = [
  'Advanced multi-agent orchestration patterns',
  'Deep AST analysis & compiler toolchains',
  'Fine-grained web performance & 3D micro-interactions',
];
