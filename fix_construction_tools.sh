#!/bin/bash

# List of tools and their correct component names
declare -A components=(
  ["asphalt-calculator"]="AsphaltCalculatorContent"
  ["blur-face"]="BlurFaceContent"
  ["bmi-calculator"]="BMICalculatorContent"
  ["brick-calculator"]="BrickCalculatorContent"
  ["cement-calculator"]="CementCalculatorContent"
  ["compress-pdf"]="CompressPDFContent"
  ["construction-cost-calculator"]="ConstructionCostCalculatorContent"
  ["excavation-calculator"]="ExcavationCalculatorContent"
  ["extract-pdf-pages"]="ExtractPdfPagesContent"
  ["flooring-calculator"]="FlooringCalculatorContent"
  ["gravel-calculator"]="GravelCalculatorContent"
  ["house-construction-cost-calculator"]="HouseConstructionCostCalculatorContent"
  ["land-area-converter"]="LandAreaConverterContent"
  ["paint-calculator"]="PaintCalculatorContent"
  ["rebar-calculator"]="RebarCalculatorContent"
  ["roof-area-calculator"]="RoofAreaCalculatorContent"
  ["sand-calculator"]="SandCalculatorContent"
  ["solar-panel-calculator"]="SolarPanelCalculatorContent"
  ["steel-weight-calculator"]="SteelWeightCalculatorContent"
  ["tile-calculator"]="TileCalculatorContent"
  ["voltage-drop-calculator"]="VoltageDropCalculatorContent"
  ["water-tank-calculator"]="WaterTankCalculatorContent"
  ["wire-size-calculator"]="WireSizeCalculatorContent"
)

for tool in "${!components[@]}"; do
  echo "Fixing $tool..."
  file="src/app/tools/$tool/page.tsx"
  
  if [ ! -f "$file" ]; then
    echo "  ❌ File not found"
    continue
  fi
  
  # Replace the wrong component name with the correct one
  sed -i "s/<\s*${components[$tool]}Wrapper\s*>/<${components[$tool]} \/>/g" "$file"
  
  # Also replace if it's on its own line
  sed -i "s/<\s*${components[$tool]}Wrapper\s*$/<${components[$tool]}/g" "$file"
  
  echo "  ✅ Fixed $tool"
done

echo "🎉 All construction tools fixed!"
