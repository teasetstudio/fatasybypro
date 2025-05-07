const plugin = require('tailwindcss/plugin');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#34D399', // Light Green
          600: '#059669', // Darker Green
        },
        secondary: {
          DEFAULT: '#3B82F6', // Blue-Green
          600: '#2563EB', // Darker Blue-Green
        },
        accent: {
          DEFAULT: '#FFD700', // Gold
          600: '#DAA520', // Darker Gold
        },
        neutral: {
          DEFAULT: '#3B82F6', // Light Blue
          600: '#2563EB', // Darker Light Blue
        },
        base: {
          DEFAULT: '#F1F5F9', // Very Light Gray
          600: '#E5E7EB', // Darker Light Gray
        },
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      textColor: {
        primary: '#0F172A', // Dark Blue
        secondary: '#6D28D9', // Deep Purple
        accent: '#EA580C', // Deep Orange
        muted: '#9CA3AF', // Muted Gray
        light: '#F3F4F6', // Light Gray
      },
    },
  },
  plugins: [
    plugin(function ({ addComponents }) {
      addComponents({
        '.container-full': {
          width: '100%',
          paddingLeft: '1rem',
          paddingRight: '1rem',
          marginLeft: 'auto',
          marginRight: 'auto',
        },
      });
    }),
  ],
}