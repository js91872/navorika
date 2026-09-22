import test from 'node:test';
import assert from 'node:assert/strict';
import {
  tokenizeWords,
  countWords,
  countCharacters,
  countSentences,
  countParagraphs,
  computeReadingTime,
  computeSpeakingTime,
  formatCompactPages,
  detectRepeatedHeadersAndFooters,
  stripHeadersAndFooters,
  computeWordFrequencies,
  computePhrases,
  computeReadability,
  analyzeWritingQuality,
  analyzeDocument,
  DEFAULT_COUNTING_OPTIONS,
} from './pdfWordCounter.ts';
import { rowsToCsv } from '../resultExport.ts';

test('pdfWordCounter: 1. basic English word counting', () => {
  const text = 'The quick brown fox jumps over the lazy dog.';
  const words = tokenizeWords(text);
  assert.equal(words.length, 9);
  assert.equal(countWords(text), 9);
  assert.equal(countWords('hello world'), 2);
  assert.equal(countWords("don't stop"), 2);
});

test('pdfWordCounter: 2. multiple spaces and line breaks', () => {
  const text = '   Paragraph   one   with   extra    spaces.\n\n\n   Paragraph  two\r\nwith  newlines.  ';
  const words = tokenizeWords(text);
  assert.equal(words.length, 9);
  assert.equal(countWords(text), 9);
  const chars = countCharacters(text);
  assert.ok(chars.withSpaces > chars.withoutSpaces);
  assert.equal(countParagraphs(text), 2);
});

test('pdfWordCounter: 3. numbers included and excluded', () => {
  const text = 'In 2026, revenue increased by 15.5% to $1,000,000 across 42 quarters.';
  const withNums = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeNumbers: true });
  const withoutNums = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeNumbers: false });
  assert.ok(withNums.includes('2026'));
  assert.ok(withNums.includes('15.5%'));
  assert.ok(withNums.includes('$1,000,000'));
  assert.ok(withNums.includes('42'));
  assert.ok(!withoutNums.includes('2026'));
  assert.ok(!withoutNums.includes('15.5%'));
  assert.ok(!withoutNums.includes('$1,000,000'));
  assert.ok(!withoutNums.includes('42'));
  assert.equal(withoutNums.length, withNums.length - 4);
});

test('pdfWordCounter: 4. URLs included and excluded', () => {
  const text = 'Visit https://navorika.com and www.example.org for free tools.';
  const withoutUrls = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeUrls: false });
  const withUrls = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeUrls: true });
  assert.ok(withUrls.includes('https://navorika.com'));
  assert.ok(withUrls.includes('www.example.org'));
  assert.ok(!withoutUrls.includes('https://navorika.com'));
  assert.ok(!withoutUrls.includes('www.example.org'));
  assert.equal(withUrls.length, withoutUrls.length + 2);
});

test('pdfWordCounter: 5. email addresses included and excluded', () => {
  const text = 'Contact support@navorika.com or team+feedback@example.co.uk today.';
  const withoutEmails = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeEmails: false });
  const withEmails = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, includeEmails: true });
  assert.ok(withEmails.includes('support@navorika.com'));
  assert.ok(withEmails.includes('team+feedback@example.co.uk'));
  assert.ok(!withoutEmails.includes('support@navorika.com'));
  assert.equal(withEmails.length, withoutEmails.length + 2);
});

test('pdfWordCounter: 6. hyphenated-word behavior', () => {
  const text = 'This is a state-of-the-art, well-known machine-learning system.';
  const single = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, hyphenatedWordMode: 'single' });
  const split = tokenizeWords(text, { ...DEFAULT_COUNTING_OPTIONS, hyphenatedWordMode: 'split' });
  assert.ok(single.includes('state-of-the-art'));
  assert.ok(single.includes('well-known'));
  assert.ok(single.includes('machine-learning'));
  assert.equal(single.length, 7);
  assert.ok(split.includes('state'));
  assert.ok(split.includes('art'));
  assert.ok(split.includes('well'));
  assert.ok(split.includes('known'));
  assert.ok(split.length > single.length);
});

