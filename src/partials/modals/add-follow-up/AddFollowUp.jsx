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
          <div className="max-w-md mx-auto   ">
            <style>
              {`
          .bg-theme-red { background-color: #B81C2C; }
          .text-theme-red { color: #B81C2C; }
          .hover\\:bg-theme-red-dark:hover { background-color: #9A1724; }
          .hover\\:text-theme-red-dark:hover { color: #9A1724; }
          .focus\\:ring-theme-red { --tw-ring-color: #B81C2C; }
        `}
            </style>

            <div className="space-y-4">
              {/* Customer Selection */}
              <div>
                <select className="w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-red">
                  <option>Please select customer</option>
                  <option>Customer 1</option>
                  <option>Customer 2</option>
                </select>
              </div>

              {/* Follow-up Description */}
              <div>
                <textarea
                  className="w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-red"
                  rows="3"
                  placeholder="Follow-up Description"
                ></textarea>
              </div>

              {/* Follow-up Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow-up Type
                </label>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleFollowUpTypeChange("Call")}
                    className={`px-4 py-2 rounded-md ${
                      followUpType === "Call"
                        ? "bg-theme-red text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-theme-red-dark transition-colors duration-200 flex items-center space-x-2`}
                  >
                    {followUpType === "Call" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                    <span>Call</span>
                  </button>
                  <button
                    onClick={() => handleFollowUpTypeChange("WhatsApp")}
                    className={`px-4 py-2 rounded-md ${
                      followUpType === "WhatsApp"
                        ? "bg-theme-red text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-theme-red-dark transition-colors duration-200 flex items-center space-x-2`}
                  >
                    {followUpType === "WhatsApp" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                    <span>WhatsApp</span>
                  </button>
                  <button
                    onClick={() => handleFollowUpTypeChange("Email")}
                    className={`px-4 py-2 rounded-md ${
                      followUpType === "Email"
                        ? "bg-theme-red text-white"
                        : "bg-gray-200 text-gray-700"
                    } hover:bg-theme-red-dark transition-colors duration-200 flex items-center space-x-2`}
                  >
                    {followUpType === "Email" && (
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        ></path>
                      </svg>
                    )}
                    <span>Email</span>
                  </button>
                </div>
              </div>

              {/* Follow-up Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Followup Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    className="w-full p-2 border rounded-md bg-gray-50 text-gray-700 focus:outline-none focus:ring-2 focus:ring-theme-red"
                  />
                </div>
              </div>

              {/* Add Follow-up Reminder */}
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

            {/* Add Follow-up Button */}
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
        footer={[
          <button
            key="add"
            className="btn btn btn-primary w-50 "
            title="Save Follow Up"
          >
            Add Follow Up
          </button>,
        ]}
      >
        {renderTabContent()}
      </CustomModal>
    )
  );
};
export default AddFollowUp;
