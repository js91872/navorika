const fs = require('fs');
try {
  const content = fs.readFileSync('src/data/registry.ts', 'utf8');
  
  // Extract the tools array content
  const match = content.match(/export const tools: Tool\[\] = \[([\s\S]*?)\];/);
  if (!match) {
    console.log('Error: Could not find tools array');
    process.exit(1);
  }
  
  const toolsContent = match[1];
  // Find all tool objects
  const toolObjects = toolsContent.match(/\{[^{}]*\}/g);
  
  if (!toolObjects) {
    console.log('Error: No tool objects found');
    process.exit(1);
  }
  
  console.log(`Found ${toolObjects.length} tool objects`);
  
  let validCount = 0;
  let invalidCount = 0;
  
  toolObjects.forEach((obj, index) => {
    if (obj.includes('slug:')) {
      const slugMatch = obj.match(/slug:\s*'([^']*)'/);
      if (slugMatch) {
        console.log(`✅ ${index}: ${slugMatch[1]}`);
        validCount++;
      } else {
        console.log(`❌ ${index}: Has slug but couldn't extract value`);
        invalidCount++;
      }
    } else {
      console.log(`❌ ${index}: Missing slug property - ${obj.substring(0, 50)}...`);
      invalidCount++;
    }
  });
  
  console.log(`\n✅ Valid tools: ${validCount}`);
  console.log(`❌ Invalid tools: ${invalidCount}`);
  
} catch (e) {
  console.log('Error:', e.message);
}
