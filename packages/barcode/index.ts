import React from "react"
import { 
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
const { RNZebraBarcode } = NativeModules;

export type Device = {
  name: string;
  address: string;
}
export const connect: (deviceName: string) => Promise<string> = RNZebraBarcode.connect;
export const disconnect: (deviceName: string) => Promise<string> = RNZebraBarcode.disconnect;
export const getAvailableDevices: () => Promise<Device[]> = RNZebraBarcode.getAvailableDevices;
export const aimOn: () => Promise<string> = RNZebraBarcode.aimOn;
export const aimOff: () => Promise<string> = RNZebraBarcode.aimOff;
export { default as AAA } from "react"

export type Barcode = {
  type: number;
  data: string;
}

export enum EventName {
  onBarcodeRead = "onBarcodeRead",
  onAppeared = "onAppeared",
  onDisappeared = "onDisappeared",
}
const eventEmitter = new NativeEventEmitter(RNZebraBarcode);
export const Receiver = (props: {
  onBarcodeRead?: (event: Barcode) => void;
  onAppeared?: (deviceName: string) => void;
  onDisappeared?: (deviceName: string) => void;
})=> {
  React.useEffect(() => {
    const listeners:any[] = []
    if(props.onBarcodeRead){
      listeners.push(eventEmitter.addListener(EventName.onBarcodeRead, props.onBarcodeRead))
    }
    if(props.onAppeared){
      listeners.push(eventEmitter.addListener(EventName.onAppeared, props.onAppeared))
    }
    if(props.onDisappeared){
      listeners.push(eventEmitter.addListener(EventName.onDisappeared, props.onDisappeared))
    }
    return () => {
      listeners.forEach(x => x.remove())
    }
  }, [])
  return null
}
