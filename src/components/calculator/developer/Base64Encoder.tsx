"use client";

import { useState } from "react";
import { Code, Copy, Check, Download, Upload, RefreshCw } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

export default function Base64Encoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const processText = () => {
    if (!input.trim()) {
      setError("Please enter text to " + (mode === "encode" ? "encode" : "decode"));
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = btoa(unescape(encodeURIComponent(input)));
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(escape(atob(input)));
        setOutput(decoded);
      }
      setError(null);
    } catch (err) {
      setError("Invalid input: " + (err as Error).message);
      setOutput("");
    }
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = mode === "encode" ? "encoded.txt" : "decoded.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleSwap = () => {
    setMode(mode === "encode" ? "decode" : "encode");
    setInput("");
    setOutput("");
    setError(null);
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mode Selection */}
        <div className="flex flex-wrap gap-3 items-center">
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "encode", label: "Encode" },
              { value: "decode", label: "Decode" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => {
                  setMode(option.value as any);
                  setInput("");
                  setOutput("");
                  setError(null);
                }}
                className={`py-2.5 px-4 rounded-xl text-sm font-medium transition ${
                  mode === option.value
                    ? 'bg-brand-600 text-white shadow-lg shadow-brand-500/30'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
          <Button variant="outline" onClick={handleSwap}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Swap
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {mode === "encode" ? "Text to Encode" : "Base64 to Decode"}
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={mode === "encode" ? "Enter text to encode..." : "Enter Base64 to decode..."}
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400 min-h-[100px]"
            spellCheck={false}
          />
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={processText} className="flex-1 sm:flex-none">
            <Code className="mr-2 h-4 w-4" />
            {mode === "encode" ? "Encode" : "Decode"}
          </Button>
          {output && (
            <>
              <Button variant="outline" onClick={handleCopy}>
                {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "Copied!" : "Copy"}
              </Button>
              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="outline" onClick={handleClear}>
                Clear
              </Button>
            </>
          )}
        </div>

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
              {mode === "encode" ? "Encoded Base64" : "Decoded Text"}
            </label>
            <div className="relative">
              <pre className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 px-4 py-3 text-sm font-mono text-slate-800 dark:text-slate-200 overflow-auto min-h-[100px] max-h-[200px] whitespace-pre-wrap break-all">
                {output}
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                  {output.length} chars
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
