import React from 'react';
import {
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';
import { aimOff } from '.';

export type Barcode = {
  type: number;
  data: string;
}

export enum EventName {
  onBarcodeRead = "onBarcodeRead",
  onAppeared = "onAppeared",
  onDisappeared = "onDisappeared",
}

export interface IProps {
  onBarcodeRead: (event: Barcode) => void;
  onAppeared: (deviceName: string) => void;
  onDisappeared: (deviceName: string) => void;
}
export class Receiver extends React.Component<IProps> {
  subscriptions: EmitterSubscription[] = []
  componentDidMount() {
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onBarcodeRead, this.props.onBarcodeRead))
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onAppeared, this.props.onAppeared))
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onDisappeared, this.props.onDisappeared))
  }
  componentWillUnmount() {
    aimOff();
    this.subscriptions.forEach(s => s.remove());
  }
  render = () => { return null }
}
