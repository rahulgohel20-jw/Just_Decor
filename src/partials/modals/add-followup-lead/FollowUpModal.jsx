import React, { useState } from "react";
import { Modal, Select, Input, DatePicker, TimePicker, Button } from "antd";

export default function FollowUpModal({ isOpen, onClose, onSave }) {
  const [followType, setFollowType] = useState("Call");
  const [reminders, setReminders] = useState([{ type: "Call", time: null }]);

  const addReminder = () => {
    setReminders([...reminders, { type: "Call", time: null }]);
  };

  const updateReminder = (index, field, value) => {
    const updated = [...reminders];
    updated[index][field] = value;
    setReminders(updated);
  };

  return (
    <Modal
      title={<span className="text-lg font-semibold">Add Follow Up</span>}
      open={isOpen}
      onCancel={() => onClose(false)}
      footer={null}
      centered
      width={700}
    >
      <div className="space-y-5 p-2">
        {/* Customer Select */}
        <Select placeholder="Select customer" className="w-full" size="large" />

        {/* Follow Up Description */}
        <Input.TextArea rows={4} placeholder="Follow Up Description" />

        {/* Follow Up Type Buttons */}
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

        {/* Followup Date */}
        <div>
          <p className="text-gray-700 mb-2">Followup Date</p>
          <DatePicker
            className="w-full h-11"
            placeholder="mm/dd/yyyy"
            size="large"
          />
        </div>

     

        {/* Footer Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button onClick={() => onClose(false)}>Cancel</Button>

          <Button type="primary" onClick={() => onSave()}>
            Save
          </Button>
        </div>
      </div>
    </Modal>
  );
}
