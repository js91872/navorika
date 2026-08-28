export async function decodeWebpToPng(file: File): Promise<ArrayBuffer> {
  if (file.type !== 'image/webp') throw new Error('A WebP image is required.');
  if (typeof createImageBitmap !== 'function') throw new Error('Image decoding is unavailable.');
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  try {
    if (bitmap.width < 1 || bitmap.height < 1) throw new Error('The image has invalid dimensions.');
    const canvas = document.createElement('canvas');
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Canvas is unavailable.');
    context.drawImage(bitmap, 0, 0);
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png'));
    if (!blob || blob.type !== 'image/png') throw new Error('The WebP image could not be decoded.');
    return blob.arrayBuffer();
  } finally {
    bitmap.close();
  }
}
