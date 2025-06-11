import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Ignore native modules that can't be bundled
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "zlib-sync": false,
        "utf-8-validate": false,
        bufferutil: false,
      };
    }

    // Ignore specific modules that cause issues
    config.externals = config.externals || [];
    if (Array.isArray(config.externals)) {
      config.externals.push({
        "zlib-sync": "commonjs zlib-sync",
        "utf-8-validate": "commonjs utf-8-validate",
        bufferutil: "commonjs bufferutil",
      });
    }

    // Gestisci il warning di dipendenza critica per @supabase/realtime-js
    config.ignoreWarnings = [
      ...(config.ignoreWarnings || []),
      {
        module:
          /node_modules\/@supabase\/realtime-js\/dist\/main\/RealtimeClient\.js/,
        message:
          /Critical dependency: the request of a dependency is an expression/,
      },
    ];

    return config;
  },
};

export default nextConfig;
