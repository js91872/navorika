import ExpansionToolPage from '@/components/tools/ExpansionToolPage';
import EpochTimeConverterTool from '@/components/tools/time/EpochTimeConverterTool';

export default function EpochTimeConverterPage() {
  return (
    <ExpansionToolPage
      category="developer-tools"
      eyebrow="Date, Time & Scheduling"
      title="Unix / Epoch Timestamp Converter"
      description="Convert Unix timestamps to human-readable dates and dates to epoch seconds or milliseconds with timezone awareness and live clock display."
      slug="epoch-time-converter"
    >
      <EpochTimeConverterTool />
    </ExpansionToolPage>
  );
}
