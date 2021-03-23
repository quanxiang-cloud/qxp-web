const colors = require('./tailwind-config/colors');

module.exports = {
  purge: ['./clients/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    // spacing: {
    //   2: '2px',
    //   4: '4px',
    //   8: '8px',
    //   12: '12px',
    //   16: '16px',
    //   24: '24px',
    // },
    // disable responsive
    screens: {
      // '2xl': { max: '1535px' },
      // xl: { max: '1279px' },
      // lg: { max: '1023px' },
      // md: { max: '767px' },
      // sm: { max: '639px' },
    },
    extend: {
      colors: {
        'white-dot-6-5': 'rgba(255, 255, 255, .65)',
      },
      // todo remove this
      spacing: {
        '16px': '16px',
      },
      // spacing: {
      //   2: '2px',
      //   4: '4px',
      //   8: '8px',
      //   12: '12px',
      //   16: '16px',
      //   20: '20px',
      // },
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
};
