/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin')

module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        poppins: ['"Poppins"', 'sans-serif'],
        sans: ['"Poppins"', 'sans-serif'],
      },
      screens: {
        'below-280': {'max': '279px'},
        'sc-270': {'max': '270px'},
        'sc-300': {'max': '300px'},
        'sc-320': {'max': '320px'},
        'sc-380': {'max': '380px'},
        'sc-420': {'max': '420px'},
        'sc-480': {'max': '480px'},
        'sc-450': {'max': '450px'},
        'sc-520': {'max': '520px'},
        'sc-565': {'max': '565px'},
        'sc-580': {'max': '580px'},
        'sc-640': {'max': '640px'},
        'sc-660': {'max': '660px'},
        'sc-680': {'max': '680px'},
        'scmin-680': {'min': '680px'},
        'sc-740': {'max': '740px'},
        'sc-780': {'max': '780px'},
        'sc-820': {'max': '820px'},
        'sc-920': {'max': '920px'},
        'sc-980': {'max': '980px'},
        'scmin-980': {'min': '980px'},
        'scmin-1024': {'min': '1024px'},
        'sc-1024': {'max': '1024px'},
        'sc-1023': {'max': '1023px'},
        'sc-1050': {'max': '1050px'},
        'scmin-1051': {'min': '1051px'},
        'scmin-1050': {'min': '1050px'},
        'sc-1120': {'max': '1120px'},
        'sc-1200': {'max': '1200px'},
        'sc-1280': {'max': '1280px'},
        'scmin-1280': {'min': '1280px'},
        'sc-1415': {'max': '1415px'},
        'scmin-1420': {'min': '1420px'},
        'sc-1420': {'max': '1420px'},
        'sc-1480': {'max': '1480px'},
        'sc-1520': {'max': '1520px'},
        'sc-1600': {'max': '1600px'},
        'sc-1720': {'max': '1720px'},
        'sc-1820': {'max': '1820px'},
        'scmin-1675': {'min': '1675px'},
        '2xsm': '375px',
        'xsm': '425px',
        '3xl': '2000px',
      },
      animation: {
        'bounce-slow': 'bounce 3s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'spin-reverse': 'spin-reverse 2s linear infinite',
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 8s ease-in-out infinite',
        'float-slow': 'float 12s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
        'spin-reverse-slow': 'spin-reverse 12s linear infinite',
        'progress': 'progress 2s ease-in-out infinite',
        'fade-in': 'fade-in 0.2s ease-out forwards',
      },
      keyframes: {
        'spin-reverse': {
          '0%': { transform: 'rotate(360deg)' },
          '100%': { transform: 'rotate(0deg)' }
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'spin-reverse': {
          'to': { transform: 'rotate(-360deg)' },
        },
        progress: {
          '0%': { width: '0%' },
          '100%': { width: '75%' }
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        }
      },
      backgroundImage: {
        'grid-dark': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        'grid-white': "url(\"data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='1' cy='1' r='1'/%3E%3C/g%3E%3C/svg%3E\")",
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
    },
  },
  plugins: [
    plugin(function({ addVariant }) {
      // Add no-effects variant that only applies when the html element has the no-effects class
      addVariant('no-effects', 'html.no-effects &');
    }),
  ],
}