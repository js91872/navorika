export type DockerRestartPolicy = 'no' | 'always' | 'unless-stopped' | 'on-failure';

export interface DockerEnvVar {
  key: string;
  value: string;
}

export interface DockerVolumeMount {
  hostPath: string;
  containerPath: string;
  mode?: 'ro' | 'rw';
}

export interface DockerRunInput {
  image?: string;
  containerName?: string;
  detached?: boolean;
  hostPort?: number | string | null;
  containerPort?: number | string | null;
  restartPolicy?: DockerRestartPolicy | string;
  environmentVariables?: Array<DockerEnvVar | string>;
  volumes?: Array<DockerVolumeMount | string>;
}

export interface DockerRunResult {
  command: string;
  multiLineCommand: string;
  warnings: string[];
  isValid: boolean;
  image: string;
  containerName: string;
}

const DANGEROUS_SHELL_CHARS = /[;&|`$><\n\r\0]/;
const VALID_IMAGE_REGEX = /^[a-zA-Z0-9_.-]+(?:\/[a-zA-Z0-9_.-]+)*(?::[a-zA-Z0-9_.-]+)?(?:@sha256:[a-fA-F0-9]{64})?$/;
const VALID_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9_.-]*$/;
const VALID_ENV_KEY_REGEX = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
const VALID_RESTART_POLICIES: readonly DockerRestartPolicy[] = ['no', 'always', 'unless-stopped', 'on-failure'] as const;

function sanitizePort(value: unknown): number | null {
  if (value === null || value === undefined || value === '') return null;
  const num = typeof value === 'number' ? value : parseInt(String(value).trim(), 10);
  if (Number.isInteger(num) && num >= 1 && num <= 65535) {
    return num;
  }
  return null;
}

function escapeShellValue(val: string): string {
  if (/^[a-zA-Z0-9_.\-/:=@+]+$/.test(val)) {
    return val;
  }
  // Wrap in double quotes and escape internal double quotes and backslashes
  const escaped = val.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  return `"${escaped}"`;
}

export function generateDockerRunCommand(input?: DockerRunInput): DockerRunResult {
  const warnings: string[] = [];
  const args: string[] = ['docker run'];

  // 1. Container Name
  const rawName = (input?.containerName ?? 'my-container').trim();
  let containerName = rawName;
  if (rawName) {
    if (DANGEROUS_SHELL_CHARS.test(rawName) || !VALID_NAME_REGEX.test(rawName)) {
      warnings.push(`Container name "${rawName}" contains invalid characters or shell symbols. Using sanitized fallback.`);
      containerName = rawName.replace(/[^a-zA-Z0-9_.-]/g, '-').replace(/^[^a-zA-Z0-9]+/, '') || 'my-container';
    }
    args.push(`--name ${containerName}`);
  }

  // 2. Detached mode
  const detached = input?.detached ?? true;
  if (detached) {
    args.push('-d');
  }

  // 3. Port mapping
  const rawHostPort = input?.hostPort;
  const rawContainerPort = input?.containerPort;
  const hostPort = sanitizePort(rawHostPort);
  const containerPort = sanitizePort(rawContainerPort);

  if (rawHostPort !== undefined && rawHostPort !== null && rawHostPort !== '' && hostPort === null) {
    warnings.push(`Host port "${rawHostPort}" is invalid (must be an integer between 1 and 65535).`);
  }
  if (rawContainerPort !== undefined && rawContainerPort !== null && rawContainerPort !== '' && containerPort === null) {
    warnings.push(`Container port "${rawContainerPort}" is invalid (must be an integer between 1 and 65535).`);
  }

  if (hostPort !== null && containerPort !== null) {
    args.push(`-p ${hostPort}:${containerPort}`);
  } else if (containerPort !== null) {
    args.push(`-p ${containerPort}`);
  }

  // 4. Restart policy
  const rawRestart = (input?.restartPolicy ?? 'unless-stopped').trim();
  const restartPolicy: DockerRestartPolicy = VALID_RESTART_POLICIES.includes(rawRestart as DockerRestartPolicy)
    ? (rawRestart as DockerRestartPolicy)
    : 'unless-stopped';

  if (rawRestart && !VALID_RESTART_POLICIES.includes(rawRestart as DockerRestartPolicy)) {
    warnings.push(`Restart policy "${rawRestart}" is unrecognized. Using "unless-stopped".`);
  }

  if (restartPolicy !== 'no') {
    args.push(`--restart ${restartPolicy}`);
  }

  // 5. Environment variables
  if (input?.environmentVariables && Array.isArray(input.environmentVariables)) {
    for (const item of input.environmentVariables) {
      let key = '';
      let value = '';

      if (typeof item === 'string') {
        const firstEquals = item.indexOf('=');
        if (firstEquals > 0) {
          key = item.slice(0, firstEquals).trim();
          value = item.slice(firstEquals + 1);
        } else {
          key = item.trim();
          value = '';
        }
      } else if (item && typeof item === 'object') {
        key = (item.key ?? '').trim();
        value = String(item.value ?? '');
      }

      if (!key) continue;

      if (!VALID_ENV_KEY_REGEX.test(key)) {
        warnings.push(`Environment variable name "${key}" is invalid (must be alphanumeric/underscore starting with a letter or underscore).`);
        continue;
      }

      if (DANGEROUS_SHELL_CHARS.test(value)) {
        warnings.push(`Environment variable "${key}" contains dangerous shell characters. Value has been escaped.`);
      }

      const escapedVal = escapeShellValue(value);
      args.push(`-e ${key}=${escapedVal}`);
    }
  }

  // 6. Volume mounts
  if (input?.volumes && Array.isArray(input.volumes)) {
    for (const item of input.volumes) {
      let hostPath = '';
      let containerPath = '';
      let mode: 'ro' | 'rw' = 'rw';

      if (typeof item === 'string') {
        const parts = item.split(':');
        if (parts.length >= 2) {
          hostPath = parts[0].trim();
          containerPath = parts[1].trim();
          if (parts[2] === 'ro' || parts[2] === 'rw') {
            mode = parts[2];
          }
        }
      } else if (item && typeof item === 'object') {
        hostPath = (item.hostPath ?? '').trim();
        containerPath = (item.containerPath ?? '').trim();
        mode = item.mode === 'ro' ? 'ro' : 'rw';
      }

      if (!hostPath || !containerPath) continue;

      if (DANGEROUS_SHELL_CHARS.test(hostPath) || DANGEROUS_SHELL_CHARS.test(containerPath)) {
        warnings.push(`Volume mount "${hostPath}:${containerPath}" contains dangerous shell symbols and was skipped.`);
        continue;
      }

      const mountStr = mode === 'ro' ? `${hostPath}:${containerPath}:ro` : `${hostPath}:${containerPath}`;
      args.push(`-v ${mountStr}`);
    }
  }

  // 7. Image
  const rawImage = (input?.image ?? 'nginx:latest').trim();
  let image = rawImage;
  let isValid = true;

  if (!rawImage) {
    warnings.push('Docker image is required.');
    image = 'nginx:latest';
    isValid = false;
  } else if (DANGEROUS_SHELL_CHARS.test(rawImage) || !VALID_IMAGE_REGEX.test(rawImage)) {
    warnings.push(`Docker image "${rawImage}" contains invalid characters or shell metacharacters.`);
    image = rawImage.replace(/[^a-zA-Z0-9_./:@-]/g, '') || 'nginx:latest';
    isValid = false;
  }

  args.push(image);

  const command = args.join(' ');
  const multiLineCommand = args.slice(0, 1).concat(args.slice(1).map((arg) => `  ${arg}`)).join(' \\\n');

  return {
    command,
    multiLineCommand,
    warnings,
    isValid: isValid && warnings.length === 0,
    image,
    containerName,
  };
}
