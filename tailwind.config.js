/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  darkMode: 'class',
  content: ['./app/**/*.{ts,tsx,jsx,js}'],
  theme: {
    extend: {
      colors: {
        lightText: 'hsl(200, 15%, 8%)',
        lightBg: 'hsl(0, 0%, 98%)',
        lightInput: 'hsl(0, 0%, 52%)',
        darkBg: 'hsl(207, 26%, 17%)',
        darkElement: 'hsl(209, 23%, 22%)',
      },
      boxShadow: {
        back: '0 0 7px 0 rgba(0, 0, 0, 0.2931)',
        card: '0 0 7px 2px rgba(0, 0, 0, 0.0294)',
        link: '0 0 4px 1px rgba(0, 0, 0, 0.1049)',
        nav: '0 2px 4px 0 rgba(0, 0, 0, 0.0562)',
        search: '0 2px 9px 0 rgba(0, 0, 0, 0.0532)',
      },
      fontFamily: {
        sans: ['Nunito Sans', ...defaultTheme.fontFamily.sans],
      },
    },
  },
};
