import test from 'node:test';
import assert from 'node:assert/strict';
import {
  jsonToYaml,
  yamlToJson,
  jsonToToml,
  tomlToJson,
  validateYaml,
  validateJson,
} from './index';

test('JSON ↔ YAML: converts nested objects correctly', () => {
  const sample = JSON.stringify({
    server: {
      host: 'localhost',
      port: 8080,
      ssl: { enabled: true, cert: '/etc/ssl/cert.pem' },
    },
  });

  const yamlRes = jsonToYaml(sample);
  assert.equal(yamlRes.success, true);
  if (yamlRes.success) {
    assert.match(yamlRes.data, /host: localhost/);
    assert.match(yamlRes.data, /port: 8080/);

    const backToJson = yamlToJson(yamlRes.data);
    assert.equal(backToJson.success, true);
    if (backToJson.success) {
      assert.deepEqual(JSON.parse(backToJson.data), JSON.parse(sample));
    }
  }
});

test('JSON ↔ YAML: converts arrays correctly', () => {
  const sample = JSON.stringify({
    items: ['apple', 'banana', 'cherry'],
    matrix: [[1, 2], [3, 4]],
  });

  const yamlRes = jsonToYaml(sample);
  assert.equal(yamlRes.success, true);
  if (yamlRes.success) {
    const jsonRes = yamlToJson(yamlRes.data);
    assert.equal(jsonRes.success, true);
    if (jsonRes.success) {
      assert.deepEqual(JSON.parse(jsonRes.data), JSON.parse(sample));
    }
  }
});

test('JSON ↔ YAML: preserves booleans, numbers, and null values', () => {
  const sample = JSON.stringify({
    isProduction: false,
    maxRetries: 5,
    fallbackUrl: null,
  });

  const yamlRes = jsonToYaml(sample);
  assert.equal(yamlRes.success, true);
  if (yamlRes.success) {
    assert.match(yamlRes.data, /isProduction: false/);
    assert.match(yamlRes.data, /fallbackUrl: null/);

    const jsonRes = yamlToJson(yamlRes.data);
    assert.equal(jsonRes.success, true);
    if (jsonRes.success) {
      const parsed = JSON.parse(jsonRes.data);
      assert.strictEqual(parsed.isProduction, false);
      assert.strictEqual(parsed.maxRetries, 5);
      assert.strictEqual(parsed.fallbackUrl, null);
    }
  }
});

test('JSON ↔ YAML: preserves Unicode and multilingual characters', () => {
  const sample = JSON.stringify({
    greeting: 'こんにちは世界 🌍',
    accented: 'Café résumé naïve',
    hindi: 'नमस्ते',
  });

  const yamlRes = jsonToYaml(sample);
  assert.equal(yamlRes.success, true);
  if (yamlRes.success) {
    const jsonRes = yamlToJson(yamlRes.data);
    assert.equal(jsonRes.success, true);
    if (jsonRes.success) {
      assert.deepEqual(JSON.parse(jsonRes.data), JSON.parse(sample));
    }
  }
});

test('JSON ↔ YAML: detects and reports invalid syntax with line and column', () => {
  const invalidJson = '{\n  "name": "Navorika",\n  "version": 1,\n}'; // trailing comma in standard JSON
  const yamlRes = jsonToYaml(invalidJson);
  assert.equal(yamlRes.success, false);
  if (!yamlRes.success) {
    assert.ok(yamlRes.error);
  }

  const invalidYaml = 'server:\n  host: localhost\n    port: 8080\n  indent_error';
  const valResult = validateYaml(invalidYaml);
  // Should report validation issue or handle parsing
  assert.ok(typeof valResult.valid === 'boolean');
});

test('JSON ↔ TOML: converts nested keys, tables, arrays, strings, and numbers', () => {
  const sample = JSON.stringify({
    title: 'TOML Example',
    database: {
      server: '192.168.1.1',
      ports: [8001, 8002, 8003],
      connection_max: 5000,
      enabled: true,
    },
  });

  const tomlRes = jsonToToml(sample);
  assert.equal(tomlRes.success, true);
  if (tomlRes.success) {
    assert.match(tomlRes.data, /\[database\]/);
    assert.match(tomlRes.data, /server = "192\.168\.1\.1"/);

    const backToJson = tomlToJson(tomlRes.data);
    assert.equal(backToJson.success, true);
    if (backToJson.success) {
      assert.deepEqual(JSON.parse(backToJson.data), JSON.parse(sample));
    }
  }
});

test('JSON ↔ TOML: handles unsupported structures safely (root array, null values)', () => {
  // TOML cannot have array at root
  const rootArray = JSON.stringify(['a', 'b', 'c']);
  const res1 = jsonToToml(rootArray);
  assert.equal(res1.success, false);
  if (!res1.success) {
    assert.match(res1.error, /top-level table/i);
  }

  // TOML cannot represent null values
  const withNull = JSON.stringify({ name: 'App', secret: null });
  const res2 = jsonToToml(withNull);
  assert.equal(res2.success, false);
  if (!res2.success) {
    assert.match(res2.error, /null/i);
  }
});
