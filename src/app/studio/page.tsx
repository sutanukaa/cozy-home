import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomHeading from '@/components/layout/RoomHeading';
import PaperCard from '@/components/ui/PaperCard';
import Sticker from '@/components/ui/Sticker';
import Button from '@/components/ui/Button';
import { projects } from '@/data/projects';
import type { HotspotDef } from '@/components/ui/Hotspot';

export const metadata: Metadata = { title: 'Studio' };

// Positions are % of the illustration. Tune them with /studio?debug
const hotspots: HotspotDef[] = [
  { id: 'monitor', label: 'The main monitor', x: 50, y: 42, emoji: '💻', note: 'Where most of the magic (and the bugs) happen.' },
  { id: 'plant', label: 'Desk plant', x: 82, y: 60, emoji: '🪴', note: 'Gets watered more often than my git branches get cleaned.' },
];

export default function StudioPage() {
  return (
    <div>
      <section className="relative h-screen w-full">
        <RoomScene room="studio" hotspots={hotspots}>
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto max-w-xl px-4 text-center">
            <RoomHeading room="studio" title="The studio" />
          </div>
        </RoomScene>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <section aria-label="Projects" className="mx-auto max-w-5xl">
          <ul className="grid gap-6 md:grid-cols-2">
            {projects.map((p, i) => (
              <PaperCard as="li" key={p.slug} tilt={i % 2 ? 0.6 : -0.6} className="flex flex-col p-0">
                {/* little window title bar, like a program open on the monitor */}
                <div className="flex items-center gap-2 rounded-t-3xl border-b-2 border-ink/10 bg-blush/70 px-4 py-2">
                  <span aria-hidden className="h-3 w-3 rounded-full bg-rose" />
                  <span aria-hidden className="h-3 w-3 rounded-full bg-butter" />
                  <span aria-hidden className="h-3 w-3 rounded-full bg-sage" />
                  <span className="ml-2 truncate font-hand text-lg text-cocoa">{p.slug}.app</span>
                </div>
                <div className="flex flex-1 flex-col gap-3 p-6">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="font-display text-2xl font-semibold">
                      <span aria-hidden className="mr-2">{p.emoji}</span>
                      {p.title}
                    </h2>
                    <Sticker tilt={3}>{p.status === 'shipped' ? 'shipped' : 'in progress'}</Sticker>
                  </div>
                  <p className="text-ink-soft">{p.blurb}</p>
                  <ul className="flex flex-wrap gap-2" aria-label="Tech used">
                    {p.tags.map((t) => (
                      <li key={t}><Sticker tilt={0} className="bg-sage/40">{t}</Sticker></li>
                    ))}
                  </ul>
                  <div className="mt-auto flex flex-wrap gap-3 pt-2">
                    {p.links.live && <Button href={p.links.live} external>Open site</Button>}
                    {p.links.code && <Button href={p.links.code} external variant="soft">See code</Button>}
                  </div>
                </div>
              </PaperCard>
            ))}
          </ul>
        </section>
      </div>
    </div>
  );
}
