import Link from 'next/link';
import { ArrowLeft, ArrowUpRight, ExternalLink } from 'lucide-react';
import HeartRateCalculator from '@/components/tools/HeartRateCalculator';

const faqs = [
  { question: 'How do I convert a pulse count to BPM?', answer: 'Multiply the beats you counted by 60 divided by the number of seconds counted. For example, 18 beats in 15 seconds is 18 × 4 = 72 BPM.' },
  { question: 'Is a 15-second pulse count accurate?', answer: 'It is a quick estimate. A 60-second count gives more opportunity to notice an uneven rhythm and avoids magnifying a one-beat counting error. Follow a clinician’s instructions when monitoring a health concern.' },
  { question: 'What is a typical resting heart rate for adults?', answer: 'The American Heart Association describes 60–100 BPM as a typical resting range for most adults who are calm and feeling well. Fitness, medication, stress, illness and other factors can shift an individual result.' },
  { question: 'Is 220 minus age my exact maximum heart rate?', answer: 'No. It is a broad age-based population estimate. Your actual maximum can differ, and some medications and health conditions can make generic exercise targets unsuitable.' },
  { question: 'What are moderate and vigorous target heart-rate zones?', answer: 'The American Heart Association gives approximately 50–70% of estimated maximum for moderate activity and 70–85% for vigorous activity. These are general guides, not personal medical limits.' },
  { question: 'Does this calculator measure my heartbeat?', answer: 'No. It only converts a pulse count you enter and calculates age-based estimates. It does not access a camera, sensor, wearable or medical device.' },
];

