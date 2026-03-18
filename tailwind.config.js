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
        highlight: '#39A845',
        accent: '#2D8E38',
        light: {
          primary: '#ffffff',
          secondary: '#F1F5F9',
          text: '#0F172A',
          subtext: '#64748B'
        },
        dark: {
          primary: '#0F172A',
          secondary: '#1E293B',
          darker: '#020617',
          text: '#ffffff',
          subtext: '#94A3B8'
        },
      },
    },
  },
  plugins: [],
};