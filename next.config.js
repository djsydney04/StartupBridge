/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable image optimization
  images: {
    unoptimized: true,
  },
  // Just to be safe, explicitly set the Pages Router
  useFileSystemPublicRoutes: true,
  // Disable React strict mode to avoid double renders
  reactStrictMode: false,
  // Skip TypeScript type checking during build for faster builds
  typescript: {
    ignoreBuildErrors: true,
  },
  // Skip ESLint checking during build for faster builds
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Explicitly disable the App Router
  experimental: {
    appDir: false,
  },
};

module.exports = nextConfig; 