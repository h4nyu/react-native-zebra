const path = require('path');

module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        extensions: ['.tsx', '.ts', '.js', '.json'],
        alias: {
          "react": path.resolve(__dirname, "node_modules/react"),
          "react-native": path.resolve(__dirname, "node_modules/react-native"),
        },
      },
    ],
  ],
};
