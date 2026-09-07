import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="WebM Audio Tools"
      title="WEBM to MP3 Converter"
      description="Convert WebM video and audio recordings to universal MP3 format locally in your browser."
      slug="webm-to-mp3-converter"
    >
      <MediaConverterTool
        slug="webm-to-mp3-converter"
        toolTitle="WEBM to MP3 Converter"
        toolDescription="Convert WebM recordings to high-quality MP3 audio."
        inputLabel="WebM File (Video or Audio)"
        acceptedFormats={['webm']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
