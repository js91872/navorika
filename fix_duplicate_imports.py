#!/usr/bin/env python3
"""
Remove duplicate imports of tools from all tool pages
"""

import re
from pathlib import Path

# Get all tool directories
tool_dirs = [d for d in Path('src/app/tools').iterdir() if d.is_dir() and (d / 'page.tsx').exists()]

# Skip categories
skip_slugs = ['tools', 'pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']
tool_dirs = [d for d in tool_dirs if d.name not in skip_slugs]

print(f"Found {len(tool_dirs)} tool directories")

fixed = 0
for tool_dir in tool_dirs:
    file_path = tool_dir / 'page.tsx'
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if there are duplicate imports
    imports = re.findall(r"import\s*\{[^}]*tools[^}]*\}\s*from\s*['\"]@/data/registry['\"]", content)
    
    if len(imports) <= 1:
        continue
    
    print(f"\n📝 Fixing: {tool_dir.name}")
    
    # Keep only the first import, remove duplicates
    lines = content.split('\n')
    new_lines = []
    seen_imports = set()
    
    for line in lines:
        # Check if this is a tools import
        if "from '@/data/registry'" in line or 'from "@/data/registry"' in line:
            # Normalize the line for comparison
            norm_line = line.strip()
            if norm_line not in seen_imports:
                seen_imports.add(norm_line)
                new_lines.append(line)
            else:
                print(f"  Removed duplicate import: {line.strip()}")
        else:
            new_lines.append(line)
    
    content = '\n'.join(new_lines)
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    fixed += 1

print(f"\n✅ Fixed {fixed} files")
