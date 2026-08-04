import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Lock Turbopack root strictly to this project directory (prevents watching entire home folder ~/)
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Cap CPU thread allocation to 2 cores to prevent Mac overheating & system freeze
  experimental: {
    cpus: 2,
  },
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
};

export default nextConfig;
