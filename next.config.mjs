import withBundleAnalyzer from "@next/bundle-analyzer";

/** @type {import('next').NextConfig} */

// Konfigurasi Bundle Analyzer
const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const nextConfig = {
  compress: true,
  reactStrictMode: true,

  experimental: {
    // Optimasi tree-shaking untuk lucide-react agar bundle tetap ringan
    optimizePackageImports: ["lucide-react"],
  },

  images: {
    qualities: [75, 80],
    formats: ["image/webp"],
    deviceSizes: [640, 1080, 1920],
    imageSizes: [64, 128, 256, 384],
    minimumCacheTTL: 31536000, // Cache optimized images for 365 days on Vercel CDN edge
    // WHITELIST HOSTNAME SUPABASE (PENTING untuk dashboard admin)
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wupumpxeckhqegpbvwia.supabase.co",
        port: "",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },

  // Security & Cache Headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-DNS-Prefetch-Control", value: "on" },
          { key: "X-XSS-Protection", value: "1; mode=block" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
        ],
      },
    ];
  },

  // Konfigurasi Webpack untuk SVGR (Import SVG sebagai React Components)
  webpack(config) {
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.(".svg"),
    );

    config.module.rules.push(
      {
        ...fileLoaderRule,
        test: /\.svg$/i,
        resourceQuery: /url/, // *.svg?url
      },
      {
        test: /\.svg$/i,
        issuer: fileLoaderRule.issuer,
        resourceQuery: {
          not: [...(fileLoaderRule.resourceQuery?.not || []), /url/],
        },
        use: ["@svgr/webpack"],
      },
    );

    fileLoaderRule.exclude = /\.svg$/i;

    return config;
  },
};

export default bundleAnalyzer(nextConfig);