test('pdfWordCounter: 7. punctuation handling', () => {
  const text = '“Hello,” she said (quietly): ‘It’s ready… right?!’ [Yes]';
  const words = tokenizeWords(text);
  assert.ok(words.includes('Hello'));
  assert.ok(words.includes('she'));
  assert.ok(words.includes('said'));
  assert.ok(words.includes('quietly'));
  assert.ok(words.includes('It’s') || words.includes("It's"));
  assert.ok(words.includes('ready'));
  assert.ok(words.includes('right'));
  assert.ok(words.includes('Yes'));
  assert.ok(!words.some((w) => /[“”（）()\[\]:;?!]/u.test(w)));
});

test('pdfWordCounter: 8. Unicode letters and accented words', () => {
  const text = 'Café crème brûlée, Über-mensch, and façade naïve.';
  const words = tokenizeWords(text);
  assert.ok(words.includes('Café'));
  assert.ok(words.includes('crème'));
  assert.ok(words.includes('brûlée'));
  assert.ok(words.includes('façade'));
  assert.ok(words.includes('naïve'));
  assert.equal(words.length, 7);
});

test('pdfWordCounter: 9. page-level totals equal document totals', () => {
  const pages = [
    { pageNumber: 1, text: 'First page text contains five words.' },
    { pageNumber: 2, text: 'Second page adds another six distinct words.' },
    { pageNumber: 3, text: 'Third page completes the three page document.' },
  ];
  const result = analyzeDocument(pages);
  const sumWords = result.pageMetrics.reduce((acc, p) => acc + p.words, 0);
  const sumCharsWithSpaces = result.pageMetrics.reduce((acc, p) => acc + p.charactersWithSpaces, 0);
  const sumCharsWithoutSpaces = result.pageMetrics.reduce((acc, p) => acc + p.charactersWithoutSpaces, 0);
  const sumSentences = result.pageMetrics.reduce((acc, p) => acc + p.sentences, 0);

  assert.equal(sumWords, result.totalWords);
  assert.equal(sumCharsWithSpaces, result.charactersWithSpaces);
  assert.equal(sumCharsWithoutSpaces, result.charactersWithoutSpaces);
  assert.equal(sumSentences, result.totalSentences);
  assert.equal(result.totalPages, 3);
  assert.equal(result.pagesWithText, 3);
});

test('pdfWordCounter: 10. unique-word calculation', () => {
  const pages = [
    { pageNumber: 1, text: 'apple banana orange apple' },
    { pageNumber: 2, text: 'banana grape apple' },
  ];
  const result = analyzeDocument(pages);
  // Total tokens: apple(3), banana(2), orange(1), grape(1) = 7 words, 4 unique
  assert.equal(result.totalWords, 7);
  assert.equal(result.uniqueWords, 4);
  assert.equal(result.lexicalDensity, Number(((4 / 7) * 100).toFixed(1)));
});

test('pdfWordCounter: 11. stop-word filtering', () => {
  const pages = [{ pageNumber: 1, text: 'The fox is in the box and under the tree.' }];
  const excluded = analyzeDocument(pages, { ...DEFAULT_COUNTING_OPTIONS, stopWordsFilter: 'exclude' });
  const included = analyzeDocument(pages, { ...DEFAULT_COUNTING_OPTIONS, stopWordsFilter: 'include' });

  const excludedWordList = excluded.wordFrequencies.map((f) => f.word);
  const includedWordList = included.wordFrequencies.map((f) => f.word);

  assert.ok(!excludedWordList.includes('the'));
  assert.ok(!excludedWordList.includes('is'));
  assert.ok(!excludedWordList.includes('in'));
  assert.ok(excludedWordList.includes('fox'));
  assert.ok(excludedWordList.includes('box'));
  assert.ok(excludedWordList.includes('tree'));

  assert.ok(includedWordList.includes('the'));
  assert.ok(includedWordList.includes('is'));
});

