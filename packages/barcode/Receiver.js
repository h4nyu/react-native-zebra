import React from 'react';
import { DeviceEventEmitter, } from 'react-native';
export var EventName;
(function (EventName) {
    EventName["onBarcodeRead"] = "onBarcodeRead";
    EventName["onAppeared"] = "onAppeared";
    EventName["onDisappeared"] = "onDisappeared";
})(EventName || (EventName = {}));
export class Receiver extends React.Component {
    constructor() {
        super(...arguments);
        this.subscriptions = [];
        this.render = () => { return null; };
    }
    componentDidMount() {
        this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onBarcodeRead, this.props.onBarcodeRead));
        this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onAppeared, this.props.onAppeared));
        this.subscriptions.push(DeviceEventEmitter.addListener(EventName.onDisappeared, this.props.onDisappeared));
    }
    componentWillUnmount() {
        this.subscriptions.forEach(s => s.remove());
    }
}
