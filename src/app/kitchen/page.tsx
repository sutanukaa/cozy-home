import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomHeading from '@/components/layout/RoomHeading';
import PaperCard from '@/components/ui/PaperCard';
import Sticker from '@/components/ui/Sticker';
import { recipes } from '@/data/experience';
import type { HotspotDef } from '@/components/ui/Hotspot';

export const metadata: Metadata = { title: 'Kitchen' };

const hotspots: HotspotDef[] = [
  { id: 'kettle', label: 'The kettle', x: 70, y: 48, emoji: '🫖', note: 'Always on. Hot masala chai fuels every build.' },
];

const kindLabel = { work: 'work', education: 'school', other: 'other' } as const;

export default function KitchenPage() {
  return (
    <div>
      <section className="relative h-screen w-full">
        <RoomScene room="kitchen" hotspots={hotspots}>
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto max-w-xl px-4 text-center">
            <RoomHeading room="kitchen" title="The kitchen" />
          </div>
        </RoomScene>
      </section>

      <div className="mx-auto max-w-4xl px-4 py-16">
        <section aria-label="Experience and education" className="mx-auto max-w-3xl">
          <ol className="space-y-6">
            {recipes.map((r, i) => (
              <PaperCard as="li" key={`${r.title}-${i}`} tilt={i % 2 ? 0.7 : -0.7} tape>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-display text-2xl font-semibold">{r.title}</h2>
                    <p className="text-ink-soft">{r.org}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-hand text-xl">{r.period}</p>
                    <Sticker tilt={2}>{kindLabel[r.kind]}</Sticker>
                  </div>
                </div>
                <ul className="mt-3 list-inside list-disc space-y-1">
                  {r.bullets.map((b) => <li key={b}>{b}</li>)}
                </ul>
                <p className="mt-4 font-hand text-xl text-ink-soft">Ingredients</p>
                <ul className="mt-1 flex flex-wrap gap-2">
                  {r.ingredients.map((g, k) => <li key={`${g}-${k}`}><Sticker tilt={0} className="bg-sage/40">{g}</Sticker></li>)}
                </ul>
              </PaperCard>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
