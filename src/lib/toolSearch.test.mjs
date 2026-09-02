import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeToolSearch, searchTools } from './toolSearch.ts';

const records = [
  { slug: 'json-formatter', title: 'JSON Formatter', description: 'Beautify and validate JSON', category: 'developer-tools', categoryName: 'Developer Tools', aliases: ['json pretty print'], keywords: ['beautifier'] },
  { slug: 'loan-emi-calculator', title: 'Loan EMI Calculator', description: 'Estimate monthly payments', category: 'finance-calculators', categoryName: 'Finance Calculators', aliases: ['monthly loan payment'], keywords: ['emi'] },
];

test('ranks exact title and aliases predictably', () => {
  assert.equal(searchTools('JSON Formatter', records)[0]?.slug, 'json-formatter');
  assert.equal(searchTools('monthly loan payment', records)[0]?.slug, 'loan-emi-calculator');
});

test('supports a conservative one-character typo', () => {
  assert.equal(searchTools('formater', records)[0]?.slug, 'json-formatter');
});

test('normalizes punctuation and supports prefixes and multi-word queries', () => {
  assert.equal(normalizeToolSearch('  JSON—Pretty!  '), 'json pretty');
  assert.equal(searchTools('json pre', records)[0]?.slug, 'json-formatter');
  assert.equal(searchTools('loan calc', records)[0]?.slug, 'loan-emi-calculator');
});

test('requires all query terms and limits results', () => {
  assert.equal(searchTools('json loan', records).length, 0);
  assert.equal(searchTools('', records).length, 0);
  assert.equal(searchTools('calculator', records, 1).length, 1);
});
