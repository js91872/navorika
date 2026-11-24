import test from 'node:test';
import assert from 'node:assert/strict';
import JSZip from 'jszip';
import MsgReader from '@kenjiuno/msgreader';
import { parseEmail, validateFiles, safeName } from './email';
import { emailToMsg } from './msg';
import { emailsToXlsx } from './xlsx';
const raw =
  'From: =?UTF-8?B?Sm9zw6k=?= <jose@example.com>\r\nTo: Team: Alice <alice@example.com>, Bob <bob@example.com>;\r\nCc: copy@example.com\r\nBcc: hidden@example.com\r\nSubject: =?UTF-8?B?UmV2aWV3IMOp?=\r\nDate: Tue, 10 Nov 2026 10:00:00 +0000\r\nMessage-ID: <review@example.com>\r\nMIME-Version: 1.0\r\nContent-Type: multipart/mixed; boundary="test"\r\n\r\n--test\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: quoted-printable\r\n\r\nHello =C3=A9\r\n--test\r\nContent-Type: application/octet-stream\r\nContent-Disposition: attachment; filename="report.bin"\r\nContent-Transfer-Encoding: base64\r\n\r\nAAECA/8=\r\n--test--\r\n';
test('MIME parser decodes Unicode, grouped recipients and binary attachments', async () => {
  const e = await parseEmail(raw);
  assert.equal(e.subject, 'Review é');
  assert.equal(e.from?.name, 'José');
  assert.match(e.text!, /Hello é/);
  assert.equal(e.attachments[0].filename, 'report.bin');
});
test('MSG round-trip through an independent reader preserves headers, recipients, body and attachment bytes', async () => {
  const e = await parseEmail(raw);
  const bytes = emailToMsg(e, e.text!, '<p>Hello é</p>');
  assert.deepEqual(
    [...bytes.slice(0, 8)],
    [208, 207, 17, 224, 161, 177, 26, 225],
  );
  const reader = new MsgReader(new Uint8Array(bytes).buffer);
  const out = reader.getFileData();
  assert.equal(out.subject, e.subject);
  assert.equal(out.senderEmail, 'jose@example.com');
  assert.equal(out.body, e.text);
  assert.equal(out.recipients?.length, 4);
  assert.equal(out.attachments?.length, 1);
  assert.deepEqual(
    [...reader.getAttachment(out.attachments![0]).content],
    [0, 1, 2, 3, 255],
  );
});
test('XLSX writes literal formula-like text, escapes XML and reports cell truncation', async () => {
  const e = await parseEmail(raw);
  e.subject = '=HYPERLINK("https://example.com") & <text>';
  const zip = await JSZip.loadAsync(
    await emailsToXlsx([
      { name: 'first.eml', email: e, text: 'a'.repeat(33000) },
    ]),
  );
  const sheet = await zip.file('xl/worksheets/sheet1.xml')!.async('string');
  assert.match(sheet, /t="inlineStr"/);
  assert.ok(!sheet.includes('<f>'));
  assert.match(sheet, /&amp; &lt;text&gt;/);
  assert.match(sheet, /Yes — Excel cell limit/);
  assert.ok(zip.file('[Content_Types].xml'));
});
test('limits reject wrong formats, empty and oversized files, invalid EML', async () => {
  assert.throws(() => validateFiles([{ name: 'fake.msg', size: 12 }]));
  assert.throws(() => validateFiles([{ name: 'empty.eml', size: 0 }]));
  assert.throws(() =>
    validateFiles(
      Array.from({ length: 51 }, () => ({ name: 'x.eml', size: 1 })),
    ),
  );
  assert.throws(() =>
    validateFiles([{ name: 'x.eml', size: 21 * 1024 * 1024 }]),
  );
  await assert.rejects(() => parseEmail('not an email'));
  assert.equal(safeName('../../email.eml'), '_.._email');
});
test('plain-text PDF retains literal punctuation, wraps long unbroken lines and paginates', async () => {
  const { emailTextToPdf } = await import('./pdf');
  const { PDFDocument } = await import('pdf-lib');
  const output = await emailTextToPdf(
    'Subject: # ABC_*_\n' + 'long-token_'.repeat(2000),
    'Sample',
  );
  const doc = await PDFDocument.load(output);
  assert.ok(doc.getPageCount() > 1);
  assert.equal(doc.getTitle(), 'Sample');
});
test('safe HTML strips tracking URLs, script, SVG, CSS, links and form behavior; DOCX is a genuine package', async () => {
  const { JSDOM } = await import('jsdom');
  const dom = new JSDOM('<!doctype html>');
  Object.defineProperty(globalThis, 'window', {
    value: dom.window,
    configurable: true,
  });
  Object.defineProperty(globalThis, 'document', {
    value: dom.window.document,
    configurable: true,
  });
  try {
    const { htmlDocument, bodyText } = await import('./html');
    const { exportEmail } = await import('./export');
    const email = await parseEmail(
      'From: a@example.com\r\nSubject: <script>unsafe</script>\r\nContent-Type: text/html; charset=utf-8\r\n\r\n<p>Hello <b>world</b></p><img src="https://tracker.invalid/pixel" onerror="alert(1)"><style>body{background:url(https://tracker.invalid/css)}</style><script>alert(1)</script><svg onload="alert(1)"></svg><a href="javascript:alert(1)">Link</a><form action="https://tracker.invalid"><input name="secret"></form><table><tr><td>One</td><td>Two</td></tr></table>',
    );
    const html = htmlDocument(email);
    assert.ok(!html.includes('tracker.invalid'));
    assert.ok(!html.includes('<script>'));
    assert.ok(!html.includes('<svg'));
    assert.ok(!html.includes('<form'));
    assert.ok(!html.includes('onerror'));
    assert.match(html, /&lt;script&gt;unsafe/);
    assert.match(html, /<b>world<\/b>/);
    assert.match(bodyText(email), /One\tTwo/);
    const zip = await JSZip.loadAsync(await exportEmail(email, 'word'));
    const xml = await zip.file('word/document.xml')!.async('string');
    assert.match(xml, /Hello/);
    assert.match(xml, /world/);
    assert.ok(zip.file('[Content_Types].xml'));
    assert.ok(
      !Object.keys(zip.files).some((p) => /vbaProject|embeddings\//.test(p)),
    );
  } finally {
    dom.window.close();
    Reflect.deleteProperty(globalThis, 'window');
    Reflect.deleteProperty(globalThis, 'document');
  }
});
