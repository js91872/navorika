/**
 * PDF Word Counter Calculation and Analysis Engine
 *
 * Centralized, pure TypeScript implementation for document text analysis,
 * counting metrics, word frequency, n-gram phrases, readability scoring,
 * and rule-based writing checks.
 *
 * Free of browser/DOM/React dependencies to allow deterministic Node.js testing.
 */

export interface CountingOptions {
  includeNumbers: boolean;
  includeUrls: boolean;
  includeEmails: boolean;
  hyphenatedWordMode: 'single' | 'split';
  caseSensitiveFrequency: boolean;
  excludeHeaderFooter: boolean;
  pageRange?: [number, number] | null;
  stopWordsFilter?: 'exclude' | 'include';
  minWordLength?: number;
}

export const DEFAULT_COUNTING_OPTIONS: CountingOptions = {
  includeNumbers: true,
  includeUrls: false,
  includeEmails: false,
  hyphenatedWordMode: 'single',
  caseSensitiveFrequency: false,
  excludeHeaderFooter: false,
  pageRange: null,
  stopWordsFilter: 'exclude',
  minWordLength: 1,
};

export interface PageRawInput {
  pageNumber: number;
  text: string;
}

export interface PageMetrics {
  pageNumber: number;
  words: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  sentences: number;
  paragraphs: number;
  readingTimeMinutes: number;
  readingTimeFormatted: string;
  hasExtractableText: boolean;
  isLikelyScanned: boolean;
}

export interface WordFrequencyItem {
  word: string;
  count: number;
  percentage: number;
  pageCount: number;
  pages: number[];
  compactPages: string;
}

export interface PhraseFrequencyItem {
  phrase: string;
  count: number;
  percentage: number;
}

export interface WritingIssue {
  type:
    | 'consecutive-duplicate'
    | 'repeated-spaces'
    | 'space-before-punctuation'
    | 'missing-space-after-punctuation'
    | 'long-sentence'
    | 'excessive-frequency';
  severity: 'warning' | 'info';
  title: string;
  message: string;
  excerpt: string;
  pageNumber?: number;
}

export interface WritingQualityAnalysis {
  issues: WritingIssue[];
  issueCountsByType: Record<string, number>;
  totalIssues: number;
  averageSentenceLength: number;
  averageWordLength: number;
  fleschReadingEase: number;
  fleschKincaidGradeLevel: number;
  readabilityInterpretation: string;
  difficultWordsCount: number;
  difficultWordsPercentage: number;
  difficultWordsSample: string[];
}

export interface DocumentAnalysisResult {
  totalPages: number;
  pagesWithText: number;
  isLikelyScanned: boolean;
  scannedPages: number[];
  pageMetrics: PageMetrics[];
  totalWords: number;
  charactersWithSpaces: number;
  charactersWithoutSpaces: number;
  totalSentences: number;
  totalParagraphs: number;
  uniqueWords: number;
  lexicalDensity: number;
  estimatedReadingTime: {
    minutes: number;
    seconds: number;
    formatted: string;
    wpm: number;
  };
  estimatedSpeakingTime: {
    minutes: number;
    seconds: number;
    formatted: string;
    wpm: number;
  };
  wordFrequencies: WordFrequencyItem[];
  twoWordPhrases: PhraseFrequencyItem[];
  threeWordPhrases: PhraseFrequencyItem[];
  writingQuality: WritingQualityAnalysis;
  extractedText: string;
  filteredPages: { pageNumber: number; text: string }[];
}

export const COMMON_STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', "aren't",
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by',
  'can', "can't", 'cannot', 'could', "couldn't", 'did', "didn't", 'do', 'does', "doesn't", 'doing',
  "don't", 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had', "hadn't", 'has', "hasn't",
  'have', "haven't", 'having', 'he', "he'd", "he'll", "he's", 'her', 'here', "here's", 'hers', 'herself',
  'him', 'himself', 'his', 'how', "how's", 'i', "i'd", "i'll", "i'm", "i've", 'if', 'in', 'into', 'is',
  "isn't", 'it', "it's", 'its', 'itself', 'let', "let's", 'me', 'more', 'most', "mustn't", 'my',
  'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'ought', 'our', 'ours',
  'ourselves', 'out', 'over', 'own', 'same', "shan't", 'she', "she'd", "she'll", "she's", 'should',
  "shouldn't", 'so', 'some', 'such', 'than', 'that', "that's", 'the', 'their', 'theirs', 'them',
  'themselves', 'then', 'there', "there's", 'these', 'they', "they'd", "they'll", "they're", "they've",
  'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', "wasn't", 'we',
  "we'd", "we'll", "we're", "we've", 'were', "weren't", 'what', "what's", 'when', "when's", 'where',
  "where's", 'which', 'while', 'who', "who's", 'whom', 'why', "why's", 'with', "won't", 'would',
  "wouldn't", 'you', "you'd", "you'll", "you're", "you've", 'your', 'yours', 'yourself', 'yourselves',
]);

