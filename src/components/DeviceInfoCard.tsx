import { useQuery } from "@tanstack/react-query";

import { getDevice } from "../services/device.service";
import dayjs from "dayjs";
import { IoHardwareChipOutline } from "react-icons/io5";
import { FaClock, FaDroplet, FaTemperatureQuarter } from "react-icons/fa6";
import { MdBattery2Bar } from "react-icons/md";

export const DeviceInfoCard = ({ id }: { id: string }) => {
  const deviceInfoQuery = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDevice(id),
  });

  const device = deviceInfoQuery.data;
  if (deviceInfoQuery.isLoading || !device) {
    return <div className="col-span-2">Loading...</div>;
  }

  return (
    <div className=" bg-secondary  rounded-3xl overflow-hidden p-4 flex flex-col group">
      <h3 className="text-2xl font-semibold text-white flex items-center gap-4">
        <div className=" bg-primary text-black h-12 w-12 rounded-full grid place-content-center text-2xl">
          <IoHardwareChipOutline />
        </div>
        <span>{device?.name}</span>
      </h3>
      <div className="grow overflow-auto mt-4 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <FaClock className="text-white" />
          <span className="font-medium ">Last Seen: </span>
          {dayjs(device.lastSeen).fromNow()}
          <span className="text-xs">
            ({dayjs(device.lastSeen).format("YYYY-MM-DD hh:mm A")})
          </span>
        </div>

        <div className="flex items-center gap-2">
          <FaTemperatureQuarter className="text-white" />
          <span className="font-medium ">Last temperature: </span>
          {device.temperature}°C
        </div>

        <div className="flex items-center gap-2">
          <FaDroplet className="text-white" />
          <span className="font-medium ">Last humidity: </span>
          {device.humidity}%
        </div>

        <div className="flex items-center gap-2">
          <MdBattery2Bar className="text-white" />
          <span className="font-medium ">Battery: </span>
          {device.battery}%
        </div>
      </div>
    </div>
  );
};
