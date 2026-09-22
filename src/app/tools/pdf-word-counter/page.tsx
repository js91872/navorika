import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import PdfWordCounterTool from '@/components/tools/PdfWordCounterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="pdf-tools"
      eyebrow="Browser-Local PDF Text & Document Analysis"
      title="PDF Word Counter"
      description="Count words, characters, sentences, paragraphs, and reading time in any text-based PDF 100% locally in your browser. Get page-by-page breakdowns, repeated-word frequency, and basic writing quality checks without uploading your file."
      slug="pdf-word-counter"
    >
      <PdfWordCounterTool />
    </ExpansionToolPage>
  );
}