test('pdfWordCounter: 12. case-sensitive and insensitive frequencies', () => {
  const pages = [{ pageNumber: 1, text: 'Apple apple APPLE pear' }];
  const insensitive = analyzeDocument(pages, { ...DEFAULT_COUNTING_OPTIONS, caseSensitiveFrequency: false, stopWordsFilter: 'include' });
  const sensitive = analyzeDocument(pages, { ...DEFAULT_COUNTING_OPTIONS, caseSensitiveFrequency: true, stopWordsFilter: 'include' });

  const appleInsensitive = insensitive.wordFrequencies.find((f) => f.word === 'apple');
  assert.equal(appleInsensitive?.count, 3);

  const appleSensitive = sensitive.wordFrequencies.filter((f) => f.word.toLowerCase() === 'apple');
  assert.equal(appleSensitive.length, 3);
});

test('pdfWordCounter: 13. bigram and trigram generation', () => {
  const pages = [
    { pageNumber: 1, text: 'climate change mitigation and climate change adaptation' },
    { pageNumber: 2, text: 'climate change policies require action' },
  ];
  const result = analyzeDocument(pages);
  const topBigram = result.twoWordPhrases.find((p) => p.phrase === 'climate change');
  assert.ok(topBigram);
  assert.equal(topBigram.count, 3);

  // Bigrams should not cross from end of page 1 to start of page 2
  const crossPageBigram = result.twoWordPhrases.find((p) => p.phrase === 'adaptation climate');
  assert.equal(crossPageBigram, undefined);
});

test('pdfWordCounter: 14. consecutive duplicate-word detection', () => {
  const pages = [
    { pageNumber: 1, text: 'We went to the the store in New York.' },
    { pageNumber: 2, text: 'They had had enough coffee.' },
  ];
  const quality = analyzeWritingQuality(pages);
  const dupes = quality.issues.filter((i) => i.type === 'consecutive-duplicate');
  assert.ok(dupes.some((d) => d.excerpt.includes('the the') && d.pageNumber === 1));
  assert.ok(dupes.some((d) => d.excerpt.includes('had had') && d.pageNumber === 2));
});

test('pdfWordCounter: 15. readability does not crash on short or empty text', () => {
  const empty = computeReadability([], 0);
  assert.equal(empty.fleschReadingEase, 0);
  assert.equal(empty.fleschKincaidGradeLevel, 0);
  assert.ok(empty.readabilityInterpretation.includes('Insufficient text'));

  const shortWords = ['Hi'];
  const shortResult = computeReadability(shortWords, 1);
  assert.ok(!Number.isNaN(shortResult.fleschReadingEase));
  assert.ok(!Number.isNaN(shortResult.fleschKincaidGradeLevel));
});

test('pdfWordCounter: 16. empty PDF-text and scanned detection', () => {
  const emptyPages = [
    { pageNumber: 1, text: '   \n  ' },
    { pageNumber: 2, text: '' },
  ];
  const result = analyzeDocument(emptyPages);
  assert.equal(result.totalWords, 0);
  assert.equal(result.isLikelyScanned, true);
  assert.deepEqual(result.scannedPages, [1, 2]);
  assert.equal(result.pagesWithText, 0);
});

test('pdfWordCounter: 17. page-range filtering', () => {
  const pages = [
    { pageNumber: 1, text: 'Page one has four words.' },
    { pageNumber: 2, text: 'Page two has four words.' },
    { pageNumber: 3, text: 'Page three has five words here.' },
    { pageNumber: 4, text: 'Page four has five words too.' },
  ];
  const filtered = analyzeDocument(pages, { ...DEFAULT_COUNTING_OPTIONS, pageRange: [2, 3] });
  assert.equal(filtered.totalPages, 4);
  assert.equal(filtered.pageMetrics.length, 2);
  assert.equal(filtered.pageMetrics[0].pageNumber, 2);
  assert.equal(filtered.pageMetrics[1].pageNumber, 3);
  assert.equal(filtered.totalWords, 11);
});

