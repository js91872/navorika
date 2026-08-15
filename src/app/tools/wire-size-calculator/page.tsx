'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

function WireSizeCalculatorContent() {
  const meta = tools.find(t => t.slug === 'wire-size-calculator');
  const [current, setCurrent] = useState<number>(20);
  const [voltage, setVoltage] = useState<number>(120);
  const [length, setLength] = useState<number>(50);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [conductor, setConductor] = useState<'copper' | 'aluminum'>('copper');
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [result, setResult] = useState<any>(null);

  const wireSizeTable: { [key: string]: number } = {
    '18': 14,
    '16': 18,
    '14': 25,
    '12': 30,
    '10': 40,
    '8': 55,
    '6': 75,
    '4': 95,
    '3': 110,
    '2': 130,
    '1': 150,
    '0': 175,
    '00': 200,
    '000': 230,
    '0000': 260
  };

  const wireSizeLabels: { [key: string]: string } = {
    '18': '18 AWG',
    '16': '16 AWG',
    '14': '14 AWG',
    '12': '12 AWG',
    '10': '10 AWG',
    '8': '8 AWG',
    '6': '6 AWG',
    '4': '4 AWG',
    '3': '3 AWG',
    '2': '2 AWG',
    '1': '1 AWG',
    '0': '1/0 AWG',
    '00': '2/0 AWG',
    '000': '3/0 AWG',
    '0000': '4/0 AWG'
  };

  const calculateWireSize = () => {
    const deratingFactor = conductor === 'aluminum' ? 0.8 : 1.0;
    const adjustedCurrent = current / deratingFactor;

    let recommendedGauge = '14';
    let ampacity = 0;

    for (const [gauge, amp] of Object.entries(wireSizeTable)) {
      if (amp >= adjustedCurrent) {
        recommendedGauge = gauge;
        ampacity = amp;
        break;
      }
    }

    if (ampacity === 0) {
      recommendedGauge = '0000';
      ampacity = wireSizeTable['0000'];
    }

    setResult({
      recommendedGauge,
      ampacity: Math.round(ampacity * deratingFactor),
      conductor,
      current,
      voltage,
      phase,
      deratingFactor
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setCurrent(20);
    setVoltage(120);
    setLength(50);
    setConductor('copper');
    setPhase('single');
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-2">Wire Size Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Determine appropriate wire gauge for electrical systems based on ampacity.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            <label className="block text-sm font-medium mb-2">Conductor Material</label>
            <Select
              value={conductor}
              onChange={(e) => setConductor(e.target.value as 'copper' | 'aluminum')}
              options={[
                { value: 'copper', label: 'Copper' },
                { value: 'aluminum', label: 'Aluminum' }
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
        </div>

        <div className="flex gap-4 mt-6">
          <Button onClick={calculateWireSize} className="flex-1">
            Calculate Wire Size
          </Button>
          <Button variant="outline" onClick={resetCalculator}>
            Reset
          </Button>
        </div>

        {result && (
          <div className="mt-6 p-6 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <h3 className="font-bold text-lg mb-4">Wire Size Results</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg md:col-span-2">
                <p className="text-sm text-slate-500 dark:text-slate-400">Recommended Wire Gauge</p>
                <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{wireSizeLabels[result.recommendedGauge] || result.recommendedGauge}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Ampacity (rated)</p>
                <p className="text-xl font-bold">{result.ampacity} A</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Conductor</p>
                <p className="text-xl font-bold capitalize">{result.conductor}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 {wireSizeLabels[result.recommendedGauge]} {result.conductor} wire supports {result.current}A with {result.ampacity}A capacity
                {result.conductor === 'aluminum' ? ' (derated 80% for aluminum)' : ''}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function WireSizeCalculatorWrapper() {
  const meta = tools.find(t => t.slug === 'wire-size-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <WireSizeCalculatorContent />
    </EnhancedToolWrapper>
  );
}
