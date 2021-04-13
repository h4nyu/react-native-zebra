const path = require('path');
module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          "@oniku/react-native-zebra-barcode":  path.join(__dirname, '../barcode'),
        },
      },
    ],
  ],
};
