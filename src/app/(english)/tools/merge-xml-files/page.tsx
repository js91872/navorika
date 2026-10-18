import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import XmlMergeTool from '@/components/tools/XmlMergeTool';

export default function MergeXmlFilesPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Private browser-based XML utility"
      title="Merge XML Files Online"
      description="Combine up to 500 XML files with a maximum combined size of 10 MB into one valid XML document without uploading your data."
    >
      <XmlMergeTool />
    </ExpansionToolPage>
  );
}
