/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ['randomuser.me'], // Allow external images from randomuser.me
    unoptimized: true, // Required for static export
  },
  async rewrites() {
    // Only apply rewrites in development
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:8009/api/:path*',
        },
      ];
    }
    return [];
  },
  // Environment-specific configuration
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:8000',
  },
  // Enable static export for production
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  trailingSlash: true,
  distDir: 'out',
};

export default nextConfig;