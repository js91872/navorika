export interface PortRangeInput {
  startPort: number;
  endPort: number;
}

export interface PortRangeResult {
  valid: boolean;
  error?: string;
  portCount: number;
  range: string;
  classification: string;
  systemPorts: number;
  registeredPorts: number;
  dynamicPorts: number;
  [key: string]: number | string | boolean | undefined;
}

export function calculatePortRange(input: PortRangeInput): PortRangeResult {
  const start = Number(input.startPort);
  const end = Number(input.endPort);

  if (!Number.isInteger(start) || !Number.isInteger(end)) {
    return {
      valid: false,
      error: 'Port numbers must be integers from 0 through 65535.',
      portCount: 0,
      range: 'Invalid',
      classification: 'Invalid',
      systemPorts: 0,
      registeredPorts: 0,
      dynamicPorts: 0,
    };
  }

  if (start < 0 || start > 65535 || end < 0 || end > 65535) {
    return {
      valid: false,
      error: 'Port numbers must be between 0 and 65535.',
      portCount: 0,
      range: 'Invalid',
      classification: 'Invalid',
      systemPorts: 0,
      registeredPorts: 0,
      dynamicPorts: 0,
    };
  }

  if (start > end) {
    return {
      valid: false,
      error: `Start port (${start}) cannot be greater than end port (${end}).`,
      portCount: 0,
      range: 'Invalid',
      classification: 'Invalid',
      systemPorts: 0,
      registeredPorts: 0,
      dynamicPorts: 0,
    };
  }

  const portCount = end - start + 1;
  const range = `${start} – ${end}`;

  // IANA Standard numeric bands:
  // System / Well-Known: 0 - 1023
  // User / Registered: 1024 - 49151
  // Dynamic / Private / Ephemeral: 49152 - 65535
  const systemPorts = Math.max(0, Math.min(end, 1023) - Math.max(start, 0) + 1);
  const registeredPorts = Math.max(0, Math.min(end, 49151) - Math.max(start, 1024) + 1);
  const dynamicPorts = Math.max(0, Math.min(end, 65535) - Math.max(start, 49152) + 1);

  let classification: string;
  const bands = [
    systemPorts > 0 && 'System / Well-Known (0–1023)',
    registeredPorts > 0 && 'Registered (1024–49151)',
    dynamicPorts > 0 && 'Dynamic / Private (49152–65535)',
  ].filter((b): b is string => Boolean(b));

  if (bands.length === 1) {
    if (systemPorts > 0) classification = 'System / Well-Known Ports (0–1023)';
    else if (registeredPorts > 0) classification = 'User / Registered Ports (1024–49151)';
    else classification = 'Dynamic / Private / Ephemeral Ports (49152–65535)';
  } else if (bands.length === 3) {
    classification = `Mixed range spanning all port bands (System: ${systemPorts.toLocaleString()}, Registered: ${registeredPorts.toLocaleString()}, Dynamic/Private: ${dynamicPorts.toLocaleString()})`;
  } else if (systemPorts > 0 && registeredPorts > 0) {
    classification = `Mixed range crossing System/Well-Known (${systemPorts.toLocaleString()} ports) and Registered (${registeredPorts.toLocaleString()} ports)`;
  } else {
    classification = `Mixed range crossing Registered (${registeredPorts.toLocaleString()} ports) and Dynamic/Private (${dynamicPorts.toLocaleString()} ports)`;
  }

  return {
    valid: true,
    portCount,
    range,
    classification,
    systemPorts,
    registeredPorts,
    dynamicPorts,
  };
}
