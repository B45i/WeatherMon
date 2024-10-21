import { useQuery } from "@tanstack/react-query";

import { getDevice } from "../services/device.service";

export const DeviceInfoCard = ({ id }: { id: string }) => {
  const deviceInfoQuery = useQuery({
    queryKey: ["device", id],
    queryFn: () => getDevice(id),
  });

  if (deviceInfoQuery.isLoading) {
    return <div>Loading...</div>;
  }

  return <div>DeviceInfoCard</div>;
};
