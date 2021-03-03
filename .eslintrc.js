module.exports = {
  'env': {
    'browser': true,
    'es2021': true,
  },
  'settings': {
    'react': {
      'version': 'detect',
    },
  },
  'extends': [
    'plugin:react/recommended',
    'google',
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended', 
  ],
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true,
    },
    'ecmaVersion': 12,
    'sourceType': 'module',
  },
  'plugins': [
    'react',
    '@typescript-eslint',
    'prettier',
  ],
  'globals': {
    'window': true
  },
  'rules': {
  },
};
