/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint entirely
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.ignoreWarnings = [/Failed to parse source map/];
    }
    return config;
  },
};

module.exports = nextConfig;
