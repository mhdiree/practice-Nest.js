module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: [
    '.eslintrc.js',
    'data-source.ts',
    '*-Migration.ts',
    'dist',
    'metadata.ts',
  ],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-restricted-imports': [
      'error',
      {
        patterns: ['../*', './*'], // 상대 경로를 사용하지 못하도록 설정
      },
    ],
    '@typescript-eslint/no-unused-vars': [
      'warn',
      {
        ignoreRestSiblings: true, // 나머지(rest) 속성 무시
      },
    ],
    'require-await': 'error',
    '@typescript-eslint/no-unused-expressions': [
      'warn',
      {
        allowTernary: true, // ++ 증감 연산자 허용
      },
    ],
  },
  settings: {
    'import/resolver': {
      typescript: {
        alwaysTryTypes: true,
        project: [__dirname + '/tsconfig.json'],
      },
    },
  },
};

 