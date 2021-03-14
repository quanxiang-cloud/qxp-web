module.exports = {
  parser: '@typescript-eslint/parser',

  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
  ],

  parserOptions: {
    // Allows for the parsing of modern ECMAScript features
    ecmaVersion: 12,
    // Allows for the use of imports
    sourceType: 'module',
    ecmaFeatures: {
      // Allows for the parsing of JSX
      jsx: true,
    },
  },
  rules: {
    'require-jsdoc': 'off',
    'object-curly-spacing': ['warn', 'always'],
    semi: ['error', 'always'],
    quotes: ['error', 'single'],
    'quote-props': ['error', 'as-needed'],
    'no-underscore-dangle': 'off',
    'no-param-reassign': 'error',
    radix: [1, 'as-needed'],
    'class-methods-use-this': 'off',

    'comma-dangle': ['error', {
      arrays: 'always-multiline',
      objects: 'always-multiline',
      imports: 'always-multiline',
      exports: 'always-multiline',
      functions: 'ignore',
    }],
    'arrow-parens': ['error', 'always'],
    'arrow-body-style': 'off',
    'react/no-danger': 'off',
    'no-plusplus': 'error',
    'no-mixed-operators': 'error',
    'func-names': 'off',
    'function-paren-newline': 'off',
    'newline-per-chained-call': 'off',
    '@typescript-eslint/camelcase': 'off',

    'max-len': [1, {
      code: 100,
      tabWidth: 2,
      ignoreUrls: true,
      ignoreComments: true,
      ignoreRegExpLiterals: true,
      ignoreTrailingComments: true,
      ignorePattern: '^(\\s*[a-zA-Z_]+: \'[^\']+\'[,;]*)|(.*interpolate.*)|(.*require.*)|(.*_\\.template.*)|(<svg .*)|(<rect .*)|(<polygon .*)$',
    }],

    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/extensions': 'off',

    'jsx-a11y/no-static-element-interactions': 'off',

    'react/prefer-stateless-function': 'off',
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': 'off',
    'react/no-find-dom-node': 'off',
    'react/jsx-no-bind': 'off',
    'react/sort-comp': ['warn', {
      order: [
        'static-methods',
        'instance-variables',
        'lifecycle',
        'everything-else',
        'render',
      ],
      groups: {
        lifecycle: [
          'statics',
          'displayName',
          'propTypes',
          'contextTypes',
          'childContextTypes',
          'mixins',
          'defaultProps',
          'constructor',
          'getDefaultProps',
          'state',
          'getInitialState',
          'getChildContext',
          'getDerivedStateFromProps',
          'componentWillMount',
          'UNSAFE_componentWillMount',
          'componentDidMount',
          'componentWillReceiveProps',
          'UNSAFE_componentWillReceiveProps',
          'shouldComponentUpdate',
          'componentWillUpdate',
          'UNSAFE_componentWillUpdate',
          'getSnapshotBeforeUpdate',
          'componentDidUpdate',
          'componentDidCatch',
          'componentWillUnmount',
        ],
      },
    }],

    'prefer-promise-reject-errors': 'off',
  },
  settings: {
    react: {
      // Tells eslint-plugin-react to automatically detect the version of React to use
      version: 'detect',
    },
  },
};
