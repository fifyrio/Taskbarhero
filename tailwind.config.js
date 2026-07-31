/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontSize: {
        '2xs': '0.625rem', // 10px, smaller than text-xs (12px)
      },
      fontFamily: {
        display: ['var(--font-space-grotesk)', 'Space Grotesk', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        sans: ['var(--font-inter)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#f6b73c',
          50: '#f0f9ff',
          100: '#e0f2fe',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          900: '#0c4a6e',
        },
        secondary: {
          50: '#fdf4ff',
          100: '#fae8ff',
          500: '#a855f7',
          600: '#9333ea',
          700: '#7c3aed',
          900: '#581c87',
        },
        // TBH Tier List Wiki design tokens
        surface: '#14161b',
        panel: '#1c1f27',
        'surface-container': '#1c1f27',
        line: '#3e4248',
        ink: '#e8eaf1',
        dim: '#9aa1b5',
        faint: '#646b80',
        tan: '#c9b896',
        gold: '#f6b73c',
        rarity: {
          uncommon: '#54fc0c',
          rare: '#2f8bfc',
          legendary: '#fc9c0c',
          immortal: '#fc2424',
          arcana: '#b40cfc',
          divine: '#fce454',
        },
      },
      animation: {
        'fade-in': 'fadeIn 0.8s ease-in-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'modal-in': 'modalIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        modalIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(8px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}