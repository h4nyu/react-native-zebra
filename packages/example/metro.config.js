const path = require('path');
const barcodePak = require('../barcode/package.json');

module.exports = {
  projectRoot: __dirname,
  watchFolders: [
    path.resolve(__dirname, "../../"),
  ],
  resolver: {
    extraNodeModules: {
      [barcodePak.name]: path.resolve(__dirname, "node_nodules", barcodePak.name),
    },
  },
  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};
