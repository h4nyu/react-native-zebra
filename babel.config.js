module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      "module-resolver",
      {
        alias: {
          "@h4nyu/react-native-zebra-barcode": "../src",
        },
        cwd: "babelrc"
      }
    ]
  ]
};
