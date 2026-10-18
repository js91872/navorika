import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Apple Voice Audio Tools"
      title="M4A to MP3 Converter"
      description="Convert Apple Voice Memos and M4A/AAC audio recordings to universal MP3 format in your browser."
      slug="m4a-to-mp3-converter"
    >
      <MediaConverterTool
        slug="m4a-to-mp3-converter"
        toolTitle="M4A to MP3 Converter"
        toolDescription="Convert Apple Voice Memos and M4A/AAC audio files to universal MP3."
        inputLabel="M4A or AAC Audio File"
        acceptedFormats={['m4a', 'aac']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="audio-to-audio"
      />
    </ExpansionToolPage>
  );
}
