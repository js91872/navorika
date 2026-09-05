export interface UrlParserInput {
  url: string;
}

export interface UrlParserResult {
  valid: boolean;
  error?: string;
  protocol: string;
  hostname: string;
  port: string;
  pathname: string;
  query: string;
  fragment: string;
  queryParameters: string;
  username: string;
  hasPassword: boolean;
  parameterCount: number;
  [key: string]: any;
}

const defaultSchemePorts: Record<string, string> = {
  'http:': '80 (default)',
  'https:': '443 (default)',
  'ftp:': '21 (default)',
  'ws:': '80 (default)',
  'wss:': '443 (default)',
  'ssh:': '22 (default)',
};

export function calculateUrlParser(input: UrlParserInput): UrlParserResult {
  const raw = (input.url || '').trim();

  if (!raw) {
    return {
      valid: false,
      error: 'Enter an absolute URL to parse (e.g. https://example.com/path?key=value#section).',
      protocol: 'Invalid',
      hostname: 'Invalid',
      port: 'Invalid',
      pathname: 'Invalid',
      query: 'Invalid',
      fragment: 'Invalid',
      queryParameters: 'Invalid',
      username: 'Invalid',
      hasPassword: false,
      parameterCount: 0,
    };
  }

  let parsed: URL;
  try {
    parsed = new URL(raw);
  } catch {
    // Distinguish relative URLs from invalid URL syntax
    if (raw.startsWith('/') || raw.startsWith('./') || raw.startsWith('../') || (!raw.includes('://') && !raw.startsWith('mailto:') && !raw.startsWith('tel:'))) {
      return {
        valid: false,
        error: 'Enter an absolute URL with a scheme (e.g. starting with https:// or http://). Relative URLs require a base URL to resolve components.',
        protocol: 'Invalid',
        hostname: 'Invalid',
        port: 'Invalid',
        pathname: 'Invalid',
        query: 'Invalid',
        fragment: 'Invalid',
        queryParameters: 'Invalid',
        username: 'Invalid',
        hasPassword: false,
        parameterCount: 0,
      };
    }

    return {
      valid: false,
      error: 'Malformed URL: The entered string could not be parsed as a standard RFC 3986 URL.',
      protocol: 'Invalid',
      hostname: 'Invalid',
      port: 'Invalid',
      pathname: 'Invalid',
      query: 'Invalid',
      fragment: 'Invalid',
      queryParameters: 'Invalid',
      username: 'Invalid',
      hasPassword: false,
      parameterCount: 0,
    };
  }

  const protocol = parsed.protocol;
  const hostname = parsed.hostname || '(none)';
  const port = parsed.port ? parsed.port : (defaultSchemePorts[protocol] || 'Default');
  const pathname = parsed.pathname || '/';
  const query = parsed.search || '(none)';
  const fragment = parsed.hash || '(none)';
  const username = parsed.username || '(none)';
  const hasPassword = Boolean(parsed.password);

  const params: string[] = [];
  parsed.searchParams.forEach((val, key) => {
    params.push(`${key} = ${val}`);
  });

  const queryParameters = params.length > 0 ? params.join('\n') : '(none)';
  const parameterCount = params.length;

  return {
    valid: true,
    protocol,
    hostname,
    port,
    pathname,
    query,
    fragment,
    queryParameters,
    username,
    hasPassword,
    parameterCount,
  };
}
