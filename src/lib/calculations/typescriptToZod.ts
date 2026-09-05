export interface TypescriptToZodResult {
  zodSchema: string;
  warnings: string[];
  fieldCount: number;
  schemaCount: number;
  isValid: boolean;
}

export interface ParsedProperty {
  name: string;
  typeStr: string;
  isOptional: boolean;
}

// Strip block and line comments from TypeScript source
function stripComments(source: string): string {
  return source
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*/g, '');
}

// Safe string literal extractor
function parseStringLiteral(val: string): string | null {
  const trimmed = val.trim();
  if ((trimmed.startsWith("'") && trimmed.endsWith("'")) || (trimmed.startsWith('"') && trimmed.endsWith('"'))) {
    return trimmed.slice(1, -1);
  }
  return null;
}

// Check if string is a numeric literal
function parseNumericLiteral(val: string): number | null {
  const trimmed = val.trim();
  if (/^-?\d+(?:\.\d+)?$/.test(trimmed)) {
    const num = Number(trimmed);
    return Number.isFinite(num) ? num : null;
  }
  return null;
}

// Splits top-level tokens by delimiter, respecting nested braces, brackets, and quotes
function splitTopLevel(input: string, delimiter: string): string[] {
  const parts: string[] = [];
  let current = '';
  let depthBraces = 0;
  let depthBrackets = 0;
  let depthParens = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < input.length; i++) {
    const char = input[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += char;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
    } else if (inSingleQuote || inDoubleQuote) {
      current += char;
    } else if (char === '{') {
      depthBraces++;
      current += char;
    } else if (char === '}') {
      depthBraces--;
      current += char;
    } else if (char === '[') {
      depthBrackets++;
      current += char;
    } else if (char === ']') {
      depthBrackets--;
      current += char;
    } else if (char === '(') {
      depthParens++;
      current += char;
    } else if (char === ')') {
      depthParens--;
      current += char;
    } else if (char === delimiter && depthBraces === 0 && depthBrackets === 0 && depthParens === 0) {
      parts.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  if (current.trim()) {
    parts.push(current.trim());
  }

  return parts;
}

// Split body into statements (delimited by ; or \n when at depth 0)
function splitBodyStatements(body: string): string[] {
  const statements: string[] = [];
  let current = '';
  let depthBraces = 0;
  let depthBrackets = 0;
  let depthParens = 0;
  let inSingleQuote = false;
  let inDoubleQuote = false;

  for (let i = 0; i < body.length; i++) {
    const char = body[i];

    if (char === "'" && !inDoubleQuote) {
      inSingleQuote = !inSingleQuote;
      current += char;
    } else if (char === '"' && !inSingleQuote) {
      inDoubleQuote = !inDoubleQuote;
      current += char;
    } else if (inSingleQuote || inDoubleQuote) {
      current += char;
    } else if (char === '{') {
      depthBraces++;
      current += char;
    } else if (char === '}') {
      depthBraces--;
      current += char;
    } else if (char === '[') {
      depthBrackets++;
      current += char;
    } else if (char === ']') {
      depthBrackets--;
      current += char;
    } else if (char === '(') {
      depthParens++;
      current += char;
    } else if (char === ')') {
      depthParens--;
      current += char;
    } else if ((char === ';' || char === '\n') && depthBraces === 0 && depthBrackets === 0 && depthParens === 0) {
      const trimmed = current.trim();
      if (trimmed) {
        statements.push(trimmed);
      }
      current = '';
    } else {
      current += char;
    }
  }

  const trimmed = current.trim();
  if (trimmed) {
    statements.push(trimmed);
  }

  return statements;
}

// Transform a single type expression to Zod
function transformType(typeStr: string, warnings: string[], indentLevel: number = 1): string {
  const raw = typeStr.trim();

  // Check for nested inline object: { ... }
  if (raw.startsWith('{') && raw.endsWith('}')) {
    const inner = raw.slice(1, -1).trim();
    const props = parseObjectProperties(inner, warnings);
    return formatZodObject(props, warnings, indentLevel);
  }

  // Check for top-level union
  const unionParts = splitTopLevel(raw, '|');
  if (unionParts.length > 1) {
    let hasNull = false;
    let hasUndefined = false;
    const remainingParts: string[] = [];

    for (const part of unionParts) {
      const p = part.trim();
      if (p === 'null') {
        hasNull = true;
      } else if (p === 'undefined') {
        hasUndefined = true;
      } else if (p) {
        remainingParts.push(p);
      }
    }

    let coreZod = '';
    // Check if remaining parts are all string literals
    const stringLiterals = remainingParts.map(parseStringLiteral);
    const numericLiterals = remainingParts.map(parseNumericLiteral);

    if (stringLiterals.every((lit) => lit !== null) && remainingParts.length > 0) {
      const enumArgs = stringLiterals.map((lit) => `'${lit}'`).join(', ');
      coreZod = `z.enum([${enumArgs}])`;
    } else if (numericLiterals.every((lit) => lit !== null) && remainingParts.length > 0) {
      const unionArgs = numericLiterals.map((lit) => `z.literal(${lit})`).join(', ');
      coreZod = `z.union([${unionArgs}])`;
    } else if (remainingParts.length === 1) {
      coreZod = transformType(remainingParts[0], warnings, indentLevel);
    } else if (remainingParts.length > 1) {
      const memberSchemas = remainingParts.map((part) => transformType(part, warnings, indentLevel));
      coreZod = `z.union([${memberSchemas.join(', ')}])`;
    } else {
      coreZod = 'z.unknown()';
    }

    if (hasNull) coreZod += '.nullable()';
    if (hasUndefined) coreZod += '.optional()';
    return coreZod;
  }

  // Check for Array syntax: T[] or Array<T> or readonly T[]
  if (raw.endsWith('[]')) {
    const elemType = raw.slice(0, -2).trim();
    return `z.array(${transformType(elemType, warnings, indentLevel)})`;
  }
  const arrayGenericMatch = raw.match(/^(?:ReadonlyArray|Array)<(.+)>$/);
  if (arrayGenericMatch) {
    const elemType = arrayGenericMatch[1].trim();
    return `z.array(${transformType(elemType, warnings, indentLevel)})`;
  }

  // Primitive mappings
  switch (raw) {
    case 'string':
      return 'z.string()';
    case 'number':
      return 'z.number()';
    case 'boolean':
      return 'z.boolean()';
    case 'bigint':
      return 'z.bigint()';
    case 'Date':
      return 'z.date()';
    case 'any':
      return 'z.any()';
    case 'unknown':
      return 'z.unknown()';
    case 'null':
      return 'z.null()';
    case 'undefined':
      return 'z.undefined()';
    case 'void':
      return 'z.void()';
    case 'never':
      return 'z.never()';
    case 'Record<string, unknown>':
    case 'Record<string, any>':
      return 'z.record(z.unknown())';
    case 'Record<string, string>':
      return 'z.record(z.string())';
    default: {
      // Check for single string literal
      const singleString = parseStringLiteral(raw);
      if (singleString !== null) {
        return `z.literal('${singleString}')`;
      }
      // Check for single number literal
      const singleNum = parseNumericLiteral(raw);
      if (singleNum !== null) {
        return `z.literal(${singleNum})`;
      }
      if (raw === 'true' || raw === 'false') {
        return `z.literal(${raw})`;
      }

      // If unrecognized type name (custom type reference, e.g. Address)
      if (/^[A-Z][a-zA-Z0-9_$]*$/.test(raw)) {
        return `${raw}Schema`;
      }

      warnings.push(`Type "${raw}" is not directly supported; converted to z.unknown().`);
      return 'z.unknown()';
    }
  }
}

// Parse object properties inside { ... }
function parseObjectProperties(body: string, warnings: string[]): ParsedProperty[] {
  const properties: ParsedProperty[] = [];
  const statements = splitBodyStatements(body);

  for (const item of statements) {
    const trimmed = item.trim().replace(/[,;]$/, '').trim();
    if (!trimmed) continue;

    // Check for unsupported mapped types: [key in Keys]
    if (/^\[.+in.+\]/.test(trimmed)) {
      warnings.push(`Mapped type "${trimmed}" is not supported; requires manual Zod schema.`);
      continue;
    }

    // Check for index signatures: [key: string]: string
    const indexSigMatch = trimmed.match(/^\[([a-zA-Z0-9_$]+)\s*:\s*([^\]]+)\]\s*:\s*(.+)$/);
    if (indexSigMatch) {
      warnings.push(`Index signature "${trimmed}" detected; consider z.record(...) manually.`);
      continue;
    }

    // Normal property: name?: Type or 'name'?: Type
    const match = trimmed.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*|'[^']+'|"[^"]+")(\?)?\s*:\s*([\s\S]+)$/);
    if (!match) {
      if (trimmed && !trimmed.startsWith('//') && !trimmed.startsWith('/*')) {
        warnings.push(`Could not parse line: "${trimmed}".`);
      }
      continue;
    }

    let propName = match[1];
    if ((propName.startsWith("'") && propName.endsWith("'")) || (propName.startsWith('"') && propName.endsWith('"'))) {
      propName = propName.slice(1, -1);
    }
    const isOptional = Boolean(match[2]);
    const typeStr = match[3].trim();

    properties.push({
      name: propName,
      typeStr,
      isOptional,
    });
  }

  return properties;
}

