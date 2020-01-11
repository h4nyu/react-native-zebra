
package com.rnzebrabarcode;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.Callback;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.HashMap;
import java.util.Optional;
import android.util.Log;
import androidx.annotation.Nullable;

import com.zebra.scannercontrol.DCSScannerInfo;
import com.zebra.scannercontrol.DCSSDKDefs;
import com.zebra.scannercontrol.SDKHandler;
import com.zebra.scannercontrol.FirmwareUpdateEvent;
import com.zebra.scannercontrol.IDcsSdkApiDelegate;


public class RNZebraBarcodeModule extends ReactContextBaseJavaModule implements IDcsSdkApiDelegate {
  private static final String TAG = "ReactNative";
  private final ReactApplicationContext reactContext;
  private SDKHandler sdkHandler; // Zebra SDK
  private List<DCSScannerInfo> devices;

  public RNZebraBarcodeModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.sdkHandler = new SDKHandler(reactContext);
    int notificationsMask = DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_BARCODE.value
      // Subscribe to scanner available/unavailable events
      | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_APPEARANCE.value
      | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SCANNER_DISAPPEARANCE.value
      // Subscribe to scanner connection/disconnection events
      | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_ESTABLISHMENT.value
      | DCSSDKDefs.DCSSDK_EVENT.DCSSDK_EVENT_SESSION_TERMINATION.value;
    sdkHandler.dcssdkSubsribeForEvents(notificationsMask);
    sdkHandler.dcssdkSetDelegate(this);
    sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_SNAPI);
    sdkHandler.dcssdkSetOperationalMode(DCSSDKDefs.DCSSDK_MODE.DCSSDK_OPMODE_BT_NORMAL);
    this.devices = new ArrayList<DCSScannerInfo>();
  }

  @Override
  public String getName() {
    return "RNZebraBarcode";
  }

  public void dcssdkEventScannerAppeared(DCSScannerInfo device) {
    this.sendEvent("onAppeared", device.getScannerName());
  }

  public void dcssdkEventScannerDisappeared(int scannerId) {
    this.devices.stream()
      .filter(x -> x.getScannerID() == scannerId)
      .findFirst()
      .ifPresent(x -> {
        this.sendEvent("onDisappeared", x.getScannerName());
      });
  }

  public void dcssdkEventCommunicationSessionEstablished(DCSScannerInfo device) {
    Log.d(TAG, "onEstablished " + device.getScannerName());
    this.sendEvent("onEstablished", device.getScannerName());
  }

  public void dcssdkEventCommunicationSessionTerminated(int deviceId) {
    this.devices.stream()
      .filter(x -> x.getScannerID() == deviceId)
      .findFirst()
      .ifPresent(x -> {
        Log.d(TAG, "onTerminated " + x.getScannerName());
        this.sendEvent("onTerminated", x.getScannerName());
      });
  }

  public void dcssdkEventBarcode(byte[] barcodeData, int barcodeType, int scannerId) {
    Log.d(TAG, "Got Barcode");
    final WritableMap payload = new WritableNativeMap();
    payload.putInt("barcodeType", barcodeType);
    payload.putString("data", new String(barcodeData));
    this.sendEvent("onBarcodeRead", payload);
  }

  @ReactMethod
  public void getAvailableDevices(final Promise promise){
    try {
      sdkHandler.dcssdkGetAvailableScannersList(this.devices);
      final WritableArray payload = new WritableNativeArray();
      for (DCSScannerInfo device : this.devices) {
        payload.pushMap(this.toScannerDeviceMap(device));
      }
      promise.resolve(payload);
    }
    catch(Exception e){
      promise.reject(e);
    }
  }

  @ReactMethod
  public void connect(final String deviceName, final Promise promise) {
    Log.d(TAG, "connect to " + deviceName);
    this.devices.stream()
      .filter(x -> x.getScannerName().equals(deviceName))
      .findFirst()
      .ifPresent(x -> {
        try {
          Log.d(TAG, x.getScannerName());
          final DCSSDKDefs.DCSSDK_RESULT result = sdkHandler.dcssdkEstablishCommunicationSession(x.getScannerID());
          if (result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SUCCESS){
            promise.resolve(deviceName);
          }else if(result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SCANNER_NOT_AVAILABLE){
            promise.reject("scanner not avalable");
          }else if(result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SCANNER_ALREADY_ACTIVE){
            promise.resolve(deviceName);
          }else{
            promise.reject("unable to connect to a scanner");
          }
        }
        catch(Exception e){
          promise.reject(e);
        }
      });
  }

  @ReactMethod
  public void disconnect(final String deviceName, final Promise promise) {
    this.devices.stream()
      .filter(x -> x.getScannerName().equals(deviceName))
      .findFirst()
      .ifPresent(x -> {
        final DCSSDKDefs.DCSSDK_RESULT result = sdkHandler.dcssdkTerminateCommunicationSession(x.getScannerID());
        if (result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SUCCESS) {
          promise.resolve(deviceName);
        }
        else if (result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SCANNER_NOT_AVAILABLE){
          promise.reject("Scanner is not available.");
        }
        else if (result == DCSSDKDefs.DCSSDK_RESULT.DCSSDK_RESULT_SCANNER_NOT_ACTIVE){
          promise.reject("Never connected to a scanner.");
        }
        else{
          promise.reject("Unable to disconnect from a scanner.");
        }
      });
  }

  @ReactMethod
  public void aimOn(final Promise promise) {
    this.getActiveDevice()
      .ifPresent(x -> {
        final String inXml = "<inArgs><scannerID>" + x.getScannerID() + "</scannerID></inArgs>";
        this.executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_AIM_ON, inXml);
        promise.resolve(x.getScannerName());
      });
  }

  @ReactMethod
  public void aimOff(final Promise promise) {
    this.getActiveDevice()
      .ifPresent(x -> {
        final String inXml = "<inArgs><scannerID>" + x.getScannerID() + "</scannerID></inArgs>";
        this.executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_AIM_OFF, inXml);
        promise.resolve(x.getScannerName());
      });
  }

  private Optional<DCSScannerInfo> getActiveDevice(){
    return this.devices.stream()
      .filter(x -> x.isActive())
      .findFirst();
  }

  private void executeCommand(final DCSSDKDefs.DCSSDK_COMMAND_OPCODE opCode, final String inXml){
    final StringBuilder outXML = new StringBuilder();
    this.sdkHandler.dcssdkExecuteCommandOpCodeInXMLForScanner(opCode, inXml, outXML);
  }

  private WritableMap toScannerDeviceMap(final DCSScannerInfo scanner) {
    final WritableMap device = new WritableNativeMap();
    device.putString("name", scanner.getScannerName());
    device.putString("address", scanner.getScannerHWSerialNumber());
    return device;
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  private void sendEvent(String eventName, @Nullable String params) {
    this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  public void dcssdkEventImage(byte[] var1, int var2) { }

  public void dcssdkEventVideo(byte[] var1, int var2) { }

  public void dcssdkEventFirmwareUpdate(FirmwareUpdateEvent var1) { }

  public void dcssdkEventAuxScannerAppeared(DCSScannerInfo dcsScannerInfo, DCSScannerInfo dcsScannerInfo1) { }

  public void dcssdkEventBinaryData(byte[] binaryAry, int deviceId) { }
}
