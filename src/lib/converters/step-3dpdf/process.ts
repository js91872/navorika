import { spawn } from 'node:child_process';
import { StepConversionError } from './validation';

export const CAD_PROCESS_TIMEOUT_MS = 60_000; // 60 seconds

export interface ProcessOutput {
  stdout: string;
  stderr: string;
}

export async function runProcess(
  command: string,
  args: string[],
  cwd: string,
  timeoutMs = CAD_PROCESS_TIMEOUT_MS
): Promise<ProcessOutput> {
  return new Promise<ProcessOutput>((resolve, reject) => {
    let stdout = '';
    let stderr = '';

    const child = spawn(command, args, {
      cwd,
      shell: false,
      env: {
        NODE_ENV: process.env.NODE_ENV ?? 'production',
        PATH: process.env.PATH ?? '/usr/local/bin:/usr/bin:/bin',
        HOME: cwd,
        LANG: 'C.UTF-8',
      },
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new StepConversionError('CAD conversion exceeded the 60-second processing limit.', 408));
    }, timeoutMs);

    child.stdout.on('data', (chunk: Buffer) => {
      if (stdout.length < 2_000_000) {
        stdout += chunk.toString('utf8');
      }
    });

    child.stderr.on('data', (chunk: Buffer) => {
      if (stderr.length < 64_000) {
        stderr += chunk.toString('utf8');
      }
    });

    child.on('error', (error) => {
      clearTimeout(timer);
      reject(new StepConversionError(`CAD conversion engine could not start: ${error.message}`, 503));
    });

    child.on('exit', (code, signal) => {
      clearTimeout(timer);
      if (code === 0) {
        resolve({ stdout, stderr });
      } else {
        const cleanErr = stderr.trim().slice(-400) || 'The CAD geometry may be non-manifold, corrupted, or unsupported.';
        reject(
          new StepConversionError(
            `CAD processing engine failed${signal ? ` (${signal})` : ''}. ${cleanErr}`,
            422
          )
        );
      }
    });
  });
}
