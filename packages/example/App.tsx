/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * Generated with the TypeScript template
 * https://github.com/react-native-community/react-native-template-typescript
 *
 * @format
 */

import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Button,
  View,
} from 'react-native';
import * as Zebra from "@oniku/react-native-zebra-barcode";


const App = () => {
  const getAvailableDevices = async () => {
    const devices = await Zebra.getAvailableDevices();
    // console.log(devices)
  };
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <View>
          <Button title="getAvailableDevices" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default App;
