#!/usr/bin/env python3
"""
Wrap ALL tools with EnhancedToolWrapper
"""

import re
from pathlib import Path

# Get all tool directories
tool_dirs = [d for d in Path('src/app/tools').iterdir() if d.is_dir() and (d / 'page.tsx').exists()]

# Skip the tools root page
tool_dirs = [d for d in tool_dirs if d.name != 'tools']

# Category slugs to skip (they're not tools)
skip_slugs = ['pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']

print(f"Found {len(tool_dirs)} tool directories")

wrapped = 0
skipped = 0
failed = 0

for tool_dir in tool_dirs:
    slug = tool_dir.name
    
    # Skip categories
    if slug in skip_slugs:
        print(f"⏭️ Skipping category: {slug}")
        skipped += 1
        continue
    
    file_path = tool_dir / 'page.tsx'
    
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it already uses EnhancedToolWrapper
    if 'EnhancedToolWrapper' in content:
        print(f"✅ {slug} already uses EnhancedToolWrapper")
        wrapped += 1
        continue
    
    # Find the export default function name
    match = re.search(r'export default function\s+(\w+)\s*\(', content)
    if not match:
        # Try alternative pattern
        match = re.search(r'export default function\s+(\w+)', content)
    
    if not match:
        print(f"❌ Could not find export in {slug}")
        failed += 1
        continue
    
    func_name = match.group(1)
    print(f"📝 Wrapping {slug} with component: {func_name}")
    
    # Check if the function is used as a component
    if 'return' not in content:
        print(f"⚠️ {slug} might not be a React component, skipping")
        failed += 1
        continue
    
    # Add imports if not already present
    if 'from @/data/registry' not in content:
        # Find the position to insert imports
        if "'use client'" in content:
            content = content.replace("'use client';\n\n", "'use client';\n\nimport { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n")
        else:
            content = "import { tools } from '@/data/registry';\nimport EnhancedToolWrapper from '@/components/EnhancedToolWrapper';\n" + content
    
    # Add wrapper at the end
    wrapper_code = f"""
export default function {func_name}Wrapper() {{
  const meta = tools.find(t => t.slug === '{slug}');
  return (
    <EnhancedToolWrapper meta={meta}>
      <{func_name} />
    </EnhancedToolWrapper>
  );
}}
"""
    
    # Check if the file already has a wrapper
    if f'function {func_name}Wrapper' in content:
        print(f"⚠️ {slug} already has a wrapper function")
        wrapped += 1
        continue
    
    # Check if there's an existing export at the end
    if 'export default' in content and not 'Wrapper' in content:
        # Remove the existing export default at the end
        content = re.sub(r'export\s+default\s+\w+\s*;?\s*$', '', content)
    
    # Add the wrapper
    content = content.rstrip() + '\n' + wrapper_code
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"✅ Wrapped {slug}")
    wrapped += 1

print(f"\n📊 Summary:")
print(f"  ✅ Wrapped: {wrapped}")
print(f"  ⏭️ Skipped: {skipped}")
print(f"  ❌ Failed: {failed}")
print(f"  📁 Total: {len(tool_dirs)}")
