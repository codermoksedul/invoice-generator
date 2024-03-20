/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    screens: {
      'sm': '576px',
      'md': '768px',
      'lg': '992px',
      'xl': '1200px',
      '2xl': '1400px',
    },
    container: {
      center: true,
    },
    extend: {
      colors: {
        'primary-color': '#0E6A46',
        'secondary-color': '#DF072B',
        'bg-color': '#fff',
        'dark-bg-color': '#0B111C',
        'txt-color' : '#1f202f',
        'heading-color' : '#053c28',
        'dark-title-color' : '#0E6A46',
        'dark-heading-color' : '#E2E8F0',
        'dark-txt-color' : '#e1e1e1',
        'border-color' : '#0000001a',
        'dark-border-color' : '#33374d5e',
        'shadow-color' : '#0000000f',
        'dark-shadow-color' : '#ffffff38',
        'box-color' : '#fff',
        'dark-box-color' : '#161f2c',
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
