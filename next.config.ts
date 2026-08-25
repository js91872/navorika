import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;
