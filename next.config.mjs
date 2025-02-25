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
          
          unoptimized: true, // Disables optimization, allows all external URLs
           
      },
};

export default nextConfig;
