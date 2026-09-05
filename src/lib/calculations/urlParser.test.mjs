import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateUrlParser } from './urlParser.ts';

test('urlParser: decomposes standard HTTPS URL with port, path, query, and fragment', () => {
  const url = 'https://example.com:8080/products/item?id=42&utm_source=test#details';
  const result = calculateUrlParser({ url });
  assert.equal(result.valid, true);
  assert.equal(result.protocol, 'https:');
  assert.equal(result.hostname, 'example.com');
  assert.equal(result.port, '8080');
  assert.equal(result.pathname, '/products/item');
  assert.equal(result.query, '?id=42&utm_source=test');
  assert.equal(result.fragment, '#details');
  assert.equal(result.parameterCount, 2);
  assert.ok(result.queryParameters.includes('id = 42'));
  assert.ok(result.queryParameters.includes('utm_source = test'));
  assert.equal(result.hasPassword, false);
});

test('urlParser: preserves repeated query parameter keys', () => {
  const url = 'https://api.example.org/search?tag=javascript&tag=typescript&tag=react';
  const result = calculateUrlParser({ url });
  assert.equal(result.valid, true);
  assert.equal(result.parameterCount, 3);
  const lines = result.queryParameters.split('\n');
  assert.equal(lines.length, 3);
  assert.equal(lines[0], 'tag = javascript');
  assert.equal(lines[1], 'tag = typescript');
  assert.equal(lines[2], 'tag = react');
});

test('urlParser: handles default scheme ports when port is omitted', () => {
  const httpsResult = calculateUrlParser({ url: 'https://navorika.com/tools' });
  const httpResult = calculateUrlParser({ url: 'http://navorika.com/tools' });
  assert.equal(httpsResult.port, '443 (default)');
  assert.equal(httpResult.port, '80 (default)');
});

test('urlParser: detects username and password presence without exposing password', () => {
  const url = 'https://operator:superSecretPassword123@secure.company.internal/admin';
  const result = calculateUrlParser({ url });
  assert.equal(result.valid, true);
  assert.equal(result.username, 'operator');
  assert.equal(result.hasPassword, true);
  // Plaintext password must never appear in formatted query or results
  assert.ok(!JSON.stringify(result).includes('superSecretPassword123'));
});

test('urlParser: handles minimal URL without path, query, or hash', () => {
  const result = calculateUrlParser({ url: 'https://example.com' });
  assert.equal(result.valid, true);
  assert.equal(result.pathname, '/');
  assert.equal(result.query, '(none)');
  assert.equal(result.fragment, '(none)');
  assert.equal(result.queryParameters, '(none)');
  assert.equal(result.parameterCount, 0);
});

test('urlParser: rejects relative URLs with helpful guidance', () => {
  const result = calculateUrlParser({ url: '/api/v1/users?page=1' });
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('Relative URLs require a base URL'));
});

test('urlParser: rejects URLs missing scheme with helpful guidance', () => {
  const result = calculateUrlParser({ url: 'example.com/products' });
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('absolute URL with a scheme'));
});

test('urlParser: rejects empty input safely', () => {
  const result = calculateUrlParser({ url: '' });
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('Enter an absolute URL'));
});
