module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    'pre-commit': 'ls-lint && lint-staged && npm run typecheck && npm run test'
  }
}
