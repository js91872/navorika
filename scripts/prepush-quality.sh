#!/usr/bin/env bash
set -euo pipefail
cd "$(dirname "$0")/.."
echo "Refreshing generated multilingual inventory..."
npm run i18n:audit:write
echo "Running architecture and localization checks..."
npm run validate:architecture
npm run typecheck
npm run lint:baseline
npm run test:i18n:audit
npm run test:i18n
if ! git diff --quiet -- docs/i18n-coverage.json; then
  echo
  echo "Generated docs/i18n-coverage.json changed."
  echo "Stage it with your feature changes before pushing:"
  echo "  git add docs/i18n-coverage.json"
  echo "  git commit --amend --no-edit   # only if safe to amend your own last commit"
  exit 1
fi
echo "Pre-push quality checks passed."
