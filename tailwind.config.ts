import type { Config } from 'tailwindcss';

const withAlpha = (v: string) => `rgb(var(${v}) / <alpha-value>)`;

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  // `dark:` utilities follow our night theme (set on <html data-theme>), not the OS setting.
  darkMode: ['variant', '&:is(html[data-theme="night"] *)'],
  theme: {
    extend: {
      colors: {
        // Theme-aware tokens (change with day/night via CSS variables in globals.css)
        wall: withAlpha('--wall'),
        'wall-deep': withAlpha('--wall-deep'),
        paper: withAlpha('--paper'),
        ink: withAlpha('--ink'),
        'ink-soft': withAlpha('--ink-soft'),
        accent: withAlpha('--accent'),
        glow: withAlpha('--glow'),
        sage: withAlpha('--sage'),
        // Fixed brand colours (same day and night)
        blush: '#F9C6D3',
        rose: '#E86A92',
        cream: '#FFF6EC',
        cocoa: '#5B3A47',
        butter: '#FFE29A',
        plum: '#2B1B3A',
      },
      fontFamily: {
        display: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        body: ['Fredoka', 'ui-rounded', 'system-ui', 'sans-serif'],
        hand: ['Gaegu', 'Comic Sans MS', 'cursive'],
      },
      boxShadow: {
        cozy: '0 10px 30px -8px rgb(214 70 118 / 0.35), 0 2px 0 0 rgb(255 255 255 / 0.5) inset',
        'cozy-night': '0 10px 30px -8px rgb(0 0 0 / 0.5)',
        pop: '0 4px 0 0 rgb(var(--accent) / 0.55)',
      },
      keyframes: {
        float: { '0%,100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-8px)' } },
        bob: { '0%,100%': { transform: 'translateY(0) rotate(-2deg)' }, '50%': { transform: 'translateY(-5px) rotate(2deg)' } },
        twinkle: { '0%,100%': { opacity: '0.25', transform: 'scale(0.8)' }, '50%': { opacity: '1', transform: 'scale(1.15)' } },
        'ping-soft': { '0%': { transform: 'scale(0.8)', opacity: '0.8' }, '100%': { transform: 'scale(2)', opacity: '0' } },
        'petal-fall': {
          '0%': { transform: 'translate3d(0,-10vh,0) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '0.9' },
          '100%': { transform: 'translate3d(40px,110vh,0) rotate(360deg)', opacity: '0.2' },
        },
        firefly: {
          '0%,100%': { transform: 'translate3d(0,0,0)', opacity: '0.2' },
          '50%': { transform: 'translate3d(24px,-30px,0)', opacity: '1' },
        },
        'pop-in': { '0%': { transform: 'scale(0.6)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        bob: 'bob 3.5s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
        'ping-soft': 'ping-soft 2.2s ease-out infinite',
        'petal-fall': 'petal-fall 16s linear infinite',
        firefly: 'firefly 7s ease-in-out infinite',
        'pop-in': 'pop-in 0.25s ease-out both',
      },
    },
  },
  plugins: [],
};

export default config;
