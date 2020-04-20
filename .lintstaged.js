module.exports = {
  'src/**/*.{js,ts}': [
    // Run linters and fix files
    'npm run lint',
    "echo 'Lint Staged ran successfuly!"
  ]
}
