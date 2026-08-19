'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

export default function WireSizeCalculator() {
  const [current, setCurrent] = useState<number>(20);
  const [voltage, setVoltage] = useState<number>(120);
  const [length, setLength] = useState<number>(50);
  const [unit, setUnit] = useState<'m' | 'ft'>('m');
  const [conductor, setConductor] = useState<'copper' | 'aluminum'>('copper');
  const [phase, setPhase] = useState<'single' | 'three'>('single');
  const [loadFactor, setLoadFactor] = useState<number>(125);
  const [maxDropPercent, setMaxDropPercent] = useState<number>(3);
  const [result, setResult] = useState<any>(null);

  const wireSizeTable: Record<string, { copper: number; aluminum: number; copperOhmPerM: number; aluminumOhmPerM: number }> = {
    '14': { copper: 15, aluminum: 0, copperOhmPerM: 0.008286, aluminumOhmPerM: 0.0136 },
    '12': { copper: 20, aluminum: 15, copperOhmPerM: 0.005211, aluminumOhmPerM: 0.00855 },
    '10': { copper: 30, aluminum: 25, copperOhmPerM: 0.003277, aluminumOhmPerM: 0.00538 },
    '8': { copper: 40, aluminum: 35, copperOhmPerM: 0.002061, aluminumOhmPerM: 0.00338 },
    '6': { copper: 55, aluminum: 40, copperOhmPerM: 0.001296, aluminumOhmPerM: 0.00213 },
    '4': { copper: 70, aluminum: 55, copperOhmPerM: 0.000815, aluminumOhmPerM: 0.00134 },
    '3': { copper: 85, aluminum: 65, copperOhmPerM: 0.000646, aluminumOhmPerM: 0.00106 },
    '2': { copper: 95, aluminum: 75, copperOhmPerM: 0.000513, aluminumOhmPerM: 0.000842 },
    '1': { copper: 110, aluminum: 85, copperOhmPerM: 0.000406, aluminumOhmPerM: 0.000667 },
    '0': { copper: 125, aluminum: 100, copperOhmPerM: 0.000322, aluminumOhmPerM: 0.000529 },
    '00': { copper: 145, aluminum: 115, copperOhmPerM: 0.000256, aluminumOhmPerM: 0.00042 },
    '000': { copper: 165, aluminum: 130, copperOhmPerM: 0.000203, aluminumOhmPerM: 0.000333 },
    '0000': { copper: 195, aluminum: 150, copperOhmPerM: 0.000161, aluminumOhmPerM: 0.000264 }
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
    const lengthM = unit === 'ft' ? length * 0.3048 : length;
    const designCurrent = current * (loadFactor / 100);
    let recommendedGauge = '';
    let ampacity = 0;
    let voltageDrop = 0;
    let voltageDropPercent = 0;

    for (const [gauge, data] of Object.entries(wireSizeTable)) {
      const referenceAmpacity = data[conductor];
      const resistance = conductor === 'copper' ? data.copperOhmPerM : data.aluminumOhmPerM;
      const drop = phase === 'single' ? 2 * current * resistance * lengthM : Math.sqrt(3) * current * resistance * lengthM;
      const dropPercent = drop / voltage * 100;
      if (referenceAmpacity >= designCurrent && dropPercent <= maxDropPercent) {
        recommendedGauge = gauge; ampacity = referenceAmpacity; voltageDrop = drop; voltageDropPercent = dropPercent; break;
      }
    }

    if (!recommendedGauge) {
      const data = wireSizeTable['0000'];
      recommendedGauge = '0000'; ampacity = data[conductor];
      const resistance = conductor === 'copper' ? data.copperOhmPerM : data.aluminumOhmPerM;
      voltageDrop = phase === 'single' ? 2 * current * resistance * lengthM : Math.sqrt(3) * current * resistance * lengthM;
      voltageDropPercent = voltageDrop / voltage * 100;
    }

    setResult({
      recommendedGauge,
      ampacity,
      conductor,
      current,
      voltage,
      phase,
      designCurrent,
      voltageDrop,
      voltageDropPercent,
      meetsCriteria: ampacity >= designCurrent && voltageDropPercent <= maxDropPercent,
      maxDropPercent,
      lengthM
    });
  };

  const resetCalculator = () => {
    setResult(null);
    setCurrent(20);
    setVoltage(120);
    setLength(50);
    setConductor('copper');
    setPhase('single');
    setLoadFactor(125);
    setMaxDropPercent(3);
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
          <div>
            <label className="block text-sm font-medium mb-2">Design Load Factor (%)</label>
            <Input type="number" value={loadFactor} onChange={(e) => setLoadFactor(Number(e.target.value))} min={100} max={200} step={5} />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">Maximum Voltage Drop (%)</label>
            <Input type="number" value={maxDropPercent} onChange={(e) => setMaxDropPercent(Number(e.target.value))} min={0.1} max={20} step={0.1} />
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
                <p className="text-sm text-slate-500 dark:text-slate-400">Estimated Voltage Drop</p>
                <p className="text-xl font-bold">{result.voltageDrop.toFixed(2)} V ({result.voltageDropPercent.toFixed(2)}%)</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Reference Check</p>
                <p className="text-xl font-bold">{result.meetsCriteria ? 'Meets entered criteria' : '4/0 still insufficient'}</p>
              </div>
              <div className="p-3 bg-white dark:bg-slate-700 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Conductor</p>
                <p className="text-xl font-bold capitalize">{result.conductor}</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                Preliminary reference only. It compares a simplified 60°C ampacity table and approximate 20°C conductor resistance against the entered load factor and voltage-drop limit. A qualified professional must verify code, insulation, terminals, temperature, bundling, installation method, fault protection, and conductor availability.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
