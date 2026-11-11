import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EmailConverter from '@/components/tools/email/EmailConverter';

export default function Page() { return <ExpansionToolPage category="developer-tools" eyebrow="Email conversion" title="Free EML to Word Converter Online" description={"Create an editable DOCX document with email headers, readable message text and attachment names. Original email styling and images are omitted."} slug="eml-to-word"><EmailConverter format="word" /></ExpansionToolPage>; }
