import React from 'react';
import {
  NativeModules,
  DeviceEventEmitter,
  EmitterSubscription,
} from 'react-native';

export enum EventName {
  onRfidRead = "onRfidRead",
  onAppeared = "onAppeared",
  onDisappeared = "onDisappeared",
}

interface IProps {
  onRfidRead: (tagIds: string[]) => void;
  onAppeared: (deviceName: string) => void;
  onDisappeared: (deviceName: string) => void;
}

export class Receiver extends React.Component<IProps> {
  subscriptions: EmitterSubscription[] = [];

  componentDidMount() {
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onRfidRead, this.props.onRfidRead));
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onAppeared, this.props.onAppeared));   
    this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onDisappeared, this.props.onAppeared));    
  }
  componentWillUnmount() {
    this.subscriptions.forEach(x => x.remove());
  }
  render = () => { return null }
}

