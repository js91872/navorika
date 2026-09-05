export type TransportProtocol = 'TCP' | 'UDP' | 'Both';

export interface PortServiceInput {
  port: number;
  protocol?: string;
}

export interface PortServiceResult {
  valid: boolean;
  error?: string;
  portNumber: number;
  protocol: string;
  service: string;
  rangeClass: string;
  [key: string]: any;
}

interface CuratedService {
  port: number;
  protocol: 'TCP' | 'UDP' | 'BOTH';
  name: string;
  description: string;
}

const curatedServices: CuratedService[] = [
  { port: 20, protocol: 'TCP', name: 'FTP Data', description: 'File Transfer Protocol (Data transfer)' },
  { port: 21, protocol: 'TCP', name: 'FTP Control', description: 'File Transfer Protocol (Command/control channel)' },
  { port: 22, protocol: 'TCP', name: 'SSH', description: 'Secure Shell (Encrypted remote login & SFTP)' },
  { port: 23, protocol: 'TCP', name: 'Telnet', description: 'Unencrypted text communications protocol' },
  { port: 25, protocol: 'TCP', name: 'SMTP', description: 'Simple Mail Transfer Protocol (Mail routing/relaying)' },
  { port: 53, protocol: 'BOTH', name: 'DNS', description: 'Domain Name System (Queries over UDP, zone transfers over TCP)' },
  { port: 67, protocol: 'UDP', name: 'DHCP Server / BOOTP', description: 'Dynamic Host Configuration Protocol (Server listener)' },
  { port: 68, protocol: 'UDP', name: 'DHCP Client / BOOTP', description: 'Dynamic Host Configuration Protocol (Client listener)' },
  { port: 69, protocol: 'UDP', name: 'TFTP', description: 'Trivial File Transfer Protocol (Bootstrap & firmware transfer)' },
  { port: 80, protocol: 'TCP', name: 'HTTP', description: 'Hypertext Transfer Protocol (Standard unencrypted web traffic)' },
  { port: 88, protocol: 'BOTH', name: 'Kerberos', description: 'Kerberos network authentication system' },
  { port: 110, protocol: 'TCP', name: 'POP3', description: 'Post Office Protocol version 3 (Mail retrieval)' },
  { port: 123, protocol: 'UDP', name: 'NTP', description: 'Network Time Protocol (Clock synchronization)' },
  { port: 137, protocol: 'UDP', name: 'NetBIOS Name Service', description: 'Windows name resolution across local subnets' },
  { port: 138, protocol: 'UDP', name: 'NetBIOS Datagram', description: 'NetBIOS datagram distribution service' },
  { port: 139, protocol: 'TCP', name: 'NetBIOS Session', description: 'NetBIOS session service (SMB over NetBIOS)' },
  { port: 143, protocol: 'TCP', name: 'IMAP', description: 'Internet Message Access Protocol (Mail synchronization)' },
  { port: 161, protocol: 'UDP', name: 'SNMP', description: 'Simple Network Management Protocol (Agent query port)' },
  { port: 162, protocol: 'UDP', name: 'SNMP Trap', description: 'Simple Network Management Protocol (Trap notifications)' },
  { port: 389, protocol: 'BOTH', name: 'LDAP', description: 'Lightweight Directory Access Protocol' },
  { port: 443, protocol: 'BOTH', name: 'HTTPS', description: 'Hypertext Transfer Protocol Secure (HTTP over TLS/QUIC)' },
  { port: 445, protocol: 'TCP', name: 'Microsoft-DS SMB', description: 'Direct SMB file sharing without NetBIOS' },
  { port: 465, protocol: 'TCP', name: 'SMTPS', description: 'SMTP over SSL/TLS (Implicit secure mail submission)' },
  { port: 500, protocol: 'UDP', name: 'ISAKMP / IKE', description: 'IPsec Internet Key Exchange' },
  { port: 514, protocol: 'UDP', name: 'Syslog', description: 'Standard system event and log messages' },
  { port: 587, protocol: 'TCP', name: 'SMTP Submission', description: 'Email client message submission with STARTTLS' },
  { port: 636, protocol: 'TCP', name: 'LDAPS', description: 'Lightweight Directory Access Protocol over TLS' },
  { port: 853, protocol: 'BOTH', name: 'DNS over TLS / QUIC', description: 'DoT / DoQ privacy-preserving encrypted DNS queries' },
  { port: 993, protocol: 'TCP', name: 'IMAPS', description: 'Internet Message Access Protocol over TLS' },
  { port: 995, protocol: 'TCP', name: 'POP3S', description: 'Post Office Protocol version 3 over TLS' },
  { port: 1194, protocol: 'BOTH', name: 'OpenVPN', description: 'OpenVPN encrypted virtual private network tunnel' },
  { port: 1433, protocol: 'TCP', name: 'Microsoft SQL Server', description: 'MSSQL database relational engine' },
  { port: 1521, protocol: 'TCP', name: 'Oracle Database', description: 'Oracle Database listener' },
  { port: 2049, protocol: 'BOTH', name: 'NFS', description: 'Network File System' },
  { port: 2375, protocol: 'TCP', name: 'Docker REST API (Plain)', description: 'Unencrypted Docker daemon engine endpoint' },
  { port: 2376, protocol: 'TCP', name: 'Docker REST API (TLS)', description: 'TLS-secured Docker daemon engine endpoint' },
  { port: 3306, protocol: 'TCP', name: 'MySQL / MariaDB', description: 'MySQL relational database management system' },
  { port: 3389, protocol: 'BOTH', name: 'RDP', description: 'Remote Desktop Protocol (Microsoft Remote Desktop)' },
  { port: 5060, protocol: 'BOTH', name: 'SIP', description: 'Session Initiation Protocol (VoIP signaling)' },
  { port: 5353, protocol: 'UDP', name: 'mDNS', description: 'Multicast DNS (Bonjour / Zero-configuration networking)' },
  { port: 5432, protocol: 'TCP', name: 'PostgreSQL', description: 'PostgreSQL relational database management system' },
  { port: 5672, protocol: 'TCP', name: 'RabbitMQ / AMQP', description: 'Advanced Message Queuing Protocol broker' },
  { port: 6379, protocol: 'TCP', name: 'Redis', description: 'Redis in-memory key-value data store' },
  { port: 8080, protocol: 'TCP', name: 'HTTP Alternate / Proxy', description: 'Common development HTTP server or proxy port' },
  { port: 8443, protocol: 'TCP', name: 'HTTPS Alternate', description: 'Common secondary HTTPS web server port' },
  { port: 9200, protocol: 'TCP', name: 'Elasticsearch', description: 'Elasticsearch REST API and search cluster HTTP port' },
  { port: 27017, protocol: 'TCP', name: 'MongoDB', description: 'MongoDB document database instance listener' },
  { port: 51820, protocol: 'UDP', name: 'WireGuard', description: 'Default WireGuard secure VPN tunnel UDP port' },
];

