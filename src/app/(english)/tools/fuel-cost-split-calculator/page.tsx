'use client';

import { useMemo, useState } from 'react';
import { Car, RotateCcw, Users, Fuel, Wallet, Download, FileText, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import QRCode from 'qrcode';

type DistanceUnit = 'km' | 'mi';
type EfficiencyUnit = 'kmpl' | 'l100km' | 'mpg';

const LITRES_PER_US_GALLON = 3.785411784;
const KM_PER_MILE = 1.609344;

function money(value: number, symbol: string) {
  return `${symbol}${value.toFixed(2)}`;
}

export default function FuelCostSplitCalculator() {
  const [distance, setDistance] = useState(300);
  const [distanceUnit, setDistanceUnit] = useState<DistanceUnit>('km');
  const [efficiency, setEfficiency] = useState(15);
  const [efficiencyUnit, setEfficiencyUnit] = useState<EfficiencyUnit>('kmpl');
  const [fuelPrice, setFuelPrice] = useState(100);
  const [passengers, setPassengers] = useState(4);
  const [roundTrip, setRoundTrip] = useState(false);
  const [tolls, setTolls] = useState(0);
  const [parking, setParking] = useState(0);
  const [otherCosts, setOtherCosts] = useState(0);
  const [currency, setCurrency] = useState('₹');

  const result = useMemo(() => {
    const values = [
      distance,
      efficiency,
      fuelPrice,
      passengers,
      tolls,
      parking,
      otherCosts,
    ];

    if (values.some((value) => !Number.isFinite(value))) {
      return {
        valid: false,
        error: 'Please enter valid numeric values.',
      } as const;
    }

    if (distance <= 0) {
      return {
        valid: false,
        error: 'Distance must be greater than zero.',
      } as const;
    }

    if (efficiency <= 0) {
      return {
        valid: false,
        error: 'Fuel efficiency must be greater than zero.',
      } as const;
    }

    if (fuelPrice < 0 || tolls < 0 || parking < 0 || otherCosts < 0) {
      return {
        valid: false,
        error: 'Costs cannot be negative.',
      } as const;
    }

    if (!Number.isInteger(passengers) || passengers < 1) {
      return {
        valid: false,
        error: 'Passengers must be a whole number of at least 1.',
      } as const;
    }

    const tripDistanceInput = roundTrip ? distance * 2 : distance;

    const distanceKm =
      distanceUnit === 'km'
        ? tripDistanceInput
        : tripDistanceInput * KM_PER_MILE;

    let litresNeeded = 0;

    if (efficiencyUnit === 'kmpl') {
      litresNeeded = distanceKm / efficiency;
    }

    if (efficiencyUnit === 'l100km') {
      litresNeeded = (distanceKm * efficiency) / 100;
    }

    if (efficiencyUnit === 'mpg') {
      const miles = distanceKm / KM_PER_MILE;
      const gallons = miles / efficiency;
      litresNeeded = gallons * LITRES_PER_US_GALLON;
    }

    const fuelCost = litresNeeded * fuelPrice;
    const extras = tolls + parking + otherCosts;
    const totalCost = fuelCost + extras;
    const perPassenger = totalCost / passengers;
    const fuelPerPassenger = fuelCost / passengers;
    const costPerDistance = totalCost / tripDistanceInput;

    return {
      valid: true,
      tripDistanceInput,
      distanceKm,
      litresNeeded,
      fuelCost,
      extras,
      totalCost,
      perPassenger,
      fuelPerPassenger,
      costPerDistance,
    } as const;
  }, [
    distance,
    distanceUnit,
    efficiency,
    efficiencyUnit,
    fuelPrice,
    passengers,
    roundTrip,
    tolls,
    parking,
    otherCosts,
  ]);

  const createShareCard = async () => {
    if (!result.valid) return null;

    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1600;

    const ctx = canvas.getContext('2d');
    if (!ctx) return null;

    const pageWidth = canvas.width;
    const left = 70;
    const right = 1130;

    // Background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, pageWidth, canvas.height);

    // Header gradient
    const headerGradient = ctx.createLinearGradient(0, 0, pageWidth, 0);
    headerGradient.addColorStop(0, '#5b21b6');
    headerGradient.addColorStop(0.5, '#4338ca');
    headerGradient.addColorStop(1, '#0284c7');

    ctx.fillStyle = headerGradient;
    ctx.fillRect(0, 0, pageWidth, 220);

    // Simple Navorika brand mark
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(105, 90, 42, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7c3aed';
    ctx.beginPath();
    ctx.arc(105, 90, 27, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(105, 90, 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 60px Arial, sans-serif';
    ctx.fillText('Navorika', 175, 95);

    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('Fuel Cost & Passenger Split Calculator', 175, 145);

    ctx.font = '22px Arial, sans-serif';
    ctx.fillStyle = '#dbeafe';
    ctx.fillText('Free • Private • Browser-based', 175, 183);

    // Trip Summary heading
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 30px Arial, sans-serif';
    ctx.fillText('TRIP SUMMARY', left, 285);

    const summaryRows: Array<[string, string]> = [
      [
        roundTrip ? 'Trip distance (round trip)' : 'Trip distance (one-way)',
        `${result.tripDistanceInput.toFixed(1)} ${distanceUnit}`,
      ],
      ['Round trip', roundTrip ? 'Yes' : 'No'],
      [
        'Fuel efficiency',
        `${efficiency} ${
          efficiencyUnit === 'kmpl'
            ? 'km/L'
            : efficiencyUnit === 'l100km'
              ? 'L/100 km'
              : 'MPG (US)'
        }`,
      ],
      ['Fuel needed', `${result.litresNeeded.toFixed(2)} L`],
      ['Fuel price per litre', money(fuelPrice, currency)],
      ['Fuel cost', money(result.fuelCost, currency)],
      ['Tolls', money(tolls, currency)],
      ['Parking', money(parking, currency)],
      ['Other costs', money(otherCosts, currency)],
    ];

    let y = 355;

    summaryRows.forEach(([label, value], index) => {
      if (index % 2 === 0) {
        ctx.fillStyle = '#f8fafc';
        ctx.fillRect(60, y - 46, 1080, 66);
      }

      ctx.fillStyle = '#475569';
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText(label, 90, y);

      ctx.fillStyle = '#111827';
      ctx.font = 'bold 25px Arial, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value, right, y);
      ctx.textAlign = 'left';

      y += 72;
    });

    // Divider
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(left, y - 25);
    ctx.lineTo(right, y - 25);
    ctx.stroke();

    // Total
    ctx.fillStyle = '#111827';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('TOTAL TRIP COST', left, y + 25);

    ctx.fillStyle = '#2563eb';
    ctx.textAlign = 'right';
    ctx.font = 'bold 32px Arial, sans-serif';
    ctx.fillText(money(result.totalCost, currency), right, y + 25);
    ctx.textAlign = 'left';

    y += 80;

    // Equal-share card
    const shareGradient = ctx.createLinearGradient(60, y, 1140, y);
    shareGradient.addColorStop(0, '#ecfdf5');
    shareGradient.addColorStop(1, '#f0fdf4');

    ctx.fillStyle = shareGradient;
    ctx.fillRect(60, y, 1080, 245);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, y, 1080, 245);

    ctx.fillStyle = '#15803d';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('EQUAL SHARE PER PERSON', 100, y + 55);

    ctx.fillStyle = '#111827';
    ctx.font = 'bold 72px Arial, sans-serif';
    ctx.fillText(money(result.perPassenger, currency), 100, y + 145);

    ctx.fillStyle = '#374151';
    ctx.font = '24px Arial, sans-serif';
    ctx.fillText(
      `Split equally between ${passengers} ${passengers === 1 ? 'person' : 'people'}`,
      100,
      y + 190
    );

    ctx.font = '21px Arial, sans-serif';
    ctx.fillStyle = '#64748b';
    ctx.fillText(
      `Fuel-only share: ${money(result.fuelPerPassenger, currency)} per person`,
      100,
      y + 222
    );

    y += 285;

    // QR / portal promotion card
    const promoGradient = ctx.createLinearGradient(60, y, 1140, y);
    promoGradient.addColorStop(0, '#f5f3ff');
    promoGradient.addColorStop(1, '#eff6ff');

    ctx.fillStyle = promoGradient;
    ctx.fillRect(60, y, 1080, 260);

    ctx.strokeStyle = '#8b5cf6';
    ctx.lineWidth = 2;
    ctx.strokeRect(60, y, 1080, 260);

    ctx.fillStyle = '#5b21b6';
    ctx.font = 'bold 28px Arial, sans-serif';
    ctx.fillText('Discover More Wonderful Tools!', 100, y + 55);

    ctx.fillStyle = '#374151';
    ctx.font = '22px Arial, sans-serif';
    ctx.fillText(
      'Visit the URL or scan the QR code to access',
      100,
      y + 100
    );
    ctx.fillText(
      'more free, useful tools like this on Navorika.',
      100,
      y + 132
    );

    // URL pill
    ctx.fillStyle = '#6d28d9';
    ctx.fillRect(100, y + 165, 440, 58);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.fillText('https://navorika.com', 125, y + 202);

    // Generate real QR code
    const qrDataUrl = await QRCode.toDataURL('https://navorika.com', {
      width: 210,
      margin: 1,
      errorCorrectionLevel: 'M',
    });

    const qrImage = new Image();

    await new Promise<void>((resolve, reject) => {
      qrImage.onload = () => resolve();
      qrImage.onerror = () => reject(new Error('Unable to render QR code.'));
      qrImage.src = qrDataUrl;
    });

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(850, y + 25, 225, 225);

    ctx.drawImage(qrImage, 858, y + 33, 209, 209);

    ctx.fillStyle = '#6d28d9';
    ctx.font = 'bold 18px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('SCAN ME', 962, y + 255);
    ctx.textAlign = 'left';

    y += 300;

    // Footer gradient
    const footerGradient = ctx.createLinearGradient(0, y, pageWidth, y);
    footerGradient.addColorStop(0, '#6d28d9');
    footerGradient.addColorStop(1, '#0284c7');

    ctx.fillStyle = footerGradient;
    ctx.fillRect(0, y, pageWidth, 125);

    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 24px Arial, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Made with ♥ by Navorika', pageWidth / 2, y + 48);

    ctx.font = '20px Arial, sans-serif';
    ctx.fillText(
      'Free, private and easy-to-use online tools',
      pageWidth / 2,
      y + 83
    );

    ctx.textAlign = 'left';

    return canvas;
  };

  const saveAsJpg = async () => {
    const canvas = await createShareCard();
    if (!canvas) return;

    canvas.toBlob(
      (blob) => {
        if (!blob) return;

        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'navorika-fuel-cost-passenger-split.jpg';
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
      },
      'image/jpeg',
      0.94
    );
  };

  const saveAsPdf = async () => {
    const canvas = await createShareCard();
    if (!canvas) return;

    const imageData = canvas.toDataURL('image/jpeg', 0.94);

    const { PDFDocument } = await import('pdf-lib');

    const pdf = await PDFDocument.create();
    const jpg = await pdf.embedJpg(imageData);

    const page = pdf.addPage([595.28, 841.89]);

    const margin = 24;
    const availableWidth = page.getWidth() - margin * 2;
    const availableHeight = page.getHeight() - margin * 2;

    const scale = Math.min(
      availableWidth / jpg.width,
      availableHeight / jpg.height
    );

    const width = jpg.width * scale;
    const height = jpg.height * scale;

    page.drawImage(jpg, {
      x: (page.getWidth() - width) / 2,
      y: (page.getHeight() - height) / 2,
      width,
      height,
    });

    const bytes = await pdf.save();
    const blob = new Blob([new Uint8Array(bytes)], {
      type: 'application/pdf',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'navorika-fuel-cost-passenger-split.pdf';
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  };

  const reset = () => {
    setDistance(300);
    setDistanceUnit('km');
    setEfficiency(15);
    setEfficiencyUnit('kmpl');
    setFuelPrice(100);
    setPassengers(4);
    setRoundTrip(false);
    setTolls(0);
    setParking(0);
    setOtherCosts(0);
    setCurrency('₹');
  };

  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-10">
        <div className="inline-flex items-center px-3 py-1 rounded-full bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold uppercase tracking-wider mb-4">
          Travel & Everyday Calculator
        </div>

        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">
          Fuel Cost & Passenger Split Calculator
        </h1>

        <p className="text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto">
          Estimate fuel needed, total trip cost, and how much each passenger
          should pay.
        </p>
      </div>

      <div className="grid lg:grid-cols-[1fr_1fr] gap-6">
        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Car className="h-5 w-5 text-sky-500" />
            <h2 className="text-xl font-bold">Trip details</h2>
          </div>

          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium mb-2">
                One-way distance
              </label>

              <div className="grid grid-cols-[1fr_110px] gap-3">
                <Input
                  type="number"
                  min={0.1}
                  step={1}
                  value={distance}
                  onChange={(e) => setDistance(Number(e.target.value))}
                />

                <Select
                  value={distanceUnit}
                  onChange={(e) =>
                    setDistanceUnit(e.target.value as DistanceUnit)
                  }
                  options={[
                    { value: 'km', label: 'km' },
                    { value: 'mi', label: 'miles' },
                  ]}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Fuel efficiency
              </label>

              <div className="grid grid-cols-[1fr_150px] gap-3">
                <Input
                  type="number"
                  min={0.1}
                  step={0.1}
                  value={efficiency}
                  onChange={(e) => setEfficiency(Number(e.target.value))}
                />

                <Select
                  value={efficiencyUnit}
                  onChange={(e) =>
                    setEfficiencyUnit(e.target.value as EfficiencyUnit)
                  }
                  options={[
                    { value: 'kmpl', label: 'km/L' },
                    { value: 'l100km', label: 'L/100 km' },
                    { value: 'mpg', label: 'MPG (US)' },
                  ]}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-[1fr_120px] gap-3">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Fuel price per litre
                </label>

                <Input
                  type="number"
                  min={0}
                  step={0.01}
                  value={fuelPrice}
                  onChange={(e) => setFuelPrice(Number(e.target.value))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Currency
                </label>

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

            <div>
              <label className="block text-sm font-medium mb-2">
                Number of people sharing the cost
              </label>

              <Input
                type="number"
                min={1}
                step={1}
                value={passengers}
                onChange={(e) => setPassengers(Number(e.target.value))}
              />
            </div>

            <label className="flex items-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 p-4 cursor-pointer">
              <input
                type="checkbox"
                checked={roundTrip}
                onChange={(e) => setRoundTrip(e.target.checked)}
                className="h-4 w-4"
              />

              <div>
                <p className="text-sm font-bold">Round trip</p>
                <p className="text-xs text-slate-500">
                  Double the entered one-way distance.
                </p>
              </div>
            </label>
          </div>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-7 pt-7">
            <h3 className="font-bold mb-4">Optional trip costs</h3>

            <div className="grid sm:grid-cols-3 gap-4">
              <CostField
                label="Tolls"
                value={tolls}
                onChange={setTolls}
              />

              <CostField
                label="Parking"
                value={parking}
                onChange={setParking}
              />

              <CostField
                label="Other"
                value={otherCosts}
                onChange={setOtherCosts}
              />
            </div>
          </div>

          <Button
            variant="outline"
            onClick={reset}
            className="w-full mt-7"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset
          </Button>
        </section>

        <section className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="h-5 w-5 text-indigo-500" />
            <h2 className="text-xl font-bold">Trip cost</h2>
          </div>

          {result.valid ? (
            <>
              <div className="rounded-3xl bg-gradient-to-br from-indigo-500/10 to-sky-500/10 border border-indigo-200 dark:border-indigo-800 p-6 text-center">
                <div className="flex items-center justify-center gap-2 text-indigo-600 dark:text-indigo-400 mb-2">
                  <Users className="h-5 w-5" />
                  <span className="text-xs uppercase tracking-wider font-bold">
                    Cost per person
                  </span>
                </div>

                <p className="text-4xl font-black text-slate-900 dark:text-white">
                  {money(result.perPassenger, currency)}
                </p>

                <p className="text-sm text-slate-500 mt-2">
                  Split equally between {passengers}{' '}
                  {passengers === 1 ? 'person' : 'people'}
                </p>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 mt-5">
                <Button
                  variant="outline"
                  onClick={saveAsJpg}
                  className="w-full"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Save as JPG
                  <Download className="h-4 w-4 ml-2" />
                </Button>

                <Button
                  variant="outline"
                  onClick={saveAsPdf}
                  className="w-full"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Save as PDF
                  <Download className="h-4 w-4 ml-2" />
                </Button>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-5">
                <ResultCard
                  icon={<Fuel className="h-5 w-5 text-amber-500" />}
                  label="Fuel needed"
                  value={`${result.litresNeeded.toFixed(2)} L`}
                />

                <ResultCard
                  icon={<Wallet className="h-5 w-5 text-emerald-500" />}
                  label="Fuel cost"
                  value={money(result.fuelCost, currency)}
                />

                <ResultCard
                  label="Total trip cost"
                  value={money(result.totalCost, currency)}
                />

                <ResultCard
                  label={`Cost per ${distanceUnit}`}
                  value={money(result.costPerDistance, currency)}
                />
              </div>

              <div className="mt-6 rounded-2xl bg-slate-50 dark:bg-slate-800 p-5">
                <h3 className="font-bold mb-4">Cost breakdown</h3>

                <div className="space-y-3 text-sm">
                  <BreakdownRow
                    label="Trip distance"
                    value={`${result.tripDistanceInput.toFixed(1)} ${distanceUnit}`}
                  />

                  <BreakdownRow
                    label="Fuel"
                    value={money(result.fuelCost, currency)}
                  />

                  <BreakdownRow
                    label="Tolls"
                    value={money(tolls, currency)}
                  />

                  <BreakdownRow
                    label="Parking"
                    value={money(parking, currency)}
                  />

                  <BreakdownRow
                    label="Other costs"
                    value={money(otherCosts, currency)}
                  />

                  <div className="border-t border-slate-200 dark:border-slate-700 pt-3">
                    <BreakdownRow
                      label="Total"
                      value={money(result.totalCost, currency)}
                      bold
                    />
                  </div>
                </div>
              </div>

              <div className="mt-6 rounded-2xl border border-slate-200 dark:border-slate-700 p-5">
                <p className="text-sm font-bold mb-2">
                  Fuel-only share per person
                </p>

                <p className="text-2xl font-black">
                  {money(result.fuelPerPassenger, currency)}
                </p>

                {result.extras > 0 && (
                  <p className="text-xs text-slate-500 mt-2">
                    Other shared trip costs add{' '}
                    {money(result.extras / passengers, currency)} per person.
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="rounded-2xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-5">
              <p className="font-bold text-red-700 dark:text-red-300 mb-2">
                Cannot calculate trip cost
              </p>

              <p className="text-sm text-red-600 dark:text-red-400">
                {result.error}
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

function CostField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-medium mb-2">{label}</label>

      <Input
        type="number"
        min={0}
        step={0.01}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </div>
  );
}

function ResultCard({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 dark:bg-slate-800 p-4">
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <p className="text-xs uppercase tracking-wider text-slate-500">
          {label}
        </p>
      </div>

      <p className="text-xl font-black">{value}</p>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  bold = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <div
      className={`flex items-center justify-between gap-4 ${
        bold ? 'font-bold text-base' : ''
      }`}
    >
      <span className="text-slate-600 dark:text-slate-300">{label}</span>
      <span>{value}</span>
    </div>
  );
}
