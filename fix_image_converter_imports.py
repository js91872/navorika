#!/usr/bin/env python3
"""
Fix ImageConverterEngine import issues
"""

import re
from pathlib import Path

# Files that use ImageConverterEngine
files = [
    'heic-to-jpg',
    'heic-to-png',
    'html-to-image',
    'image-converter',
    'image-dpi-converter',
    'image-metadata-viewer',
    'image-to-pdf',
    'jpg-to-pdf',
    'pdf-to-image',
    'svg-to-png',
    'webp-to-pdf',
    'webp-to-png'
]

for file_name in files:
    file_path = Path(f'src/app/tools/{file_name}/page.tsx')
    if not file_path.exists():
        continue
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if it has the ImageConverterEngine import and tools import
    if 'ImageConverterEngine' in content and 'tools' in content:
        print(f"📝 Fixing: {file_name}")
        
        # Remove duplicate imports
        lines = content.split('\n')
        new_lines = []
        seen_imports = set()
        
        for line in lines:
            if "from '@/data/registry'" in line or 'from "@/data/registry"' in line:
                norm_line = line.strip()
                if norm_line not in seen_imports:
                    seen_imports.add(norm_line)
                    new_lines.append(line)
            else:
                new_lines.append(line)
        
        content = '\n'.join(new_lines)
        
        with open(file_path, 'w') as f:
            f.write(content)
        
        print(f"  ✅ Fixed {file_name}")

print("✅ Done fixing ImageConverterEngine imports")
