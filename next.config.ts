import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['static.nike.com','media.timeout.com'], // 👈 add the domain here
  },
  /* config options here */
};

export default nextConfig;
