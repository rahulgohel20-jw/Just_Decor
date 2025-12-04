import { useState, useEffect } from "react";
import { Drawer, Input, Select, Button, Table, message } from "antd";
import { DeleteOutlined, PlusOutlined } from "@ant-design/icons";

const SidebarInsideModal = ({
  open,
  onClose,
  eventId,
  eventFunctionId,
  row,
  functionName,
  functionDateTime,
  onSave,
}) => {
  const [allocations, setAllocations] = useState([]);

  useEffect(() => {
    if (open && row) {
      // Load existing inside allocations if any
      const existingInsideAllocations =
        row.eventFunctionMenuAllocations?.filter((a) => a.isInside) || [];

      if (existingInsideAllocations.length > 0) {
        setAllocations(existingInsideAllocations);
      } else {
        // Initialize with one empty row
        setAllocations([
          {
            id: 0,
            serviceType: "",
            partyId: 0,
            quantity: 0,
            unitId: 0,
            price: 0,
            helperQuantity: 0,
            helperPrice: 0,
            counterQuantity: 0,
            counterPrice: 0,
            totalPrice: 0,
            isInside: true,
          },
        ]);
      }
    }
  }, [open, row]);

  const handleAddRow = () => {
    setAllocations([
      ...allocations,
      {
        id: 0,
        serviceType: "",
        partyId: 0,
        quantity: 0,
        unitId: 0,
        price: 0,
        helperQuantity: 0,
        helperPrice: 0,
        counterQuantity: 0,
        counterPrice: 0,
        totalPrice: 0,
        isInside: true,
      },
    ]);
  };

  const handleDeleteRow = (index) => {
    const updated = allocations.filter((_, i) => i !== index);
    setAllocations(updated);
  };

  const handleFieldChange = (index, field, value) => {
    const updated = [...allocations];
    updated[index][field] = value;

    // Recalculate total price
    const item = updated[index];
    const mainTotal = (item.quantity || 0) * (item.price || 0);
    const helperTotal = (item.helperQuantity || 0) * (item.helperPrice || 0);
    const counterTotal = (item.counterQuantity || 0) * (item.counterPrice || 0);
    updated[index].totalPrice = mainTotal + helperTotal + counterTotal;

    setAllocations(updated);
  };

  const handleSave = () => {
    if (!row?.menuItemId || !row?.menuCategoryId) {
      message.error("Missing menu item information");
      return;
    }

    const saveData = {
      menuItemId: row.menuItemId,
      menuCategoryId: row.menuCategoryId,
      allocations: allocations,
      eventId: eventId,
      eventFunctionId: eventFunctionId,
    };

    onSave(saveData);
    message.success("Inside details saved successfully");
  };

  const columns = [
    {
      title: "Service Type",
      dataIndex: "serviceType",
      key: "serviceType",
      width: 150,
      render: (text, record, index) => (
        <Input
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "serviceType", e.target.value)
          }
          placeholder="Enter service type"
        />
      ),
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "quantity", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "price", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Helper Qty",
      dataIndex: "helperQuantity",
      key: "helperQuantity",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "helperQuantity", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Helper Price",
      dataIndex: "helperPrice",
      key: "helperPrice",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "helperPrice", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Counter Qty",
      dataIndex: "counterQuantity",
      key: "counterQuantity",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "counterQuantity", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Counter Price",
      dataIndex: "counterPrice",
      key: "counterPrice",
      width: 100,
      render: (text, record, index) => (
        <Input
          type="number"
          value={text}
          onChange={(e) =>
            handleFieldChange(index, "counterPrice", Number(e.target.value))
          }
          min={0}
        />
      ),
    },
    {
      title: "Total",
      dataIndex: "totalPrice",
      key: "totalPrice",
      width: 100,
      render: (text) => (
        <span className="font-semibold">₹{text.toFixed(2)}</span>
      ),
    },
    {
      title: "Action",
      key: "action",
      width: 80,
      render: (_, record, index) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleDeleteRow(index)}
          disabled={allocations.length === 1}
        />
      ),
    },
  ];

  return (
    <Drawer
      title={
        <div className="flex flex-col">
          <span className="text-lg font-semibold">Inside Details</span>
          <span className="text-sm text-gray-500">
            {row?.itemName} - {row?.categoryName}
          </span>
        </div>
      }
      placement="right"
      width={1200}
      onClose={onClose}
      open={open}
      footer={
        <div className="flex justify-between items-center">
          <Button onClick={onClose}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save Inside Details
          </Button>
        </div>
      }
    >
      <div className="space-y-4">
        {/* Function Info */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <span className="text-xs text-gray-600">Function Name:</span>
              <div className="font-medium">{functionName || "-"}</div>
            </div>
            <div>
              <span className="text-xs text-gray-600">Date & Time:</span>
              <div className="font-medium">{functionDateTime || "-"}</div>
            </div>
          </div>
        </div>

        {/* Add Row Button */}
        <div className="flex justify-end">
          <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddRow}>
            Add Row
          </Button>
        </div>

        {/* Allocations Table */}
        <Table
          columns={columns}
          dataSource={allocations}
          pagination={false}
          rowKey={(record, index) => index}
          scroll={{ x: 1000 }}
        />

        {/* Grand Total */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <div className="flex justify-end items-center gap-2">
            <span className="text-lg font-semibold">Grand Total:</span>
            <span className="text-xl font-bold text-primary">
              ₹
              {allocations
                .reduce((sum, item) => sum + (item.totalPrice || 0), 0)
                .toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </Drawer>
  );
};

export default SidebarInsideModal;
