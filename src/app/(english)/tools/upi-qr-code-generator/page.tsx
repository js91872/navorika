import Link from 'next/link';
import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import UpiQrCodeGenerator from '@/components/tools/UpiQrCodeGenerator';

const questions = [
  { question: 'Can I create a UPI QR code for my business?', answer: 'Yes. Enter your business name and UPI ID, then optionally add a logo, linked mobile number, payment amount, and poster color. Download the finished poster as PNG or PDF.' },
  { question: 'Can I generate a UPI QR code without setting an amount?', answer: 'Yes. Leave the amount blank and the payer can enter the amount in their UPI app. If you enter an amount, it is included in the payment request.' },
  { question: 'Is the business logo placed inside the QR code?', answer: 'No. Your photo or business logo appears above the QR code on the poster. The QR pattern stays unobstructed for easier scanning.' },
  { question: 'Does this tool verify my UPI ID or receive payments?', answer: 'No. It creates a payment request QR code from the details you provide. It cannot verify ownership of the UPI ID, confirm a transaction, or collect money on your behalf.' },
  { question: 'Can I download and print my UPI QR code?', answer: 'Yes. Download the payment poster as a PNG image or PDF document. Scan it with a UPI app before displaying it to customers.' },
  { question: 'Is my uploaded logo sent to a server?', answer: 'The QR poster is generated in your browser. The optional image is read locally for the poster and is not uploaded by this tool.' },
];

export default function Page() {
  return (
    <ExpansionToolPage category="finance-calculators" eyebrow="Free UPI QR Code Generator" title="Create a UPI QR Code and Payment Poster" description="Generate a UPI payment QR code for your business or personal UPI ID, choose a poster color, and download a printable PNG or PDF. No account required." slug="upi-qr-code-generator">
      <UpiQrCodeGenerator />
      <article className="mt-12 max-w-4xl space-y-8 border-t border-[var(--border)] pt-8 text-[var(--foreground)]">
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Free UPI QR code generator for personal and business payments</h2>
          <p>A UPI QR code lets someone open a payment request by scanning a code with a compatible UPI app. This generator creates a QR code using your UPI ID and payee name. You can also create a ready-to-print payment poster for a shop counter, office, market stall, or personal use.</p>
          <p>The poster places your business name at the top, an optional photo or logo above the QR code, and payment details below it. Choose from five border colors and download a PNG or PDF. You do not need to register or upload your image to create the poster.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">How to make a UPI QR code</h2>
          <ol className="list-decimal space-y-2 pl-6">
            <li>Enter the business or person name you want displayed on the payment poster.</li>
            <li>Enter your UPI ID, such as a payment address supplied by your bank or UPI app. Double-check it for typing errors.</li>
            <li>Optionally enter a mobile number to display, a fixed payment amount in INR, and a payment note.</li>
            <li>Optionally select a PNG, JPEG, or WebP photo or business logo under 5 MB. The image appears outside the QR code.</li>
            <li>Choose a poster color, review the live preview, and download a PNG or PDF.</li>
            <li>Before printing or sharing, scan the QR code with a UPI app and verify that the displayed recipient details are correct.</li>
          </ol>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">UPI QR code with or without a fixed amount</h2>
          <p>For a shop or service counter where every purchase has a different total, leave the amount field empty. The customer can enter the payment amount in their app. For a fixed-price item, event fee, or invoice, enter the amount so the QR code carries that requested value. The payer should still review the recipient and amount before authorizing a payment.</p>
          <p>The optional mobile number is printed on the poster for reference only; it is not used as the UPI payment address. The actual payment destination comes from the UPI ID field.</p>
        </section>
        <section className="space-y-3">
          <h2 className="text-2xl font-bold">Tips for printing and sharing your UPI payment poster</h2>
          <p>Keep the QR code clearly visible, avoid cropping its white margin, and print it at a size that customers can scan comfortably. Do not cover the code with a logo, sticker, or text. For a counter display, a PDF is convenient for printing; PNG works well for sharing a poster digitally. Always test the exported file rather than relying only on the on-screen preview.</p>
          <p>A generated QR code is not proof that a UPI ID belongs to a particular business or that a payment has been received. Confirm successful payments using your bank or UPI app, not a screenshot supplied by a payer.</p>
        </section>
        <section className="space-y-4">
          <h2 className="text-2xl font-bold">Frequently asked questions</h2>
          {questions.map(({ question, answer }) => (
            <div key={question} className="space-y-1">
              <h3 className="text-lg font-semibold">{question}</h3>
              <p>{answer}</p>
            </div>
          ))}
        </section>
        <p>Need a more detailed walkthrough? Read our <Link className="font-semibold text-[var(--primary)] underline" href="/guides/how-to-generate-upi-qr-code">guide to generating and using UPI QR codes</Link>.</p>
      </article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(({ question, answer }) => ({
          '@type': 'Question',
          name: question,
          acceptedAnswer: { '@type': 'Answer', text: answer },
        })),
      }).replace(/</g, '\\u003c') }} />
    </ExpansionToolPage>
  );
}
