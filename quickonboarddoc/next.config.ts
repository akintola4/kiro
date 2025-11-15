import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  webpack: (config, { isServer }) => {
    if (isServer) {
      config.externals.push("bcrypt");
    }
    
    // Handle canvas for pdfjs-dist
    config.resolve.alias.canvas = false;
    
    return config;
  },
};

export default nextConfig;
