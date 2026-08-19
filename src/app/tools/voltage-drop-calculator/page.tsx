'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function VoltageDropCalculator() {
  const [voltage, setVoltage] = useState<number>(120);
  const [current, setCurrent] = useState<number>(20);
  const [length, setLength] = useState<number>(50);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [wireGauge, setWireGauge] = useState<string>('12');
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [maxDropPercent, setMaxDropPercent] = useState<number>(3);
  const [result, setResult] = useState<any>(null);

  const wireResistance: { [key: string]: number } = {
    '18': 0.016,
    '16': 0.010,
    '14': 0.0064,
    '12': 0.0040,
    '10': 0.0025,
    '8': 0.0016,
    '6': 0.0010,
    '4': 0.00064,
    '2': 0.00040
  };

  const calculateVoltageDrop = () => {
    let len = length;
    if (unit === 'ft') {
      len = length * 0.3048;
    }

    const resistance = wireResistance[wireGauge] || 0.0040;
    const vDrop = phase === 'single'
      ? 2 * current * resistance * len
      : Math.sqrt(3) * current * resistance * len;

    const vDropPercent = (vDrop / voltage) * 100;
    const isAcceptable = vDropPercent <= maxDropPercent;

    setResult({
      vDrop,
      vDropPercent,
      isAcceptable,
      voltage,
      current,
      length: len,
      wireGauge,
      phase
      , maxDropPercent
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setVoltage(120);
    setCurrent(20);
    setLength(50);
    setWireGauge('12');
    setPhase('single');
    setMaxDropPercent(3);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Voltage Drop Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate voltage drop in electrical circuits and wiring.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-2">Voltage (V)</label>
            <Select
              value={voltage.toString()}
              onChange={(e) => setVoltage(Number(e.target.value))}
              options={[
                { value: '12', label: '12V DC' },
                { value: '24', label: '24V DC' },
                { value: '120', label: '120V AC' },
                { value: '240', label: '240V AC' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Current (Amps)</label>
            <Input
              type="number"
              value={current}
              onChange={(e) => setCurrent(Number(e.target.value))}
              min={0.1}
              step={0.5}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Length</label>
            <div className="flex gap-3">
              <Input
                type="number"
                value={length}
                onChange={(e) => setLength(Number(e.target.value))}
                className="flex-1"
                min={0.1}
                step={0.5}
              />
              <Select
                value={unit}
                onChange={(e) => setUnit(e.target.value as 'm' | 'ft')}
                options={[
                  { value: 'm', label: 'm' },
                  { value: 'ft', label: 'ft' }
                ]}
                className="w-24"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Wire Gauge (AWG)</label>
            <Select
              value={wireGauge}
              onChange={(e) => setWireGauge(e.target.value)}
              options={[
                { value: '18', label: '18 AWG' },
                { value: '16', label: '16 AWG' },
                { value: '14', label: '14 AWG' },
                { value: '12', label: '12 AWG' },
                { value: '10', label: '10 AWG' },
                { value: '8', label: '8 AWG' },
                { value: '6', label: '6 AWG' },
                { value: '4', label: '4 AWG' },
                { value: '2', label: '2 AWG' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Phase</label>
            <Select
              value={phase}
              onChange={(e) => setPhase(e.target.value as 'single' | 'three')}
              options={[
                { value: 'single', label: 'Single Phase' },
                { value: 'three', label: 'Three Phase' }
              ]}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Planning Limit (%)</label>
            <Input type="number" value={maxDropPercent} onChange={(e) => setMaxDropPercent(Number(e.target.value))} min={0.1} max={20} step={0.1} />
          </div>
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateVoltageDrop} className="flex-1">
            Calculate Voltage Drop
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Voltage Drop Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Voltage Drop</p>
                <p className="text-xl font-bold">{result.vDrop.toFixed(2)} V</p>
              </div>
              <div className={`p-3 rounded-lg ${result.isAcceptable ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'}`}>
                <p className="text-sm text-slate-500 dark:text-slate-400">Voltage Drop %</p>
                <p className={`text-xl font-bold ${result.isAcceptable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.vDropPercent.toFixed(2)}%
                </p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                <p className={`text-lg font-bold ${result.isAcceptable ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                  {result.isAcceptable ? `Within entered limit (≤${result.maxDropPercent}%)` : `Above entered limit (>${result.maxDropPercent}%)`}
                </p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">Uses approximate copper resistance at 20°C and one-way route length. Verify conductor temperature, AC reactance, power factor, terminations, ampacity, and applicable electrical code with a qualified professional.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
