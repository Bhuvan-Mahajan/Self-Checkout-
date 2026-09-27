import { Platform, PermissionsAndroid } from 'react-native';

// Smart Cart BLE Service & Characteristic UUIDs
export const CART_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
export const WEIGHT_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';
export const LOCK_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a9';

let BleManagerInstance = null;

const getBleManager = () => {
  if (!BleManagerInstance) {
    try {
      const { BleManager } = require('react-native-ble-plx');
      BleManagerInstance = new BleManager();
    } catch (e) {
      console.warn('BLE Manager not supported on this platform/environment:', e);
    }
  }
  return BleManagerInstance;
};

export const requestBlePermissions = async () => {
  if (Platform.OS === 'android') {
    if (Platform.Version >= 31) {
      const result = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      return (
        result['android.permission.BLUETOOTH_SCAN'] === PermissionsAndroid.RESULTS.GRANTED &&
        result['android.permission.BLUETOOTH_CONNECT'] === PermissionsAndroid.RESULTS.GRANTED
      );
    } else {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
      );
      return granted === PermissionsAndroid.RESULTS.GRANTED;
    }
  }
  return true;
};

export const bleService = {
  startDeviceScan: (onDeviceFound) => {
    const manager = getBleManager();
    if (!manager) return;

    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error('BLE Scan error:', error);
        return;
      }
      if (device && device.name && device.name.includes('SmartCart')) {
        onDeviceFound(device);
      }
    });
  },

  stopDeviceScan: () => {
    const manager = getBleManager();
    manager?.stopDeviceScan();
  },

  connectToCart: async (deviceId, onWeightUpdate) => {
    const manager = getBleManager();
    if (!manager) return null;

    try {
      const device = await manager.connectToDevice(deviceId);
      await device.discoverAllServicesAndCharacteristics();

      // Monitor weight sensor stream
      device.monitorCharacteristicForService(
        CART_SERVICE_UUID,
        WEIGHT_CHARACTERISTIC_UUID,
        (error, characteristic) => {
          if (error) {
            console.warn('Weight telemetry error:', error);
            return;
          }
          if (characteristic?.value) {
            const raw = Buffer.from(characteristic.value, 'base64').toString('utf-8');
            const weightGrams = parseFloat(raw);
            if (!isNaN(weightGrams) && onWeightUpdate) {
              onWeightUpdate(weightGrams);
            }
          }
        }
      );

      return device;
    } catch (error) {
      console.error('Failed to connect to Smart Cart:', error);
      throw error;
    }
  },

  disconnectCart: async (deviceId) => {
    const manager = getBleManager();
    if (manager && deviceId) {
      await manager.cancelDeviceConnection(deviceId);
    }
  },
};

export default bleService;
