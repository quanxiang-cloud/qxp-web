const colors = require('./tailwind-config/colors');

module.exports = {
  purge: ['./clients/**/*.tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: colors,
    spacing: {
      0: '0px',
      2: '2px',
      4: '4px',
      5: '5px',
      6: '6px',
      8: '8px',
      12: '12px',
      16: '16px',
      20: '20px',
      24: '24px',
      28: '28px',
      36: '36px',
      46: '46px',
      56: '56px',
    },
    fontSize: {
      'text-12': ['12px', '20px'],
      'text-14': ['14px', '22px'],
      'text-16': ['16px', '24px'],
      'text-20': ['20px', '38px'],
      'text-24': ['24px', '32px'],
    },
    borderRadius: {
      2: '2px',
      4: '4px',
      8: '8px',
      12: '12px',
      none: '0px',
      // todo remove this
      dot4: '0.4rem',
    },
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
      width: {
        '2dot4': '2.4rem',
      },
      height: {
        '2dot4': '2.4rem',
        '5.6': '5.6rem',
      },
      lineHeight: {
        11: '1.1rem',
        'dot-9': '0.9rem',
      },
      minHeight: {
        'dot-8': '0.8rem',
      },
      flex: {
        '2dot5': '2.5 1 0%',
        none: '0 0 0%',
        2: '2 2 0%',
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
