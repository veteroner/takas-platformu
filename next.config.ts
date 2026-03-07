import type { NextConfig } from "next";
// Sentry integration
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig: NextConfig = {
  // output: 'export', // API routes olduğu için export kullanılamaz
  outputFileTracingExcludes: {
    '*': [
      'android/app/google-services.json',
      'android/**'
    ]
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'rraatgwihvrxopjahpoh.supabase.co',
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default withSentryConfig(nextConfig, {
  // Sentry build-time options (minimal, safe defaults)
  silent: true,
});
