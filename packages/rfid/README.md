
# @oniku/react-native-zebra-rfid

## Getting started

`$ npm install @oniku/react-native-zebra-rfid --save`

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
            flatDir { dirs "$rootDir/../node_modules/@oniku/react-native-zebra-rfid/android/libs" }
        }
    }
  	```

## Usage

see [example](../example/pages/RfidPage.tsx).
