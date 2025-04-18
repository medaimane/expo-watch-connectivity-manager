// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: [
    'expo',
    'prettier',
    'universe/native',
    'universe/web',
    'universe/shared/typescript-analysis',
  ],
  plugins: ['prettier'],
  rules: {
    'prettier/prettier': 'error',
    'no-floating-promises': 'off',
  },
  ignorePatterns: ['/build/*'],
  overrides: [
    {
      files: ['*.ts', '*.tsx', '*.d.ts'],
      parserOptions: {
        project: './tsconfig.json',
      },
    },
  ],
};
