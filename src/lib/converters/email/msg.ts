import * as CFB from 'cfb';
import type { Address, Email, Mailbox } from 'postal-mime';
import { addresses, attachmentBytes } from './email';

const utf16 = (s: string) => {
  const b = new Uint8Array(s.length * 2);
  const v = new DataView(b.buffer);
  for (let i = 0; i < s.length; i++) v.setUint16(i * 2, s.charCodeAt(i), true);
  return b;
};
const hex = (n: number, width = 8) =>
  n.toString(16).toUpperCase().padStart(width, '0');
const flatten = (list: Address[] = []): Mailbox[] =>
  list.flatMap((a) => (a.group ? a.group : [a]));

/** Unicode MS-OXMSG: compound file storages plus explicit MAPI property tables. */
export function emailToMsg(
  email: Email,
  text: string,
  safeHtml: string,
): Uint8Array {
  const cfb = CFB.utils.cfb_new({
    root: 'Root Entry',
    CLSID: '00020D0B00000000C000000000000046',
  });
  cfb.FileIndex[0].clsid = '00020D0B00000000C000000000000046';
  function properties(path: string, header: Uint8Array) {
    const entries: Uint8Array[] = [];
    function entry(id: number, type: number) {
      const b = new Uint8Array(16);
      const v = new DataView(b.buffer);
      v.setUint32(0, (id * 65536 + type) >>> 0, true);
      v.setUint32(4, 6, true);
      entries.push(b);
      return v;
    }
    return {
      number(id: number, n: number, type = 3) {
        entry(id, type).setUint32(8, n, true);
      },
      date(id: number, date: string | undefined) {
        if (!date || !Number.isFinite(Date.parse(date)) || Date.parse(date) < -11644473600000) return;
        entry(id, 0x40).setBigUint64(
          8,
          (BigInt(Date.parse(date)) + BigInt(11644473600000)) * BigInt(10000),
          true,
        );
      },
      data(id: number, bytes: Uint8Array, type = 0x102) {
        const v = entry(id, type);
        v.setUint32(8, bytes.length + (type === 0x1f ? 2 : 0), true);
        CFB.utils.cfb_add(
          cfb,
          `${path}__substg1.0_${hex(id, 4)}${hex(type, 4)}`,
          bytes,
        );
      },
      string(id: number, value: string) {
        this.data(id, utf16(value), 0x1f);
      },
      finish() {
        const b = new Uint8Array(header.length + entries.length * 16);
        b.set(header);
        entries.forEach((e, i) => b.set(e, header.length + i * 16));
        CFB.utils.cfb_add(cfb, `${path}__properties_version1.0`, b);
      },
    };
  }
  const recipients = [
    ...flatten(email.to).map((a) => ({ a, type: 1 })),
    ...flatten(email.cc).map((a) => ({ a, type: 2 })),
    ...flatten(email.bcc).map((a) => ({ a, type: 3 })),
  ];
  const h = new Uint8Array(32);
  const v = new DataView(h.buffer);
  v.setUint32(8, recipients.length, true);
  v.setUint32(12, email.attachments.length, true);
  v.setUint32(16, recipients.length, true);
  v.setUint32(20, email.attachments.length, true);
  const p = properties('', h);
  p.string(0x001a, 'IPM.Note');
  p.string(0x0037, email.subject || '');
  p.string(0x0e1d, email.subject || '');
  p.string(0x1000, text);
  p.data(0x1013, new TextEncoder().encode(safeHtml));
  p.number(0x3fde, 65001);
  p.number(0x3ffd, 65001);
  p.number(0x0e07, 0x00000001 | (email.attachments.length ? 0x10 : 0));
  p.number(0x0e1b, email.attachments.length ? 1 : 0, 0x0b);
  p.number(0x340d, 0x00040000);
  const sender = flatten(email.from ? [email.from] : [])[0];
  if (sender) {
    p.string(0x0c1a, sender.name || sender.address);
    p.string(0x0c1e, 'SMTP');
    p.string(0x0c1f, sender.address);
    p.string(0x5d01, sender.address);
    p.string(0x0042, sender.name || sender.address);
    p.string(0x0064, 'SMTP');
    p.string(0x0065, sender.address);
  }
  p.string(0x0e04, addresses(email.to));
  p.string(0x0e03, addresses(email.cc));
  p.string(0x0e02, addresses(email.bcc));
  if (email.messageId) p.string(0x1035, email.messageId);
  p.string(0x007d, email.headerLines.map((h) => h.line).join('\r\n'));
  p.date(0x0039, email.date);
  p.date(0x0e06, email.date);
  p.finish();
  recipients.forEach(({ a, type }, i) => {
    const r = properties(`__recip_version1.0_#${hex(i)}/`, new Uint8Array(8));
    r.number(0x3000, i);
    r.number(0x0c15, type);
    r.string(0x3001, a.name || a.address);
    r.string(0x3002, 'SMTP');
    r.string(0x3003, a.address);
    r.string(0x39fe, a.address);
    r.finish();
  });
  email.attachments.forEach((a, i) => {
    const r = properties(`__attach_version1.0_#${hex(i)}/`, new Uint8Array(8));
    const bytes = attachmentBytes(a.content);
    r.number(0x0e21, i);
    r.number(0x3705, 1);
    r.number(0x0e20, bytes.length);
    r.number(0x370b, 0xffffffff);
    r.string(0x3704, a.filename || 'attachment');
    r.string(0x3707, a.filename || 'attachment');
    r.string(0x3001, a.filename || 'attachment');
    r.string(0x370e, a.mimeType);
    if (a.contentId) r.string(0x3712, a.contentId.replace(/^<|>$/g, ''));
    r.data(0x3701, bytes);
    r.finish();
  });
  for (const name of ['00020102', '00030102', '00040102'])
    CFB.utils.cfb_add(
      cfb,
      `__nameid_version1.0/__substg1.0_${name}`,
      new Uint8Array(0),
    );
  CFB.utils.cfb_del(cfb, '\u0001Sh33tJ5');
  return new Uint8Array(CFB.write(cfb, { type: 'array', fileType: 'cfb' }));
}
