/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
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
        highlight: '#3AB24E',
        light: {
          primary: '#ffffff',
          secondary: '#F3F4F6',
          text: '#0D131A',
          subtext: '#6B7280'
        },
        // Dark theme colors
        dark: {
          primary: '#0D131A',
          secondary: '#1F2937',
          darker: '#0B0F14',
          text: '#ffffff',
          subtext: '#9CA3AF'
        },
        // HDC brand colors
        hdc: {
          green: '#3AB24E',
          'green-dark': '#139C50',
          'green-light': '#66D17A',
          teal: '#0D9488',
          'teal-light': '#14B8A6',
          navy: '#1E3A5F',
          amber: '#F59E0B',
          'amber-light': '#FEF3C7',
          'green-bg': '#EAF8ED',
        },
      },
    },
  },
  plugins: [],
};