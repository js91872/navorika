#!/usr/bin/env python3
"""
Fix all files with duplicate export default statements
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
    
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Count export default statements
    exports = re.findall(r'export\s+default\s+', content)
    
    if len(exports) <= 1:
        continue
    
    print(f"\n📝 Fixing: {slug} ({len(exports)} exports)")
    
    # Find the component name from the first export
    match = re.search(r'export default function\s+(\w+)\s*\(', content)
    if not match:
        match = re.search(r'export default\s+(\w+)\s*\(', content)
    if not match:
        match = re.search(r'export default\s+function\s+(\w+)', content)
    
    if not match:
        print(f"  ❌ Could not find component name")
        failed += 1
        continue
    
    func_name = match.group(1)
    print(f"  Component: {func_name}")
    
    # Remove ALL export default statements
    content = re.sub(r'export\s+default\s+\w+\s*;?\s*$', '', content)
    content = re.sub(r'export\s+default\s+function\s+\w+\s*\([^)]*\)\s*\{[\s\S]*?\}\s*$', '', content)
    
    # Clean up any leftover empty lines
    content = re.sub(r'\n\s*\n\s*\n', '\n\n', content)
    
    # Add wrapper at the end
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
    
    print(f"  ✅ Fixed")
    fixed += 1

print(f"\n📊 Summary:")
print(f"  ✅ Fixed: {fixed}")
print(f"  ❌ Failed: {failed}")
