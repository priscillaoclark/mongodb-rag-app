
/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
      serverComponentsExternalPackages: ["pdf-parse"],
    },
    serverRuntimeConfig: {
      bodyParser: {
        sizeLimit: '75mb',
      },
      responseLimit: '75mb',
    }
};

export default nextConfig;
