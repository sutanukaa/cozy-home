import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomNavArrows from '@/components/ui/RoomNavArrows';
import PaperCard from '@/components/ui/PaperCard';
import CozyIcon from '@/components/ui/CozyIcon';
import LibraryVectorBookshelf from '@/components/scene/LibraryVectorBookshelf';
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

export default function LibraryPage() {
  return (
    <div className="relative min-h-screen w-full bg-wall select-none">
      {/* 16:9 Hero Room Scene with clean bookshelf background */}
      <section className="relative h-screen w-full overflow-hidden">
        <RoomScene room="library" fit="cover" hotspots={[]}>
          {/* Realistic Handcrafted Vector Books & Wooden Shelf Category Plaques */}
          <LibraryVectorBookshelf />
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