function getRangeClass(port: number): string {
  if (port <= 1023) return 'System / Well-Known Ports (0–1023)';
  if (port <= 49151) return 'User / Registered Ports (1024–49151)';
  return 'Dynamic / Private / Ephemeral Ports (49152–65535)';
}

export function calculatePortServiceLookup(input: PortServiceInput): PortServiceResult {
  const port = Number(input.port);
  const rawProto = (input.protocol || 'TCP').trim().toUpperCase();
  const requestedProto: 'TCP' | 'UDP' | 'BOTH' = rawProto === 'UDP' ? 'UDP' : rawProto === 'BOTH' ? 'BOTH' : 'TCP';

  if (!Number.isInteger(port) || port < 0 || port > 65535) {
    return {
      valid: false,
      error: 'Port must be an integer from 0 through 65535.',
      portNumber: port || 0,
      protocol: requestedProto === 'BOTH' ? 'TCP / UDP' : requestedProto,
      service: 'Invalid',
      rangeClass: 'Invalid',
    };
  }

  const rangeClass = getRangeClass(port);
  const protoDisplay = requestedProto === 'BOTH' ? 'TCP / UDP' : requestedProto;

  const match = curatedServices.find((item) => item.port === port);

  if (!match) {
    return {
      valid: true,
      portNumber: port,
      protocol: protoDisplay,
      service: 'No common service entry in this reference',
      rangeClass,
    };
  }

  // Check protocol compatibility
  if (requestedProto !== 'BOTH' && match.protocol !== 'BOTH' && match.protocol !== requestedProto) {
    return {
      valid: true,
      portNumber: port,
      protocol: protoDisplay,
      service: `No common ${requestedProto} service entry in this reference (Port ${port} is commonly associated with ${match.name} over ${match.protocol})`,
      rangeClass,
    };
  }

  return {
    valid: true,
    portNumber: port,
    protocol: protoDisplay,
    service: `${match.name} – ${match.description} (${match.protocol === 'BOTH' ? 'TCP & UDP' : match.protocol})`,
    rangeClass,
  };
}
