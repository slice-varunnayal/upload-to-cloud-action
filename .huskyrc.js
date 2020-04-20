module.exports = {
  hooks: {
    'pre-commit': './node_modules/.bin/lint-staged -c ./.lintstaged.js',
    'commit-msg': './node_modules/.bin/commitlint -E HUSKY_GIT_PARAMS'
  }
}
