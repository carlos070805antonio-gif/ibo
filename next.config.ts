
/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["res.cloudinary.com"], // para Cloudinary padr o
  },
  compiler: {
    baseUrl: "src",
    paths: {
      "@/*": ["*"]
    }
  }
};
module.exports = nextConfig;

