#!/usr/bin/env python3
import re
from pathlib import Path

# Read the registry file
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# Find all tool slugs using regex
slugs = re.findall(r"slug:\s*'([^']*)'", content)
categories = re.findall(r"category:\s*'([^']*)'", content)

print(f"Found {len(slugs)} tools")
print(f"First 5 slugs: {slugs[:5]}")

# Create a basic seo-content.ts file
with open('src/data/seo-content.ts', 'w') as f:
    f.write("""/**
 * SEO Content for Navorika Tools
 * Auto-generated for all tools
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
""")

    # Generate content for each tool
    for slug in slugs:
        display_name = slug.replace('-', ' ').title()
        f.write(f"""
  '{slug}': {{
    metaTitle: '{display_name} - Free Online {display_name} | Navorika',
    metaDescription: 'Use our free {display_name} to get accurate results instantly. Fast, private, and no signup required.',
    intro: '{display_name} is a free online tool that helps you perform {slug.replace("-", " ")} quickly and accurately. Perfect for professionals, students, and anyone needing reliable results. All processing happens locally in your browser - no data is stored or transmitted to any server.',
    howItWorks: 'This tool processes your data entirely in your browser. No data is stored or transmitted.',
    benefits: ['100% free - no hidden costs', 'Private by design - no data stored', 'Works on any device - no app required', 'No signup or registration needed', 'Instant processing in your browser'],
    useCases: ['Quick and accurate results', 'Professional and personal use', 'Educational and learning purposes', 'Planning and decision making'],
    stepByStep: ['Step 1: Enter your input values', 'Step 2: Click the calculate/process button', 'Step 3: Review your results instantly', 'Step 4: Download or use your results'],
    tips: ['For accurate results, measure carefully', 'Processing happens locally for maximum privacy', 'Works offline once the page is loaded'],
    relatedTools: [],
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
  }},""")
    
    f.write("""
};

export default seoContent;
""")

print("✅ Created seo-content.ts with all tools")
