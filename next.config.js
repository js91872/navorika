/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
    dirs: [], // Don't run ESLint on any directories
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Disable ESLint during build completely
  webpack: (config, { isServer, webpack }) => {
    // Ignore ESLint warnings
    config.ignoreWarnings = [
      { message: /Failed to parse source map/ },
      { message: /Critical dependency/ },
    ];
    
    // Add a plugin to suppress ESLint warnings
    config.plugins.push(
      new webpack.NormalModuleReplacementPlugin(/^eslint$/, (resource) => {
        resource.request = 'noop';
      })
    );
    
    return config;
  },
};

module.exports = nextConfig;
