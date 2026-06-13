/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  experimental: {
    missingSuspenseWithCSRBypass: true,
  },
 webpack: (config) => {
  config.module.rules.push({
    test: /\.md$/,
    type: 'asset/source',
  });
  return config;
  },
};

export default nextConfig;