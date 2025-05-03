import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // Ensure TypeScript errors are caught during build
    // ignoreBuildErrors: true, // Removed
  },
  eslint: {
    // Ensure ESLint errors are caught during build
    // ignoreDuringBuilds: true, // Removed
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
    ],
  },
   serverActions: {
    // Explicitly enable server actions for deployment robustness
    enabled: true,
  },
};

export default nextConfig;
