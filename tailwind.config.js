/** @type {import('tailwindcss').Config} */
const token = (name) => ({ opacityValue }) => opacityValue === undefined
  ? `var(--${name})` : `color-mix(in srgb, var(--${name}) calc(${opacityValue} * 100%), transparent)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: token('background'),
        surface: { DEFAULT: token('surface'), 2: token('surface-muted') },
        border: { DEFAULT: token('border'), strong: token('border-strong') },
        foreground: { DEFAULT: token('foreground'), secondary: token('text-secondary'), tertiary: token('text-secondary') },
        primary: { DEFAULT: token('accent'), fg: token('accent-foreground') },
        danger: token('danger'), success: token('success'), warning: token('warning'),
      },
      borderRadius: { '4xl': 'var(--radius-surface)' },
      boxShadow: { card: 'none', float: 'var(--shadow-floating)' },
      fontFamily: { sans: ['var(--font-body)'] },
      transitionTimingFunction: { smooth: 'var(--ease-standard)' },
    },
  },
  plugins: [],
};
