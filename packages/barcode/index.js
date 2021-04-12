import { NativeModules } from 'react-native';
const { RNZebraBarcode } = NativeModules;
export const connect = RNZebraBarcode.connect;
export const disconnect = RNZebraBarcode.disconnect;
export const getAvailableDevices = RNZebraBarcode.getAvailableDevices;
export const aimOn = RNZebraBarcode.aimOn;
export const aimOff = RNZebraBarcode.aimOff;
export * from './Receiver';
