import '../globals.css';

export default function EmbedLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="m-0 bg-[#0b1425]">{children}</body>
    </html>
  );
}
