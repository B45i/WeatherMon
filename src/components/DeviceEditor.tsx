import { Form, Input, Modal } from "antd";
import { useState } from "react";
import { addSensorNode } from "../services/  sensor-node.service";

export const DeviceEditor = ({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) => {
  const isEdit = false;
  const [loading, setLoading] = useState(false);

  const handleOk = () => {};
  const [form] = Form.useForm();

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);
      await addSensorNode(values);
      onClose();
    } catch (error) {
      console.log(error); // add toast.
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      title={isEdit ? "Edit Device" : "Add Device"}
      open={isOpen}
      onOk={handleSubmit}
      onCancel={onClose}
      okButtonProps={{ loading }}
      okText="Save"
    >
      <Form form={form} layout="vertical" onFinish={handleOk}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter device name!" }]}
        >
          <Input placeholder="Enter name" />
        </Form.Item>
        {/* <Form.Item
          label="Location"
          name="location"
          rules={[{ required: true, message: "Please select your location!" }]}
        >
          <Select placeholder="Select your location">
            <Select.Option value="location1">Location 1</Select.Option>
            <Select.Option value="location2">Location 2</Select.Option>
            <Select.Option value="location3">Location 3</Select.Option>
          </Select>
        </Form.Item> */}
      </Form>
    </Modal>
  );
};
