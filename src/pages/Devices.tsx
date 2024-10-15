import { FloatButton } from "antd";
import { useState } from "react";
import { DeviceEditor } from "../components/DeviceEditor";
import { getDevices } from "../services/  sensor-node.service";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";

import { DeviceCard } from "../components/DeviceCard";

export const Devices = () => {
  const [showEditor, setShowEditor] = useState(false);

  const deviceQuery = useQuery({
    queryKey: ["devices"],
    queryFn: getDevices,
  });

  console.log(deviceQuery.data);

  const handleClose = () => {
    setShowEditor(false);
    deviceQuery.refetch();
  };

  return (
    <div className="grow w-full flex flex-col h-full relative">
      {deviceQuery.isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grow auto-rows-min grid grid-cols-[repeat(auto-fill,minmax(22rem,1fr))] gap-4">
          {deviceQuery.data?.map((device: any) => (
            <DeviceCard device={device} key={device.id} />
          ))}
        </div>
      )}

      <FloatButton
        type="primary"
        icon={<FaPlus />}
        onClick={() => setShowEditor(true)}
      />

      <DeviceEditor isOpen={showEditor} onClose={handleClose} />
    </div>
  );
};
