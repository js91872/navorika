export type FlexDirection = 'row' | 'row-reverse' | 'column' | 'column-reverse';
export type JustifyContent = 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around' | 'space-evenly';
export type AlignItems = 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'baseline';
export type FlexWrap = 'nowrap' | 'wrap' | 'wrap-reverse';

export interface FlexboxInput {
  flexDirection?: string;
  justifyContent?: string;
  alignItems?: string;
  flexWrap?: string;
  gap?: number | string;
}

export interface FlexboxResult {
  css: string;
  cssDeclarations: {
    display: string;
    flexDirection: FlexDirection;
    justifyContent: JustifyContent;
    alignItems: AlignItems;
    flexWrap: FlexWrap;
    gap: string;
  };
  flexDirection: FlexDirection;
  justifyContent: JustifyContent;
  alignItems: AlignItems;
  flexWrap: FlexWrap;
  gapPx: number;
  declarationCount: number;
}

const VALID_DIRECTIONS: readonly FlexDirection[] = ['row', 'row-reverse', 'column', 'column-reverse'] as const;
const VALID_JUSTIFY: readonly JustifyContent[] = ['flex-start', 'flex-end', 'center', 'space-between', 'space-around', 'space-evenly'] as const;
const VALID_ALIGN: readonly AlignItems[] = ['stretch', 'flex-start', 'flex-end', 'center', 'baseline'] as const;
const VALID_WRAP: readonly FlexWrap[] = ['nowrap', 'wrap', 'wrap-reverse'] as const;

export function generateFlexboxCss(input?: FlexboxInput): FlexboxResult {
  const rawDirection = input?.flexDirection as FlexDirection;
  const rawJustify = input?.justifyContent as JustifyContent;
  const rawAlign = input?.alignItems as AlignItems;
  const rawWrap = input?.flexWrap as FlexWrap;

  const flexDirection: FlexDirection = VALID_DIRECTIONS.includes(rawDirection) ? rawDirection : 'row';
  const justifyContent: JustifyContent = VALID_JUSTIFY.includes(rawJustify) ? rawJustify : 'flex-start';
  const alignItems: AlignItems = VALID_ALIGN.includes(rawAlign) ? rawAlign : 'stretch';
  const flexWrap: FlexWrap = VALID_WRAP.includes(rawWrap) ? rawWrap : 'nowrap';

  let rawGap = typeof input?.gap === 'string' ? parseFloat(input.gap) : (typeof input?.gap === 'number' ? input.gap : 16);
  if (!Number.isFinite(rawGap) || rawGap < 0) {
    rawGap = 0;
  }
  const gapPx = Math.min(Math.round(rawGap), 500);
  const gapString = `${gapPx}px`;

  const css = `.flex-container {
  display: flex;
  flex-direction: ${flexDirection};
  justify-content: ${justifyContent};
  align-items: ${alignItems};
  flex-wrap: ${flexWrap};
  gap: ${gapString};
}`;

  return {
    css,
    cssDeclarations: {
      display: 'flex',
      flexDirection,
      justifyContent,
      alignItems,
      flexWrap,
      gap: gapString,
    },
    flexDirection,
    justifyContent,
    alignItems,
    flexWrap,
    gapPx,
    declarationCount: 6,
  };
}
