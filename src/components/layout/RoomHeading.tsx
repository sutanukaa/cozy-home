import { getRoom, type RoomSlug } from '@/data/rooms';
import CozyIcon from '@/components/ui/CozyIcon';

export default function RoomHeading({ room, title }: { room: RoomSlug; title?: string }) {
  const r = getRoom(room);
  return (
    <div className="mx-auto mb-6 max-w-5xl text-center">
      <p className="flex items-center justify-center gap-2 font-hand text-2xl text-ink-soft">
        <CozyIcon name={r.slug} fallback={r.emoji} size={28} />
        <span>{r.purpose}</span>
      </p>
      <h1 className="font-display text-4xl font-semibold tracking-tight sm:text-5xl">{title ?? r.name}</h1>
      <p className="mt-1 font-hand text-2xl text-ink-soft">{r.tagline}</p>
    </div>
  );
}
