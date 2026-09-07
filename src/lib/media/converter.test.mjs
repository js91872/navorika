import test from "node:test";
import assert from "node:assert";
import fs from "node:fs";
import vm from "node:vm";

test("FFmpeg Core: loads WebAssembly binaries and verifies codecs", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");

  const context = {
    console,
    setTimeout,
    clearTimeout,
    WebAssembly,
    Uint8Array,
    ArrayBuffer,
    JSON,
    Math,
    Date,
    btoa,
    atob,
    TextEncoder,
    TextDecoder,
    performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  assert.ok(core, "FFmpeg core should initialize");

  const logs = [];
  core.setLogger((l) => logs.push(l.message));

  core.exec("-encoders");
  assert.strictEqual(core.ret, 0);
  const encLog = logs.join("\n");
  assert.ok(encLog.includes("libmp3lame"), "Should have libmp3lame MP3 encoder");
  assert.ok(encLog.includes("aac"), "Should have aac encoder");
  assert.ok(encLog.includes("pcm_s16le"), "Should have pcm_s16le encoder");

  logs.length = 0;
  core.reset();
  core.exec("-decoders");
  assert.strictEqual(core.ret, 0);
  const decLog = logs.join("\n");
  assert.ok(decLog.includes("mp3"), "Should have mp3 decoder");
  assert.ok(decLog.includes("aac"), "Should have aac decoder");
  assert.ok(decLog.includes("pcm_s16le"), "Should have pcm decoder");
});

test("FFmpeg Core Pipeline: transcode WAV -> MP3 fixture", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");
  const context = {
    console, setTimeout, clearTimeout, WebAssembly, Uint8Array, ArrayBuffer,
    JSON, Math, Date, btoa, atob, TextEncoder, TextDecoder, performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  const wavBytes = fs.readFileSync("src/lib/media/__fixtures__/test.wav");
  core.FS.writeFile("in.wav", new Uint8Array(wavBytes));
  core.exec("-nostdin", "-y", "-i", "in.wav", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "out.mp3");
  assert.strictEqual(core.ret, 0);
  const mp3 = core.FS.readFile("out.mp3");
  assert.ok(mp3.length > 5000, "MP3 file should be valid size");
});

test("FFmpeg Core Pipeline: transcode MP4 -> MP3 fixture", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");
  const context = {
    console, setTimeout, clearTimeout, WebAssembly, Uint8Array, ArrayBuffer,
    JSON, Math, Date, btoa, atob, TextEncoder, TextDecoder, performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  const mp4Bytes = fs.readFileSync("src/lib/media/__fixtures__/test.mp4");
  core.FS.writeFile("in.mp4", new Uint8Array(mp4Bytes));
  core.exec("-nostdin", "-y", "-i", "in.mp4", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "out_mp4.mp3");
  assert.strictEqual(core.ret, 0);
  const mp3 = core.FS.readFile("out_mp4.mp3");
  assert.ok(mp3.length > 5000, "MP3 file from MP4 should be valid size");
});

test("FFmpeg Core Pipeline: transcode WEBM -> MP3 fixture", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");
  const context = {
    console, setTimeout, clearTimeout, WebAssembly, Uint8Array, ArrayBuffer,
    JSON, Math, Date, btoa, atob, TextEncoder, TextDecoder, performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  const bytes = fs.readFileSync("src/lib/media/__fixtures__/test.webm");
  core.FS.writeFile("in.webm", new Uint8Array(bytes));
  core.exec("-nostdin", "-y", "-i", "in.webm", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "out_webm.mp3");
  assert.strictEqual(core.ret, 0);
  const mp3 = core.FS.readFile("out_webm.mp3");
  assert.ok(mp3.length > 3000);
});

test("FFmpeg Core Pipeline: transcode MOV -> MP3 fixture", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");
  const context = {
    console, setTimeout, clearTimeout, WebAssembly, Uint8Array, ArrayBuffer,
    JSON, Math, Date, btoa, atob, TextEncoder, TextDecoder, performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  const bytes = fs.readFileSync("src/lib/media/__fixtures__/test.mov");
  core.FS.writeFile("in.mov", new Uint8Array(bytes));
  core.exec("-nostdin", "-y", "-i", "in.mov", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "out_mov.mp3");
  assert.strictEqual(core.ret, 0);
  const mp3 = core.FS.readFile("out_mov.mp3");
  assert.ok(mp3.length > 3000);
});

test("FFmpeg Core Pipeline: transcode M4A -> MP3 fixture", async () => {
  const wasmBinary = fs.readFileSync("./public/ffmpeg/ffmpeg-core.wasm");
  const code = fs.readFileSync("./public/ffmpeg/ffmpeg-core.js", "utf8");
  const context = {
    console, setTimeout, clearTimeout, WebAssembly, Uint8Array, ArrayBuffer,
    JSON, Math, Date, btoa, atob, TextEncoder, TextDecoder, performance
  };
  context.self = context;
  context.location = { href: "http://localhost/ffmpeg/ffmpeg-core.js" };
  vm.createContext(context);
  vm.runInContext(code, context);

  const core = await context.createFFmpegCore({ wasmBinary });
  const bytes = fs.readFileSync("src/lib/media/__fixtures__/test.m4a");
  core.FS.writeFile("in.m4a", new Uint8Array(bytes));
  core.exec("-nostdin", "-y", "-i", "in.m4a", "-vn", "-c:a", "libmp3lame", "-b:a", "192k", "out_m4a.mp3");
  assert.strictEqual(core.ret, 0);
  const mp3 = core.FS.readFile("out_m4a.mp3");
  assert.ok(mp3.length > 3000);
});