export default function HeartRateCalculatorPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] px-4 pb-20 pt-24 text-[var(--foreground)] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link href="/categories/health-calculators" className="mb-7 inline-flex items-center gap-2 text-sm font-semibold text-[var(--muted-foreground)] transition hover:text-indigo-600">
          <ArrowLeft className="size-4" /> Back to Health Calculators
        </Link>

        <header className="mb-10 max-w-4xl">
          <p className="text-sm font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Manual pulse and exercise estimates</p>
          <h1 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl">Heart Rate Calculator</h1>
          <p className="mt-4 text-lg leading-8 text-[var(--muted-foreground)]">Convert a pulse you count manually into beats per minute, then estimate maximum heart rate, heart-rate reserve and exercise intensity ranges from age.</p>
        </header>

        <HeartRateCalculator />

        <article className="mx-auto mt-16 max-w-5xl space-y-12 text-[var(--muted-foreground)]">
          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">How to Calculate Heart Rate in BPM</h2>
            <p className="mt-4 leading-7">Find your pulse manually, count the beats for a known interval, and convert that count to one minute. At the wrist, the American Heart Association advises using the first two fingertips rather than the thumb and pressing lightly over the artery.</p>
            <div className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5">
              <p className="font-bold text-[var(--foreground)]">BPM = beats counted × (60 ÷ counting interval in seconds)</p>
              <ul className="mt-3 space-y-2 text-sm leading-6">
                <li><strong className="text-[var(--foreground)]">15-second example:</strong> 18 beats × 4 = 72 BPM.</li>
                <li><strong className="text-[var(--foreground)]">30-second example:</strong> 36 beats × 2 = 72 BPM.</li>
                <li><strong className="text-[var(--foreground)]">60-second example:</strong> 72 beats × 1 = 72 BPM.</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">What Is Resting Heart Rate?</h2>
            <p className="mt-4 leading-7">Resting heart rate is the number of heartbeats per minute while you are resting. A useful time to check is after sleep, before getting out of bed or having caffeine. The American Heart Association describes 60–100 BPM as typical for most adults who are calm and feeling well, while noting that active people may be lower.</p>
            <p className="mt-3 leading-7">A number outside that broad range is not a diagnosis. What is usual for you, how you feel, whether the rhythm seems regular, and factors such as medication or illness all matter.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Estimated Maximum Heart Rate</h2>
            <p className="mt-4 leading-7">The calculator uses <strong className="text-[var(--foreground)]">220 − age</strong>. This is an age-predicted average, not a measured personal maximum and not a safe upper limit for every person. Heart-rate reserve is shown as that estimated maximum minus the resting rate you enter.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Exercise Heart-Rate Zones</h2>
            <p className="mt-4 leading-7">Using the same age estimate, the calculator shows the American Heart Association’s broad guide of about 50–70% of maximum for moderate-intensity activity and 70–85% for vigorous activity. The figures are averages. Perceived effort, the ability to speak during exercise, your fitness level and professional advice may be more appropriate guides in some situations.</p>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Factors That Can Change Heart Rate</h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {[
                ['Activity and fitness', 'Exercise raises heart rate, while regular training can be associated with a lower resting rate.'],
                ['Stress and emotions', 'Stress, anxiety and strong emotions can temporarily change pulse.'],
                ['Medication and health', 'Some medicines and medical conditions alter resting rate and exercise response.'],
                ['Temperature and hydration', 'Heat, illness, dehydration and recovery can affect a reading.'],
              ].map(([title, body]) => <div key={title} className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5"><h3 className="font-bold text-[var(--foreground)]">{title}</h3><p className="mt-2 text-sm leading-6">{body}</p></div>)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Important Limitations</h2>
            <div className="mt-5 rounded-2xl border border-amber-500/20 bg-amber-500/10 p-5 text-sm leading-6 text-[var(--foreground)]">
              <p>This educational calculator is not a monitor, diagnostic test or substitute for individualized medical advice. Short pulse counts magnify counting errors, and an irregular rhythm can make conversion less reliable. Age-based maximum and zone calculations have substantial individual variation.</p>
              <p className="mt-3">Seek urgent medical help for symptoms such as chest pain, fainting, severe shortness of breath or another concerning change. Ask a qualified health professional about exercise targets if you have a heart condition, take heart-rate-altering medication, are returning after illness, or have been advised to limit activity.</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Frequently Asked Questions</h2>
            <div className="mt-5 divide-y divide-[var(--border)] rounded-2xl border border-[var(--border)] bg-[var(--card)] px-6">
              {faqs.map(({ question, answer }) => <details key={question} className="py-5"><summary className="cursor-pointer font-semibold text-[var(--foreground)]">{question}</summary><p className="mt-3 text-sm leading-6">{answer}</p></details>)}
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Related Heart Rate and Fitness Guides</h2>
            <div className="mt-5 flex flex-wrap gap-3">
              {[
                ['Heart Rate Zones Guide', '/guides/heart-rate-zones-guide'],
                ['Running Calories Calculator', '/tools/running-calories-calculator'],
                ['Walking Calories Calculator', '/tools/walking-calories-calculator'],
                ['Calories Burned Calculator', '/tools/calories-burned-calculator'],
              ].map(([name, href]) => <Link key={href} href={href} className="inline-flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card)] px-4 py-3 text-sm font-semibold text-[var(--foreground)] transition hover:border-indigo-500/50"><span>{name}</span><ArrowUpRight className="size-4" /></Link>)}
            </div>
          </section>

          <section className="rounded-2xl border border-[var(--border)] bg-[var(--card)] p-6">
            <h2 className="text-2xl font-bold text-[var(--foreground)]">Sources &amp; Methodology</h2>
            <p className="mt-3 text-sm leading-6">Manual BPM uses the direct time conversion shown above. Resting-rate context, manual pulse guidance, the 220 − age estimate and exercise percentages are based on the cited public-health references. Navorika does not infer a diagnosis from the result.</p>
            <ul className="mt-4 space-y-3 text-sm">
              <li><a href="https://www.heart.org/en/healthy-living/exercise-and-physical-activity/fitness-basics/target-heart-rates" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:underline dark:text-indigo-400">American Heart Association — Target Heart Rates Chart <ExternalLink className="size-4" /></a></li>
              <li><a href="https://www.heart.org/en/health-topics/high-blood-pressure/the-facts-about-high-blood-pressure/all-about-heart-rate-pulse" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:underline dark:text-indigo-400">American Heart Association — All About Heart Rate (Pulse) <ExternalLink className="size-4" /></a></li>
              <li><a href="https://medlineplus.gov/ency/imagepages/19974.htm" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-semibold text-indigo-600 hover:underline dark:text-indigo-400">MedlinePlus — How to Take Your Pulse <ExternalLink className="size-4" /></a></li>
            </ul>
            <p className="mt-5 text-xs font-semibold uppercase tracking-wide text-[var(--muted-foreground)]">Last reviewed: <time dateTime="2026-08-25">August 25, 2026</time></p>
          </section>
        </article>
      </div>
    </main>
  );
}
