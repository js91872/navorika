import { readFileSync } from 'node:fs';
import { ESLint } from 'eslint';

const baseline = JSON.parse(
  readFileSync(new URL('./lint-baseline.json', import.meta.url), 'utf8')
);

const eslint = new ESLint();
const report = await eslint.lintFiles(['.']);

const totals = report.reduce(
  (summary, file) => ({
    errors: summary.errors + file.errorCount,
    warnings: summary.warnings + file.warningCount,
  }),
  { errors: 0, warnings: 0 }
);

if (totals.errors > baseline.errors || totals.warnings > baseline.warnings) {
  console.error(
    `Lint debt increased: ${totals.errors} errors/${totals.warnings} warnings ` +
    `(baseline: ${baseline.errors}/${baseline.warnings}).`
  );
  process.exit(1);
}

console.log(
  `Lint baseline passed: ${totals.errors} errors/${totals.warnings} warnings ` +
  `(maximum: ${baseline.errors}/${baseline.warnings}).`
);
