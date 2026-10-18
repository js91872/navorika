import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Audio Stream Demuxing"
      title="Extract Audio from Video"
      description="Separate and extract soundtrack audio from video clips directly in your browser as MP3 or WAV without uploading."
      slug="extract-audio-from-video"
    >
      <MediaConverterTool
        slug="extract-audio-from-video"
        toolTitle="Extract Audio from Video"
        toolDescription="Separate and extract soundtrack audio from video clips as MP3 or WAV."
        inputLabel="Video File (MP4, WebM, MOV, MKV, AVI)"
        acceptedFormats={['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3', 'wav']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
