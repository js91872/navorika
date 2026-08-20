import { format as formatSql, type SqlLanguage } from 'sql-formatter';
import xmlFormat from 'xml-formatter';
import YAML from 'yaml';

export type MarkupLanguage = 'sql' | 'xml' | 'yaml';
export type MarkupIndent = 2 | 4;

export interface SqlDialectOption {
  value: SqlLanguage;
  label: string;
}

export const SQL_DIALECTS: SqlDialectOption[] = [
  { value: 'sql', label: 'Standard SQL' },
  { value: 'postgresql', label: 'PostgreSQL' },
  { value: 'mysql', label: 'MySQL' },
  { value: 'sqlite', label: 'SQLite' },
  { value: 'mariadb', label: 'MariaDB' },
  { value: 'transactsql', label: 'T-SQL (SQL Server)' },
  { value: 'bigquery', label: 'Google BigQuery' },
  { value: 'snowflake', label: 'Snowflake' },
  { value: 'plsql', label: 'Oracle PL/SQL' },
];

export interface MarkupProcessResult {
  success: boolean;
  output: string;
  error?: string;
  line?: number;
  column?: number;
}

export interface SqlFormatOptions {
  dialect?: SqlLanguage;
  tabWidth?: MarkupIndent;
  keywordCase?: 'upper' | 'lower' | 'preserve';
}

export interface XmlFormatOptions {
  tabWidth?: MarkupIndent;
  collapseContent?: boolean;
}

export interface YamlFormatOptions {
  tabWidth?: MarkupIndent;
}

export function formatSqlCode(
  code: string,
  options: SqlFormatOptions = {}
): MarkupProcessResult {
  if (!code.trim()) {
    return { success: true, output: '' };
  }

  const {
    dialect = 'sql',
    tabWidth = 2,
    keywordCase = 'upper',
  } = options;

  try {
    const formatted = formatSql(code, {
      language: dialect,
      tabWidth,
      keywordCase,
      linesBetweenQueries: 2,
    });
    return { success: true, output: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: code, error: errorMsg };
  }
}

export function validateAndFormatXml(
  code: string,
  options: XmlFormatOptions = {}
): MarkupProcessResult {
  if (!code.trim()) {
    return { success: true, output: '' };
  }

  const { tabWidth = 2, collapseContent = true } = options;

  if (typeof window !== 'undefined' && typeof DOMParser !== 'undefined') {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(code, 'text/xml');
      const parserError = xmlDoc.getElementsByTagName('parsererror');

      if (parserError && parserError.length > 0) {
        const errorText = parserError[0].textContent || 'XML parsing error';
        
        let line: number | undefined;
        let column: number | undefined;
        const lineMatch = errorText.match(/line\s+(\d+)/i) || errorText.match(/(\d+):(\d+)/);
        const colMatch = errorText.match(/column\s+(\d+)/i);
        if (lineMatch) line = parseInt(lineMatch[1], 10);
        if (colMatch) column = parseInt(colMatch[1], 10);
        else if (lineMatch && lineMatch[2]) column = parseInt(lineMatch[2], 10);

        return {
          success: false,
          output: code,
          error: errorText.split('\n')[0] || 'XML syntax error: malformed structure or unclosed tag.',
          line,
          column,
        };
      }
    } catch (domErr: unknown) {
      const errorMsg = domErr instanceof Error ? domErr.message : String(domErr);
      return { success: false, output: code, error: errorMsg };
    }
  }

  try {
    const indentation = tabWidth === 4 ? '    ' : '  ';
    const formatted = xmlFormat(code, {
      indentation,
      collapseContent,
      lineSeparator: '\n',
      whiteSpaceAtEndOfSelfclosingTag: false,
    });
    return { success: true, output: formatted };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: code, error: errorMsg };
  }
}

export function validateAndFormatYaml(
  code: string,
  options: YamlFormatOptions = {}
): MarkupProcessResult {
  if (!code.trim()) {
    return { success: true, output: '' };
  }

  const { tabWidth = 2 } = options;

  try {
    const doc = YAML.parseDocument(code, { keepSourceTokens: true });
    
    if (doc.errors && doc.errors.length > 0) {
      const firstErr = doc.errors[0];
      const pos = firstErr.linePos;
      return {
        success: false,
        output: code,
        error: firstErr.message,
        line: pos ? pos[0].line : undefined,
        column: pos ? pos[0].col : undefined,
      };
    }

    const parsed = doc.toJS();
    if (parsed === undefined && code.trim()) {
      return { success: true, output: code.trim() };
    }

    const formatted = YAML.stringify(parsed, {
      indent: tabWidth,
      lineWidth: 0,
    });

    return { success: true, output: formatted.trimEnd() + '\n' };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return { success: false, output: code, error: errorMsg };
  }
}

export const MARKUP_SAMPLES: Record<MarkupLanguage, string> = {
  sql: `-- Sample SQL Query
SELECT u.id, u.username, u.email, p.title AS plan_name, COUNT(o.id) AS total_orders, SUM(o.amount) AS lifetime_value
FROM users u
LEFT JOIN subscriptions s ON u.id = s.user_id AND s.status = 'active'
LEFT JOIN plans p ON s.plan_id = p.id
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.created_at >= '2026-01-01' AND u.is_verified = 1
GROUP BY u.id, u.username, u.email, p.title
HAVING total_orders > 0
ORDER BY lifetime_value DESC
LIMIT 50;`,

  xml: `<?xml version="1.0" encoding="UTF-8"?>
<catalog>
  <book id="bk101">
    <author>Gambardella, Matthew</author>
    <title>XML Developer's Guide</title>
    <genre>Computer</genre>
    <price>44.95</price>
    <publish_date>2026-03-15</publish_date>
    <description>An in-depth look at creating applications with XML.</description>
  </book>
  <book id="bk102">
    <author>Ralls, Kim</author>
    <title>Midnight Rain</title>
    <genre>Fantasy</genre>
    <price>5.95</price>
    <publish_date>2026-04-16</publish_date>
    <description>A former architect battles corporate zombies in an alternate reality.</description>
  </book>
</catalog>`,

  yaml: `# Sample YAML Configuration
server:
  port: 8080
  host: 0.0.0.0
  ssl:
    enabled: true
    certificate: /etc/ssl/cert.pem
    private_key: /etc/ssl/key.pem

database:
  driver: postgresql
  host: localhost
  port: 5432
  name: navorika_prod
  pool:
    max_connections: 20
    min_idle: 5
    timeout_ms: 30000

features:
  analytics: true
  rate_limiting: true
  beta_modules:
    - code-minifier
    - markup-formatter`
};
