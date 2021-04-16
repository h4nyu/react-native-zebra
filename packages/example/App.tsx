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
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import * as Zebra from "@oniku/react-native-zebra-barcode";

const App = () => {
  const getAvailableDevices = async () => {
    console.log(Zebra)
  };
  return (
    <SafeAreaView>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => getAvailableDevices()}
        >
          <Text> Get available devices </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    margin: 5,
  },
});


export default App;
