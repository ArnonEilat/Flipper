import perfectionist from 'eslint-plugin-perfectionist';
import tseslint from 'typescript-eslint';

const eslintConfig = [
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tseslint.parser,
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      perfectionist,
    },
    rules: {
      'perfectionist/sort-interfaces': ['error'],
      'perfectionist/sort-intersection-types': ['error'],
      'perfectionist/sort-union-types': ['error'],
      'perfectionist/sort-array-includes': ['error'],
      'perfectionist/sort-exports': ['error'],
      'perfectionist/sort-named-exports': ['error'],
      'perfectionist/sort-object-types': ['error'],
      'perfectionist/sort-named-imports': ['error'],
      'perfectionist/sort-imports': [
        'error',
        {
          type: 'alphabetical',
          order: 'asc',
          ignoreCase: true,
        },
      ],
      'max-depth': ['error', 4],
      // 'max-lines': ['error', 350],
      'max-nested-callbacks': ['error', 3],
      'no-case-declarations': 'error',
      'no-dupe-else-if': 'error',
      'no-else-return': 'error',
      'no-extra-boolean-cast': 'error',
      'no-loop-func': 'error',
      'no-multi-assign': 'error',
      'no-negated-condition': 'error',
      'no-nested-ternary': 'error',
      'no-shadow-restricted-names': 'error',
      'no-unexpected-multiline': 'error',
      'no-unreachable': 'error',
      'no-unsafe-negation': 'error',
      'no-unsafe-optional-chaining': 'error',
      'no-use-before-define': 'error',
      'prefer-const': 'error',
      curly: 'error',
      'one-var': ['error', 'never'],
      'dot-notation': 'error',
      eqeqeq: 'error',
      'func-style': ['error', 'expression'],
      yoda: 'error',
      // complexity: ['warn', 10],
      // 'no-magic-numbers': 'error',
      // 'max-lines-per-function': ['error', { max: 30, skipBlankLines: true }],
      // 'sort-keys': 'error',
      // 'sort-imports': 'error',
      // 'no-shadow': 'error',
      // 'no-undefined': 'error',
      // 'prefer-template': 'error',
      // 'require-await': 'error',

      // camelcase: 'error',
      // "prettier/prettier": "error",
      // "@typescript-eslint/no-empty-object-type": "warn",
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_.*',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: 'e',
          ignoreRestSiblings: true,
        },
      ],
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**'],
  },
];

export default eslintConfig;
