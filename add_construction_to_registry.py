#!/usr/bin/env python3
"""
Add all construction tools to the registry
"""

import re
from pathlib import Path

# Read the registry
with open('src/data/registry.ts', 'r') as f:
    content = f.read()

# List of all construction tools to add
construction_tools = [
    'asphalt-calculator',
    'brick-calculator',
    'cement-calculator',
    'concrete-calculator',
    'construction-cost-calculator',
    'excavation-calculator',
    'flooring-calculator',
    'gravel-calculator',
    'house-construction-cost-calculator',
    'land-area-converter',
    'paint-calculator',
    'rebar-calculator',
    'roof-area-calculator',
    'sand-calculator',
    'solar-panel-calculator',
    'steel-weight-calculator',
    'tile-calculator',
    'voltage-drop-calculator',
    'water-tank-calculator',
    'wire-size-calculator'
]

# Check which ones are already in the registry
existing = []
for tool in construction_tools:
    if f"slug: '{tool}'" in content:
        existing.append(tool)

print(f"✅ Already in registry: {len(existing)}")
print(f"📋 Missing: {len(construction_tools) - len(existing)}")

missing = [t for t in construction_tools if t not in existing]

if not missing:
    print("🎉 All construction tools are already in the registry!")
    exit()

print(f"🔧 Adding {len(missing)} tools to registry...")

# Find the insertion point (before the closing bracket of the tools array)
# Look for the last tool in the registry
last_tool_match = re.search(r"slug:\s*'([^']*)'[^}]*\n  \}\n\];", content, re.DOTALL)
if not last_tool_match:
    print("❌ Could not find the end of the tools array")
    exit()

# Generate entries for missing tools
entries = []
for slug in missing:
    display_name = slug.replace('-', ' ').title()
    entries.append(f'''
  {{
    slug: '{slug}',
    title: '{display_name}',
    description: 'Calculate {slug.replace("-", " ")} for your construction project. Free, private, and no signup required.',
    category: 'construction-calculators',
    keywords: ['{slug}', 'construction', 'calculator', 'building'],
    heroTitle: '{display_name}',
    heroDescription: 'Calculate {slug.replace("-", " ")} quickly and accurately. Private, fast, and no signup required.'
  }},''')

# Insert before the closing bracket
# Remove the closing bracket, add entries, then add it back
content = content.replace('];', '')
content = content.rstrip()
content += '\n'.join(entries)
content += '\n];'

# Write the file
with open('src/data/registry.ts', 'w') as f:
    f.write(content)

print(f"✅ Added {len(missing)} construction tools to registry")
print("🔍 Total construction tools should now be 20")
