import type {Metadata} from 'next';
import Link from 'next/link';
import SpeakerAudioStudio from '@/components/tools/SpeakerAudioStudio';
import { languageAlternates } from '@/lib/i18n/config';

const url='https://navorika.com/tools/speaker-dust-cleaning-sound';
export const metadata:Metadata={
  title:'Speaker Dust Cleaning Sound – Free Online Speaker Cleaner | Navorika',
  description:'Try four speaker cleaning sound modes online: low-frequency pulse, frequency sweep, rhythmic pulse and sound test. Free for iPhone and Android.',
  alternates:{canonical:url,languages:languageAlternates('speaker-dust-cleaning-sound')},
  openGraph:{title:'Speaker Dust Cleaning Sound – Navorika Audio Lab',description:'Four sound modes and safe speaker troubleshooting guidance.',url,type:'website'}
};

const faqs=[
  ['Can sound really remove dust from a phone speaker?','There is no reliable evidence that sound removes packed dust or earwax from a speaker grille. Gentle external cleaning is more appropriate for dry debris.'],
  ['Can a low-frequency tone eject water?','Vibration can sometimes move small amounts of water near a speaker opening, but results vary by device and this is not a repair for water damage.'],
  ['Does this work on iPhone and Android?','The audio tool works in modern browsers that support Web Audio, including many iPhone and Android browsers. Hardware response differs.'],
  ['What frequency should I use?','There is no universal cleaning frequency. The 165 Hz mode is an experimental low-frequency tone, not a proven setting for every phone.'],
  ['Why does my phone speaker sound muffled?','Possible causes include water, blocked grilles, dirt, case interference, software settings or hardware damage. Diagnose the cause before repeating tones.']
];

export default function Page(){
  return (
    <div className="pb-16 pt-8 text-[#18181b] dark:text-[#f4f4f5]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="mb-4 text-sm">
          <Link href="/" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors">Home</Link>
          <span className="text-[#5b5b63] dark:text-[#a1a1aa] mx-2">/</span>
          <Link href="/tools" className="text-[#5b5b63] dark:text-[#a1a1aa] hover:text-[#e5322d] transition-colors">Tools</Link>
          <span className="text-[#5b5b63] dark:text-[#a1a1aa] mx-2">/</span>
          <span className="text-[#18181b] dark:text-white font-medium">Speaker Cleaner</span>
        </nav>
        <header className="mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#fff1f1] dark:bg-[#e5322d]/10 border border-[#fecaca] dark:border-[#e5322d]/20 text-[#e5322d] text-xs font-semibold mb-3">
            Audio Utility
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-[#18181b] dark:text-white tracking-tight">Speaker Dust Cleaning Sound &amp; Water Eject Tool</h1>
          <p className="mt-3 text-base text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">Play a low-frequency tone, sweep through frequencies, or test a muffled phone speaker with four selectable modes and safe troubleshooting guidance for iPhone and Android.</p>
        </header>

        <SpeakerAudioStudio/>

        <div className="mt-12 space-y-6 text-sm text-[#5b5b63] dark:text-[#a1a1aa] leading-relaxed">
          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">How to use the speaker cleaning sound tool</h2>
            <p>Turn down your phone volume, disconnect headphones, and select a mode. Place the phone on a dry stable surface with the speaker opening facing down if safe for your device. Press Start sound and listen at a comfortable level. Stop immediately if the sound is harsh, distorted or uncomfortable. Avoid repeated long sessions.</p>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">What do the four sound modes do?</h2>
            <p><strong className="text-[#18181b] dark:text-white">Deep Pulse</strong> plays a steady 165 Hz tone. <strong className="text-[#18181b] dark:text-white">Frequency Sweep</strong> moves between 200 and 2,000 Hz to help you hear changes in speaker response. <strong className="text-[#18181b] dark:text-white">Rhythmic Pulse</strong> switches a low-frequency tone on and off. <strong className="text-[#18181b] dark:text-white">Sound Check</strong> alternates test frequencies to help identify rattling, distortion or unusually weak output. These are audio modes, not certified cleaning procedures.</p>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">Speaker dust versus water: an important difference</h2>
            <p>Searches for speaker dust cleaning sound often combine two different problems. Water droplets near the speaker outlet may move when the speaker vibrates, but dry dust trapped behind a grille will not necessarily move. Sound does not dissolve dirt, remove sticky residue, repair torn diaphragms or reverse corrosion. If you see visible dust, use the device manufacturer's recommended gentle external cleaning procedure instead of inserting sharp objects.</p>
          </section>

          <section className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs">
            <h2 className="text-xl font-bold text-[#18181b] dark:text-white mb-2.5">Frequently asked questions</h2>
            <div className="space-y-4 mt-3">
              {faqs.map(([q,a])=>(
                <div key={q} className="border-b border-[#e4e4e8] dark:border-[#27272a] pb-3 last:border-b-0 last:pb-0">
                  <h3 className="text-base font-semibold text-[#18181b] dark:text-white">{q}</h3>
                  <p className="mt-1">{a}</p>
                </div>
              ))}
            </div>
          </section>

          <div className="rounded-xl border border-[#e4e4e8] dark:border-[#27272a] bg-white dark:bg-[#18181b] p-6 shadow-xs flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-[#18181b] dark:text-white">Read the complete cleaning guide</h2>
              <p className="text-xs text-[#5b5b63] dark:text-[#a1a1aa] mt-1">Learn safe steps for visible dust, wet speaker grilles, and distorted audio.</p>
            </div>
            <Link className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#e5322d] hover:text-[#c71f1e] shrink-0" href="/guides/how-to-clean-phone-speaker">
              How to clean phone speakers safely →
            </Link>
          </div>
        </div>

        <script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify({'@context':'https://schema.org','@type':'SoftwareApplication',name:'Speaker Dust Cleaning Sound',applicationCategory:'MultimediaApplication',operatingSystem:'Web',url,offers:{'@type':'Offer',price:'0',priceCurrency:'USD'}})}}/>
      </div>
    </div>
  );
}
