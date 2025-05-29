/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000', // usa el puerto del backend donde sirves las imágenes
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'faultapi.onrender.com',
        pathname: '/uploads/**',
      }
    ],
  },
};

module.exports = nextConfig;
