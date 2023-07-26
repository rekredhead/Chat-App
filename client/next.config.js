/** @type {import('next').NextConfig} */
const nextConfig = {
   experimental: {
      serverActions: true,
   },
   env: {
      SERVER_DOMAIN: 'http://localhost:8080'
   },
   images: {
      remotePatterns: [
         {
            protocol: 'http',
            hostname: "localhost",
            port: '8080'
         }
      ]
   }
}

module.exports = nextConfig
