import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomHeading from '@/components/layout/RoomHeading';
import PaperCard from '@/components/ui/PaperCard';
import CozyIcon from '@/components/ui/CozyIcon';
import { shelves, currentlyLearning } from '@/data/skills';
import type { HotspotDef } from '@/components/ui/Hotspot';

export const metadata: Metadata = { title: 'Library' };

const hotspots: HotspotDef[] = [
  {
    id: 'reading',
    label: 'Reading nook',
    x: 78.5,
    y: 74,
    emoji: '📖',
    note: 'Currently reading: Designing Data-Intensive Applications & cozy fiction.',
  },
  {
    id: 'ladder',
    label: 'Rolling ladder',
    x: 62.5,
    y: 62,
    emoji: '🪜',
    note: 'For reaching the top shelves and hidden gems.',
  },
  {
    id: 'window',
    label: 'Sunlit window',
    x: 89.5,
    y: 38,
    emoji: '☀️',
    note: 'Soft golden light for afternoon reading.',
  },
];

// soft book-spine colours (fixed, readable in both themes)
const spineColors = ['bg-rose text-white', 'bg-butter text-cocoa', 'bg-sage text-cocoa', 'bg-blush text-cocoa', 'bg-[#C9B6E4] text-cocoa', 'bg-[#9ED0E6] text-cocoa'];

const shelfIcons: Record<string, string> = {
  'Frontend & UI': 'skill-frontend',
  'AI & Data': 'skill-ai',
  'Tools & DevOps': 'skill-tools',
};

export default function LibraryPage() {
  return (
    <div>
      <section className="relative h-screen w-full">
        <RoomScene room="library" hotspots={hotspots}>
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto max-w-xl px-4 text-center">
            <RoomHeading room="library" title="The library" />
          </div>
        </RoomScene>
      </section>

      <div className="mx-auto max-w-5xl px-4 py-16 space-y-6">
        <section aria-label="Skills" className="space-y-6">
          {shelves.map((shelf) => (
            <div key={shelf.name}>
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
          ))}

          <PaperCard tilt={-0.8} tape className="mt-8">
            <h2 className="mb-2 font-hand text-3xl">Currently learning</h2>
            <ul className="list-inside list-disc space-y-1 text-lg">
              {currentlyLearning.map((l) => <li key={l}>{l}</li>)}
            </ul>
          </PaperCard>
        </section>
      </div>
    </div>
  );
}
