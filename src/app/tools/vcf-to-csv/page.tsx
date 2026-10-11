import VcfToCsv from '@/components/tools/VcfToCsv';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';

export default function Page() {
  return <ExpansionToolPage category="developer-tools" eyebrow="Contacts file converter" title="VCF to CSV Converter – Convert vCard Contacts to Excel CSV" description="Convert a VCF vCard contact file to CSV online for free. Preview names, emails, and phone numbers before downloading a spreadsheet-ready CSV file.">
    <VcfToCsv/>
    <article className="mx-auto mt-10 max-w-4xl space-y-5 text-[var(--muted-foreground)]">
      <h2 className="text-2xl font-bold text-[var(--foreground)]">How to convert VCF contacts to CSV</h2>
      <p>Export your contacts as a .vcf file from your phone or contacts application. Upload the VCF file, review the contact preview and download a CSV spreadsheet. Open the CSV in Excel, Google Sheets or another spreadsheet application.</p>
      <h2 className="text-2xl font-bold text-[var(--foreground)]">VCF to CSV conversion FAQ</h2>
      <h3 className="font-semibold text-[var(--foreground)]">Is the contact file uploaded to Navorika?</h3>
      <p>No. The converter reads and processes the contact file locally in your browser, without transferring it to our server.</p>
      <h3 className="font-semibold text-[var(--foreground)]">Will it export every contact property?</h3>
      <p>It exports names, one phone number, one email address, company and job title. Specialized vCard fields and embedded photos are not supported; keep a copy of your original VCF file.</p>
      <h3 className="font-semibold text-[var(--foreground)]">Can I use the CSV in Excel?</h3>
      <p>Yes. The downloaded UTF-8 CSV file includes column headings and can be opened in Excel or Google Sheets.</p>
    </article>
  </ExpansionToolPage>;
}
