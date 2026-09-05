import test from 'node:test';
import assert from 'node:assert/strict';
import { formatCommitMessage, COMMIT_TYPES } from './gitCommit.ts';

test('gitCommit: formats normal conventional commit without scope', () => {
  const result = formatCommitMessage({
    type: 'feat',
    description: 'add user profile page',
  });

  assert.equal(result.isValid, true);
  assert.equal(result.header, 'feat: add user profile page');
  assert.equal(result.message, 'feat: add user profile page');
  assert.equal(result.breaking, false);
});

test('gitCommit: formats scoped conventional commit', () => {
  const result = formatCommitMessage({
    type: 'fix',
    scope: 'auth',
    description: 'resolve session token expiration loop',
  });

  assert.equal(result.isValid, true);
  assert.equal(result.header, 'fix(auth): resolve session token expiration loop');
  assert.equal(result.scope, 'auth');
});

test('gitCommit: formats breaking change with exclamation mark and footer', () => {
  const resultWithScope = formatCommitMessage({
    type: 'feat',
    scope: 'api',
    description: 'drop v1 endpoints in favor of v2',
    breaking: true,
  });

  assert.equal(resultWithScope.header, 'feat(api)!: drop v1 endpoints in favor of v2');
  assert.ok(resultWithScope.message.includes('BREAKING CHANGE: drop v1 endpoints in favor of v2'));

  const resultWithoutScope = formatCommitMessage({
    type: 'refactor',
    description: 'migrate database schema',
    breaking: true,
  });

  assert.equal(resultWithoutScope.header, 'refactor!: migrate database schema');
});

test('gitCommit: normalizes unnecessary whitespace and strips trailing periods', () => {
  const result = formatCommitMessage({
    type: 'chore',
    scope: '  (deps)  ', // user typed parens and spaces
    description: '   bump   lucide-react to   latest version.   ',
  });

  assert.equal(result.header, 'chore(deps): bump lucide-react to latest version');
  assert.ok(!result.header.endsWith('.'));
});

test('gitCommit: supports all 11 documented conventional commit types', () => {
  const expectedTypes = ['feat', 'fix', 'docs', 'style', 'refactor', 'perf', 'test', 'build', 'ci', 'chore', 'revert'];
  assert.equal(COMMIT_TYPES.length, 11);
  for (const t of expectedTypes) {
    const res = formatCommitMessage({ type: t, description: 'standard update' });
    assert.equal(res.type, t);
    assert.equal(res.header, `${t}: standard update`);
  }
});

test('gitCommit: handles missing or invalid inputs gracefully without NaN or throwing', () => {
  const emptyRes = formatCommitMessage({});
  assert.equal(emptyRes.isValid, false);
  assert.ok(emptyRes.warnings.length > 0);

  const invalidTypeRes = formatCommitMessage({ type: 'invalid_type', description: 'update' });
  assert.equal(invalidTypeRes.type, 'feat');
  assert.ok(invalidTypeRes.warnings.some((w) => w.includes('Unrecognized commit type')));
});
