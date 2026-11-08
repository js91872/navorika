import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import UpiQrCodeGenerator from '@/components/tools/UpiQrCodeGenerator';

export default function Page() {
  return <ExpansionToolPage category="finance-calculators" eyebrow="Free UPI QR Code Generator" title="Create a UPI QR Code and Payment Poster" description="Generate a UPI payment QR code for your business or personal UPI ID, choose a poster color, and download a printable PNG or PDF. No upload required." slug="upi-qr-code-generator"><UpiQrCodeGenerator /></ExpansionToolPage>;
}