test('pdfWordCounter: 18. CSV escaping and formatting', () => {
  const rows = [
    ['Word', 'Count', 'Percentage', 'Note'],
    ['well-known', 5, '12.5%', 'Contains "quotes" and, commas'],
    ['standard', 2, '5.0%', 'Line 1\nLine 2'],
  ];
  const csv = rowsToCsv(rows);
  assert.ok(csv.includes('"Contains ""quotes"" and, commas"'));
  assert.ok(csv.includes('"Line 1\nLine 2"'));
});

test('pdfWordCounter: 19. very large frequency lists and compact page formatting', () => {
  assert.equal(formatCompactPages([1, 2, 3, 5, 7, 8, 9, 12]), '1-3, 5, 7-9, 12');
  assert.equal(formatCompactPages([4]), '4');
  assert.equal(formatCompactPages([]), '');

  // Generate 1000 distinct words
  const words = Array.from({ length: 1000 }, (_, i) => `term${i}`);
  const pages = [{ pageNumber: 1, words }];
  const freqs = computeWordFrequencies(pages, { ...DEFAULT_COUNTING_OPTIONS, minWordLength: 1 });
  assert.equal(freqs.length, 1000);
});

test('pdfWordCounter: 20. header and footer detection and removal preserves body text', () => {
  const pages = [
    { pageNumber: 1, text: 'Header: Confidential Annual Report\nFirst body paragraph here.\nHeader: Confidential Annual Report\nFooter: Page 1 of 3' },
    { pageNumber: 2, text: 'Header: Confidential Annual Report\nSecond body paragraph here.\nFooter: Page 2 of 3' },
    { pageNumber: 3, text: 'Header: Confidential Annual Report\nThird body paragraph here.\nFooter: Page 3 of 3' },
  ];
  const { headerLines } = detectRepeatedHeadersAndFooters(pages);
  assert.ok(headerLines.has('Header: Confidential Annual Report'));

  const stripped = stripHeadersAndFooters(pages[0].text, headerLines, new Set(['Footer: Page 1 of 3']));
  assert.ok(!stripped.startsWith('Header: Confidential Annual Report'));
  assert.ok(stripped.includes('First body paragraph here.'));
  // Confirm that ordinary body text matching the header phrase is preserved
  assert.ok(stripped.includes('Header: Confidential Annual Report'));
});

test('pdfWordCounter: 21. reading and speaking time metrics', () => {
  const reading = computeReadingTime(450, 225); // exactly 2 minutes
  assert.equal(reading.minutes, 2);
  assert.equal(reading.seconds, 0);
  assert.equal(reading.formatted, '2 min');

  const speaking = computeSpeakingTime(65, 130); // 30 seconds
  assert.equal(speaking.minutes, 0);
  assert.equal(speaking.seconds, 30);
  assert.equal(speaking.formatted, '30 sec');
});

test('pdfWordCounter: 22. in-memory synchronous execution and zero network requests during analysis', () => {
  let networkCallAttempted = false;
  const originalFetch = globalThis.fetch;
  globalThis.fetch = () => {
    networkCallAttempted = true;
    throw new Error('Network call attempted during local analysis');
  };

  try {
    const sample = [{ pageNumber: 1, text: 'Local in-memory text verification.' }];
    const res = analyzeDocument(sample);
    assert.equal(res.totalWords, 4);
    assert.ok(res.extractedText.includes('Local in-memory text verification.'));
    assert.equal(networkCallAttempted, false);
  } finally {
    globalThis.fetch = originalFetch;
  }
});
