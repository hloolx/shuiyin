/** @type {import('tailwindcss').Config} */

// 颜色全部走 CSS 变量（RGB 三元组），以支持暗色模式和 /透明度 修饰符
const v = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        background: v('bg'),
        surface: {
          DEFAULT: v('surface'),
          2: v('surface-2'),
        },
        border: {
          DEFAULT: v('border'),
          strong: v('border-strong'),
        },
        foreground: {
          DEFAULT: v('fg'),
          secondary: v('fg-2'),
          tertiary: v('fg-3'),
        },
        primary: {
          DEFAULT: v('primary'),
          fg: v('primary-fg'),
        },
        danger: v('danger'),
        success: v('success'),
        warning: v('warning'),
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        card: '0 1px 2px rgb(15 23 42 / 0.04), 0 4px 16px -6px rgb(15 23 42 / 0.08)',
        float: '0 12px 40px -12px rgb(15 23 42 / 0.28), 0 2px 6px rgb(15 23 42 / 0.06)',
        ring: '0 0 0 4px rgb(var(--primary) / 0.16)',
      },
      fontFamily: {
        sans: [
          '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
          'Microsoft YaHei', 'Helvetica Neue', 'Helvetica', 'Arial', 'sans-serif',
        ],
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'dash-flow': {
          to: { strokeDashoffset: '-24' },
        },
      },
      animation: {
        shimmer: 'shimmer 1.6s linear infinite',
        'dash-flow': 'dash-flow 1s linear infinite',
      },
    },
  },
  plugins: [],
};
