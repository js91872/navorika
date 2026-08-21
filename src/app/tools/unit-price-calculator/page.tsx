'use client';

import { useMemo, useState } from 'react';
import { Scale, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';

export default function UnitPriceCalculator() {
  const [priceA, setPriceA] = useState(250);
  const [quantityA, setQuantityA] = useState(2);
  const [priceB, setPriceB] = useState(420);
  const [quantityB, setQuantityB] = useState(4);
  const [unitLabel, setUnitLabel] = useState('kg');
  const [currency, setCurrency] = useState('₹');

  const result = useMemo(() => {
    if (
      [priceA, quantityA, priceB, quantityB].some((v) => !Number.isFinite(v)) ||
      priceA < 0 ||
      priceB < 0 ||
      quantityA <= 0 ||
      quantityB <= 0
    ) {
      return {
        valid: false,
        error: 'Prices cannot be negative and quantities must be greater than zero.',
      } as const;
    }

    const unitA = priceA / quantityA;
    const unitB = priceB / quantityB;

    const cheaper = unitA === unitB ? 'same' : unitA < unitB ? 'A' : 'B';
    const difference = Math.abs(unitA - unitB);
    const expensive = Math.max(unitA, unitB);
    const savingPercent = expensive === 0 ? 0 : (difference / expensive) * 100;

    return {
      valid: true,
      unitA,
      unitB,
      cheaper,
      difference,
      savingPercent,
    } as const;
  }, [priceA, quantityA, priceB, quantityB]);

  const reset = () => {
    setPriceA(250);
    setQuantityA(2);
    setPriceB(420);
    setQuantityB(4);
    setUnitLabel('kg');
    setCurrency('₹');
  };

  const money = (value: number) => `${currency}${value.toFixed(2)}`;

  return (
    <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold uppercase tracking-wider mb-4">
          Shopping & Everyday Calculator
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Unit Price Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Compare two package sizes or quantities and find which option costs
          less per unit.
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Scale className="h-5 w-5 text-emerald-500" />
            <h2 className="text-xl font-bold">Compare products</h2>
          </div>

          <ProductBox
            title="Option A"
            price={priceA}
            quantity={quantityA}
            currency={currency}
            unitLabel={unitLabel}
            setPrice={setPriceA}
            setQuantity={setQuantityA}
          />

          <div className="my-6 border-t border-slate-200 dark:border-slate-800" />

          <ProductBox
            title="Option B"
            price={priceB}
            quantity={quantityB}
            currency={currency}
            unitLabel={unitLabel}
            setPrice={setPriceB}
            setQuantity={setQuantityB}
          />

          <div className="grid sm:grid-cols-2 gap-4 mt-7">
            <div>
              <label className="block text-sm font-medium mb-2">Unit label</label>
              <Input
                type="text"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                placeholder="kg, L, piece..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Currency</label>
              <Select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                options={[
                  { value: '₹', label: '₹ INR' },
                  { value: '$', label: '$ USD' },
                  { value: '€', label: '€ EUR' },
                  { value: '£', label: '£ GBP' },
                  { value: 'C$', label: 'C$ CAD' },
                  { value: 'A$', label: 'A$ AUD' },
                ]}
              />
            </div>
          </div>

          <Button variant="outline" onClick={reset} className="w-full mt-7">
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <h2 className="text-xl font-bold mb-6">Value comparison</h2>

          {result.valid ? (
            <>
              <div className="grid sm:grid-cols-2 gap-4">
                <Card label="Option A unit price" value={`${money(result.unitA)} / ${unitLabel || 'unit'}`} />
                <Card label="Option B unit price" value={`${money(result.unitB)} / ${unitLabel || 'unit'}`} />
              </div>

              <div className="mt-5 rounded-3xl bg-gradient-to-br from-emerald-500/10 to-teal-500/10 border border-emerald-200 dark:border-emerald-800 p-6 text-center">
                <p className="text-xs uppercase tracking-wider font-bold text-emerald-600 dark:text-emerald-400 mb-2">
                  Better value
                </p>

                <p className="text-4xl font-black">
                  {result.cheaper === 'same'
                    ? 'Same unit price'
                    : `Option ${result.cheaper}`}
                </p>

                {result.cheaper !== 'same' && (
                  <p className="text-sm text-slate-500 mt-3">
                    Saves {money(result.difference)} per {unitLabel || 'unit'}
                    {' '}({result.savingPercent.toFixed(2)}% lower unit price)
                  </p>
                )}
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <p className="font-bold mb-2">Formula</p>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  Unit price = total price ÷ quantity. The lower unit price is
                  the better value when the products are otherwise comparable.
                </p>
              </div>
            </>
          ) : (
            <ErrorBox message={result.error} />
          )}
        </section>
      </div>
    </main>
  );
}

function ProductBox({
  title,
  price,
  quantity,
  currency,
  unitLabel,
  setPrice,
  setQuantity,
}: {
  title: string;
  price: number;
  quantity: number;
  currency: string;
  unitLabel: string;
  setPrice: (v: number) => void;
  setQuantity: (v: number) => void;
}) {
  return (
    <div>
      <h3 className="font-bold mb-4">{title}</h3>

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">Price ({currency})</label>
          <Input
            type="number"
            min={0}
            step={0.01}
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Quantity ({unitLabel || 'units'})
          </label>
          <Input
            type="number"
            min={0.0001}
            step={0.01}
            value={quantity}
            onChange={(e) => setQuantity(Number(e.target.value))}
          />
        </div>
      </div>
    </div>
  );
}

function Card({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-2">{label}</p>
      <p className="text-xl font-black break-words">{value}</p>
    </div>
  );
}

function ErrorBox({ message }: { message: string }) {
  return (
    <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
      <p className="font-bold text-red-700 dark:text-red-300 mb-2">Cannot compare</p>
      <p className="text-sm text-red-600 dark:text-red-400">{message}</p>
    </div>
  );
}
