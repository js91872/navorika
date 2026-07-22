"use client";

import { useState, useEffect } from "react";
import { RefreshCw, TrendingUp, DollarSign, ArrowRight } from "lucide-react";

import CalculatorShell from "../CalculatorShell";
import { Button } from "@/components/ui/Button";
import ResultCard from "../ResultCard";
import ResultGrid from "../ResultGrid";
import NumberInput from "../NumberInput";

// Currency data (simplified - in real app, fetch from API)
const currencies = [
  { code: "USD", name: "US Dollar", symbol: "$" },
  { code: "EUR", name: "Euro", symbol: "€" },
  { code: "GBP", name: "British Pound", symbol: "£" },
  { code: "INR", name: "Indian Rupee", symbol: "₹" },
  { code: "JPY", name: "Japanese Yen", symbol: "¥" },
  { code: "CAD", name: "Canadian Dollar", symbol: "C$" },
  { code: "AUD", name: "Australian Dollar", symbol: "A$" },
  { code: "CHF", name: "Swiss Franc", symbol: "Fr" },
  { code: "CNY", name: "Chinese Yuan", symbol: "¥" },
  { code: "SGD", name: "Singapore Dollar", symbol: "S$" },
];

// Mock exchange rates (in real app, fetch from API)
const mockRates: Record<string, number> = {
  USD: 1,
  EUR: 0.85,
  GBP: 0.73,
  INR: 83.5,
  JPY: 149.5,
  CAD: 1.36,
  AUD: 1.53,
  CHF: 0.91,
  CNY: 7.24,
  SGD: 1.35,
};

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number>(1);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [result, setResult] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const convertCurrency = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      const fromRate = mockRates[fromCurrency] || 1;
      const toRate = mockRates[toCurrency] || 1;
      const converted = (amount / fromRate) * toRate;
      setResult(converted);
      setIsLoading(false);
    }, 300);
  };

  useEffect(() => {
    convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  const getSymbol = (code: string) => {
    const currency = currencies.find(c => c.code === code);
    return currency?.symbol || code;
  };

  const formatCurrency = (value: number, currencyCode: string) => {
    const symbol = getSymbol(currencyCode);
    return `${symbol}${value.toFixed(2)}`;
  };

  return (
    <CalculatorShell>
      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Amount Input */}
        <NumberInput
          label="Amount"
          value={amount}
          onChange={setAmount}
          min={0.01}
          step={0.01}
          prefix={getSymbol(fromCurrency)}
        />

        {/* Currency Selection */}
        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">From</label>
            <select
              value={fromCurrency}
              onChange={(e) => setFromCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">To</label>
            <select
              value={toCurrency}
              onChange={(e) => setToCurrency(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 dark:border-slate-600 dark:bg-slate-700 dark:text-slate-200"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Swap Button */}
        <div className="flex justify-center">
          <button
            onClick={() => {
              setFromCurrency(toCurrency);
              setToCurrency(fromCurrency);
            }}
            className="rounded-full bg-slate-100 p-2.5 text-slate-600 transition hover:bg-slate-200 dark:bg-slate-700 dark:text-slate-300 dark:hover:bg-slate-600"
          >
            <ArrowRight className="h-5 w-5 rotate-90" />
          </button>
        </div>

        {/* Result */}
        {result !== null && (
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-accent-600 p-6 text-white text-center">
            <p className="text-sm text-white/70">Converted Amount</p>
            <p className="text-3xl sm:text-4xl font-bold mt-1">
              {isLoading ? (
                <span className="inline-block animate-pulse">...</span>
              ) : (
                formatCurrency(result, toCurrency)
              )}
            </p>
            <p className="text-xs text-white/50 mt-2">
              {amount} {fromCurrency} → {toCurrency}
            </p>
          </div>
        )}

        {/* Quick Info */}
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Live Rate</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              1 {fromCurrency} = {formatCurrency(mockRates[toCurrency] / mockRates[fromCurrency], toCurrency)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/50">
            <p className="text-xs text-slate-500 dark:text-slate-400">Last Updated</p>
            <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
              {new Date().toLocaleString()}
            </p>
          </div>
        </div>

        {/* Refresh Button */}
        <Button
          onClick={convertCurrency}
          disabled={isLoading}
          variant="outline"
          className="w-full"
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {isLoading ? "Converting..." : "Refresh Rates"}
        </Button>
      </div>
    </CalculatorShell>
  );
}
