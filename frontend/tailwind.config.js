/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        primary: { DEFAULT: '#4F46E5' },
        success: { DEFAULT: '#22C55E' },
        warning: { DEFAULT: '#F59E0B' },
        danger: { DEFAULT: '#EF4444' },
        background: { DEFAULT: '#F8FAFC' },
        card: { DEFAULT: '#FFFFFF' },
        text: { DEFAULT: '#0F172A', secondary: '#64748B' },
        brand: {
          50:  '#EEF2FF',
          100: '#E0E7FF',
          500: '#6366F1',
          600: '#4F46E5',
          700: '#4338CA',
        },
      },
      boxShadow: {
        'card':       '0 1px 3px 0 rgba(0,0,0,0.06), 0 1px 2px -1px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 16px -2px rgba(0,0,0,0.09), 0 2px 6px -2px rgba(0,0,0,0.06)',
        'modal':      '0 20px 60px -10px rgba(0,0,0,0.18), 0 8px 24px -8px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-in':      'fadeIn 0.3s ease-out both',
        'slide-up':     'slideUp 0.3s ease-out both',
        'slide-in-right': 'slideInRight 0.3s ease-out both',
        'spin-slow':    'spin 2s linear infinite',
      },
      keyframes: {
        fadeIn:       { from: { opacity: 0 },                                  to: { opacity: 1 } },
        slideUp:      { from: { opacity: 0, transform: 'translateY(10px)' },   to: { opacity: 1, transform: 'translateY(0)' } },
        slideInRight: { from: { opacity: 0, transform: 'translateX(10px)' },   to: { opacity: 1, transform: 'translateX(0)' } },
      },
    },
  },
  plugins: [],
};
