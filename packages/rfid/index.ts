import React from 'react';
import { 
  NativeModules, 
  NativeEventEmitter,
} from 'react-native';
const { RNZebraRfid } = NativeModules;

export type Device = {
  name: string;
  address: string;
}

export type Mode = "RFID" | "BARCODE";
export const connect: (deviceName: string) => Promise<string> = RNZebraRfid.connect;
export const disconnect: (deviceName: string) => Promise<string>  = RNZebraRfid.disconnect;
export const getAvailableDevices: () => Promise<Device[]> = RNZebraRfid.getAvailableDevices;
export const setMode:(mode:Mode) => Promise<Mode> = RNZebraRfid.setMode;
export const setPower:(power:number) => Promise<number> = RNZebraRfid.setPower; // value range: 0 - 230
export const writeEPCData:(tagId:string, value:string) => Promise<void> = RNZebraRfid.writeEPCData; 
export const getTIDData:(tagId:string) => Promise<string> = RNZebraRfid.getTIDData; 
export const startInventory:() => Promise<void> = RNZebraRfid.startInventory;
export const stopInventory:() => Promise<void> = RNZebraRfid.stopInventory;

export enum EventName {
  onRfidRead = "onRfidRead",
  onTidRead = "onTidRead",
  onAppeared = "onAppeared",
  onDisappeared = "onDisappeared",
  onTriggerPressed = "onTriggerPressed",
  onTriggerReleased = "onTriggerReleased",
}
const eventEmitter = new NativeEventEmitter(RNZebraRfid);
export const Receiver = (props: {
  onRfidRead?: (tagIds: string[]) => void;
  onTidRead?: (tagId: string) => void;
  onAppeared?: (deviceName: string) => void;
  onDisappeared?: (deviceName: string) => void;
  onTriggerPressed?: () => void;
  onTriggerReleased?: () => void;
}) => {
  React.useEffect(() => {
    const listeners:any[] = []
    if(props.onRfidRead){
      listeners.push(eventEmitter.addListener(EventName.onRfidRead, props.onRfidRead))
    }
    if(props.onTidRead){
      listeners.push(eventEmitter.addListener(EventName.onTidRead, props.onTidRead))
    }
    if(props.onAppeared){
      listeners.push(eventEmitter.addListener(EventName.onAppeared, props.onAppeared))
    }
    if(props.onDisappeared){
      listeners.push(eventEmitter.addListener(EventName.onDisappeared, props.onDisappeared))
    }
    if(props.onTriggerPressed){
      listeners.push(eventEmitter.addListener(EventName.onTriggerPressed, props.onTriggerPressed))
    }
    if(props.onTriggerReleased){
      listeners.push(eventEmitter.addListener(EventName.onTriggerReleased, props.onTriggerReleased))
    }
    return () => {
      listeners.forEach(x => x.remove())
    }
  }, [])
  return null
}

