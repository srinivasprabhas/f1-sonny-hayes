import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
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
  // The profile moved when the site's driver changed.
  async redirects() {
    return [
      { source: "/kimi-antonelli", destination: "/sonny-hayes", permanent: true },
      // The store was removed; its old links land in the garage.
      { source: "/store", destination: "/garage", permanent: false },
    ];
  },
};

export default nextConfig;
