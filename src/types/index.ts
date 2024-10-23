export type Device = {
  id: string;
  temperature: number;
  battery: number;
  createdBy: string;
  name: string;
  lastSeen: string;
  humidity: number;
  createdAt: string;
  apiKey: string;
};

export type TimePeriod = "today" | "lastWeek" | "lastMonth" | "lastYear";

export type ValueKeys = "temperature" | "humidity" | "battery";

export type DeviceData = {
  deviceId: string;
  timestamp: string;
  battery: number;
  temperature: number;
  humidity: number;
};
