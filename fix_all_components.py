#!/usr/bin/env python3
"""
Fix all tool wrappers to use the correct component names
"""

import re
from pathlib import Path

# Map of tools to their correct component names
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

for slug, correct_component in component_map.items():
    file_path = Path(f'src/app/tools/{slug}/page.tsx')
    if not file_path.exists():
        print(f"❌ {slug}: File not found")
        continue
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find the wrapper function
    wrapper_match = re.search(r'export\s+default\s+function\s+(\w+Wrapper)\s*\(\s*\)\s*\{([^}]*)\}', content, re.DOTALL)
    if not wrapper_match:
        print(f"⚠️ {slug}: No wrapper found")
        continue
    
    wrapper_name = wrapper_match.group(1)
    wrapper_body = wrapper_match.group(2)
    
    # Check if it's using the correct component
    if correct_component in wrapper_body:
        print(f"✅ {slug}: Already using {correct_component}")
        continue
    
    # Find what component it's currently using
    current_match = re.search(r'<\s*(\w+)\s*/>', wrapper_body)
    if not current_match:
        print(f"⚠️ {slug}: No component found in wrapper")
        continue
    
    current_component = current_match.group(1)
    print(f"📝 {slug}: Changing {current_component} -> {correct_component}")
    
    # Replace the component in the wrapper
    new_wrapper_body = wrapper_body.replace(f'<{current_component} />', f'<{correct_component} />')
    new_wrapper_body = new_wrapper_body.replace(f'<{current_component}>', f'<{correct_component}>')
    new_wrapper_body = new_wrapper_body.replace(f'</{current_component}>', f'</{correct_component}>')
    
    # Replace the wrapper in the content
    new_wrapper = f'export default function {wrapper_name}() {{{new_wrapper_body}}}'
    content = content.replace(wrapper_match.group(0), new_wrapper)
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"✅ {slug}: Fixed")

print("🎉 All tools fixed!")
