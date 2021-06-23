package com.rnzebrarfid;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.module.annotations.ReactModule;

import android.os.AsyncTask;
import android.util.Log;
import androidx.annotation.Nullable;
import androidx.annotation.NonNull;

import com.zebra.rfid.api3.RfidEventsListener;
import com.zebra.rfid.api3.Antennas;
import com.zebra.rfid.api3.ReaderDevice;
import com.zebra.rfid.api3.RFIDReader;
import com.zebra.rfid.api3.Readers;
import com.zebra.rfid.api3.OperationFailureException;
import com.zebra.rfid.api3.InvalidUsageException;
import com.zebra.rfid.api3.TriggerInfo;
import com.zebra.rfid.api3.TagData;
import com.zebra.rfid.api3.RfidReadEvents;
import com.zebra.rfid.api3.RfidStatusEvents;
import com.zebra.rfid.api3.RfidEventsListener;
import com.zebra.rfid.api3.TagAccess;
import com.zebra.rfid.api3.Readers.RFIDReaderEventHandler;

import com.zebra.rfid.api3.BEEPER_VOLUME;
import com.zebra.rfid.api3.ACCESS_OPERATION_CODE;
import com.zebra.rfid.api3.ACCESS_OPERATION_STATUS;
import com.zebra.rfid.api3.HANDHELD_TRIGGER_EVENT_TYPE;
import com.zebra.rfid.api3.ENUM_TRANSPORT;
import com.zebra.rfid.api3.START_TRIGGER_TYPE;
import com.zebra.rfid.api3.STATUS_EVENT_TYPE;
import com.zebra.rfid.api3.STOP_TRIGGER_TYPE;
import com.zebra.rfid.api3.ENUM_TRIGGER_MODE;
import com.zebra.rfid.api3.WRITE_FIELD_CODE;
import com.zebra.rfid.api3.MEMORY_BANK;
import com.zebra.rfid.api3.SESSION;
import com.zebra.rfid.api3.INVENTORY_STATE;
import com.zebra.rfid.api3.SL_FLAG;

import java.util.ArrayList;
import java.util.List; 
import java.util.Optional;
import java.util.Map;
import java.util.HashMap;

import android.widget.Toast;


@ReactModule(name = RNZebraRfidModule.NAME)
public class RNZebraRfidModule extends ReactContextBaseJavaModule implements RfidEventsListener {
  public static final String NAME = "RNZebraRfid";
  private static final String TAG = "ReactNative";
  private final ReactApplicationContext reactContext;

  private Readers readers;
  private List<ReaderDevice> devices;
  private int MAX_POWER = 270;

  public RNZebraRfidModule(ReactApplicationContext reactContext) {
    super(reactContext);
    this.reactContext = reactContext;
    this.devices = new ArrayList<ReaderDevice>();
    this.readers = new Readers(reactContext, ENUM_TRANSPORT.BLUETOOTH);
  }

