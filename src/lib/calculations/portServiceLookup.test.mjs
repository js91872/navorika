import test from 'node:test';
import assert from 'node:assert/strict';
import { calculatePortServiceLookup } from './portServiceLookup.ts';

test('portServiceLookup: resolves port 443 HTTPS', () => {
  const result = calculatePortServiceLookup({ port: 443, protocol: 'TCP' });
  assert.equal(result.valid, true);
  assert.equal(result.portNumber, 443);
  assert.equal(result.protocol, 'TCP');
  assert.ok(result.service.includes('HTTPS'));
  assert.equal(result.rangeClass, 'System / Well-Known Ports (0–1023)');
});

test('portServiceLookup: resolves port 22 SSH over TCP', () => {
  const result = calculatePortServiceLookup({ port: 22, protocol: 'TCP' });
  assert.equal(result.valid, true);
  assert.ok(result.service.includes('SSH'));
});

test('portServiceLookup: respects protocol difference when UDP requested for TCP-only port', () => {
  const result = calculatePortServiceLookup({ port: 22, protocol: 'UDP' });
  assert.equal(result.valid, true);
  assert.ok(result.service.includes('No common UDP service entry in this reference'));
  assert.ok(result.service.includes('SSH over TCP'));
});

test('portServiceLookup: resolves DNS port 53 for both TCP and UDP', () => {
  const tcpResult = calculatePortServiceLookup({ port: 53, protocol: 'TCP' });
  const udpResult = calculatePortServiceLookup({ port: 53, protocol: 'UDP' });
  assert.ok(tcpResult.service.includes('DNS'));
  assert.ok(udpResult.service.includes('DNS'));
});

test('portServiceLookup: resolves registered database ports 3306, 5432, 6379', () => {
  assert.ok(calculatePortServiceLookup({ port: 3306 }).service.includes('MySQL'));
  assert.ok(calculatePortServiceLookup({ port: 5432 }).service.includes('PostgreSQL'));
  assert.ok(calculatePortServiceLookup({ port: 6379 }).service.includes('Redis'));
  assert.equal(calculatePortServiceLookup({ port: 3306 }).rangeClass, 'User / Registered Ports (1024–49151)');
});

test('portServiceLookup: returns standard message when port is not in curated reference', () => {
  const result = calculatePortServiceLookup({ port: 31337, protocol: 'TCP' });
  assert.equal(result.valid, true);
  assert.equal(result.service, 'No common service entry in this reference');
  assert.equal(result.rangeClass, 'User / Registered Ports (1024–49151)');
});

test('portServiceLookup: classifies dynamic ephemeral port range', () => {
  const result = calculatePortServiceLookup({ port: 50000 });
  assert.equal(result.rangeClass, 'Dynamic / Private / Ephemeral Ports (49152–65535)');
});

test('portServiceLookup: rejects negative, out-of-bounds, and non-integer ports safely', () => {
  assert.equal(calculatePortServiceLookup({ port: -1 }).valid, false);
  assert.equal(calculatePortServiceLookup({ port: 65536 }).valid, false);
  assert.equal(calculatePortServiceLookup({ port: 80.5 }).valid, false);
  assert.equal(calculatePortServiceLookup({ port: NaN }).valid, false);
});
