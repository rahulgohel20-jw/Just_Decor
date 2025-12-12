import React, { useState, useEffect } from "react";
import { Modal, Select, Input, DatePicker, Button } from "antd";
import dayjs from "dayjs";

export default function FollowUpModal({ isOpen, onClose, onSave, clientName }) {
  const [customerName, setCustomerName] = useState("");
  const [description, setDescription] = useState("");
  const [followType, setFollowType] = useState("Call");
  const [followupDate, setFollowupDate] = useState(null);

  // Set customerName whenever modal opens or clientName changes
  useEffect(() => {
    if (clientName) {
      setCustomerName(clientName);
    }
  }, [clientName, isOpen]);

  const handleSave = () => {
    if (!customerName || !followupDate) {
      alert("Customer Name and Followup Date are required");
      return;
    }

    onSave({
      customerName,
      description,
      followType,
      followupDate: dayjs(followupDate).format("DD/MM/YYYY hh:mm A"),
    });

    // Reset modal state
    setCustomerName("");
    setDescription("");
    setFollowType("Call");
    setFollowupDate(null);

    onClose(false);
  };

  return (
    <Modal
      title="Add Follow Up"
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      centered
      width={700}
    >
      <div className="space-y-5 p-2">
        <div className="flex flex-col">
          <label className="form-label mb-1">Customer Name</label>
          <Input
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />
        </div>

        <Input.TextArea
          rows={4}
          placeholder="Follow Up Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <div>
          <p className="text-gray-700 mb-2">Follow Up Type</p>
          <div className="grid grid-cols-3 gap-3">
            {["Call", "WhatsApp", "Email"].map((type) => (
              <button
                key={type}
                onClick={() => setFollowType(type)}
                className={`py-2 rounded-lg text-sm border transition ${
                  followType === type
                    ? "bg-green-500 text-white border-green-500"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-gray-700 mb-2">Followup Date</p>
          <DatePicker
            className="w-full h-11"
            showTime={{ format: "hh:mm A" }}
            format="DD/MM/YYYY hh:mm A"
            placeholder="Select date & time"
            value={followupDate}
            onChange={setFollowupDate}
          />
        </div>

        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
