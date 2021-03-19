module.exports = {
  purge: [],
  darkMode: false, // or 'media' or 'class'
  theme: {
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
