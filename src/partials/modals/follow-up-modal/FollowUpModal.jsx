import React, { useState, useEffect } from "react";
import { Modal, Input, Select, DatePicker } from "antd";
import dayjs from "dayjs";

const { TextArea } = Input;
const { Option } = Select;

const FollowUpModal = ({
  isOpen,
  onClose,
  onSave,
  clientName,
  leadData,
  viewOnlyFollowUp = null,
  existingFollowUps = [], // ✅ Pass existing follow-ups to display
}) => {
  const [followUpData, setFollowUpData] = useState({
    followUpType: "",
    followUpStatus: "Open",
    followUpDate: "",
    followUpTime: "",
    clientRemarks: "",
    employeeRemarks: "",
  });

  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    if (viewOnlyFollowUp) {
      setFollowUpData({
        followUpType: viewOnlyFollowUp.followUpType || "",
        followUpStatus: viewOnlyFollowUp.followUpStatus || "Open",
        followUpDate: viewOnlyFollowUp.followUpDate || "",
        followUpTime: viewOnlyFollowUp.followUpTime || "",
        clientRemarks: viewOnlyFollowUp.clientRemarks || "",
        employeeRemarks: viewOnlyFollowUp.employeeRemarks || "",
      });
    } else {
      setFollowUpData({
        followUpType: "",
        followUpStatus: "Open",
        followUpDate: "",
        followUpTime: "",
        clientRemarks: "",
        employeeRemarks: "",
      });
    }
  }, [viewOnlyFollowUp, isOpen]);

  const handleSubmit = () => {
    if (!followUpData.followUpType) {
      alert("Please select follow-up type");
      return;
    }
    if (!followUpData.followUpDate) {
      alert("Please select follow-up date");
      return;
    }

    const dateTime = followUpData.followUpTime
      ? `${followUpData.followUpDate} ${followUpData.followUpTime}`
      : followUpData.followUpDate;

    onSave({
      ...followUpData,
      followUpDate: dateTime,
    });

    // Reset form
    setFollowUpData({
      followUpType: "",
      followUpStatus: "Open",
      followUpDate: "",
      followUpTime: "",
      clientRemarks: "",
      employeeRemarks: "",
    });
    setShowAddForm(false);
  };

  const handleClose = () => {
    setFollowUpData({
      followUpType: "",
      followUpStatus: "Open",
      followUpDate: "",
      followUpTime: "",
      clientRemarks: "",
      employeeRemarks: "",
    });
    setShowAddForm(false);
    onClose(false);
  };

  const handleDelete = (index) => {
    // You can implement delete functionality here
    console.log("Delete follow-up at index:", index);
  };

  const isViewMode = !!viewOnlyFollowUp;

  return (
    <Modal
      title={
        <div className="text-lg font-semibold text-gray-900">Follow Up</div>
      }
      open={isOpen}
      onCancel={handleClose}
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
              placeholder="Search invoice"
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
              onClick={() => setShowAddForm(!showAddForm)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center gap-2 hover:bg-blue-700 text-sm font-medium"
            >
              <i className="ki-filled ki-plus"></i> Add Follow Up
            </button>
          </div>
        </div>

        {/* Add Follow-Up Form */}
        {showAddForm && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">
              Add New Follow Up
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Follow Up Type */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follow Up Type <span className="text-red-500">*</span>
                </label>
                <Select
                  placeholder="-- Select Type --"
                  value={followUpData.followUpType || undefined}
                  onChange={(value) =>
                    setFollowUpData({ ...followUpData, followUpType: value })
                  }
                  className="w-full"
                >
                  <Option value="Call">Call</Option>
                  <Option value="Email">Email</Option>
                  <Option value="Meeting">Meeting</Option>
                  <Option value="WhatsApp">WhatsApp</Option>
                  <Option value="Site Visit">Site Visit</Option>
                </Select>
              </div>

              {/* Follow Up Status */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <Select
                  value={followUpData.followUpStatus}
                  onChange={(value) =>
                    setFollowUpData({ ...followUpData, followUpStatus: value })
                  }
                  className="w-full"
                >
                  <Option value="Open">Open</Option>
                  <Option value="Pending">Pending</Option>
                  <Option value="Closed">Closed</Option>
                </Select>
              </div>

              {/* Follow Up Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  value={
                    followUpData.followUpDate
                      ? dayjs(followUpData.followUpDate)
                      : null
                  }
                  onChange={(date, dateString) =>
                    setFollowUpData({
                      ...followUpData,
                      followUpDate: dateString,
                    })
                  }
                  format="DD/MM/YYYY"
                  className="w-full"
                  placeholder="Select date"
                />
              </div>

              {/* Follow Up Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Time
                </label>
                <Input
                  type="time"
                  value={followUpData.followUpTime}
                  onChange={(e) =>
                    setFollowUpData({
                      ...followUpData,
                      followUpTime: e.target.value,
                    })
                  }
                  placeholder="Select time"
                />
              </div>

              {/* Client Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Client Remarks
                </label>
                <TextArea
                  rows={2}
                  placeholder="What did the client say?"
                  value={followUpData.clientRemarks}
                  onChange={(e) =>
                    setFollowUpData({
                      ...followUpData,
                      clientRemarks: e.target.value,
                    })
                  }
                />
              </div>

              {/* Employee Remarks */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Employee Remarks
                </label>
                <TextArea
                  rows={2}
                  placeholder="Your notes..."
                  value={followUpData.employeeRemarks}
                  onChange={(e) =>
                    setFollowUpData({
                      ...followUpData,
                      employeeRemarks: e.target.value,
                    })
                  }
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md text-sm font-medium hover:bg-blue-700"
              >
                Save Follow Up
              </button>
            </div>
          </div>
        )}

        {/* Follow-Up List */}
        <div className="space-y-3 max-h-[400px] overflow-y-auto">
          {existingFollowUps && existingFollowUps.length > 0 ? (
            existingFollowUps.map((item, index) => (
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
                        <span>{clientName || "N/A"}</span>
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
                            // View follow-up details
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
  );
};

export default FollowUpModal;
