
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
import com.facebook.react.module.annotations.ReactModule;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;
import java.util.HashMap;
import java.util.Optional;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.zebra.scannercontrol.DCSScannerInfo;
import com.zebra.scannercontrol.DCSSDKDefs;
import com.zebra.scannercontrol.SDKHandler;
import com.zebra.scannercontrol.FirmwareUpdateEvent;
import com.zebra.scannercontrol.IDcsSdkApiDelegate;

@ReactModule(name = RNZebraBarcodeModule.NAME)
public class RNZebraBarcodeModule extends ReactContextBaseJavaModule implements IDcsSdkApiDelegate {
  public static final String NAME = "RNZebraBarcode";
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
  @NonNull
  public String getName() {
    return NAME;
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
    this.sendEvent("onEstablished", device.getScannerName());
  }

  public void dcssdkEventCommunicationSessionTerminated(int deviceId) {
    this.devices.stream()
      .filter(x -> x.getScannerID() == deviceId)
      .findFirst()
      .ifPresent(x -> {
        this.sendEvent("onTerminated", x.getScannerName());
      });
  }

  public void dcssdkEventBarcode(byte[] barcodeData, int barcodeType, int scannerId) {
    final WritableMap payload = new WritableNativeMap();
    payload.putInt("type", barcodeType);
    payload.putString("data", new String(barcodeData));
    this.sendEvent("onBarcodeRead", payload);
  }

  @ReactMethod
  public void getAvailableDevices(final Promise promise){
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          sdkHandler.dcssdkGetAvailableScannersList(devices);
          devices =  devices.stream().distinct().collect(Collectors.toList());
          final WritableArray payload = new WritableNativeArray();
          for (DCSScannerInfo device : devices) {
            payload.pushMap(toScannerDeviceMap(device));
          }
          promise.resolve(payload);
        }
        catch(Exception e){
          promise.reject(e);
        }
      }
    }).start();
  }

  @ReactMethod
  public void connect(final String deviceName, final Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        Log.d(TAG, "connect to " + deviceName);
        devices.stream()
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
    }).start();
  }

  @ReactMethod
  public void disconnect(final String deviceName, final Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        devices.stream()
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
    }).start();
  }

  @ReactMethod
  public void aimOn(final Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        getActiveDevice()
          .ifPresent(x -> {
            final String inXml = "<inArgs><scannerID>" + x.getScannerID() + "</scannerID></inArgs>";
            executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_AIM_ON, inXml);
            promise.resolve(x.getScannerName());
          });
      }
    }).start();
  }

  @ReactMethod
  public void aimOff(final Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        getActiveDevice()
          .ifPresent(x -> {
            final String inXml = "<inArgs><scannerID>" + x.getScannerID() + "</scannerID></inArgs>";
            executeCommand(DCSSDKDefs.DCSSDK_COMMAND_OPCODE.DCSSDK_DEVICE_AIM_OFF, inXml);
            promise.resolve(x.getScannerName());
          });
      }
    }).start();
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
    Log.d(TAG,  eventName + ":" + params.toString());
    this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  private void sendEvent(String eventName, @Nullable String params) {
    Log.d(TAG,  eventName + ":" + params);
    this.reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  public void dcssdkEventImage(byte[] var1, int var2) { }

  public void dcssdkEventVideo(byte[] var1, int var2) { }

  public void dcssdkEventFirmwareUpdate(FirmwareUpdateEvent var1) { }

  public void dcssdkEventAuxScannerAppeared(DCSScannerInfo dcsScannerInfo, DCSScannerInfo dcsScannerInfo1) { }

  public void dcssdkEventBinaryData(byte[] binaryAry, int deviceId) { }
}
