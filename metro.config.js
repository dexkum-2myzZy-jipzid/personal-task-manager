// Disables Watchman to avoid macOS permission/TCC issues ("Operation not permitted")
// while keeping Expo's default Metro configuration.
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

config.resolver = {
  ...(config.resolver ?? {}),
  useWatchman: false,
};

module.exports = config;