const COMMON_ABBREVIATIONS = new Set([
  'mr', 'mrs', 'ms', 'dr', 'prof', 'sr', 'jr', 'vs', 'etc', 'eg', 'ie', 'al', 'fig', 'inc', 'ltd', 'co',
  'jan', 'feb', 'mar', 'apr', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec', 'no', 'vol', 'dept',
]);

// URL and email detection patterns
const URL_REGEX = /(?:https?:\/\/|www\.)[^\s/$.?#].[^\s]*/gi;
const EMAIL_REGEX = /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/gi;
const NUMBER_TOKEN_REGEX = /^[+-]?\$?€?£?¥?\d+(?:[.,]\d+)*%?$/;

/**
 * Strips leading and trailing punctuation from a token while preserving internal hyphens/apostrophes.
 */
export function cleanPunctuation(token: string): string {
  // If the token matches a number token like $1,000 or 15.5%, strip only surrounding quotes/brackets/parentheses/commas/periods
  if (NUMBER_TOKEN_REGEX.test(token.replace(/^[\s`"“'‘«»—–…(\[{<:]+/u, '').replace(/[\s`"”'’«»—–…)}\]>:;,.!?]+$/u, ''))) {
    return token.replace(/^[\s`"“'‘«»—–…(\[{<:]+/u, '').replace(/[\s`"”'’«»—–…)}\]>:;,.!?]+$/u, '');
  }
  return token
    .replace(/^[\s\p{P}`"“'‘«»—–…]+/u, '')
    .replace(/[\s\p{P}`"”'’«»—–…]+$/u, '');
}

/**
 * Tokenizes text into words according to user options.
 */
export function tokenizeWords(text: string, options: CountingOptions = DEFAULT_COUNTING_OPTIONS): string[] {
  if (!text || typeof text !== 'string') return [];

  let processed = text;
  const extractedUrls: string[] = [];
  const extractedEmails: string[] = [];

  // Handle URLs
  if (options.includeUrls) {
    processed = processed.replace(URL_REGEX, (match) => {
      extractedUrls.push(match);
      return ' __URL_TOKEN__ ';
    });
  } else {
    processed = processed.replace(URL_REGEX, ' ');
  }

  // Handle Emails
  if (options.includeEmails) {
    processed = processed.replace(EMAIL_REGEX, (match) => {
      extractedEmails.push(match);
      return ' __EMAIL_TOKEN__ ';
    });
  } else {
    processed = processed.replace(EMAIL_REGEX, ' ');
  }

  // Normalize em dashes, en dashes, and non-breaking spaces to spaces
  processed = processed.replace(/[\u00A0\u2000-\u200B\u202F\u205F\u3000]/g, ' ');
  processed = processed.replace(/[—–]/g, ' ');

  // Split on whitespace
  const rawTokens = processed.split(/\s+/).filter(Boolean);
  const words: string[] = [];
  let urlIdx = 0;
  let emailIdx = 0;

  for (const rawToken of rawTokens) {
    if (rawToken === '__URL_TOKEN__') {
      if (urlIdx < extractedUrls.length) {
        words.push(extractedUrls[urlIdx++]);
      }
      continue;
    }
    if (rawToken === '__EMAIL_TOKEN__') {
      if (emailIdx < extractedEmails.length) {
        words.push(extractedEmails[emailIdx++]);
      }
      continue;
    }

    const cleaned = cleanPunctuation(rawToken);
    if (!cleaned) continue;

    // Check if it's a number token
    if (NUMBER_TOKEN_REGEX.test(cleaned)) {
      if (options.includeNumbers) {
        words.push(cleaned);
      }
      continue;
    }

    // Check if it's a hyphenated word
    if (cleaned.includes('-')) {
      if (options.hyphenatedWordMode === 'split') {
        const parts = cleaned.split('-').map(cleanPunctuation).filter(Boolean);
        for (const p of parts) {
          if (NUMBER_TOKEN_REGEX.test(p)) {
            if (options.includeNumbers) words.push(p);
          } else if (/[\p{L}\p{N}]/u.test(p)) {
            words.push(p);
          }
        }
      } else {
        // Count as single word
        if (/[\p{L}\p{N}]/u.test(cleaned)) {
          words.push(cleaned);
        }
      }
      continue;
    }

    // Standard word containing letters or unicode alphanumeric
    if (/[\p{L}\p{N}]/u.test(cleaned)) {
      words.push(cleaned);
    }
  }

  return words;
}

/**
 * Counts words in a string.
 */
export function countWords(text: string, options: CountingOptions = DEFAULT_COUNTING_OPTIONS): number {
  return tokenizeWords(text, options).length;
}

/**
 * Counts characters including and excluding spaces.
 */
export function countCharacters(text: string): { withSpaces: number; withoutSpaces: number } {
  if (!text) return { withSpaces: 0, withoutSpaces: 0 };
  const normalized = text.replace(/\r\n/g, '\n');
  const withSpaces = normalized.length;
  const withoutSpaces = normalized.replace(/\s/g, '').length;
  return { withSpaces, withoutSpaces };
}

/**
 * Counts sentences safely using regex and abbreviation checking.
 */
export function countSentences(text: string): number {
  if (!text || !text.trim()) return 0;

  // Split roughly on sentence enders: ., !, ?
  const candidates = text
    .replace(/\r\n/g, ' ')
    .replace(/\n/g, ' ')
    .split(/(?<=[.!?])\s+/);

  let sentenceCount = 0;

  for (let i = 0; i < candidates.length; i++) {
    const segment = candidates[i].trim();
    if (!segment) continue;

    // If segment ends with a period, check if the last word is an abbreviation
    const lastWordMatch = segment.match(/([a-zA-Z]+)\.$/);
    if (lastWordMatch) {
      const word = lastWordMatch[1].toLowerCase();
      if (COMMON_ABBREVIATIONS.has(word) && i < candidates.length - 1) {
        // Likely not a sentence boundary; merge with next
        candidates[i + 1] = `${segment} ${candidates[i + 1]}`;
        continue;
      }
    }

    // Verify candidate has at least one alphanumeric word character
    if (/[\p{L}\p{N}]/u.test(segment)) {
      sentenceCount++;
    }
  }

  return Math.max(sentenceCount, 1);
}

/**
 * Counts paragraphs. Paragraphs are defined as blocks separated by one or more blank lines.
 */
export function countParagraphs(text: string): number {
  if (!text || !text.trim()) return 0;
  const blocks = text.split(/\n\s*\n+/).filter((b) => /[\p{L}\p{N}]/u.test(b));
  return Math.max(blocks.length, 1);
}

/**
 * Calculates estimated silent reading time (default 225 words per minute).
 */
export function computeReadingTime(wordCount: number, wpm = 225): {
  minutes: number;
  seconds: number;
  formatted: string;
  wpm: number;
} {
  if (wordCount <= 0) {
    return { minutes: 0, seconds: 0, formatted: '0 min', wpm };
  }
  const totalSeconds = Math.round((wordCount / wpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (minutes === 0) {
    formatted = `${Math.max(seconds, 1)} sec`;
  } else if (seconds === 0) {
    formatted = `${minutes} min`;
  } else {
    formatted = `${minutes} min ${seconds} sec`;
  }

  return { minutes, seconds, formatted, wpm };
}

/**
 * Calculates estimated speaking time (default 130 words per minute).
 */
export function computeSpeakingTime(wordCount: number, wpm = 130): {
  minutes: number;
  seconds: number;
  formatted: string;
  wpm: number;
} {
  if (wordCount <= 0) {
    return { minutes: 0, seconds: 0, formatted: '0 min', wpm };
  }
  const totalSeconds = Math.round((wordCount / wpm) * 60);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  let formatted = '';
  if (minutes === 0) {
    formatted = `${Math.max(seconds, 1)} sec`;
  } else if (seconds === 0) {
    formatted = `${minutes} min`;
  } else {
    formatted = `${minutes} min ${seconds} sec`;
  }

  return { minutes, seconds, formatted, wpm };
}

/**
 * Formats a list of page numbers into a compact range string, e.g. [1, 2, 3, 5, 7, 8] -> "1-3, 5, 7-8".
 */
export function formatCompactPages(pages: number[]): string {
  if (!pages || pages.length === 0) return '';
  const sorted = Array.from(new Set(pages)).sort((a, b) => a - b);
  const ranges: string[] = [];

  let start = sorted[0];
  let prev = sorted[0];

  for (let i = 1; i < sorted.length; i++) {
    const curr = sorted[i];
    if (curr === prev + 1) {
      prev = curr;
    } else {
      ranges.push(start === prev ? `${start}` : `${start}-${prev}`);
      start = curr;
      prev = curr;
    }
  }
  ranges.push(start === prev ? `${start}` : `${start}-${prev}`);

  return ranges.join(', ');
}

/**
 * Detects lines repeated at the top (header) or bottom (footer) across pages.
 */
export function detectRepeatedHeadersAndFooters(
  pages: { pageNumber: number; text: string }[]
): { headerLines: Set<string>; footerLines: Set<string> } {
  const headerCandidates = new Map<string, number>();
  const footerCandidates = new Map<string, number>();

  if (pages.length < 2) {
    return { headerLines: new Set(), footerLines: new Set() };
  }

  for (const page of pages) {
    const lines = page.text
      .split('\n')
      .map((l) => l.trim())
      .filter((l) => l.length > 2);
    if (lines.length > 0) {
      const firstLine = lines[0];
      headerCandidates.set(firstLine, (headerCandidates.get(firstLine) || 0) + 1);
    }
    if (lines.length > 1) {
      const lastLine = lines[lines.length - 1];
      footerCandidates.set(lastLine, (footerCandidates.get(lastLine) || 0) + 1);
    }
  }

  const threshold = Math.max(2, Math.floor(pages.length * 0.4));
  const headerLines = new Set<string>();
  const footerLines = new Set<string>();

  for (const [line, count] of headerCandidates.entries()) {
    if (count >= threshold) headerLines.add(line);
  }
  for (const [line, count] of footerCandidates.entries()) {
    if (count >= threshold) footerLines.add(line);
  }

  return { headerLines, footerLines };
}

/**
 * Removes detected headers and footers from page text.
 */
export function stripHeadersAndFooters(
  text: string,
  headerLines: Set<string>,
  footerLines: Set<string>
): string {
  if (headerLines.size === 0 && footerLines.size === 0) return text;
  const lines = text.split('\n');
  if (lines.length === 0) return text;

  let startIndex = 0;
  // Strip at most top 2 lines if they match detected headers
  while (startIndex < lines.length && startIndex < 2 && headerLines.has(lines[startIndex].trim())) {
    startIndex++;
  }

  let endIndex = lines.length - 1;
  // Strip at most bottom 2 lines if they match detected footers
  while (endIndex >= startIndex && endIndex >= lines.length - 2 && footerLines.has(lines[endIndex].trim())) {
    endIndex--;
  }

  return lines.slice(startIndex, endIndex + 1).join('\n');
}

/**
 * Calculates word frequencies across all pages.
 */
export function computeWordFrequencies(
  pageWordEntries: { pageNumber: number; words: string[] }[],
  options: CountingOptions = DEFAULT_COUNTING_OPTIONS
): WordFrequencyItem[] {
  const freqMap = new Map<string, { count: number; pages: Set<number>; displayWord: string }>();
  let totalWords = 0;

  const minLength = options.minWordLength ?? 1;
  const ignoreStop = options.stopWordsFilter === 'exclude';

  for (const { pageNumber, words } of pageWordEntries) {
    for (const word of words) {
      if (word.length < minLength) continue;

      const normalizedKey = options.caseSensitiveFrequency ? word : word.toLowerCase();
      if (ignoreStop && COMMON_STOP_WORDS.has(normalizedKey.toLowerCase())) {
        continue;
      }

      totalWords++;
      const existing = freqMap.get(normalizedKey);
      if (existing) {
        existing.count++;
        existing.pages.add(pageNumber);
      } else {
        freqMap.set(normalizedKey, {
          count: 1,
          pages: new Set([pageNumber]),
          displayWord: word,
        });
      }
    }
  }

  const result: WordFrequencyItem[] = [];
  for (const [key, val] of freqMap.entries()) {
    const pagesArr = Array.from(val.pages).sort((a, b) => a - b);
    const percentage = totalWords > 0 ? (val.count / totalWords) * 100 : 0;
    result.push({
      word: options.caseSensitiveFrequency ? val.displayWord : key,
      count: val.count,
      percentage: Number(percentage.toFixed(2)),
      pageCount: pagesArr.length,
      pages: pagesArr,
      compactPages: formatCompactPages(pagesArr),
    });
  }

  // Sort default: highest frequency first, then alphabetical
  result.sort((a, b) => b.count - a.count || a.word.localeCompare(b.word));
  return result;
}

/**
 * Computes common two-word (bigram) or three-word (trigram) phrases.
 * Avoids generating phrases across page boundaries.
 */
export function computePhrases(
  pageWordEntries: { pageNumber: number; words: string[] }[],
  phraseLength: 2 | 3 = 2,
  minOccurrence = 2
): PhraseFrequencyItem[] {
  const phraseMap = new Map<string, number>();
  let totalPhrases = 0;

  for (const { words } of pageWordEntries) {
    if (words.length < phraseLength) continue;

    for (let i = 0; i <= words.length - phraseLength; i++) {
      const phraseSlice = words.slice(i, i + phraseLength).map((w) => w.toLowerCase());

      // Do not create phrases of only pure numbers or punctuation
      if (!phraseSlice.some((w) => /[\p{L}]/u.test(w))) continue;

      const phrase = phraseSlice.join(' ');
      phraseMap.set(phrase, (phraseMap.get(phrase) || 0) + 1);
      totalPhrases++;
    }
  }

  const items: PhraseFrequencyItem[] = [];
  for (const [phrase, count] of phraseMap.entries()) {
    if (count >= minOccurrence) {
      const percentage = totalPhrases > 0 ? (count / totalPhrases) * 100 : 0;
      items.push({
        phrase,
        count,
        percentage: Number(percentage.toFixed(2)),
      });
    }
  }

  items.sort((a, b) => b.count - a.count || a.phrase.localeCompare(b.phrase));
  return items;
}

/**
 * Simple English syllable counter heuristic for readability formulas.
 */
export function countSyllables(word: string): number {
  const clean = word.toLowerCase().replace(/[^a-z]/g, '');
  if (!clean) return 0;
  if (clean.length <= 3) return 1;

  // Replace common silent endings
  const transformed = clean
    .replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '')
    .replace(/^y/, '');

  // Count vowel sequences
  const matches = transformed.match(/[aeiouy]{1,2}/g);
  const count = matches ? matches.length : 1;
  return Math.max(1, count);
}

/**
 * Computes Flesch Reading Ease and Flesch-Kincaid Grade Level scores.
 */
export function computeReadability(
  words: string[],
  sentenceCount: number
): {
  fleschReadingEase: number;
  fleschKincaidGradeLevel: number;
  readabilityInterpretation: string;
  difficultWords: string[];
} {
  if (words.length === 0 || sentenceCount <= 0) {
    return {
      fleschReadingEase: 0,
      fleschKincaidGradeLevel: 0,
      readabilityInterpretation: 'N/A (Insufficient text)',
      difficultWords: [],
    };
  }

  const wordCount = words.length;
  let totalSyllables = 0;
  const difficultWords: string[] = [];

  for (const w of words) {
    // Only test words containing letters
    if (!/[a-zA-Z]/.test(w)) continue;
    const syllables = countSyllables(w);
    totalSyllables += syllables;
    if (syllables >= 3) {
      difficultWords.push(w.toLowerCase());
    }
  }

  const asl = wordCount / Math.max(sentenceCount, 1);
  const asw = wordCount > 0 ? totalSyllables / wordCount : 1;

  // Flesch Reading Ease = 206.835 - (1.015 * ASL) - (84.6 * ASW)
  const easeRaw = 206.835 - 1.015 * asl - 84.6 * asw;
  const fleschReadingEase = Math.round(Math.min(100, Math.max(0, easeRaw)) * 10) / 10;

  // Flesch-Kincaid Grade Level = 0.39 * ASL + 11.8 * ASW - 15.59
  const gradeRaw = 0.39 * asl + 11.8 * asw - 15.59;
  const fleschKincaidGradeLevel = Math.round(Math.max(0, gradeRaw) * 10) / 10;

  let readabilityInterpretation = 'Standard (High school level)';
  if (fleschReadingEase >= 90) readabilityInterpretation = 'Very Easy (5th grade level)';
  else if (fleschReadingEase >= 80) readabilityInterpretation = 'Easy (6th grade level)';
  else if (fleschReadingEase >= 70) readabilityInterpretation = 'Fairly Easy (7th grade level)';
  else if (fleschReadingEase >= 60) readabilityInterpretation = 'Standard (8th–9th grade level)';
  else if (fleschReadingEase >= 50) readabilityInterpretation = 'Fairly Difficult (10th–12th grade level)';
  else if (fleschReadingEase >= 30) readabilityInterpretation = 'Difficult (College level)';
  else readabilityInterpretation = 'Very Difficult (Graduate or technical level)';

  return {
    fleschReadingEase,
    fleschKincaidGradeLevel,
    readabilityInterpretation,
    difficultWords,
  };
}

/**
 * Performs rule-based browser-local writing checks without any external API or telemetry.
 */
export function analyzeWritingQuality(
  pages: { pageNumber: number; text: string }[],
  options: CountingOptions = DEFAULT_COUNTING_OPTIONS
): WritingQualityAnalysis {
  const issues: WritingIssue[] = [];
  const issueCountsByType: Record<string, number> = {
    'consecutive-duplicate': 0,
    'repeated-spaces': 0,
    'space-before-punctuation': 0,
    'missing-space-after-punctuation': 0,
    'long-sentence': 0,
    'excessive-frequency': 0,
  };

  let totalLettersCount = 0;
  let totalWordsCount = 0;
  let totalSentencesCount = 0;
  const allWordsForReadability: string[] = [];

  for (const page of pages) {
    const { pageNumber, text } = page;
    if (!text.trim()) continue;

    const pageWords = tokenizeWords(text, options);
    totalWordsCount += pageWords.length;
    allWordsForReadability.push(...pageWords);

    for (const w of pageWords) {
      const lettersOnly = w.replace(/[^\p{L}]/gu, '');
      totalLettersCount += lettersOnly.length;
    }

    // Check 1: Consecutive duplicate words (e.g. "the the")
    for (let i = 0; i < pageWords.length - 1; i++) {
      const curr = pageWords[i].toLowerCase();
      const next = pageWords[i + 1].toLowerCase();
      if (curr.length >= 2 && curr === next && !NUMBER_TOKEN_REGEX.test(curr)) {
        issues.push({
          type: 'consecutive-duplicate',
          severity: 'warning',
          title: 'Consecutive Duplicate Word',
          message: `The word "${pageWords[i]}" is repeated immediately.`,
          excerpt: `...${pageWords[i]} ${pageWords[i + 1]}...`,
          pageNumber,
        });
        issueCountsByType['consecutive-duplicate']++;
      }
    }

    // Check 2: Repeated spaces (multiple spaces)
    const lines = text.split('\n');
    for (const line of lines) {
      const match = line.match(/[^\s]{1,15}\s{2,}[^\s]{1,15}/);
      if (match) {
        issues.push({
          type: 'repeated-spaces',
          severity: 'info',
          title: 'Multiple Consecutive Spaces',
          message: 'Found multiple consecutive space characters between words.',
          excerpt: match[0],
          pageNumber,
        });
        issueCountsByType['repeated-spaces']++;
        break; // Keep to 1 per page to prevent overwhelming list
      }
    }

    // Check 3: Space before punctuation (e.g. "word ,")
    const spaceBeforePunctMatch = text.match(/[\p{L}\p{N}]+\s+([,.;:!?])/u);
    if (spaceBeforePunctMatch) {
      issues.push({
        type: 'space-before-punctuation',
        severity: 'info',
        title: 'Space Before Punctuation',
        message: `Extraneous space detected before punctuation mark "${spaceBeforePunctMatch[1]}".`,
        excerpt: spaceBeforePunctMatch[0],
        pageNumber,
      });
      issueCountsByType['space-before-punctuation']++;
    }

    // Check 4: Missing space after punctuation (e.g. "word,next", not 3.14 or URLs)
    const missingSpaceMatch = text.match(/([a-zA-Z]{2,})([,;:!?])([a-zA-Z]{2,})/);
    if (missingSpaceMatch) {
      issues.push({
        type: 'missing-space-after-punctuation',
        severity: 'info',
        title: 'Missing Space After Punctuation',
        message: `Missing space after "${missingSpaceMatch[2]}" between "${missingSpaceMatch[1]}" and "${missingSpaceMatch[3]}".`,
        excerpt: missingSpaceMatch[0],
        pageNumber,
      });
      issueCountsByType['missing-space-after-punctuation']++;
    }

    // Check 5: Very long sentences (> 38 words)
    const rawSentences = text
      .replace(/\r\n/g, ' ')
      .replace(/\n/g, ' ')
      .split(/(?<=[.!?])\s+/);

    for (const sent of rawSentences) {
      if (!/[\p{L}\p{N}]/u.test(sent)) continue;
      totalSentencesCount++;
      const sentWords = tokenizeWords(sent, options);
      if (sentWords.length > 38) {
        issues.push({
          type: 'long-sentence',
          severity: 'info',
          title: 'Very Long Sentence',
          message: `Sentence contains ${sentWords.length} words, which may be difficult for readers to follow.`,
          excerpt: sent.length > 100 ? `${sent.slice(0, 100)}...` : sent,
          pageNumber,
        });
        issueCountsByType['long-sentence']++;
      }
    }
  }

  // Check 6: Excessively repeated words (> 3.5% of total document words, excluding common stop words)
  if (totalWordsCount >= 100) {
    const wordCounts = new Map<string, number>();
    for (const w of allWordsForReadability) {
      const lower = w.toLowerCase();
      if (lower.length >= 4 && !COMMON_STOP_WORDS.has(lower) && !NUMBER_TOKEN_REGEX.test(lower)) {
        wordCounts.set(lower, (wordCounts.get(lower) || 0) + 1);
      }
    }

    for (const [w, count] of wordCounts.entries()) {
      const ratio = count / totalWordsCount;
      if (ratio > 0.035 && count >= 6) {
        issues.push({
          type: 'excessive-frequency',
          severity: 'info',
          title: 'Excessively Repeated Word',
          message: `The word "${w}" appears ${count} times (${(ratio * 100).toFixed(1)}% of document words). Consider using synonyms.`,
          excerpt: `Word: "${w}" (Occurs ${count} times)`,
        });
        issueCountsByType['excessive-frequency']++;
      }
    }
  }

  const readability = computeReadability(allWordsForReadability, totalSentencesCount);
  const averageSentenceLength =
    totalSentencesCount > 0 ? Number((totalWordsCount / totalSentencesCount).toFixed(1)) : 0;
  const averageWordLength =
    totalWordsCount > 0 ? Number((totalLettersCount / totalWordsCount).toFixed(1)) : 0;

  const uniqueDifficult = Array.from(new Set(readability.difficultWords));
  const difficultWordsCount = readability.difficultWords.length;
  const difficultWordsPercentage =
    totalWordsCount > 0 ? Number(((difficultWordsCount / totalWordsCount) * 100).toFixed(1)) : 0;

  return {
    issues: issues.slice(0, 50), // Cap at 50 to maintain fast rendering
    issueCountsByType,
    totalIssues: issues.length,
    averageSentenceLength,
    averageWordLength,
    fleschReadingEase: readability.fleschReadingEase,
    fleschKincaidGradeLevel: readability.fleschKincaidGradeLevel,
    readabilityInterpretation: readability.readabilityInterpretation,
    difficultWordsCount,
    difficultWordsPercentage,
    difficultWordsSample: uniqueDifficult.slice(0, 10),
  };
}

/**
 * Main pure analysis orchestrator.
 * Analyzes extracted page texts with the specified counting options.
 */
export function analyzeDocument(
  rawPages: PageRawInput[],
  options: CountingOptions = DEFAULT_COUNTING_OPTIONS
): DocumentAnalysisResult {
  const totalPages = rawPages.length;

  // Filter page range if specified
  let pagesToProcess = rawPages;
  if (options.pageRange && options.pageRange.length === 2) {
    const minPage = Math.min(options.pageRange[0], options.pageRange[1]);
    const maxPage = Math.max(options.pageRange[0], options.pageRange[1]);
    pagesToProcess = rawPages.filter(
      (p) => p.pageNumber >= minPage && p.pageNumber <= maxPage
    );
  }

  // Header & Footer detection and stripping if enabled
  let headerLines = new Set<string>();
  let footerLines = new Set<string>();
  if (options.excludeHeaderFooter && pagesToProcess.length >= 2) {
    const detected = detectRepeatedHeadersAndFooters(pagesToProcess);
    headerLines = detected.headerLines;
    footerLines = detected.footerLines;
  }

  const cleanedPages = pagesToProcess.map((p) => {
    let text = p.text;
    if (options.excludeHeaderFooter) {
      text = stripHeadersAndFooters(text, headerLines, footerLines);
    }
    return {
      pageNumber: p.pageNumber,
      text,
    };
  });

  const pageMetrics: PageMetrics[] = [];
  const pageWordEntries: { pageNumber: number; words: string[] }[] = [];
  const scannedPages: number[] = [];

  let docWords = 0;
  let docCharsWithSpaces = 0;
  let docCharsWithoutSpaces = 0;
  let docSentences = 0;
  let docParagraphs = 0;
  let pagesWithText = 0;

  const fullTextParts: string[] = [];

  for (const page of cleanedPages) {
    const { pageNumber, text } = page;
    const words = tokenizeWords(text, options);
    const chars = countCharacters(text);
    const sentences = countSentences(text);
    const paragraphs = countParagraphs(text);
    const hasExtractableText = words.length > 0 || chars.withoutSpaces > 5;
    const isLikelyScanned = !hasExtractableText;

    if (hasExtractableText) {
      pagesWithText++;
    } else {
      scannedPages.push(pageNumber);
    }

    const reading = computeReadingTime(words.length);

    pageMetrics.push({
      pageNumber,
      words: words.length,
      charactersWithSpaces: chars.withSpaces,
      charactersWithoutSpaces: chars.withoutSpaces,
      sentences,
      paragraphs,
      readingTimeMinutes: reading.minutes,
      readingTimeFormatted: reading.formatted,
      hasExtractableText,
      isLikelyScanned,
    });

    pageWordEntries.push({ pageNumber, words });

    docWords += words.length;
    docCharsWithSpaces += chars.withSpaces;
    docCharsWithoutSpaces += chars.withoutSpaces;
    docSentences += sentences;
    docParagraphs += paragraphs;

    if (text.trim()) {
      fullTextParts.push(`--- Page ${pageNumber} ---\n${text.trim()}`);
    }
  }

  const isLikelyScanned =
    totalPages > 0 && (pagesWithText === 0 || (totalPages > 1 && pagesWithText / totalPages < 0.2));

  // Word Frequencies
  const wordFrequencies = computeWordFrequencies(pageWordEntries, options);

  // Unique words
  const allTokens = pageWordEntries.flatMap((p) => p.words.map((w) => w.toLowerCase()));
  const uniqueWords = new Set(allTokens).size;
  const lexicalDensity =
    docWords > 0 ? Number(((uniqueWords / docWords) * 100).toFixed(1)) : 0;

  // Phrases
  const twoWordPhrases = computePhrases(pageWordEntries, 2);
  const threeWordPhrases = computePhrases(pageWordEntries, 3);

  // Writing Quality
  const writingQuality = analyzeWritingQuality(cleanedPages, options);

  // Reading & Speaking times
  const estimatedReadingTime = computeReadingTime(docWords, 225);
  const estimatedSpeakingTime = computeSpeakingTime(docWords, 130);

  return {
    totalPages,
    pagesWithText,
    isLikelyScanned,
    scannedPages,
    pageMetrics,
    totalWords: docWords,
    charactersWithSpaces: docCharsWithSpaces,
    charactersWithoutSpaces: docCharsWithoutSpaces,
    totalSentences: docSentences,
    totalParagraphs: docParagraphs,
    uniqueWords,
    lexicalDensity,
    estimatedReadingTime,
    estimatedSpeakingTime,
    wordFrequencies,
    twoWordPhrases,
    threeWordPhrases,
    writingQuality,
    extractedText: fullTextParts.join('\n\n'),
    filteredPages: cleanedPages,
  };
}
