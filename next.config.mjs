/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
  images: { unoptimized: true },
  experimental: { missingSuspenseWithCSRBypass: true },
  webpack: (config) => {
    config.externals = [...(config.externals || []),
      { '@prisma/adapter-libsql': 'commonjs @prisma/adapter-libsql' },
      { 'better-sqlite3': 'commonjs better-sqlite3' },
    ];
    return config;
  },
};

export default nextConfig;
