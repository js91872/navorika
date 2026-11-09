import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import FpsCalculator from '@/components/tools/FpsCalculator';

export default function Page() {
  return <ExpansionToolPage category="everyday-calculators" eyebrow="Gaming and video frame rate" title="FPS Calculator — Frames Per Second to Milliseconds" description="Convert FPS to frame time in milliseconds, calculate total frames, and compare frame rate with monitor refresh rate." slug="fps-calculator"><FpsCalculator /></ExpansionToolPage>;
}
