#!/usr/bin/env python3

with open('src/data/seo-content.ts', 'r') as f:
    content = f.read()

# Find the pattern: }\n\n  'asphalt-calculator'
# Replace with: },\n\n  'asphalt-calculator'
content = content.replace("}\n\n  'asphalt-calculator':", "},\n\n  'asphalt-calculator':")

# Also handle the case with single newline
content = content.replace("}\n  'asphalt-calculator':", "},\n  'asphalt-calculator':")

with open('src/data/seo-content.ts', 'w') as f:
    f.write(content)

print("✅ Fixed missing comma before asphalt-calculator")
