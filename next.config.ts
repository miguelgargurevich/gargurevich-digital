import type { NextConfig } from "next";
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-bda40c407bfa46509c3a0aa7e7223a73.r2.dev',
      },
    ],
  },
};

export default withNextIntl(nextConfig);
