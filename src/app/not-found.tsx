import Button from '@/components/ui/Button';

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-6xl">🚪</p>
      <h1 className="mt-4 font-display text-4xl font-semibold">That door leads nowhere</h1>
      <p className="mt-2 font-hand text-2xl text-ink-soft">This room is not built yet. Head back to the living room.</p>
      <Button href="/" className="mt-6">Back home</Button>
    </div>
  );
}
