export interface CidrResult {
  valid: boolean;
  error?: string;
  ipAddress?: string;
  cidr?: number;
  subnetMask?: string;
  wildcardMask?: string;
  networkAddress?: string;
  broadcastAddress?: string;
  firstHost?: string;
  lastHost?: string;
  totalAddresses?: number;
  usableHosts?: number;
  binaryMask?: string;
}

function ipToUint(ip: string): number | null {
  const parts = ip.trim().split('.');

  if (parts.length !== 4) return null;

  const numbers = parts.map(Number);

  if (
    numbers.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255,
    )
  ) {
    return null;
  }

  return (
    (((numbers[0] << 24) >>> 0) |
      (numbers[1] << 16) |
      (numbers[2] << 8) |
      numbers[3]) >>>
    0
  );
}

function uintToIp(value: number): string {
  const unsigned = value >>> 0;

  return [
    (unsigned >>> 24) & 255,
    (unsigned >>> 16) & 255,
    (unsigned >>> 8) & 255,
    unsigned & 255,
  ].join('.');
}

export function cidrToMask(cidr: number): number {
  if (cidr <= 0) return 0;
  return (0xffffffff << (32 - cidr)) >>> 0;
}

export function calculateCidrSubnet(input: string): CidrResult {
  const trimmed = input.trim();
  const [ipText, cidrText] = trimmed.split('/');

  if (!ipText || cidrText === undefined) {
    return {
      valid: false,
      error: 'Enter an IPv4 address with CIDR notation, for example 192.168.1.0/24.',
    };
  }

  const ip = ipToUint(ipText);
  const cidr = Number(cidrText);

  if (ip === null) {
    return {
      valid: false,
      error: 'Enter a valid IPv4 address.',
    };
  }

  if (!Number.isInteger(cidr) || cidr < 0 || cidr > 32) {
    return {
      valid: false,
      error: 'CIDR prefix must be an integer from 0 to 32.',
    };
  }

  const mask = cidrToMask(cidr);
  const wildcard = (~mask) >>> 0;

  const network = (ip & mask) >>> 0;
  const broadcast = (network | wildcard) >>> 0;

  const totalAddresses = 2 ** (32 - cidr);

  let usableHosts: number;
  let firstHost: number;
  let lastHost: number;

  if (cidr === 32) {
    usableHosts = 1;
    firstHost = network;
    lastHost = network;
  } else if (cidr === 31) {
    usableHosts = 2;
    firstHost = network;
    lastHost = broadcast;
  } else {
    usableHosts = Math.max(0, totalAddresses - 2);
    firstHost = (network + 1) >>> 0;
    lastHost = (broadcast - 1) >>> 0;
  }

  const binaryMask = [24, 16, 8, 0]
    .map((shift) =>
      ((mask >>> shift) & 255)
        .toString(2)
        .padStart(8, '0'),
    )
    .join('.');

  return {
    valid: true,
    ipAddress: uintToIp(ip),
    cidr,
    subnetMask: uintToIp(mask),
    wildcardMask: uintToIp(wildcard),
    networkAddress: uintToIp(network),
    broadcastAddress: uintToIp(broadcast),
    firstHost: uintToIp(firstHost),
    lastHost: uintToIp(lastHost),
    totalAddresses,
    usableHosts,
    binaryMask,
  };
}
