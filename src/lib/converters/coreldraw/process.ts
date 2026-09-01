import { spawn } from 'node:child_process';
import { CORELDRAW_PROCESS_TIMEOUT_MS } from './formats';
import { CorelConversionError } from './validation';

export async function runProcess(command: string, args: string[], cwd: string, timeoutMs = CORELDRAW_PROCESS_TIMEOUT_MS) {
  return new Promise<void>((resolve, reject) => {
    const child = spawn(command, args, { cwd, shell: false, env: { NODE_ENV: process.env.NODE_ENV ?? 'production', PATH: '/usr/local/bin:/usr/bin:/bin', HOME: cwd, LANG: 'C.UTF-8' }, stdio: 'pipe' });
    child.stdin.end(); child.stdout.resume();
    let stderr = '';
    const timer = setTimeout(() => { child.kill('SIGKILL'); reject(new CorelConversionError('Conversion exceeded the 30-second processing limit.', 408)); }, timeoutMs);
    child.stderr.on('data', (chunk: Buffer) => { if (stderr.length < 16_000) stderr += chunk.toString(); });
    child.on('error', (error) => { clearTimeout(timer); reject(new CorelConversionError(`Conversion backend could not start: ${error.message}`, 503)); });
    child.on('exit', (code, signal) => { clearTimeout(timer); if (code === 0) resolve(); else reject(new CorelConversionError(`Conversion backend failed${signal ? ` (${signal})` : ''}. ${stderr.trim().slice(-500) || 'The input may be malformed or unsupported.'}`, 422)); });
  });
}
