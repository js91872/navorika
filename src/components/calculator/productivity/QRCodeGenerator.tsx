"use client";

import { useState, useRef } from "react";
import { Download, Copy, Check, RefreshCw, QrCode, Image as ImageIcon } from "lucide-react";
import QRCode from "qrcode";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function QRCodeGenerator() {
  const [text, setText] = useState("");
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [size, setSize] = useState(256);
  const [errorCorrection, setErrorCorrection] = useState<"L" | "M" | "Q" | "H">("M");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQR = async () => {
    if (!text.trim()) {
      alert("Please enter text or a URL to generate a QR code.");
      return;
    }

    setLoading(true);
    try {
      const dataUrl = await QRCode.toDataURL(text, {
        width: size,
        errorCorrectionLevel: errorCorrection,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#ffffff",
        },
      });
      setQrDataUrl(dataUrl);
    } catch (error) {
      console.error("QR generation error:", error);
      alert("Failed to generate QR code. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!qrDataUrl) return;
    const link = document.createElement("a");
    link.download = `qrcode-${Date.now()}.png`;
    link.href = qrDataUrl;
    link.click();
  };

  const handleCopy = async () => {
    if (!qrDataUrl) return;
    try {
      const response = await fetch(qrDataUrl);
      const blob = await response.blob();
      await navigator.clipboard.write([
        new ClipboardItem({
          [blob.type]: blob,
        }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  const handleClear = () => {
    setText("");
    setQrDataUrl("");
  };

  const handlePaste = async () => {
    const text = await navigator.clipboard.readText();
    setText(text);
  };

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="QR Code Generator"
        description="Generate QR codes for URLs, text, and more."
        icon="📱"
        accuracy="Standard QR Code format"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Content</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Enter text or URL..."
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                />
                <Button variant="outline" onClick={handlePaste}>Paste</Button>
              </div>
              <p className="text-xs text-slate-500">Supports URLs, text, contact info, and more</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Size (px)</label>
              <div className="flex flex-wrap gap-2">
                {[128, 256, 512, 1024].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`px-3 py-1 rounded-lg text-sm transition ${
                      size === s
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">Error Correction</label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { value: "L", label: "L (7%)" },
                  { value: "M", label: "M (15%)" },
                  { value: "Q", label: "Q (25%)" },
                  { value: "H", label: "H (30%)" },
                ].map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setErrorCorrection(option.value as any)}
                    className={`py-1 px-2 rounded-lg text-xs transition ${
                      errorCorrection === option.value
                        ? 'bg-blue-600 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={generateQR} disabled={loading} className="w-full">
              {loading ? (
                <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <QrCode className="mr-2 h-4 w-4" />
              )}
              Generate QR Code
            </Button>

            <Button variant="outline" onClick={handleClear} className="w-full">
              Clear
            </Button>
          </div>

          {/* RIGHT PANEL - QR Code Display */}
          <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-center min-h-[300px]">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt="QR Code"
                  className="max-w-full h-auto"
                  style={{ maxHeight: "300px" }}
                />
              ) : (
                <div className="text-center text-slate-400">
                  <QrCode className="h-16 w-16 mx-auto mb-2 opacity-50" />
                  <p>Enter content and generate</p>
                </div>
              )}
            </div>

            {qrDataUrl && (
              <div className="flex gap-2">
                <Button onClick={handleDownload} className="flex-1">
                  <Download className="mr-2 h-4 w-4" />
                  Download
                </Button>
                <Button variant="outline" onClick={handleCopy} className="flex-1">
                  {copied ? <Check className="mr-2 h-4 w-4 text-green-600" /> : <Copy className="mr-2 h-4 w-4" />}
                  {copied ? "Copied!" : "Copy Image"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
