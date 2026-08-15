#!/usr/bin/env python3
"""
Fix Uint8Array Blob errors in PDF tools
"""

import re
from pathlib import Path

# Files to fix
files = [
    'src/app/tools/compress-pdf/page.tsx',
    'src/app/tools/delete-pdf-pages/page.tsx',
    'src/app/tools/extract-pdf-pages/page.tsx',
]

for file_path in files:
    path = Path(file_path)
    if not path.exists():
        continue
    
    with open(path, 'r') as f:
        content = f.read()
    
    # Fix the Blob creation
    # Replace: new Blob([compressedBytes], { type: "application/pdf" })
    # With: new Blob([new Uint8Array(compressedBytes)], { type: "application/pdf" })
    content = re.sub(
        r'new\s+Blob\(\s*\[([a-zA-Z_]+)\]\s*,\s*\{\s*type:\s*["\']application/pdf["\']\s*\}\s*\)',
        r'new Blob([new Uint8Array(\1)], { type: "application/pdf" })',
        content
    )
    
    with open(path, 'w') as f:
        f.write(content)
    
    print(f"✅ Fixed {file_path}")

print("🎉 All Blob errors fixed!")
