import React from "react";

const AssignLeadModal = ({
  isOpen,
  onClose,
  managers,
  selectedManager,
  setSelectedManager,
  onSave,
  selectedCount,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md mx-4 z-10">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b">
          <h3 className="text-lg font-semibold text-gray-900">
            Assign Leads to Manager
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition"
          >
            <i className="ki-filled ki-cross text-xl"></i>
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-4">
              You are about to assign{" "}
              <span className="font-semibold text-gray-900">
                {selectedCount}
              </span>{" "}
              lead(s) to a Memeber. Please select a Memeber from the dropdown
              below.
            </p>

            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Memeber <span className="text-red-500">*</span>
            </label>
            <select
              value={selectedManager}
              onChange={(e) => setSelectedManager(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="">-- Select Memeber --</option>
              {managers.map((manager) => (
                <option key={manager.value} value={manager.value}>
                  {manager.label}
                </option>
              ))}
            </select>
          </div>

          {selectedManager && (
            <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
              <p className="text-sm text-blue-800">
                <i className="ki-filled ki-information-2 mr-2"></i>
                {selectedCount} lead(s) will be assigned to the selected
                Memeber.
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-5 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition"
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={!selectedManager}
            className={`px-4 py-2 rounded-md transition flex items-center gap-2 ${
              selectedManager
                ? "bg-primary text-white hover:bg-primary-dark"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            <i className="ki-filled ki-check"></i>
            Assign Leads
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssignLeadModal;
