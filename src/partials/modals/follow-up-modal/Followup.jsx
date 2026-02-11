import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";
import AddFollowUpModal from "../add-followup-lead/FollowUpModal"; // ✅ CHANGE THIS LINE

const { TextArea } = Input;
const { Option } = Select;

const FollowUp = ({
  isOpen,
  onClose,
  onSave,
  clientName,
  leadData,
  viewOnlyFollowUp = null,
  existingFollowUps = [],
  onRefresh,
}) => {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [localFollowUps, setLocalFollowUps] = useState(existingFollowUps);

  const handleDelete = (index) => {
    console.log("Delete follow-up at index:", index);
  };

  const isViewMode = !!viewOnlyFollowUp;

  // ✅ Add logging to debug
  useEffect(() => {
    console.log(
      "📥 FollowUp Modal - existingFollowUps changed:",
      existingFollowUps,
    );
    setLocalFollowUps(existingFollowUps);
  }, [existingFollowUps]);

  // ✅ Add logging
  useEffect(() => {
    console.log("📊 FollowUp Modal - localFollowUps updated:", localFollowUps);
  }, [localFollowUps]);

  const handleSaveFromAddModal = async (followUpData) => {
    console.log("💾 Follow-up from add modal:", followUpData);

    // Call the parent's onSave (which will call the API)
    await onSave(followUpData);

    // Close add modal
    setIsAddModalOpen(false);

    // Refresh
    console.log("🔄 Calling onRefresh from modal...");
    if (onRefresh) {
      await onRefresh();
    }

    console.log("✅ Modal save complete");
  };

  return (
    <>
      <Modal
        title={
          <div className="text-lg font-semibold text-gray-900">Follow Up</div>
        }
        open={isOpen}
        onCancel={onClose}
        footer={null}
        width={900}
        destroyOnClose
      >
        <div className="space-y-4 pt-4">
          {/* Filter Section */}
          <div className="flex flex-wrap gap-3 items-center mb-6">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search follow-ups"
                type="text"
              />
            </div>

            <div className="filItems relative">
              <select className="select pe-7.5">
                <option value="">Created At</option>
                <option value="1">Today</option>
                <option value="2">Next 1 Month</option>
                <option value="3">Custom Date</option>
              </select>
            </div>

            <div className="filItems relative">
              <select className="select pe-7.5">
                <option value="">Get Lead</option>
                <option value="1">Today</option>
                <option value="2">Next 1 Month</option>
                <option value="3">Custom Date</option>
              </select>
            </div>

            <div className="flex gap-3 ml-auto">
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"
              >
                <i className="ki-filled ki-plus"></i> Add Follow Up
              </button>
            </div>
          </div>

          {/* Follow-Up List */}
          <div className="space-y-3 max-h-[400px] overflow-y-auto">
            {/* ✅ Add debug info */}
            {console.log(
              "🎨 Rendering list with localFollowUps:",
              localFollowUps,
            )}

            {localFollowUps && localFollowUps.length > 0 ? (
              localFollowUps.map((item, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="w-12 h-12 rounded-full bg-blue-500 text-white flex items-center justify-center font-semibold text-lg flex-shrink-0">
                      {clientName?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-gray-900 text-base">
                            {clientName || "N/A"}
                          </h3>
                        </div>

                        <div className="text-right ml-4">
                          <div className="flex items-center gap-1 text-sm">
                            <span className="text-gray-500">Type:</span>
                            <span className="text-gray-900 font-medium">
                              {item.followUpType || "N/A"}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-sm mt-1">
                            <span className="text-gray-500">Reminder:</span>
                            <span className="text-gray-900 font-medium">
                              {item.followUpDate || "N/A"}
                            </span>
                          </div>
                        </div>

                        {/* Status Dropdown */}
                        <Select
                          value={item.followUpStatus}
                          className="w-[120px]"
                          size="small"
                          disabled={isViewMode}
                        >
                          <Option value="Open">
                            <span className="text-green-600 font-medium">
                              Open
                            </span>
                          </Option>
                          <Option value="Pending">
                            <span className="text-yellow-600 font-medium">
                              Pending
                            </span>
                          </Option>
                          <Option value="Closed">
                            <span className="text-red-600 font-medium">
                              Closed
                            </span>
                          </Option>
                        </Select>
                      </div>

                      <hr className="my-3 border-gray-200" />

                      {/* Contact Info */}
                      <div className="flex items-center gap-6 text-sm text-gray-600 flex-wrap">
                        <div className="flex items-center gap-2">
                          <i className="ki-filled ki-user text-gray-400"></i>
                          <span> {item.clientRemarks}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <i className="ki-filled ki-sms text-gray-400"></i>
                          <span>{leadData?.emailId || "No Email"}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <i className="ki-filled ki-phone text-gray-400"></i>
                          <span>{leadData?.contactNumber || "No Contact"}</span>
                        </div>

                        {/* Action Buttons */}
                        <div className="ml-auto flex items-center gap-2">
                          <button
                            onClick={() => {
                              console.log("View:", item);
                            }}
                            className="text-gray-400 hover:text-blue-600 p-1.5 rounded hover:bg-blue-50"
                          >
                            <i className="ki-filled ki-eye text-lg"></i>
                          </button>

                          <button
                            onClick={() => handleDelete(index)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded hover:bg-red-50"
                          >
                            <i className="ki-filled ki-trash text-lg"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                <i className="ki-filled ki-calendar-remove text-6xl mb-3 text-gray-300"></i>
                <p className="text-sm">No Follow-Up Found</p>
              </div>
            )}
          </div>
        </div>
      </Modal>

      {/* ✅ CHANGE: Use AddFollowUpModal instead of FollowUpModal */}
      {isAddModalOpen && (
        <AddFollowUpModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSave={handleSaveFromAddModal}
          clientName={clientName}
          viewOnlyFollowUp={null}
        />
      )}
    </>
  );
};

export default FollowUp;
