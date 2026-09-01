export interface RasterVectorOptions { colors: 2 | 4 | 8; removeWhite: boolean; outputWidth: number; outputHeight: number }
const fullPalette = ['#000000','#ffffff','#ef4444','#3b82f6','#22c55e','#f59e0b','#a855f7','#64748b'];

export function vectorizeRgbaToSvg(pixels: Uint8ClampedArray, width: number, height: number, options: RasterVectorOptions) {
  if (width < 1 || height < 1 || pixels.length !== width * height * 4) throw new Error('Invalid raster pixel buffer.');
  const palette = fullPalette.slice(0, options.colors); const paletteRgb = palette.map((value) => value.match(/[0-9a-f]{2}/gi)!.map((part) => Number.parseInt(part, 16))); const runs: string[][] = palette.map(() => []);
  for (let y = 0; y < height; y += 1) { let start = 0; let current = -1; for (let x = 0; x <= width; x += 1) { let next = -1; if (x < width) { const index = (y * width + x) * 4; const alpha = pixels[index + 3]; const nearWhite = pixels[index] > 245 && pixels[index + 1] > 245 && pixels[index + 2] > 245; if (alpha > 20 && !(options.removeWhite && nearWhite)) { if (options.colors === 2) next = (pixels[index] * 0.299 + pixels[index + 1] * 0.587 + pixels[index + 2] * 0.114) > 150 ? 1 : 0; else { let best = Infinity; for (let p = 0; p < palette.length; p += 1) { const rgb = paletteRgb[p]; const distance = (pixels[index]-rgb[0])**2+(pixels[index+1]-rgb[1])**2+(pixels[index+2]-rgb[2])**2; if (distance < best) { best = distance; next = p; } } } } } if (next !== current) { if (current >= 0) runs[current].push(`M${start} ${y}h${x-start}v1H${start}z`); start = x; current = next; } } }
  const paths = runs.map((segments, index) => segments.length ? `<path fill="${palette[index]}" d="${segments.join('')}"/>` : '').join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${options.outputWidth}" height="${options.outputHeight}" viewBox="0 0 ${width} ${height}" shape-rendering="geometricPrecision">${paths}</svg>`;
}
