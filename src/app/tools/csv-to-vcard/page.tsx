import CsvToVcard from '@/components/tools/CsvToVcard';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="Contacts file converter" title="CSV to vCard Converter – Convert CSV Contacts to VCF Free" description="Convert a CSV spreadsheet of contacts into a VCF vCard file online. Upload or paste CSV, preview names and numbers, and download without signing up.">
    <CsvToVcard />
    <article className="mt-10 max-w-4xl space-y-5 text-[var(--muted-foreground)]">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">How to convert CSV to vCard</h2>
      <p>Export your contacts as a CSV file from Excel, Google Sheets or a contacts app. Make sure the first row contains column names such as First Name, Last Name, Phone and Email. Upload the CSV, check the preview and download the VCF file for importing into your contacts app.</p>
      <h2 className="text-2xl font-bold text-[var(--foreground)]">Frequently asked questions</h2>
      <h3 className="font-semibold text-[var(--foreground)]">Does this converter upload my contact list?</h3>
      <p>No. Your CSV is read and converted in your browser. The file is not uploaded to Navorika.</p>
      <h3 className="font-semibold text-[var(--foreground)]">Does it work with Google Contacts or iPhone?</h3>
      <p>The output uses the widely supported vCard 3.0 format. Import options differ by app and device; always check a small contact sample first.</p>
      <h3 className="font-semibold text-[var(--foreground)]">What CSV column names are supported?</h3>
      <p>First Name, Last Name, Full Name, Phone, Email, Company and Job Title, including common alternatives. Unknown columns are ignored rather than silently mapped to incorrect contact fields.</p>
    </article>
  </ExpansionToolPage>;
}
