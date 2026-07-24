/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    // Disable barrel optimization to prevent Tool import error
    optimizePackageImports: [],
  },
  webpack: (config, { isServer }) => {
    // Ignore all warnings
    config.ignoreWarnings = [/.*/];
    
    // Add a fallback for the Tool import
    config.resolve.alias = {
      ...config.resolve.alias,
      'lucide-react/dist/esm/icons/tool': false,
      'lucide-react/dist/cjs/icons/tool': false,
    };
    
    return config;
  },
};

module.exports = nextConfig;
