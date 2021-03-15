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
        'blue-third': '#E2E8F0',
        'white-dot-6-5': 'rgba(255, 255, 255, .65)',
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
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
