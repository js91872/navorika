import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIpClassifier } from './ipClassifier.ts';

test('ipClassifier: classifies IPv4 private address (RFC 1918)', () => {
  const result = calculateIpClassifier({ ipAddress: '192.168.1.10' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Private-Use');
  assert.equal(result.matchedRange, '192.168.0.0/16');
});

test('ipClassifier: classifies IPv4 loopback (RFC 1122)', () => {
  const result = calculateIpClassifier({ ipAddress: '127.0.0.1' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Loopback');
  assert.equal(result.matchedRange, '127.0.0.0/8');
});

test('ipClassifier: classifies IPv4 documentation TEST-NET-1 (RFC 5737)', () => {
  const result = calculateIpClassifier({ ipAddress: '192.0.2.45' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Documentation');
  assert.equal(result.matchedRange, '192.0.2.0/24');
});

test('ipClassifier: classifies IPv4 link-local (RFC 3927)', () => {
  const result = calculateIpClassifier({ ipAddress: '169.254.10.20' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Link-Local');
  assert.equal(result.matchedRange, '169.254.0.0/16');
});

test('ipClassifier: classifies IPv4 carrier-grade NAT shared space (RFC 6598)', () => {
  const result = calculateIpClassifier({ ipAddress: '100.64.0.1' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Shared Address Space');
  assert.equal(result.matchedRange, '100.64.0.0/10');
});

test('ipClassifier: classifies IPv4 public internet unicast address', () => {
  const result = calculateIpClassifier({ ipAddress: '8.8.8.8' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv4');
  assert.equal(result.classification, 'Global Unicast / Public');
  assert.ok(result.scope.includes('Globally routable'));
});

test('ipClassifier: classifies IPv6 loopback (RFC 4291)', () => {
  const result = calculateIpClassifier({ ipAddress: '::1' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv6');
  assert.equal(result.classification, 'Loopback');
  assert.equal(result.matchedRange, '::1/128');
});

test('ipClassifier: classifies IPv6 documentation (RFC 3849)', () => {
  const result = calculateIpClassifier({ ipAddress: '2001:db8:85a3::8a2e:370:7334' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv6');
  assert.equal(result.classification, 'Documentation');
  assert.equal(result.matchedRange, '2001:db8::/32');
});

test('ipClassifier: classifies IPv6 link-local unicast (RFC 4291)', () => {
  const result = calculateIpClassifier({ ipAddress: 'fe80::1ff:fe00:1' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv6');
  assert.equal(result.classification, 'Link-Local Unicast');
  assert.equal(result.matchedRange, 'fe80::/10');
});

test('ipClassifier: classifies IPv6 unique local unicast ULA (RFC 4193)', () => {
  const result = calculateIpClassifier({ ipAddress: 'fd12:3456:789a:1::1' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv6');
  assert.equal(result.classification, 'Unique Local Unicast (ULA)');
  assert.equal(result.matchedRange, 'fc00::/7');
});

test('ipClassifier: classifies IPv6 global unicast (RFC 3587)', () => {
  const result = calculateIpClassifier({ ipAddress: '2607:f8b0:4005:805::200e' });
  assert.equal(result.valid, true);
  assert.equal(result.version, 'IPv6');
  assert.equal(result.classification, 'Global Unicast');
  assert.equal(result.matchedRange, '2000::/3');
});

test('ipClassifier: rejects invalid and malformed IP strings safely', () => {
  assert.equal(calculateIpClassifier({ ipAddress: '' }).valid, false);
  assert.equal(calculateIpClassifier({ ipAddress: '256.1.1.1' }).valid, false);
  assert.equal(calculateIpClassifier({ ipAddress: '1.2.3' }).valid, false);
  assert.equal(calculateIpClassifier({ ipAddress: '2001:xyz::1' }).valid, false);
  assert.equal(calculateIpClassifier({ ipAddress: 'example.com' }).valid, false);
});
