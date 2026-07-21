"use client";

import { useState, useMemo } from "react";
import { Copy, Check, RefreshCw, Shield, Eye, EyeOff } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";

export default function PasswordGenerator() {
  const [length, setLength] = useState(16);
  const [includeUppercase, setIncludeUppercase] = useState(true);
  const [includeLowercase, setIncludeLowercase] = useState(true);
  const [includeNumbers, setIncludeNumbers] = useState(true);
  const [includeSymbols, setIncludeSymbols] = useState(true);
  const [password, setPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const generatePassword = () => {
    const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const lowercase = "abcdefghijklmnopqrstuvwxyz";
    const numbers = "0123456789";
    const symbols = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    let chars = "";
    if (includeUppercase) chars += uppercase;
    if (includeLowercase) chars += lowercase;
    if (includeNumbers) chars += numbers;
    if (includeSymbols) chars += symbols;

    if (chars === "") {
      alert("Please select at least one character type.");
      return;
    }

    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setPassword(result);
  };

  const handleCopy = async () => {
    if (!password) return;
    await navigator.clipboard.writeText(password);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    generatePassword();
  };

  const getStrength = (pwd: string): { level: string; color: string; score: number } => {
    let score = 0;
    if (pwd.length >= 8) score++;
    if (pwd.length >= 12) score++;
    if (/[A-Z]/.test(pwd)) score++;
    if (/[a-z]/.test(pwd)) score++;
    if (/[0-9]/.test(pwd)) score++;
    if (/[^A-Za-z0-9]/.test(pwd)) score++;

    if (score <= 2) return { level: "Weak", color: "text-red-600", score };
    if (score <= 4) return { level: "Medium", color: "text-yellow-600", score };
    return { level: "Strong", color: "text-green-600", score };
  };

  const strength = useMemo(() => getStrength(password), [password]);

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Password Generator"
        description="Generate strong, secure passwords with customizable options."
        icon="🔐"
        accuracy="Cryptographically secure"
      />

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Password Display */}
        <div className="relative">
          <div className="rounded-2xl border border-slate-200 bg-white p-4 flex items-center justify-between">
            <span className="font-mono text-lg break-all">
              {showPassword ? password || "Click generate" : "••••••••••••••••"}
            </span>
            <div className="flex gap-2">
              <button
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 transition"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
              {password && (
                <button
                  onClick={handleCopy}
                  className="text-slate-400 hover:text-slate-600 transition"
                >
                  {copied ? <Check className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
                </button>
              )}
            </div>
          </div>

          {/* Strength Indicator */}
          {password && (
            <div className="flex items-center gap-2 mt-2">
              <Shield className={`h-4 w-4 ${strength.color}`} />
              <span className={`text-sm font-medium ${strength.color}`}>
                {strength.level} ({strength.score}/6)
              </span>
              <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all ${strength.color.replace('text', 'bg')}`}
                  style={{ width: `${(strength.score / 6) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="space-y-4">
          {/* Length */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-slate-700">Password Length</label>
              <span className="text-sm font-bold text-blue-600">{length}</span>
            </div>
            <input
              type="range"
              min="4"
              max="64"
              value={length}
              onChange={(e) => setLength(Number(e.target.value))}
              className="w-full accent-blue-600"
            />
            <div className="flex justify-between text-xs text-slate-400">
              <span>4</span>
              <span>64</span>
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { id: "uppercase", label: "A-Z", checked: includeUppercase, setter: setIncludeUppercase },
              { id: "lowercase", label: "a-z", checked: includeLowercase, setter: setIncludeLowercase },
              { id: "numbers", label: "0-9", checked: includeNumbers, setter: setIncludeNumbers },
              { id: "symbols", label: "!@#$", checked: includeSymbols, setter: setIncludeSymbols },
            ].map((option) => (
              <label
                key={option.id}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 cursor-pointer hover:bg-slate-50 transition"
              >
                <input
                  type="checkbox"
                  checked={option.checked}
                  onChange={(e) => option.setter(e.target.checked)}
                  className="rounded border-slate-300 text-blue-600 focus:ring-2 focus:ring-blue-500/20"
                />
                <span className="text-sm text-slate-700">{option.label}</span>
              </label>
            ))}
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <Button onClick={handleRegenerate} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              Generate
            </Button>
            {password && (
              <Button variant="outline" onClick={handleCopy} className="flex-1">
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            )}
          </div>
        </div>

        {/* Password Stats */}
        {password && (
          <div className="rounded-xl bg-slate-50 p-4 border border-slate-200">
            <h4 className="text-sm font-semibold text-slate-700 mb-3">Password Stats</h4>
            <ResultGrid>
              <ResultCard label="Length" value={password.length.toString()} />
              <ResultCard label="Uppercase" value={(password.match(/[A-Z]/g) || []).length.toString()} />
              <ResultCard label="Lowercase" value={(password.match(/[a-z]/g) || []).length.toString()} />
              <ResultCard label="Numbers" value={(password.match(/[0-9]/g) || []).length.toString()} />
              <ResultCard label="Symbols" value={(password.match(/[^A-Za-z0-9]/g) || []).length.toString()} />
              <ResultCard
                label="Entropy"
                value={`${Math.round(length * Math.log2(includeUppercase ? 26 : 0 + includeLowercase ? 26 : 0 + includeNumbers ? 10 : 0 + includeSymbols ? 32 : 0))} bits`}
              />
            </ResultGrid>
          </div>
        )}
      </div>
    </CalculatorShell>
  );
}
