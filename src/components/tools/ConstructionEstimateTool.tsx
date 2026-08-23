'use client';

import { useMemo, useState } from 'react';
import QRCode from 'qrcode';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import {
  Plus,
  Trash2,
  Download,
  FileImage,
  Printer,
  RotateCcw,
} from 'lucide-react';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';

import {
  calculateEstimate,
  type EstimateCategory,
  type EstimateItem,
} from '@/lib/calculations/constructionEstimate';

type Mode = 'builder' | 'contractor';

interface Props {
  mode: Mode;
}

const categories: EstimateCategory[] = [
  'Materials',
  'Labor',
  'Equipment',
  'Subcontractor',
  'Other',
];

const currencyOptions = [
  { value: 'USD', label: 'USD ($)' },
  { value: 'EUR', label: 'EUR (€)' },
  { value: 'GBP', label: 'GBP (£)' },
  { value: 'INR', label: 'INR (₹)' },
  { value: 'CAD', label: 'CAD ($)' },
  { value: 'AUD', label: 'AUD ($)' },
];

const makeItem = (): EstimateItem => ({
  id: `${Date.now()}-${Math.random()}`,
  category: 'Materials',
  description: '',
  quantity: 1,
  unit: 'item',
  unitCost: 0,
});

export default function ConstructionEstimateTool({ mode }: Props) {
  const contractorMode = mode === 'contractor';

  const [currency, setCurrency] = useState('USD');
  const [estimateNumber, setEstimateNumber] = useState('EST-001');
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [contractorName, setContractorName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [notes, setNotes] = useState('');

  const [items, setItems] = useState<EstimateItem[]>([
    {
      ...makeItem(),
      description: 'Example material',
      quantity: 1,
      unit: 'item',
      unitCost: 0,
    },
  ]);

  const [overheadPercent, setOverheadPercent] = useState(10);
  const [contingencyPercent, setContingencyPercent] = useState(5);
  const [markupPercent, setMarkupPercent] = useState(10);
  const [taxPercent, setTaxPercent] = useState(0);
  const [discount, setDiscount] = useState(0);

  const totals = useMemo(
    () =>
      calculateEstimate(items, {
        overheadPercent,
        contingencyPercent,
        markupPercent,
        taxPercent,
        discount,
      }),
    [
      items,
      overheadPercent,
      contingencyPercent,
      markupPercent,
      taxPercent,
      discount,
    ]
  );

  const money = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      maximumFractionDigits: 2,
    }).format(Number.isFinite(value) ? value : 0);

  const updateItem = <K extends keyof EstimateItem>(
    id: string,
    field: K,
    value: EstimateItem[K]
  ) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id ? { ...item, [field]: value } : item
      )
    );
  };

  const removeItem = (id: string) => {
    setItems((current) =>
      current.length === 1
        ? [{ ...makeItem(), description: '' }]
        : current.filter((item) => item.id !== id)
    );
  };

  const reset = () => {
    setCurrency('USD');
    setEstimateNumber('EST-001');
    setProjectName('');
    setClientName('');
    setContractorName('');
    setProjectDescription('');
    setNotes('');
    setItems([{ ...makeItem(), description: '' }]);
    setOverheadPercent(10);
    setContingencyPercent(5);
    setMarkupPercent(10);
    setTaxPercent(0);
    setDiscount(0);
  };

  const buildExportCanvas = async () => {
    const width = 1400;
    const margin = 80;
    const canvas = document.createElement('canvas');

    const rowHeight = 54;
    const itemHeight = Math.max(items.length, 1) * rowHeight;
    const height = Math.max(1750, 1150 + itemHeight);

    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable.');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 46px Arial';
    ctx.fillText(
      contractorMode ? 'CONTRACTOR ESTIMATE' : 'CONSTRUCTION ESTIMATE',
      margin,
      100
    );

    ctx.font = '24px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText(`Estimate ${estimateNumber || '—'}`, margin, 145);

    let y = 215;

    const detail = (label: string, value: string) => {
      if (!value.trim()) return;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#334155';
      ctx.fillText(`${label}:`, margin, y);
      ctx.font = '20px Arial';
      ctx.fillStyle = '#111827';
      ctx.fillText(value.slice(0, 75), margin + 190, y);
      y += 38;
    };

    detail('Project', projectName);
    detail('Client', clientName);
    if (contractorMode) detail('Contractor', contractorName);

    if (projectDescription.trim()) {
      y += 10;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#334155';
      ctx.fillText('Project description', margin, y);
      y += 34;
      ctx.font = '19px Arial';
      ctx.fillStyle = '#111827';
      ctx.fillText(projectDescription.slice(0, 105), margin, y);
      y += 50;
    }

    y += 20;

    ctx.fillStyle = '#f1f5f9';
    ctx.fillRect(margin, y, width - margin * 2, 48);

    ctx.font = 'bold 18px Arial';
    ctx.fillStyle = '#334155';
    ctx.fillText('Description', margin + 16, y + 31);
    ctx.fillText('Category', 600, y + 31);
    ctx.fillText('Qty', 835, y + 31);
    ctx.fillText('Unit', 925, y + 31);
    ctx.fillText('Amount', 1110, y + 31);

    y += 48;

    for (const item of items) {
      const amount =
        Math.max(0, Number(item.quantity) || 0) *
        Math.max(0, Number(item.unitCost) || 0);

      ctx.strokeStyle = '#e2e8f0';
      ctx.beginPath();
      ctx.moveTo(margin, y + rowHeight);
      ctx.lineTo(width - margin, y + rowHeight);
      ctx.stroke();

      ctx.font = '18px Arial';
      ctx.fillStyle = '#111827';
      ctx.fillText(
        (item.description || 'Untitled item').slice(0, 42),
        margin + 16,
        y + 34
      );
      ctx.fillText(item.category, 600, y + 34);
      ctx.fillText(String(item.quantity), 835, y + 34);
      ctx.fillText(item.unit.slice(0, 12), 925, y + 34);
      ctx.fillText(money(amount), 1110, y + 34);

      y += rowHeight;
    }

    y += 50;

    const totalLine = (
      label: string,
      value: number,
      bold = false
    ) => {
      ctx.font = `${bold ? 'bold ' : ''}21px Arial`;
      ctx.fillStyle = bold ? '#4f46e5' : '#334155';
      ctx.fillText(label, 850, y);
      ctx.textAlign = 'right';
      ctx.fillText(money(value), width - margin, y);
      ctx.textAlign = 'left';
      y += 38;
    };

    totalLine('Direct cost', totals.directCost);
    totalLine(`Overhead (${overheadPercent}%)`, totals.overhead);
    totalLine(`Contingency (${contingencyPercent}%)`, totals.contingency);
    totalLine(`Markup (${markupPercent}%)`, totals.markup);

    if (totals.discount > 0) {
      totalLine('Discount', -totals.discount);
    }

    if (taxPercent > 0) {
      totalLine(`Tax (${taxPercent}%)`, totals.tax);
    }

    y += 8;
    totalLine('ESTIMATED TOTAL', totals.grandTotal, true);

    if (notes.trim()) {
      y += 30;
      ctx.font = 'bold 20px Arial';
      ctx.fillStyle = '#334155';
      ctx.fillText('Notes / terms', margin, y);
      y += 34;
      ctx.font = '18px Arial';
      ctx.fillStyle = '#475569';
      ctx.fillText(notes.slice(0, 115), margin, y);
    }

    const qrDataUrl = await QRCode.toDataURL('https://navorika.com', {
      width: 170,
      margin: 1,
    });

    const qr = new Image();
    await new Promise<void>((resolve, reject) => {
      qr.onload = () => resolve();
      qr.onerror = () => reject(new Error('Could not generate QR code.'));
      qr.src = qrDataUrl;
    });

    const footerY = height - 260;

    ctx.strokeStyle = '#e2e8f0';
    ctx.beginPath();
    ctx.moveTo(margin, footerY - 35);
    ctx.lineTo(width - margin, footerY - 35);
    ctx.stroke();

    ctx.drawImage(qr, margin, footerY, 150, 150);

    ctx.font = 'bold 24px Arial';
    ctx.fillStyle = '#111827';
    ctx.fillText('Created with Navorika', margin + 190, footerY + 38);

    ctx.font = '19px Arial';
    ctx.fillStyle = '#475569';
    ctx.fillText(
      'Click URL / scan QR code to access more wonderful tools like this.',
      margin + 190,
      footerY + 78
    );

    ctx.font = 'bold 20px Arial';
    ctx.fillStyle = '#4f46e5';
    ctx.fillText('https://navorika.com', margin + 190, footerY + 118);

    ctx.font = '15px Arial';
    ctx.fillStyle = '#64748b';
    ctx.fillText(
      'Planning estimate only. Verify quantities, rates, taxes, scope and contractual terms before use.',
      margin,
      height - 45
    );

    return canvas;
  };

  const saveJpg = async () => {
    const canvas = await buildExportCanvas();
    const link = document.createElement('a');
    link.download = `${contractorMode ? 'contractor' : 'construction'}-estimate.jpg`;
    link.href = canvas.toDataURL('image/jpeg', 0.94);
    link.click();
  };

  const savePdf = async () => {
    const canvas = await buildExportCanvas();
    const jpgDataUrl = canvas.toDataURL('image/jpeg', 0.94);
    const jpgBytes = await fetch(jpgDataUrl).then((response) =>
      response.arrayBuffer()
    );

    const pdf = await PDFDocument.create();
    const image = await pdf.embedJpg(jpgBytes);

    const pageWidth = 595.28;
    const pageHeight = 841.89;
    const scale = Math.min(
      pageWidth / image.width,
      pageHeight / image.height
    );

    const page = pdf.addPage([pageWidth, pageHeight]);

    page.drawImage(image, {
      x: (pageWidth - image.width * scale) / 2,
      y: (pageHeight - image.height * scale) / 2,
      width: image.width * scale,
      height: image.height * scale,
    });

    const font = await pdf.embedFont(StandardFonts.Helvetica);
    page.drawText('navorika.com', {
      x: 20,
      y: 12,
      size: 7,
      font,
      color: rgb(0.39, 0.4, 0.95),
    });

    const bytes = await pdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: 'application/pdf',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = `${contractorMode ? 'contractor' : 'construction'}-estimate.pdf`;
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-5 md:p-8">
        <div className="mb-8">
          <h2 className="text-2xl md:text-3xl font-bold">
            {contractorMode
              ? 'Contractor Estimate Generator'
              : 'Construction Estimate Builder'}
          </h2>

          <p className="mt-2 text-slate-600 dark:text-slate-400">
            {contractorMode
              ? 'Create a detailed customer-facing contractor estimate with line items, overhead, contingency, markup, tax and downloadable output.'
              : 'Build a detailed construction estimate from materials, labor, equipment, subcontractors and other project costs.'}
          </p>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div>
            <label className="block text-sm font-medium mb-2">
              Estimate number
            </label>
            <Input
              value={estimateNumber}
              onChange={(e) => setEstimateNumber(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Project name
            </label>
            <Input
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
              placeholder="Kitchen renovation"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Currency
            </label>
            <Select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              options={currencyOptions}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Client / customer
            </label>
            <Input
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Optional"
            />
          </div>

          {contractorMode && (
            <div>
              <label className="block text-sm font-medium mb-2">
                Contractor / business
              </label>
              <Input
                value={contractorName}
                onChange={(e) => setContractorName(e.target.value)}
                placeholder="Optional"
              />
            </div>
          )}
        </section>

        <div className="mb-8">
          <label className="block text-sm font-medium mb-2">
            Project description
          </label>
          <textarea
            value={projectDescription}
            onChange={(e) => setProjectDescription(e.target.value)}
            rows={3}
            placeholder="Briefly describe the project scope..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3"
          />
        </div>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-xl font-bold">Estimate line items</h3>
              <p className="text-sm text-slate-500">
                Quantity × unit cost is calculated automatically.
              </p>
            </div>

            <Button
              onClick={() => setItems((current) => [...current, makeItem()])}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add item
            </Button>
          </div>

          <div className="space-y-4">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="rounded-2xl border border-slate-200 dark:border-slate-700 p-4"
              >
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold">Item {index + 1}</span>

                  <button
                    type="button"
                    onClick={() => removeItem(item.id)}
                    className="p-2 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                    aria-label={`Remove item ${index + 1}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                  <div className="md:col-span-2">
                    <label className="block text-xs font-medium mb-1">
                      Description
                    </label>
                    <Input
                      value={item.description}
                      onChange={(e) =>
                        updateItem(item.id, 'description', e.target.value)
                      }
                      placeholder="Concrete, labor, rental..."
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Category
                    </label>
                    <Select
                      value={item.category}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'category',
                          e.target.value as EstimateCategory
                        )
                      }
                      options={categories.map((category) => ({
                        value: category,
                        label: category,
                      }))}
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      value={item.quantity}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'quantity',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Unit
                    </label>
                    <Input
                      value={item.unit}
                      onChange={(e) =>
                        updateItem(item.id, 'unit', e.target.value)
                      }
                      placeholder="hr, sq ft, item"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium mb-1">
                      Unit cost
                    </label>
                    <Input
                      type="number"
                      min={0}
                      step="any"
                      value={item.unitCost}
                      onChange={(e) =>
                        updateItem(
                          item.id,
                          'unitCost',
                          Number(e.target.value)
                        )
                      }
                    />
                  </div>
                </div>

                <div className="mt-3 text-right font-semibold">
                  {money(item.quantity * item.unitCost)}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 md:grid-cols-5 gap-4">
          {[
            ['Overhead %', overheadPercent, setOverheadPercent],
            ['Contingency %', contingencyPercent, setContingencyPercent],
            ['Markup %', markupPercent, setMarkupPercent],
            ['Tax %', taxPercent, setTaxPercent],
            ['Discount', discount, setDiscount],
          ].map(([label, value, setter]) => (
            <div key={String(label)}>
              <label className="block text-sm font-medium mb-2">
                {String(label)}
              </label>
              <Input
                type="number"
                min={0}
                step="any"
                value={value as number}
                onChange={(e) =>
                  (setter as (value: number) => void)(
                    Number(e.target.value)
                  )
                }
              />
            </div>
          ))}
        </section>

        <section className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="rounded-2xl bg-slate-50 dark:bg-slate-800/60 p-5">
            <h3 className="font-bold text-lg mb-4">Category breakdown</h3>

            <div className="space-y-3">
              {categories.map((category) => (
                <div
                  key={category}
                  className="flex justify-between border-b border-slate-200 dark:border-slate-700 pb-2"
                >
                  <span>{category}</span>
                  <strong>{money(totals.categoryTotals[category])}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900 p-5">
            <h3 className="font-bold text-lg mb-4">Estimate summary</h3>

            <div className="space-y-3">
              <div className="flex justify-between">
                <span>Direct cost</span>
                <strong>{money(totals.directCost)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Overhead</span>
                <strong>{money(totals.overhead)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Contingency</span>
                <strong>{money(totals.contingency)}</strong>
              </div>

              <div className="flex justify-between">
                <span>Markup</span>
                <strong>{money(totals.markup)}</strong>
              </div>

              {totals.discount > 0 && (
                <div className="flex justify-between">
                  <span>Discount</span>
                  <strong>-{money(totals.discount)}</strong>
                </div>
              )}

              <div className="flex justify-between">
                <span>Tax</span>
                <strong>{money(totals.tax)}</strong>
              </div>

              <div className="flex justify-between pt-4 border-t border-indigo-200 dark:border-indigo-800 text-xl">
                <span className="font-bold">Estimated total</span>
                <strong className="text-indigo-600 dark:text-indigo-400">
                  {money(totals.grandTotal)}
                </strong>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-8">
          <label className="block text-sm font-medium mb-2">
            Notes / terms
          </label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="Payment terms, exclusions, validity period or other notes..."
            className="w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 px-4 py-3"
          />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Button onClick={saveJpg}>
            <FileImage className="h-4 w-4 mr-2" />
            Save as JPG
          </Button>

          <Button onClick={savePdf}>
            <Download className="h-4 w-4 mr-2" />
            Save as PDF
          </Button>

          <Button variant="outline" onClick={() => window.print()}>
            <Printer className="h-4 w-4 mr-2" />
            Print
          </Button>

          <Button variant="outline" onClick={reset}>
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </div>

        <div className="mt-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900">
          <p className="text-sm text-amber-900 dark:text-amber-200">
            This tool performs arithmetic from your inputs. It does not supply
            market prices or determine scope, tax treatment, contract terms,
            engineering requirements or the suitability of an estimate.
          </p>
        </div>
      </div>
    </div>
  );
}
