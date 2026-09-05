import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePortRange } from './portRange.ts';

test('portRange: single system port calculation', () => {
  const result = calculatePortRange({ startPort: 80, endPort: 80 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 1);
  assert.equal(result.range, '80 – 80');
  assert.equal(result.classification, 'System / Well-Known Ports (0–1023)');
  assert.equal(result.systemPorts, 1);
  assert.equal(result.registeredPorts, 0);
  assert.equal(result.dynamicPorts, 0);
});

test('portRange: full registered port band', () => {
  const result = calculatePortRange({ startPort: 1024, endPort: 49151 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 48128);
  assert.equal(result.classification, 'User / Registered Ports (1024–49151)');
  assert.equal(result.systemPorts, 0);
  assert.equal(result.registeredPorts, 48128);
  assert.equal(result.dynamicPorts, 0);
});

test('portRange: full dynamic and private ephemeral port band', () => {
  const result = calculatePortRange({ startPort: 49152, endPort: 65535 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 16384);
  assert.equal(result.classification, 'Dynamic / Private / Ephemeral Ports (49152–65535)');
  assert.equal(result.systemPorts, 0);
  assert.equal(result.registeredPorts, 0);
  assert.equal(result.dynamicPorts, 16384);
});

test('portRange: full 16-bit port space (0 to 65535)', () => {
  const result = calculatePortRange({ startPort: 0, endPort: 65535 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 65536);
  assert.ok(result.classification.includes('spanning all port bands'));
  assert.equal(result.systemPorts, 1024);
  assert.equal(result.registeredPorts, 48128);
  assert.equal(result.dynamicPorts, 16384);
});

test('portRange: mixed range crossing system and registered ports', () => {
  const result = calculatePortRange({ startPort: 80, endPort: 8080 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 8001);
  assert.ok(result.classification.includes('crossing System/Well-Known'));
  assert.ok(result.classification.includes('and Registered'));
  assert.equal(result.systemPorts, 944); // 1023 - 80 + 1
  assert.equal(result.registeredPorts, 7057); // 8080 - 1024 + 1
  assert.equal(result.dynamicPorts, 0);
});

test('portRange: mixed range crossing registered and dynamic ports', () => {
  const result = calculatePortRange({ startPort: 40000, endPort: 50000 });
  assert.equal(result.valid, true);
  assert.equal(result.portCount, 10001);
  assert.ok(result.classification.includes('crossing Registered'));
  assert.ok(result.classification.includes('and Dynamic/Private'));
  assert.equal(result.systemPorts, 0);
  assert.equal(result.registeredPorts, 9152); // 49151 - 40000 + 1
  assert.equal(result.dynamicPorts, 849); // 50000 - 49152 + 1
});

test('portRange: rejects startPort greater than endPort safely', () => {
  const result = calculatePortRange({ startPort: 5000, endPort: 1000 });
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('cannot be greater than end port'));
  assert.equal(result.portCount, 0);
  assert.equal(result.range, 'Invalid');
});

test('portRange: rejects negative, out-of-bounds, and non-integer inputs', () => {
  assert.equal(calculatePortRange({ startPort: -1, endPort: 80 }).valid, false);
  assert.equal(calculatePortRange({ startPort: 80, endPort: 65536 }).valid, false);
  assert.equal(calculatePortRange({ startPort: 80.5, endPort: 443 }).valid, false);
  assert.equal(calculatePortRange({ startPort: NaN, endPort: 443 }).valid, false);
});
