#!/usr/bin/env python3
import re

with open('src/data/seo-content.ts', 'r') as f:
    content = f.read()

# Find and fix the missing comma pattern
# Look for "},\n  'asphalt-calculator'" and replace with "},\n  'asphalt-calculator'"
# Actually, we need to find where the previous entry ends and add a comma

# Find asphalt-calculator entry
lines = content.split('\n')
for i, line in enumerate(lines):
    if "'asphalt-calculator':" in line and i > 0:
        # Check if the previous line has a comma
        prev_line = lines[i-1].strip()
        if prev_line.endswith('}') and not prev_line.endswith('},'):
            lines[i-1] = lines[i-1] + ','
            print(f"✅ Added comma at line {i-1}")
            break

# Write the fixed content
with open('src/data/seo-content.ts', 'w') as f:
    f.write('\n'.join(lines))

print("✅ Fixed seo-content.ts")
