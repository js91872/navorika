import type { GuideFAQ, GuideSection } from './guideContent';

type Enhancement = { sections: GuideSection[]; faqs: GuideFAQ[] };

export const guideContentEnhancements: Record<string, Enhancement> = {
  'base64-encoding-guide': {
    sections: [
      { title: 'Text encoding comes before Base64', content: 'To encode text, software first converts characters into bytes—commonly UTF-8—then converts those bytes to Base64 symbols. Different character encodings can produce different byte sequences, so Unicode handling matters when decoded text looks corrupted.' },
      { title: 'Standard Base64 and Base64url', content: 'Standard Base64 uses plus and slash and may include equals padding. Base64url replaces characters that are awkward in URLs and often omits padding. JWT segments use Base64url, so a standard decoder may need normalization.' },
      { title: 'Security and size implications', content: 'Base64 is reversible encoding, not encryption, hashing, or anonymization. It expands binary data by roughly one third before surrounding markup overhead. Avoid placing secrets in Base64 under the assumption that they are protected.' },
    ],
    faqs: [
      { question: 'Why does Base64 sometimes end with equals signs?', answer: 'Padding aligns the final encoded group when the source byte count is not divisible by three.' },
      { question: 'Can Base64 safely hide a password?', answer: 'No. Anyone can decode it. Use appropriate encryption and credential-storage practices.' },
    ],
  },
  'qr-code-guide': {
    sections: [
      { title: 'Capacity, size, and error correction', content: 'More data requires more modules, producing a denser code that needs a larger printed or displayed size. Higher error correction can tolerate more damage but also increases density. Keep payloads concise and test at the final physical dimensions.' },
      { title: 'Design for reliable scanning', content: 'Maintain strong contrast, a clear quiet zone, square geometry, and adequate size. Avoid busy backgrounds, extreme colour combinations, stretched codes, and oversized centre logos. Test several phones, distances, lighting conditions, and print samples.' },
      { title: 'Security and destination hygiene', content: 'A QR code can conceal a malicious destination as easily as a legitimate one. Use HTTPS, show a recognizable destination near the code, maintain redirected links, and avoid encoding secrets. Scanners should preview and verify a destination before opening it.' },
    ],
    faqs: [
      { question: 'Why will my QR code not scan?', answer: 'Common causes are insufficient quiet zone, low contrast, excessive density, distortion, small size, damage, or an obstructive logo.' },
      { question: 'Can a printed QR destination be changed?', answer: 'Only if the printed payload points to a redirect or managed dynamic link that you control.' },
    ],
  },
  'jwt-decoding-guide': {
    sections: [
      { title: 'Decoding is not verification', content: 'JWT header and payload segments are Base64url-encoded and can be read without a secret. Their contents are untrusted until the signature, expected algorithm, issuer, audience, and relevant time claims have been validated by the receiving system.' },
      { title: 'Claims and validation context', content: 'Common registered claims include issuer, subject, audience, expiration, not-before time, and issued-at time. Correct validation depends on the application: the same syntactically valid token may be unacceptable for a different API or audience.' },
      { title: 'Safe inspection practices', content: 'Do not paste live access or identity tokens into unknown websites because tokens can grant account access. Prefer a trusted local decoder, redact examples, rotate exposed credentials, and never place secrets or sensitive personal data in a payload merely because it is encoded.' },
    ],
    faqs: [
      { question: 'Can I trust a JWT after decoding it?', answer: 'No. Decoding only reveals claims. The application must verify the signature and validation rules.' },
      { question: 'Is the JWT payload encrypted?', answer: 'A normal signed JWT is not encrypted. Anyone holding it can usually read the header and payload.' },
    ],
  },
};
