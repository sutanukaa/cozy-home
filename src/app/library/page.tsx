import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomNavArrows from '@/components/ui/RoomNavArrows';
import PaperCard from '@/components/ui/PaperCard';
import CozyIcon from '@/components/ui/CozyIcon';
import { shelves, currentlyLearning } from '@/data/skills';

export const metadata: Metadata = { title: 'Library' };

// soft book-spine colours (fixed, readable in both themes)
const spineColors = ['bg-rose text-white', 'bg-butter text-cocoa', 'bg-sage text-cocoa', 'bg-blush text-cocoa', 'bg-[#C9B6E4] text-cocoa', 'bg-[#9ED0E6] text-cocoa'];

const shelfIcons: Record<string, string> = {
  'Frontend & UI': 'skill-frontend',
  'Backend & APIs': 'skill-backend',
  'AI & Data': 'skill-ai',
  'Tools & DevOps': 'skill-tools',
};

interface ShelfPlate {
  id: string;
  name: string;
  iconName: string;
  fallback: string;
  x: number;
  y: number;
}

const shelfPlates: ShelfPlate[] = [
  {
    id: 'shelf-frontend',
    name: 'Frontend & UI',
    iconName: 'skill-frontend',
    fallback: '🎀',
    x: 18.5,
    y: 18.0,
  },
  {
    id: 'shelf-backend',
    name: 'Backend & APIs',
    iconName: 'skill-backend',
    fallback: '🧁',
    x: 18.5,
    y: 34.5,
  },
  {
    id: 'shelf-ai',
    name: 'AI & Data',
    iconName: 'skill-ai',
    fallback: '🪄',
    x: 18.5,
    y: 46.5,
  },
  {
    id: 'shelf-tools',
    name: 'Tools & DevOps',
    iconName: 'skill-tools',
    fallback: '🧰',
    x: 18.5,
    y: 58.5,
  },
];

export default function LibraryPage() {
  return (
    <div className="relative min-h-screen w-full bg-wall select-none">
      {/* 16:9 Hero Room Scene with empty shelves ready for book stickers */}
      <section className="relative h-screen w-full overflow-hidden">
        <RoomScene room="library" fit="cover" hotspots={[]}>
          {/* 4 Shelf Row Category Headings on the wooden shelves */}
          <div className="absolute inset-0 pointer-events-none z-10">
            {shelfPlates.map((plate) => (
              <a
                key={plate.id}
                href={`#${plate.id}`}
                title={`Go to ${plate.name} shelf`}
                className="pointer-events-auto absolute flex items-center gap-1.5 sm:gap-2 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md sm:rounded-lg bg-[#55331E]/85 hover:bg-[#683F26] border border-[#7D4F31]/80 shadow-[0_3px_6px_rgba(0,0,0,0.45)] backdrop-blur-[1px] transition-all hover:scale-105 active:scale-95 group"
                style={{
                  left: `${plate.x}%`,
                  top: `${plate.y}%`,
                }}
              >
                <CozyIcon
                  name={plate.iconName}
                  fallback={plate.fallback}
                  size={20}
                  className="shrink-0 drop-shadow-xs group-hover:rotate-6 transition-transform"
                />
                <span
                  className="font-hand text-xs sm:text-sm md:text-base font-bold text-[#FFF5E6] whitespace-nowrap tracking-wide"
                  style={{
                    textShadow:
                      '0 1px 2px rgba(0, 0, 0, 0.95), 0 0 8px rgba(255, 210, 160, 0.45)',
                  }}
                >
                  {plate.name}
                </span>
              </a>
            ))}
          </div>
        </RoomScene>

        {/* Pink bubble navigation arrows: left to Bedroom, right to Kitchen */}
        <RoomNavArrows
          prev={{ name: 'Bedroom', href: '/bedroom' }}
          next={{ name: 'Kitchen', href: '/kitchen' }}
        />

        {/* Library Room Heading positioned neatly in the bottom right corner like Studio & Bedroom */}
        <div className="library-heading pointer-events-none absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-12 md:right-10 z-20 max-w-[240px] sm:max-w-sm md:max-w-md text-right select-none">
          <h1
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md"
            style={{
              textShadow:
                '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
            }}
          >
            The Library
          </h1>
          <p
            className="mt-0.5 sm:mt-1 font-hand text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/95"
            style={{
              textShadow:
                '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
            }}
          >
            Every shelf is something I have learned.
          </p>
        </div>
      </section>

      {/* Skills Shelves & Learning Cards below the scene */}
      <div className="mx-auto max-w-5xl px-4 py-16 space-y-6 select-text">
        <section aria-label="Skills" className="space-y-6">
          {shelves.map((shelf) => {
            const shelfId =
              shelf.name === 'Frontend & UI'
                ? 'shelf-frontend'
                : shelf.name === 'Backend & APIs'
                ? 'shelf-backend'
                : shelf.name === 'AI & Data'
                ? 'shelf-ai'
                : 'shelf-tools';
            return (
              <div key={shelf.name} id={shelfId} className="scroll-mt-20">
                <h2 className="mb-2 flex items-center gap-2 font-hand text-3xl">
                  <CozyIcon name={shelfIcons[shelf.name] ?? ''} fallback={shelf.emoji} size={30} />
                  <span>{shelf.name}</span>
                </h2>
                <ul className="flex min-h-[9rem] items-end gap-1.5 overflow-x-auto rounded-t-2xl border-b-[10px] border-cocoa/70 bg-ink/5 px-4 pt-4">
                  {shelf.books.map((b, i) => (
                    <li
                      key={`${b}-${i}`}
                      className={`spine flex shrink-0 items-center justify-center rounded-t-md px-3 py-3 text-sm font-semibold shadow-md transition-transform hover:-translate-y-2 ${spineColors[(i + shelf.name.length) % spineColors.length]}`}
                      style={{ height: `${6.5 + ((i * 7) % 5) * 0.55}rem` }}
                    >
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}

          <PaperCard tilt={-0.8} tape className="mt-8">
            <h2 className="mb-2 font-hand text-3xl">Currently learning</h2>
            <ul className="list-inside list-disc space-y-1 text-lg">
              {currentlyLearning.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
          </PaperCard>
        </section>
      </div>
    </div>
  );
}
