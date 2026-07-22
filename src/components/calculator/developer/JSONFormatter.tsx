"use client";

import { useState } from "react";
import { Code, Copy, Check, Download, Upload, Sparkles } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formatJSON = () => {
    if (!input.trim()) {
      setError("Please enter JSON to format");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const formatted = JSON.stringify(parsed, null, 2);
      setOutput(formatted);
      setError(null);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
      setOutput("");
    }
  };

  const minifyJSON = () => {
    if (!input.trim()) {
      setError("Please enter JSON to minify");
      return;
    }

    try {
      const parsed = JSON.parse(input);
      const minified = JSON.stringify(parsed);
      setOutput(minified);
      setError(null);
    } catch (err) {
      setError("Invalid JSON: " + (err as Error).message);
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
    const blob = new Blob([output], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "formatted.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        setInput(content);
        setError(null);
      } catch (err) {
        setError("Error reading file");
      }
    };
    reader.readAsText(file);
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <input
            type="file"
            accept=".json"
            onChange={handleFileUpload}
            className="hidden"
            id="json-upload"
          />
          <label htmlFor="json-upload">
            <Button variant="outline" className="cursor-pointer">
              <Upload className="mr-2 h-4 w-4" />
              Upload JSON
            </Button>
          </label>
          <Button onClick={formatJSON}>
            <Sparkles className="mr-2 h-4 w-4" />
            Format
          </Button>
          <Button onClick={minifyJSON} variant="outline">
            Minify
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

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-950/20 p-4 text-red-700 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Input */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Input JSON</label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200 dark:placeholder:text-slate-400 min-h-[150px]"
            spellCheck={false}
          />
        </div>

        {/* Output */}
        {output && (
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Formatted JSON</label>
            <div className="relative">
              <pre className="w-full rounded-xl border border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50 px-4 py-3 text-sm font-mono text-slate-800 dark:text-slate-200 overflow-auto min-h-[150px] max-h-[400px]">
                {output}
              </pre>
              <div className="absolute top-2 right-2 flex gap-2">
                <span className="text-xs bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-400 px-2 py-1 rounded">
                  {output.split('\n').length} lines
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
