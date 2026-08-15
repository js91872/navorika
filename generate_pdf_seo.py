#!/usr/bin/env python3
"""
Generate SEO content for missing PDF tools
"""

import re
from pathlib import Path

# Read the registry
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# Read existing seo-content
seo_path = Path('src/data/seo-content.ts')
with open(seo_path, 'r') as f:
    seo_content = f.read()

# List of PDF tools that need SEO content
pdf_tools = [
    'extract-pdf-pages',
    'extract-pdf-text',
    'pdf-metadata-editor',
    'add-page-numbers',
    'add-watermark',
    'crop-pdf',
    'delete-pdf-pages',
    'flatten-pdf',
    'interleave-pdf',
    'protect-pdf',
    'reorder-pdf',
    'rotate-pdf',
    'sign-pdf',
    'unlock-pdf',
    'pdf-to-image',
    'pdf-to-jpg',
    'image-to-pdf',
    'jpg-to-pdf',
    'webp-to-pdf',
    'add-image-to-pdf'
]

# Get existing tools with SEO
existing_tools = re.findall(r"'([^']+)':\s*{", seo_content)

# Find missing tools
missing_tools = [t for t in pdf_tools if t not in existing_tools]

print(f"📋 Missing PDF tools: {len(missing_tools)}")

if not missing_tools:
    print("🎉 All PDF tools have SEO content!")
    exit()

# Category mapping for related tools
related_map = {
    'pdf-tools': ['merge-pdf', 'split-pdf', 'compress-pdf', 'pdf-to-image', 'image-to-pdf']
}

def escape_string(s):
    return s.replace("'", "\\'").replace('"', '\\"')

# Build entries for missing tools
entries = []
for slug in missing_tools:
    display_name = slug.replace('-', ' ').title()
    category = 'pdf-tools'
    related = related_map.get(category, [])
    related = [r for r in related if r != slug]
    related_str = "[" + ", ".join([f"'{r}'" for r in related]) + "]"
    
    # Custom descriptions based on tool
    descriptions = {
        'extract-pdf-pages': 'Extract specific pages from PDF documents. Split and save individual pages.',
        'extract-pdf-text': 'Extract text content from PDF files. Get all text from your PDF documents.',
        'pdf-metadata-editor': 'View and edit PDF metadata including title, author, subject, and keywords.',
        'add-page-numbers': 'Add page numbers to PDF documents. Customize position and format.',
        'add-watermark': 'Add text or image watermarks to PDF files. Protect your documents.',
        'crop-pdf': 'Crop PDF pages to remove unwanted margins or content.',
        'delete-pdf-pages': 'Delete specific pages from PDF documents. Remove unwanted pages.',
        'flatten-pdf': 'Flatten PDF files to make content uneditable. Secure your documents.',
        'interleave-pdf': 'Interleave two PDF files page by page. Combine documents alternately.',
        'protect-pdf': 'Add password protection to PDF files. Secure your documents.',
        'reorder-pdf': 'Reorder PDF pages. Arrange pages in any order you want.',
        'rotate-pdf': 'Rotate PDF pages. Change page orientation as needed.',
        'sign-pdf': 'Add digital signatures to PDF documents. Sign your PDFs electronically.',
        'unlock-pdf': 'Remove password protection from PDF files. Unlock secured PDFs.',
        'pdf-to-image': 'Convert PDF pages to images. Extract pages as JPG or PNG.',
        'pdf-to-jpg': 'Convert PDF pages to JPG images. High-quality image extraction.',
        'image-to-pdf': 'Convert images to PDF documents. JPG, PNG, WebP to PDF.',
        'jpg-to-pdf': 'Convert JPG images to PDF. Create PDFs from images.',
        'webp-to-pdf': 'Convert WebP images to PDF. Modern image format to PDF.',
        'add-image-to-pdf': 'Add images to PDF documents. Insert JPG, PNG, WebP into PDF.'
    }
    
    description = descriptions.get(slug, f'Free online tool for {slug.replace("-", " ")}. Fast, private, and no signup required.')
    
    intro = f'{display_name} is a free online PDF tool that helps you with {slug.replace("-", " ")}. Perfect for professionals, students, and anyone working with PDF documents. All processing happens locally in your browser - no data is stored or transmitted to any server.'
    
    faqs = [
        f"{{'question': 'What is {display_name}?', 'answer': '{display_name} is a free online PDF tool that helps you with {slug.replace('-', ' ')} quickly and easily.'}}",
        f"{{'question': 'Is {display_name} really free?', 'answer': 'Yes, {display_name} is completely free to use with no hidden costs.'}}",
        "{'question': 'Is my data private?', 'answer': 'Yes, all processing happens locally in your browser. Your data never leaves your device.'}",
        "{'question': 'Do I need to sign up?', 'answer': 'No, you can use this tool instantly without any signup or registration.'}",
        "{'question': 'Does it work on mobile?', 'answer': 'Yes, this tool works on all devices including mobile phones, tablets, and desktops.'}"
    ]
    faq_str = "[\n      " + ",\n      ".join(faqs) + "\n    ]"
    
    entry = f"""
  '{slug}': {{
    metaTitle: '{display_name} - Free Online {display_name} | Navorika',
    metaDescription: 'Use our free {display_name} to get accurate results instantly. Fast, private, and no signup required.',
    intro: '{escape_string(intro)}',
    howItWorks: 'This tool processes your PDF data entirely in your browser. No files are uploaded to any server.',
    benefits: ['100% free - no hidden costs', 'Private by design - no uploads', 'Works on any device', 'No signup required', 'Instant processing in your browser', 'Supports all common PDF formats'],
    useCases: ['Quick and accurate PDF processing', 'Professional and personal use', 'Educational purposes', 'Document management'],
    stepByStep: ['Step 1: Upload your PDF file', 'Step 2: Choose your settings', 'Step 3: Click the process button', 'Step 4: Download your result'],
    tips: ['Your files never leave your device', 'Processing happens locally for privacy', 'Works offline once loaded'],
    relatedTools: {related_str},
    faq: {faq_str},
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Modern browser with JavaScript enabled'
  }},"""
    entries.append(entry)

# Insert entries before the final closing brace
insert_pos = seo_content.rfind('};')
if insert_pos == -1:
    print("❌ Could not find closing brace")
    exit()

new_seo = seo_content[:insert_pos] + "\n" + "\n".join(entries) + "\n" + seo_content[insert_pos:]

# Write the file
with open('src/data/seo-content.ts', 'w') as f:
    f.write(new_seo)

print(f"✅ Added SEO content for {len(missing_tools)} PDF tools")
print(f"📁 Total tools with SEO content: {len(re.findall(r"'([^']+)':\s*{", new_seo))}")
