import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#1e2a4a',
          blue: '#3b82f6',
          gold: '#c9a84c',
          paper: '#f8f6f0',
          ink: '#1a1a2e',
        },
      },
      boxShadow: {
        academic: '0 4px 24px rgba(0, 0, 0, 0.06)',
      },
    },
  },
  plugins: [],
} satisfies Config;
