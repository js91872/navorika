#!/bin/bash

# List of PDF tools to update
tools=(
  "extract-pdf-text"
  "pdf-metadata-editor"
  "add-page-numbers"
  "add-watermark"
  "crop-pdf"
  "delete-pdf-pages"
  "flatten-pdf"
  "interleave-pdf"
  "protect-pdf"
  "reorder-pdf"
  "rotate-pdf"
  "sign-pdf"
  "unlock-pdf"
  "pdf-to-image"
  "pdf-to-jpg"
  "image-to-pdf"
  "jpg-to-pdf"
  "webp-to-pdf"
  "add-image-to-pdf"
)

for tool in "${tools[@]}"; do
  echo "Checking $tool..."
  
  # Check if the tool directory exists
  if [ ! -d "src/app/tools/$tool" ]; then
    echo "❌ $tool directory not found, skipping..."
    continue
  fi
  
  # Check if it already uses EnhancedToolWrapper
  if grep -q "EnhancedToolWrapper" "src/app/tools/$tool/page.tsx"; then
    echo "✅ $tool already uses EnhancedToolWrapper"
    continue
  fi
  
  # Find the component name
  COMPONENT_NAME=$(grep -o "export default function [A-Za-z]*" "src/app/tools/$tool/page.tsx" | head -1 | sed 's/export default function //')
  
  if [ -z "$COMPONENT_NAME" ]; then
    echo "❌ Could not find component name in $tool"
    continue
  fi
  
  echo "  Component: $COMPONENT_NAME"
  
  # Add imports
  sed -i "1s/^/import { tools } from '\/data\/registry';\nimport EnhancedToolWrapper from '\/components\/EnhancedToolWrapper';\n/" "src/app/tools/$tool/page.tsx"
  
  # Add wrapper at the end of the file
  cat >> "src/app/tools/$tool/page.tsx" << EOF

export default function ${COMPONENT_NAME}Wrapper() {
  const meta = tools.find(t => t.slug === '$tool');
  return (
    <EnhancedToolWrapper meta={meta}>
      <${COMPONENT_NAME} />
    </EnhancedToolWrapper>
  );
}
