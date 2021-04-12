yarn tsc \
&& yarn react-native bundle --platform android --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res/ $@ \
&& yarn jetify \
&& cd android \
&& gradle clean \
&& gradle assembleDebug

