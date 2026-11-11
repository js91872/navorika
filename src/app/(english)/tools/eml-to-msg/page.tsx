import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EmailConverter from '@/components/tools/email/EmailConverter';

export default function Page() { return <ExpansionToolPage category="developer-tools" eyebrow="Email conversion" title="Free EML to MSG Converter Online" description={"Create a Unicode Outlook MSG with sender, recipients, date, message text, safe HTML and original attachment files."} slug="eml-to-msg"><EmailConverter format="msg" /></ExpansionToolPage>; }
