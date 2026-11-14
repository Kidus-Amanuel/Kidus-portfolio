/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['three'],
  experimental: {
    serverComponentsExternalPackages: ['@react-pdf/renderer'],
  },
};

export default nextConfig;
