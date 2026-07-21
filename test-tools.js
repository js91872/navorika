// Simple test to verify tools are exported correctly
console.log('Testing tool exports...');

// Simulate reading the files
const fs = require('fs');
const path = require('path');

// Check if productivity.ts exists and has exports
const productivityPath = path.join(__dirname, 'src/data/tools/productivity.ts');
if (fs.existsSync(productivityPath)) {
  const content = fs.readFileSync(productivityPath, 'utf8');
  const toolCount = (content.match(/slug:/g) || []).length;
  console.log(`✅ productivity.ts exists with ${toolCount} tools`);
} else {
  console.log('❌ productivity.ts not found');
}

// Check index.ts imports
const indexPath = path.join(__dirname, 'src/data/tools/index.ts');
if (fs.existsSync(indexPath)) {
  const content = fs.readFileSync(indexPath, 'utf8');
  if (content.includes('productivityTools')) {
    console.log('✅ productivityTools imported in index.ts');
  } else {
    console.log('❌ productivityTools NOT imported in index.ts');
  }
} else {
  console.log('❌ index.ts not found');
}

// Check if page files exist
const pages = [
  'src/app/tools/date-calculator/page.tsx',
  'src/app/tools/percentage-calculator/page.tsx',
  'src/app/tools/qr-code-generator/page.tsx',
  'src/app/tools/password-generator/page.tsx',
  'src/app/tools/age-calculator/page.tsx'
];

pages.forEach(page => {
  if (fs.existsSync(page)) {
    console.log(`✅ ${page} exists`);
  } else {
    console.log(`❌ ${page} missing`);
  }
});
