const path = require('path');
const barcodePak = require('../barcode/package.json');
const getWorkspaces = require('get-yarn-workspaces');
const exclusionList = require('metro-config/src/defaults/exclusionList');
const modules = Object.keys({
  ...barcodePak.peerDependencies,
});


const workspaces = getWorkspaces(__dirname);

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
