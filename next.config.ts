import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },

  staticPageGenerationTimeout: 120,

  async redirects() {
    return [
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
    ];
  },
};

export default nextConfig;