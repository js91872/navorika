import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EmailConverter from '@/components/tools/email/EmailConverter';

export default function Page() { return <ExpansionToolPage category="developer-tools" eyebrow="Email conversion" title="Free EML to HTML Converter Online" description={"Save a standalone HTML document with email headers, basic message formatting and an attachment list. Remote content and images are removed."} slug="eml-to-html"><EmailConverter format="html" /></ExpansionToolPage>; }
