'use client';

import { useId, useMemo, useState } from 'react';
import Link from 'next/link';
import {
  AlertTriangle,
  ArrowRight,
  Check,
  Code2,
  Copy,
  Download,
  FileCode,
  FileText,
  Layers,
  Mail,
  Monitor,
  Palette,
  RefreshCw,
  ShieldCheck,
  Sliders,
  Smartphone,
  Sparkles,
  Tablet,
  Upload,
} from 'lucide-react';

interface PsdHeaderInfo {
  filename: string;
  fileSizeBytes: number;
  version: number;
  channels: number;
  height: number;
  width: number;
  depth: number;
  colorMode: string;
  isCmyk: boolean;
  recommendedBreakpoint: string;
  notes: string[];
}

type ConversionMode = 'semantic-html' | 'tailwind' | 'email';
type PreviewDevice = 'desktop' | 'tablet' | 'mobile';

const COLOR_MODES: Record<number, string> = {
  0: 'Bitmap',
  1: 'Grayscale',
  2: 'Indexed',
  3: 'RGB',
  4: 'CMYK',
  7: 'Multichannel',
  8: 'Duotone',
  9: 'Lab',
};

export default function PsdToHtmlTool() {
  const [psdInfo, setPsdInfo] = useState<PsdHeaderInfo | null>(null);
  const [parseError, setParseError] = useState<string | null>(null);
  const [conversionMode, setConversionMode] = useState<ConversionMode>('semantic-html');
  const [previewDevice, setPreviewDevice] = useState<PreviewDevice>('desktop');
  const [copiedTab, setCopiedTab] = useState<string | null>(null);

  // Layout customization state
  const [containerWidth, setContainerWidth] = useState<number>(1200);
  const [brandColor, setBrandColor] = useState<string>('#4f46e5');
  const [fontFamily, setFontFamily] = useState<string>('system-ui, -apple-system, sans-serif');
  const [includeNav, setIncludeNav] = useState<boolean>(true);
  const [includeHero, setIncludeHero] = useState<boolean>(true);
  const [includeFeatures, setIncludeFeatures] = useState<boolean>(true);
  const [includeCta, setIncludeCta] = useState<boolean>(true);
  const [includeFooter, setIncludeFooter] = useState<boolean>(true);

  // Active tab in code output
  const [activeCodeTab, setActiveCodeTab] = useState<'html' | 'css' | 'checklist' | 'brief'>('html');

  // Input file handler with binary DataView parsing
  const handleFileUpload = (file: File) => {
    setParseError(null);
    if (!file.name.toLowerCase().endsWith('.psd') && file.type !== 'image/vnd.adobe.photoshop') {
      // Still attempt if user uploaded binary, but note it
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const buffer = e.target?.result as ArrayBuffer;
        if (!buffer || buffer.byteLength < 26) {
          throw new Error('File is too small to contain a valid Photoshop (PSD) header (minimum 26 bytes).');
        }

        const view = new DataView(buffer);
        // Signature: 4 bytes '8BPS' = 0x38 0x42 0x50 0x53
        const sig0 = view.getUint8(0);
        const sig1 = view.getUint8(1);
        const sig2 = view.getUint8(2);
        const sig3 = view.getUint8(3);
        const sig = String.fromCharCode(sig0, sig1, sig2, sig3);

        if (sig !== '8BPS') {
          throw new Error(
            `Invalid Photoshop file signature "${sig}". Genuine PSD files start with magic bytes "8BPS". Please select an authentic Adobe Photoshop document.`
          );
        }

        const version = view.getUint16(4); // 1 = PSD, 2 = PSB
        const channels = view.getUint16(12); // 1 to 56
        const height = view.getUint32(14); // rows in px
        const width = view.getUint32(18); // columns in px
        const depth = view.getUint16(22); // 1, 8, 16, 32 bits per channel
        const modeNum = view.getUint16(24); // Color mode
        const colorMode = COLOR_MODES[modeNum] ?? `Mode ${modeNum}`;
        const isCmyk = modeNum === 4;

        const notes: string[] = [];
        if (isCmyk) {
          notes.push('Warning: Artwork is in CMYK mode. Web browsers and email clients require sRGB. Convert to RGB in Photoshop (Image → Mode → RGB) before slicing assets.');
        } else if (colorMode === 'RGB') {
          notes.push('Valid web color space (sRGB). Suitable for direct web asset export.');
        }

        if (depth > 8) {
          notes.push(`Notice: ${depth}-bit color depth detected. Web browsers display 8-bit standard dynamic range; export standard 8-bit sRGB WebP or PNG images.`);
        }

        let recommendedBreakpoint = 'Standard Desktop (1200px - 1440px)';
        if (width <= 640) {
          recommendedBreakpoint = 'Mobile / HTML Email (600px max-width container)';
          setContainerWidth(600);
          setConversionMode('email');
        } else if (width <= 1024) {
          recommendedBreakpoint = 'Tablet viewport (768px - 960px container)';
          setContainerWidth(960);
        } else if (width > 1600) {
          recommendedBreakpoint = 'Retina 2x or Ultra-wide artboard (Suggest 1200px max-width fluid container with 2x asset exports)';
          setContainerWidth(1200);
        } else {
          setContainerWidth(Math.min(width, 1280));
        }

        setPsdInfo({
          filename: file.name,
          fileSizeBytes: file.size,
          version,
          channels,
          height,
          width,
          depth,
          colorMode,
          isCmyk,
          recommendedBreakpoint,
          notes,
        });
      } catch (err: unknown) {
        setParseError(err instanceof Error ? err.message : 'Failed to inspect PSD file header.');
      }
    };
    reader.onerror = () => {
      setParseError('Error reading file from disk.');
    };
    reader.readAsArrayBuffer(file.slice(0, 1024)); // Read first 1KB
  };

  const loadSamplePreset = (type: 'landing' | 'email') => {
    setParseError(null);
    if (type === 'landing') {
      setPsdInfo({
        filename: 'landing-page-hero-1440px.psd',
        fileSizeBytes: 24589000,
        version: 1,
        channels: 3,
        height: 2800,
        width: 1440,
        depth: 8,
        colorMode: 'RGB',
        isCmyk: false,
        recommendedBreakpoint: 'Standard Desktop (1200px container, 1440px artboard)',
        notes: [
          'Preflight confirmed: 1440px artboard with 12-column responsive grid.',
          'Color space: Standard RGB (sRGB IEC61966-2.1).',
          'Asset slicing: Ready for SVG vectors and WebP responsive images.',
        ],
      });
      setContainerWidth(1200);
      setConversionMode('semantic-html');
    } else {
      setPsdInfo({
        filename: 'marketing-newsletter-600px.psd',
        fileSizeBytes: 8920000,
        version: 1,
        channels: 3,
        height: 1600,
        width: 600,
        depth: 8,
        colorMode: 'RGB',
        isCmyk: false,
        recommendedBreakpoint: 'HTML Email (600px fixed-width table container)',
        notes: [
          'Preflight confirmed: 600px artboard optimized for desktop and mobile email clients.',
          'Layout target: Nested table architecture with inline CSS styles.',
          'Client compatibility: Microsoft Outlook, Apple Mail, and Gmail compliant.',
        ],
      });
      setContainerWidth(600);
      setConversionMode('email');
    }
  };

  // Generate production HTML code
  const generatedHtml = useMemo(() => {
    if (conversionMode === 'email') {
      return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="x-apple-disable-message-reformatting" />
  <title>PSD to Responsive HTML Email</title>
  <style type="text/css">
    body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; outline: none; text-decoration: none; display: block; }
    @media only screen and (max-width: 620px) {
      .email-container { width: 100% !important; max-width: 100% !important; }
      .fluid-column { display: block !important; width: 100% !important; box-sizing: border-box !important; }
      .mobile-center { text-align: center !important; }
      .mobile-padding { padding-left: 20px !important; padding-right: 20px !important; }
    }
  </style>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
</head>
<body style="margin: 0; padding: 0; background-color: #f4f5f7; font-family: ${fontFamily}; color: #1e293b;">
  <center style="width: 100%; background-color: #f4f5f7;">
    <!--[if mso]>
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="${containerWidth}">
    <tr><td>
    <![endif]-->
    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: ${containerWidth}px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden;" class="email-container">
      ${includeNav ? `<!-- Header / Logo -->
      <tr>
        <td style="padding: 28px 32px; background-color: #ffffff; border-bottom: 1px solid #f1f5f9;" class="mobile-padding mobile-center">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td style="font-size: 20px; font-weight: 700; color: #0f172a; text-decoration: none;">
                BrandLogo
              </td>
              <td align="right" style="font-size: 14px;" class="mobile-center">
                <a href="https://example.com" style="color: ${brandColor}; text-decoration: none; font-weight: 600;">View Online</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>` : ''}

      ${includeHero ? `<!-- Hero Section -->
      <tr>
        <td style="padding: 40px 32px; background-color: #0f172a; text-align: center;" class="mobile-padding">
          <h1 style="margin: 0 0 16px 0; font-size: 28px; line-height: 1.3; font-weight: 800; color: #ffffff;">
            Pixel-Perfect Email from Your PSD
          </h1>
          <p style="margin: 0 0 28px 0; font-size: 16px; line-height: 1.6; color: #94a3b8; max-width: 480px; display: inline-block;">
            Table-based layout engineered for strict email client compatibility across Outlook, Gmail, and Apple Mail.
          </p>
          <div>
            <!-- Bulletproof Button -->
            <a href="https://example.com/cta" style="background-color: ${brandColor}; color: #ffffff; padding: 14px 28px; font-size: 15px; font-weight: 700; text-decoration: none; border-radius: 6px; display: inline-block;">
              Claim Your Access &rarr;
            </a>
          </div>
        </td>
      </tr>` : ''}

      ${includeFeatures ? `<!-- Feature Columns (Two Column Responsive) -->
      <tr>
        <td style="padding: 36px 32px; background-color: #ffffff;" class="mobile-padding">
          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
            <tr>
              <td width="48%" valign="top" class="fluid-column" style="padding-bottom: 20px;">
                <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">Inline CSS Styles</div>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #64748b;">All critical styles are inlined directly onto elements to prevent webmail head-stripping.</p>
              </td>
              <td width="4%" class="fluid-column" style="padding-bottom: 20px;">&nbsp;</td>
              <td width="48%" valign="top" class="fluid-column" style="padding-bottom: 20px;">
                <div style="font-size: 16px; font-weight: 700; color: #0f172a; margin-bottom: 8px;">600px Max-Width Standard</div>
                <p style="margin: 0; font-size: 14px; line-height: 1.5; color: #64748b;">Ensures zero horizontal scrolling in fixed desktop panes while adapting fluidly on mobile.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>` : ''}

      ${includeFooter ? `<!-- Footer -->
      <tr>
        <td style="padding: 32px; background-color: #f8fafc; border-top: 1px solid #e2e8f0; text-align: center; font-size: 12px; color: #94a3b8; line-height: 1.6;" class="mobile-padding">
          <p style="margin: 0 0 8px 0;">&copy; 2026 Your Company. Handcrafted from PSD mockup design.</p>
          <p style="margin: 0;">
            <a href="https://example.com/unsubscribe" style="color: #64748b; text-decoration: underline;">Unsubscribe</a> &bull;
            <a href="https://example.com/privacy" style="color: #64748b; text-decoration: underline;">Privacy Policy</a>
          </p>
        </td>
      </tr>` : ''}
    </table>
    <!--[if mso]>
    </td></tr></table>
    <![endif]-->
  </center>
</body>
</html>`;
    }

    if (conversionMode === 'tailwind') {
      return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PSD to Responsive Tailwind CSS</title>
  <script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-slate-50 text-slate-900 antialiased font-sans">
  ${includeNav ? `<!-- Navbar -->
  <header class="border-b border-slate-200 bg-white sticky top-0 z-50">
    <div class="max-w-[${containerWidth}px] mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <a href="#" class="font-black text-xl tracking-tight text-slate-900">BrandLogo</a>
      <nav class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#features" class="hover:text-indigo-600 transition-colors">Features</a>
        <a href="#solutions" class="hover:text-indigo-600 transition-colors">Solutions</a>
        <a href="#pricing" class="hover:text-indigo-600 transition-colors">Pricing</a>
      </nav>
      <a href="#cta" class="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-[${brandColor}] text-white shadow-sm hover:opacity-95 transition-opacity">
        Get Started
      </a>
    </div>
  </header>` : ''}

  ${includeHero ? `<!-- Hero Section -->
  <section class="py-20 lg:py-28 max-w-[${containerWidth}px] mx-auto px-4 sm:px-6 lg:px-8">
    <div class="grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <span class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 mb-6">
          PSD Layer Handoff Ready
        </span>
        <h1 class="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-slate-900 leading-tight">
          Translate Photoshop Artwork into Production Code
        </h1>
        <p class="mt-6 text-lg text-slate-600 leading-relaxed">
          Clean semantic markup, utility-first styling, and responsive CSS Flexbox / Grid scaffolding mapped directly from design artboard layers.
        </p>
        <div class="mt-8 flex flex-wrap gap-4">
          <a href="#get-started" class="px-6 py-3.5 rounded-xl font-bold text-white bg-[${brandColor}] shadow-md hover:shadow-lg transition-shadow">
            Start Conversion
          </a>
          <a href="#docs" class="px-6 py-3.5 rounded-xl font-bold text-slate-700 bg-white border border-slate-300 hover:bg-slate-100 transition-colors">
            View Layer Checklist
          </a>
        </div>
      </div>
      <div class="rounded-2xl border border-slate-200 bg-white p-8 shadow-xl">
        <div class="aspect-video rounded-xl bg-slate-100 flex items-center justify-center border border-dashed border-slate-300 text-slate-400 font-medium">
          Hero Graphic Slice (WebP / SVG Asset)
        </div>
      </div>
    </div>
  </section>` : ''}

  ${includeFeatures ? `<!-- Features Grid -->
  <section id="features" class="py-16 bg-white border-y border-slate-200">
    <div class="max-w-[${containerWidth}px] mx-auto px-4 sm:px-6 lg:px-8">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-extrabold text-slate-900">Engineered for Front-End Quality</h2>
        <p class="mt-4 text-slate-600">Built to replace fragile absolute positioning with clean, maintainable flexbox and grid layouts.</p>
      </div>
      <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
        <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-colors">
          <div class="size-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">1</div>
          <h3 class="font-bold text-lg text-slate-900">Semantic HTML5 Tags</h3>
          <p class="mt-2 text-sm text-slate-600">Replaces generic divs with proper header, nav, main, article, and section landmarks for accessibility.</p>
        </div>
        <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-colors">
          <div class="size-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">2</div>
          <h3 class="font-bold text-lg text-slate-900">Responsive Flexbox & Grid</h3>
          <p class="mt-2 text-sm text-slate-600">Dynamic column wrapping and gap spacing that adapt effortlessly from 375px mobile to 4K displays.</p>
        </div>
        <div class="p-6 rounded-2xl border border-slate-200 bg-slate-50 hover:border-indigo-300 transition-colors">
          <div class="size-10 rounded-xl bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center mb-4">3</div>
          <h3 class="font-bold text-lg text-slate-900">Retina 2x Asset Export</h3>
          <p class="mt-2 text-sm text-slate-600">Slices icons as mathematical SVGs and photographic imagery as modern WebP with srcset fallbacks.</p>
        </div>
      </div>
    </div>
  </section>` : ''}

  ${includeFooter ? `<!-- Footer -->
  <footer class="py-12 bg-slate-900 text-slate-400 text-sm">
    <div class="max-w-[${containerWidth}px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
      <p>&copy; 2026 BrandLogo. Converted from PSD design specifications.</p>
      <div class="flex gap-6">
        <a href="#" class="hover:text-white transition-colors">Privacy</a>
        <a href="#" class="hover:text-white transition-colors">Terms</a>
        <a href="#" class="hover:text-white transition-colors">Developer Brief</a>
      </div>
    </div>
  </footer>` : ''}
</body>
</html>`;
    }

    // Default: Semantic HTML5 + Modern CSS Flexbox/Grid
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>PSD to Semantic HTML5 & Modern CSS</title>
  <link rel="stylesheet" href="styles.css" />
</head>
<body>
  ${includeNav ? `<!-- Site Header & Navigation -->
  <header class="site-header">
    <div class="container header-container">
      <a href="/" class="brand-logo">BrandLogo</a>
      <nav class="main-navigation" aria-label="Primary Navigation">
        <ul class="nav-list">
          <li><a href="#features">Features</a></li>
          <li><a href="#layout">Layout</a></li>
          <li><a href="#checklist">Handoff</a></li>
        </ul>
      </nav>
      <div class="header-actions">
        <a href="#cta" class="button button-primary">Get Started</a>
      </div>
    </div>
  </header>` : ''}

  <main id="main-content">
    ${includeHero ? `<!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <span class="badge">PSD to Production HTML</span>
          <h1 class="hero-title">High-Fidelity Code from Photoshop Mockups</h1>
          <p class="hero-description">
            Transform desktop and mobile artboards into clean, accessible HTML5 templates powered by responsive CSS Flexbox and modern CSS Grid.
          </p>
          <div class="hero-buttons">
            <a href="#cta" class="button button-primary">Explore Workflow</a>
            <a href="#features" class="button button-secondary">Layer Checklist</a>
          </div>
        </div>
        <div class="hero-media">
          <div class="media-placeholder" aria-label="Hero visual placeholder">
            <span>Hero Artwork Slice (SVG / WebP)</span>
          </div>
        </div>
      </div>
    </section>` : ''}

    ${includeFeatures ? `<!-- Features / Benefits Grid -->
    <section id="features" class="features-section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">Clean Front-End Architecture</h2>
          <p class="section-subtitle">No bloated code, no inline position hacks. True responsive web layout.</p>
        </div>
        <div class="features-grid">
          <article class="feature-card">
            <div class="card-icon">01</div>
            <h3 class="card-title">Semantic Structure</h3>
            <p class="card-text">Proper HTML5 sectioning and accessible landmarks ensure screen readers and search engines understand your content.</p>
          </article>
          <article class="feature-card">
            <div class="card-icon">02</div>
            <h3 class="card-title">Modern CSS Flexbox</h3>
            <p class="card-text">Container-based flex alignment and modern gap spacing replace legacy float clearing and negative margin hacks.</p>
          </article>
          <article class="feature-card">
            <div class="card-icon">03</div>
            <h3 class="card-title">Asset Preflight</h3>
            <p class="card-text">Checks color space (sRGB vs CMYK), dimensions, and DPI so graphics look razor-sharp on every screen.</p>
          </article>
        </div>
      </div>
    </section>` : ''}

    ${includeCta ? `<!-- Conversion Callout Section -->
    <section id="cta" class="cta-section">
      <div class="container cta-container">
        <h2 class="cta-title">Ready to Code Your Design?</h2>
        <p class="cta-subtitle">Use our developer handoff checklist to ensure all smart objects, SVGs, and web fonts are exported cleanly.</p>
        <a href="#checklist" class="button button-primary button-large">Download Handoff Brief</a>
      </div>
    </section>` : ''}
  </main>

  ${includeFooter ? `<!-- Site Footer -->
  <footer class="site-footer">
    <div class="container footer-container">
      <p class="copyright">&copy; 2026 BrandLogo. Converted with Navorika PSD to HTML workflow.</p>
      <ul class="footer-links">
        <li><a href="#privacy">Privacy</a></li>
        <li><a href="#terms">Terms</a></li>
        <li><a href="#contact">Contact</a></li>
      </ul>
    </div>
  </footer>` : ''}
</body>
</html>`;
  }, [conversionMode, containerWidth, brandColor, fontFamily, includeNav, includeHero, includeFeatures, includeCta, includeFooter]);

  // Generate modern CSS code
  const generatedCss = useMemo(() => {
    return `/* ==========================================================================
   PSD to HTML Master Stylesheet
   Built with Semantic HTML5, CSS Flexbox & Modern CSS Variables
   ========================================================================== */

:root {
  --container-max-width: ${containerWidth}px;
  --font-family: ${fontFamily};
  --color-primary: ${brandColor};
  --color-primary-hover: #3730a3;
  --color-background: #ffffff;
  --color-surface: #f8fafc;
  --color-text-main: #0f172a;
  --color-text-muted: #64748b;
  --color-border: #e2e8f0;
  --border-radius-base: 12px;
  --spacing-unit: 8px;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: var(--font-family);
  color: var(--color-text-main);
  background-color: var(--color-background);
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
}

/* Global Container */
.container {
  width: 100%;
  max-width: var(--container-max-width);
  margin-left: auto;
  margin-right: auto;
  padding-left: calc(var(--spacing-unit) * 3);
  padding-right: calc(var(--spacing-unit) * 3);
}

/* Header & Navigation (Flexbox) */
.site-header {
  border-bottom: 1px solid var(--color-border);
  background-color: var(--color-background);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 72px;
}

.brand-logo {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--color-text-main);
  text-decoration: none;
  letter-spacing: -0.025em;
}

