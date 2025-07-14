const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const path = require("path");

const projectRoot = __dirname;
const config = getDefaultConfig(projectRoot);

// Find the project and workspace directories

const workspaceRoot = path.resolve(projectRoot, "../");

// Watch all files in the monorepo
config.watchFolders = [workspaceRoot];

// Let Metro know where to resolve packages and in what order
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

// Force Metro to resolve dependencies from the `node_modules` in the root of the monorepo
config.resolver.disableHierarchicalLookup = true;

module.exports = withNativeWind(config, { input: "./app/global.css" });
