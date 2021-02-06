const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    colors: {
      primary: {
        blue: '#3A7CFD',
        start: '#55DDFF',
        end: '#C058F3',
      },
      light: {
        'gray-100': '#FAFAFA',
        'gray-200': '#E3E4F1',
        'gray-500': '#494C6B',
        'gray-400': '#9495A5',
        'gray-300': '#D1D2DA',
      },
      dark: {
        'gray-100': '#E3E4F1',
        'gray-200': '#C8CBE7',
        'gray-300': '#767992',
        'gray-400': '#5B5E7E',
        'gray-500': '#4D5067',
        'gray-600': '#494C6B',
        'gray-700': '#393A4B',
        'gray-800': '#25273D',
        'gray-900': '#171823',
      },
      white: '#FFF',
    },
    extend: {
      fontFamily: {
        sans: ['Josefin SansVariable', ...defaultTheme.fontFamily.sans],
      },
      fontSize: {
        heading: ['2.5rem', 1.2],
        icon: ['1.625rem', 1],
      },
      letterSpacing: {
        heading: '.375em',
      },
      backgroundImage: {
        'light-desktop': 'url(../images/bg-desktop-light.jpg)',
        'light-mobile': 'url(../images/bg-mobile-light.jpg)',
        'dark-desktop': 'url(../images/bg-desktop-dark.jpg)',
        'dark-mobile': 'url(../images/bg-mobile-dark.jpg)',
      },
      backgroundSize: {
        desktop: '100% 300px',
        mobile: '100% 200px',
      },
      maxWidth: {
        container: '33.75rem',
      },
    },
  },
}
