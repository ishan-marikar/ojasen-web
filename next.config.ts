import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3001',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3001',
        pathname: '/**',
      },
      // Add Vercel deployment domains
      {
        protocol: 'https',
        hostname: '*.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ojasen-web.vercel.app',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ojasenhealingarts.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;