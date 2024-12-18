
import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,  // Untuk lingkungan browser
        ...globals.node,     // Menambahkan dukungan untuk Node.js
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '18.3' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    'rules': {
  ...js.configs.recommended.rules,
  ...react.configs.recommended.rules,
  ...react.configs['jsx-runtime'].rules,
  ...reactHooks.configs.recommended.rules,
  'react/jsx-no-target-blank': 'off',
  'react-refresh/only-export-components': [
    'warn',
    { allowConstantExport: true },
  ],
  // Additional rules
  'no-unused-vars': 'warn', // Prevent unused variables
  'react/react-in-jsx-scope': 'off', // Disable this for React 17+ and new JSX transform
  'react/jsx-uses-react': 'off', // Disable as React 17+ doesn't require importing React
  'react/jsx-uses-vars': 'warn',
    'react/prop-types': 'off',  
  },
];
