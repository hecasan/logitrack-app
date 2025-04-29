const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Resolver aliases
config.resolver.extraNodeModules = {
  '@components': path.resolve(__dirname, 'src/components'),
  '@screens': path.resolve(__dirname, 'src/screens'),
  '@services': path.resolve(__dirname, 'src/services'),
  '@utils': path.resolve(__dirname, 'src/utils'),
  '@context': path.resolve(__dirname, 'src/context'),
  '@assets': path.resolve(__dirname, 'src/assets'),
  '@constants': path.resolve(__dirname, 'src/constants'),
  '@navigation': path.resolve(__dirname, 'src/navigation'),
};

module.exports = config;
