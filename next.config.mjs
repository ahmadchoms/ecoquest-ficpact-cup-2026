/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable React Compiler for automatic optimization
  reactCompiler: true,
  output: "standalone",

  // Image optimization settings
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },

  // Turbopack configuration (Next.js 16 default)
  turbopack: {},

  // Optimize headers for performance
  headers: async () => {
    return [
      {
        source: "/:path*",
        headers: [
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
        ],
      },
    ];
  },

  // Redirects for backward compatibility
  redirects: async () => {
    return [];
  },

  // Rewrite for API routes if needed
  rewrites: async () => {
    return {
      beforeFiles: [],
    };
  },
};

export default nextConfig;
