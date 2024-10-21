import { useParams } from "react-router-dom";
import { getDevice, maxMinStats } from "../services/device.service";
import { DeviceInfoCard } from "../components/DeviceInfoCard";

export const DeviceDashboard = () => {
  const { id } = useParams();
  getDevice(id!);

  const getData = async () => {
    const x = [
      () => maxMinStats(id!, "temperature", "lastYear", "min"),
      () => maxMinStats(id!, "temperature", "lastYear", "max"),
      () => maxMinStats(id!, "humidity", "lastYear", "max"),
      () => maxMinStats(id!, "humidity", "lastYear", "min"),
      () => maxMinStats(id!, "battery", "lastYear", "max"),
      () => maxMinStats(id!, "battery", "lastYear", "min"),
    ];
    x.forEach(async (func) => {
      try {
        const data = await func();
        console.log(data);
      } catch (error) {
        console.error(error);
      }
    });
  };

  getData();

  return (
    <div>
      <DeviceInfoCard id={id!} />
    </div>
  );
};
