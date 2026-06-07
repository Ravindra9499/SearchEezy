import type { NextConfig } from "next";

const nextConfig: NextConfig = {

  images: {

    remotePatterns: [

      {
        protocol: "https",

        hostname:
          "*.supabase.co",
      },

      {
        protocol: "https",

        hostname:
          "images.unsplash.com",
      },
    ],

    formats: [
      "image/avif",
      "image/webp",
    ],
  },

  experimental: {
    optimizePackageImports: [
      "@supabase/supabase-js",
    ],
  },
};

export default nextConfig;