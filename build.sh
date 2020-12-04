rm -rf example/android/app/build \
&& npx react-native bundle --platform android --entry-file example/index.js --bundle-output example/android/app/src/main/assets/index.android.bundle --assets-dest example/android/app/src/main/res/ \
&& npx jetify \
&& cd example/android \
&& gradle assembleDebug