.nav-list {
  display: flex;
  align-items: center;
  gap: calc(var(--spacing-unit) * 4);
  list-style: none;
}

.nav-list a {
  color: var(--color-text-muted);
  text-decoration: none;
  font-weight: 600;
  font-size: 0.9375rem;
  transition: color 0.15s ease;
}

.nav-list a:hover {
  color: var(--color-primary);
}

/* Button Styles */
.button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 0.9375rem;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid transparent;
}

.button-primary {
  background-color: var(--color-primary);
  color: #ffffff;
}

.button-primary:hover {
  opacity: 0.92;
  transform: translateY(-1px);
}

.button-secondary {
  background-color: transparent;
  color: var(--color-text-main);
  border-color: var(--color-border);
}

.button-secondary:hover {
  background-color: var(--color-surface);
}

.button-large {
  padding: 14px 28px;
  font-size: 1.0625rem;
}

/* Hero Section (Flexbox / Grid) */
.hero-section {
  padding: calc(var(--spacing-unit) * 10) 0;
  background: linear-gradient(180deg, var(--color-surface) 0%, var(--color-background) 100%);
}

.hero-container {
  display: grid;
  grid-template-columns: 1fr;
  gap: calc(var(--spacing-unit) * 6);
  align-items: center;
}

@media (min-width: 900px) {
  .hero-container {
    grid-template-columns: 1.1fr 0.9fr;
  }
}

