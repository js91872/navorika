import test from 'node:test';
import assert from 'node:assert/strict';
import { generateGitignore, GITIGNORE_TEMPLATES } from './gitignore.ts';

test('gitignore: generates expected template for Node.js default', () => {
  const result = generateGitignore(['node']);
  assert.equal(result.templateCount, 1);
  assert.ok(result.ruleCount > 0);
  assert.ok(result.content.includes('# --- Node.js ---'));
  assert.ok(result.content.includes('node_modules/'));
  assert.ok(result.content.endsWith('\n'));
});

test('gitignore: merges multiple templates deterministically and removes duplicates', () => {
  // Both Node and Next.js include *.tsbuildinfo and build artifacts
  const result1 = generateGitignore(['node', 'nextjs']);
  const result2 = generateGitignore(['nextjs', 'node']);

  // Canonical ordering ensures identical output regardless of input array order
  assert.equal(result1.content, result2.content);
  assert.equal(result1.templateCount, 2);

  // Count occurrences of *.tsbuildinfo - should only appear once
  const occurrences = (result1.content.match(/\*\.tsbuildinfo/g) || []).length;
  assert.equal(occurrences, 1);
});

test('gitignore: retains section comments for each unique section', () => {
  const result = generateGitignore(['python', 'macos', 'vscode']);
  assert.ok(result.content.includes('# --- Python ---'));
  assert.ok(result.content.includes('# --- macOS ---'));
  assert.ok(result.content.includes('# --- Visual Studio Code ---'));
  assert.ok(result.content.includes('.DS_Store'));
  assert.ok(result.content.includes('__pycache__/'));
  assert.ok(result.content.includes('.vscode/*'));
});

test('gitignore: handles empty or invalid template selections safely without NaN or crash', () => {
  const emptyResult = generateGitignore([]);
  assert.equal(emptyResult.templateCount, 0);
  assert.equal(emptyResult.ruleCount, 0);
  assert.ok(emptyResult.content.includes('# No templates selected'));

  const invalidResult = generateGitignore(['nonexistent_lang', 'fake_os']);
  assert.equal(invalidResult.templateCount, 0);
  assert.equal(invalidResult.ruleCount, 0);

  const objectInputResult = generateGitignore({ templates: ['rust', 'go'] });
  assert.equal(objectInputResult.templateCount, 2);
  assert.ok(objectInputResult.content.includes('/target/'));
  assert.ok(objectInputResult.content.includes('bin/'));
});

test('gitignore: covers all 11 documented templates without missing keys', () => {
  const allTemplates = [
    'node', 'nextjs', 'python', 'java', 'go', 'rust',
    'macos', 'windows', 'linux', 'vscode', 'jetbrains'
  ];
  for (const id of allTemplates) {
    assert.ok(GITIGNORE_TEMPLATES[id], `Missing template definition: ${id}`);
    assert.ok(GITIGNORE_TEMPLATES[id].patterns.length > 0);
  }
  const result = generateGitignore(allTemplates);
  assert.equal(result.templateCount, 11);
  assert.ok(result.ruleCount >= 50);
});
