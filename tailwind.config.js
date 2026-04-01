/** @type {import('tailwindcss').Config} */ 
module.exports = {
  content: [
    "./App.{js,ts,tsx}",
    "./components/**/*.{js,ts,tsx}",
    "./app/**/*.{js,ts,tsx}",
    "./global.css", // Include global.css
  ],
  theme: {
    extend: {
      fontFamily: {
        'outfit': ['Outfit_400Regular'],
        'outfit-bold': ['Outfit_700Bold'],
      },
      spacing: {
        global: '24px'
      },
      colors: {
        // Light theme colors
        highlight: '#FF2056',
        light: {
          primary: '#ffffff',
          secondary: '#F5F5F5',
          text: '#000000',
          subtext: '#64748B'
        },
        // Dark theme colors
        dark: {
          primary: '#171717',
          secondary: '#262626',
          darker: '#000000',
          text: '#ffffff',
          subtext: '#A1A1A1'
        },
        // HDC brand colors
        hdc: {
          green: '#16A34A',
          'green-dark': '#15803D',
          'green-light': '#22C55E',
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          navy: '#1E3A5F',
          amber: '#F59E0B',
          'amber-light': '#FEF3C7',
          'green-bg': '#F0FDF4',
        },
      },
    },
  },
  plugins: [],
};