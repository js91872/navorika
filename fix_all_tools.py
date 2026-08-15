#!/usr/bin/env python3
"""
Properly fix all tool wrappers by identifying the correct component names
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
failed = 0

for tool_dir in tool_dirs:
    slug = tool_dir.name
    file_path = tool_dir / 'page.tsx'
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it uses EnhancedToolWrapper
    if 'EnhancedToolWrapper' not in content:
        print(f"\n⏭️ {slug}: No EnhancedToolWrapper")
        continue
    
    # Find the component name from export default
    # Look for: export default function ComponentName
    match = re.search(r'export\s+default\s+function\s+(\w+)\s*\(', content)
    
    if not match:
        # Look for: export default ComponentName
        match = re.search(r'export\s+default\s+(\w+)\s*;?', content)
    
    if not match:
        # Look for function declarations
        funcs = re.findall(r'function\s+(\w+)\s*\(', content)
        # Remove wrapper functions
        funcs = [f for f in funcs if 'Wrapper' not in f and f != 'default']
        if funcs:
            comp_name = funcs[0]
            print(f"\n📝 {slug}: Using function: {comp_name}")
        else:
            print(f"\n❌ {slug}: Could not find component")
            failed += 1
            continue
    else:
        comp_name = match.group(1)
        print(f"\n📝 {slug}: Component: {comp_name}")
    
    # Check if there's already a wrapper
    wrapper_match = re.search(r'export\s+default\s+function\s+(\w+Wrapper)\s*\(', content)
    
    if wrapper_match:
        wrapper_name = wrapper_match.group(1)
        print(f"  Found wrapper: {wrapper_name}")
    else:
        wrapper_name = f"{comp_name}Wrapper"
        print(f"  Creating wrapper: {wrapper_name}")
    
    # Remove existing wrapper and exports
    # Remove all export default statements
    content = re.sub(r'export\s+default\s+\w+\s*;?\s*$', '', content)
    content = re.sub(r'export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}\s*$', '', content)
    
    # Add imports if needed
    if 'from @/data/registry' not in content:
        if "'use client'" in content:
            content = content.replace(
                "'use client';\n",
                "'use client';\n\nimport { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n"
            )
        else:
            content = "import { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n" + content
    
    # Add the wrapper
    new_wrapper = f'''

export default function {wrapper_name}() {{
  const meta = tools.find(t => t.slug === '{slug}');
  return (
    <EnhancedToolWrapper meta={{meta}}>
      <{comp_name} />
    </EnhancedToolWrapper>
  );
}}
'''
    content = content.rstrip() + new_wrapper
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"  ✅ Fixed")
    fixed += 1

print(f"\n📊 Summary:")
print(f"  ✅ Fixed: {fixed}")
print(f"  ❌ Failed: {failed}")
