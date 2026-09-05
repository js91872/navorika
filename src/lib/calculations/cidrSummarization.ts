export interface CidrSummarizationInput {
  cidrList: string;
}

export interface CidrSummarizationResult {
  valid: boolean;
  error?: string;
  inputNetworks: number;
  summaryNetworks: string;
  summaryCount: number;
  addressesCovered: number;
  summarizedList: string[];
  [key: string]: any;
}

function prefixMask(p: number): number {
  return p === 0 ? 0 : (0xffffffff << (32 - p)) >>> 0;
}

function ipToUint(ip: string): number | null {
  const parts = ip.trim().split('.');
  if (parts.length !== 4) return null;
  const octets = parts.map(Number);
  if (octets.some((o) => !Number.isInteger(o) || o < 0 || o > 255)) return null;
  return (((octets[0] << 24) >>> 0) | (octets[1] << 16) | (octets[2] << 8) | octets[3]) >>> 0;
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

interface CidrBlock {
  start: number;
  prefix: number;
}

export function calculateCidrSummarization(input: CidrSummarizationInput): CidrSummarizationResult {
  const raw = (input.cidrList || '').trim();
  if (!raw) {
    return {
      valid: false,
      error: 'Enter at least one IPv4 CIDR network (e.g. 192.168.0.0/24).',
      inputNetworks: 0,
      summaryNetworks: 'None',
      summaryCount: 0,
      addressesCovered: 0,
      summarizedList: [],
    };
  }

  const tokens = raw.split(/[\r\n,;\s]+/).filter(Boolean);
  if (tokens.length === 0) {
    return {
      valid: false,
      error: 'Enter at least one IPv4 CIDR network.',
      inputNetworks: 0,
      summaryNetworks: 'None',
      summaryCount: 0,
      addressesCovered: 0,
      summarizedList: [],
    };
  }

  const parsedBlocks: CidrBlock[] = [];

  for (const token of tokens) {
    const parts = token.split('/');
    if (parts.length !== 2) {
      return {
        valid: false,
        error: `Invalid CIDR format in "${token}". Use format A.B.C.D/prefix (e.g. 192.168.1.0/24).`,
        inputNetworks: 0,
        summaryNetworks: 'Invalid',
        summaryCount: 0,
        addressesCovered: 0,
        summarizedList: [],
      };
    }

    const ipUint = ipToUint(parts[0]);
    const prefix = Number(parts[1]);

    if (ipUint === null || !Number.isInteger(prefix) || prefix < 0 || prefix > 32) {
      return {
        valid: false,
        error: `Invalid IPv4 network or prefix in "${token}". Prefix must be an integer from 0 through 32.`,
        inputNetworks: 0,
        summaryNetworks: 'Invalid',
        summaryCount: 0,
        addressesCovered: 0,
        summarizedList: [],
      };
    }

    const mask = prefixMask(prefix);
    const start = ((ipUint & mask) >>> 0);
    parsedBlocks.push({ start, prefix });
  }

  const inputNetworks = parsedBlocks.length;

  // 1. Remove exact duplicate networks
  const uniqueMap = new Map<string, CidrBlock>();
  for (const block of parsedBlocks) {
    const key = `${block.start}/${block.prefix}`;
    if (!uniqueMap.has(key)) uniqueMap.set(key, block);
  }
  let blocks = Array.from(uniqueMap.values());

  // 2. Remove networks completely contained within a larger supplied network
  blocks.sort((a, b) => a.prefix - b.prefix || a.start - b.start);
  const uncontained: CidrBlock[] = [];
  for (const candidate of blocks) {
    const isContained = uncontained.some((existing) => {
      const mask = prefixMask(existing.prefix);
      return ((candidate.start & mask) >>> 0) === existing.start;
    });
    if (!isContained) uncontained.push(candidate);
  }
  blocks = uncontained;

  // 3. Iterative exact sibling aggregation
  // Merge two sibling blocks of prefix P into parent of prefix P-1
  let merged = true;
  while (merged) {
    merged = false;
    for (let p = 32; p >= 1; p--) {
      const atP = blocks.filter((b) => b.prefix === p).sort((a, b) => a.start - b.start);
      for (let i = 0; i < atP.length - 1; i++) {
        const a = atP[i];
        const b = atP[i + 1];
        const parentMask = prefixMask(p - 1);
        const blockSize = 2 ** (32 - p);

        if (((a.start & parentMask) >>> 0) === a.start && b.start === a.start + blockSize) {
          blocks = blocks.filter((item) => item !== a && item !== b);
          blocks.push({ start: a.start, prefix: p - 1 });
          merged = true;
          break;
        }
      }
      if (merged) break;
    }
  }

  // Final sort: IP start address ascending, then prefix ascending
  blocks.sort((a, b) => a.start - b.start || a.prefix - b.prefix);

  const summarizedList = blocks.map((b) => `${uintToIp(b.start)}/${b.prefix}`);
  const summaryCount = summarizedList.length;
  const summaryNetworks = summarizedList.join('\n');
  const addressesCovered = blocks.reduce((sum, b) => sum + 2 ** (32 - b.prefix), 0);

  return {
    valid: true,
    inputNetworks,
    summaryNetworks,
    summaryCount,
    addressesCovered,
    summarizedList,
  };
}
