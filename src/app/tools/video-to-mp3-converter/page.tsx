import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Video Audio Extraction"
      title="Video to MP3 Converter"
      description="Extract crystal-clear MP3 audio from any video container locally in your browser with selectable bitrates."
      slug="video-to-mp3-converter"
    >
      <MediaConverterTool
        slug="video-to-mp3-converter"
        toolTitle="Video to MP3 Converter"
        toolDescription="Convert MP4, WebM, MOV, MKV, and AVI video files to high-quality MP3 audio."
        inputLabel="Video File (MP4, WebM, MOV, MKV, AVI)"
        acceptedFormats={['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
