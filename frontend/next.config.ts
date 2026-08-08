import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        // Use backend service name from docker-compose. Defaults to localhost for local dev.
        destination: process.env.BACKEND_URL ? `${process.env.BACKEND_URL}/api/v1/:path*` : 'http://127.0.0.1:8000/api/v1/:path*',
      },
    ];
  },
};

export default nextConfig;
