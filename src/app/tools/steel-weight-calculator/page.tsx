'use client';

import { useState } from 'react';
import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

function SteelWeightCalculatorContent() {
  const meta = tools.find(t => t.slug === 'steel-weight-calculator');
  const [result, setResult] = useState<any>(null);

  const handleCalculate = () => {
    // TODO: Add calculation logic
    setResult({ value: 'Calculation result will appear here' });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Steel Weight Calculator</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">Calculate weight of steel bars, beams, and structural steel.</p>
        
        <button
          onClick={handleCalculate}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all"
        >
          Calculate
        </button>
        
        {result && (
          <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <p className="text-center">{result.value}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SteelWeightCalculator() {
  const meta = tools.find(t => t.slug === 'steel-weight-calculator');
  return (
    <EnhancedToolWrapper meta={meta}>
      <SteelWeightCalculatorContent />
    </EnhancedToolWrapper>
  );
}
