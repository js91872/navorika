'use client';

import { useMemo, useState } from 'react';
import {
  Check,
  Copy,
  RotateCcw,
  Terminal,
  Plus,
  Trash2,
  AlertTriangle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import {
  generateDockerRunCommand,
  type DockerRestartPolicy,
  type DockerEnvVar,
  type DockerVolumeMount,
} from '@/lib/calculations/dockerRun';

export default function DockerRunGenerator() {
  const [image, setImage] = useState('nginx:latest');
  const [containerName, setContainerName] = useState('my-container');
  const [detached, setDetached] = useState(true);
  const [hostPort, setHostPort] = useState<string>('8080');
  const [containerPort, setContainerPort] = useState<string>('80');
  const [restartPolicy, setRestartPolicy] = useState<DockerRestartPolicy>('unless-stopped');
  const [envVars, setEnvVars] = useState<DockerEnvVar[]>([]);
  const [volumes, setVolumes] = useState<DockerVolumeMount[]>([]);
  const [viewFormat, setViewFormat] = useState<'single' | 'multiline'>('single');
  const [copied, setCopied] = useState(false);

  // New env var input state
  const [newEnvKey, setNewEnvKey] = useState('');
  const [newEnvVal, setNewEnvVal] = useState('');

  // New volume mount state
  const [newHostPath, setNewHostPath] = useState('');
  const [newContainerPath, setNewContainerPath] = useState('');
  const [newVolMode, setNewVolMode] = useState<'ro' | 'rw'>('rw');

  const { command, multiLineCommand, warnings, isValid } = useMemo(() => {
    return generateDockerRunCommand({
      image,
      containerName,
      detached,
      hostPort: hostPort ? Number(hostPort) : null,
      containerPort: containerPort ? Number(containerPort) : null,
      restartPolicy,
      environmentVariables: envVars,
      volumes,
    });
  }, [image, containerName, detached, hostPort, containerPort, restartPolicy, envVars, volumes]);

  const displayedCommand = viewFormat === 'multiline' ? multiLineCommand : command;

  const copyCommand = async () => {
    await navigator.clipboard.writeText(displayedCommand);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const addEnvVar = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newEnvKey.trim()) {
      setEnvVars((prev) => [...prev, { key: newEnvKey.trim(), value: newEnvVal }]);
      setNewEnvKey('');
      setNewEnvVal('');
    }
  };

  const removeEnvVar = (index: number) => {
    setEnvVars((prev) => prev.filter((_, i) => i !== index));
  };

  const addVolume = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (newHostPath.trim() && newContainerPath.trim()) {
      setVolumes((prev) => [
        ...prev,
        {
          hostPath: newHostPath.trim(),
          containerPath: newContainerPath.trim(),
          mode: newVolMode,
        },
      ]);
      setNewHostPath('');
      setNewContainerPath('');
    }
  };

  const removeVolume = (index: number) => {
    setVolumes((prev) => prev.filter((_, i) => i !== index));
  };

  const reset = () => {
    setImage('nginx:latest');
    setContainerName('my-container');
    setDetached(true);
    setHostPort('8080');
    setContainerPort('80');
    setRestartPolicy('unless-stopped');
    setEnvVars([]);
    setVolumes([]);
  };

  const inputClass =
    'mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20';

  return (
    <div className="grid min-w-0 gap-8 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* Inputs Configuration Form */}
      <section className="min-w-0 rounded-3xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm sm:p-7">
        <div className="flex items-center justify-between border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <Terminal className="size-6 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold">Container Parameters</h2>
          </div>
          <button
            type="button"
            onClick={reset}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--muted-foreground)] hover:text-indigo-600"
          >
            <RotateCcw className="size-3.5" /> Reset
          </button>
        </div>

        <div className="mt-6 space-y-4">
          {/* Image & Container Name */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Docker Image</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="e.g. nginx:latest, postgres:15"
                className={inputClass}
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Container Name (--name)</label>
              <input
                type="text"
                value={containerName}
                onChange={(e) => setContainerName(e.target.value)}
                placeholder="e.g. my-app, web-server"
                className={inputClass}
              />
            </div>
          </div>

          {/* Detached mode & Restart Policy */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="text-sm font-semibold">Restart Policy (--restart)</label>
              <select
                value={restartPolicy}
                onChange={(e) => setRestartPolicy(e.target.value as DockerRestartPolicy)}
                className={inputClass}
              >
                <option value="unless-stopped">unless-stopped (recommended)</option>
                <option value="always">always</option>
                <option value="on-failure">on-failure</option>
                <option value="no">no (default non-daemon)</option>
              </select>
            </div>
            <div className="flex flex-col justify-end">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2.5">
                <input
                  type="checkbox"
                  checked={detached}
                  onChange={(e) => setDetached(e.target.checked)}
                  className="size-4 rounded accent-indigo-600"
                />
                <span className="text-sm font-medium">Run in background (-d / detached)</span>
              </label>
            </div>
          </div>

          {/* Port Mapping */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Port Mapping (-p host:container)
            </h3>
            <div className="mt-2.5 grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Host Port</label>
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={hostPort}
                  onChange={(e) => setHostPort(e.target.value)}
                  placeholder="8080"
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[var(--muted-foreground)]">Container Port</label>
                <input
                  type="number"
                  min="1"
                  max="65535"
                  value={containerPort}
                  onChange={(e) => setContainerPort(e.target.value)}
                  placeholder="80"
                  className={inputClass}
                />
              </div>
            </div>
          </div>

          {/* Environment Variables */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Environment Variables (-e)
            </h3>
            <div className="mt-2.5 flex gap-2">
              <input
                type="text"
                value={newEnvKey}
                onChange={(e) => setNewEnvKey(e.target.value)}
                placeholder="KEY (e.g. NODE_ENV)"
                className="w-1/3 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-mono outline-none"
              />
              <input
                type="text"
                value={newEnvVal}
                onChange={(e) => setNewEnvVal(e.target.value)}
                placeholder="VALUE (e.g. production)"
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-mono outline-none"
              />
              <button
                type="button"
                onClick={() => addEnvVar()}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="size-3.5" /> Add
              </button>
            </div>

            {envVars.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {envVars.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-mono"
                  >
                    <span>
                      <strong className="text-indigo-600 dark:text-indigo-400">{item.key}</strong>=
                      {item.value}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeEnvVar(idx)}
                      className="text-[var(--muted-foreground)] hover:text-red-500"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Volume Mounts */}
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
              Volume Mounts (-v)
            </h3>
            <div className="mt-2.5 flex flex-wrap gap-2 sm:flex-nowrap">
              <input
                type="text"
                value={newHostPath}
                onChange={(e) => setNewHostPath(e.target.value)}
                placeholder="Host path (/data/db)"
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-mono outline-none"
              />
              <input
                type="text"
                value={newContainerPath}
                onChange={(e) => setNewContainerPath(e.target.value)}
                placeholder="Container path (/var/lib/data)"
                className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--card)] px-3 py-2 text-xs font-mono outline-none"
              />
              <select
                value={newVolMode}
                onChange={(e) => setNewVolMode(e.target.value as 'ro' | 'rw')}
                className="rounded-xl border border-[var(--border)] bg-[var(--card)] px-2 py-2 text-xs font-mono outline-none"
              >
                <option value="rw">rw</option>
                <option value="ro">ro</option>
              </select>
              <button
                type="button"
                onClick={() => addVolume()}
                className="inline-flex items-center gap-1 rounded-xl bg-indigo-600 px-3 py-2 text-xs font-bold text-white hover:bg-indigo-700"
              >
                <Plus className="size-3.5" /> Add
              </button>
            </div>

            {volumes.length > 0 && (
              <div className="mt-3 space-y-1.5">
                {volumes.map((vol, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded-lg border border-[var(--border)] bg-[var(--card)] px-2.5 py-1 text-xs font-mono"
                  >
                    <span>
                      {vol.hostPath}:{vol.containerPath}
                      {vol.mode === 'ro' ? ':ro' : ''}
                    </span>
                    <button
                      type="button"
                      onClick={() => removeVolume(idx)}
                      className="text-[var(--muted-foreground)] hover:text-red-500"
                    >
                      <Trash2 className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Generated Command Output */}
      <aside className="min-w-0 rounded-3xl border border-indigo-500/20 bg-indigo-500/5 p-5 sm:p-7">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold">Generated Docker Run</h2>
            <p className="mt-0.5 text-xs text-[var(--muted-foreground)]">
              Text generation only • Never executed
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex rounded-lg border border-[var(--border)] bg-[var(--card)] p-0.5 text-xs">
              <button
                type="button"
                onClick={() => setViewFormat('single')}
                className={`rounded-md px-2 py-1 font-semibold ${
                  viewFormat === 'single' ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)]'
                }`}
              >
                Single line
              </button>
              <button
                type="button"
                onClick={() => setViewFormat('multiline')}
                className={`rounded-md px-2 py-1 font-semibold ${
                  viewFormat === 'multiline' ? 'bg-indigo-600 text-white' : 'text-[var(--muted-foreground)]'
                }`}
              >
                Multi-line
              </button>
            </div>
            <button
              type="button"
              onClick={copyCommand}
              className="inline-flex items-center gap-1.5 rounded-xl bg-indigo-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm transition hover:bg-indigo-700"
            >
              {copied ? (
                <>
                  <Check className="size-3.5" /> Copied
                </>
              ) : (
                <>
                  <Copy className="size-3.5" /> Copy
                </>
              )}
            </button>
          </div>
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <div className="mt-4 space-y-1.5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs text-amber-800 dark:text-amber-200">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="size-3.5 text-amber-600" />
              <span>Input Notice</span>
            </div>
            <ul className="list-inside list-disc space-y-0.5 pl-1">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Command Box */}
        <div className="mt-5 overflow-hidden rounded-2xl border border-[var(--border)] bg-slate-950 shadow-inner">
          <div className="flex items-center justify-between border-b border-slate-800 bg-slate-900 px-4 py-2 text-xs font-mono text-slate-400">
            <span>bash / zsh terminal</span>
            <span>docker cli</span>
          </div>
          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-emerald-400">
            <code>{displayedCommand}</code>
          </pre>
        </div>

        {/* Security & Verification Callout */}
        <div className="mt-5 rounded-2xl border border-indigo-500/20 bg-[var(--card)] p-4 text-xs leading-relaxed text-[var(--muted-foreground)]">
          <div className="flex items-center gap-1.5 font-bold text-[var(--foreground)] mb-1">
            <ShieldCheck className="size-4 text-emerald-600" />
            <span>Security & Responsibility Checklist</span>
          </div>
          <ul className="list-inside list-disc space-y-1 pl-1">
            <li>Review all host volume paths and port binds before running the command.</li>
            <li>Never store production passwords or secret tokens in shared URLs or open terminals.</li>
            <li>Generated output is static text created locally in your browser. Navorika never executes any shell command.</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
