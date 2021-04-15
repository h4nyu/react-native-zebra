const path = require('path');
const escape = require('escape-string-regexp');
const barcodePak = require('../barcode/package.json');


module.exports = {
  watchFolders: [
    path.resolve(__dirname, "../barcode")
  ],
  resolver: {
    extraNodeModules: {
      [barcodePak.name]: path.resolve(__dirname, "../barcode")
    }
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
