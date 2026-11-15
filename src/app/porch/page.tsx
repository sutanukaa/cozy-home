import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import RoomHeading from '@/components/layout/RoomHeading';
import PaperCard from '@/components/ui/PaperCard';
import ContactForm from '@/components/rooms/ContactForm';
import { site } from '@/data/site';
import type { HotspotDef } from '@/components/ui/Hotspot';

export const metadata: Metadata = { title: 'Porch' };

const hotspots: HotspotDef[] = [
  { id: 'mailbox', label: 'The mailbox', x: 78, y: 62, emoji: '📬', href: '#note' },
];

export default function PorchPage() {
  return (
    <div>
      <section className="relative h-screen w-full">
        <RoomScene room="porch" hotspots={hotspots}>
          <div className="pointer-events-none absolute inset-x-0 top-24 z-20 mx-auto max-w-xl px-4 text-center">
            <RoomHeading room="porch" title="The porch" />
          </div>
        </RoomScene>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[1fr_20rem]">
          <PaperCard id="note" tape>
            <h2 className="mb-4 font-display text-2xl font-semibold">Leave a note</h2>
            <ContactForm />
          </PaperCard>

          <PaperCard tilt={1} className="self-start">
            <h2 className="mb-3 font-hand text-3xl">Or find me here</h2>
            <ul className="space-y-2 text-lg">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target={s.href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer" className="inline-flex items-center gap-2 underline decoration-accent decoration-2 underline-offset-4 hover:text-accent">
                    <span aria-hidden>{s.emoji}</span>
                    {s.label}
                  </a>
                </li>
              ))}
            </ul>
          </PaperCard>
        </div>
      </div>
    </div>
  );
}
