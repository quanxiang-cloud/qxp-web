const colors = require('./clients/theme/colors');

module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    screens: {
      '2xl': { max: '1535px' },
      xl: { max: '1279px' },
      lg: { max: '1023px' },
      md: { max: '767px' },
      sm: { max: '639px' },
    },
    extend: {
      colors: {
        'blue-primary': '#375FF3',
        'blue-second': '#8CADFF',
        'blue-light': '#F0F6FF',
        'dark-second': '#475569',
        'dark-third': '#334155',
        'dark-four': '#94A3B8',
        'dark-five': '#0F172A',
        'blue-third': '#E2E8F0',
        'white-dot-6-5': 'rgba(255, 255, 255, .65)',
        'gray-1': '#F1F5F9',
        'yellow-primary': '#D97706',
        'yellow-second': '#FFFBEB',
        'green-first': '#16A34A',
      },
      spacing: {
        '16px': '16px'
      },
      width: {
        '2dot4': '2.4rem',
      },
      height: {
        '2dot4': '2.4rem',
      },
      lineHeight: {
        11: '1.1rem',
        'dot-9': '0.9rem',
      },
      borderRadius: {
        dot4: '0.4rem',
      },
      minHeight: {
        'dot-8': '0.8rem',
      },
      flex: {
        '2dot5': '2.5 1 0%',
        none: '0 0 0%',
      },
      margin: {
        dot875: '0.875rem',
        dot4: '0.4rem',
      },
      inset: {
        '-2px': '-2px',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
