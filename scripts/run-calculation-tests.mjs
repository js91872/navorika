import { readdirSync } from 'node:fs';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';

const directory = join(process.cwd(), 'src/lib/calculations');
const files = readdirSync(directory).filter((file) => file.endsWith('.test.mjs')).sort();

if (files.length === 0) throw new Error('No calculation test modules found.');

for (const file of files) await import(pathToFileURL(join(directory, file)).href);
