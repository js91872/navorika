import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EmailConverter from '@/components/tools/email/EmailConverter';

export default function Page() { return <ExpansionToolPage category="developer-tools" eyebrow="Email conversion" title="Free EML to Excel Converter Online" description={"Create a genuine XLSX workbook with one email per row, filterable headers, message text and attachment names. No formulas are generated."} slug="eml-to-excel"><EmailConverter format="excel" /></ExpansionToolPage>; }
