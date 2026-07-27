/**
 * device-bridge · 传感器/量房能力占位（Phase 2）
 *
 * 第一期不实现任何硬件能力，只固定接口形状，供日后 iOS（ARKit / LiDAR /
 * CoreMotion 水平仪）插件与 Web 端（WebXR / DeviceOrientation）实现对接。
 *
 * 约定：
 * - 所有能力先经 `capabilities()` 探测，UI 据此灰显不可用入口（见 /tools 页）。
 * - 实现方（原生插件 / Web API 适配层）实现 DeviceBridge 接口后注入。
 */

export interface DeviceCapabilities {
  /** 激光/超声测距（Phase 2：iOS 外设或 ARKit 测距） */
  rangefinder: boolean;
  /** 水平仪（Phase 2：DeviceOrientation / CoreMotion） */
  level: boolean;
  /** LiDAR 点云扫描（Phase 2：Apple LiDAR，导出量房数据供 CAD 图板） */
  lidarScan: boolean;
}

export interface DistanceMeasurement {
  meters: number;
  accuracyMeters?: number;
  measuredAt: string; // ISO 8601
}

export interface LevelReading {
  /** 相对水平面的横滚角（度），0 = 水平 */
  rollDegrees: number;
  /** 俯仰角（度） */
  pitchDegrees: number;
  measuredAt: string;
}

export interface LidarScanResult {
  /** 导出格式：usdz / ply / room-plan JSON */
  format: "usdz" | "ply" | "roomplan-json";
  /** 扫描产物的 Blob URL（存 Vercel Blob，与 proposal_assets 同套存储） */
  blobUrl: string;
  roomCount?: number;
}

export interface DeviceBridge {
  capabilities(): Promise<DeviceCapabilities>;
  measureDistance(): Promise<DistanceMeasurement>;
  readLevel(): Promise<LevelReading>;
  scanRoom(): Promise<LidarScanResult>;
}

export class NotImplementedError extends Error {
  constructor(feature: string) {
    super(`[device-bridge] ${feature} 将在 Phase 2（iOS 插件）提供，当前为占位实现`);
    this.name = "NotImplementedError";
  }
}

/** 第一期默认实现：一切能力不可用，UI 据此灰显。 */
export class StubDeviceBridge implements DeviceBridge {
  async capabilities(): Promise<DeviceCapabilities> {
    return { rangefinder: false, level: false, lidarScan: false };
  }
  async measureDistance(): Promise<DistanceMeasurement> {
    throw new NotImplementedError("measureDistance");
  }
  async readLevel(): Promise<LevelReading> {
    throw new NotImplementedError("readLevel");
  }
  async scanRoom(): Promise<LidarScanResult> {
    throw new NotImplementedError("scanRoom");
  }
}

export const deviceBridge: DeviceBridge = new StubDeviceBridge();
