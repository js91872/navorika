import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EmailConverter from '@/components/tools/email/EmailConverter';

export default function Page() { return <ExpansionToolPage category="developer-tools" eyebrow="Email conversion" title="Free EML to PDF Converter Online" description={"Create a readable PDF with email headers, message text and attachment names. Western European text is searchable; other scripts may render as images."} slug="eml-to-pdf"><EmailConverter format="pdf" /></ExpansionToolPage>; }
