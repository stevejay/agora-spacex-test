module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module'
  },
  plugins: [
    'html',
    'import',
    'unicorn',
    'testing-library',
    'jsx-a11y',
    'eslint-plugin-tsdoc',
    'simple-import-sort',
    '@typescript-eslint',
    'prettier'
  ],
  extends: [
    'eslint:recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
    'plugin:testing-library/react',
    'plugin:storybook/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:eslint-comments/recommended',
    'prettier'
  ],
  rules: {
    'prettier/prettier': ['error'],
    'sort-imports': 'off',
    'import/order': 'off',
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': [
      'error',
      {
        groups: [
          // Packages. react related packages come first.
          ['^react', '^@?\\w'],
          // Internal packages.
          ['^(@)(/.*|$)'],
          // Side effect imports.
          ['^\\u0000'],
          // Parent imports. Put .. last.
          ['^\\.\\.(?!/?$)', '^\\.\\./?$'],
          // Other relative imports. Put same-folder imports and . last.
          ['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
          // Style imports.
          ['^.+\\.s?css$']
        ]
      }
    ],
    'unicorn/filename-case': [
      'error',
      {
        cases: {
          camelCase: true,
          pascalCase: true
        },
        // ignore ambient module declaration file names
        ignore: ['.d.ts$']
      }
    ],
    'testing-library/no-node-access': 0,
    'testing-library/render-result-naming-convention': 0,
    // Can't enable this until https://github.com/microsoft/tsdoc/issues/220 is fixed:
    'tsdoc/syntax': 0,
    'react/display-name': 'off', // forwardRef causing a problem here
    'react/prop-types': 'off', // forwardRef causing a problem here,
    'no-unused-vars': 'off'
  },
  settings: {
    react: {
      version: '17.0' // Would prefer this to be "detect"
    },
    'import/extensions': ['.js', '.jsx', '.ts', '.tsx'],
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx']
    },
    'import/resolver': {
      typescript: {
        // always try to resolve types under <root>@types directory even it doesn't contain any source code, like @types/unist
        alwaysTryTypes: true
      }
    }
  }
};
