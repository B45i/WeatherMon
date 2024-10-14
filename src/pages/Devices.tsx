import { FloatButton, Table } from "antd";
import { useState } from "react";
import { DeviceEditor } from "../components/DeviceEditor";
import { getDevices } from "../services/  sensor-node.service";
import { useQuery } from "@tanstack/react-query";
import { FaPlus } from "react-icons/fa6";

const columns = [
  {
    title: "Name",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "API Key",
    dataIndex: "apiKey",
  },
  {
    title: "Created At",
    dataIndex: "createdAt",
    render: (value: any) => value?.toLocaleString(),
  },
];

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
      <FloatButton
        type="primary"
        icon={<FaPlus />}
        onClick={() => setShowEditor(true)}
      />
      <Table
        className="grow border border-black rounded-xl"
        dataSource={deviceQuery.data}
        columns={columns}
        loading={deviceQuery.isLoading}
        pagination={false}
      />

      <DeviceEditor isOpen={showEditor} onClose={handleClose} />
    </div>
  );
};
