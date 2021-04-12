import React from 'react';
import * as Zebra from "@oniku/react-native-zebra-barcode";
declare type State = {
    devices: Zebra.Device[];
    deviceName: string | null;
    barcode: Zebra.Barcode | null;
};
export default class App extends React.Component<{}, State> {
    state: State;
    getAvailableDevices: () => Promise<void>;
    connect: () => Promise<void>;
    disconnect: () => Promise<void>;
    aimOn: () => Promise<void>;
    aimOff: () => Promise<void>;
    handleBarcodeRead: (barcode: Zebra.Barcode) => void;
    resetBarcode: () => void;
    render: () => any;
}
export {};