.badge {
  display: inline-block;
  padding: 4px 12px;
  background-color: rgba(79, 70, 229, 0.1);
  color: var(--color-primary);
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.hero-title {
  font-size: clamp(2rem, 4vw + 1rem, 3.5rem);
  font-weight: 900;
  line-height: 1.15;
  letter-spacing: -0.03em;
  margin-bottom: 1.25rem;
}

.hero-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.7;
  margin-bottom: 2rem;
}

.hero-buttons {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}

.hero-media .media-placeholder {
  aspect-ratio: 16 / 10;
  border-radius: var(--border-radius-base);
  border: 2px dashed var(--color-border);
  background-color: var(--color-surface);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  font-weight: 600;
}

/* Features Section (CSS Grid) */
.features-section {
  padding: calc(var(--spacing-unit) * 12) 0;
  border-top: 1px solid var(--color-border);
}

.section-header {
  text-align: center;
  max-width: 600px;
  margin: 0 auto calc(var(--spacing-unit) * 8) auto;
}

.section-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  margin-bottom: 0.75rem;
}

.section-subtitle {
  color: var(--color-text-muted);
  font-size: 1.125rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: calc(var(--spacing-unit) * 4);
}

.feature-card {
  padding: calc(var(--spacing-unit) * 4);
  border-radius: var(--border-radius-base);
  border: 1px solid var(--color-border);
  background-color: var(--color-background);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px -8px rgba(0, 0, 0, 0.08);
}

