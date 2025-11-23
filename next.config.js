/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {          
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'rbhasm95o4ksbp7h.public.blob.vercel-storage.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: '*.public.blob.vercel-storage.com',
                pathname: '/**',
            },
        ],
    },

    
    logging: {
        fetches: {
            fullUrl: true,
        },
    },
    eslint: {
    ignoreDuringBuilds: true,
  },
   typescript: {
    ignoreBuildErrors: true,
  },
   experimental: {
    missingSuspenseWithCSRBailout: false,
  },
}

module.exports = nextConfig