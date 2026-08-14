'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function SolarPanelCalculatorContent() {
  const meta = tools.find(t => t.slug === 'solar-panel-calculator');
  const [dailyUsage, setDailyUsage] = useState<number>(30);
  const [sunHours, setSunHours] = useState<number>(5);
  const [panelWattage, setPanelWattage] = useState<number>(400);
  const [systemLosses, setSystemLosses] = useState<number>(20);
  const [result, setResult] = useState<any>(null);

  const calculateSolar = () => {
    const dailyKwh = dailyUsage;
    const dailyWattHours = dailyKwh * 1000;
    
    const systemSize = dailyWattHours / (sunHours * (1 - systemLosses / 100));
    const panelsNeeded = Math.ceil(systemSize / panelWattage);
    const actualSystemSize = panelsNeeded * panelWattage / 1000;
    const annualProduction = actualSystemSize * sunHours * 365 * (1 - systemLosses / 100);

    setResult({
      dailyKwh,
      systemSize: systemSize / 1000,
      panelsNeeded,
      actualSystemSize,
      annualProduction,
      panelWattage,
      sunHours,
      systemLosses
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setDailyUsage(30);
    setSunHours(5);
    setPanelWattage(400);
    setSystemLosses(20);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Solar Panel Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate solar panel requirements for your energy needs.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Daily Energy Usage (kWh)</label>
            <Input
              type="number"
              value={dailyUsage}
              onChange={(e) => setDailyUsage(Number(e.target.value))}
              min={1}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Peak Sun Hours per Day</label>
            <Input
              type="number"
              value={sunHours}
              onChange={(e) => setSunHours(Number(e.target.value))}
              min={1}
              max={8}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Panel Wattage (W)</label>
            <Select
              value={panelWattage.toString()}
              onChange={(e) => setPanelWattage(Number(e.target.value))}
              options={[
                { value: '300', label: '300W' },
                { value: '350', label: '350W' },
                { value: '400', label: '400W (Standard)' },
                { value: '450', label: '450W' },
                { value: '500', label: '500W' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">System Losses (%)</label>
            <Input
              type="number"
              value={systemLosses}
              onChange={(e) => setSystemLosses(Number(e.target.value))}
              min={5}
              max={30}
              step={1}
            />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateSolar} className="flex-1">
            Calculate Solar Panels
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Solar Panel Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Daily Usage</p>
                <p className="text-lg font-bold">{result.dailyKwh} kWh</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">System Size</p>
                <p className="text-lg font-bold">{result.systemSize.toFixed(1)} kW</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Panels Needed</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{result.panelsNeeded} panels</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Actual System Size</p>
                <p className="text-lg font-bold">{result.actualSystemSize.toFixed(1)} kW</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Annual Production</p>
                <p className="text-lg font-bold">{result.annualProduction.toFixed(0)} kWh/year</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-sm text-green-600 dark:text-green-400">💡 {result.panelsNeeded} x {result.panelWattage}W panels = {result.actualSystemSize.toFixed(1)} kW system</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SolarPanelCalculator() {
  const meta = tools.find(t => t.slug === 'solar-panel-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SolarPanelCalculatorContent />
    </EnhancedToolWrapper>
  );
}
