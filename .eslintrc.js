module.exports = {
  plugins: ['@typescript-eslint', 'no-null'],
  parserOptions: {
    warnOnUnsupportedTypeScriptVersion: false,
    project: './tsconfig.json'
  },
  extends: [
    'escapace'
  ]
}
