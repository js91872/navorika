#!/usr/bin/env python3
"""
Fix SEO content to use individual tool slugs instead of categories
"""

import re
from pathlib import Path

# Read the registry
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# Extract all tool slugs (individual tools)
tool_slugs = re.findall(r"slug:\s*'([^']*)'", content)

# Remove duplicates while preserving order
seen = set()
unique_slugs = []
for slug in tool_slugs:
    if slug not in seen:
        seen.add(slug)
        unique_slugs.append(slug)

print(f"✅ Found {len(unique_slugs)} individual tools")

# Generate SEO content for each individual tool
output = '''/**
 * SEO Content for Navorika Tools
 * Auto-generated for all individual tools
 */

export interface SEOContent {
  metaTitle: string;
  metaDescription: string;
  intro: string;
  howItWorks: string;
  benefits: string[];
  useCases: string[];
  stepByStep: string[];
  tips: string[];
  relatedTools: string[];
  faq: Array<{ question: string; answer: string }>;
  schemaType: string;
  applicationCategory: string;
  operatingSystem: string;
  browserRequirements: string;
}

export const seoContent: Record<string, SEOContent> = {
'''

# Generate content for each tool
for slug in unique_slugs:
    display_name = slug.replace('-', ' ').title()
    # Get category for related tools
    category_match = re.search(rf"slug:\s*'{slug}'[^}}]*category:\s*'([^']*)'", content, re.DOTALL)
    category = category_match.group(1) if category_match else 'pdf-tools'
    
    # Related tools based on category
    related_map = {
        'health-calculators': ['bmi-calculator', 'bmr-calculator', 'tdee-calculator', 'body-fat-calculator'],
        'pdf-tools': ['compress-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-image'],
        'image-tools': ['resize-image', 'compress-image', 'convert-jpg-to-png', 'crop-image'],
        'finance-calculators': ['sip-calculator', 'loan-emi-calculator', 'gst-calculator', 'fd-calculator'],
        'developer-tools': ['base64-encoder', 'jwt-base64-deck', 'qr-code-studio', 'universal-json-studio'],
        'construction-calculators': ['concrete-calculator', 'brick-calculator', 'steel-weight-calculator', 'sand-calculator']
    }
    related = related_map.get(category, [])
    related_str = "[" + ", ".join([f"'{r}'" for r in related]) + "]"
    
    output += f'''
  '{slug}': {{
    metaTitle: '{display_name} - Free Online {display_name} | Navorika',
    metaDescription: 'Use our free {display_name} to get accurate results instantly. Fast, private, and no signup required.',
    intro: '{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} quickly and accurately. Perfect for professionals, students, and anyone needing reliable results. All processing happens locally in your browser - no data is stored or transmitted to any server.',
    howItWorks: 'This tool processes your data entirely in your browser. No data is stored or transmitted.',
    benefits: ['100% free - no hidden costs', 'Private by design - no data stored', 'Works on any device - no app required', 'No signup or registration needed', 'Instant processing in your browser'],
    useCases: ['Quick and accurate results', 'Professional and personal use', 'Educational and learning purposes', 'Planning and decision making'],
    stepByStep: ['Step 1: Enter your input values', 'Step 2: Click the calculate/process button', 'Step 3: Review your results instantly', 'Step 4: Download or use your results'],
    tips: ['For accurate results, measure carefully', 'Processing happens locally for maximum privacy', 'Works offline once the page is loaded'],
    relatedTools: {related_str},
    faq: [
      {{'question': 'What is {display_name}?', 'answer': '{display_name} is a free online tool that helps you with {slug.replace("-", " ")} quickly and easily.'}},
      {{'question': 'Is {display_name} really free?', 'answer': 'Yes, {display_name} is completely free to use with no hidden costs or premium plans.'}},
      {{'question': 'Is my data private with this tool?', 'answer': 'Yes, all processing happens locally in your browser. Your data never leaves your device.'}},
      {{'question': 'Do I need to create an account?', 'answer': 'No, you can use this tool instantly without any signup or registration.'}},
      {{'question': 'Does this tool work on mobile?', 'answer': 'Yes, this tool works on all devices including mobile phones, tablets, and desktops.'}}
    ],
    schemaType: 'WebApplication',
    applicationCategory: 'UtilityApplication',
    operatingSystem: 'All',
    browserRequirements: 'Modern browser with JavaScript enabled'
  }},'''

output += '''
};

export default seoContent;
'''

# Write the file
with open('src/data/seo-content.ts', 'w') as f:
    f.write(output)

print(f"✅ SEO content generated for {len(unique_slugs)} individual tools")
print(f"📁 Saved to: src/data/seo-content.ts")
