"use client";

import { useEffect, useState, useMemo, useCallback } from "react";
import { ArrowRightLeft, RefreshCw, TrendingUp, TrendingDown } from "lucide-react";
import CalculatorShell from "../CalculatorShell";
import CalculatorHeader from "../CalculatorHeader";
import NumberInput from "../NumberInput";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import { currencyConfig } from "@/config/calculators/currency-converter";
import { fetchExchangeRates, fetchHistoricalRates } from "@/lib/services/currency-api";
import { convertCurrency, formatCurrency } from "@/lib/calculations/currency-converter";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState(currencyConfig.amount.default);
  const [fromCurrency, setFromCurrency] = useState(currencyConfig.fromCurrency.default);
  const [toCurrency, setToCurrency] = useState(currencyConfig.toCurrency.default);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [historicalData, setHistoricalData] = useState<{ date: string; rate: number }[]>([]);

  const result = useMemo(() => {
    if (Object.keys(rates).length === 0) return null;
    try {
      return convertCurrency(amount, fromCurrency, toCurrency, rates);
    } catch {
      return null;
    }
  }, [amount, fromCurrency, toCurrency, rates]);

  const loadRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchExchangeRates(fromCurrency);
      setRates(data.rates);
      setLastUpdated(data.date);
      
      // Fetch historical data for chart
      const historical = await fetchHistoricalRates(fromCurrency, toCurrency, 30);
      setHistoricalData(historical);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load exchange rates");
    } finally {
      setIsLoading(false);
    }
  }, [fromCurrency, toCurrency]);

  useEffect(() => {
    loadRates();
  }, [loadRates]);

  const handleSwap = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
  };

  const isUpwardTrend = historicalData.length > 1 && 
    historicalData[historicalData.length - 1]?.rate > historicalData[0]?.rate;

  return (
    <CalculatorShell>
      <CalculatorHeader
        title="Currency Converter"
        description="Convert currencies with real-time exchange rates."
        accuracy="Live rates updated daily"
        updatedOn={lastUpdated}
      />

      <div className="p-6 lg:p-8 space-y-8">
        {/* Error Message */}
        {error && (
          <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-sm text-red-700">
            {error}
            <button
              onClick={loadRates}
              className="ml-2 text-red-600 font-medium hover:text-red-800"
            >
              Try Again
            </button>
          </div>
        )}

        <div className="grid gap-8 lg:grid-cols-2">
          {/* LEFT PANEL - Inputs */}
          <div className="space-y-6">
            {/* Amount Input */}
            <NumberInput
              label="Amount"
              value={amount}
              onChange={setAmount}
              min={currencyConfig.amount.min}
              step={currencyConfig.amount.step}
            />

            {/* From Currency */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">From</label>
              <div className="flex gap-2">
                <select
                  value={fromCurrency}
                  onChange={(e) => setFromCurrency(e.target.value)}
                  className="flex-1 rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
                >
                  <optgroup label="Popular">
                    {currencyConfig.popularCurrencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code} - {c.name}
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="All Currencies">
                    {currencyConfig.allCurrencies.map((code) => (
                      <option key={code} value={code}>
                        {code}
                      </option>
                    ))}
                  </optgroup>
                </select>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleSwap}
                  className="flex-shrink-0"
                  title="Swap currencies"
                >
                  <ArrowRightLeft className="h-5 w-5" />
                </Button>
              </div>
            </div>

            {/* To Currency */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">To</label>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-lg font-medium outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
              >
                <optgroup label="Popular">
                  {currencyConfig.popularCurrencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.flag} {c.code} - {c.name}
                    </option>
                  ))}
                </optgroup>
                <optgroup label="All Currencies">
                  {currencyConfig.allCurrencies.map((code) => (
                    <option key={code} value={code}>
                      {code}
                    </option>
                  ))}
                </optgroup>
              </select>
            </div>

            {/* Refresh Button */}
            <Button
              variant="outline"
              size="sm"
              onClick={loadRates}
              disabled={isLoading}
              className="w-full"
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
              {isLoading ? "Loading..." : "Refresh Rates"}
            </Button>
          </div>

          {/* RIGHT PANEL - Results */}
          <div className="space-y-6">
            {/* Converted Amount */}
            <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 p-6 text-white">
              <p className="text-sm text-blue-200">Converted Amount</p>
              <p className="text-4xl font-bold mt-1">
                {result ? formatCurrency(result.toAmount, toCurrency) : "—"}
              </p>
              <div className="flex items-center gap-2 mt-2 text-sm text-blue-200">
                <span>{fromCurrency}</span>
                <span>→</span>
                <span>{toCurrency}</span>
                {result && (
                  <span className="ml-auto text-xs bg-blue-800/50 px-2 py-1 rounded-full">
                    1 {fromCurrency} = {result.rate.toFixed(4)} {toCurrency}
                  </span>
                )}
              </div>
            </div>

            {/* Exchange Rate Details */}
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Exchange Rate</span>
                  {result ? (
                    <span className="font-medium">
                      1 {fromCurrency} = {result.rate.toFixed(6)} {toCurrency}
                    </span>
                  ) : (
                    <span className="text-slate-400">Loading...</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Inverse Rate</span>
                  {result ? (
                    <span className="font-medium">
                      1 {toCurrency} = {result.inverseRate.toFixed(6)} {fromCurrency}
                    </span>
                  ) : (
                    <span className="text-slate-400">Loading...</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Last Updated</span>
                  <span className="font-medium text-slate-600">
                    {lastUpdated || "—"}
                  </span>
                </div>
              </CardContent>
            </Card>

            {/* 30-Day Trend */}
            {historicalData.length > 1 && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-slate-700">30-Day Trend</span>
                    <div className={`flex items-center gap-1 text-sm ${isUpwardTrend ? 'text-green-600' : 'text-red-600'}`}>
                      {isUpwardTrend ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      {isUpwardTrend ? '↑' : '↓'}
                      {historicalData.length > 0 && 
                        ((historicalData[historicalData.length - 1]?.rate || 0) - (historicalData[0]?.rate || 0)).toFixed(4)
                      }
                    </div>
                  </div>
                  <div className="mt-3 h-16 flex items-end gap-1">
                    {historicalData.map((item, index) => {
                      const maxRate = Math.max(...historicalData.map(d => d.rate));
                      const height = maxRate > 0 ? Math.max(5, (item.rate / maxRate) * 100) : 5;
                      return (
                        <div
                          key={index}
                          className="flex-1 rounded-sm transition-all"
                          style={{
                            height: `${height}%`,
                            background: isUpwardTrend ? '#10b981' : '#ef4444',
                            opacity: 0.3 + (index / historicalData.length) * 0.7,
                          }}
                        />
                      );
                    })}
                  </div>
                  <div className="flex justify-between text-xs text-slate-400 mt-1">
                    <span>{historicalData[0]?.date || ''}</span>
                    <span>Today</span>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </CalculatorShell>
  );
}
