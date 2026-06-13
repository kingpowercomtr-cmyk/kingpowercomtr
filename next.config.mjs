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
  config.externals = [...(config.externals || []), 
    { '@libsql/client': 'commonjs @libsql/client' }
  ];
  return config;
  },
};

export default nextConfig;