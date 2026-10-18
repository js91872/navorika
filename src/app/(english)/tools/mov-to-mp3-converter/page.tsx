import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="QuickTime Audio Tools"
      title="MOV to MP3 Converter"
      description="Convert Apple QuickTime MOV videos and iPhone camera recordings to MP3 audio files locally in your browser."
      slug="mov-to-mp3-converter"
    >
      <MediaConverterTool
        slug="mov-to-mp3-converter"
        toolTitle="MOV to MP3 Converter"
        toolDescription="Convert QuickTime MOV videos to high-quality MP3 audio."
        inputLabel="QuickTime MOV Video File"
        acceptedFormats={['mov']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
