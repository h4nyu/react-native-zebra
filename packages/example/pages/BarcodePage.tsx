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
import * as Barcode from "@oniku/react-native-zebra-barcode";
import * as Rfid from "@oniku/react-native-zebra-rfid";

const BarcodePage = () => {
  const [ devices, setDevices ] = React.useState<Barcode.Device[]>([])
  const [ deviceName, setDeviceName ] = React.useState("")
  const [ barcode, setBarcode ] = React.useState<Barcode.Barcode | undefined>(undefined)
  const getAvailableDevices = async () => {
    try{
      const devices = await Barcode.getAvailableDevices()
      setDevices(devices)
    }catch(e){
      console.warn(e)
    }
  };

  const connect = async (name:string) => {
    try{
      const connected = await Barcode.connect(name)
      await Rfid.connect(name)
      setDeviceName(connected)
    }catch(e){
      console.warn(e)
    }
  };
  const disconnect = async () => {
    try{
      await Barcode.disconnect(deviceName)
      await Rfid.disconnect(deviceName)
      setDeviceName("")
    }catch(e){
      console.warn(e)
    }
  };

  const aimOn = async () => {
    try{
      await Barcode.aimOn()
    }catch(e){
      console.warn(e)
    }
  };

  const aimOff = async () => {
    try{
      await Barcode.aimOff()
    }catch(e){
      console.warn(e)
    }
  };

  return (
    <SafeAreaView>
      <ScrollView
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
            <Barcode.Receiver onBarcodeRead={b => setBarcode(b)} />

          </View>
        }
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 5,
    margin: 5,
  },
});

export default BarcodePage;
