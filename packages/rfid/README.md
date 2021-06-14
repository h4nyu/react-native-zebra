
# @oniku/react-native-zebra-barcode

## Getting started

`$ npm install @oniku/react-native-zebra-barcode --save`

#### Android
1. Check minSdkVersion in `android/build.gradle`:
  	```
    buildscript {
        ...
        ext {
            ...
            minSdkVersion = 19
        }
    }

  	```

1. Insert the following lines inside the dependencies block in `android/build.gradle`:
  	```gradle
    allprojects {
        repositories {
            ...
            flatDir { dirs "$rootDir/../node_modules/@oniku/react-native-zebra-barcode/android/libs" }
        }
    }
  	```

## Usage

see [example](./packages/example/App.tsx).
