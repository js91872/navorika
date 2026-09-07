'use client';

import { useState, useMemo } from 'react';
import {
  Calculator,
  HardDrive,
  Clock,
  Radio,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import {
  calculateBitrateFromSize,
  calculateSizeFromBitrate,
  durationToSeconds,
  type FileSizeUnit,
  type BitrateUnit,
} from '@/lib/calculations/audioBitrate';

type CalculatorMode = 'bitrate-from-size' | 'size-from-bitrate';

export default function AudioBitrateCalculatorTool() {
  const [mode, setMode] = useState<CalculatorMode>('bitrate-from-size');

  // Mode A state (Bitrate from File Size)
  const [fileSizeValue, setFileSizeValue] = useState<string>('15');
  const [fileSizeUnit, setFileSizeUnit] = useState<FileSizeUnit>('MB');
  const [hoursA, setHoursA] = useState<string>('0');
  const [minutesA, setMinutesA] = useState<string>('10');
  const [secondsA, setSecondsA] = useState<string>('25');
  const [channelsA, setChannelsA] = useState<string>('2');

  // Mode B state (File Size from Bitrate)
  const [bitrateValue, setBitrateValue] = useState<string>('192');
  const [bitrateUnit, setBitrateUnit] = useState<BitrateUnit>('kbps');
  const [hoursB, setHoursB] = useState<string>('0');
  const [minutesB, setMinutesB] = useState<string>('45');
  const [secondsB, setSecondsB] = useState<string>('0');

  const [copied, setCopied] = useState(false);

  // Computed results
  const resultA = useMemo(() => {
    const size = parseFloat(fileSizeValue);
    const h = parseFloat(hoursA) || 0;
    const m = parseFloat(minutesA) || 0;
    const s = parseFloat(secondsA) || 0;
    const totalSec = durationToSeconds(h, m, s);
    const ch = parseFloat(channelsA) || 2;

    if (isNaN(size) || size <= 0 || totalSec <= 0) return null;

    return calculateBitrateFromSize({
      fileSizeValue: size,
      fileSizeUnit,
      durationSeconds: totalSec,
      channels: ch,
    });
  }, [fileSizeValue, fileSizeUnit, hoursA, minutesA, secondsA, channelsA]);

  const resultB = useMemo(() => {
    const br = parseFloat(bitrateValue);
    const h = parseFloat(hoursB) || 0;
    const m = parseFloat(minutesB) || 0;
    const s = parseFloat(secondsB) || 0;
    const totalSec = durationToSeconds(h, m, s);

    if (isNaN(br) || br <= 0 || totalSec <= 0) return null;

    return calculateSizeFromBitrate({
      bitrateValue: br,
      bitrateUnit,
      durationSeconds: totalSec,
    });
  }, [bitrateValue, bitrateUnit, hoursB, minutesB, secondsB]);

  const copySummary = () => {
    let summary = '';
    if (mode === 'bitrate-from-size' && resultA) {
      summary = `Audio Bitrate Estimate:\nFile Size: ${fileSizeValue} ${fileSizeUnit}\nDuration: ${hoursA}h ${minutesA}m ${secondsA}s\nCalculated Bitrate: ${resultA.bitrateKbps} kbps (${resultA.bitrateMbps} Mbps)\nQuality Tier: ${resultA.tierDescription}`;
    } else if (mode === 'size-from-bitrate' && resultB) {
      summary = `Audio File Size Estimate:\nBitrate: ${bitrateValue} ${bitrateUnit}\nDuration: ${hoursB}h ${minutesB}m ${secondsB}s\nEstimated Size: ${resultB.bytesDecimal.mb} MB (${resultB.bytesBinary.mib} MiB)\nStorage / Hour: ${resultB.sizePerHourMb} MB`;
    }

    if (summary) {
      navigator.clipboard.writeText(summary);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetValues = () => {
    if (mode === 'bitrate-from-size') {
      setFileSizeValue('15');
      setFileSizeUnit('MB');
      setHoursA('0');
      setMinutesA('10');
      setSecondsA('25');
      setChannelsA('2');
    } else {
      setBitrateValue('192');
      setBitrateUnit('kbps');
      setHoursB('0');
      setMinutesB('45');
      setSecondsB('0');
    }
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-slate-800 dark:bg-slate-900 sm:p-8">
        {/* Mode Selector Tabs */}
        <div className="flex rounded-2xl bg-slate-100 p-1.5 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setMode('bitrate-from-size')}
            className={`flex-1 rounded-xl py-3 text-center text-sm font-bold transition ${
              mode === 'bitrate-from-size'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Calculate Bitrate from File Size
          </button>
          <button
            type="button"
            onClick={() => setMode('size-from-bitrate')}
            className={`flex-1 rounded-xl py-3 text-center text-sm font-bold transition ${
              mode === 'size-from-bitrate'
                ? 'bg-white text-indigo-600 shadow-sm dark:bg-slate-900 dark:text-indigo-400'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Calculate File Size from Bitrate
          </button>
        </div>

        {/* Inputs Area */}
        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {mode === 'bitrate-from-size' ? (
            <>
              {/* File Size Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <HardDrive className="h-3.5 w-3.5 text-indigo-500" />
                  File Size
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                  <input
                    type="number"
                    min="0.01"
                    step="any"
                    value={fileSizeValue}
                    onChange={(e) => setFileSizeValue(e.target.value)}
                    placeholder="e.g. 15"
                    className="w-full bg-transparent px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none dark:text-white"
                  />
                  <select
                    value={fileSizeUnit}
                    onChange={(e) => setFileSizeUnit(e.target.value as FileSizeUnit)}
                    className="border-l border-slate-200 bg-transparent px-3 font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:text-slate-300"
                  >
                    <option value="MB">MB (Decimal)</option>
                    <option value="MiB">MiB (Binary)</option>
                    <option value="KB">KB</option>
                    <option value="KiB">KiB</option>
                    <option value="GB">GB</option>
                  </select>
                </div>
              </div>

              {/* Audio Channels */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Radio className="h-3.5 w-3.5 text-indigo-500" />
                  Audio Channels
                </label>
                <select
                  value={channelsA}
                  onChange={(e) => setChannelsA(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                >
                  <option value="1">1 (Mono)</option>
                  <option value="2">2 (Stereo)</option>
                  <option value="6">5.1 Surround (6 Channels)</option>
                </select>
              </div>

              {/* Duration Inputs */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  Audio Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Hours</span>
                    <input
                      type="number"
                      min="0"
                      value={hoursA}
                      onChange={(e) => setHoursA(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Minutes</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutesA}
                      onChange={(e) => setMinutesA(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Seconds</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={secondsA}
                      onChange={(e) => setSecondsA(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Bitrate Input */}
              <div className="space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Radio className="h-3.5 w-3.5 text-indigo-500" />
                  Target Bitrate
                </label>
                <div className="flex rounded-xl border border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-800/60">
                  <input
                    type="number"
                    min="1"
                    step="any"
                    value={bitrateValue}
                    onChange={(e) => setBitrateValue(e.target.value)}
                    placeholder="e.g. 192"
                    className="w-full bg-transparent px-4 py-3 text-base font-semibold text-slate-900 focus:outline-none dark:text-white"
                  />
                  <select
                    value={bitrateUnit}
                    onChange={(e) => setBitrateUnit(e.target.value as BitrateUnit)}
                    className="border-l border-slate-200 bg-transparent px-3 font-semibold text-slate-700 focus:outline-none dark:border-slate-700 dark:text-slate-300"
                  >
                    <option value="kbps">kbps</option>
                    <option value="Mbps">Mbps</option>
                    <option value="bps">bps</option>
                  </select>
                </div>
              </div>

              {/* Bitrate Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Standard Presets
                </label>
                <div className="flex flex-wrap gap-2 pt-1">
                  {['96', '128', '192', '256', '320'].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setBitrateValue(preset);
                        setBitrateUnit('kbps');
                      }}
                      className={`rounded-lg px-3 py-2 text-xs font-bold transition ${
                        bitrateValue === preset && bitrateUnit === 'kbps'
                          ? 'bg-indigo-600 text-white'
                          : 'border border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}
                    >
                      {preset} kbps
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Inputs */}
              <div className="sm:col-span-2 space-y-2">
                <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Clock className="h-3.5 w-3.5 text-indigo-500" />
                  Planned Duration
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Hours</span>
                    <input
                      type="number"
                      min="0"
                      value={hoursB}
                      onChange={(e) => setHoursB(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Minutes</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={minutesB}
                      onChange={(e) => setMinutesB(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400">Seconds</span>
                    <input
                      type="number"
                      min="0"
                      max="59"
                      value={secondsB}
                      onChange={(e) => setSecondsB(e.target.value)}
                      className="mt-1 w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 font-semibold text-slate-900 focus:outline-none dark:border-slate-700 dark:bg-slate-800/60 dark:text-white"
                    />
                  </div>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Results Card */}
        <div className="mt-8 rounded-2xl border border-slate-200 bg-slate-50 p-6 dark:border-slate-800 dark:bg-slate-800/40">
          <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-slate-700/60">
            <div className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="font-bold text-slate-900 dark:text-white">
                Calculated Audio Metrics
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={copySummary}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700 shadow-sm hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300"
              >
                {copied ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-500" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5" />
                    Copy Summary
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={resetValues}
                aria-label="Reset inputs"
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </div>
          </div>

          {mode === 'bitrate-from-size' && resultA && (
            <div className="mt-6 space-y-6">
              {/* Primary Metric Banner */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 rounded-2xl bg-indigo-600 p-6 text-white shadow-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Estimated Bitrate
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    {resultA.bitrateKbps} <span className="text-xl font-bold">kbps</span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-indigo-100">
                    {resultA.bitrateMbps} Mbps • {resultA.bitrateBps.toLocaleString()} bits/sec
                  </p>
                  <p className="mt-1 text-xs text-indigo-200">
                    {resultA.kibPerSec} KiB/s data transfer rate
                  </p>
                </div>
              </div>

              {/* Quality Tier Classification */}
              <div className="flex items-start gap-3 rounded-xl border border-indigo-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <Sparkles className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Audio Quality Tier
                  </p>
                  <p className="mt-0.5 font-bold text-slate-900 dark:text-white">
                    {resultA.tierDescription}
                  </p>
                  {resultA.perChannelKbps && (
                    <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                      Approx. {resultA.perChannelKbps} kbps per channel across {channelsA} audio channels.
                    </p>
                  )}
                </div>
              </div>

              {/* Breakdown Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Bytes</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    {resultA.totalBytes.toLocaleString()} B
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Total Bits</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    {resultA.totalBits.toLocaleString()} bits
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    {resultA.durationSeconds} seconds
                  </p>
                </div>
                <div className="rounded-xl bg-white p-4 dark:bg-slate-900 border border-slate-100 dark:border-slate-800">
                  <p className="text-[10px] font-bold uppercase text-slate-400">Throughput</p>
                  <p className="mt-1 font-bold text-slate-800 dark:text-slate-200">
                    {resultA.kibPerSec} KiB/s
                  </p>
                </div>
              </div>
            </div>
          )}

          {mode === 'size-from-bitrate' && resultB && (
            <div className="mt-6 space-y-6">
              {/* Primary Metric Banner */}
              <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 rounded-2xl bg-indigo-600 p-6 text-white shadow-md">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                    Estimated File Size
                  </p>
                  <p className="mt-1 text-4xl font-black">
                    {resultB.bytesDecimal.mb} <span className="text-xl font-bold">MB</span>
                  </p>
                </div>
                <div className="sm:text-right">
                  <p className="text-sm font-semibold text-indigo-100">
                    {resultB.bytesBinary.mib} MiB (Binary)
                  </p>
                  <p className="mt-1 text-xs text-indigo-200">
                    {resultB.totalBytes.toLocaleString()} raw bytes
                  </p>
                </div>
              </div>

              {/* Rate Indicators */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Storage Per Minute
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {resultB.sizePerMinuteMb} MB / min
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Storage Per Hour
                  </p>
                  <p className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                    {resultB.sizePerHourMb} MB / hr
                  </p>
                </div>
              </div>

              {/* Unit Comparison Table */}
              <div className="rounded-xl border border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900 text-xs">
                <p className="font-bold text-slate-900 dark:text-white mb-2">
                  Decimal vs. Binary File Size Representation
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-slate-400">Decimal (SI Base 10):</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {resultB.bytesDecimal.kb} KB • {resultB.bytesDecimal.mb} MB • {resultB.bytesDecimal.gb} GB
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400">Binary (IEC Base 2):</span>
                    <p className="font-semibold text-slate-700 dark:text-slate-300">
                      {resultB.bytesBinary.kib} KiB • {resultB.bytesBinary.mib} MiB • {resultB.bytesBinary.gib} GiB
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Fallback state when inputs are invalid */}
          {((mode === 'bitrate-from-size' && !resultA) || (mode === 'size-from-bitrate' && !resultB)) && (
            <div className="mt-6 flex items-center justify-center p-8 text-center text-sm text-slate-400">
              <Info className="h-4 w-4 mr-2" />
              Please enter valid positive values for size, bitrate, and duration to view results.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
