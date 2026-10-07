import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      {
        source: '/categories/retirement-calculators',
        destination: '/categories/finance-calculators',
        permanent: true,
      },
      {
        source: '/hubs',
        destination: '/toolkits',
        permanent: true,
      },
      {
        source: '/tools/base64-encode',
        destination: '/tools/base64-encoder',
        permanent: true,
      },
      {
        source: '/tools/base64-decode',
        destination: '/tools/base64-encoder',
        permanent: true,
      },
      {
        source: '/tools/concrete-slab-calculator',
        destination: '/tools/concrete-calculator',
        permanent: true,
      },
      {
        source: '/tools/image-resizer',
        destination: '/tools/resize-image',
        permanent: true,
      },
      {
        source: '/tools/meta-tag-analyzer',
        destination: '/categories/developer-tools#developer-web',
        permanent: true,
      },
      {
        source: '/tools/png-to-pdf-converter',
        destination: '/tools/image-to-pdf',
        permanent: true,
      },
      {
        source: '/tools/png-to-webp-converter',
        destination: '/tools/convert-png-to-webp',
        permanent: true,
      },
      {
        source: '/tools/robots-txt-validator',
        destination: '/tools/robots-txt-generator',
        permanent: true,
      },
      {
        source: '/tools/developer-utilities',
        destination: '/categories/developer-tools',
        permanent: true,
      },
      {
        source: '/tools/developer-utils',
        destination: '/categories/developer-tools',
        permanent: true,
      },
      {
        source: '/tools/webmaster-seo-builder',
        destination: '/categories/developer-tools',
        permanent: true,
      },
      {
        source: '/tools/qr-code-studio',
        destination: '/tools/qr-code-generator',
        permanent: true,
      },
      {
        source: '/tools/color-extraction-studio',
        destination: '/tools/image-color-picker',
        permanent: true,
      },

      {
        source: '/tools/universal-json-studio',
        destination: '/tools/json-formatter',
        permanent: true,
      },
      {
        source: '/tools/jwt-base64-deck',
        destination: '/tools/jwt-decoder',
        permanent: true,
      },
      {
        source: '/tools/savings-retirement-hub/fd-calculator',
        destination: '/tools/fd-calculator',
        permanent: true,
      },
      {
        source: '/tools/savings-retirement-hub/ppf-calculator',
        destination: '/tools/ppf-calculator',
        permanent: true,
      },
      {
        source: '/tools/taxation-compliance-deck/gst-calculator',
        destination: '/tools/gst-calculator',
        permanent: true,
      },
      {
        source: '/tools/target-heart-rate-calculator',
        destination: '/tools/heart-rate-calculator',
        permanent: true,
      },
      {
        source: '/guides/psd-to-html-guide',
        destination: '/guides/psd-to-html-conversion-guide',
        permanent: true,
      },
      {
        source: '/guides/psd-to-html-email-guide',
        destination: '/guides/psd-to-html-email',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
