module.exports = {
  'package.json': [
    'syncpack-format --source',
    'syncpack-set-semver-ranges --dev --source'
  ],
  '{src,examples,perf}/**/*.ts?(x)': ['eslint --fix', 'prettier --write'],
  '{src,examples,perf}/**/*.js?(x)': ['eslint --fix', 'prettier --write']
}
