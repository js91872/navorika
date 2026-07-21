"use client";

import { useState } from "react";
import { Copy, Check, Download, Trash2, ArrowLeftRight, Link2, AlertCircle } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function URLEncoder() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const handleConvert = () => {
    setError("");
    
    if (!input.trim()) {
      setError("Please enter text to convert.");
      return;
    }

    try {
      if (mode === "encode") {
        const encoded = encodeURIComponent(input);
        setOutput(encoded);
      } else {
        const decoded = decodeURIComponent(input);
        setOutput(decoded);
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Invalid input'}`);
      setOutput("");
    }
  };

  const handleClear = () => {
    setInput("");
    setOutput("");
    setError("");
  };

  const handleCopy = async () => {
    if (!output) return;
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!output) return;
    const blob = new Blob([output], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = mode === 'encode' ? 'encoded.txt' : 'decoded.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setInput(text);
  };

  const handleClearInput = () => {
    setInput("");
  };

  const getCharacterCount = (str: string) => {
    return str.length;
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="URL Encoder / Decoder"
        description="Encode or decode URL strings for safe web transmission."
        icon="🔗"
        accuracy="RFC 3986 compliant"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Mode Selection */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Mode</label>
          <div className="grid grid-cols-2 gap-3">
            {[
              { value: "encode", label: "Encode", icon: "🔒" },
              { value: "decode", label: "Decode", icon: "🔓" },
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

        {/* Input Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-sm font-medium text-slate-700">
              {mode === "encode" ? "Text to Encode" : "URL to Decode"}
            </label>
            <div className="flex gap-2">
              <span className="text-xs text-slate-400">{getCharacterCount(input)} characters</span>
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
            placeholder={mode === "encode" ? "Enter text to URL encode..." : "Enter URL to decode..."}
            className="w-full h-32 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm font-mono outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 resize-none"
            spellCheck={false}
          />
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <Button onClick={handleConvert} className="flex-1">
            <ArrowLeftRight className="mr-2 h-4 w-4" />
            {mode === "encode" ? "Encode URL" : "Decode URL"}
          </Button>
          <Button variant="outline" onClick={handleClear}>
            <Trash2 className="mr-2 h-4 w-4" />
            Clear All
          </Button>
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            <AlertCircle className="h-4 w-4 inline mr-2" />
            {error}
          </div>
        )}

        {/* Output Area */}
        {output && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">
                {mode === "encode" ? "Encoded URL" : "Decoded URL"}
              </label>
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
              <pre className="w-full min-h-[100px] max-h-[200px] overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm font-mono whitespace-pre-wrap break-all">
                {output}
              </pre>
            </div>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
