import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // ─── Standalone Output for Docker Containerization ────────
  output: "standalone",

  // ─── React ────────────────────────────────────────────────
  reactStrictMode: true,

  // ─── Typed Routes (Next.js 16 top-level) ──────────────────
  typedRoutes: true,

  // ─── Transpilation ────────────────────────────────────────
  transpilePackages: [
    "@grumeup/ui",
    "@grumeup/database",
    "@grumeup/cache",
    "@grumeup/types",
    "@grumeup/utils",
  ],

  // ─── Images ───────────────────────────────────────────────
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // ─── Security Headers ────────────────────────────────────
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        {
          key: "X-DNS-Prefetch-Control",
          value: "on",
        },
        {
          key: "X-Content-Type-Options",
          value: "nosniff",
        },
        {
          key: "Referrer-Policy",
          value: "strict-origin-when-cross-origin",
        },
      ],
    },
  ],

  // ─── Turbopack Configuration ──────────────────────────────
  turbopack: {},

  // ─── Webpack (for fallback builds) ────────────────────────
  webpack: (config) => {
    config.module?.rules?.push({
      test: /\.(glsl|vs|fs|vert|frag)$/,
      type: "asset/source",
    });

    return config;
  },
};

export default nextConfig;
