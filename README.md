
# react-native-zebra-barcode

## Getting started

`$ npm install react-native-zebra-barcode --save`

### Mostly automatic installation

`$ react-native link react-native-zebra-barcode`

### Manual installation

#### Android

1. Open up `android/app/src/main/java/[...]/MainActivity.java`
  - Add `import com.reactlibrary.RNZebraBarcodePackage;` to the imports at the top of the file
  - Add `new RNZebrabarcodePackage()` to the list returned by the `getPackages()` method
2. Append the following lines to `android/settings.gradle`:
  	```
  	include ':react-native-zebra-barcode'
  	project(':react-native-zebra-barcode').projectDir = new File(rootProject.projectDir, 	'../node_modules/react-native-zebra-barcode/android')
  	```
3. Insert the following lines inside the dependencies block in `android/app/build.gradle`:
  	```
      compile project(':react-native-zebra-barcode')
  	```

## Usage
```javascript
import RNZebrabarcode from 'react-native-zebra-barcode';

// TODO: What to do with the module?
RNZebrabarcode;
```
  
