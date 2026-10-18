import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="MP4 Media Tools"
      title="MP4 to MP3 Converter"
      description="Convert MP4 video clips, webinars, and screen recordings to MP3 audio files locally in your browser."
      slug="mp4-to-mp3-converter"
    >
      <MediaConverterTool
        slug="mp4-to-mp3-converter"
        toolTitle="MP4 to MP3 Converter"
        toolDescription="Convert MP4 video files to high-quality MP3 audio."
        inputLabel="MP4 Video File"
        acceptedFormats={['mp4']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
