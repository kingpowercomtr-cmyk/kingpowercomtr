/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // output: 'standalone',   ← YOK ARTIK
  images: {
    unoptimized: true,
  },
  experimental: {
    missingSuspenseWithCSRBypass: true,
  }
};

export default nextConfig;