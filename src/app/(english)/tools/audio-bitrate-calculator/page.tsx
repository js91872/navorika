import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import AudioBitrateCalculatorTool from '@/components/tools/media/AudioBitrateCalculatorTool';

export default function Page() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Audio Engineering"
      title="Audio Bitrate Calculator"
      description="Calculate audio bitrate from file size and duration, or estimate required storage from target bitrates."
      slug="audio-bitrate-calculator"
    >
      <AudioBitrateCalculatorTool />
    </ExpansionToolPage>
  );
}
