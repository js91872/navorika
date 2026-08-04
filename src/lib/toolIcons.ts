// Comprehensive icon mapping for all tools
export const toolIcons: Record<string, string> = {
  // PDF Tools
  'add-image-to-pdf': '📄',
  'add-page-numbers': '🔢',
  'add-watermark': '💧',
  'compress-pdf': '📦',
  'crop-pdf': '✂️',
  'delete-pdf-pages': '🗑️',
  'extract-pdf-pages': '📤',
  'extract-pdf-text': '📝',
  'flatten-pdf': '📋',
  'interleave-pdf': '🔄',
  'jpg-to-pdf': '🖼️',
  'merge-pdf': '📑',
  'pdf-metadata-editor': '🏷️',
  'pdf-to-image': '🖼️',
  'pdf-to-jpg': '🖼️',
  'pdf-tools': '📄',
  'protect-pdf': '🔒',
  'reorder-pdf': '🔀',
  'rotate-pdf': '🔄',
  'sign-pdf': '✍️',
  'split-pdf': '✂️',
  'unlock-pdf': '🔓',
  'webp-to-pdf': '🖼️',

  // Image Tools
  'batch-image-converter': '🔄',
  'blur-face': '🎭',
  'change-image-resolution': '📐',
  'color-extraction-studio': '🎨',
  'compress-image': '📦',
  'compress-jpg': '📦',
  'compress-png': '📦',
  'compress-webp': '📦',
  'convert-jpg-to-png': '🔄',
  'convert-jpg-to-webp': '🔄',
  'convert-png-to-jpg': '🔄',
  'convert-png-to-webp': '🔄',
  'convert-webp-to-jpg': '🔄',
  'crop-image': '✂️',
  'heic-to-jpg': '🔄',
  'heic-to-png': '🔄',
  'html-to-image': '🌐',
  'icon-sticker-maker': '🎯',
  'id-photo-maker': '🪪',
  'image-converter': '🔄',
  'image-dpi-converter': '📐',
  'image-metadata-viewer': '🏷️',
  'image-tools': '🖼️',
  'image-to-pdf': '🖼️',
  'meme-generator': '😂',
  'photo-collage-maker': '🖼️',
  'photo-editor': '✏️',
  'png-to-svg': '🔄',
  'resize-image': '📐',
  'rotate-image': '🔄',
  'social-media-resizer': '📱',
  'svg-to-png': '🔄',
  'upscale-image': '🔍',
  'watermark-image': '💧',
  'webp-to-png': '🔄',

  // Finance Calculators
  'cashflow-budget-architect': '💰',
  'fd-calculator': '🏦',
  'gst-calculator': '🧾',
  'investment-return-profiler': '📈',
  'loan-amortization-suite': '🏠',
  'ppf-calculator': '🏦',
  'savings-retirement-hub': '💰',
  'sip-calculator': '📊',
  'taxation-compliance-deck': '📋',
  'wealth-inflation-matrix': '📈',
  'currency-converter': '💱',
  'loan-emi-calculator': '🏠',
  'tax-calculator': '📋',

  // Health Calculators
  'bmi-calculator': '⚖️',
  'bmr-calculator': '🔥',
  'body-fat-calculator': '📊',
  'calorie-calculator': '🍎',
  'calories-burned-calculator': '🏃',
  'healthy-weight-calculator': '⚖️',
  'heart-rate-calculator': '❤️',
  'ideal-weight-calculator': '⚖️',
  'lean-body-mass-calculator': '💪',
  'running-calories-calculator': '🏃',
  'target-heart-rate-calculator': '❤️',
  'tdee-calculator': '🔥',
  'waist-to-height-ratio-calculator': '📏',
  'waist-to-hip-ratio-calculator': '📏',
  'walking-calories-calculator': '🚶',

  // Developer Tools
  'base64-encoder': '🔐',
  'code-minifier-beautifier': '💻',
  'developer-tools': '💻',
  'developer-utils': '🛠️',
  'jwt-base64-deck': '🔑',
  'markup-formatter': '📝',
  'universal-json-studio': '📋',
  'web-crypto-studio': '🔒',
  'webmaster-seo-builder': '🔍',
  'bioluminescent-reader': '🧬',
  'qr-code-studio': '📱',

  // Construction Calculators
  'construction-calculators': '🔨',

  // Retirement Calculators
  'retirement-calculator': '💰',
  'retirement-calculators': '💰',

  // Other
  'page.tsx': '📄',
};

export const getToolIcon = (slug: string): string => {
  // Check for exact match
  if (toolIcons[slug]) return toolIcons[slug];
  
  // Check for partial matches
  for (const [key, icon] of Object.entries(toolIcons)) {
    if (slug.includes(key)) return icon;
  }
  
  // Default fallback
  return '🔧';
};
