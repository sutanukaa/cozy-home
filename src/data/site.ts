export const site = {
  name: 'Sutanuka Chakraborty',
  shortName: 'Sutanuka',
  role: 'Software Development Engineer',
  tagline: 'I build cozy, curious little things for the web.',
  description: 'The personal portfolio of Sutanuka Chakraborty, a software development engineer. Step inside and look around.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'https://sutanukaa.vercel.app',
  email: 'sutanukachakraborty004@gmail.com',
  resumeUrl: '/resume.pdf',
  socials: [
    { label: 'GitHub', href: 'https://github.com/sutanukaa', emoji: '🐙' },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/in/sutanuka-chakraborty-148744275/', emoji: '💼' },
    { label: 'Email', href: 'mailto:sutanukachakraborty004@gmail.com', emoji: '✉️' },
  ],
  about: {
    paragraphs: [
      "Hi, I’m Sutanuka. I’m a full-stack software development engineer and Computer Science student in Kolkata who builds intelligent systems end to end. That means automation workflows, servers, AI agents, and the heavy frontend that makes all of it feel good to use. I care about the details users feel but never notice. I like problems people actually run into in real life, and I like having fun while I solve them.",
      "I’m endlessly curious about technology, people, and how the world fits together, and that curiosity is how I end up learning something new on every project. Most of my work happens in React, Next.js, and TypeScript, with a growing soft spot for grounded, trustworthy AI. When I’m not building, I’m sketching new ideas, fussing over small design details, or sipping a warm cup of chai.",
    ],
    loves: ['clean UI', 'pink aesthetics', 'tiny animations', 'chai', 'AI agents', 'late-night debugging'],
    funFacts: [
      'Won 1st place globally at the 100Agents Hackathon among 650+ teams.',
      '1st runner up at Hackfest’25 at IIT Dhanbad.',
      '2nd runners up among 120 teams at Dev Nexus 1.0',
    ],
  },
  mascot: {
    name: 'Mochi',
    dayLines: ['Welcome! Poke around.', 'The studio has the good stuff.', 'Mrrp! Have you seen the library?'],
    nightLines: ['zzz... five more minutes.', 'It is late. The lamp is on though.', '*sleepy purr*'],
  },
};