// Format parsed properties as Zod object schema
function formatZodObject(properties: ParsedProperty[], warnings: string[], indentLevel: number): string {
  if (properties.length === 0) {
    return 'z.object({})';
  }

  const indent = '  '.repeat(indentLevel);
  const closingIndent = '  '.repeat(indentLevel - 1);
  const lines: string[] = [];

  for (const prop of properties) {
    let schemaStr = transformType(prop.typeStr, warnings, indentLevel);
    if (prop.isOptional && !schemaStr.endsWith('.optional()')) {
      schemaStr += '.optional()';
    }
    lines.push(`${indent}${prop.name}: ${schemaStr},`);
  }

  return `z.object({\n${lines.join('\n')}\n${closingIndent}})`;
}

// Extract declarations with balanced braces
function extractDeclarations(source: string): Array<{ typeName: string; body: string }> {
  const declarations: Array<{ typeName: string; body: string }> = [];
  const declHeaderRegex = /(?:export\s+)?(?:interface|type)\s+([A-Za-z_$][A-Za-z0-9_$]*)(?:<[^>]*>)?\s*(?:=\s*)?\{/g;
  let match: RegExpExecArray | null;

  while ((match = declHeaderRegex.exec(source)) !== null) {
    const typeName = match[1];
    const braceStart = declHeaderRegex.lastIndex - 1; // position of '{'

    let depth = 0;
    let braceEnd = -1;
    let inSingle = false;
    let inDouble = false;

    for (let i = braceStart; i < source.length; i++) {
      const ch = source[i];
      if (ch === "'" && !inDouble) inSingle = !inSingle;
      else if (ch === '"' && !inSingle) inDouble = !inDouble;
      else if (!inSingle && !inDouble) {
        if (ch === '{') depth++;
        else if (ch === '}') {
          depth--;
          if (depth === 0) {
            braceEnd = i;
            break;
          }
        }
      }
    }

    if (braceEnd !== -1) {
      const body = source.slice(braceStart + 1, braceEnd);
      declarations.push({ typeName, body });
      declHeaderRegex.lastIndex = braceEnd + 1;
    }
  }

  return declarations;
}

export function convertTypescriptToZod(typescriptInput: string): TypescriptToZodResult {
  const warnings: string[] = [];

  if (!typescriptInput || !typescriptInput.trim()) {
    return {
      zodSchema: '// Paste a TypeScript interface or type definition above to generate a Zod schema.\n',
      warnings: ['No TypeScript definition provided.'],
      fieldCount: 0,
      schemaCount: 0,
      isValid: false,
    };
  }

  const cleaned = stripComments(typescriptInput);

  // Check for generics
  if (/<[A-Za-z0-9_$,\s]+>/.test(cleaned) && !/Array<|ReadonlyArray<|Record</.test(cleaned)) {
    warnings.push('Generics (<T>) are not supported in starter Zod conversion and require manual schema definition.');
  }

  // Check for conditional types
  if (/\bextends\b[\s\S]*?\?[\s\S]*?:/.test(cleaned)) {
    warnings.push('Conditional types are not supported and require manual schema definition.');
  }

  const declarations = extractDeclarations(cleaned);
  const schemaOutputs: string[] = [];
  let totalFieldCount = 0;

  for (const { typeName, body } of declarations) {
    const properties = parseObjectProperties(body, warnings);
    totalFieldCount += properties.length;

    const schemaName = `${typeName.charAt(0).toUpperCase()}${typeName.slice(1)}Schema`;
    const zodBody = formatZodObject(properties, warnings, 1);

    const schemaCode = `export const ${schemaName} = ${zodBody};\nexport type ${typeName} = z.infer<typeof ${schemaName}>;`;
    schemaOutputs.push(schemaCode);
  }

  // Fallback: If no interface or type wrapper was found, check if raw object literal { ... } was pasted
  if (declarations.length === 0) {
    const rawObjectMatch = cleaned.trim().match(/^\{([\s\S]*)\}$/);
    if (rawObjectMatch) {
      const properties = parseObjectProperties(rawObjectMatch[1], warnings);
      totalFieldCount = properties.length;
      const zodBody = formatZodObject(properties, warnings, 1);
      const schemaCode = `export const OutputSchema = ${zodBody};\nexport type Output = z.infer<typeof OutputSchema>;`;
      schemaOutputs.push(schemaCode);
    }
  }

  if (schemaOutputs.length === 0) {
    warnings.push('No valid TypeScript interface or object type definition found. Example: interface User { name: string; age: number; }');
    return {
      zodSchema: '// No interface or type definition could be parsed.\n// Expected syntax:\n// interface User {\n//   name: string;\n//   age: number;\n//   active?: boolean;\n// }\n',
      warnings,
      fieldCount: 0,
      schemaCount: 0,
      isValid: false,
    };
  }

  const header = `// Starter Zod schema generated by Navorika TypeScript to Zod Schema Converter
// Review and customize validation rules (e.g. .email(), .min()) before production use.
import { z } from 'zod';\n\n`;

  const finalCode = header + schemaOutputs.join('\n\n') + '\n';

  return {
    zodSchema: finalCode,
    warnings,
    fieldCount: totalFieldCount,
    schemaCount: schemaOutputs.length,
    isValid: true,
  };
}
