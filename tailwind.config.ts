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
          bg: '#0A0F1E',
          'bg-secondary': '#111B33',
          card: 'rgba(17,27,51,0.85)',
          border: 'rgba(59,130,246,0.15)',
          text: '#E2E8F0',
          'text-secondary': '#94A3B8',
        },
        accent: {
          blue: '#0078D4',
          purple: '#7C3AED',
          teal: '#0D9488',
          coral: '#F43F5E',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-glow': 'pulseGlow 2s infinite',
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'float-delayed': 'float 7s ease-in-out 2s infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'gradient-shift': 'gradientShift 8s ease infinite',
        'orbit': 'orbit 20s linear infinite',
        'orbit-reverse': 'orbit 15s linear infinite reverse',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
        'morph': 'morph 8s ease-in-out infinite',
        'spin-slow': 'spin 12s linear infinite',
        'bounce-gentle': 'bounceGentle 3s ease-in-out infinite',
        'scale-in': 'scaleIn 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
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
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        orbit: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        glowPulse: {
          '0%, 100%': { opacity: '0.4', transform: 'scale(1)' },
          '50%': { opacity: '0.8', transform: 'scale(1.05)' },
        },
        morph: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%': { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
