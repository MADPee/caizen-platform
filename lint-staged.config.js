module.exports = {
  'src/**/*.{js,ts,jsx,tsx}': [
    'eslint --fix --max-warnings=0',
    'prettier --write'
  ],
  'docs/current/**/*.md': [
    'prettier --write'
  ],
  '*.{json,yml,yaml}': [
    'prettier --write'
  ]
};
