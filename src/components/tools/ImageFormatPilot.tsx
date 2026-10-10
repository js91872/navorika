'use client';
import { useState } from 'react';

type Mode = 'jfif-to-png' | 'webp-to-ico';
export default function ImageFormatPilot({ mode }: { mode: Mode }) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isIcon = mode === 'webp-to-ico';
  const convert = async () => {
    if (!file) return;
    setBusy(true); setError('');
    let url = '';
    try {
      url = URL.createObjectURL(file);
      const image = new Image();
      image.src = url;
      await image.decode();
      const canvas = document.createElement('canvas');
      const size = isIcon ? 64 : undefined;
      canvas.width = size ?? image.naturalWidth;
      canvas.height = size ?? image.naturalHeight;
      if (!canvas.width || !canvas.height || canvas.width * canvas.height > 25000000) throw new Error('This image is too large for browser conversion (maximum 25 megapixels).');
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas processing is unavailable.');
      if (isIcon) {
        const scale = Math.min(64 / image.naturalWidth, 64 / image.naturalHeight);
        const w = image.naturalWidth * scale, h = image.naturalHeight * scale;
        ctx.clearRect(0, 0, 64, 64);
        ctx.drawImage(image, (64 - w) / 2, (64 - h) / 2, w, h);
      } else ctx.drawImage(image, 0, 0);
      const png = await new Promise<Blob>((resolve, reject) => canvas.toBlob(b => b ? resolve(b) : reject(new Error('Could not encode PNG.')), 'image/png'));
      let output: Blob = png;
      if (isIcon) {
        const bytes = new Uint8Array(await png.arrayBuffer());
        const header = new ArrayBuffer(22);
        const view = new DataView(header);
        view.setUint16(2, 1, true); // one icon
        view.setUint8(6, 64); view.setUint8(7, 64);
        view.setUint16(10, 1, true); view.setUint16(12, 32, true);
        view.setUint32(14, bytes.length, true); view.setUint32(18, 22, true);
        output = new Blob([header, bytes], { type: 'image/x-icon' });
      }
      const downloadUrl = URL.createObjectURL(output);
      const a = document.createElement('a');
      a.href = downloadUrl;
      a.download = file.name.replace(/\.[^.]+$/, '') + (isIcon ? '.ico' : '.png');
      a.click();
      window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
    } catch (e) { setError(e instanceof Error ? e.message : 'Conversion failed.'); }
    finally { if (url) URL.revokeObjectURL(url); setBusy(false); }
  };
  return <div className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 sm:p-8 space-y-5">
    <label className="block font-semibold" htmlFor="image-file">Choose a {isIcon ? 'WebP' : 'JFIF'} file</label>
    <input id="image-file" className="block w-full" type="file" accept={isIcon ? '.webp,image/webp' : '.jfif,.jpeg,.jpg,image/jpeg'} onChange={e => {
      const selected = e.target.files?.[0] || null;
      if (preview) URL.revokeObjectURL(preview);
      if (selected && selected.size > 25 * 1024 * 1024) { setError('File must be under 25 MB.'); setFile(null); setPreview(''); return; }
      setFile(selected); setPreview(selected ? URL.createObjectURL(selected) : ''); setError('');
    }}/>
    {preview && <img alt="Selected file preview" src={preview} className="max-h-60 max-w-full rounded-lg object-contain"/>}
    {error && <p role="alert" className="text-red-600">{error}</p>}
    <button type="button" disabled={!file || busy} onClick={convert} className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white disabled:opacity-50">{busy ? 'Converting…' : isIcon ? 'Download ICO favicon' : 'Download PNG image'}</button>
    <p className="text-sm text-[var(--muted-foreground)]">{isIcon ? 'Produces a 64 × 64 PNG-encoded ICO favicon while preserving transparent areas.' : 'Converts supported JFIF/JPEG images to PNG without uploading the file.'} Processing happens in your browser.</p>
  </div>;
}