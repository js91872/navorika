export type CommitType =
  | 'feat'
  | 'fix'
  | 'docs'
  | 'style'
  | 'refactor'
  | 'perf'
  | 'test'
  | 'build'
  | 'ci'
  | 'chore'
  | 'revert';

export interface CommitTypeOption {
  type: CommitType;
  title: string;
  description: string;
}

export const COMMIT_TYPES: CommitTypeOption[] = [
  { type: 'feat', title: 'Feature', description: 'A new feature or enhancement' },
  { type: 'fix', title: 'Bug Fix', description: 'A bug fix' },
  { type: 'docs', title: 'Documentation', description: 'Documentation only changes' },
  { type: 'style', title: 'Styles', description: 'Code style, formatting, white-space changes' },
  { type: 'refactor', title: 'Refactor', description: 'Code change that neither fixes a bug nor adds a feature' },
  { type: 'perf', title: 'Performance', description: 'A code change that improves performance' },
  { type: 'test', title: 'Tests', description: 'Adding missing tests or correcting existing tests' },
  { type: 'build', title: 'Build', description: 'Changes affecting build system or external dependencies' },
  { type: 'ci', title: 'CI', description: 'Changes to CI configuration files and scripts' },
  { type: 'chore', title: 'Chore', description: 'Other changes that do not modify src or test files' },
  { type: 'revert', title: 'Revert', description: 'Reverts a previous commit' },
];

export const VALID_COMMIT_TYPES: readonly CommitType[] = COMMIT_TYPES.map((item) => item.type);

export interface GitCommitInput {
  type?: string;
  scope?: string;
  description?: string;
  breaking?: boolean;
  body?: string;
  footer?: string;
}

export interface GitCommitResult {
  message: string;
  header: string;
  type: CommitType;
  scope: string;
  description: string;
  breaking: boolean;
  headerLength: number;
  isHeaderOver50: boolean;
  isHeaderOver72: boolean;
  warnings: string[];
  isValid: boolean;
}

// Normalize multiple spaces into single space and trim
function normalizeWhitespace(val: string): string {
  return val.replace(/\s+/g, ' ').trim();
}

export function formatCommitMessage(input?: GitCommitInput): GitCommitResult {
  const warnings: string[] = [];

  // 1. Validate / normalize type
  const rawType = (input?.type ?? 'feat').trim().toLowerCase();
  let commitType: CommitType = 'feat';

  if (VALID_COMMIT_TYPES.includes(rawType as CommitType)) {
    commitType = rawType as CommitType;
  } else {
    warnings.push(`Unrecognized commit type "${rawType}". Using "feat".`);
  }

  // 2. Validate / normalize scope
  const rawScope = normalizeWhitespace(input?.scope ?? '');
  // Sanitize scope: remove parens if user mistakenly typed them
  const scope = rawScope.replace(/[()]/g, '').trim();

  // 3. Normalize description
  let rawDesc = normalizeWhitespace(input?.description ?? '');
  // Remove trailing period per Conventional Commits style
  if (rawDesc.endsWith('.')) {
    rawDesc = rawDesc.slice(0, -1).trim();
  }
  const description = rawDesc || 'add changes';
  if (!input?.description?.trim()) {
    warnings.push('A concise description is required.');
  }

  const breaking = input?.breaking === true;
  const breakingMarker = breaking ? '!' : '';

  // 4. Construct header: type(scope)!: description OR type!: description
  const header = scope
    ? `${commitType}(${scope})${breakingMarker}: ${description}`
    : `${commitType}${breakingMarker}: ${description}`;

  const headerLength = header.length;
  const isHeaderOver50 = headerLength > 50;
  const isHeaderOver72 = headerLength > 72;

  if (isHeaderOver72) {
    warnings.push(`Header length (${headerLength} chars) exceeds the standard 72-character limit for git logs.`);
  }

  // 5. Construct full message including body and footer
  const sections: string[] = [header];

  const rawBody = (input?.body ?? '').trim();
  if (rawBody) {
    sections.push(rawBody);
  }

  let rawFooter = (input?.footer ?? '').trim();
  if (breaking && !rawFooter.includes('BREAKING CHANGE:')) {
    const breakingFooter = `BREAKING CHANGE: ${description}`;
    rawFooter = rawFooter ? `${breakingFooter}\n${rawFooter}` : breakingFooter;
  }

  if (rawFooter) {
    sections.push(rawFooter);
  }

  const message = sections.join('\n\n');

  return {
    message,
    header,
    type: commitType,
    scope,
    description,
    breaking,
    headerLength,
    isHeaderOver50,
    isHeaderOver72,
    warnings,
    isValid: Boolean(input?.description?.trim()),
  };
}
