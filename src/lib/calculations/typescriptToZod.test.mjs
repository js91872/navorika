import test from 'node:test';
import assert from 'node:assert/strict';
import { convertTypescriptToZod } from './typescriptToZod.ts';

test('typescriptToZod: converts primitives and optional fields accurately', () => {
  const ts = `
    interface User {
      name: string;
      age: number;
      active?: boolean;
      createdAt: Date;
    }
  `;
  const result = convertTypescriptToZod(ts);
  assert.equal(result.isValid, true);
  assert.equal(result.fieldCount, 4);
  assert.ok(result.zodSchema.includes("name: z.string(),"));
  assert.ok(result.zodSchema.includes("age: z.number(),"));
  assert.ok(result.zodSchema.includes("active: z.boolean().optional(),"));
  assert.ok(result.zodSchema.includes("createdAt: z.date(),"));
  assert.ok(result.zodSchema.includes("export const UserSchema = z.object({"));
  assert.ok(result.zodSchema.includes("export type User = z.infer<typeof UserSchema>;"));
});

test('typescriptToZod: converts arrays and type aliases correctly', () => {
  const ts = `
    type Product = {
      id: string;
      tags: string[];
      prices: Array<number>;
    };
  `;
  const result = convertTypescriptToZod(ts);
  assert.equal(result.isValid, true);
  assert.ok(result.zodSchema.includes("tags: z.array(z.string()),"));
  assert.ok(result.zodSchema.includes("prices: z.array(z.number()),"));
  assert.ok(result.zodSchema.includes("export const ProductSchema = z.object({"));
});

test('typescriptToZod: converts nullable values and literal unions', () => {
  const ts = `
    interface Account {
      role: 'admin' | 'editor' | 'viewer';
      bio: string | null;
      level?: 1 | 2 | 3;
    }
  `;
  const result = convertTypescriptToZod(ts);
  assert.equal(result.isValid, true);
  assert.ok(result.zodSchema.includes("role: z.enum(['admin', 'editor', 'viewer']),"));
  assert.ok(result.zodSchema.includes("bio: z.string().nullable(),"));
  assert.ok(result.zodSchema.includes("level: z.union([z.literal(1), z.literal(2), z.literal(3)]).optional(),"));
});

test('typescriptToZod: converts nested inline objects', () => {
  const ts = `
    interface Order {
      orderId: string;
      shipping: {
        street: string;
        city: string;
        postalCode: number;
      };
    }
  `;
  const result = convertTypescriptToZod(ts);
  assert.equal(result.isValid, true);
  assert.ok(result.zodSchema.includes("street: z.string(),"));
  assert.ok(result.zodSchema.includes("city: z.string(),"));
  assert.ok(result.zodSchema.includes("postalCode: z.number(),"));
});

test('typescriptToZod: produces warnings for unsupported generics and mapped types', () => {
  const ts = `
    interface ApiResponse<T> {
      data: T;
      status: number;
    }
  `;
  const result = convertTypescriptToZod(ts);
  assert.ok(result.warnings.some((w) => w.includes('Generics')));
});

test('typescriptToZod: security - never executes code and safely parses malicious code strings', () => {
  const maliciousTs = `
    interface Exploit {
      field: string; // process.exit(1);
      evil: eval("malicious");
    }
  `;
  // Should parse as string manipulation without executing anything
  const result = convertTypescriptToZod(maliciousTs);
  assert.ok(result.zodSchema.includes('field: z.string(),'));
  assert.ok(!result.zodSchema.includes('process.exit'));
});

test('typescriptToZod: handles empty and malformed input gracefully', () => {
  const emptyRes = convertTypescriptToZod('');
  assert.equal(emptyRes.isValid, false);
  assert.equal(emptyRes.fieldCount, 0);

  const invalidRes = convertTypescriptToZod('just some random words that are not interfaces');
  assert.equal(invalidRes.isValid, false);
});
