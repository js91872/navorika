import test from 'node:test';
import assert from 'node:assert/strict';
import { generateDockerRunCommand } from './dockerRun.ts';

test('dockerRun: generates normal default command with detached mode and port mapping', () => {
  const result = generateDockerRunCommand({
    image: 'nginx:latest',
    containerName: 'web-server',
    detached: true,
    hostPort: 8080,
    containerPort: 80,
    restartPolicy: 'unless-stopped',
  });

  assert.equal(result.isValid, true);
  assert.equal(result.warnings.length, 0);
  assert.equal(result.command, 'docker run --name web-server -d -p 8080:80 --restart unless-stopped nginx:latest');
  assert.ok(result.multiLineCommand.includes('docker run \\\n  --name web-server \\\n  -d'));
});

test('dockerRun: handles attached mode (detached=false) and restart=no correctly', () => {
  const result = generateDockerRunCommand({
    image: 'alpine:3.18',
    containerName: 'quick-test',
    detached: false,
    restartPolicy: 'no',
  });

  assert.equal(result.isValid, true);
  assert.ok(!result.command.includes('-d'));
  assert.ok(!result.command.includes('--restart'));
  assert.equal(result.command, 'docker run --name quick-test alpine:3.18');
});

test('dockerRun: supports structured environment variables and volume mounts', () => {
  const result = generateDockerRunCommand({
    image: 'postgres:15',
    containerName: 'db',
    detached: true,
    environmentVariables: [
      { key: 'POSTGRES_DB', value: 'production_app' },
      { key: 'GREETING', value: 'hello world' },
    ],
    volumes: [
      { hostPath: '/var/data', containerPath: '/var/lib/postgresql/data' },
      { hostPath: '/etc/config', containerPath: '/etc/postgres', mode: 'ro' },
    ],
  });

  assert.equal(result.isValid, true);
  assert.ok(result.command.includes('-e POSTGRES_DB=production_app'));
  assert.ok(result.command.includes('-e GREETING="hello world"'));
  assert.ok(result.command.includes('-v /var/data:/var/lib/postgresql/data'));
  assert.ok(result.command.includes('-v /etc/config:/etc/postgres:ro'));
});

test('dockerRun: security - rejects shell injection characters in image and container name', () => {
  const result = generateDockerRunCommand({
    image: 'nginx:latest; rm -rf /',
    containerName: 'my-app & echo hacked',
  });

  assert.equal(result.isValid, false);
  assert.ok(result.warnings.length > 0);
  // Ensure the raw semicolon and ampersand are never in the generated command
  assert.ok(!result.command.includes(';'));
  assert.ok(!result.command.includes('&'));
  assert.ok(!result.command.includes('rm -rf'));
});

test('dockerRun: handles malformed ports and invalid restart policy gracefully', () => {
  const result = generateDockerRunCommand({
    hostPort: 999999, // out of range
    containerPort: 'invalid_port',
    restartPolicy: 'malicious_policy',
  });

  assert.ok(result.warnings.length >= 2);
  // Command should still fall back safely and not output invalid port flags
  assert.ok(!result.command.includes('-p 999999'));
  assert.ok(!result.command.includes('-p invalid_port'));
  assert.ok(result.command.includes('--restart unless-stopped'));
});
