#!/bin/bash

# List of all tools that need wrapping
tools=(
  "add-image-to-pdf"
  "add-page-numbers"
  "add-watermark"
  "base64-encoder"
  "batch-image-converter"
  "bioluminescent-reader"
  "bmr-calculator"
  "body-fat-calculator"
  "calorie-calculator"
  "calories-burned-calculator"
  "cashflow-budget-architect"
  "change-image-resolution"
  "code-minifier-beautifier"
  "color-extraction-studio"
  "compress-image"
  "compress-jpg"
  "compress-png"
  "compress-webp"
  "concrete-calculator"
  "convert-jpg-to-png"
  "convert-jpg-to-webp"
  "convert-png-to-jpg"
  "convert-png-to-webp"
  "convert-webp-to-jpg"
  "crop-image"
  "crop-pdf"
  "currency-converter"
  "delete-pdf-pages"
  "developer-utilities"
  "developer-utils"
  "extract-pdf-text"
  "fd-calculator"
  "flatten-pdf"
  "gst-calculator"
  "healthy-weight-calculator"
  "heart-rate-calculator"
  "heic-to-jpg"
  "heic-to-png"
  "html-to-image"
  "icon-sticker-maker"
  "ideal-weight-calculator"
  "id-photo-maker"
  "image-converter"
  "image-dpi-converter"
  "image-metadata-viewer"
  "image-to-pdf"
  "interleave-pdf"
  "investment-return-profiler"
  "jpg-to-pdf"
  "jwt-base64-deck"
  "lean-body-mass-calculator"
  "loan-amortization-suite"
  "loan-emi-calculator"
  "markup-formatter"
  "meme-generator"
  "merge-pdf"
  "pdf-metadata-editor"
  "pdf-to-image"
  "pdf-to-jpg"
  "photo-collage-maker"
  "photo-editor"
  "png-to-svg"
  "ppf-calculator"
  "protect-pdf"
  "qr-code-studio"
  "reorder-pdf"
  "resize-image"
  "retirement-calculator"
  "rotate-image"
  "rotate-pdf"
  "running-calories-calculator"
  "savings-retirement-hub"
  "sign-pdf"
  "sip-calculator"
  "social-media-resizer"
  "split-pdf"
  "svg-to-png"
  "target-heart-rate-calculator"
  "taxation-compliance-deck"
  "tax-calculator"
  "tdee-calculator"
  "universal-json-studio"
  "unlock-pdf"
  "upscale-image"
  "waist-to-height-ratio-calculator"
  "waist-to-hip-ratio-calculator"
  "walking-calories-calculator"
  "watermark-image"
  "wealth-inflation-matrix"
  "web-crypto-studio"
  "webmaster-seo-builder"
  "webp-to-pdf"
  "webp-to-png"
)

for tool in "${tools[@]}"; do
  echo "Processing: $tool"
  
  # Check if the file exists
  if [ ! -f "src/app/tools/$tool/page.tsx" ]; then
    echo "⚠️ File not found: $tool"
    continue
  fi
  
  # Check if it already has EnhancedToolWrapper
  if grep -q "EnhancedToolWrapper" "src/app/tools/$tool/page.tsx"; then
    echo "✅ Already wrapped: $tool"
    continue
  fi
  
  # Find the component name
  COMPONENT_NAME=$(grep -o "export default function [A-Za-z]*" "src/app/tools/$tool/page.tsx" | head -1 | sed 's/export default function //')
  
  if [ -z "$COMPONENT_NAME" ]; then
    # Try alternative pattern
    COMPONENT_NAME=$(grep -o "export default [A-Za-z]*" "src/app/tools/$tool/page.tsx" | head -1 | sed 's/export default //')
  fi
  
  if [ -z "$COMPONENT_NAME" ]; then
    echo "❌ Could not find component name in $tool"
    continue
  fi
  
  echo "  Component: $COMPONENT_NAME"
  
  # Check if imports already exist
  if ! grep -q "from '@/data/registry'" "src/app/tools/$tool/page.tsx"; then
    # Add imports after 'use client'
    sed -i "/'use client';/a import { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';" "src/app/tools/$tool/page.tsx"
  fi
  
  # Remove any existing export default at the end
  sed -i '/^export default/d' "src/app/tools/$tool/page.tsx"
  
  # Add the wrapper
  cat >> "src/app/tools/$tool/page.tsx" << EOF

export default function ${COMPONENT_NAME}Wrapper() {
  const meta = tools.find(t => t.slug === '$tool');
  return (
    <EnhancedToolWrapper meta={meta}>
      <${COMPONENT_NAME} />
    </EnhancedToolWrapper>
  );
}
