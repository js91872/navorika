#!/usr/bin/env python3
"""
Remove duplicate EnhancedToolWrapper imports from all tool pages
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
        lines = f.readlines()
    
    # Check for duplicate EnhancedToolWrapper imports
    etw_imports = []
    for i, line in enumerate(lines):
        if 'EnhancedToolWrapper' in line and 'import' in line:
            etw_imports.append(i)
    
    if len(etw_imports) <= 1:
        continue
    
    print(f"\n📝 Fixing: {tool_dir.name} ({len(etw_imports)} imports)")
    
    # Keep only the first import, remove others
    new_lines = []
    etw_import_count = 0
    
    for line in lines:
        if 'EnhancedToolWrapper' in line and 'import' in line:
            etw_import_count += 1
            if etw_import_count == 1:
                new_lines.append(line)
            else:
                print(f"  Removed duplicate import: {line.strip()}")
        else:
            new_lines.append(line)
    
    # Also remove duplicate tools imports
    tools_imports = []
    for i, line in enumerate(lines):
        if "from '@/data/registry'" in line or 'from "@/data/registry"' in line:
            tools_imports.append(i)
    
    if len(tools_imports) > 1:
        print(f"  Found {len(tools_imports)} tools imports")
        tools_import_count = 0
        temp_lines = []
        for line in new_lines:
            if "from '@/data/registry'" in line or 'from "@/data/registry"' in line:
                tools_import_count += 1
                if tools_import_count == 1:
                    temp_lines.append(line)
            else:
                temp_lines.append(line)
        new_lines = temp_lines
    
    # Write the file
    with open(file_path, 'w') as f:
        f.writelines(new_lines)
    
    fixed += 1

print(f"\n✅ Fixed {fixed} files")
