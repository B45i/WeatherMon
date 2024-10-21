import { useQuery } from "@tanstack/react-query";
import React from "react";
import { getDevice } from "../services/device.service";

export const DeviceInfoCard = ({ id }: { id: string }) => {
  const deviceInfoQuery = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDevice(id),
  });

  console.log(deviceInfoQuery.data);

  if (deviceInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>DeviceInfoCard</div>;
};
