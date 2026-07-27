/**
 * device-bridge — Phase 2 stub
 *
 * Future iOS plugin surface for:
 * - laser / tape measure sync
 * - spirit level (accelerometer)
 * - Apple LiDAR room scan → floorplan draft
 *
 * Web phase-1 exposes greyed UI under /tools; do not call hardware APIs here yet.
 */

export type MeasureUnit = "mm" | "cm" | "m";

export interface DistanceReading {
  value: number;
  unit: MeasureUnit;
  capturedAt: string;
  source: "stub";
}

export interface LevelReading {
  pitchDeg: number;
  rollDeg: number;
  isLevel: boolean;
  capturedAt: string;
  source: "stub";
}

export interface LidarScanStub {
  status: "unsupported";
  message: string;
}

export interface DeviceBridge {
  isAvailable(): boolean;
  measureDistance(): Promise<DistanceReading>;
  readLevel(): Promise<LevelReading>;
  startLidarScan(): Promise<LidarScanStub>;
}

export class StubDeviceBridge implements DeviceBridge {
  isAvailable(): boolean {
    return false;
  }

  async measureDistance(): Promise<DistanceReading> {
    throw new Error(
      "device-bridge: measureDistance is not available on web. Use iOS plugin in Phase 2.",
    );
  }

  async readLevel(): Promise<LevelReading> {
    throw new Error(
      "device-bridge: readLevel is not available on web. Use iOS plugin in Phase 2.",
    );
  }

  async startLidarScan(): Promise<LidarScanStub> {
    return {
      status: "unsupported",
      message: "Apple LiDAR / ARKit room scan reserved for Phase 2 iOS plugin.",
    };
  }
}

export const deviceBridge: DeviceBridge = new StubDeviceBridge();

export const DEVICE_BRIDGE_CAPABILITIES = [
  { id: "distance", label: "测距", phase: 2, available: false },
  { id: "level", label: "水平仪", phase: 2, available: false },
  { id: "lidar", label: "LiDAR 户型扫描", phase: 2, available: false },
  { id: "cad", label: "CAD 图板", phase: 2, available: false },
] as const;