  @Override
  @NonNull
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void getAvailableDevices(Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        try {
          devices = readers.GetAvailableRFIDReaderList();

          final WritableArray payloads = new WritableNativeArray();
          for (ReaderDevice device : devices) {
            payloads.pushMap(toDevicePayload(device));
          }
          promise.resolve(payloads);

        } catch (InvalidUsageException e) {
          promise.reject(e);
        }
      }
    }).start();
  }

  @ReactMethod
  public void connect(final String deviceName, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        devices.stream()
          .filter(x -> x.getName().equals(deviceName))
          .findFirst()
          .map(x -> x.getRFIDReader())
          .ifPresent(x -> {
            Log.d(TAG, "connect to " + deviceName);
            try {
              if(!x.isConnected()){
                x.connect();
              }
              initRFIDReader(x);
            } catch (InvalidUsageException | OperationFailureException e) {
              promise.reject(e);
              return;
            }
          });
        promise.resolve(deviceName);
        return;
      }
    }).start();
  }

  @ReactMethod
  public void disconnect(final String deviceName, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        devices.stream()
          .filter(x -> x.getName().equals(deviceName))
          .findFirst()
          .map(x -> x.getRFIDReader())
          .ifPresent(x -> {
            try {
              if(x.isConnected()){
                x.disconnect();
              }
            } catch (InvalidUsageException | OperationFailureException e) {
              promise.reject(e);
              return;
            }
          });
        promise.resolve(deviceName);
        return;
      }
    }).start();
  }

  @ReactMethod
  public void setMode(final String mode, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        getRFIDReader().ifPresent(x -> {
          try {
            if(mode.equals("RFID")){
              x.Config.setTriggerMode(ENUM_TRIGGER_MODE.RFID_MODE, true);
            }else if(mode.equals("BARCODE")){
              x.Config.setTriggerMode(ENUM_TRIGGER_MODE.BARCODE_MODE, true);
            }
            promise.resolve(mode);
            return;
          } catch (InvalidUsageException | OperationFailureException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
          }
        });
      }
    }).start();
  }
  @ReactMethod
  public void setPower(final int power, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        getRFIDReader().ifPresent(x -> {
          try {
            final Antennas.AntennaRfConfig  config = x.Config.Antennas.getAntennaRfConfig(1);
            config.setTransmitPowerIndex(power);
            x.Config.Antennas.setAntennaRfConfig(1, config);
            promise.resolve(power);
            return;
          } catch (InvalidUsageException | OperationFailureException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
          }
        });
      }
    }).start();
  }

  @ReactMethod
  public void startInventory(Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        performInventory();
        promise.resolve(null);
        return;
      }
    }).start();
  }

  @ReactMethod
  public void stopInventory(Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        stopInventory();
        promise.resolve(null);
        return;
      }
    }).start();
  }

  @ReactMethod
  public void writeEPCData(final String targetId, final String tagId, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        final RFIDReader reader = getRFIDReader().orElse(null);
        if(reader != null){
          TagAccess.WriteAccessParams writeAccessParams = reader.Actions.TagAccess.new WriteAccessParams();
          writeAccessParams.setAccessPassword(0);
          writeAccessParams.setMemoryBank(MEMORY_BANK.MEMORY_BANK_EPC);
          writeAccessParams.setOffset(2);
          writeAccessParams.setWriteData(tagId);
          writeAccessParams.setWriteDataLength(tagId.length() / 4);
          try {
            reader.Actions.TagAccess.blockWriteWait(targetId, writeAccessParams, null, null);
            promise.resolve(tagId);
            return;
          } catch (InvalidUsageException | OperationFailureException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
          }
        };
      }
    }).start();
  }

  @ReactMethod
  public void getTIDData(final String tagId, Promise promise) {
    new Thread(new Runnable() {
      @Override
      public void run() {
        final RFIDReader reader = getRFIDReader().orElse(null);
        final WritableArray payload = new WritableNativeArray();
        if(reader != null){
          TagAccess.ReadAccessParams readAccessParams = reader.Actions.TagAccess.new ReadAccessParams();
          readAccessParams.setCount(0);
          readAccessParams.setMemoryBank(MEMORY_BANK.MEMORY_BANK_TID);
          readAccessParams.setOffset(0);
          try {
            TagData tagData = reader.Actions.TagAccess.readWait(tagId, readAccessParams, null);
            payload.pushString(tagData.getMemoryBankData());
            sendEvent("onTidRead", payload);
            promise.resolve(tagId);
            return;
          } catch (InvalidUsageException | OperationFailureException e) {
            e.printStackTrace();
            promise.reject(e);
            return;
          }
        };
      }
    }).start();
  }

  private void initRFIDReader(RFIDReader rfidReader) {
    try {
      rfidReader.Events.addEventsListener(this);
      rfidReader.Events.setHandheldEvent(true);
      rfidReader.Events.setTagReadEvent(true);
    } catch (InvalidUsageException | OperationFailureException e) {
      e.printStackTrace();
      Log.d(TAG,"ConfigureReader error");
    }
  }

  private WritableMap toDevicePayload(final ReaderDevice device) {
    final WritableMap payload = new WritableNativeMap();
    payload.putString("name", device.getName());
    payload.putString("address", device.getAddress());
    return payload;
  }

  public void eventStatusNotify(RfidStatusEvents event) {
    Log.d(TAG, "Status Notification: " + event.StatusEventData.getStatusEventType());

    final WritableMap payload = new WritableNativeMap();
    if (event.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_PRESSED) {
      this.sendEvent("onTriggerPressed", payload);
    }

    if (event.StatusEventData.HandheldTriggerEventData.getHandheldEvent() == HANDHELD_TRIGGER_EVENT_TYPE.HANDHELD_TRIGGER_RELEASED) {
      this.sendEvent("onTriggerReleased", payload);
    }
  }

  private void performInventory() {
    this.getRFIDReader().ifPresent(x -> {
      try {
        x.Actions.Inventory.perform();
      } catch (InvalidUsageException | OperationFailureException e) {
        e.printStackTrace();
      }
    });
  }


  public void eventReadNotify(RfidReadEvents event) {
    this.getRFIDReader().ifPresent(x -> {
      final TagData[] tags = x.Actions.getReadTags(100);
      final WritableArray payload = new WritableNativeArray();
      for (TagData tag : tags) {
        payload.pushString(tag.getTagID());
      }
      this.sendEvent("onRfidRead", payload);
    });
  }

  private void stopInventory() {
    this.getRFIDReader().ifPresent(x -> {
      try {
        x.Actions.Inventory.stop();
      } catch (InvalidUsageException | OperationFailureException e) {
        e.printStackTrace();
      }
    });
  }

  private Optional<RFIDReader> getRFIDReader(){
    return this.devices.stream()
      .map(x -> x.getRFIDReader())
      .filter(x -> x.isConnected())
      .findFirst();
  }

  private void sendEvent(String eventName, @Nullable WritableMap params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }


  private void sendEvent(String eventName, @Nullable WritableArray params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }

  private void sendEvent(String eventName, @Nullable String params) {
    reactContext.getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class).emit(eventName, params);
  }
}
