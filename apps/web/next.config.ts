import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@house-builder/schema",
    "@house-builder/enrich",
    "@house-builder/device-bridge",
  ],
};

export default nextConfig;
