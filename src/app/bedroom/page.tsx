import type { Metadata } from 'next';
import RoomScene from '@/components/scene/RoomScene';
import BedroomFairyLights from '@/components/scene/BedroomFairyLights';
import RoomNavArrows from '@/components/ui/RoomNavArrows';
import PaperCard from '@/components/ui/PaperCard';
import Sticker from '@/components/ui/Sticker';
import Button from '@/components/ui/Button';
import AssetImage from '@/components/ui/AssetImage';
import { site } from '@/data/site';

export const metadata: Metadata = { title: 'Bedroom' };

export default function BedroomPage() {
  const { about } = site;
  return (
    <div className="relative min-h-screen w-full">
      <section className="relative h-screen h-[100dvh] w-full overflow-hidden select-none">
        <RoomScene room="bedroom" fit="cover">
          <BedroomFairyLights />
        </RoomScene>

        {/* Bedroom Room Heading positioned neatly in the bottom right corner like Studio */}
        <div className="bedroom-heading pointer-events-none absolute bottom-6 right-4 sm:bottom-8 sm:right-6 md:bottom-12 md:right-10 z-20 max-w-[240px] sm:max-w-sm md:max-w-md text-right select-none">
          <h1
            className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white drop-shadow-md"
            style={{
              textShadow:
                '0 3px 14px rgba(0, 0, 0, 0.65), 0 0 28px rgba(255, 140, 180, 0.75), 0 2px 4px rgba(0,0,0,0.85)',
            }}
          >
            The Bedroom
          </h1>
          <p
            className="mt-0.5 sm:mt-1 font-hand text-base sm:text-xl md:text-2xl lg:text-3xl font-bold text-white/95"
            style={{
              textShadow:
                '0 2px 8px rgba(0, 0, 0, 0.55), 0 0 16px rgba(255, 200, 220, 0.5), 0 1px 3px rgba(0,0,0,0.75)',
            }}
          >
            A little about the person behind the code.
          </p>
        </div>

        {/* Pink bubble navigation arrows: left to Studio, right to Library */}
        <RoomNavArrows
          prev={{ name: 'Studio', href: '/studio' }}
          next={{ name: 'Library', href: '/library' }}
        />
      </section>

      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="mx-auto grid max-w-5xl gap-8 md:grid-cols-[18rem_1fr]">
          {/* polaroid: put your photo at /public/images/me.jpg */}
          <PaperCard tilt={-2} tape className="self-start p-4 pb-8">
            <div className="aspect-square overflow-hidden rounded-xl bg-blush">
              <AssetImage
                src="/images/me.jpeg"
                alt={`Photo of ${site.shortName}`}
                className="h-full w-full object-cover"
                fallback={<div className="flex h-full items-center justify-center font-display text-4xl text-ink/40" aria-hidden>SC</div>}
              />
            </div>
            <p className="mt-3 text-center font-hand text-2xl">{site.name}</p>
          </PaperCard>

          <div className="space-y-6">
            <PaperCard>
              <h2 className="mb-3 font-display text-2xl font-semibold">Hello, I&apos;m {site.shortName}</h2>
              <div className="max-w-prose space-y-3 text-lg leading-relaxed">
                {about.paragraphs.map((p, i) => <p key={i}>{p}</p>)}
              </div>
              <div className="mt-5"><Button href={site.resumeUrl} external variant="soft">Download my resume</Button></div>
            </PaperCard>

            <PaperCard tilt={0.8}>
              <h2 className="mb-3 font-hand text-3xl">Things I love</h2>
              <ul className="flex flex-wrap gap-2">
                {about.loves.map((l, i) => <li key={l}><Sticker tilt={i % 2 ? 2 : -2}>{l}</Sticker></li>)}
              </ul>
            </PaperCard>

            <PaperCard tilt={-0.6}>
              <h2 className="mb-2 font-hand text-3xl">Fun facts</h2>
              <ul className="list-inside list-disc space-y-1 text-lg">
                {about.funFacts.map((f) => <li key={f}>{f}</li>)}
              </ul>
            </PaperCard>
          </div>
        </div>
      </div>
    </div>
  );
}
