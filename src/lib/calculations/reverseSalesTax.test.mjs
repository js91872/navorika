import test from 'node:test';
import assert from 'node:assert/strict';
import { reverseSalesTax, salesTaxRate } from './reverseSalesTax.ts';
test('reverse tax: receipt examples and fractional rates', () => {
  assert.deepEqual(reverseSalesTax(108, 8), { total:108, beforeTax:100, tax:8, rate:8 });
  assert.equal(reverseSalesTax(216.50, 8.25).beforeTax, 200);
  assert.equal(reverseSalesTax(100, 8).beforeTax, 92.59);
  assert.equal(reverseSalesTax(100, 8).tax, 7.41);
  assert.equal(reverseSalesTax(120, 20).beforeTax, 100);
  assert.equal(reverseSalesTax(10, 0).tax, 0);
  assert.equal(reverseSalesTax(0, 8).beforeTax, 0);
  assert.equal(reverseSalesTax(0.01, 100).beforeTax, 0.01);
});
test('reverse tax: rounded price and tax always reconcile with total', () => {
  for (const rate of [0, 5, 7.25, 8.875, 9.1234, 100]) for (const total of [0.01, 0.03, 1.99, 123.45, 1000000000]) {
    const r = reverseSalesTax(total, rate);
    assert.equal(Math.round((r.beforeTax + r.tax) * 100), Math.round(total * 100));
  }
});
test('reverse tax: infer rate from receipt amounts', () => {
  assert.equal(salesTaxRate(108, 100).rate, 8);
  assert.equal(salesTaxRate(100, 100).rate, 0);
});
test('reverse tax: rejects invalid input', () => {
  for (const value of [-1, NaN, Infinity, 1e10]) assert.throws(() => reverseSalesTax(value, 8), RangeError);
  for (const rate of [-1, 101, NaN, Infinity, 8.12345]) assert.throws(() => reverseSalesTax(100, rate), RangeError);
  assert.throws(() => salesTaxRate(100, 0), RangeError);
  assert.throws(() => salesTaxRate(90, 100), RangeError);
});
