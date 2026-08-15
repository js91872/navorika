#!/usr/bin/env python3
"""
Fix component name mismatches in tool wrappers
"""

import re
from pathlib import Path

# List of problematic tools and their correct component names
component_map = {
    'asphalt-calculator': 'AsphaltCalculatorContent',
    'blur-face': 'BlurFaceContent',
    'bmi-calculator': 'BMICalculatorContent',
    'brick-calculator': 'BrickCalculatorContent',
    'cement-calculator': 'CementCalculatorContent',
    'compress-pdf': 'CompressPDFContent',
    'construction-cost-calculator': 'ConstructionCostCalculatorContent',
    'excavation-calculator': 'ExcavationCalculatorContent',
    'extract-pdf-pages': 'ExtractPdfPagesContent',
    'flooring-calculator': 'FlooringCalculatorContent',
    'gravel-calculator': 'GravelCalculatorContent',
    'house-construction-cost-calculator': 'HouseConstructionCostCalculatorContent',
    'land-area-converter': 'LandAreaConverterContent',
    'paint-calculator': 'PaintCalculatorContent',
    'rebar-calculator': 'RebarCalculatorContent',
    'roof-area-calculator': 'RoofAreaCalculatorContent',
    'sand-calculator': 'SandCalculatorContent',
    'solar-panel-calculator': 'SolarPanelCalculatorContent',
    'steel-weight-calculator': 'SteelWeightCalculatorContent',
    'tile-calculator': 'TileCalculatorContent',
    'voltage-drop-calculator': 'VoltageDropCalculatorContent',
    'water-tank-calculator': 'WaterTankCalculatorContent',
    'wire-size-calculator': 'WireSizeCalculatorContent',
}

# Get all tool directories
tool_dirs = [d for d in Path('src/app/tools').iterdir() if d.is_dir() and (d / 'page.tsx').exists()]

# Skip categories
skip_slugs = ['tools', 'pdf-tools', 'image-tools', 'finance-calculators', 'health-calculators', 'developer-tools', 'construction-calculators']
tool_dirs = [d for d in tool_dirs if d.name not in skip_slugs]

print(f"Found {len(tool_dirs)} tool directories")

fixed = 0
for tool_dir in tool_dirs:
    slug = tool_dir.name
    file_path = tool_dir / 'page.tsx'
    
    # Check if this tool needs fixing
    if slug not in component_map:
        continue
    
    correct_component = component_map[slug]
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Check if the component name is already correct
    if correct_component in content:
        print(f"✅ {slug} already has correct component: {correct_component}")
        continue
    
    print(f"\n📝 Fixing {slug}: looking for component")
    
    # Find all function names in the file
    funcs = re.findall(r'function\s+(\w+)\s*\(', content)
    exports = re.findall(r'export\s+default\s+function\s+(\w+)\s*\(', content)
    
    all_names = list(set(funcs + exports))
    print(f"  Found functions: {all_names[:10]}")
    
    # Find the actual component name (the one that's not a wrapper)
    for name in all_names:
        if 'Wrapper' not in name and name != 'default':
            actual_component = name
            break
        elif name == correct_component:
            actual_component = name
            break
    else:
        # If no component found, try to find the content component
        content_match = re.search(r'function\s+(\w+Content)\s*\(', content)
        if content_match:
            actual_component = content_match.group(1)
        else:
            print(f"  ❌ Could not find component in {slug}")
            continue
    
    print(f"  Actual component: {actual_component}")
    print(f"  Correct component: {correct_component}")
    
    # Replace the component name in the wrapper
    if actual_component != correct_component:
        # Find the wrapper function
        wrapper_match = re.search(r'export\s+default\s+function\s+(\w+Wrapper)\s*\(', content)
        if wrapper_match:
            wrapper_name = wrapper_match.group(1)
            print(f"  Wrapper: {wrapper_name}")
            
            # Replace the component name in the wrapper
            content = re.sub(
                rf'<\s*{actual_component}\s*/>',
                f'<{correct_component} />',
                content
            )
            
            # Also replace if it's on a new line
            content = re.sub(
                rf'<\s*{actual_component}\s*\n',
                f'<{correct_component}\n',
                content
            )
            
            print(f"  ✅ Replaced {actual_component} with {correct_component}")
            
            # Write the file
            with open(file_path, 'w') as f:
                f.write(content)
            
            fixed += 1

print(f"\n✅ Fixed {fixed} files")
