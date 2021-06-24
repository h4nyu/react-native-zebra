import React from 'react';
import {
  NativeModules,
  NativeEventEmitter,
} from 'react-native';
const { RNZebraRfid } = NativeModules;

export enum EventName {
  onRfidRead = "onRfidRead",
  onAppeared = "onAppeared",
  onDisappeared = "onDisappeared",
}
const eventEmitter = new NativeEventEmitter(RNZebraRfid);
export const Receiver = (props: {
  onRfidRead?: (tagIds: string[]) => void;
  onAppeared?: (deviceName: string) => void;
  onDisappeared?: (deviceName: string) => void;
}) => {
  React.useEffect(() => {
    const listeners:any[] = []
    if(props.onRfidRead){
      listeners.push(eventEmitter.addListener(EventName.onRfidRead, props.onRfidRead))
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

