import test from 'node:test';
import assert from 'node:assert/strict';
import {
  validatePdfBuffer,
  isLikelyScannedText,
  tokenizeWords,
  diffWords,
  comparePageTexts,
  compareDocuments,
  computeVisualPixelDiff,
  generateTextComparisonReport,
  generateJsonComparisonReport,
} from './pdfCompare.ts';

test('pdfCompare: 1. validates PDF header and rejects corrupted buffers', () => {
  // Valid PDF magic header %PDF- (0x25, 0x50, 0x44, 0x46, 0x2D)
  const validHeader = new Uint8Array([0x25, 0x50, 0x44, 0x46, 0x2d, 0x31, 0x2e, 0x37]);
  assert.equal(validatePdfBuffer(validHeader).valid, true);

  // ArrayBuffer variant
  assert.equal(validatePdfBuffer(validHeader.buffer).valid, true);

  // Corrupted / wrong header (e.g. PNG magic bytes or random bytes)
  const pngHeader = new Uint8Array([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const corruptResult = validatePdfBuffer(pngHeader);
  assert.equal(corruptResult.valid, false);
  assert.match(corruptResult.error, /Missing standard %PDF- identifier/);

  // Truncated / empty buffer
  assert.equal(validatePdfBuffer(new Uint8Array([])).valid, false);
  assert.equal(validatePdfBuffer(new Uint8Array([0x25, 0x50])).valid, false);
  assert.equal(validatePdfBuffer(null).valid, false);
});

test('pdfCompare: 2. identical documents report 100% similarity and 0 changes', () => {
  const origDoc = {
    name: 'contract_v1.pdf',
    size: 45000,
    pages: [
      { pageNumber: 1, text: 'This Agreement is entered into on January 1, 2026 by and between Party A and Party B.' },
      { pageNumber: 2, text: 'Confidentiality shall remain binding for a period of five (5) years.' },
    ],
  };

  const revDoc = {
    name: 'contract_v1_copy.pdf',
    size: 45000,
    pages: [
      { pageNumber: 1, text: 'This Agreement is entered into on January 1, 2026 by and between Party A and Party B.' },
      { pageNumber: 2, text: 'Confidentiality shall remain binding for a period of five (5) years.' },
    ],
  };

  const summary = compareDocuments(origDoc, revDoc);
  assert.equal(summary.totalPages, 2);
  assert.equal(summary.identicalPages, 2);
  assert.equal(summary.modifiedPages, 0);
  assert.equal(summary.addedPages, 0);
  assert.equal(summary.removedPages, 0);
  assert.equal(summary.totalWordsAdded, 0);
  assert.equal(summary.totalWordsRemoved, 0);
  assert.equal(summary.overallSimilarityPercent, 100);
  assert.equal(summary.pages[0].status, 'identical');
  assert.equal(summary.pages[1].status, 'identical');
});

test('pdfCompare: 3. changed wording detects word additions, removals, and replacements', () => {
  const origText = 'The quarterly subscription fee shall be $500 per user billed annually.';
  const revText = 'The monthly subscription fee shall be $45 per user billed quarterly with discounts.';

  const page = comparePageTexts(1, origText, revText);
  assert.equal(page.status, 'modified');
  assert.ok(page.wordsRemoved > 0);
  assert.ok(page.wordsAdded > 0);
  assert.ok(page.wordsUnchanged > 0);
  assert.ok(page.similarityPercent < 100);
  assert.ok(page.similarityPercent > 0);

  // Check diff tokens contain removals and additions
  const deleteTokens = page.diffTokens.filter((t) => t.type === 'delete');
  const insertTokens = page.diffTokens.filter((t) => t.type === 'insert');
  const equalTokens = page.diffTokens.filter((t) => t.type === 'equal');

  assert.ok(deleteTokens.some((t) => t.value.includes('$500') || t.value.includes('quarterly')));
  assert.ok(insertTokens.some((t) => t.value.includes('$45') || t.value.includes('discounts')));
  assert.ok(equalTokens.some((t) => t.value.includes('subscription fee shall be')));
});

test('pdfCompare: 4. added pages are properly labeled with 100% inserted words', () => {
  const origDoc = {
    name: 'proposal_short.pdf',
    size: 20000,
    pages: [{ pageNumber: 1, text: 'Executive summary of the proposal.' }],
  };

  const revDoc = {
    name: 'proposal_extended.pdf',
    size: 60000,
    pages: [
      { pageNumber: 1, text: 'Executive summary of the proposal.' },
      { pageNumber: 2, text: 'Technical specification and architectural overview.' },
      { pageNumber: 3, text: 'Pricing schedule and payment milestones.' },
    ],
  };

  const summary = compareDocuments(origDoc, revDoc);
  assert.equal(summary.origPageCount, 1);
  assert.equal(summary.revPageCount, 3);
  assert.equal(summary.totalPages, 3);
  assert.equal(summary.identicalPages, 1);
  assert.equal(summary.addedPages, 2);
  assert.equal(summary.removedPages, 0);

  assert.equal(summary.pages[1].status, 'added');
  assert.equal(summary.pages[1].wordsAdded, 5); // Technical specification and architectural overview.
  assert.equal(summary.pages[1].wordsRemoved, 0);

  assert.equal(summary.pages[2].status, 'added');
  assert.equal(summary.pages[2].wordsAdded, 5); // Pricing schedule and payment milestones.
});

test('pdfCompare: 5. removed pages are properly labeled with 100% removed words', () => {
  const origDoc = {
    name: 'full_report.pdf',
    size: 55000,
    pages: [
      { pageNumber: 1, text: 'Chapter 1: Foundations and core methodology.' },
      { pageNumber: 2, text: 'Chapter 2: Deprecated legacy workflow documentation.' },
      { pageNumber: 3, text: 'Chapter 3: Final conclusions and appendix.' },
    ],
  };

  const revDoc = {
    name: 'abridged_report.pdf',
    size: 35000,
    pages: [
      { pageNumber: 1, text: 'Chapter 1: Foundations and core methodology.' },
      { pageNumber: 2, text: 'Chapter 2: Deprecated legacy workflow documentation.' },
    ],
  };

  const summary = compareDocuments(origDoc, revDoc);
  assert.equal(summary.origPageCount, 3);
  assert.equal(summary.revPageCount, 2);
  assert.equal(summary.totalPages, 3);
  assert.equal(summary.identicalPages, 2);
  assert.equal(summary.removedPages, 1);
  assert.equal(summary.addedPages, 0);

  assert.equal(summary.pages[2].status, 'removed');
  assert.equal(summary.pages[2].wordsRemoved, 6); // Chapter 3: Final conclusions and appendix.
  assert.equal(summary.pages[2].wordsAdded, 0);
  assert.equal(summary.pages[2].similarityPercent, 0);
});

test('pdfCompare: 6. empty text layers and scanned pages handled honestly without false OCR claims', () => {
  assert.equal(isLikelyScannedText(''), true);
  assert.equal(isLikelyScannedText('   \n\t  \r\n '), true);
  assert.equal(isLikelyScannedText('Selectable OCR or vector text'), false);

  const scannedOrig = {
    name: 'scanned_archive.pdf',
    size: 2000000,
    pages: [
      { pageNumber: 1, text: '' }, // Scanned image page 1
      { pageNumber: 2, text: '   ' }, // Scanned image page 2
    ],
  };

  const scannedRev = {
    name: 'scanned_archive_v2.pdf',
    size: 2050000,
    pages: [
      { pageNumber: 1, text: '' },
      { pageNumber: 2, text: '' },
    ],
  };

  const summary = compareDocuments(scannedOrig, scannedRev);
  assert.equal(summary.scannedPages, 2);
  assert.equal(summary.pages[0].isOrigScanned, true);
  assert.equal(summary.pages[0].isRevScanned, true);
  assert.equal(summary.pages[0].status, 'scanned');

  // Verify text report includes honest scan disclosure
  const reportText = generateTextComparisonReport(summary);
  assert.match(reportText, /Scanned image detected\. Text comparison requires OCR/);
});

test('pdfCompare: 7. handles differing layouts, punctuation, and extra whitespace', () => {
  const orig = 'Heading\n\nParagraph with   extra   spaces\tand tabs.\n\nFooter note.';
  const rev = 'Heading Paragraph with extra spaces and tabs. Footer note.';

  const origTokens = tokenizeWords(orig);
  const revTokens = tokenizeWords(rev);
  assert.deepEqual(origTokens, revTokens);

  const diff = diffWords(origTokens, revTokens);
  assert.equal(diff.length, 1);
  assert.equal(diff[0].type, 'equal');
});

test('pdfCompare: 8. visual pixel diff detects changed pixels, calculates %, and detects bounding boxes', () => {
  const width = 100;
  const height = 100;
  const totalPixels = width * height;

  // 100x100 white image
  const imgA = new Uint8ClampedArray(totalPixels * 4);
  const imgB = new Uint8ClampedArray(totalPixels * 4);

  for (let i = 0; i < totalPixels * 4; i += 4) {
    imgA[i] = 255; imgA[i + 1] = 255; imgA[i + 2] = 255; imgA[i + 3] = 255;
    imgB[i] = 255; imgB[i + 1] = 255; imgB[i + 2] = 255; imgB[i + 3] = 255;
  }

  // Identical comparison
  const identicalResult = computeVisualPixelDiff(imgA, imgB, width, height);
  assert.equal(identicalResult.result.isIdentical, true);
  assert.equal(identicalResult.result.diffPixelCount, 0);
  assert.equal(identicalResult.result.diffPercentage, 0);

  // Modify a 10x10 black square in imgB at (20, 20)
  for (let y = 20; y < 30; y++) {
    for (let x = 20; x < 30; x++) {
      const idx = (y * width + x) * 4;
      imgB[idx] = 0; imgB[idx + 1] = 0; imgB[idx + 2] = 0; imgB[idx + 3] = 255;
    }
  }

  const modifiedResult = computeVisualPixelDiff(imgA, imgB, width, height, { sensitivityThreshold: 20 });
  assert.equal(modifiedResult.result.isIdentical, false);
  assert.equal(modifiedResult.result.diffPixelCount, 100); // 10x10
  assert.equal(modifiedResult.result.diffPercentage, 1.0); // 100 / 10000 = 1%
  assert.ok(modifiedResult.result.boundingBoxes.length > 0);
  assert.ok(modifiedResult.diffImageData !== undefined);

  // Sensitivity test: high threshold ignores moderate change
  const tolerantResult = computeVisualPixelDiff(imgA, imgB, width, height, { sensitivityThreshold: 260 });
  assert.equal(tolerantResult.result.diffPixelCount, 0);
});

test('pdfCompare: 9. reports generate valid formatted text and JSON exports', () => {
  const origDoc = {
    name: 'specs_v1.pdf',
    size: 30000,
    pages: [{ pageNumber: 1, text: 'Alpha feature release specification.' }],
  };
  const revDoc = {
    name: 'specs_v2.pdf',
    size: 34000,
    pages: [{ pageNumber: 1, text: 'Beta feature release specification with security enhancements.' }],
  };

  const summary = compareDocuments(origDoc, revDoc, '2026-11-04T12:00:00Z');
  const textReport = generateTextComparisonReport(summary);

  assert.match(textReport, /NAVORIKA PDF COMPARISON REPORT/);
  assert.match(textReport, /specs_v1\.pdf/);
  assert.match(textReport, /specs_v2\.pdf/);
  assert.match(textReport, /Words Added/);
  assert.match(textReport, /Words Removed/);
  assert.match(textReport, /\[\+\] "specification with security enhancements\."/);

  const jsonReport = generateJsonComparisonReport(summary);
  const parsed = JSON.parse(jsonReport);
  assert.equal(parsed.origFileName, 'specs_v1.pdf');
  assert.equal(parsed.revFileName, 'specs_v2.pdf');
  assert.equal(parsed.pages.length, 1);
  assert.equal(parsed.pages[0].status, 'modified');
});
