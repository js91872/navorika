#!/bin/bash

echo "🔄 Updating tool pages to use NumberInput..."

# Count total tool pages
TOTAL=$(find src/app/tools -name "page.tsx" -type f | grep -v "src/app/tools/page.tsx" | wc -l)
echo "Found $TOTAL tool pages to process"

updated=0
skipped=0

for file in $(find src/app/tools -name "page.tsx" -type f | grep -v "src/app/tools/page.tsx"); do
  echo "Processing: $(basename $(dirname $file))"
  
  # Check if it uses Input component
  if grep -q "from '@/components/ui/Input'" "$file"; then
    
    # Create backup
    cp "$file" "$file.bak"
    
    # Add NumberInput import after Input import (if not already there)
    if ! grep -q "NumberInput" "$file"; then
      sed -i "s|from '@/components/ui/Input'|from '@/components/ui/Input'\nimport { NumberInput } from '@/components/ui/NumberInput'|g" "$file"
    fi
    
    # Replace Input with NumberInput for number fields
    # Pattern 1: <Input type="number"
    sed -i 's|<Input type="number"|<NumberInput|g' "$file"
    
    # Pattern 2: <Input className="flex-1" type="number"
    sed -i 's|<Input className="flex-1" type="number"|<NumberInput className="flex-1"|g' "$file"
    
    # Pattern 3: <Input type="number" with self-closing
    sed -i 's|<Input type="number" \([^>]*\)/>|<NumberInput \1/>|g' "$file"
    
    # Pattern 4: <Input type="number" with children
    sed -i 's|<Input type="number" \([^>]*\)>|<NumberInput \1>|g' "$file"
    
    # Pattern 5: onChange={(e) => setXxx(Number(e.target.value))} -> onChange={setXxx}
    sed -i 's/onChange={(e) => set\([^(]*\)(Number(e.target.value))}/onChange={set\1}/g' "$file"
    
    # Pattern 6: onChange={(e) => setXxx(parseFloat(e.target.value))} -> onChange={setXxx}
    sed -i 's/onChange={(e) => set\([^(]*\)(parseFloat(e.target.value))}/onChange={set\1}/g' "$file"
    
    # Pattern 7: onChange={(e) => setXxx(e.target.value)} with Number
    sed -i 's/onChange={(e) => set\([^(]*\)(e.target.value)}/onChange={set\1}/g' "$file"
    
    echo "✅ Updated: $(basename $(dirname $file))"
    updated=$((updated + 1))
  else
    echo "⏭️ Skipped: $(basename $(dirname $file)) (no Input component)"
    skipped=$((skipped + 1))
  fi
done

echo ""
echo "✅ Updated $updated files"
echo "⏭️ Skipped $skipped files"
