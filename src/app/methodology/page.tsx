'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Cpu,
  Server,
  Calculator,
  Globe,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  ArrowLeft,
  Binary,
  Layers,
} from 'lucide-react';

export default function MethodologyPage() {
  const lastUpdated = 'September 27, 2026';

  const sections = [
    {
      icon: <Cpu className="h-6 w-6 text-indigo-500" />,
      title: '1. Browser-Local Processing Architecture',
      description: 'Prioritizing on-device execution to ensure user privacy and instant performance.',
      details: [
        'Client-Side Execution: The overwhelming majority of Navorika utilities (including PDF manipulators, image resizers/converters, developer encoders, cryptographic studios, and calculators) run directly in your web browser using modern JavaScript, WebAssembly, and native browser APIs.',
        'Zero Server Transmission: Selected files (such as images, PDFs, JSON, or text files) and entered input values are parsed and transformed in volatile browser memory. They are not uploaded to, logged by, or retained on Navorika servers.',
        'Core Technologies: We utilize validated open-source web platform runtimes, including pdf-lib and pdf.js for document operations, native HTML5 Canvas for raster manipulation, and the W3C Web Cryptography API (window.crypto.subtle) for hardware-accelerated cryptographic operations.',
      ],
    },
    {
      icon: <Server className="h-6 w-6 text-indigo-500" />,
      title: '2. Ephemeral Server-Assisted Pipelines',
      description: 'Transparent disclosure for specialized file formats requiring server binaries.',
      details: [
        'Specialized Requirements: Specific complex conversions—such as STEP CAD to 3D PDF (requiring Open Cascade geometric tessellation) and CorelDRAW format bridge conversions—cannot yet be executed safely inside standard browser sandbox engines.',
        'Isolated Temporary Sandboxes: Server conversions execute inside temporary, sandboxed processing directories created uniquely per request.',
        'Immediate Deletion: Input and output files are deleted immediately from the host filesystem upon completion or failure of the request. Navorika does not maintain persistent file storage, user document caches, or secondary archives.',
      ],
    },
    {
      icon: <Calculator className="h-6 w-6 text-indigo-500" />,
      title: '3. Mathematical & Algorithmic Standards',
      description: 'Formulas derived from established statutory, academic, and engineering sources.',
      details: [
        'Financial Mathematics: Loan EMI calculations implement the standard universal amortization equation [P × r × (1 + r)^n] / [(1 + r)^n - 1]. Compound growth and SIP projections use standard continuous and monthly compounding annuities. Income tax estimations model official Central Board of Direct Taxes (CBDT) statutory tax slabs, Section 87A rebate ceilings, standard deductions, and applicable health/education cess.',
        'Health & Biometrics: Basal Metabolic Rate (BMR) calculations implement the validated Mifflin-St Jeor equation and the revised Harris-Benedict formula. Target exercise heart rates utilize the Karvonen formula factoring resting heart rate reserve. Energy expenditure estimates apply published Compendium of Physical Activities MET coefficients.',
        'Construction & Takeoffs: Volume and takeoff tools use standard geometric equations (length × width × depth) combined with empirical material densities (e.g. standard Portland concrete mix density of ~145–150 lbs/cu ft; sand/gravel bulk densities of ~1.4–1.6 tons/cu yd). Structural checks (such as joist deflection and roof pitch) reference standard International Building Code (IBC) and International Residential Code (IRC) L/360 load span criteria.',
      ],
    },
    {
      icon: <Globe className="h-6 w-6 text-indigo-500" />,
      title: '4. Live External Data Sources',
      description: 'Clear identification of tools that communicate with external APIs.',
      details: [
        'Currency Converter: The Navorika currency conversion utility queries published reference exchange rates sourced from the European Central Bank (ECB) via dated public reference feeds. The date and timestamp of the applied rate are displayed directly within the tool interface.',
        'No Tracking Data Sent: When external rate data is retrieved, the request contains only the requested currency pair and amount, with zero user-identifying telemetry or calculation history transmitted.',
      ],
    },
    {
      icon: <CheckCircle2 className="h-6 w-6 text-indigo-500" />,
      title: '5. Automated Testing & Verification Protocols',
      description: 'Rigorous test suites ensuring mathematical correctness and edge-case handling.',
      details: [
        'Unit Test Coverage: Every calculation engine in Navorika is tested via an automated Node.js test suite with hundreds of assertion checks across standard inputs, zero values, extreme bounds, and non-numeric entries.',
        'Precision Clamping: Floating-point arithmetic calculations are sanitized to prevent IEEE-754 binary floating-point rounding artifacts (e.g. 0.1 + 0.2 = 0.30000000000000004) through bounded decimal rounding functions.',
        'Security Auditing: Input sanitizers (such as in the HTML-to-image converter) undergo explicit security test suites to verify that scripts, event handlers, external network URIs, and dangerous active protocols are neutralized prior to rendering.',
      ],
    },
    {
      icon: <AlertCircle className="h-6 w-6 text-indigo-500" />,
      title: '6. Technical Limitations & Boundary Disclosures',
      description: 'Honest documentation of browser and platform constraints.',
      details: [
        'Client Memory Ceilings: Very large files (such as massive multi-hundred-megabyte PDFs or gigapixel images) can exceed browser tab memory allocations (typically 1.5–2 GB on desktop, less on mobile devices).',
        'Canvas Maximum Dimensions: Web browser canvas implementations impose maximum pixel dimension limits (e.g., 4096×4096 on some mobile browsers; 16384×16384 on modern desktop browsers). Images exceeding these limits are scaled safely.',
        'Metadata Stripping: Re-encoding images or rendering via canvas natively strips camera EXIF, GPS coordinates, and color profiles, unless explicitly parsed by dedicated metadata viewers.',
        'Interchange Vector Formats: CorelDRAW tools generate industry-standard open interchange files (PDF, SVG, EPS) rather than native proprietary CDR files, as documented on every tool layout.',
      ],
    },
    {
      icon: <RefreshCw className="h-6 w-6 text-indigo-500" />,
      title: '7. Review & Maintenance Cadence',
      description: 'Continuous oversight to keep formulas and standards up to date.',
      details: [
        'Statutory Fiscal Updates: Tax and retirement calculators are scheduled for annual review in accordance with published legislative amendments and budget announcements.',
        'Library Maintenance: Browser dependencies and parsing libraries (such as pdf-lib and pdf.js) are continuously updated to address upstream security fixes and browser platform compatibility changes.',
        'User Discrepancy Reporting: We welcome technical feedback from engineers, accountants, and practitioners. Bug reports and formula verification inquiries can be directed to our technical review inbox.',
      ],
    },
  ];

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-[var(--muted-foreground)] hover:text-[var(--foreground)] transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mb-12">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="h-8 w-8" />
            </div>
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight">Calculation Methodology &amp; Standards</h1>
              <p className="text-[var(--muted-foreground)] mt-1">
                Last updated: {lastUpdated}
              </p>
            </div>
          </div>
          <div className="p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-700 dark:text-indigo-300 text-sm leading-relaxed">
            <Binary className="h-5 w-5 inline mr-2 align-text-bottom" />
            <span>
              Transparency in calculation logic, browser security, automated testing, and technical limitations.
            </span>
          </div>
        </div>

        <div className="space-y-8">
          {sections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.07 }}
              className="p-6 sm:p-8 rounded-2xl bg-[var(--card)] border border-[var(--border)]"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 shrink-0 mt-1">
                  {section.icon}
                </div>
                <div>
                  <h2 className="text-xl font-bold">{section.title}</h2>
                  <p className="text-sm text-[var(--muted-foreground)] mt-1">{section.description}</p>
                </div>
              </div>

              <div className="space-y-3 pt-3 border-t border-[var(--border)]">
                {section.details.map((detail, i) => (
                  <div key={i} className="flex items-start gap-2.5 text-sm text-[var(--muted-foreground)] leading-relaxed">
                    <span className="text-indigo-500 font-bold mt-0.5">•</span>
                    <span>{detail}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-12 p-6 rounded-2xl bg-[var(--card)] border border-[var(--border)] text-center text-sm text-[var(--muted-foreground)]">
          <p>
            Review our{' '}
            <Link href="/disclaimer" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              Legal Disclaimer
            </Link>{' '}
            for category-specific caveats. To submit technical feedback or report calculation discrepancies, reach us at{' '}
            <a href="mailto:admin@navorika.com" className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">
              admin@navorika.com
            </a>
            .
          </p>
        </div>
      </div>
    </main>
  );
}
