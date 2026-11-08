'use client';

import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { PDFDocument } from 'pdf-lib';

const templates = [
  { name: 'Red', color: '#e5322d' },
  { name: 'Blue', color: '#2563eb' },
  { name: 'Green', color: '#15803d' },
  { name: 'Purple', color: '#7c3aed' },
  { name: 'Charcoal', color: '#202020' },
];

function saveFile(bytes: BlobPart, type: string, filename: string) {
  const url = URL.createObjectURL(new Blob([bytes], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function drawImage(ctx: CanvasRenderingContext2D, src: string, x: number, y: number, w: number, h: number): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(w / img.width, h / img.height);
      const dw = img.width * ratio;
      const dh = img.height * ratio;
      ctx.drawImage(img, x + (w - dw) / 2, y + (h - dh) / 2, dw, dh);
      resolve();
    };
    img.onerror = () => reject(new Error('Could not load poster image.'));
    img.src = src;
  });
}

export default function UpiQrCodeGenerator() {
  const [name, setName] = useState('');
  const [upi, setUpi] = useState('');
  const [mobile, setMobile] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');
  const [color, setColor] = useState(templates[0].color);
  const [photo, setPhoto] = useState<string | null>(null);
  const [qr, setQr] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [photoError, setPhotoError] = useState('');

  const validUpi = /^[a-zA-Z0-9._-]{2,}@[a-zA-Z0-9.-]{2,}$/.test(upi.trim());
  const validAmount = !amount.trim() || (/^\d+(?:\.\d{1,2})?$/.test(amount.trim()) && Number(amount) > 0 && Number(amount) <= 10000000);
  const validMobile = !mobile.trim() || /^[0-9+()\s-]{7,20}$/.test(mobile.trim());
  const canGenerate = !!name.trim() && validUpi && validAmount && validMobile;
  const uri = canGenerate
    ? 'upi://pay?' + new URLSearchParams({
        pa: upi.trim(),
        pn: name.trim(),
        cu: 'INR',
        ...(amount.trim() ? { am: Number(amount).toFixed(2) } : {}),
        ...(note.trim() ? { tn: note.trim() } : {}),
      }).toString()
    : '';

  useEffect(() => {
    let cancelled = false;
    if (!uri) return;
    QRCode.toDataURL(uri, { width: 900, margin: 3, errorCorrectionLevel: 'H', color: { dark: '#111111', light: '#ffffff' } })
      .then(value => { if (!cancelled) setQr(value); })
      .catch(() => { if (!cancelled) setQr(''); });
    return () => { cancelled = true; };
  }, [uri]);

  async function onPhoto(file?: File) {
    setPhotoError('');
    if (!file) { setPhoto(null); return; }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
      setPhotoError('Choose a PNG, JPEG or WebP image under 5 MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = () => setPhoto(typeof reader.result === 'string' ? reader.result : null);
    reader.readAsDataURL(file);
  }

  async function posterCanvas() {
    if (!canGenerate || !qr) throw new Error('Enter a name and valid UPI ID first.');
    const canvas = document.createElement('canvas');
    canvas.width = 1000;
    canvas.height = photo ? 1550 : 1320;
    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Canvas is unavailable.');
    const w = canvas.width;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, w, canvas.height);
    ctx.fillStyle = color;
    const borderWidth = 20;
    ctx.fillRect(0, 0, w, borderWidth);
    ctx.fillRect(0, 0, borderWidth, canvas.height);
    ctx.fillRect(w - borderWidth, 0, borderWidth, canvas.height);
    ctx.fillStyle = '#202020';
    ctx.textAlign = 'center';
    ctx.font = 'bold 58px Arial, sans-serif';
    const headline = name.trim();
    const truncated = headline.length > 28 ? headline.slice(0, 27) + '…' : headline;
    ctx.fillText(truncated, w / 2, 120);
    let y = 158;
    if (photo) {
      await drawImage(ctx, photo, 370, y, 260, 220);
      y += 245;
    }
    await drawImage(ctx, qr, 170, y, 660, 660);
    y += 706;
    ctx.font = 'bold 38px Arial, sans-serif';
    ctx.fillText('Scan to pay with UPI', w / 2, y);
    y += 64;
    ctx.font = '30px Arial, sans-serif';
    ctx.fillText(upi.trim(), w / 2, y);
    if (amount.trim()) {
      y += 55;
      ctx.font = 'bold 38px Arial, sans-serif';
      ctx.fillText('INR ' + Number(amount).toFixed(2), w / 2, y);
    }
    if (mobile.trim()) {
      y += 52;
      ctx.font = '27px Arial, sans-serif';
      ctx.fillText('Mobile: ' + mobile.trim(), w / 2, y);
    }
    if (note.trim()) {
      y += 45;
      ctx.font = '24px Arial, sans-serif';
      ctx.fillText(note.trim().slice(0, 48), w / 2, y);
    }
    ctx.fillStyle = color;
    ctx.fillRect(0, canvas.height - borderWidth, w, borderWidth);
    ctx.fillStyle = '#666666';
    ctx.font = '20px Arial, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('Created with Navorika.com', w - 40, canvas.height - 42);
    return canvas;
  }

  async function download(format: 'png' | 'pdf') {
    setBusy(true);
    setError('');
    try {
      const canvas = await posterCanvas();
      const png = canvas.toDataURL('image/png');
      if (format === 'png') {
        const data = await (await fetch(png)).blob();
        saveFile(data, 'image/png', 'upi-payment-poster.png');
      } else {
        const pdf = await PDFDocument.create();
        const page = pdf.addPage([500, canvas.height / 2]);
        const embedded = await pdf.embedPng(png);
        page.drawImage(embedded, { x: 0, y: 0, width: 500, height: canvas.height / 2 });
        const bytes = await pdf.save();
        saveFile(new Uint8Array(bytes), 'application/pdf', 'upi-payment-poster.pdf');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create the poster.');
    } finally {
      setBusy(false);
    }
  }

  const inputClass = 'mt-1 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-3 text-[var(--foreground)]';
  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <section className="space-y-4 rounded-2xl border border-[var(--border)] p-5">
        <h2 className="text-xl font-bold">Payment details</h2>
        <label className="block text-sm font-medium">Business or person name *
          <input className={inputClass} value={name} maxLength={80} onChange={e => setName(e.target.value)} placeholder="e.g. Sharma Store" />
        </label>
        <label className="block text-sm font-medium">UPI ID *
          <input className={inputClass} value={upi} maxLength={120} onChange={e => setUpi(e.target.value)} placeholder="name@bank" autoCapitalize="off" />
        </label>
        {upi && !validUpi && <p className="text-sm text-red-600">Enter a valid UPI ID such as name@bank.</p>}
        <label className="block text-sm font-medium">Linked mobile number (optional, display only)
          <input className={inputClass} value={mobile} maxLength={20} onChange={e => setMobile(e.target.value)} placeholder="+91 98765 43210" />
        </label>
        <label className="block text-sm font-medium">Amount in INR (optional)
          <input className={inputClass} inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} placeholder="Leave blank for payer to enter" />
        </label>
        <label className="block text-sm font-medium">Payment note (optional)
          <input className={inputClass} value={note} maxLength={80} onChange={e => setNote(e.target.value)} placeholder="e.g. Invoice 104" />
        </label>
        <label className="block text-sm font-medium">Photo or business logo (optional)
          <input className={inputClass} type="file" accept="image/png,image/jpeg,image/webp" onChange={e => void onPhoto(e.target.files?.[0])} />
        </label>
        {photoError && <p role="alert" className="text-sm text-red-600">{photoError}</p>}
        {photo && <button type="button" onClick={() => setPhoto(null)} className="text-sm font-semibold text-red-600">Remove photo/logo</button>}
        <fieldset>
          <legend className="mb-2 text-sm font-medium">Poster color</legend>
          <div className="flex flex-wrap gap-3">
            {templates.map(t => <button key={t.name} type="button" aria-label={t.name + ' poster'} aria-pressed={color === t.color} onClick={() => setColor(t.color)} className={`h-10 w-10 rounded-full border-4 ${color === t.color ? 'border-slate-500' : 'border-transparent'}`} style={{ background: t.color }} title={t.name} />)}
          </div>
        </fieldset>
        <p className="text-xs text-[var(--muted-foreground)]">Your details and image are processed in your browser. The mobile number appears on the poster but is not part of the UPI payment URI.</p>
      </section>
      <section className="space-y-4">
        <div className="rounded-2xl border border-[var(--border)] bg-white p-5 text-center text-[#202020]" style={{ border: `10px solid ${color}` }}>
          {canGenerate && qr ? (
            <>
              <h2 className="break-words text-2xl font-extrabold">{name.trim()}</h2>
              {photo && <img src={photo} alt="Selected business or personal image" className="mx-auto mt-5 max-h-32 max-w-40 object-contain" />}
              <img src={qr} alt="Generated UPI payment QR code" className="mx-auto mt-5 w-full max-w-xs" />
              <p className="mt-3 text-lg font-bold">Scan to pay with UPI</p>
              <p className="mt-2 break-all font-medium">{upi.trim()}</p>
              {amount && validAmount && <p className="mt-2 font-bold">INR {Number(amount).toFixed(2)}</p>}
              {mobile && validMobile && <p className="mt-1 text-sm">Mobile: {mobile}</p>}
              {note && <p className="mt-1 break-words text-sm">{note}</p>}
              <p className="mt-8 text-right text-xs text-slate-500">Created with Navorika.com</p>
            </>
          ) : <p className="py-24 text-slate-600">Enter a name and valid UPI ID to preview your poster.</p>}
        </div>
        <div className="flex flex-wrap gap-3">
          <button type="button" disabled={!canGenerate || !qr || busy} onClick={() => void download('png')} className="rounded-xl bg-[#e5322d] px-5 py-3 font-bold text-white disabled:opacity-50">Download PNG poster</button>
          <button type="button" disabled={!canGenerate || !qr || busy} onClick={() => void download('pdf')} className="rounded-xl bg-[#e5322d] px-5 py-3 font-bold text-white disabled:opacity-50">Download PDF poster</button>
        </div>
        {error && <p role="alert" className="text-sm text-red-600">{error}</p>}
        <p className="text-sm text-[var(--muted-foreground)]">Test your QR with a UPI app before printing or sharing. This tool does not verify the UPI ID, accept payments, or confirm transactions.</p>
        <a href="/guides/how-to-generate-upi-qr-code" className="inline-block text-sm font-semibold text-[#e5322d] underline">Read the UPI QR code guide</a>
      </section>
    </div>
  );
}
