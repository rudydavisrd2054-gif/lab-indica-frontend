import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const apiUrl = (
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://lab-indica-api.vercel.app"
    ).trim().replace(/\/+$/, "");

    return [{ source: "/api/pruebas/:path*", destination: `${apiUrl}/api/pruebas/:path*` }];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
