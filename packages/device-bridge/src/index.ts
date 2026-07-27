export type DeviceCapability = "level" | "lidar-scan" | "distance";

export interface Measurement {
  capability: DeviceCapability;
  value: number;
  unit: "degree" | "meter";
  capturedAt: string;
}

export interface DeviceBridge {
  isAvailable(capability: DeviceCapability): Promise<boolean>;
  measure(capability: DeviceCapability): Promise<Measurement>;
}

export class UnsupportedDeviceBridge implements DeviceBridge {
  async isAvailable(): Promise<boolean> {
    return false;
  }

  async measure(capability: DeviceCapability): Promise<Measurement> {
    throw new Error(`${capability} is reserved for the Phase 2 native bridge`);
  }
}

export const deviceBridge: DeviceBridge = new UnsupportedDeviceBridge();
