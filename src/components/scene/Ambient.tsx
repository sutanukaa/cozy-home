/**
 * Fixed, pointer-less particles over the whole site:
 * pink petals by day, twinkling stars + fireflies at night.
 * Deterministic values (no Math.random) so server and client markup match.
 * Visibility is toggled in CSS by <html data-theme>, so there is no flash.
 */
const petals = Array.from({ length: 14 }, (_, i) => ({
  left: (i * 37 + 11) % 100,
  delay: (i * 1.9) % 14,
  duration: 14 + ((i * 3) % 10),
  size: 9 + ((i * 5) % 9),
}));

const stars = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 53 + 7) % 100,
  top: (i * 29 + 3) % 75,
  delay: (i * 0.7) % 5,
  size: 2 + (i % 3),
}));

const fireflies = Array.from({ length: 8 }, (_, i) => ({
  left: (i * 41 + 13) % 95,
  top: 45 + ((i * 17) % 45),
  delay: (i * 1.3) % 7,
}));

export default function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[1] overflow-hidden">
      <div className="ambient-day absolute inset-0">
        {petals.map((p, i) => (
          <span
            key={i}
            className="petal"
            style={{ left: `${p.left}%`, width: p.size, height: p.size, animationDelay: `-${p.delay}s`, animationDuration: `${p.duration}s` }}
          />
        ))}
      </div>
      <div className="ambient-night absolute inset-0">
        {stars.map((s, i) => (
          <span key={i} className="star" style={{ left: `${s.left}%`, top: `${s.top}%`, width: s.size, height: s.size, animationDelay: `-${s.delay}s` }} />
        ))}
        {fireflies.map((f, i) => (
          <span key={i} className="firefly" style={{ left: `${f.left}%`, top: `${f.top}%`, animationDelay: `-${f.delay}s` }} />
        ))}
      </div>
    </div>
  );
}
