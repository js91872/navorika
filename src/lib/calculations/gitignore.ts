export interface GitignoreTemplate {
  id: string;
  name: string;
  category: 'language' | 'framework' | 'os' | 'editor';
  description: string;
  patterns: string[];
}

export const GITIGNORE_TEMPLATES: Record<string, GitignoreTemplate> = {
  node: {
    id: 'node',
    name: 'Node.js',
    category: 'language',
    description: 'Node.js packages, debug logs, and local environment files',
    patterns: [
      'node_modules/',
      'npm-debug.log*',
      'yarn-debug.log*',
      'yarn-error.log*',
      '.pnpm-debug.log*',
      '.lerna-debug.log*',
      '.npm',
      '.node_repl_history',
      '*.tsbuildinfo',
      '.env.local',
      '.env.development.local',
      '.env.test.local',
      '.env.production.local',
    ],
  },
  nextjs: {
    id: 'nextjs',
    name: 'Next.js',
    category: 'framework',
    description: 'Next.js build artifacts, cache, and standalone output',
    patterns: [
      '.next/',
      'out/',
      'build/',
      '.vercel',
      '*.tsbuildinfo',
    ],
  },
  python: {
    id: 'python',
    name: 'Python',
    category: 'language',
    description: 'Bytecode cache, virtual environments, and distribution wheels',
    patterns: [
      '__pycache__/',
      '*.py[cod]',
      '*$py.class',
      '*.so',
      '.Python',
      'build/',
      'develop-eggs/',
      'dist/',
      'downloads/',
      'eggs/',
      '.eggs/',
      'lib/',
      'lib64/',
      'parts/',
      'sdist/',
      'var/',
      'wheels/',
      '*.egg-info/',
      '.installed.cfg',
      '*.egg',
      '.env',
      '.venv',
      'env/',
      'venv/',
      'ENV/',
    ],
  },
  java: {
    id: 'java',
    name: 'Java',
    category: 'language',
    description: 'Compiled classes, logs, JARs, Gradle, and Maven output',
    patterns: [
      '*.class',
      '*.log',
      '*.jar',
      '*.war',
      '*.nar',
      '*.ear',
      '*.zip',
      '*.tar.gz',
      '*.rar',
      'target/',
      '.gradle/',
      'build/',
    ],
  },
  go: {
    id: 'go',
    name: 'Go',
    category: 'language',
    description: 'Compiled binaries, test outputs, and vendor directory',
    patterns: [
      'bin/',
      'pkg/',
      '*.exe',
      '*.exe~',
      '*.dll',
      '*.so',
      '*.dylib',
      '*.test',
      '*.out',
      'vendor/',
    ],
  },
  rust: {
    id: 'rust',
    name: 'Rust',
    category: 'language',
    description: 'Cargo build directory and backup files',
    patterns: [
      '/target/',
      '**/*.rs.bk',
      '*.bk',
      '*.lprof',
    ],
  },
  macos: {
    id: 'macos',
    name: 'macOS',
    category: 'os',
    description: 'Finder metadata, spotlight, and trash artifacts',
    patterns: [
      '.DS_Store',
      '.AppleDouble',
      '.LSOverride',
      'Icon\r\r',
      '._*',
      '.Spotlight-V100',
      '.Trashes',
    ],
  },
  windows: {
    id: 'windows',
    name: 'Windows',
    category: 'os',
    description: 'Thumbnail caches, desktop layout, and recycle bin',
    patterns: [
      'Thumbs.db',
      'Thumbs.db:encryptable',
      'ehthumbs.db',
      'ehthumbs_vista.db',
      'desktop.ini',
      '$RECYCLE.BIN/',
    ],
  },
  linux: {
    id: 'linux',
    name: 'Linux',
    category: 'os',
    description: 'Backup files, fuse hidden files, and trash directories',
    patterns: [
      '*~',
      '.fuse_hidden*',
      '.directory',
      '.Trash-*',
      '.nfs*',
    ],
  },
  vscode: {
    id: 'vscode',
    name: 'Visual Studio Code',
    category: 'editor',
    description: 'Workspace cache and history (preserves shareable settings)',
    patterns: [
      '.vscode/*',
      '!.vscode/settings.json',
      '!.vscode/tasks.json',
      '!.vscode/launch.json',
      '!.vscode/extensions.json',
      '*.code-workspace',
      '.history/',
    ],
  },
  jetbrains: {
    id: 'jetbrains',
    name: 'JetBrains',
    category: 'editor',
    description: 'IntelliJ, WebStorm, PyCharm project files and caches',
    patterns: [
      '.idea/',
      '*.iws',
      '*.iml',
      '*.ipr',
      'out/',
    ],
  },
};

export const GITIGNORE_TEMPLATE_ORDER: string[] = [
  'node',
  'nextjs',
  'python',
  'java',
  'go',
  'rust',
  'macos',
  'windows',
  'linux',
  'vscode',
  'jetbrains',
];

export interface GitignoreResult {
  content: string;
  ruleCount: number;
  templateCount: number;
  selectedTemplates: string[];
}

export function generateGitignore(input: string[] | { templates?: string[] }): GitignoreResult {
  const selectedKeys = Array.isArray(input) ? input : (input?.templates ?? []);
  const validKeys = new Set(Object.keys(GITIGNORE_TEMPLATES));
  
  // Normalize and filter valid keys in deterministic canonical order
  const normalizedSelection = GITIGNORE_TEMPLATE_ORDER.filter(
    (key) => selectedKeys.includes(key) && validKeys.has(key)
  );

  if (normalizedSelection.length === 0) {
    return {
      content: '# No templates selected. Choose one or more technologies above.\n',
      ruleCount: 0,
      templateCount: 0,
      selectedTemplates: [],
    };
  }

  const seenPatterns = new Set<string>();
  const sections: string[] = [];
  let totalRules = 0;

  for (const key of normalizedSelection) {
    const template = GITIGNORE_TEMPLATES[key];
    const uniquePatterns: string[] = [];

    for (const pattern of template.patterns) {
      if (!seenPatterns.has(pattern)) {
        seenPatterns.add(pattern);
        uniquePatterns.push(pattern);
      }
    }

    if (uniquePatterns.length > 0) {
      totalRules += uniquePatterns.length;
      sections.push(
        `# --- ${template.name} ---\n${uniquePatterns.join('\n')}`
      );
    }
  }

  const header = '# Generated by Navorika .gitignore Generator (https://navorika.com)\n# Useful defaults merged without duplicate rules.\n';
  const content = `${header}\n${sections.join('\n\n')}\n`;

  return {
    content,
    ruleCount: totalRules,
    templateCount: normalizedSelection.length,
    selectedTemplates: normalizedSelection,
  };
}
