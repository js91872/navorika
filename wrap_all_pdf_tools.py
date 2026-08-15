#!/usr/bin/env python3
"""
Wrap all PDF tools with EnhancedToolWrapper
"""

import re
from pathlib import Path

# List of PDF tools
pdf_tools = [
    'merge-pdf',
    'split-pdf', 
    'pdf-to-image',
    'image-to-pdf',
    'add-image-to-pdf'
]

for tool in pdf_tools:
    file_path = Path(f'src/app/tools/{tool}/page.tsx')
    if not file_path.exists():
        print(f"❌ {tool} not found")
        continue
    
    # Read the file
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it already uses EnhancedToolWrapper
    if 'EnhancedToolWrapper' in content and 'CompressPDFPage' not in content:
        print(f"✅ {tool} already uses EnhancedToolWrapper")
        continue
    
    # Find the export default function name
    match = re.search(r'export default function (\w+)\(\)', content)
    if not match:
        print(f"❌ Could not find export in {tool}")
        continue
    
    func_name = match.group(1)
    content_name = func_name.replace('Tool', 'Content')
    
    # Create the wrapper
    new_content = f'''{content}

function {content_name}() {{
  const meta = tools.find(t => t.slug === '{tool}');
  return (
    <EnhancedToolWrapper meta={meta}>
      <{func_name} />
    </EnhancedToolWrapper>
  );
}}

export default function {func_name}Page() {{
  const meta = tools.find(t => t.slug === '{tool}');
  return (
    <EnhancedToolWrapper meta={meta}>
      <{func_name} />
    </EnhancedToolWrapper>
  );
}}
'''
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(new_content)
    
    print(f"✅ Wrapped {tool} with EnhancedToolWrapper")

print("🎉 All PDF tools wrapped!")
