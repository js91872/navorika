import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateIpv6Subnet } from './ipv6Subnet.ts';

test('ipv6Subnet: standard /48 to /64 subnetting', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 48, subnetPrefix: 64 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 16);
  assert.equal(result.subnetCount, '65,536');
  assert.equal(result.hostBits, 64);
  assert.equal(result.addressesPerSubnet, '18,446,744,073,709,551,616');
});

test('ipv6Subnet: standard /56 to /64 subnetting', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 56, subnetPrefix: 64 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 8);
  assert.equal(result.subnetCount, '256');
  assert.equal(result.hostBits, 64);
  assert.equal(result.addressesPerSubnet, '18,446,744,073,709,551,616');
});

test('ipv6Subnet: identical /64 to /64 prefix length', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 64, subnetPrefix: 64 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 0);
  assert.equal(result.subnetCount, '1');
  assert.equal(result.hostBits, 64);
  assert.equal(result.addressesPerSubnet, '18,446,744,073,709,551,616');
});

test('ipv6Subnet: /64 to /128 single address host subnets', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 64, subnetPrefix: 128 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 64);
  assert.equal(result.subnetCount, '18,446,744,073,709,551,616');
  assert.equal(result.hostBits, 0);
  assert.equal(result.addressesPerSubnet, '1');
});

test('ipv6Subnet: /0 to /128 full address space partition', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 0, subnetPrefix: 128 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 128);
  assert.equal(result.subnetCount, '340,282,366,920,938,463,463,374,607,431,768,211,456');
  assert.equal(result.hostBits, 0);
  assert.equal(result.addressesPerSubnet, '1');
});

test('ipv6Subnet: /0 to /0 entire internet address space', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 0, subnetPrefix: 0 });
  assert.equal(result.valid, true);
  assert.equal(result.subnetBits, 0);
  assert.equal(result.subnetCount, '1');
  assert.equal(result.hostBits, 128);
  assert.equal(result.addressesPerSubnet, '340,282,366,920,938,463,463,374,607,431,768,211,456');
});

test('ipv6Subnet: rejects reversed prefixes safely without throwing', () => {
  const result = calculateIpv6Subnet({ parentPrefix: 64, subnetPrefix: 48 });
  assert.equal(result.valid, false);
  assert.ok(result.error?.includes('cannot be shorter'));
  assert.equal(result.subnetCount, 'Invalid');
});

test('ipv6Subnet: rejects negative, out-of-bounds, and non-integer values', () => {
  assert.equal(calculateIpv6Subnet({ parentPrefix: -1, subnetPrefix: 64 }).valid, false);
  assert.equal(calculateIpv6Subnet({ parentPrefix: 48, subnetPrefix: 129 }).valid, false);
  assert.equal(calculateIpv6Subnet({ parentPrefix: 48.5, subnetPrefix: 64 }).valid, false);
  assert.equal(calculateIpv6Subnet({ parentPrefix: NaN, subnetPrefix: 64 }).valid, false);
});
