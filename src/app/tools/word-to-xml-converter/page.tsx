import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import WordToXmlTool from '@/components/tools/xml-word/WordToXmlTool';
import XmlWordEducationalContent from '@/components/tools/xml-word/XmlWordEducationalContent';

export default function WordToXmlConverterPage() { return <ExpansionToolPage category="developer-tools" eyebrow="Local document conversion" title="Word to XML Converter" description="Extract clean structured XML or the raw WordprocessingML document part from a valid modern DOCX file."><WordToXmlTool /><XmlWordEducationalContent direction="word-to-xml" /></ExpansionToolPage>; }
