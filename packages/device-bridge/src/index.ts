/**
 * Device bridge stub — Phase 2: iOS ARKit / LiDAR / level integration.
 * @see docs/ROADMAP.md
 */

export type DeviceCapability =
  | "distance_measure"
  | "level"
  | "lidar_scan"
  | "cad_overlay";

export interface DeviceBridge {
  isAvailable(capability: DeviceCapability): Promise<boolean>;
  measureDistance?(): Promise<{ meters: number; accuracy?: number }>;
  getLevel?(): Promise<{ pitch: number; roll: number }>;
  startLidarScan?(): Promise<{ pointCloudUrl: string }>;
}

export class StubDeviceBridge implements DeviceBridge {
  async isAvailable(_capability: DeviceCapability): Promise<boolean> {
    return false;
  }

  async measureDistance(): Promise<{ meters: number }> {
    throw new Error("device-bridge: distance_measure not available (Phase 2)");
  }

  async getLevel(): Promise<{ pitch: number; roll: number }> {
    throw new Error("device-bridge: level not available (Phase 2)");
  }

  async startLidarScan(): Promise<{ pointCloudUrl: string }> {
    throw new Error("device-bridge: lidar_scan not available (Phase 2)");
  }
}

export function createDeviceBridge(): DeviceBridge {
  return new StubDeviceBridge();
}
