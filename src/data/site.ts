export const site = {
  name: 'Sutanuka Chakraborty',
  shortName: 'Sutanuka',
  role: 'Software Developer',
  tagline: 'Building thoughtful web applications, playful interfaces & intelligent software.',
  description: 'The personal portfolio of Sutanuka Chakraborty, a software developer. Step inside and explore my work.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sutanuka.vercel.app',
  email: 'sutanukachakraborty004@gmail.com',
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/sutanukaa', emoji: '🐙' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sutanuka-chakraborty-148744275/', emoji: '💼' },
    { label: 'Email', href: 'mailto:sutanukachakraborty004@gmail.com', emoji: '✉️' },
  ],
  about: {
    paragraphs: [
      "Hi! I'm Sutanuka, a software developer and computer science student who loves crafting thoughtful web applications, playful interfaces, and intelligent systems.",
      "I spend my time building full-stack platforms, experimenting with AI-grounded agents, and designing cozy corners of the internet with React, Next.js, and TypeScript.",
      "When I am not debugging late into the night, you can find me brainstorming new project ideas, exploring whimsical design details, or sipping a warm cup of chai.",
    ],
    loves: ['clean UI', 'pink aesthetics', 'tiny animations', 'chai', 'AI agents', 'late-night debugging'],
    funFacts: [
      'Won 1st place globally at the 100Agents Hackathon among 650+ teams! 🏆',
      'Built an end-to-end behavioral nudge engine with 18 browser trigger signals.',
    ],
  },
  mascot: {
    name: 'Mochi',
    dayLines: ['Welcome! Poke around.', 'The studio has the good stuff.', 'Mrrp! Have you seen the library?'],
    nightLines: ['zzz... five more minutes.', 'It is late. The lamp is on though.', '*sleepy purr*'],
  },
};
