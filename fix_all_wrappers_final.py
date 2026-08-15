#!/usr/bin/env python3
"""
Fix all wrapper functions to use the correct component names
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
        continue
    
    print(f"\n📝 Fixing: {slug}")
    
    with open(file_path, 'r') as f:
        content = f.read()
    
    # Find the wrapper function
    wrapper_match = re.search(r'export\s+default\s+function\s+(\w+Wrapper)\s*\(\s*\)\s*\{([^}]*)\}', content, re.DOTALL)
    
    if wrapper_match:
        wrapper_name = wrapper_match.group(1)
        wrapper_body = wrapper_match.group(2)
        
        # Find the component being rendered
        comp_match = re.search(r'<\s*(\w+)\s*/>', wrapper_body)
        if comp_match:
            current_comp = comp_match.group(1)
            print(f"  Found: <{current_comp} /> -> should be <{correct_component} />")
            
            if current_comp != correct_component:
                # Replace the component name
                new_body = wrapper_body.replace(f'<{current_comp} />', f'<{correct_component} />')
                new_body = new_body.replace(f'<{current_comp}>', f'<{correct_component}>')
                new_body = new_body.replace(f'</{current_comp}>', f'</{correct_component}>')
                
                new_wrapper = f'export default function {wrapper_name}() {{{new_body}}}'
                content = content.replace(wrapper_match.group(0), new_wrapper)
                print(f"  ✅ Changed to <{correct_component} />")
        else:
            print(f"  ⚠️ No component found in wrapper")
    else:
        print(f"  ⚠️ No wrapper found")
        continue
    
    # Write the file
    with open(file_path, 'w') as f:
        f.write(content)
    
    print(f"  ✅ Fixed {slug}")

print("\n🎉 All files fixed!")
