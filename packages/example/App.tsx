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
import Zebra from "@oniku/react-native-zebra-barcode";

const App = () => {
  const getAvailableDevices = async () => {
    console.log(Zebra)
  };
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <View>
          <Button title="getAvailableDevices" onPress={getAvailableDevices}/>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};


export default App;
