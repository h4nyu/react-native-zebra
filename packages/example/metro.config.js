/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * @format
 */
const path = require('path');


function getConfig(appDir, options = {}) {
  return {
    watchFolders: [
      path.resolve(appDir, '../barcode'),
    ],
    transformer: {
      getTransformOptions: async () => ({
        transform: {
          experimentalImportSupport: false,
          inlineRequires: false,
        },
      }),
    },
  };
}
module.exports = getConfig(__dirname);
