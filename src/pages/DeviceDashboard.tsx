import { useParams } from "react-router-dom";
// import { getDevice, maxMinStats } from "../services/device.service";
import { DeviceInfoCard } from "../components/DeviceInfoCard";
import { Select } from "antd";
import { DeviceExtremaCard } from "../components/DeviceExtremaCard";
import { useState } from "react";
import { TimePeriod } from "../types";
import { DevicePeriodChart } from "../components/DevicePeriodChart";

export const DeviceDashboard = () => {
  const { id } = useParams();
  const [period, setPeriod] = useState<TimePeriod>("today");

  return (
    <div className="grow w-full h-full relative auto-rows-[14rem] grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4">
      <DeviceInfoCard id={id!} />
      <div className="col-span-2 flex flex-col gap-2">
        <div className="flex items-center gap-4">
          <div className="text-background-lighter">Period:</div>
          <Select
            value={period}
            onChange={(val) => setPeriod(val)}
            className="w-full"
          >
            <Select.Option value="today">Today</Select.Option>
            <Select.Option value="lastWeek">Last Week</Select.Option>
            <Select.Option value="lastMonth">Last Month</Select.Option>
            <Select.Option value="lastYear">Last Year</Select.Option>
          </Select>
        </div>

        <DeviceExtremaCard deviceId={id!} period={period} />
      </div>
      <DevicePeriodChart className="col-span-full" id={id!} period={period} />
    </div>
  );
};
