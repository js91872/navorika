export function aspectRatio(width: number, height: number) {
  if (![width, height].every((value) => Number.isFinite(value) && value > 0 && value <= 1e9)) return null;
  return { padding: height / width * 100, ratio: width / height, megapixels: width * height / 1e6, pixels: width * height };
}
export function printDimensions(width: number, height: number, bleed: number) {
  if (!aspectRatio(width, height) || !Number.isFinite(bleed) || bleed < 0 || bleed > 1e6) return null;
  return { width: width + 2 * bleed, height: height + 2 * bleed };
}
export function flexCss(direction: string, justify: string, align: string, wrap: string, gap: number) {
  const valid = ['row', 'column', 'row-reverse', 'column-reverse'].includes(direction)
    && ['flex-start', 'center', 'flex-end', 'space-between', 'space-around', 'space-evenly'].includes(justify)
    && ['stretch', 'flex-start', 'center', 'flex-end', 'baseline'].includes(align)
    && ['nowrap', 'wrap', 'wrap-reverse'].includes(wrap)
    && Number.isFinite(gap) && gap >= 0 && gap <= 200;
  if (!valid) return null;
  return `.container {\n  display: flex;\n  flex-direction: ${direction};\n  justify-content: ${justify};\n  align-items: ${align};\n  flex-wrap: ${wrap};\n  gap: ${gap}px;\n}`;
}
