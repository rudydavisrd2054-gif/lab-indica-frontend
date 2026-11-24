import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    let apiUrl = (
      process.env.API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      "https://lab-indica-api.vercel.app"
    ).trim().replace(/\/+$/, "");

    // Una URL local funciona en desarrollo, pero Vercel no puede acceder a ella.
    const hostname = new URL(apiUrl).hostname;
    const esRedLocal = /^(localhost|127\..*|0\.0\.0\.0|\[::1\]|10\..*|192\.168\..*|172\.(1[6-9]|2\d|3[01])\..*)$/i.test(hostname);
    if (process.env.VERCEL && esRedLocal) {
      console.warn("API_URL apunta a una red local. Se utilizará la API pública en Vercel.");
      apiUrl = "https://lab-indica-api.vercel.app";
    }

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
