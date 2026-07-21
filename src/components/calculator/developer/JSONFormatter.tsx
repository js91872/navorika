"use client";

import { useState } from "react";
import { 
  Copy, Check, Download, Trash2, 
  FileJson, Code, ArrowLeftRight, 
  AlertCircle, CheckCircle 
} from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function JSONFormatter() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [copied, setCopied] = useState(false);
  const [indentSize, setIndentSize] = useState(2);
  const [mode, setMode] = useState<"format" | "validate" | "minify">("format");

  const handleFormat = () => {
    if (!input.trim()) {
      setError("Please enter JSON to format.");
      setOutput("");
      setIsValid(null);
      return;
    }

    try {
      const parsed = JSON.parse(input);
      let result = "";
      
      if (mode === "minify") {
        result = JSON.stringify(parsed);
      } else {
        result = JSON.stringify(parsed, null, indentSize);
      }
      
      setOutput(result);
      setError("");
      setIsValid(true);
    } catch (err) {
      setError(`Invalid JSON: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setOutput("");
      setIsValid(false);
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
    setIsValid(null);
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'formatted.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  const handleClearInput = () => {
    setInput("");
    setError("");
    setIsValid(null);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="JSON Formatter"
        description="Format, validate, and minify JSON data."
        icon="{}"
        accuracy="Standard JSON specification"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Mode</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { value: "format", label: "Format & Validate", icon: "🔧" },
              { value: "minify", label: "Minify", icon: "📦" },
              { value: "validate", label: "Validate Only", icon: "✅" },
            ].map((option) => (
              <button
                key={option.value}
                onClick={() => setMode(option.value as any)}
                className={`py-2 px-4 rounded-xl text-sm font-medium transition ${
                  mode === option.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span className="mr-1">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </div>

        {/* Indent Size (for format mode) */}
        {mode === "format" && (
          <div className="flex items-center gap-4">
            <label className="text-sm font-medium text-slate-700">Indent Size</label>
            <div className="flex gap-2">
              {[2, 4, 6, 8].map((size) => (
                <button
                  key={size}
                  onClick={() => setIndentSize(size)}
                  className={`px-3 py-1 rounded-lg text-sm transition ${
                    indentSize === size
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">Input</label>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handlePaste}>
                Paste
              </Button>
              <Button variant="ghost" size="sm" onClick={handleClearInput}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder='{"key": "value"}'
            className="w-full h-48 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleFormat} className="flex-1">
            <Code className="mr-2 h-4 w-4" />
            {mode === "format" && "Format & Validate"}
            {mode === "minify" && "Minify"}
            {mode === "validate" && "Validate"}
          </Button>
        </div>

        {/* Status */}
        {isValid !== null && (
          <div className={`rounded-xl p-4 text-sm ${
            isValid ? 'bg-green-50 border border-green-200 text-green-700' : 'bg-red-50 border border-red-200 text-red-700'
          }`}>
            <div className="flex items-center gap-2">
              {isValid ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>Valid JSON</span>
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <span>{error}</span>
                </>
              )}
            </div>
          </div>
        )}

        {/* Output Area */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Output</label>
              <div className="flex gap-2">
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                  {copied ? "Copied!" : "Copy"}
                </Button>
                <Button variant="ghost" size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
            <div className="relative">
              <pre className="w-full min-h-[100px] max-h-[300px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-mono whitespace-pre-wrap break-all">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
