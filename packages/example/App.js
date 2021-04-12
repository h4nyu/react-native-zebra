import React from 'react';
import { View, Text, Button } from "react-native";
import * as Zebra from "@oniku/react-native-zebra-barcode";
const HLine = () => React.createElement(View, { style: {
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        margin: 5,
    } });
export default class App extends React.Component {
    constructor() {
        super(...arguments);
        this.state = {
            devices: [],
            deviceName: null,
            barcode: null,
        };
        this.getAvailableDevices = async () => {
            const devices = await Zebra.getAvailableDevices();
            this.setState({
                ...this.state,
                devices,
            });
        };
        this.connect = async () => {
            const { devices, deviceName } = this.state;
            if (devices.length > 0) {
                const deviceName = await Zebra.connect(devices[0].name);
                this.setState({
                    ...this.state,
                    deviceName,
                });
            }
        };
        this.disconnect = async () => {
            const { deviceName } = this.state;
            if (deviceName !== null) {
                await Zebra.disconnect(deviceName);
                this.setState({
                    ...this.state,
                    deviceName: null,
                });
            }
        };
        this.aimOn = async () => {
            await Zebra.aimOn();
        };
        this.aimOff = async () => {
            await Zebra.aimOff();
        };
        this.handleBarcodeRead = (barcode) => {
            this.setState({
                ...this.state,
                barcode,
            });
        };
        this.resetBarcode = () => {
            this.setState({
                ...this.state,
                barcode: null,
            });
        };
        this.render = () => {
            const { devices, deviceName, barcode } = this.state;
            return (React.createElement(View, null,
                React.createElement(Button, { title: "getAvailableDevices", onPress: this.getAvailableDevices }),
                devices.map(x => React.createElement(View, { key: x.name },
                    React.createElement(Text, null,
                        "name: ",
                        x.name),
                    React.createElement(Text, null,
                        "address: ",
                        x.address))),
                React.createElement(HLine, null),
                React.createElement(Button, { title: "connect", onPress: this.connect }),
                React.createElement(Text, null,
                    "connectedDeviceName: ",
                    deviceName),
                React.createElement(HLine, null),
                React.createElement(Button, { title: "disconnect", onPress: this.disconnect }),
                React.createElement(HLine, null),
                React.createElement(Button, { title: "aimOn", onPress: this.aimOn }),
                React.createElement(HLine, null),
                React.createElement(Button, { title: "aimOff", onPress: this.aimOff }),
                React.createElement(HLine, null),
                React.createElement(Button, { title: "reset barcode", onPress: this.resetBarcode }),
                React.createElement(Text, null, " barcode: "),
                barcode ? React.createElement(React.Fragment, null,
                    React.createElement(Text, null,
                        " type: ",
                        barcode.type),
                    React.createElement(Text, null,
                        " data: ",
                        barcode.data)) : null,
                React.createElement(Zebra.Receiver, { onBarcodeRead: this.handleBarcodeRead, onAppeared: console.info, onDisappeared: console.info })));
        };
    }
}
