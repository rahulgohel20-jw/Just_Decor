import React, { useState } from "react";

const AddTicketModal = ({ isOpen, onClose, onSave, ticketNumber }) => {
  const [formData, setFormData] = useState({
    interaction: "Lead",
    ticketFrom: "Call",
    remarks: "",
    expectedCloseDate: "",
    actualCloseDate: "",
    department: "Employee",
    assignTo: "Tarun",
    status: "In Progress",
    createdBy: "Admin",
    comment: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    onSave(formData);
    // Reset form
    setFormData({
      interaction: "Lead",
      ticketFrom: "Call",
      remarks: "",
      expectedCloseDate: "",
      actualCloseDate: "",
      department: "Employee",
      assignTo: "Tarun",
      status: "In Progress",
      createdBy: "Admin",
      comment: "",
    });
  };

  if (!isOpen) return null;

  const getStatusColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-50 border-yellow-200";
      case "Opened":
        return "bg-blue-50 border-blue-200";
      case "Pending":
        return "bg-orange-50 border-orange-200";
      case "Resolved":
        return "bg-green-50 border-green-200";
      case "Closed":
        return "bg-gray-50 border-gray-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const getStatusDotColor = (status) => {
    switch (status) {
      case "In Progress":
        return "bg-yellow-500";
      case "Opened":
        return "bg-blue-500";
      case "Pending":
        return "bg-orange-500";
      case "Resolved":
        return "bg-green-500";
      case "Closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
            <i className="fas fa-ticket-alt text-blue-600"></i>
            Ticket No: {ticketNumber}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Interaction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interaction <span className="text-red-500">*</span>
              </label>
              <select
                name="interaction"
                value={formData.interaction}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Lead</option>
                <option>Follow-up</option>
                <option>Support</option>
                <option>Complaint</option>
              </select>
            </div>

            {/* Ticket From */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ticket From <span className="text-red-500">*</span>
              </label>
              <select
                name="ticketFrom"
                value={formData.ticketFrom}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Call</option>
                <option>Email</option>
                <option>WhatsApp</option>
                <option>In Person</option>
              </select>
            </div>

            {/* Interaction Remarks */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interaction Remarks <span className="text-red-500">*</span>
              </label>
              <textarea
                name="remarks"
                value={formData.remarks}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Lead"
              />
            </div>

            {/* Expected Close Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Expected close date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="expectedCloseDate"
                value={formData.expectedCloseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Actual Close Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Actual close date <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="actualCloseDate"
                value={formData.actualCloseDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Department */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Department <span className="text-red-500">*</span>
              </label>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Employee</option>
                <option>Sales</option>
                <option>Support</option>
                <option>Management</option>
              </select>
            </div>

            {/* Assign To */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Assign To <span className="text-red-500">*</span>
              </label>
              <select
                name="assignTo"
                value={formData.assignTo}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Tarun</option>
                <option>Rahul</option>
                <option>Priya</option>
                <option>Amit</option>
              </select>
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Status <span className="text-red-500">*</span>
              </label>
              <div
                className={`flex items-center gap-2 px-3 py-2 border rounded-lg ${getStatusColor(formData.status)}`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${getStatusDotColor(formData.status)}`}
                ></div>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="flex-1 bg-transparent border-none focus:ring-0 text-sm font-medium"
                >
                  <option>In Progress</option>
                  <option>Opened</option>
                  <option>Pending</option>
                  <option>Resolved</option>
                  <option>Closed</option>
                </select>
              </div>
            </div>

            {/* Created By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Created By <span className="text-red-500">*</span>
              </label>
              <select
                name="createdBy"
                value={formData.createdBy}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Support</option>
              </select>
            </div>
          </div>

          {/* Ticket Life Cycle */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Ticket Life Cycle <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-blue-600">
                  Opened
                </span>
                <span className="text-xs font-medium text-gray-400">
                  In progress
                </span>
                <span className="text-xs font-medium text-gray-400">
                  Pending
                </span>
                <span className="text-xs font-medium text-gray-400">
                  Resolved
                </span>
                <span className="text-xs font-medium text-gray-400">
                  Closed
                </span>
              </div>
              <div className="relative h-2 bg-gray-200 rounded-full">
                <div
                  className="absolute h-2 bg-blue-600 rounded-full"
                  style={{ width: "40%" }}
                ></div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">
              Comments
            </h3>

            {/* Existing Comment */}
            <div className="bg-gray-50 rounded-lg p-4 mb-3 border border-gray-200">
              <div className="flex gap-3">
                <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium flex-shrink-0">
                  A
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start mb-1">
                    <div>
                      <p className="text-sm font-semibold text-gray-800">
                        Admin
                      </p>
                      <p className="text-xs text-gray-500">asdf(gh)kl</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      28/11/2025, 09:25 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Add Comment */}
            <div className="flex gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 text-sm font-medium flex-shrink-0">
                U
              </div>
              <div className="flex-1">
                <textarea
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Your Comments..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
                <button className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Post Comments
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
              Update
            </button>
            <button
              onClick={handleSubmit}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicketModal;
