import daisyui from 'daisyui';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F0E8',
        surface: '#FFFFFF',
        primary: {
          DEFAULT: '#2D5016',
          dark: '#1E360F',
          light: '#427022',
        },
        accent: {
          DEFAULT: '#8B6914',
          light: '#B2881D',
        },
        text: {
          DEFAULT: '#1A1A0F',
          muted: '#6B6B5A',
        },
        error: '#C0392B',
        success: '#27AE60',
        border: '#D4C9A8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Outfit', 'sans-serif'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out forwards',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        }
      }
    },
  },
  plugins: [
    daisyui,
  ],
  daisyui: {
    themes: [
      {
        kamaikitab: {
          "primary": "#2D5016",
          "secondary": "#8B6914",
          "accent": "#8B6914",
          "neutral": "#1A1A0F",
          "base-100": "#F5F0E8",
          "base-200": "#FFFFFF",
          "info": "#3ABFF8",
          "success": "#27AE60",
          "warning": "#FBBD23",
          "error": "#C0392B",
        },
      },
    ],
  },
}
