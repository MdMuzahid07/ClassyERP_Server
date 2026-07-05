// lint-staged.config.js
// Runs on staged files only — fast, production-grade pre-commit quality gate.
// Docs: https://github.com/lint-staged/lint-staged

export default {
  // TypeScript backend files
  '**/*.ts': [
    'eslint --fix --max-warnings=0',
    'prettier --write',
  ],

  // JSON, Markdown, and configuration files
  '**/*.{json,md}': ['prettier --write'],
};
