import { useParams } from "react-router-dom";
import { getDevice, maxMinStats } from "../services/device.service";
import { DeviceInfoCard } from "../components/DeviceInfoCard";

export const DeviceDashboard = () => {
  const { id } = useParams();
  getDevice(id!);

  const getData = async () => {
    const minTemp = await maxMinStats(id!, "temperature", "lastMonth", "min");
    const maxTemp = await maxMinStats(id!, "temperature", "lastMonth", "max");
    const maxHumid = await maxMinStats(id!, "humidity", "lastMonth", "max");
    const minHumid = await maxMinStats(id!, "humidity", "lastMonth", "min");
    const maxBattery = await maxMinStats(id!, "battery", "lastMonth", "max");
    const minBattery = await maxMinStats(id!, "battery", "lastMonth", "min");

    console.log({
      minTemp,
      maxTemp,
      maxHumid,
      minHumid,
      maxBattery,
      minBattery,
    });
  };

  getData();

  return (
    <div>
      <DeviceInfoCard id={id!} />
    </div>
  );
};
