"use client";

import { useState } from "react";
import { Copy, Check, RefreshCw, Download, Hash } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";

export default function UUIDGenerator() {
  const [uuids, setUuids] = useState<string[]>([]);
  const [count, setCount] = useState<number>(1);
  const [version, setVersion] = useState<"v4" | "v7">("v4");
  const [copied, setCopied] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const generateUUID = () => {
    const newUuids: string[] = [];
    for (let i = 0; i < count; i++) {
      if (version === "v4") {
        // v4 random UUID
        const uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
          const r = Math.random() * 16 | 0;
          const v = c === 'x' ? r : (r & 0x3 | 0x8);
          return v.toString(16);
        });
        newUuids.push(uuid);
      } else {
        // v7 time-based UUID (simplified)
        const timestamp = Date.now().toString(16).padStart(12, '0');
        const random = Math.random().toString(16).substring(2, 10);
        const uuid = `${timestamp}-${random.substring(0, 4)}-7${random.substring(4, 7)}-${random.substring(7, 11)}-${random.substring(11, 15)}`;
        newUuids.push(uuid);
      }
    }
    setUuids(newUuids);
  };

  const handleCopy = async (uuid: string, index: number) => {
    await navigator.clipboard.writeText(uuid);
    setCopied(true);
    setCopiedIndex(index);
    setTimeout(() => {
      setCopied(false);
      setCopiedIndex(null);
    }, 2000);
  };

  const handleCopyAll = async () => {
    await navigator.clipboard.writeText(uuids.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (uuids.length === 0) return;
    const blob = new Blob([uuids.join('\n')], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uuids.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setUuids([]);
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Version Selection */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { value: "v4", label: "v4 (Random)", icon: "🎲" },
            { value: "v7", label: "v7 (Time-based)", icon: "⏰" },
          ].map((option) => (
            <button
              key={option.value}
              onClick={() => setVersion(option.value as any)}
              className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                version === option.value
                  ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
              }`}
            >
              <span className="mr-1">{option.icon}</span>
              {option.label}
            </button>
          ))}
        </div>

        {/* Count Selection */}
        <div className="flex flex-wrap items-center gap-4">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Count</label>
          <div className="flex gap-2">
            {[1, 5, 10, 25, 50].map((num) => (
              <button
                key={num}
                onClick={() => setCount(num)}
                className={`px-3 py-1.5 rounded-lg text-sm transition ${
                  count === num
                    ? 'bg-brand-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <Button onClick={generateUUID} className="w-full sm:w-auto">
          <Hash className="mr-2 h-4 w-4" />
          Generate {count} UUID{count > 1 ? 's' : ''}
        </Button>

        {/* Results */}
        {uuids.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-wrap gap-3">
              <Button variant="outline" onClick={handleCopyAll} size="sm">
                {copied && copiedIndex === null ? (
                  <Check className="mr-2 h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="mr-2 h-4 w-4" />
                )}
                Copy All
              </Button>
              <Button variant="outline" onClick={handleDownload} size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handleClear} size="sm">
                Clear
              </Button>
            </div>

            <div className="space-y-2">
              {uuids.map((uuid, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3 hover:border-brand-200 dark:hover:border-brand-700 transition"
                >
                  <code className="text-sm font-mono text-slate-800 dark:text-slate-200 break-all">
                    {uuid}
                  </code>
                  <button
                    onClick={() => handleCopy(uuid, index)}
                    className="flex-shrink-0 p-1.5 rounded-lg text-slate-400 hover:text-brand-600 dark:hover:text-brand-400 transition"
                  >
                    {copied && copiedIndex === index ? (
                      <Check className="h-4 w-4 text-green-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              ))}
            </div>

            <div className="text-sm text-slate-500 dark:text-slate-400">
              Generated {uuids.length} UUID{uuids.length > 1 ? 's' : ''} ({version})
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
