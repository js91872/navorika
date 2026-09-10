export interface BitBreakdownItem {
  position: number; // 0-indexed from right
  bit: '0' | '1';
  powerExpression: string; // e.g. "2^5"
  powerValue: string; // e.g. "32"
  termCalculation: string; // e.g. "1 × 32"
  termResult: string; // e.g. "32" or "0"
}

export interface BinaryToDecimalResult {
  valid: boolean;
  error?: string;
  cleanedBinary: string;
  isNegative: boolean;
  decimalString: string;
  bitCount: number;
  setBitsCount: number;
  polynomialFormula: string;
  evaluatedPowersFormula: string;
  fullStepByStepText: string;
  bitTable: BitBreakdownItem[];
  hexadecimal: string;
  octal: string;
}

const SUPERSCRIPTS: Record<string, string> = {
  '0': '⁰',
  '1': '¹',
  '2': '²',
  '3': '³',
  '4': '⁴',
  '5': '⁵',
  '6': '⁶',
  '7': '⁷',
  '8': '⁸',
  '9': '⁹',
  '-': '⁻',
};

export function toSuperscript(num: number | bigint): string {
  return String(num)
    .split('')
    .map((ch) => SUPERSCRIPTS[ch] || `^${ch}`)
    .join('');
}

export function convertBinaryToDecimal(rawInput: string): BinaryToDecimalResult {
  const trimmed = (rawInput ?? '').trim();
  if (!trimmed) {
    return {
      valid: false,
      error: 'Enter a binary number (e.g. 101101)',
      cleanedBinary: '',
      isNegative: false,
      decimalString: '',
      bitCount: 0,
      setBitsCount: 0,
      polynomialFormula: '',
      evaluatedPowersFormula: '',
      fullStepByStepText: '',
      bitTable: [],
      hexadecimal: '',
      octal: '',
    };
  }

  let processed = trimmed.replace(/[\s_]+/g, '');

  let isNegative = false;
  if (processed.startsWith('-')) {
    isNegative = true;
    processed = processed.slice(1);
  } else if (processed.startsWith('+')) {
    processed = processed.slice(1);
  }

  // Strip optional 0b / 0B prefix
  if (processed.startsWith('0b') || processed.startsWith('0B')) {
    processed = processed.slice(2);
  }

  if (!processed) {
    return {
      valid: false,
      error: 'Binary string contains no digits after prefix.',
      cleanedBinary: '',
      isNegative,
      decimalString: '',
      bitCount: 0,
      setBitsCount: 0,
      polynomialFormula: '',
      evaluatedPowersFormula: '',
      fullStepByStepText: '',
      bitTable: [],
      hexadecimal: '',
      octal: '',
    };
  }

  // Validate characters
  for (let i = 0; i < processed.length; i++) {
    const ch = processed[i];
    if (ch !== '0' && ch !== '1') {
      return {
        valid: false,
        error: `Invalid binary character "${ch}" at position ${i + 1}. Binary numbers may only contain 0 and 1.`,
        cleanedBinary: processed,
        isNegative,
        decimalString: '',
        bitCount: 0,
        setBitsCount: 0,
        polynomialFormula: '',
        evaluatedPowersFormula: '',
        fullStepByStepText: '',
        bitTable: [],
        hexadecimal: '',
        octal: '',
      };
    }
  }

  const bitLength = processed.length;
  const bitTable: BitBreakdownItem[] = [];
  let decimalValue = BigInt(0);
  let setBits = 0;

  const polynomialTerms: string[] = [];
  const evaluatedTerms: string[] = [];

  for (let i = 0; i < bitLength; i++) {
    const bit = processed[i] as '0' | '1';
    const position = bitLength - 1 - i;
    const powerOfTwo = BigInt(1) << BigInt(position);
    const termVal = bit === '1' ? powerOfTwo : BigInt(0);

    decimalValue += termVal;
    if (bit === '1') setBits++;

    const superPower = toSuperscript(position);
    polynomialTerms.push(`${bit}×2${superPower}`);
    evaluatedTerms.push(bit === '1' ? powerOfTwo.toString() : '0');

    bitTable.push({
      position,
      bit,
      powerExpression: `2^${position}`,
      powerValue: powerOfTwo.toString(),
      termCalculation: `${bit} × ${powerOfTwo.toString()}`,
      termResult: termVal.toString(),
    });
  }

  const signStr = isNegative ? '-' : '';
  const finalDecimal = `${signStr}${decimalValue.toString()}`;

  // Limit formula display if string is extraordinarily long (e.g. > 64 bits)
  let polynomialFormula = '';
  let evaluatedPowersFormula = '';

  if (bitLength <= 64) {
    polynomialFormula = `${signStr}(${polynomialTerms.join(' + ')})`;
    evaluatedPowersFormula = `${signStr}(${evaluatedTerms.join(' + ')})`;
  } else {
    const headPoly = polynomialTerms.slice(0, 3).join(' + ');
    const tailPoly = polynomialTerms.slice(-3).join(' + ');
    polynomialFormula = `${signStr}(${headPoly} + ... + ${tailPoly})`;

    const headEval = evaluatedTerms.slice(0, 3).join(' + ');
    const tailEval = evaluatedTerms.slice(-3).join(' + ');
    evaluatedPowersFormula = `${signStr}(${headEval} + ... + ${tailEval})`;
  }

  const fullStepByStepText = [
    `Input Binary: ${signStr}${processed}₂`,
    `Step 1: Write as sum of powers of 2`,
    `= ${polynomialFormula}`,
    `Step 2: Evaluate the powers of 2`,
    `= ${evaluatedPowersFormula}`,
    `Step 3: Calculate the total sum`,
    `= ${finalDecimal}`,
  ].join('\n');

  // Alternative representations
  const hex = `${signStr}0x${decimalValue.toString(16).toUpperCase()}`;
  const octal = `${signStr}0o${decimalValue.toString(8)}`;

  return {
    valid: true,
    cleanedBinary: processed,
    isNegative,
    decimalString: finalDecimal,
    bitCount: bitLength,
    setBitsCount: setBits,
    polynomialFormula,
    evaluatedPowersFormula,
    fullStepByStepText,
    bitTable,
    hexadecimal: hex,
    octal,
  };
}
