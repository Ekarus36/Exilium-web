import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow remote access during development
  allowedDevOrigins: ["http://65.109.50.122:3000"],
};

export default nextConfig;
