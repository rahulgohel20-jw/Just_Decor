import { useState } from "react";

import { CustomModal } from "@/components/custom-modal/CustomModal";

const AddFollowUp = ({ isModalOpen, setIsModalOpen }) => {
  const [followUpType, setFollowUpType] = useState("Call");
  const [isReminderEnabled, setIsReminderEnabled] = useState(false);
  const [reminders, setReminders] = useState([{ time: "", type: "Call" }]);

  const handleFollowUpTypeChange = (type) => {
    setFollowUpType(type);
  };

  const handleReminderToggle = () => {
    setIsReminderEnabled(!isReminderEnabled);
  };

  const handleAddReminder = () => {
    setReminders([...reminders, { time: "", type: "Call" }]);
  };

  const handleRemoveReminder = (index) => {
    if (reminders.length > 1) {
      setReminders(reminders.filter((_, i) => i !== index));
    }
  };

  const handleReminderChange = (index, field, value) => {
    const updatedReminders = [...reminders];
    updatedReminders[index][field] = value;
    setReminders(updatedReminders);
  };

  const handleAddFollowUp = () => {
    alert("Follow-up added successfully!");
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const [activeTab, setActiveTab] = useState("tab_1");

  const renderTabContent = () => {
    switch (activeTab) {
      case "tab_1":
        return (
          <div className="flex flex-col gap-y-3">
            <style>
              {`
                .bg-theme-red { background-color: #B81C2C; }
                .text-theme-red { color: #B81C2C; }
                .hover\\:bg-theme-red-dark:hover { background-color: #9A1724; }
                .hover\\:text-theme-red-dark:hover { color: #9A1724; }
                .focus\\:ring-theme-red { --tw-ring-color: #B81C2C; }
              `}
            </style>        
            <div className="flex flex-col">
              <select className="select pe-7.5">
                <option value="0">Select customer</option>
                <option value="1">Customer 1</option>
                <option value="2">Customer 2</option>
              </select>
            </div>
            <div className="flex flex-col">
              <textarea
                rows={4}
                className="textarea h-full"
                placeholder="Follow-up Description"
              />
            </div>
            <div className="flex items-center justify-between mt-2">
              <label className="form-label mb-0">
                Follow-up Type
              </label>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleFollowUpTypeChange("Call")}
                  className={`btn btn-md rounded-full ${
                    followUpType === "Call"
                      ? "bg-success text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-success hover:text-white transition-colors duration-200 flex items-center space-x-2`}
                  title="Call"
                >
                  {followUpType === "Call" && (
                    <i className="ki-filled ki-check me-1"></i>
                  )}
                  Call
                </button>
                <button
                  onClick={() => handleFollowUpTypeChange("WhatsApp")}
                  className={`btn btn-md rounded-full ${
                    followUpType === "WhatsApp"
                      ? "bg-success text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-success hover:text-white transition-colors duration-200 flex items-center space-x-2`}
                  title="WhatsApp"
                >
                  {followUpType === "WhatsApp" && (
                    <i className="ki-filled ki-check me-1"></i>
                  )}
                  WhatsApp
                </button>
                <button
                  onClick={() => handleFollowUpTypeChange("Email")}
                  className={`btn btn-md rounded-full ${
                    followUpType === "Email"
                      ? "bg-success text-white"
                      : "bg-gray-200 text-gray-700"
                  } hover:bg-success hover:text-white transition-colors duration-200 flex items-center space-x-2`}
                  title="Email"
                >
                  {followUpType === "Email" && (
                    <i className="ki-filled ki-check me-1"></i>
                  )}
                  Email
                </button>
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label">Followup Date</label>
              <div className="input">
                <i className="ki-filled ki-calendar"></i>
                <input
                  type="date"
                  className="h-full"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-3 mb-2">
                <div className="input">
                  <i className="ki-filled ki-time"></i>
                  <label className="form-label text-gray-600">Add Followup Reminders</label>
                </div>
                <div className="flex">
                  <button className="btn btn-success w-10 p-0 inline-flex items-center justify-center rounded-full" title="Add Reminder" onClick={handleAddReminder}>
                    <i className="ki-filled ki-plus"></i>
                  </button>
                </div>
              </div>     
              <div className="flex flex-col max-h-80 overflow-auto">
                {reminders.map((reminder, index) => (         
                  <div className="flex flex-col gap-y-2 mb-2 " key={index}>
                    <div className="flex items-end gap-3">
                      <div className="w-full flex flex-col">
                        <label className="form-label">Reminder Follow-up Type</label>
                          <select
                            className="select pe-7.5"
                            value={reminder.type}
                              onChange={(e) =>
                                handleReminderChange(
                                  index,
                                  "type",
                                  e.target.value
                                )
                              }
                          >
                            <option value="Call">Call</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                          </select>
                      </div>
                      <div className="w-full flex flex-col">
                        <label className="form-label">Reminder Time</label>
                        <div className="input">
                          <i className="ki-filled ki-time"></i>
                          <input
                            className="h-full"
                            type="time"
                            value={reminder.time}
                              onChange={(e) =>
                                handleReminderChange(
                                  index,
                                  "time",
                                  e.target.value
                                )
                              }
                          />
                        </div>
                      </div>
                      {reminders.length > 1 && (
                        <div className="flex">
                          <button 
                            className="btn btn-danger w-10 p-0 inline-flex items-center justify-center rounded-full" 
                            title="Remove Reminder"
                            onClick={() => handleRemoveReminder(index)}
                            >
                            <i className="ki-filled ki-cross"></i>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <h4 className="text-center bg-amber-100 text-amber-600 p-4">Please remove below and please set proper dynamic above UI</h4>


            <div className="space-y-4">
              <div>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={handleReminderToggle}
                >
                  <svg
                    className="w-5 h-5 text-gray-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    ></path>
                  </svg>
                  <span className="text-gray-700">Add Followup Reminders</span>
                </div>
                {isReminderEnabled && (
                  <div className="mt-2 space-y-3 pl-7">
                    {reminders.map((reminder, index) => (
                      <div key={index} className="flex space-x-2 items-end">
                        {/* Reminder Time */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reminder Time
                          </label>
                          <input
                            type="time"
                            value={reminder.time}
                            onChange={(e) =>
                              handleReminderChange(
                                index,
                                "time",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-red"
                          />
                        </div>
                        {/* Reminder Follow-up Type */}
                        <div className="flex-1">
                          <label className="block text-sm font-medium text-gray-700 mb-1">
                            Reminder Follow-up Type
                          </label>
                          <select
                            value={reminder.type}
                            onChange={(e) =>
                              handleReminderChange(
                                index,
                                "type",
                                e.target.value
                              )
                            }
                            className="w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-red"
                          >
                            <option value="Call">Call</option>
                            <option value="WhatsApp">WhatsApp</option>
                            <option value="Email">Email</option>
                          </select>
                        </div>
                        {/* Remove Reminder Button */}
                        {reminders.length > 1 && (
                          <button
                            onClick={() => handleRemoveReminder(index)}
                            className="p-2 text-theme-red hover:text-theme-red-dark"
                          >
                            <svg
                              className="w-5 h-5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              ></path>
                            </svg>
                          </button>
                        )}
                      </div>
                    ))}
                    {/* Add Reminder Button */}
                    <button
                      onClick={handleAddReminder}
                      className="mt-2 flex items-center space-x-1 text-theme-red hover:text-theme-red-dark"
                    >
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        ></path>
                      </svg>
                      <span>Add Another Reminder</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Follow Up"
        className="max-w-[400px]"
        footer={[
            <button
              key="cancel"
              className="btn btn-secondary"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>,
          <button
            key="add"
            className="btn btn btn-primary w-50 "
            title="Save Follow Up"
          >
            Save Follow Up
          </button>,
        ]}
      >
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddFollowUp;
