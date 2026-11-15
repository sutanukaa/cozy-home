export type RoomSlug = 'living-room' | 'studio' | 'bedroom' | 'library' | 'kitchen' | 'porch';

export interface Room {
  slug: RoomSlug;
  href: string;
  name: string;
  emoji: string;
  /** What this room holds on the portfolio */
  purpose: string;
  tagline: string;
  /** Where this room's door sits on the living-room scene, in % (x, y). Tune with ?debug. */
  door: { x: number; y: number };
}

export const rooms: Room[] = [
  { slug: 'living-room', href: '/', name: 'Living room', emoji: '🛋️', purpose: 'Home / hello', tagline: 'Come in, take your shoes off.', door: { x: 50, y: 50 } },
  { slug: 'studio', href: '/studio', name: 'Studio', emoji: '🖥️', purpose: 'Projects', tagline: 'Where the pixels get pushed.', door: { x: 24, y: 54 } },
  { slug: 'bedroom', href: '/bedroom', name: 'Bedroom', emoji: '🧸', purpose: 'About me', tagline: 'A little about the person behind the code.', door: { x: 36, y: 53 } },
  { slug: 'library', href: '/library', name: 'Library', emoji: '📚', purpose: 'Skills & learning', tagline: 'Every shelf is something I have learned.', door: { x: 49, y: 52 } },
  { slug: 'kitchen', href: '/kitchen', name: 'Kitchen', emoji: '🍓', purpose: 'Experience & education', tagline: 'Recipes for the things I have cooked up.', door: { x: 60, y: 53 } },
  { slug: 'porch', href: '/porch', name: 'Porch', emoji: '💌', purpose: 'Contact', tagline: 'Knock, or leave a note in the mailbox.', door: { x: 71, y: 57 } },
];

export const getRoom = (slug: RoomSlug) => rooms.find((r) => r.slug === slug)!;
