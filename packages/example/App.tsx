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
  const [ devices, setDevices ] = React.useState<Zebra.Device[]>([])
  const [ deviceName, setDeviceName ] = React.useState("")
  const [ barcode, setBarcode ] = React.useState<Zebra.Barcode | undefined>(undefined)
  const getAvailableDevices = async () => {
    try{
      const devices = await Zebra.getAvailableDevices()
      setDevices(devices)
    }catch(e){
      console.warn(e)
    }
  };

  const connect = async (name:string) => {
    try{
      const connected = await Zebra.connect(name)
      setDeviceName(connected)
    }catch(e){
      console.warn(e)
    }
  };
  const disconnect = async () => {
    try{
      await Zebra.disconnect(deviceName)
      setDeviceName("")
    }catch(e){
      console.warn(e)
    }
  };

  const aimOn = async () => {
    try{
      await Zebra.aimOn()
    }catch(e){
      console.warn(e)
    }
  };

  const aimOff = async () => {
    try{
      await Zebra.aimOff()
    }catch(e){
      console.warn(e)
    }
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
        {
          devices.map(d => (
            <TouchableOpacity
              style={styles.button}
              onPress={() => connect(d.name)}
              key={d.address}
            >
              <Text> {d.name} [{d.address}]</Text>
            </TouchableOpacity>
          ))
        }
        <Text> device: {deviceName}</Text>
        <Text> barcode type: {barcode?.type}</Text>
        <Text> barcode data: {barcode?.data}</Text>
        {
          deviceName !== "" && <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => disconnect()}
            >
              <Text> Disconnect </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => aimOn()}
            >
              <Text> Aim on </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => aimOff()}
            >
              <Text> Aim off </Text>
            </TouchableOpacity>
            <Zebra.Receiver onBarcodeRead={b => setBarcode(b)} />

          </View>
        }
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
