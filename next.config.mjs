/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
            {
              protocol: 'https',
              hostname: 'static.cosmo.fans',
              pathname: '/**',
            },
          ],
      },
};

export default nextConfig;
