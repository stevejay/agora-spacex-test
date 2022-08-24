module.exports = {
  // Add '--max-warnings 0' back to the eslint command below when it is possible
  // to do so. The problem is that if a file in the .eslintignore file is
  // included in the commit, eslint warns that it will ignore the file. This makes
  // it impossible to update the eslint command to fail if there are any warnings.
  // See https://github.com/eslint/eslint/issues/15010
  '*.{js,cjs,mjs,ts,tsx}': 'yarn eslint --cache --fix',
  // tsc-files currently adds an empty includes array to the temporary tsconfig
  // file that it generates for linting. The problem is that your code may rely on
  // ambient declaration files. These will not be included in the linting, so you
  // will get 'Could not find a declaration file' errors. As a workaround you can
  // explicitly add those declaration files here, e.g. 'tsc-files --noEmit
  // src/types/use-debounced-effect.d.ts'. See
  // https://github.com/gustavopch/tsc-files/issues/20 for more info.
  '**/*.{ts,tsx}': 'tsc-files --noEmit src/types/image.d.ts src/types/viteEnv.d.ts',
  '*.css': 'yarn stylelint --cache',
  '**/*': 'yarn pretty-quick --staged',
  '*.md': 'yarn markdownlint --config ./.markdownlint.json',
  '**/Dockerfile*': 'yarn dockerfilelint'
};
