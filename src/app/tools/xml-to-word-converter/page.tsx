import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import XmlToWordTool from '@/components/tools/xml-word/XmlToWordTool';
import XmlWordEducationalContent from '@/components/tools/xml-word/XmlWordEducationalContent';

export default function XmlToWordConverterPage() { return <ExpansionToolPage category="developer-tools" eyebrow="Local document conversion" title="XML to Word Converter" description="Validate XML and create a genuine DOCX with a readable hierarchy, repeated-record table, or formatted code layout."><XmlToWordTool /><XmlWordEducationalContent direction="xml-to-word" /></ExpansionToolPage>; }
