import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Lock Turbopack file-watching strictly to this project root directory
  turbopack: {
    root: path.resolve(__dirname),
  },
  // Allow local network origins (IP addresses) for Hot Module Replacement (HMR)
  allowedDevOrigins: ['localhost:3000', '127.0.0.1:3000', '172.23.190.16', '*.local'],
  // Prevent Next.js from bundling heavy server-only libraries into compilation bundles
  serverExternalPackages: ['mongoose', 'bcryptjs', 'nodemailer', 'razorpay'],
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
