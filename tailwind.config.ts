import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '"Segoe UI"', 'Roboto', 'sans-serif'],
      },
      colors: {
        ms: {
          blue: '#0078D4',
          'blue-dark': '#106EBE',
          'blue-light': '#DEECF9',
          'blue-lighter': '#EFF6FC',
          'bg': '#F0F6FF',
          'bg-alt': '#E8F1FE',
          'card': 'rgba(255,255,255,0.85)',
          'border': 'rgba(0,120,212,0.1)',
          'text': '#1B1B1F',
          'text-secondary': '#49454F',
        },
        dark: {
          bg: '#0F1729',
          'bg-secondary': '#162038',
          card: 'rgba(22,32,56,0.8)',
          border: 'rgba(59,130,246,0.15)',
          text: '#E2E8F0',
          'text-secondary': '#94A3B8',
        },
        accent: {
          blue: '#0078D4',
          purple: '#7C3AED',
          teal: '#0D9488',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGlow: {
          '0%, 100%': { boxShadow: '0 0 5px rgba(0,120,212,0.3)' },
          '50%': { boxShadow: '0 0 20px rgba(0,120,212,0.6)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
