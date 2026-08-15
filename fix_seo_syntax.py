#!/usr/bin/env python3
"""
Fix syntax errors in seo-content.ts
"""

with open('src/data/seo-content.ts', 'r') as f:
    content = f.read()

# Find the asphalt-calculator entry and ensure there's a comma before it
# Check for pattern: }\n  'asphalt-calculator'
import re

# Replace patterns where there's no comma before a new entry
content = re.sub(r'(\n  \})\n  \'([a-z-]+)\':', r'\1,\n  \'\2\':', content)

# Write the fixed file
with open('src/data/seo-content.ts', 'w') as f:
    f.write(content)

print("✅ Fixed seo-content.ts")
