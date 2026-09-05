export interface IpClassifierInput {
  ipAddress: string;
}

export interface IpClassifierResult {
  valid: boolean;
  error?: string;
  version: string;
  classification: string;
  scope: string;
  matchedRange: string;
  [key: string]: number | string | boolean | undefined;
}

function prefixMask(p: number): number {
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

function parseIpv4ToUint(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null;
  return (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
}

function ipv6Mask(prefix: number): bigint {
  if (prefix === 0) return BigInt(0);
  const full = (BigInt(1) << BigInt(128)) - BigInt(1);
  return (full << BigInt(128 - prefix)) & full;
}

export function parseIpv6ToBigInt(ip: string): bigint | null {
  const trimmed = ip.trim().toLowerCase();
  if (!trimmed || trimmed.includes(':::')) return null;

  let mainPart = trimmed;
  let embeddedIpv4: number[] | null = null;
  const lastColon = trimmed.lastIndexOf(':');
  if (lastColon !== -1 && trimmed.slice(lastColon + 1).includes('.')) {
    const ipv4Str = trimmed.slice(lastColon + 1);
    const octets = ipv4Str.split('.').map(Number);
    if (octets.length !== 4 || octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) {
      return null;
    }
    embeddedIpv4 = octets;
    mainPart = trimmed.slice(0, lastColon);
  }

  let groups: string[];
  if (mainPart.includes('::')) {
    const doubleColons = mainPart.split('::');
    if (doubleColons.length > 2) return null;
    const left = doubleColons[0] ? doubleColons[0].split(':') : [];
    const right = doubleColons[1] ? doubleColons[1].split(':') : [];
    const needed = (embeddedIpv4 ? 6 : 8) - (left.length + right.length);
    if (needed < 0) return null;
    const middle = Array(needed).fill('0');
    groups = [...left, ...middle, ...right];
  } else {
    groups = mainPart.split(':');
  }

  if (embeddedIpv4) {
    const high = ((embeddedIpv4[0] << 8) | embeddedIpv4[1]).toString(16);
    const low = ((embeddedIpv4[2] << 8) | embeddedIpv4[3]).toString(16);
    groups.push(high, low);
  }

  if (groups.length !== 8) return null;

  let result = BigInt(0);
  for (const group of groups) {
    if (!/^[0-9a-f]{1,4}$/i.test(group)) return null;
    const val = BigInt(parseInt(group, 16));
    result = (result << BigInt(16)) | val;
  }
  return result;
}

interface Ipv4Rule {
  cidr: string;
  start: number;
  prefix: number;
  classification: string;
  scope: string;
}

const ipv4Rules: Ipv4Rule[] = [
  { cidr: '255.255.255.255/32', start: 0xffffffff, prefix: 32, classification: 'Limited Broadcast', scope: 'Local network broadcast (RFC 919 / RFC 8190)' },
  { cidr: '192.0.2.0/24', start: parseIpv4ToUint('192.0.2.0')!, prefix: 24, classification: 'Documentation', scope: 'TEST-NET-1 for documentation and examples (RFC 5737)' },
  { cidr: '198.51.100.0/24', start: parseIpv4ToUint('198.51.100.0')!, prefix: 24, classification: 'Documentation', scope: 'TEST-NET-2 for documentation and examples (RFC 5737)' },
  { cidr: '203.0.113.0/24', start: parseIpv4ToUint('203.0.113.0')!, prefix: 24, classification: 'Documentation', scope: 'TEST-NET-3 for documentation and examples (RFC 5737)' },
  { cidr: '192.88.99.0/24', start: parseIpv4ToUint('192.88.99.0')!, prefix: 24, classification: '6to4 Relay Anycast', scope: '6to4 relay anycast (Deprecated RFC 7526)' },
  { cidr: '192.0.0.0/24', start: parseIpv4ToUint('192.0.0.0')!, prefix: 24, classification: 'IETF Protocol Assignments', scope: 'IETF protocol assignments (RFC 6890)' },
  { cidr: '198.18.0.0/15', start: parseIpv4ToUint('198.18.0.0')!, prefix: 15, classification: 'Benchmarking', scope: 'Network interconnect benchmark tests (RFC 2544)' },
  { cidr: '169.254.0.0/16', start: parseIpv4ToUint('169.254.0.0')!, prefix: 16, classification: 'Link-Local', scope: 'Subnet autoconfiguration (RFC 3927)' },
  { cidr: '192.168.0.0/16', start: parseIpv4ToUint('192.168.0.0')!, prefix: 16, classification: 'Private-Use', scope: 'Private network (RFC 1918)' },
  { cidr: '172.16.0.0/12', start: parseIpv4ToUint('172.16.0.0')!, prefix: 12, classification: 'Private-Use', scope: 'Private network (RFC 1918)' },
  { cidr: '100.64.0.0/10', start: parseIpv4ToUint('100.64.0.0')!, prefix: 10, classification: 'Shared Address Space', scope: 'Carrier-Grade NAT (RFC 6598)' },
  { cidr: '10.0.0.0/8', start: parseIpv4ToUint('10.0.0.0')!, prefix: 8, classification: 'Private-Use', scope: 'Private network (RFC 1918)' },
  { cidr: '127.0.0.0/8', start: parseIpv4ToUint('127.0.0.0')!, prefix: 8, classification: 'Loopback', scope: 'Host loopback interface (RFC 1122)' },
  { cidr: '0.0.0.0/8', start: parseIpv4ToUint('0.0.0.0')!, prefix: 8, classification: 'Current Network', scope: 'Software / this host (RFC 1122)' },
  { cidr: '224.0.0.0/4', start: parseIpv4ToUint('224.0.0.0')!, prefix: 4, classification: 'Multicast', scope: 'Multicast groups (RFC 5771)' },
  { cidr: '240.0.0.0/4', start: parseIpv4ToUint('240.0.0.0')!, prefix: 4, classification: 'Reserved', scope: 'Reserved for future use / Class E (RFC 1112)' },
];

interface Ipv6Rule {
  cidr: string;
  start: bigint;
  prefix: number;
  classification: string;
  scope: string;
}

const ipv6Rules: Ipv6Rule[] = [
  { cidr: '::1/128', start: parseIpv6ToBigInt('::1')!, prefix: 128, classification: 'Loopback', scope: 'Node loopback interface (RFC 4291)' },
  { cidr: '::/128', start: parseIpv6ToBigInt('::')!, prefix: 128, classification: 'Unspecified', scope: 'Unspecified address (RFC 4291)' },
  { cidr: '::ffff:0:0/96', start: parseIpv6ToBigInt('::ffff:0:0')!, prefix: 96, classification: 'IPv4-mapped IPv6', scope: 'IPv4-mapped IPv6 address (RFC 4291)' },
  { cidr: '64:ff9b::/96', start: parseIpv6ToBigInt('64:ff9b::')!, prefix: 96, classification: 'IPv4/IPv6 Translation', scope: 'Well-known prefix for NAT64 (RFC 6052)' },
  { cidr: '100::/64', start: parseIpv6ToBigInt('100::')!, prefix: 64, classification: 'Discard-Only', scope: 'Discard-only prefix for blackholing (RFC 6666)' },
  { cidr: '2001:2::/48', start: parseIpv6ToBigInt('2001:2::')!, prefix: 48, classification: 'Benchmarking', scope: 'Benchmarking methodology (RFC 5180)' },
  { cidr: '2001:db8::/32', start: parseIpv6ToBigInt('2001:db8::')!, prefix: 32, classification: 'Documentation', scope: 'Documentation prefix for technical literature (RFC 3849)' },
  { cidr: '2001::/32', start: parseIpv6ToBigInt('2001::')!, prefix: 32, classification: 'Teredo Relay', scope: 'Teredo tunneling encapsulation (RFC 4380)' },
  { cidr: '2002::/16', start: parseIpv6ToBigInt('2002::')!, prefix: 16, classification: '6to4', scope: '6to4 transition mechanism (RFC 3056)' },
  { cidr: 'fe80::/10', start: parseIpv6ToBigInt('fe80::')!, prefix: 10, classification: 'Link-Local Unicast', scope: 'Single network link scope (RFC 4291)' },
  { cidr: 'ff00::/8', start: parseIpv6ToBigInt('ff00::')!, prefix: 8, classification: 'Multicast', scope: 'IPv6 multicast address (RFC 4291)' },
  { cidr: 'fc00::/7', start: parseIpv6ToBigInt('fc00::')!, prefix: 7, classification: 'Unique Local Unicast (ULA)', scope: 'Private IPv6 local network (RFC 4193)' },
  { cidr: '2000::/3', start: parseIpv6ToBigInt('2000::')!, prefix: 3, classification: 'Global Unicast', scope: 'Globally routable IPv6 unicast address (RFC 3587 / RFC 4291)' },
];

export function calculateIpClassifier(input: IpClassifierInput): IpClassifierResult {
  const raw = (input.ipAddress || '').trim();

  if (!raw) {
    return {
      valid: false,
      error: 'Enter an IPv4 or IPv6 address.',
      version: 'Unknown',
      classification: 'Invalid',
      scope: 'Invalid',
      matchedRange: 'None',
    };
  }

  // 1. Try IPv4
  const ipv4Uint = parseIpv4ToUint(raw);
  if (ipv4Uint !== null) {
    // Check specific rules (already sorted by specificity)
    for (const rule of ipv4Rules) {
      const mask = prefixMask(rule.prefix);
      if (((ipv4Uint & mask) >>> 0) === rule.start) {
        return {
          valid: true,
          version: 'IPv4',
          classification: rule.classification,
          scope: rule.scope,
          matchedRange: rule.cidr,
        };
      }
    }

    // Default valid IPv4 fallback
    return {
      valid: true,
      version: 'IPv4',
      classification: 'Global Unicast / Public',
      scope: 'Globally routable public Internet address (syntactic allocation; reachability depends on network policy)',
      matchedRange: '0.0.0.0/0 (Public Unicast)',
    };
  }

  // 2. Try IPv6
  const ipv6BigInt = parseIpv6ToBigInt(raw);
  if (ipv6BigInt !== null) {
    for (const rule of ipv6Rules) {
      const mask = ipv6Mask(rule.prefix);
      if ((ipv6BigInt & mask) === rule.start) {
        return {
          valid: true,
          version: 'IPv6',
          classification: rule.classification,
          scope: rule.scope,
          matchedRange: rule.cidr,
        };
      }
    }

    return {
      valid: true,
      version: 'IPv6',
      classification: 'Reserved / Unassigned',
      scope: 'Reserved by IETF / Unallocated address space',
      matchedRange: '::/0 (Unallocated)',
    };
  }

  return {
    valid: false,
    error: 'Enter a valid IPv4 (e.g. 192.168.1.1) or IPv6 address (e.g. 2001:db8::1).',
    version: 'Invalid',
    classification: 'Invalid',
    scope: 'Invalid',
    matchedRange: 'None',
  };
}
