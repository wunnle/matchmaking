module.exports = {
  ignorePatterns: ['*.test*.js'],
  extends: ['eslint:recommended', 'react-app', 'plugin:prettier/recommended'],
  rules: {
    'prettier/prettier': [
      'warn',
      {
        trailingComma: 'none',
        singleQuote: true,
        printWidth: 90,
        endOfLine: 'auto',
        semi: false,
        arrowParens: 'avoid'
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    quotes: [
      2,
      'single',
      {
        avoidEscape: true,
        allowTemplateLiterals: true
      }
    ],
    'max-len': 0,
    'multiline-ternary': 0,
    'no-console': ['warn', { allow: ['warn', 'error'] }],
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'space-before-function-paren': 0,
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'no-warning-comments': [
      'warn',
      { terms: ['todo', 'fixme', 'any other term'], location: 'anywhere' }
    ]
  }
}
