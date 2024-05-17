const nextConfig = {
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.node$/,
      loader: "node-loader",
    });
    if (isServer) {
      config.ignoreWarnings = [{ module: /opentelemetry/ }];
    }
    return config;
  },
};
module.exports = nextConfig;