.card-icon {
  font-weight: 800;
  font-size: 1rem;
  color: var(--color-primary);
  margin-bottom: 1rem;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.card-text {
  color: var(--color-text-muted);
  font-size: 0.9375rem;
}

/* CTA Callout */
.cta-section {
  padding: calc(var(--spacing-unit) * 10) 0;
  background-color: var(--color-surface);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.cta-title {
  font-size: 2rem;
  font-weight: 800;
  margin-bottom: 0.75rem;
}

.cta-subtitle {
  color: var(--color-text-muted);
  margin-bottom: 1.5rem;
}

/* Footer (Flexbox) */
.site-footer {
  padding: calc(var(--spacing-unit) * 6) 0;
  background-color: #0f172a;
  color: #94a3b8;
  font-size: 0.875rem;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

@media (min-width: 640px) {
  .footer-container {
    flex-direction: row;
  }
}

.footer-links {
  display: flex;
  gap: 1.5rem;
  list-style: none;
}

.footer-links a {
  color: inherit;
  text-decoration: none;
}

.footer-links a:hover {
  color: #ffffff;
}

/* Responsive Utilities */
@media (max-width: 768px) {
  .nav-list {
    display: none; /* In production, toggle mobile hamburger menu */
  }
  .header-actions {
    margin-left: auto;
  }
}
`;
  }, [containerWidth, fontFamily, brandColor]);

  // Shareable Resource: Developer Conversion Brief Markdown
  const developerBriefMarkdown = useMemo(() => {
    return `# PSD to HTML Front-End Conversion Specification & Brief
**Project:** ${psdInfo?.filename ?? 'Web Mockup PSD'}  
**Container Max-Width:** ${containerWidth}px  
**Target Output:** ${conversionMode === 'email' ? 'Responsive HTML Email (Table-based inline CSS)' : 'Semantic HTML5 + CSS Flexbox / Modern CSS'}  
**Primary Brand Color:** ${brandColor}  
**Font Stack:** ${fontFamily}  
**Preflight Color Space:** ${psdInfo?.colorMode ?? 'sRGB'} (${psdInfo?.isCmyk ? 'WARNING: CMYK detected, requires sRGB conversion' : 'sRGB verified'})  
**Source Canvas:** ${psdInfo ? `${psdInfo.width}px × ${psdInfo.height}px` : '1440px desktop mockup'}

---

## 1. Executive Summary & Design Scope
This document outlines the front-end implementation requirements to convert the provided Adobe Photoshop (.psd) artwork into production-ready, accessible, cross-browser web code.

## 2. Technical Stack & Standards
- **HTML:** HTML5 living standard with explicit semantic landmarks (\`<header>\`, \`<nav>\`, \`<main>\`, \`<section>\`, \`<article>\`, \`<footer>\`).
- **CSS Architecture:** Container-query and modern CSS Flexbox / CSS Grid. No float layouts or negative margin clearing hacks.
- **Typography:** Web fonts loaded via \`<link rel="preload">\` with \`font-display: swap\` and system fallback stacks.
- **Accessibility (WCAG 2.1 AA):** All interactive elements require visible \`:focus-visible\` states, minimum 4.5:1 text contrast ratio, and descriptive \`alt\` attributes on photographic images.

## 3. Asset Slicing & Export Matrix
| Asset Category | Format | Dimensions | Optimization Notes |
| :--- | :--- | :--- | :--- |
| **Logos & Icons** | SVG | Vector / Scalable | Export shape layers as clean SVG without raster effects. Strip unneeded XML metadata. |
| **Photographs & Heroes** | WebP + PNG/JPG | 1x and 2x Retina | Generate \`<picture>\` element with responsive \`srcset\` for standard and high-DPI displays. |
| **Decorative Patterns** | CSS / SVG | Repeating | Convert repeatable background gradients and solid panels to pure CSS code. |

## 4. Responsive Breakpoint Plan
- **Mobile (<640px):** Single-column vertical flow, collapsible navigation menu, minimum 44px tap targets.
- **Tablet (641px - 1024px):** 2-column card layouts, adjusted \`clamp()\` typography.
- **Desktop (1025px - ${containerWidth}px):** Full multi-column grid matching Photoshop artboard, centered container.

## 5. Developer QA & Sign-Off Checklist
- [ ] Color profile verified: sRGB (no CMYK desaturation).
- [ ] Clean semantic DOM structure verified (no unnecessary nested \`<div>\` wrappers).
- [ ] Tested across Chrome, Safari, Firefox, Edge, and iOS/Android mobile browsers.
- [ ] Lighthouse audit: Performance > 90, Accessibility > 95.
${conversionMode === 'email' ? '- [ ] Tested in Litmus / Email on Acid across Outlook 2019/365, Gmail app, and Apple Mail.\n- [ ] Inline CSS confirmed; zero external stylesheet dependencies.' : ''}

*Generated via Navorika PSD to HTML Developer Workspace.*
`;
  }, [psdInfo, containerWidth, conversionMode, brandColor, fontFamily]);

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedTab(label);
      setTimeout(() => setCopiedTab(null), 2000);
    } catch {
      // Fallback
    }
  };

  const downloadFile = (content: string, filename: string, mimeType: string) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const uploadInputId = useId();

  return (
    <div className="space-y-10">
      {/* 1. PSD Upload & Header Preflight Analysis */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-5">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Upload className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Photoshop (PSD) Preflight Inspector</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Drop your .psd file to inspect binary canvas dimensions, color space, and responsive readiness locally in memory.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => loadSamplePreset('landing')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              <Sparkles className="size-3.5 text-indigo-500" />
              <span>Load 1440px Landing Mockup</span>
            </button>
            <button
              type="button"
              onClick={() => loadSamplePreset('email')}
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-1.5 text-xs font-semibold hover:border-indigo-500 hover:text-indigo-600 transition-colors"
            >
              <Mail className="size-3.5 text-indigo-500" />
              <span>Load 600px Email Mockup</span>
            </button>
          </div>
        </div>

        {/* Dropzone */}
        <div className="mt-6">
          <label
            htmlFor={uploadInputId}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              if (e.dataTransfer.files?.[0]) {
                handleFileUpload(e.dataTransfer.files[0]);
              }
            }}
            className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-[var(--border)] bg-[var(--background)] p-8 text-center transition-colors hover:border-indigo-500/50 hover:bg-indigo-500/5"
          >
            <FileCode className="size-12 text-indigo-600 dark:text-indigo-400 mb-3" />
            <span className="text-sm font-bold text-[var(--foreground)]">
              Choose or drag &amp; drop an Adobe Photoshop (.psd) file
            </span>
            <span className="mt-1 text-xs text-[var(--muted-foreground)]">
              Client-side preflight: parses binary header for dimensions, bit depth, and color profile. Zero server upload.
            </span>
            <input
              id={uploadInputId}
              type="file"
              accept=".psd,image/vnd.adobe.photoshop"
              onChange={(e) => {
                if (e.target.files?.[0]) handleFileUpload(e.target.files[0]);
              }}
              className="hidden"
            />
          </label>
        </div>

        {parseError && (
          <div className="mt-4 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-xs text-rose-700 dark:text-rose-300">
            <AlertTriangle className="size-5 shrink-0 text-rose-500" />
            <div>
              <p className="font-semibold">Inspection Error</p>
              <p className="mt-0.5">{parseError}</p>
            </div>
          </div>
        )}

        {/* Preflight Results Card */}
        {psdInfo && (
          <div className="mt-6 rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border)] pb-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="size-4 text-emerald-500" />
                <span className="font-bold text-sm text-[var(--foreground)]">{psdInfo.filename}</span>
                <span className="text-xs text-[var(--muted-foreground)]">
                  ({(psdInfo.fileSizeBytes / (1024 * 1024)).toFixed(2)} MB)
                </span>
              </div>
              <span className="inline-flex items-center rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300">
                Binary Signature Valid (8BPS)
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4 text-xs">
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <span className="text-[var(--muted-foreground)] block">Artboard Canvas</span>
                <span className="mt-1 font-bold text-sm text-[var(--foreground)]">
                  {psdInfo.width} × {psdInfo.height} px
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <span className="text-[var(--muted-foreground)] block">Color Space</span>
                <span className={`mt-1 font-bold text-sm ${psdInfo.isCmyk ? 'text-amber-600' : 'text-emerald-600'}`}>
                  {psdInfo.colorMode} ({psdInfo.depth}-bit)
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <span className="text-[var(--muted-foreground)] block">Channels</span>
                <span className="mt-1 font-bold text-sm text-[var(--foreground)]">
                  {psdInfo.channels} channels
                </span>
              </div>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-3">
                <span className="text-[var(--muted-foreground)] block">Recommended Target</span>
                <span className="mt-1 font-bold text-sm text-indigo-600 dark:text-indigo-400">
                  {psdInfo.recommendedBreakpoint}
                </span>
              </div>
            </div>

            {/* Preflight Guidance Notes */}
            <div className="mt-4 space-y-1.5">
              {psdInfo.notes.map((note) => (
                <div
                  key={note}
                  className={`flex items-start gap-2 rounded-xl p-3 text-xs ${
                    note.includes('Warning')
                      ? 'border border-amber-500/20 bg-amber-500/10 text-amber-800 dark:text-amber-200'
                      : 'border border-indigo-500/20 bg-indigo-500/5 text-[var(--foreground)]'
                  }`}
                >
                  <Sparkles className="size-3.5 shrink-0 text-indigo-500 mt-0.5" />
                  <span>{note}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 2. Target Framework & Layout Scaffolding Controls */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex items-center gap-3 border-b border-[var(--border)] pb-5">
          <div className="grid size-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
            <Sliders className="size-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[var(--foreground)]">Conversion Target & Component Scaffolding</h2>
            <p className="text-xs text-[var(--muted-foreground)]">
              Choose output format, container width, responsive components, and brand styles.
            </p>
          </div>
        </div>

        {/* Framework Selector Pills */}
        <div className="mt-6">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Select Code Architecture
          </label>
          <div className="mt-2 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <button
              type="button"
              onClick={() => setConversionMode('semantic-html')}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                conversionMode === 'semantic-html'
                  ? 'border-indigo-600 bg-indigo-500/10 shadow-sm dark:border-indigo-400'
                  : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)]">
                <Code2 className="size-4 text-indigo-600" />
                <span>Semantic HTML5 + Flexbox</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Clean, standards-compliant HTML5 with CSS Flexbox &amp; Grid. Zero framework overhead.
              </p>
            </button>

            <button
              type="button"
              onClick={() => setConversionMode('tailwind')}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                conversionMode === 'tailwind'
                  ? 'border-indigo-600 bg-indigo-500/10 shadow-sm dark:border-indigo-400'
                  : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)]">
                <Sparkles className="size-4 text-indigo-600" />
                <span>Tailwind CSS Component</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Utility-first markup mapped directly to your design tokens, colors, and responsive scales.
              </p>
            </button>

            <button
              type="button"
              onClick={() => {
                setConversionMode('email');
                setContainerWidth(600);
              }}
              className={`flex flex-col items-start rounded-2xl border p-4 text-left transition-all ${
                conversionMode === 'email'
                  ? 'border-indigo-600 bg-indigo-500/10 shadow-sm dark:border-indigo-400'
                  : 'border-[var(--border)] bg-[var(--background)] hover:border-indigo-300'
              }`}
            >
              <div className="flex items-center gap-2 font-bold text-sm text-[var(--foreground)]">
                <Mail className="size-4 text-indigo-600" />
                <span>Responsive HTML Email</span>
              </div>
              <p className="mt-1 text-xs text-[var(--muted-foreground)]">
                Nested table layout, inline CSS, Outlook conditionals (MSO), and 600px max-width standard.
              </p>
            </button>
          </div>
        </div>

        {/* Configuration Controls Grid */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="text-xs font-bold text-[var(--foreground)]">
              Container Max-Width (px)
            </label>
            <input
              type="number"
              value={containerWidth}
              onChange={(e) => setContainerWidth(Number(e.target.value) || 1200)}
              step={20}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
            />
            <span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">
              {conversionMode === 'email' ? '600px recommended for email clients' : 'Typical web desktop: 1200px - 1440px'}
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--foreground)]">
              Primary Brand Accent Color
            </label>
            <div className="mt-1.5 flex items-center gap-2">
              <input
                type="color"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="size-9 cursor-pointer rounded-lg border border-[var(--border)] bg-transparent p-0.5"
              />
              <input
                type="text"
                value={brandColor}
                onChange={(e) => setBrandColor(e.target.value)}
                className="w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-mono outline-none focus:border-indigo-500"
              />
            </div>
            <span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">
              Applied to buttons, badges, and link states
            </span>
          </div>

          <div>
            <label className="text-xs font-bold text-[var(--foreground)]">
              Font Stack
            </label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="mt-1.5 w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 py-2 text-sm font-medium outline-none focus:border-indigo-500"
            >
              <option value="system-ui, -apple-system, sans-serif">Modern System Sans (Inter / SF Pro)</option>
              <option value="'Roboto', -apple-system, sans-serif">Roboto / Clean Sans</option>
              <option value="'Merriweather', Georgia, serif">Editorial Serif (Merriweather / Georgia)</option>
              <option value="'Courier New', Courier, monospace">Monospace / Technical</option>
            </select>
            <span className="mt-1 block text-[11px] text-[var(--muted-foreground)]">
              Font fallback stack for web and email
            </span>
          </div>
        </div>

        {/* Section Toggles */}
        <div className="mt-6 border-t border-[var(--border)] pt-5">
          <label className="text-xs font-bold uppercase tracking-wider text-[var(--muted-foreground)]">
            Sections to Include in Scaffolding
          </label>
          <div className="mt-3 flex flex-wrap gap-2 text-xs font-semibold">
            {[
              { label: 'Header & Nav', active: includeNav, toggle: () => setIncludeNav(!includeNav) },
              { label: 'Hero Section', active: includeHero, toggle: () => setIncludeHero(!includeHero) },
              { label: 'Features Grid', active: includeFeatures, toggle: () => setIncludeFeatures(!includeFeatures) },
              { label: 'CTA Callout', active: includeCta, toggle: () => setIncludeCta(!includeCta) },
              { label: 'Footer', active: includeFooter, toggle: () => setIncludeFooter(!includeFooter) },
            ].map(({ label, active, toggle }) => (
              <button
                key={label}
                type="button"
                onClick={toggle}
                className={`rounded-xl border px-3 py-1.5 transition-colors ${
                  active
                    ? 'border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-300'
                    : 'border-[var(--border)] bg-[var(--background)] text-[var(--muted-foreground)] hover:border-slate-400'
                }`}
              >
                {active ? '✓ ' : '+ '} {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Live Visual Preview */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-3">
            <div className="grid size-10 place-items-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <Layers className="size-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-[var(--foreground)]">Interactive Layout Preview</h2>
              <p className="text-xs text-[var(--muted-foreground)]">
                Responsive visual render of the scaffolded DOM components.
              </p>
            </div>
          </div>
          {/* Device Toggle Buttons */}
          <div className="flex items-center rounded-xl border border-[var(--border)] bg-[var(--background)] p-1 text-xs">
            <button
              type="button"
              onClick={() => setPreviewDevice('desktop')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                previewDevice === 'desktop'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Monitor className="size-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('tablet')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                previewDevice === 'tablet'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Tablet className="size-3.5" />
              <span>Tablet (768px)</span>
            </button>
            <button
              type="button"
              onClick={() => setPreviewDevice('mobile')}
              className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1 font-semibold transition-colors ${
                previewDevice === 'mobile'
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              <Smartphone className="size-3.5" />
              <span>Mobile (375px)</span>
            </button>
          </div>
        </div>

        {/* Scaled Preview Frame */}
        <div className="mt-6 flex justify-center overflow-x-auto rounded-2xl border border-[var(--border)] bg-slate-900/5 p-4 dark:bg-black/20">
          <div
            style={{
              width: previewDevice === 'desktop' ? '100%' : previewDevice === 'tablet' ? '768px' : '375px',
              maxWidth: '100%',
              transition: 'width 0.3s ease',
            }}
            className="rounded-2xl border border-[var(--border)] bg-white text-slate-900 shadow-lg overflow-hidden text-left"
          >
            {/* Mockup Header */}
            {includeNav && (
              <div className="border-b border-slate-100 bg-white px-6 py-4 flex items-center justify-between text-xs">
                <span className="font-extrabold text-sm tracking-tight text-slate-900">BrandLogo</span>
                {previewDevice !== 'mobile' && (
                  <div className="flex gap-4 font-semibold text-slate-500">
                    <span>Features</span>
                    <span>Solutions</span>
                    <span>Pricing</span>
                  </div>
                )}
                <span
                  style={{ backgroundColor: brandColor }}
                  className="rounded-lg px-3 py-1.5 font-bold text-white text-[11px]"
                >
                  Get Started
                </span>
              </div>
            )}

            {/* Mockup Hero */}
            {includeHero && (
              <div className="bg-slate-50 px-6 py-10 sm:py-12 border-b border-slate-100">
                <span
                  style={{ color: brandColor, backgroundColor: `${brandColor}15` }}
                  className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider mb-3"
                >
                  Photoshop Sliced Layout
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-slate-900 leading-tight">
                  High-Fidelity Code from Photoshop Mockups
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xl">
                  {conversionMode === 'email'
                    ? 'Engineered with nested 600px tables and inline CSS for flawless rendering across Outlook and Gmail.'
                    : 'Structured with semantic HTML5 tags and flexible CSS layout properties.'}
                </p>
                <div className="mt-5 flex flex-wrap gap-2.5">
                  <span
                    style={{ backgroundColor: brandColor }}
                    className="rounded-lg px-4 py-2 text-xs font-bold text-white shadow-xs"
                  >
                    Explore Components
                  </span>
                  <span className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-xs font-bold text-slate-700">
                    Asset Matrix
                  </span>
                </div>
              </div>
            )}

            {/* Mockup Features */}
            {includeFeatures && (
              <div className="px-6 py-8">
                <div className="text-center mb-6">
                  <span className="font-bold text-sm text-slate-900">Front-End Standards</span>
                </div>
                <div className={`grid gap-4 ${previewDevice === 'mobile' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="font-bold text-xs text-indigo-600 block mb-1">01 / Semantic</span>
                    <span className="font-bold text-xs text-slate-900 block">Accessible Landmarks</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Full WCAG landmark tags.</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="font-bold text-xs text-indigo-600 block mb-1">02 / Responsive</span>
                    <span className="font-bold text-xs text-slate-900 block">CSS Flexbox / Grid</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">Fluid wrap without hacks.</span>
                  </div>
                  <div className="rounded-xl border border-slate-100 bg-slate-50 p-4">
                    <span className="font-bold text-xs text-indigo-600 block mb-1">03 / Preflight</span>
                    <span className="font-bold text-xs text-slate-900 block">Retina Assets</span>
                    <span className="text-[11px] text-slate-500 mt-1 block">SVG &amp; WebP srcset exports.</span>
                  </div>
                </div>
              </div>
            )}

            {/* Mockup Footer */}
            {includeFooter && (
              <div className="bg-slate-900 px-6 py-4 text-[11px] text-slate-400 flex items-center justify-between">
                <span>&copy; 2026 BrandLogo. PSD to HTML.</span>
                <div className="flex gap-3">
                  <span>Privacy</span>
                  <span>Brief</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Production Code Generation & Shareable Handoff Brief */}
      <section className="rounded-3xl border border-[var(--border)] bg-[var(--card)] p-6 shadow-sm sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border)] pb-4">
          <div className="flex items-center gap-2">
            <FileText className="size-5 text-indigo-600 dark:text-indigo-400" />
            <h2 className="text-xl font-bold text-[var(--foreground)]">Generated Code &amp; Developer Handoff</h2>
          </div>
          {/* Tab Selector */}
          <div className="flex flex-wrap items-center gap-1.5 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveCodeTab('html')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeCodeTab === 'html'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              HTML Output
            </button>
            {conversionMode !== 'email' && (
              <button
                type="button"
                onClick={() => setActiveCodeTab('css')}
                className={`rounded-lg px-3 py-1.5 transition-colors ${
                  activeCodeTab === 'css'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
                }`}
              >
                styles.css
              </button>
            )}
            <button
              type="button"
              onClick={() => setActiveCodeTab('checklist')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeCodeTab === 'checklist'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Asset Export Matrix
            </button>
            <button
              type="button"
              onClick={() => setActiveCodeTab('brief')}
              className={`rounded-lg px-3 py-1.5 transition-colors ${
                activeCodeTab === 'brief'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-[var(--background)] text-[var(--muted-foreground)] hover:text-[var(--foreground)]'
              }`}
            >
              Shareable Developer Brief (.md)
            </button>
          </div>
        </div>

        {/* Code Content Display */}
        <div className="mt-5">
          {activeCodeTab === 'html' && (
            <div>
              <div className="flex items-center justify-between pb-2 text-xs font-medium text-[var(--muted-foreground)]">
                <span>{conversionMode === 'email' ? 'email-template.html (Inline Table Architecture)' : 'index.html (Semantic HTML5)'}</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedHtml, 'html')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {copiedTab === 'html' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copiedTab === 'html' ? 'Copied HTML!' : 'Copy HTML'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile(generatedHtml, 'index.html', 'text/html')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--foreground)] hover:text-indigo-600"
                  >
                    <Download className="size-3.5" />
                    <span>Download .html</span>
                  </button>
                </div>
              </div>
              <pre className="max-h-96 overflow-auto rounded-2xl border border-[var(--border)] bg-slate-950 p-4 text-xs font-mono text-emerald-400">
                <code>{generatedHtml}</code>
              </pre>
            </div>
          )}

          {activeCodeTab === 'css' && conversionMode !== 'email' && (
            <div>
              <div className="flex items-center justify-between pb-2 text-xs font-medium text-[var(--muted-foreground)]">
                <span>styles.css (CSS Flexbox, Grid, &amp; Variables)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(generatedCss, 'css')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {copiedTab === 'css' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copiedTab === 'css' ? 'Copied CSS!' : 'Copy CSS'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile(generatedCss, 'styles.css', 'text/css')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--foreground)] hover:text-indigo-600"
                  >
                    <Download className="size-3.5" />
                    <span>Download .css</span>
                  </button>
                </div>
              </div>
              <pre className="max-h-96 overflow-auto rounded-2xl border border-[var(--border)] bg-slate-950 p-4 text-xs font-mono text-sky-300">
                <code>{generatedCss}</code>
              </pre>
            </div>
          )}

          {activeCodeTab === 'checklist' && (
            <div className="space-y-4 text-xs">
              <div className="rounded-2xl border border-[var(--border)] bg-[var(--background)] p-5">
                <h3 className="font-bold text-sm text-[var(--foreground)] mb-3">Asset Slicing &amp; Export Rules</h3>
                <div className="divide-y divide-[var(--border)]">
                  <div className="py-2.5 flex items-start gap-3">
                    <span className="font-bold text-indigo-600 shrink-0">SVG Vectors:</span>
                    <span className="text-[var(--muted-foreground)]">
                      Export all icons, badges, logos, and UI glyphs as pure SVG code. Do not rasterize to PNG. Use our <Link href="/tools/svg-dimensions-checker" className="text-indigo-600 underline">SVG Dimensions Checker</Link> to audit viewBox scaling.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-start gap-3">
                    <span className="font-bold text-indigo-600 shrink-0">Retina Images:</span>
                    <span className="text-[var(--muted-foreground)]">
                      For hero photographs and raster art, export 1x (standard) and 2x (Retina) WebP files with JPG fallbacks using the HTML5 &lt;picture&gt; element.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-start gap-3">
                    <span className="font-bold text-indigo-600 shrink-0">Color Preflight:</span>
                    <span className="text-[var(--muted-foreground)]">
                      Ensure every image asset is tagged with sRGB profile. If artwork was created for print CMYK, use our <Link href="/tools/rgb-cmyk-image-checker" className="text-indigo-600 underline">RGB CMYK Image Checker</Link> to ensure no muted print gamut artifacts slip into production.
                    </span>
                  </div>
                  <div className="py-2.5 flex items-start gap-3">
                    <span className="font-bold text-indigo-600 shrink-0">Layout Math:</span>
                    <span className="text-[var(--muted-foreground)]">
                      Map multi-column containers to CSS Flexbox with gap spacing. Test parent and child alignment with our <Link href="/tools/css-flexbox-generator" className="text-indigo-600 underline">CSS Flexbox Generator</Link>.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCodeTab === 'brief' && (
            <div>
              <div className="flex items-center justify-between pb-2 text-xs font-medium text-[var(--muted-foreground)]">
                <span>Developer Handoff Brief (Ready for Jira, GitHub, or Client Handoff)</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(developerBriefMarkdown, 'brief')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:underline dark:text-indigo-400"
                  >
                    {copiedTab === 'brief' ? <Check className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
                    <span>{copiedTab === 'brief' ? 'Copied Brief!' : 'Copy Brief (.md)'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => downloadFile(developerBriefMarkdown, 'PSD_CONVERSION_BRIEF.md', 'text/markdown')}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--foreground)] hover:text-indigo-600"
                  >
                    <Download className="size-3.5" />
                    <span>Download Brief (.md)</span>
                  </button>
                </div>
              </div>
              <pre className="max-h-96 overflow-auto rounded-2xl border border-[var(--border)] bg-slate-950 p-4 text-xs font-mono text-amber-200">
                <code>{developerBriefMarkdown}</code>
              </pre>
            </div>
          )}
        </div>
      </section>

      {/* 5. Honest Capability & Workflow Guardrails */}
      <section className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-6 text-xs text-[var(--muted-foreground)]">
        <div className="flex items-start gap-3">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
          <div className="space-y-2">
            <h3 className="font-bold text-sm text-[var(--foreground)]">
              Technical Honesty: Why 1-Click "Magical" PSD to HTML Converters Don’t Exist
            </h3>
            <p className="leading-relaxed">
              Photoshop is a 2D raster and vector canvas composed of graphical layers; it contains no concept of semantic DOM structure, accessibility landmarks (&lt;nav&gt;, &lt;main&gt;, &lt;button&gt;), or responsive fluid wrapping. Any automated tool that claims to instantly transform an arbitrary PSD into production code produces bloated, absolute-positioned markup with broken mobile responsiveness and inaccessible flattened text.
            </p>
            <p className="leading-relaxed">
              Navorika provides a genuine developer-assisted workflow: we inspect your binary PSD headers locally, verify color space and grid math, scaffold clean semantic HTML5 and Flexbox CSS, and generate an actionable handoff brief for your front-end team.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
