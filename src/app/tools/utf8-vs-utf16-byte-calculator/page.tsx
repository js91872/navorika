import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import UnicodeByteCalculator from '@/components/tools/UnicodeByteCalculator';

export default function UnicodeByteCalculatorPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Unicode & String Encodings"
      title="UTF-8 vs UTF-16 Byte Calculator"
      description="Compare UTF-8 and UTF-16 encoded byte sizes for text, Unicode characters, and emoji with code point and code unit analysis."
      slug="utf8-vs-utf16-byte-calculator"
    >
      <UnicodeByteCalculator />
    </ExpansionToolPage>
  );
}
