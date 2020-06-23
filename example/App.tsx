import React from 'react';
import { View, Text, Button } from "react-native";
import * as Zebra from "@h4nyu/react-native-zebra-barcode";

const HLine = () => <View
  style={{
    borderBottomColor: 'black',
    borderBottomWidth: 1,
    margin: 5,
  }}
/>

type State = {
  devices: Zebra.Device[];
  deviceName: string | null;
  barcode: Zebra.Barcode | null;
}

export default class App extends React.Component<{}, State> {
  state: State = {
    devices: [],
    deviceName: null,
    barcode: null,
  };

  getAvailableDevices = async () => {
    const devices = await Zebra.getAvailableDevices();
    this.setState({
      ...this.state,
      devices,
    });
  };

  connect = async () => {
    const {devices, deviceName} = this.state;
    if (devices.length > 0) {
      const deviceName = await Zebra.connect(devices[0].name);
      this.setState({
        ...this.state,
        deviceName,
      });
    }
  };

  disconnect = async () => {
    const {deviceName} = this.state;
    if (deviceName !== null){
      await Zebra.disconnect(deviceName);
      this.setState({
        ...this.state,
        deviceName:null,
      });
    }
  };

  aimOn = async () => {
    await Zebra.aimOn();
  };
  aimOff = async () => {
    await Zebra.aimOff();
  };

  handleBarcodeRead = (barcode:Zebra.Barcode) => {
      this.setState({
        ...this.state,
        barcode,
      });
  }

  resetBarcode = () => {
      this.setState({
        ...this.state,
        barcode:null,
      });
  }


  render = () => {
    const { devices, deviceName, barcode } = this.state;
     return (
       <View>
         <Button title="getAvailableDevices" onPress={this.getAvailableDevices} />
         {
           devices.map(x =>
             <View key={x.name}>
               <Text>name: {x.name}</Text>
               <Text>address: {x.address}</Text>
             </View>
           )
         }
         <HLine/>

         <Button title="connect" onPress={this.connect} />
         <Text>connectedDeviceName: {deviceName}</Text>
         <HLine/>

         <Button title="disconnect" onPress={this.disconnect} />
         <HLine/>

         <Button title="aimOn" onPress={this.aimOn} />
         <HLine/>
         <Button title="aimOff" onPress={this.aimOff} />
         <HLine/>

         <Button title="reset barcode" onPress={this.resetBarcode} />
         <Text> barcode: </Text>
         {
           barcode ? <>
             <Text> type: {barcode.type}</Text>
             <Text> data: {barcode.data}</Text>
           </>:null
         }
         <Zebra.Receiver
           onBarcodeRead={this.handleBarcodeRead}
           onAppeared={console.info}
           onDisappeared={console.info}
         />
       </View>
     )
  }
}
