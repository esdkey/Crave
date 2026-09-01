import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow product image uploads (multiple files, up to 5MB each) via
  // Server Actions. Default is 1MB.
  experimental: {
    serverActions: {
      bodySizeLimit: "30mb",
    },
  },
};

export default nextConfig;
