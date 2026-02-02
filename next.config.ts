import type { NextConfig } from 'next';
import withPWAInit from '@ducanh2912/next-pwa';

const { version } = require('./package.json');
const basePath = '/pass-genius';

const withPWA = withPWAInit({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: false, // We handle registration in sw-register.tsx to show an update prompt.
});

const nextConfig: NextConfig = {
  output: 'export',
  // basePath,
  // assetPrefix: `${basePath}/`,
  trailingSlash: false,
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_VERSION: version,
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default withPWA(nextConfig);
