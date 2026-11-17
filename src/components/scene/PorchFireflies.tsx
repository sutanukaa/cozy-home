'use client';

// Pre-calculated fixed positions for fireflies (avoiding Math.random() for hydration safety)
const FIREFLIES = [
  // Garden & flower pots (left side)
  { id: 1, left: '12%', top: '68%', size: 5, duration: '6.2s', delay: '0s', drift: 'drift-up-right' },
  { id: 2, left: '16%', top: '55%', size: 6, duration: '7.8s', delay: '1.4s', drift: 'drift-up-left' },
  { id: 3, left: '22%', top: '72%', size: 4, duration: '5.5s', delay: '2.1s', drift: 'drift-hover' },
  { id: 4, left: '8%',  top: '80%', size: 5, duration: '8.1s', delay: '0.8s', drift: 'drift-up-right' },

  // Porch steps & center walkway
  { id: 5, left: '38%', top: '76%', size: 6, duration: '7.0s', delay: '3.2s', drift: 'drift-up-left' },
  { id: 6, left: '46%', top: '82%', size: 4, duration: '6.4s', delay: '1.9s', drift: 'drift-hover' },
  { id: 7, left: '52%', top: '65%', size: 5, duration: '8.5s', delay: '0.4s', drift: 'drift-up-right' },
  { id: 8, left: '42%', top: '58%', size: 4, duration: '5.9s', delay: '2.7s', drift: 'drift-up-left' },

  // Mailbox post & right fence / rosebush
  { id: 9,  left: '70%', top: '74%', size: 6, duration: '6.8s', delay: '1.1s', drift: 'drift-up-left' },
  { id: 10, left: '78%', top: '62%', size: 5, duration: '7.4s', delay: '2.5s', drift: 'drift-hover' },
  { id: 11, left: '85%', top: '78%', size: 4, duration: '8.0s', delay: '0.2s', drift: 'drift-up-right' },
  { id: 12, left: '90%', top: '56%', size: 5, duration: '6.1s', delay: '3.8s', drift: 'drift-up-left' },

  // Floating higher near porch eaves & warm lantern
  { id: 13, left: '28%', top: '38%', size: 5, duration: '7.6s', delay: '1.7s', drift: 'drift-hover' },
  { id: 14, left: '34%', top: '44%', size: 4, duration: '8.4s', delay: '0.9s', drift: 'drift-up-right' },
  { id: 15, left: '64%', top: '48%', size: 5, duration: '6.9s', delay: '2.2s', drift: 'drift-up-left' },
  { id: 16, left: '80%', top: '42%', size: 4, duration: '7.2s', delay: '1.5s', drift: 'drift-hover' },
];

export default function PorchFireflies() {
  return (
    <div
      aria-hidden="true"
      className="only-night pointer-events-none absolute inset-0 z-15 overflow-hidden select-none"
    >
      {FIREFLIES.map((f) => (
        <span
          key={f.id}
          className={`firefly firefly-${f.drift}`}
          style={{
            left: f.left,
            top: f.top,
            width: `${f.size}px`,
            height: `${f.size}px`,
            animationDuration: f.duration,
            animationDelay: f.delay,
          }}
        />
      ))}
    </div>
  );
}
