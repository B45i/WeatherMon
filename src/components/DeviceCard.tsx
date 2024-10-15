import { FaDroplet, FaMicrochip, FaTemperatureQuarter } from "react-icons/fa6";
import { Device } from "../types";
import { GoLinkExternal } from "react-icons/go";
import dayjs from "dayjs";
import { Tooltip } from "antd";
import { MdBattery2Bar } from "react-icons/md";

export const DeviceCard = ({ device }: { device: Device }) => {
  return (
    <div className="rounded-3xl overflow-hidden bg-background h-[200px] text-white p-4 flex flex-col group cursor-pointer hover:scale-105 transition-all">
      <div className="flex items-center gap-4 text-lg">
        <div className="border border-background-lighter h-12 w-12 rounded-full grid place-content-center text-2xl">
          <FaMicrochip />
        </div>
        <div
          title={device.name}
          className="grow truncate text-gray-200 font-semibold"
        >
          {device.name}
        </div>
        <div className="bg-white h-12 w-12 rounded-full grid place-content-center text-xl transition-all text-background group-hover:bg-primary">
          <GoLinkExternal />
        </div>
      </div>
      <div className="grow flex items-center text-xl gap-1">
        <div className="grow justify-center flex items-center">
          <FaTemperatureQuarter />
          {device.temperature ?? "N/A"} °C
        </div>
        <div className="grow justify-center flex items-center border-x  border-background-lighter ">
          <FaDroplet />
          {device.humidity ?? "N/A"}%
        </div>
        <div className="grow justify-center text-center flex items-center">
          <MdBattery2Bar />
          {device.battery ?? "N/A"}V
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Last seen:{" "}
        {device.lastSeen ? (
          <Tooltip title={dayjs(device.lastSeen).format("YYYY-MM-DD hh:mm A")}>
            <span className="font-semibold">
              {dayjs(device.lastSeen).fromNow()}{" "}
            </span>
          </Tooltip>
        ) : (
          "Never"
        )}
      </div>
    </div>
  );
};
