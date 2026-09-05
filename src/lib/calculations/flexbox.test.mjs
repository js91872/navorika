import test from 'node:test';
import assert from 'node:assert/strict';
import { generateFlexboxCss } from './flexbox.ts';

test('flexbox: generates valid CSS with default properties', () => {
  const result = generateFlexboxCss();
  assert.equal(result.flexDirection, 'row');
  assert.equal(result.justifyContent, 'flex-start');
  assert.equal(result.alignItems, 'stretch');
  assert.equal(result.flexWrap, 'nowrap');
  assert.equal(result.gapPx, 16);
  assert.ok(result.css.includes('display: flex;'));
  assert.ok(result.css.includes('flex-direction: row;'));
  assert.ok(result.css.includes('gap: 16px;'));
  assert.equal(result.declarationCount, 6);
});

test('flexbox: handles gap = 0 correctly without NaN or omission', () => {
  const result = generateFlexboxCss({ gap: 0 });
  assert.equal(result.gapPx, 0);
  assert.ok(result.css.includes('gap: 0px;'));
  assert.ok(!result.css.includes('NaN'));
  assert.ok(!result.css.includes('undefined'));
});

test('flexbox: supports all valid container property values', () => {
  const directions = ['row', 'row-reverse', 'column', 'column-reverse'];
  for (const dir of directions) {
    const res = generateFlexboxCss({ flexDirection: dir });
    assert.equal(res.flexDirection, dir);
    assert.ok(res.css.includes(`flex-direction: ${dir};`));
  }

  const justValues = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'];
  for (const just of justValues) {
    const res = generateFlexboxCss({ justifyContent: just });
    assert.equal(res.justifyContent, just);
    assert.ok(res.css.includes(`justify-content: ${just};`));
  }

  const alignValues = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'];
  for (const align of alignValues) {
    const res = generateFlexboxCss({ alignItems: align });
    assert.equal(res.alignItems, align);
    assert.ok(res.css.includes(`align-items: ${align};`));
  }

  const wrapValues = ['nowrap', 'wrap', 'wrap-reverse'];
  for (const wrap of wrapValues) {
    const res = generateFlexboxCss({ flexWrap: wrap });
    assert.equal(res.flexWrap, wrap);
    assert.ok(res.css.includes(`flex-wrap: ${wrap};`));
  }
});

test('flexbox: safely sanitizes invalid or malicious inputs without crashing', () => {
  const res = generateFlexboxCss({
    flexDirection: 'javascript:alert(1)',
    justifyContent: '<script>',
    alignItems: 'unknown_align',
    flexWrap: 'invalid',
    gap: -25,
  });

  // Falls back to safe defaults
  assert.equal(res.flexDirection, 'row');
  assert.equal(res.justifyContent, 'flex-start');
  assert.equal(res.alignItems, 'stretch');
  assert.equal(res.flexWrap, 'nowrap');
  assert.equal(res.gapPx, 0);
  assert.ok(!res.css.includes('alert'));
  assert.ok(!res.css.includes('<script>'));
});
