const tailwindcss = require('tailwindcss');

module.exports = {
  plugins: [
    require('postcss-import'),
    tailwindcss({
      config: 'rollup-configs/mobile/tailwind.config.js',
    }),
    require('autoprefixer'),
  ],
};
