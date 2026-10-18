import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Audio Compression Tools"
      title="WAV to MP3 Converter"
      description="Compress large uncompressed WAV files to compact, universal MP3 audio directly in your browser."
      slug="wav-to-mp3-converter"
    >
      <MediaConverterTool
        slug="wav-to-mp3-converter"
        toolTitle="WAV to MP3 Converter"
        toolDescription="Compress uncompressed WAV audio files to high-quality MP3."
        inputLabel="WAV Audio File"
        acceptedFormats={['wav']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="audio-to-audio"
      />
    </ExpansionToolPage>
  );
}
