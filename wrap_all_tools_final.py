#!/usr/bin/env python3
"""
Wrap ALL tools with EnhancedToolWrapper
"""

import re
from pathlib import Path

# Get all tool directories
tool_dirs = [d for d in Path('src/app/tools').iterdir() if d.is_dir() and (d / 'page.tsx').exists()]

# Skip the tools root page and categories
skip_slugs = ['tools', 'pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']
tool_dirs = [d for d in tool_dirs if d.name not in skip_slugs]

print(f"Found {len(tool_dirs)} tool directories")

wrapped = 0
failed = 0

for tool_dir in tool_dirs:
    slug = tool_dir.name
    file_path = tool_dir / 'page.tsx'
    
    print(f"\n📝 Processing: {slug}")
    
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it already uses EnhancedToolWrapper
    if 'EnhancedToolWrapper' in content:
        print(f"  ✅ Already wrapped")
        wrapped += 1
        continue
    
    # Find the component name
    match = re.search(r'export default function\s+(\w+)\s*\(', content)
    if not match:
        match = re.search(r'export default\s+function\s+(\w+)', content)
    
    if not match:
        print(f"  ❌ Could not find component name")
        failed += 1
        continue
    
    func_name = match.group(1)
    print(f"  Component: {func_name}")
    
    # Add imports if not present
    if 'from @/data/registry' not in content:
        if "'use client'" in content:
            content = content.replace(
                "'use client';\n",
                "'use client';\n\nimport { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n"
            )
        else:
            content = "import { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n" + content
    
    # Remove existing export default at the end
    content = re.sub(r'export\s+default\s+\w+\s*;?\s*$', '', content)
    
    # Add the wrapper
    wrapper_code = f'''

export default function {func_name}Wrapper() {{
  const meta = tools.find(t => t.slug === '{slug}');
  return (
    <EnhancedToolWrapper meta={{meta}}>
      <{func_name} />
    </EnhancedToolWrapper>
  );
}}
'''
    content = content.rstrip() + wrapper_code
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"  ✅ Wrapped successfully")
    wrapped += 1

print(f"\n📊 Summary:")
print(f"  ✅ Wrapped: {wrapped}")
print(f"  ❌ Failed: {failed}")
print(f"  📁 Total: {len(tool_dirs)}")
