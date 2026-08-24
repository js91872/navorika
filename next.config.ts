import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  staticPageGenerationTimeout: 120,
  async redirects() {
    return [
      { source: '/tools/savings-retirement-hub/fd-calculator', destination: '/tools/fd-calculator', permanent: true },
      { source: '/tools/savings-retirement-hub/ppf-calculator', destination: '/tools/ppf-calculator', permanent: true },
      { source: '/tools/taxation-compliance-deck/gst-calculator', destination: '/tools/gst-calculator', permanent: true },
    ];
  },
};

export default nextConfig;
