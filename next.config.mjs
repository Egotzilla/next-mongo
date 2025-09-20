/** @type {import('next').NextConfig} */
const nextConfig = {
  // basePath: '/stock', // Uncomment and set your base path for VM deployment
  experimental: {
    instrumentationHook: true,
  },
};

export default nextConfig;
