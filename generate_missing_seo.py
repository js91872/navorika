#!/usr/bin/env python3
"""
Generate SEO content for all tools missing it
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

# Extract all tool slugs (exclude category slugs)
category_slugs = ['pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']
all_slugs = re.findall(r"slug:\s*'([^']*)'", content)
tool_slugs = [s for s in all_slugs if s not in category_slugs]
unique_slugs = list(dict.fromkeys(tool_slugs))

# Extract tools with SEO content
existing_tools = re.findall(r"'([^']+)':\s*{", seo_content)

# Find missing tools
missing_tools = [s for s in unique_slugs if s not in existing_tools]

print(f"✅ Total tools: {len(unique_slugs)}")
print(f"📋 Tools with SEO: {len(existing_tools)}")
print(f"🔧 Missing tools: {len(missing_tools)}")

if not missing_tools:
    print("🎉 All tools have SEO content!")
    exit()

print(f"\n📝 Adding {len(missing_tools)} missing tools...")

# Category mapping for related tools
category_map = {}
for slug in unique_slugs:
    match = re.search(rf"slug:\s*'{slug}'[^}}]*category:\s*'([^']*)'", content, re.DOTALL)
    if match:
        category_map[slug] = match.group(1)

related_map = {
    'health-calculators': ['bmr-calculator', 'tdee-calculator', 'body-fat-calculator', 'ideal-weight-calculator'],
    'pdf-tools': ['merge-pdf', 'split-pdf', 'pdf-to-image', 'image-to-pdf'],
    'image-tools': ['resize-image', 'compress-image', 'convert-jpg-to-png', 'crop-image'],
    'finance-calculators': ['sip-calculator', 'loan-emi-calculator', 'gst-calculator', 'fd-calculator'],
    'developer-tools': ['base64-encoder', 'jwt-base64-deck', 'qr-code-studio', 'universal-json-studio'],
    'construction-calculators': ['concrete-calculator', 'brick-calculator', 'steel-weight-calculator', 'sand-calculator', 'rebar-calculator', 'construction-cost-calculator']
}

def escape_string(s):
    return s.replace("'", "\\'").replace('"', '\\"')

# Build entries for missing tools
entries = []
for slug in missing_tools:
    display_name = slug.replace('-', ' ').title()
    category = category_map.get(slug, 'pdf-tools')
    related = related_map.get(category, [])
    related = [r for r in related if r != slug]
    related_str = "[" + ", ".join([f"'{r}'" for r in related]) + "]"
    
    # Create intro
    intro = f'{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} quickly and accurately. All processing happens locally in your browser - no data is stored or transmitted to any server.'
    
    # Create FAQs
    faqs = [
        f"{{'question': 'What is {display_name}?', 'answer': '{display_name} is a free online tool that helps you with {slug.replace('-', ' ')} quickly and easily.'}}",
        f"{{'question': 'Is {display_name} really free?', 'answer': 'Yes, {display_name} is completely free to use with no hidden costs.'}}",
        "{'question': 'Is my data private?', 'answer': 'Yes, all processing happens locally in your browser. Your data never leaves your device.'}",
        "{'question': 'Do I need to sign up?', 'answer': 'No, you can use this tool instantly without any signup or registration.'}",
        "{'question': 'Does it work on mobile?', 'answer': 'Yes, this tool works on all devices including mobile phones, tablets, and desktops.'}"
    ]
    faq_str = "[\n      " + ",\n      ".join(faqs) + "\n    ]"
    
    # Get category for better intro
    if category == 'construction-calculators':
        intro = f'{display_name} is a free online construction calculator that helps you with {slug.replace("-", " ")}. Perfect for contractors, builders, and DIY enthusiasts. All calculations happen locally in your browser - no data is stored or transmitted to any server.'
    
    entry = f"""
  '{slug}': {{
    metaTitle: '{display_name} - Free Online {display_name} | Navorika',
    metaDescription: 'Use our free {display_name} to get accurate results instantly. Fast, private, and no signup required.',
    intro: '{escape_string(intro)}',
    howItWorks: 'This tool processes your data entirely in your browser. No data is stored or transmitted.',
    benefits: ['100% free - no hidden costs', 'Private by design - no data stored', 'Works on any device', 'No signup required', 'Instant processing', 'Based on validated formulas'],
    useCases: ['Quick and accurate results', 'Professional and personal use', 'Educational purposes', 'Planning and decision making'],
    stepByStep: ['Step 1: Enter your input values', 'Step 2: Click the calculate/process button', 'Step 3: Review your results instantly', 'Step 4: Download or use your results'],
    tips: ['For accurate results, measure carefully', 'Processing happens locally for privacy', 'Works offline once loaded'],
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

print(f"✅ Added SEO content for {len(missing_tools)} tools")
print(f"📁 Total tools with SEO content: {len(existing_tools) + len(missing_tools)}")

# Verify
with open('src/data/seo-content.ts', 'r') as f:
    content = f.read()
    count = len(re.findall(r"'([^']+)':\s*{", content))
    print(f"🔍 Verification: {count} tools now have SEO content")
