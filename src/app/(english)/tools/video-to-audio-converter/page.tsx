import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import MediaConverterTool from '@/components/tools/media/MediaConverterTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Universal Media Transcoder"
      title="Video to Audio Converter"
      description="Universal in-browser video-to-audio converter. Extract and transcode video files into MP3, WAV, AAC, OGG, or FLAC audio formats."
      slug="video-to-audio-converter"
    >
      <MediaConverterTool
        slug="video-to-audio-converter"
        toolTitle="Video to Audio Converter"
        toolDescription="Convert video files into MP3, WAV, AAC, OGG, or FLAC audio formats."
        inputLabel="Video File (MP4, WebM, MOV, MKV, AVI, FLV)"
        acceptedFormats={['video/*', 'mp4', 'webm', 'mov', 'mkv', 'avi', 'flv']}
        defaultOutputFormat="mp3"
        allowedOutputFormats={['mp3', 'wav', 'aac', 'ogg', 'flac']}
        mode="video-to-audio"
      />
    </ExpansionToolPage>
  );
}
