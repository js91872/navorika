export type PreflightStatus = 'confirmed' | 'review' | 'missing';

export interface CdrPrintReadinessInput {
  documentSize: PreflightStatus | string;
  bleed: PreflightStatus | string;
  colorMode: PreflightStatus | string;
  fonts: PreflightStatus | string;
  imageResolution: PreflightStatus | string;
  transparency: PreflightStatus | string;
  overprint: PreflightStatus | string;
  exportFormat?: PreflightStatus | string;
}

export interface CdrItemEvaluation {
  id: string;
  label: string;
  status: PreflightStatus;
  isCritical: boolean;
  notes: string;
}

export interface CdrPrintReadinessResult {
  valid: boolean;
  score: number;
  readinessRating: 'READY FOR PRINT' | 'REVIEW RECOMMENDED' | 'ACTION REQUIRED';
  passedCount: number;
  reviewCount: number;
  failedCount: number;
  criticalIssues: string[];
  reviewItems: string[];
  summaryText: string;
  checklist: CdrItemEvaluation[];
  [key: string]: any;
}

function normalizeStatus(val: unknown): PreflightStatus {
  if (typeof val !== 'string') return 'review';
  const clean = val.trim().toLowerCase();
  if (clean === 'confirmed' || clean === 'passed' || clean === 'yes' || clean === 'ok') return 'confirmed';
  if (clean === 'missing' || clean === 'failed' || clean === 'no') return 'missing';
  return 'review';
}

const itemMeta: Record<
  string,
  { label: string; isCritical: boolean; passNote: string; reviewNote: string; failNote: string }
> = {
  documentSize: {
    label: 'Document Dimensions',
    isCritical: true,
    passNote: 'Page size matches final print trim specifications.',
    reviewNote: 'Page size not verified against printer specs. Verify exact trimmed dimensions.',
    failNote: 'Document dimensions are incorrect or inconsistent with ordering specifications.',
  },
  bleed: {
    label: 'Bleed Allowance',
    isCritical: true,
    passNote: 'Bleed (typically 3mm / 0.125 in) configured with background artwork extending past trim.',
    reviewNote: 'Bleed is uncertain. Borderless or edge-to-edge prints will show white edges if cut shifts.',
    failNote: 'Bleed is missing. Edge-to-edge graphics will show white margins upon trimming.',
  },
  colorMode: {
    label: 'Color Space (CMYK)',
    isCritical: true,
    passNote: 'Document color palette is CMYK and spot inks are intentional.',
    reviewNote: 'Color palette may contain RGB elements. RGB colors will shift when converted on press.',
    failNote: 'Document is set to RGB. Significant color shifts will occur during CMYK color separation.',
  },
  fonts: {
    label: 'Fonts & Typography',
    isCritical: true,
    passNote: 'All fonts converted to curves (Ctrl+Q) or embedded in output PDF/X.',
    reviewNote: 'Live fonts remain in document. Risk of font substitution if service bureau lacks fonts.',
    failNote: 'Live fonts not converted or missing. High probability of text reflow and font substitution.',
  },
  imageResolution: {
    label: 'Raster Image Resolution',
    isCritical: true,
    passNote: 'All placed bitmap images are at least 300 DPI at final placement size.',
    reviewNote: 'Some images may be below 300 DPI (e.g. 150–299 DPI). Check for pixelation.',
    failNote: 'Low resolution images (<150 DPI) detected. Visible blur and pixelation will appear in print.',
  },
  transparency: {
    label: 'Transparency & Drop Shadows',
    isCritical: false,
    passNote: 'Corel lens, drop shadow, and transparency effects reviewed or flattened.',
    reviewNote: 'Live complex transparencies present. Verify how RIP handles Corel transparency blending.',
    failNote: 'Unflattened raster-vector transparencies risk unexpected rendering on older PostScript RIPs.',
  },
  overprint: {
    label: 'Black & White Overprint',
    isCritical: false,
    passNote: '100% K black set to overprint; white elements verified NOT set to overprint.',
    reviewNote: 'Overprint settings not audited. Accidental white overprint can cause white elements to vanish.',
    failNote: 'Overprint misconfiguration suspected. White objects set to overprint will disappear on press.',
  },
  exportFormat: {
    label: 'Export / Output File Format',
    isCritical: false,
    passNote: 'Targeting industry standard PDF/X-1a or PDF/X-4 rather than raw proprietary CDR.',
    reviewNote: 'Exporting as unconstrained PDF or sending native CDR. Confirm printer version compatibility.',
    failNote: 'Unverified export method. Sending mismatched CDR version often causes layer/font incompatibilities.',
  },
};

