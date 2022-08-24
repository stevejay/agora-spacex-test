module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'value-list-comma-newline-after': null,
    'declaration-colon-newline-after': null,
    'declaration-empty-line-before': null,
    'font-family-name-quotes': null,
    'selector-class-pattern': null,
    'keyframes-name-pattern': null,
    'string-quotes': 'single',
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['extends', 'layer', 'tailwind', 'apply']
      }
    ]
  }
};
