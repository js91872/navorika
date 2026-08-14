#!/usr/bin/env python3
import re
from pathlib import Path

# Read registry
print("📖 Reading registry...")
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# Extract all tool slugs (exclude category slugs)
category_slugs = ['pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']
all_slugs = re.findall(r"slug:\s*'([^']*)'", content)
tool_slugs = [s for s in all_slugs if s not in category_slugs]

# Remove duplicates
unique_slugs = list(dict.fromkeys(tool_slugs))
print(f"✅ Found {len(unique_slugs)} individual tools")

# Category mapping for related tools
category_map = {}
for slug in unique_slugs:
    match = re.search(rf"slug:\s*'{slug}'[^}}]*category:\s*'([^']*)'", content, re.DOTALL)
    if match:
        category_map[slug] = match.group(1)

# Related tools by category
related_map = {
    'health-calculators': ['bmr-calculator', 'tdee-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
    'pdf-tools': ['merge-pdf', 'split-pdf', 'pdf-to-image', 'image-to-pdf'],
    'image-tools': ['resize-image', 'compress-image', 'convert-jpg-to-png', 'crop-image'],
    'finance-calculators': ['sip-calculator', 'loan-emi-calculator', 'gst-calculator', 'fd-calculator'],
    'developer-tools': ['base64-encoder', 'jwt-base64-deck', 'qr-code-studio', 'universal-json-studio'],
    'construction-calculators': ['concrete-calculator', 'brick-calculator', 'steel-weight-calculator', 'sand-calculator']
}

def escape_str(s):
    return s.replace("'", "\\'")

print("📝 Generating SEO content...")

# Build the file
output_lines = []
output_lines.append('/**')
output_lines.append(' * SEO Content for Navorika Tools')
output_lines.append(' * Auto-generated for all individual tools')
output_lines.append(' */')
output_lines.append('')
output_lines.append('export interface SEOContent {')
output_lines.append('  metaTitle: string;')
output_lines.append('  metaDescription: string;')
output_lines.append('  intro: string;')
output_lines.append('  howItWorks: string;')
output_lines.append('  benefits: string[];')
output_lines.append('  useCases: string[];')
output_lines.append('  stepByStep: string[];')
output_lines.append('  tips: string[];')
output_lines.append('  relatedTools: string[];')
output_lines.append('  faq: Array<{ question: string; answer: string }>;')
output_lines.append('  schemaType: string;')
output_lines.append('  applicationCategory: string;')
output_lines.append('  operatingSystem: string;')
output_lines.append('  browserRequirements: string;')
output_lines.append('}')
output_lines.append('')
output_lines.append('export const seoContent: Record<string, SEOContent> = {')

for i, slug in enumerate(unique_slugs):
    display_name = slug.replace('-', ' ').title()
    comma = "," if i < len(unique_slugs) - 1 else ""
    
    category = category_map.get(slug, 'pdf-tools')
    related = [r for r in related_map.get(category, []) if r != slug]
    related_str = "[" + ", ".join([f"'{r}'" for r in related]) + "]"
    
    # Custom intro for specific tools
    if slug == 'bmi-calculator':
        intro = 'The Body Mass Index (BMI) is a widely recognized and scientifically validated measure of body fat based on your height and weight. It serves as an important screening tool to identify potential weight-related health issues in adults. Our free BMI calculator helps you determine your BMI score instantly and provides personalized health recommendations based on your results.'
    else:
        intro = f'{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} quickly and accurately. All processing happens locally in your browser - no data is stored or transmitted to any server.'
    
    output_lines.append(f"  '{slug}': {{")
    output_lines.append(f"    metaTitle: '{escape_str(display_name)} - Free Online {escape_str(display_name)} | Navorika',")
    output_lines.append(f"    metaDescription: 'Use our free {escape_str(display_name)} to get accurate results instantly. Fast, private, and no signup required.',")
    output_lines.append(f"    intro: '{escape_str(intro)}',")
    output_lines.append(f"    howItWorks: 'This tool processes your data entirely in your browser. No data is stored or transmitted.',")
    output_lines.append("    benefits: ['100% free - no hidden costs', 'Private by design - no data stored', 'Works on any device', 'No signup required', 'Instant processing', 'Based on validated formulas'],")
    output_lines.append("    useCases: ['Quick and accurate results', 'Professional and personal use', 'Educational purposes', 'Planning and decision making'],")
    output_lines.append("    stepByStep: ['Step 1: Enter your input values', 'Step 2: Click the calculate/process button', 'Step 3: Review your results instantly', 'Step 4: Download or use your results'],")
    output_lines.append("    tips: ['For accurate results, measure carefully', 'Processing happens locally for privacy', 'Works offline once loaded'],")
    output_lines.append(f"    relatedTools: {related_str},")
    output_lines.append("    faq: [")
    output_lines.append(f"      {{'question': 'What is {escape_str(display_name)}?', 'answer': '{escape_str(display_name)} is a free online tool that helps you with {slug.replace('-', ' ')} quickly and easily.'}},")
    output_lines.append(f"      {{'question': 'Is {escape_str(display_name)} really free?', 'answer': 'Yes, {escape_str(display_name)} is completely free to use with no hidden costs.'}},")
    output_lines.append("      {'question': 'Is my data private?', 'answer': 'Yes, all processing happens locally in your browser. Your data never leaves your device.'},")
    output_lines.append("      {'question': 'Do I need to sign up?', 'answer': 'No, you can use this tool instantly without any signup or registration.'},")
    output_lines.append("      {'question': 'Does it work on mobile?', 'answer': 'Yes, this tool works on all devices including mobile phones, tablets, and desktops.'}")
    output_lines.append("    ],")
    output_lines.append("    schemaType: 'WebApplication',")
    output_lines.append("    applicationCategory: 'UtilityApplication',")
    output_lines.append("    operatingSystem: 'All',")
    output_lines.append("    browserRequirements: 'Modern browser with JavaScript enabled'")
    output_lines.append(f"  }}{comma}")

output_lines.append("};")
output_lines.append("")
output_lines.append("export default seoContent;")

# Write the file
with open('src/data/seo-content.ts', 'w') as f:
    f.write("\n".join(output_lines))

print(f"✅ SEO content generated for {len(unique_slugs)} tools")
print(f"📁 File size: {Path('src/data/seo-content.ts').stat().st_size / 1024:.1f} KB")

# Verify
with open('src/data/seo-content.ts', 'r') as f:
    content = f.read()
    bmi_count = content.count("'bmi-calculator'")
    print(f"🔍 BMI calculator found: {bmi_count} times")