export function calculateCdrPrintReadiness(input: CdrPrintReadinessInput): CdrPrintReadinessResult {
  const keys = ['documentSize', 'bleed', 'colorMode', 'fonts', 'imageResolution', 'transparency', 'overprint'];
  if (input.exportFormat !== undefined) {
    keys.push('exportFormat');
  }

  const checklist: CdrItemEvaluation[] = [];
  const criticalIssues: string[] = [];
  const reviewItems: string[] = [];

  let passedCount = 0;
  let reviewCount = 0;
  let failedCount = 0;
  let earnedWeight = 0;
  let totalWeight = 0;

  for (const key of keys) {
    const rawVal = input[key as keyof CdrPrintReadinessInput];
    const status = normalizeStatus(rawVal);
    const meta = itemMeta[key] ?? {
      label: key,
      isCritical: false,
      passNote: 'Confirmed',
      reviewNote: 'Needs review',
      failNote: 'Missing',
    };

    const itemWeight = meta.isCritical ? 15 : 10;
    totalWeight += itemWeight;

    let notes = '';
    if (status === 'confirmed') {
      passedCount += 1;
      earnedWeight += itemWeight;
      notes = meta.passNote;
    } else if (status === 'review') {
      reviewCount += 1;
      earnedWeight += itemWeight * 0.4;
      notes = meta.reviewNote;
      reviewItems.push(`${meta.label}: ${meta.reviewNote}`);
    } else {
      failedCount += 1;
      notes = meta.failNote;
      if (meta.isCritical) {
        criticalIssues.push(`${meta.label}: ${meta.failNote}`);
      } else {
        reviewItems.push(`${meta.label}: ${meta.failNote}`);
      }
    }

    checklist.push({
      id: key,
      label: meta.label,
      status,
      isCritical: meta.isCritical,
      notes,
    });
  }

  const score = totalWeight > 0 ? Math.round((earnedWeight / totalWeight) * 100) : 0;

  let readinessRating: 'READY FOR PRINT' | 'REVIEW RECOMMENDED' | 'ACTION REQUIRED';
  if (criticalIssues.length > 0 || failedCount >= 2) {
    readinessRating = 'ACTION REQUIRED';
  } else if (reviewCount > 0 || failedCount > 0) {
    readinessRating = 'REVIEW RECOMMENDED';
  } else {
    readinessRating = 'READY FOR PRINT';
  }

  let summaryText = '';
  if (readinessRating === 'READY FOR PRINT') {
    summaryText = `All ${passedCount} verified preflight criteria satisfied (${score}/100 score). The document is ready for commercial print preparation or PDF/X export.`;
  } else if (readinessRating === 'REVIEW RECOMMENDED') {
    summaryText = `${reviewCount} item(s) require review (${score}/100 score). No critical showstoppers confirmed, but verifying uncertain items will prevent print defects.`;
  } else {
    summaryText = `Critical issues detected (${criticalIssues.length} critical item(s) missing or failed, score ${score}/100). Do not release to press without addressing red-flag items.`;
  }

  return {
    valid: true,
    score,
    readinessRating,
    passedCount,
    reviewCount,
    failedCount,
    criticalIssues,
    reviewItems,
    summaryText,
    checklist,
  };
}
