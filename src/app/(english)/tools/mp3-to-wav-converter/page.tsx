import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Web Audio API Engine"
      title="MP3 to WAV Converter"
      description="Decompress MP3 audio files to uncompressed 16-bit PCM WAV format instantly in your browser with zero server upload."
      slug="mp3-to-wav-converter"
    >
      <MediaConverterTool
        slug="mp3-to-wav-converter"
        toolTitle="MP3 to WAV Converter"
        toolDescription="Convert MP3 audio files to uncompressed 16-bit PCM WAV format."
        inputLabel="MP3 Audio File"
        acceptedFormats={['mp3']}
        defaultOutputFormat="wav"
        allowedOutputFormats={['wav']}
        mode="audio-to-audio"
      />
    </ExpansionToolPage>
  );
}
