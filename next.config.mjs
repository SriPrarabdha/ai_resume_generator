/** @type {import('next').NextConfig} */
const nextConfig = {
    env: {
     BLOB_READ_WRITE_TOKEN: process.env.BLOB_READ_WRITE_TOKEN,
    },
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'my-blob-store.public.blob.vercel-storage.com',
          port: '',
        },
      ],
    },
  };
   
  module.exports = nextConfig;