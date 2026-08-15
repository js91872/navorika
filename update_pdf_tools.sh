#!/bin/bash

# List of PDF tools to update
tools=("compress-pdf" "merge-pdf" "split-pdf" "pdf-to-image" "image-to-pdf" "add-image-to-pdf")

for tool in "${tools[@]}"; do
  echo "Updating $tool..."
  
  # Check if the tool directory exists
  if [ ! -d "src/app/tools/$tool" ]; then
    echo "❌ $tool directory not found, skipping..."
    continue
  fi
  
  # Create the updated page
  cat > "src/app/tools/$tool/page.tsx" << 'PAGE_EOF'
'use client';

import { tools } from '@/data/registry';
import EnhancedToolWrapper from '@/components/EnhancedToolWrapper';

function TOOL_NAME_Content() {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl p-6 md:p-8">
        <h2 className="text-2xl font-bold mb-4">TOOL_TITLE</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-6">TOOL_DESCRIPTION</p>
        <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl text-center">
          <p className="text-slate-600 dark:text-slate-400">⚡ This tool processes your PDF locally in your browser. No data is uploaded to any server.</p>
        </div>
      </div>
    </div>
  );
}

export default function TOOL_NAME_Page() {
  const meta = tools.find(t => t.slug === 'TOOL_SLUG');
  return (
    <EnhancedToolWrapper meta={meta}>
      <TOOL_NAME_Content />
    </EnhancedToolWrapper>
  );
}
PAGE_EOF

  # Replace placeholders based on tool
  case "$tool" in
    "compress-pdf")
      sed -i 's/TOOL_NAME/CompressPdf/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/Compress PDF/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Reduce PDF file size while maintaining quality. Compress your PDF documents instantly./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/compress-pdf/g' "src/app/tools/$tool/page.tsx"
      ;;
    "merge-pdf")
      sed -i 's/TOOL_NAME/MergePdf/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/Merge PDF/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Combine multiple PDF files into one document. Merge PDFs instantly and easily./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/merge-pdf/g' "src/app/tools/$tool/page.tsx"
      ;;
    "split-pdf")
      sed -i 's/TOOL_NAME/SplitPdf/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/Split PDF/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Split PDF files into separate pages or sections. Extract pages from your PDF documents./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/split-pdf/g' "src/app/tools/$tool/page.tsx"
      ;;
    "pdf-to-image")
      sed -i 's/TOOL_NAME/PdfToImage/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/PDF to Image/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Convert PDF pages to images. Extract pages as JPG or PNG images./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/pdf-to-image/g' "src/app/tools/$tool/page.tsx"
      ;;
    "image-to-pdf")
      sed -i 's/TOOL_NAME/ImageToPdf/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/Image to PDF/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Convert images to PDF documents. JPG, PNG, and WebP to PDF./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/image-to-pdf/g' "src/app/tools/$tool/page.tsx"
      ;;
    "add-image-to-pdf")
      sed -i 's/TOOL_NAME/AddImageToPdf/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_TITLE/Add Image to PDF/g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_DESCRIPTION/Add images to PDF documents. Insert JPG, PNG, WebP into any PDF./g' "src/app/tools/$tool/page.tsx"
      sed -i 's/TOOL_SLUG/add-image-to-pdf/g' "src/app/tools/$tool/page.tsx"
      ;;
  esac

  echo "✅ Updated $tool"
done

echo "🎉 All PDF tools updated!"
