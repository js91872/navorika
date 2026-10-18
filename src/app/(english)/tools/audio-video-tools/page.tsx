import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import AudioVideoHub from '@/components/tools/media/AudioVideoHub';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Media Processing Suite"
      title="Audio & Video Tools"
      description="Private in-browser media suite: extract audio from video, convert audio formats, and calculate bitrates."
      slug="audio-video-tools"
    >
      <AudioVideoHub />
    </ExpansionToolPage>
  );
}
