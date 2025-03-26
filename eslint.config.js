import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';

export default [
  js.configs.recommended,
  {
    files: ['**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        project: 'tsconfig.json',
        tsconfigRootDir: import.meta.dirname,
        sourceType: 'module',
      },
      globals: {
        process: 'readonly', // process를 전역으로 사용 가능하게 설정
        __dirname: 'readonly', // __dirname을 전역으로 사용 가능하게 설정
        jest: 'readonly', // jest 전역 변수를 사용하도록 설정
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: prettier,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          ignoreRestSiblings: true, // 스프레드 연산자 사용 시 경고하지 않음
        },
      ],
      'require-await': 'error',
      '@typescript-eslint/no-unused-expressions': [
        'warn',
        {
          allowTernary: true, // 삼항 연산자는 허용
        },
      ],
      'no-undef': 'off', // no-undef 규칙 비활성화
      'no-unused-vars': 'off', // no-unused-vars 규칙 비활성화
    },
  },
];
