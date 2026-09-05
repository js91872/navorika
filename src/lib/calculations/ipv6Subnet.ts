export interface Ipv6SubnetInput {
  parentPrefix: number;
  subnetPrefix: number;
}

export interface Ipv6SubnetResult {
  valid: boolean;
  error?: string;
  subnetBits: number;
  subnetCount: string;
  hostBits: number;
  addressesPerSubnet: string;
  [key: string]: number | string | boolean | undefined;
}

export function calculateIpv6Subnet(input: Ipv6SubnetInput): Ipv6SubnetResult {
  const parent = Number(input.parentPrefix);
  const subnet = Number(input.subnetPrefix);

  if (!Number.isInteger(parent) || !Number.isInteger(subnet)) {
    return {
      valid: false,
      error: 'Prefix lengths must be integers from 0 through 128.',
      subnetBits: 0,
      subnetCount: 'Invalid',
      hostBits: 0,
      addressesPerSubnet: 'Invalid',
    };
  }

  if (parent < 0 || parent > 128 || subnet < 0 || subnet > 128) {
    return {
      valid: false,
      error: 'Prefix lengths must be between 0 and 128.',
      subnetBits: 0,
      subnetCount: 'Invalid',
      hostBits: 0,
      addressesPerSubnet: 'Invalid',
    };
  }

  if (subnet < parent) {
    return {
      valid: false,
      error: `Subnet prefix length (/${subnet}) cannot be shorter than parent prefix length (/${parent}). In IPv6, subnets are formed by extending the prefix.`,
      subnetBits: 0,
      subnetCount: 'Invalid',
      hostBits: 0,
      addressesPerSubnet: 'Invalid',
    };
  }

  const subnetBits = subnet - parent;
  const subnetCountBigInt = BigInt(1) << BigInt(subnetBits);
  const subnetCount = subnetCountBigInt.toLocaleString('en-US');

  const hostBits = 128 - subnet;
  const addressesPerSubnetBigInt = BigInt(1) << BigInt(hostBits);
  const addressesPerSubnet = addressesPerSubnetBigInt.toLocaleString('en-US');

  return {
    valid: true,
    subnetBits,
    subnetCount,
    hostBits,
    addressesPerSubnet,
  };
}
