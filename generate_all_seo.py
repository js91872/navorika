#!/usr/bin/env python3
"""
Generate SEO content for all 122 Navorika tools
This creates a complete seo-content.ts file with content for every tool
"""

import re
from pathlib import Path

# Read the registry to get all tool slugs
registry_path = Path('src/data/registry.ts')
if not registry_path.exists():
    print("❌ Registry file not found!")
    exit(1)

with open(registry_path, 'r') as f:
    content = f.read()

# Extract all tool slugs
tool_slugs = re.findall(r"slug:\s*'([^']*)'", content)
print(f"✅ Found {len(tool_slugs)} tools")

# Category mapping for default templates
category_map = {}
for i, slug in enumerate(tool_slugs):
    # Find the category for this slug
    category_pattern = rf"slug:\s*'{slug}'.*?category:\s*'([^']*)'"
    match = re.search(category_pattern, content, re.DOTALL)
    if match:
        category_map[slug] = match.group(1)
    else:
        category_map[slug] = 'unknown'

# Generate SEO content template
seo_template = '''/**
 * SEO Content for Navorika Tools
 * Auto-generated for all 122 tools
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

def generate_tool_seo(slug, category):
    """Generate SEO content for a single tool"""
    # Clean up the slug for display
    display_name = slug.replace('-', ' ').title()
    
    # Category-specific content
    category_configs = {
        'pdf-tools': {
            'schema_type': 'WebApplication',
            'app_category': 'UtilityApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no uploads',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant processing in your browser',
                'Supports all common PDF formats'
            ],
            'how_it_works': 'This tool processes your files entirely in your browser using WebAssembly technology. No files are uploaded to any server.',
            'tips': [
                'Always keep a backup of your original files',
                'Processing happens locally for maximum privacy',
                'Works offline once the page is loaded'
            ]
        },
        'image-tools': {
            'schema_type': 'WebApplication',
            'app_category': 'UtilityApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no uploads',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant processing in your browser',
                'Supports JPG, PNG, WebP, and more'
            ],
            'how_it_works': 'This tool processes your images entirely in your browser using Canvas API and WebAssembly. No files are uploaded to any server.',
            'tips': [
                'Higher quality images take longer to process',
                'Your images never leave your device',
                'Works offline once the page is loaded'
            ]
        },
        'health-calculators': {
            'schema_type': 'WebApplication',
            'app_category': 'HealthApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no data stored',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant calculations in your browser',
                'Based on validated health formulas'
            ],
            'how_it_works': 'This calculator processes your inputs entirely in your browser using validated health formulas. No data is stored or transmitted.',
            'tips': [
                'For accurate results, measure carefully',
                'Consult a healthcare professional for medical advice',
                'Results are for informational purposes only'
            ]
        },
        'finance-calculators': {
            'schema_type': 'WebApplication',
            'app_category': 'FinanceApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no data stored',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant calculations in your browser',
                'Accurate financial formulas'
            ],
            'how_it_works': 'This calculator processes your inputs entirely in your browser using standard financial formulas. No data is stored or transmitted.',
            'tips': [
                'Check your inputs carefully',
                'Results are estimates, not financial advice',
                'Consult a financial advisor for major decisions'
            ]
        },
        'developer-tools': {
            'schema_type': 'WebApplication',
            'app_category': 'DeveloperApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no uploads',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant processing in your browser',
                'Supports all common developer formats'
            ],
            'how_it_works': 'This tool processes your data entirely in your browser using JavaScript. No data is uploaded to any server.',
            'tips': [
                'Your data never leaves your device',
                'Processing happens instantly in your browser',
                'Works offline once the page is loaded'
            ]
        },
        'construction-calculators': {
            'schema_type': 'WebApplication',
            'app_category': 'UtilityApplication',
            'benefits': [
                '100% free - no hidden costs',
                'Private by design - no data stored',
                'Works on any device - no app required',
                'No signup or registration needed',
                'Instant calculations in your browser',
                'Accurate construction formulas'
            ],
            'how_it_works': 'This calculator processes your inputs entirely in your browser using standard construction formulas. No data is stored or transmitted.',
            'tips': [
                'Always add a margin for wastage',
                'Measure accurately for best results',
                'Results are estimates for planning purposes'
            ]
        }
    }
    
    # Get category config or use default
    config = category_configs.get(category, category_configs.get('pdf-tools'))
    
    # Generate FAQs (3-5 common questions)
    faqs = [
        {'question': f'What is {display_name}?', 'answer': f'{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} calculations and conversions quickly and easily.'},
        {'question': f'Is {display_name} really free?', 'answer': f'Yes, {display_name} is completely free to use with no hidden costs or premium plans.'},
        {'question': f'Is my data private with {display_name}?', 'answer': 'Yes, all processing happens locally in your browser. Your data never leaves your device.'},
        {'question': f'Do I need to create an account?', 'answer': 'No, you can use this tool instantly without any signup or registration.'},
        {'question': f'Does {display_name} work on mobile?', 'answer': 'Yes, this tool works on all devices including mobile phones, tablets, and desktops.'}
    ]
    
    # Determine related tools (based on category)
    related = []
    if category == 'health-calculators':
        related = ['bmi-calculator', 'bmr-calculator', 'tdee-calculator', 'body-fat-calculator', 'ideal-weight-calculator']
    elif category == 'pdf-tools':
        related = ['compress-pdf', 'merge-pdf', 'split-pdf', 'pdf-to-image', 'image-to-pdf']
    elif category == 'image-tools':
        related = ['resize-image', 'compress-image', 'convert-jpg-to-png', 'convert-png-to-webp', 'crop-image']
    elif category == 'finance-calculators':
        related = ['sip-calculator', 'loan-emi-calculator', 'gst-calculator', 'fd-calculator', 'tax-calculator']
    elif category == 'developer-tools':
        related = ['base64-encoder', 'jwt-base64-deck', 'qr-code-studio', 'universal-json-studio', 'web-crypto-studio']
    elif category == 'construction-calculators':
        related = ['concrete-calculator', 'brick-calculator', 'steel-weight-calculator', 'sand-calculator']
    else:
        related = []
    
    # Generate the SEO content
    return f"""
  '{slug}': {{
    metaTitle: '{display_name} - Free Online {display_name} | Navorika',
    metaDescription: 'Use our free {display_name} to get accurate results instantly. Fast, private, and no signup required.',
    intro: '{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} calculations and conversions quickly and accurately. Perfect for professionals, students, and anyone needing reliable results.',
    howItWorks: '{config["how_it_works"]}',
    benefits: {repr(config["benefits"])},
    useCases: [
      'Quick and accurate results',
      'Professional and personal use',
      'Educational and learning purposes',
      'Planning and decision making'
    ],
    stepByStep: [
      'Step 1: Enter your input values',
      'Step 2: Click the calculate/process button',
      'Step 3: Review your results instantly',
      'Step 4: Download or use your results'
    ],
    tips: {repr(config["tips"])},
    relatedTools: {repr(related)},
    faq: {repr(faqs)},
    schemaType: '{config["schema_type"]}',
    applicationCategory: '{config["app_category"]}',
    operatingSystem: 'All',
    browserRequirements: 'Modern browser with JavaScript enabled'
  }},"""

# Generate content for each tool
for slug in tool_slugs:
    category = category_map.get(slug, 'unknown')
    seo_template += generate_tool_seo(slug, category)

# Close the object
seo_template += """
};

export default seoContent;
"""

# Write the file
output_path = Path('src/data/seo-content.ts')
with open(output_path, 'w') as f:
    f.write(seo_template)

print(f"✅ SEO content generated for {len(tool_slugs)} tools")
print(f"📁 Saved to: {output_path}")
print(f"📊 File size: {output_path.stat().st_size / 1024:.1f} KB")
