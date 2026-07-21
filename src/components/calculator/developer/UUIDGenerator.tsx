"use client";

import { useState } from "react";
import { Copy, Check, Download, RefreshCw, Hash, Calendar, Clock } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState(1);
  const [version, setVersion] = useState<4 | 7>(4);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  const generateUUID = (version: 4 | 7): string => {
    if (version === 4) {
      // UUID v4: Random
      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (crypto.getRandomValues(new Uint8Array(1))[0] & 0xf0) | 0x0f;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });
    } else {
      // UUID v7: Time-based with random suffix
      const timestamp = BigInt(Date.now()) * BigInt(10000) + BigInt(0x01b21dd213814000);
      const timeLow = Number(timestamp & BigInt(0xffffffff));
      const timeMid = Number((timestamp >> BigInt(32)) & BigInt(0xffff));
      const timeHi = Number((timestamp >> BigInt(48)) & BigInt(0x0fff)) | 0x7000;
      
      const randomBytes = crypto.getRandomValues(new Uint8Array(8));
      const randomPart = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
      
      return [
        timeLow.toString(16).padStart(8, '0'),
        timeMid.toString(16).padStart(4, '0'),
        timeHi.toString(16).padStart(4, '0'),
        randomPart.slice(0, 4),
        randomPart.slice(4, 12)
      ].join('-');
    }
  };

  const generateUUIDs = () => {
    const newUuids = Array.from({ length: count }, () => generateUUID(version));
    setUuids(newUuids);
  };

  const handleCopy = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const handleCopyAll = async () => {
    if (uuids.length === 0) return;
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'uuids.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setUuids([]);
    setCopiedIndex(null);
    setCopiedAll(false);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="UUID Generator"
        description="Generate random UUIDs (v4) or time-based UUIDs (v7)."
        icon="🔑"
        accuracy="RFC 4122 compliant"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Version Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">UUID Version</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: 4, label: "v4 (Random)", description: "Cryptographically random" },
              { value: 7, label: "v7 (Time-based)", description: "Time-ordered with random suffix" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setVersion(option.value as 4 | 7)}
                className={`p-3 rounded-xl border-2 text-center transition ${
                  version === option.value
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-slate-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl">{option.value === 4 ? '🎲' : '⏰'}</div>
                <p className={`mt-1 text-sm font-semibold ${
                  version === option.value ? 'text-blue-700' : 'text-slate-700'
                }`}>
                  {option.label}
                </p>
                <p className="text-[10px] text-slate-500">{option.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Count */}
        <div className="flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Count</label>
          <div className="flex gap-2">
            {[1, 5, 10, 25, 50].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  count === num
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generateUUIDs} className="w-full" size="lg">
          <RefreshCw className="mr-2 h-5 w-5" />
          Generate {count} UUID{count > 1 ? 's' : ''}
        </Button>

        {/* Results */}
        {uuids.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-700">
                Generated {uuids.length} UUID{uuids.length > 1 ? 's' : ''}
              </span>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopyAll}>
                  {copiedAll ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copiedAll ? "Copied!" : "Copy All"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
                <Button variant="ghost" size="sm" onClick={handleClear}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2 max-h-80 overflow-y-auto">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:bg-slate-50 transition"
                >
                  <span className="font-mono text-sm text-slate-700">{uuid}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(uuid, index)}
                  >
                    {copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
