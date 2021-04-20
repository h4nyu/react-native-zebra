const path = require('path');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [
    path.resolve(__dirname, '../../'),
    path.resolve(__dirname),
  ],
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
