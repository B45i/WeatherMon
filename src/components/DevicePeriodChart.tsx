import { useMemo } from "react";
import { TimePeriod } from "../types";
import ReactECharts from "echarts-for-react";
import { getDeviceTimeSeriesData } from "../services/device.service";
import { useQuery } from "@tanstack/react-query";

const DEFAULT_CHART_OPTIONS = {
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      label: {
        backgroundColor: "#6a7985",
      },
    },
  },

  grid: {
    top: "5%",
    left: "5px",
    right: "5px",
    bottom: "1%",
    containLabel: true,
  },
  xAxis: [
    {
      type: "category",
      boundaryGap: false,
      data: [],
    },
  ],
  yAxis: [
    {
      type: "value",
    },
  ],
  series: [],
};

export const DevicePeriodChart = ({
  id,
  period,
  className = "",
}: {
  id: string;
  period: TimePeriod;
  className?: string;
}) => {
  const timeSeriesQuery = useQuery({
    queryKey: ["deviceTimeSeries", id, period],
    queryFn: () => getDeviceTimeSeriesData(id, period),
  });

  const option = useMemo(() => {
    if (!timeSeriesQuery.data) return DEFAULT_CHART_OPTIONS;

    const xAxis: Array<string> = [];
    const temperature: Array<number> = [];
    const humidity: Array<number> = [];
    const battery: Array<number> = [];

    timeSeriesQuery.data?.forEach((data) => {
      xAxis.push(data.timestamp?.toLocaleString());
      temperature.push(data.temperature);
      humidity.push(data.humidity);
      battery.push(data.battery);
    });

    return {
      ...DEFAULT_CHART_OPTIONS,
      xAxis: [
        {
          type: "category",
          boundaryGap: false,
          data: xAxis,
        },
      ],
      series: [
        {
          name: "Temperature",
          type: "line",
          stack: "Total",
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: temperature,
        },
        {
          name: "Humidity",
          type: "line",
          stack: "Total",
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: humidity,
        },
        {
          name: "Battery",
          type: "line",
          stack: "Total",
          smooth: true,
          areaStyle: {},
          emphasis: {
            focus: "series",
          },
          data: battery,
        },
      ],
    };
  }, [timeSeriesQuery.data]);

  return (
    <div
      className={`bg-background-light p-4 rounded-3xl flex flex-col ${className}`}
    >
      <div className="text-xl text-white mb-1">Device Over Time</div>

      <div className="grow">
        <ReactECharts theme="chalk" className="!h-full" option={option} />
      </div>
    </div>
  );
};
