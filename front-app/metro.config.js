const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const config = getDefaultConfig(__dirname);

config.resolver = {
  ...config.resolver,
  sourceExts: [...config.resolver.sourceExts, "ts", "tsx", "js", "jsx"],
  extraNodeModules: {
    "@": path.resolve(__dirname, "src"),
  },
};

module.exports = withNativeWind(config, { input: "./src/styles/global.css" });
