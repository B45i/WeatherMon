import { useQuery } from "@tanstack/react-query";
import { TimePeriod } from "../types";
import { maxMinStats } from "../services/device.service";
import dayjs from "dayjs";
import { FaArrowUp } from "react-icons/fa";
import { FaArrowDown } from "react-icons/fa6";

export const DeviceExtremaCard = ({
  deviceId,
  period,
}: {
  deviceId: string;
  period: TimePeriod;
}) => {
  const highestTempQuery = useQuery({
    queryKey: ["maxMinStats", "temperature", "max", period, deviceId],
    queryFn: () => maxMinStats(deviceId!, "temperature", period, "max"),
  });

  const lowestTempQuery = useQuery({
    queryKey: ["maxMinStats", "temperature", "min", period, deviceId],
    queryFn: () => maxMinStats(deviceId!, "temperature", period, "min"),
  });

  const highestHumidityQuery = useQuery({
    queryKey: ["maxMinStats", "humidity", "max", period, deviceId],
    queryFn: () => maxMinStats(deviceId!, "humidity", period, "max"),
  });

  const lowestHumidityQuery = useQuery({
    queryKey: ["maxMinStats", "humidity", "min", period, deviceId],
    queryFn: () => maxMinStats(deviceId!, "humidity", period, "min"),
  });

  console.log("data", highestTempQuery.data, period);

  return (
    <div className="bg-background-darker grow rounded-3xl p-4 flex text-white">
      <div className="grow">
        <div>Temperature</div>
        <div>
          <div className="flex items-center">
            <FaArrowUp className="text-2xl" />
            <span className="text-3xl">
              {highestTempQuery.data?.temperature}
            </span>
            <span className="text-sm">°C</span>
            <span className="text-xs text-gray-500 ml-2">
              (
              {dayjs(highestTempQuery.data?.timestamp).format(
                "YYYY-MM-DD hh:mm A"
              )}
              )
            </span>
          </div>
          <div className="flex items-center">
            <FaArrowDown className="text-2xl" />

            <span className="text-3xl">
              {lowestTempQuery.data?.temperature}
            </span>
            <span className="text-sm">°C</span>
            <span className="text-xs text-gray-500 ml-2">
              (
              {dayjs(lowestTempQuery.data?.timestamp).format(
                "YYYY-MM-DD hh:mm A"
              )}
              )
            </span>
          </div>
        </div>
      </div>
      <div className="grow border-l border-background-lighter pl-4">
        <div>Humidity</div>
        <div>
          <div className="flex items-center">
            <FaArrowUp className="text-2xl" />
            <span className="text-3xl">
              {highestHumidityQuery.data?.humidity}
            </span>
            <span className="text-sm">%</span>
            <span className="text-xs text-gray-500 ml-2">
              (
              {dayjs(highestHumidityQuery.data?.timestamp).format(
                "YYYY-MM-DD hh:mm A"
              )}
              )
            </span>
          </div>
          <div className="flex items-center">
            <FaArrowDown className="text-2xl" />

            <span className="text-3xl">
              {lowestHumidityQuery.data?.humidity}
            </span>
            <span className="text-sm">%</span>
            <span className="text-xs text-gray-500 ml-2">
              (
              {dayjs(lowestHumidityQuery.data?.timestamp).format(
                "YYYY-MM-DD hh:mm A"
              )}
              )
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
