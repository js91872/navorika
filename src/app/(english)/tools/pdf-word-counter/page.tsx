import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfWordCounterTool from '@/components/tools/PdfWordCounterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="Count Words in a PDF Online"
      title="PDF Word Counter"
      description="Count words in a PDF online, including characters, sentences, paragraphs, pages, reading time and repeated-word frequency, without uploading the file."
      slug="pdf-word-counter"
    >
      <PdfWordCounterTool />
    </ExpansionToolPage>
  );
}
