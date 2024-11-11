import globals from 'globals';
import babelParser from '@babel/eslint-parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
});

export default [...compat.extends('airbnb-base'), {
  languageOptions: {
    globals: {
      ...globals.node,
      Atomics: 'readonly',
      SharedArrayBuffer: 'readonly',
      libServices: 'writable',
    },

    parser: babelParser,
    ecmaVersion: 2021,
    sourceType: 'module',
  },

  settings: {
    'import/resolver': {
      alias: {
        map: [['#modules', './src/modules'], ['#lib', './src/lib']],
        extensions: ['.js', '.cjs', '.json'],
      },
    },
  },

  rules: {
    'consistent-return': 'off',
    'no-return-assign': 'off',
    'no-unused-vars': 'warn',

    'no-console': ['warn', {
      allow: ['warn', 'error', 'info'],
    }],

    'func-names': 'off',
    'no-process-exit': 'off',
    'object-shorthand': 'off',
    'class-methods-use-this': 'off',
    'arrow-parens': ['error', 'as-needed'],
    'operator-linebreak': 'off',
    quotes: [2, 'single', 'avoid-escape'],
    'linebreak-style': 'off',

    'max-len': ['error', {
      code: 120,
    }],

    'no-unused-expressions': ['error', {
      allowShortCircuit: true,
    }],

    'prefer-arrow-callback': 'off',
    'import/no-named-as-default-member': 'warn',
    'no-plusplus': 'off',
    'no-underscore-dangle': 'off',
    'no-restricted-syntax': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/order': ['error', {
      'newlines-between': 'always',
      groups: [['builtin', 'external'], 'internal', ['parent', 'sibling', 'index']],

      pathGroups: [{
        pattern: '#modules/**',

        patternOptions: {
          nocomment: true,
          comment: false,
        },

        group: 'internal',
      }, {
        pattern: '#lib/**',

        patternOptions: {
          nocomment: true,
          comment: false,
        },

        group: 'internal',
      }],
    }],
  },
}];
