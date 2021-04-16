const path = require('path');
const barcodePak = require('../barcode/package.json');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  // plugins: [
  //   [
  //     'module-resolver',
  //     {
  //       extensions: ['.tsx', '.ts', '.js', '.json'],
  //       alias: {
  //         [barcodePak.name]: path.resolve(__dirname, "../barcode"),
  //       },
  //     },
  //   ],
  // ],
};
