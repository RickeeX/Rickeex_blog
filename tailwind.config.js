// @ts-check
const { fontFamily } = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')

/** @type {import("tailwindcss/types").Config } */
module.exports = {
  content: [
    './node_modules/pliny/**/*.js',
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,tsx}',
    './components/**/*.{js,ts,tsx}',
    './layouts/**/*.{js,ts,tsx}',
    './data/**/*.mdx',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      keyframes: {
        'grid-line-vertical': {
          '0%': { height: '0%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { height: '100%', opacity: '1' },
        },
        'grid-line-horizontal': {
          '0%': { width: '0%', opacity: '0' },
          '50%': { opacity: '1' },
          '100%': { width: '100%', opacity: '1' },
        },
        'grid-glow': {
          '0%, 100%': { opacity: '0.3' },
          '50%': { opacity: '0.5' },
        },
      },
      // 2. 注册 animation
      animation: {
        'grid-line-vertical': 'grid-line-vertical 1.2s ease-out forwards',
        'grid-line-horizontal': 'grid-line-horizontal 1.2s ease-out forwards',
        'grid-glow': 'grid-glow 3s ease-in-out infinite',
      },
      lineHeight: {
        11: '2.75rem',
        12: '3rem',
        13: '3.25rem',
        14: '3.5rem',
      },
      fontFamily: {
        //sans: ['var(--font-space-grotesk)', ...fontFamily.sans],
        sans: ['Hanken Grotesk Variable',
          'Noto Sans HK Variable',
          'Noto Sans SC Variable',
          //'var(--font-space-grotesk)',
          ...fontFamily.sans],
      },
      colors: {
        primary: colors.pink,
        gray: colors.gray,
      },
      zIndex: {
        60: '60',
        70: '70',
        80: '80',
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.600')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2': {
              fontWeight: '700',
              letterSpacing: theme('letterSpacing.tight'),
            },
            h3: {
              fontWeight: '600',
            },
            code: {
              color: theme('colors.indigo.500'),
            },
          },
        },
        invert: {
          css: {
            a: {
              color: theme('colors.primary.500'),
              '&:hover': {
                color: `${theme('colors.primary.400')}`,
              },
              code: { color: theme('colors.primary.400') },
            },
            'h1,h2,h3,h4,h5,h6': {
              color: theme('colors.gray.100'),
            },
          },
        },
      }),
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
}
