export type Device = {
  id: string;
  temperature: string;
  battery: string;
  createdBy: string;
  name: string;
  lastSeen: string;
  humidity: string;
  createdAt: string;
  apiKey: string;
};

export type TimePeriod = "today" | "lastWeek" | "lastMonth" | "lastYear";

export type ValueKeys = "temperature" | "humidity" | "battery";

export type DeviceData = {
  battery: string;
  temperature: string;
  deviceId: string;
  humidity: string;
  timestamp: string;
};
