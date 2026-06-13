import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        campus: {
          navy: '#0f2742',
          blue: '#1f5eff',
          gold: '#d6a129',
          paper: '#f7f3ea',
          ink: '#102033',
        },
      },
      boxShadow: {
        academic: '0 24px 80px rgba(15, 39, 66, 0.14)',
      },
    },
  },
  plugins: [],
};

export default config;
