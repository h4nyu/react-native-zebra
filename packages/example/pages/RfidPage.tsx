import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  Text,
  Button,
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import * as Barcode from "@oniku/react-native-zebra-barcode";
import * as Rfid from "@oniku/react-native-zebra-rfid";


// let startTime = Date.now()
// let endTime = Date.now()
// let tidStartTime = Date.now()
// let tidEndTime = Date.now()

const RfidPage = () => {
  const [ devices, setDevices ] = React.useState<Rfid.Device[]>([])
  const [ deviceName, setDeviceName ] = React.useState("")
  const [ rfid, setRfid ] = React.useState<string[]>([])
  const [ tids, setTids ] = React.useState<string[]>([])
  const [ text, setText ] = React.useState<string>("")
  const getAvailableDevices = async () => {
    try{
      const devices = await Rfid.getAvailableDevices()
      setDevices(devices)
    }catch(e){
      console.warn(e)
    }
  };

  const connect = async (name:string) => {
    try{
      const connected = await Rfid.connect(name)
      setDeviceName(connected)
      await setRfidMode()
      await setPower(50)
      aimOff()
    }catch(e){
      console.warn(e)
    }
  };
  const disconnect = async () => {
    try{
      await Rfid.disconnect(deviceName)
      setDeviceName("")
    }catch(e){
      console.warn(e)
    }
  };

  const setPower = async (power: number) => {
    try{
      const res = await Rfid.setPower(power)
    }catch(e){
      console.warn(e)
    }
  }

  const setRfidMode = async () => {
    try{
      const mode = await Rfid.setMode('RFID')
    }catch(e){
      console.warn(e)
    }
  }

  const getEPCData = async () => {
    try{
      // startTime = Date.now()
      await startInventory()
    }catch(e){
      console.warn(e)
    }
  }

  const writeEPCData = async () => {
    try{
      if (text !== '' && rfid !== undefined) {
        const tidData = await Rfid.writeEPCData(rfid[0], text)
      }
    }catch(e){
      console.warn(e)
    }
  }

  const getTIDData = async (tagIds: string[]) => {
    try{
      // tidStartTime = Date.now()
      for (const t of tagIds) {
        const tidData = await Rfid.getTIDData(t)
      }
    }catch(e){
      console.warn(e)
    }
  }

  const addRfid = (tagIds: string[]) => {
    let ids = rfid;
    tagIds.map(t => {
      if(!ids.includes(t)) {
        ids.push(t)
      }
    })
    setRfid([...ids]);
  }

  const addTid = (tid: string) => {
    let ids = tids;
    if(!ids.includes(tid)) {
      ids.push(tid)
      setTids([...ids]);
    }
  }

  const aimOff = async () => {
    try{
      await Barcode.aimOff()
    }catch(e){
      console.warn(e)
    }
  };

  const startInventory = async () => {
    try{
      await Rfid.startInventory()
    }catch(e){
      console.warn(e)
    }
  }

  const stopInventory = async () => {
    try{
      await Rfid.stopInventory()
    }catch(e){
      console.warn(e)
    }
  }

  const onChangeText = (value: string) => {
    setText(value)
  }

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
        {rfid && rfid.map(r => {
          return (
            <Text> tag: {r}</Text>
          )
        })}
        {
          deviceName !== "" && <View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                getEPCData()
              }}
            >
              <Text> get EPC </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => {
                setPower(230)
              }}
            >
              <Text> POWER UP </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => disconnect()}
            >
              <Text> Disconnect </Text>
            </TouchableOpacity>
            <TextInput
              style={styles.input}
              onChangeText={onChangeText}
              value={text}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={() => writeEPCData()}
              disabled={text === "" || rfid === undefined}
            >
              <Text> write EPC </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.button}
              onPress={() => rfid ? getTIDData(rfid) : {}}
            >
              <Text> get TID </Text>
            </TouchableOpacity>
            {tids && tids.map(t => {
              return (
                <Text> tid: {t}</Text>
              )
            })}
            <Rfid.Receiver 
              onRfidRead={t => {
                // endTime = Date.now()
                addRfid(t)
              }}
              onTidRead={t => {
                // tidEndTime = Date.now()
                addTid(t)
              }}
              onTriggerPressed={() => {
                startInventory()
              }}
              onTriggerReleased={() => {
                stopInventory()
              }}
            />

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
  input: {
    borderBottomColor: '#000000',
    borderBottomWidth: 1,
    padding: 5,
    margin: 5,
  },
});

export default RfidPage;
