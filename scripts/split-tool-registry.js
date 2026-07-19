const fs = require("fs");
const path = require("path");

const registryPath = path.join(
  __dirname,
  "../src/data/toolRegistry.ts"
);

const outputDir = path.join(
  __dirname,
  "../src/data/tools"
);

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

const source = fs.readFileSync(registryPath, "utf8");

console.log("Registry loaded.");
console.log("");
console.log(
  "This is the bootstrap script."
);
console.log(
  "In the next version we'll automatically split every tool into its own file."
);
console.log("");
console.log("Registry size:", source.length, "characters");