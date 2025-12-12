import React, { useState, useEffect } from "react";
import {
  AddTickets,
  GetAllInteraction,
  Fetchmanager,
} from "../../../services/apiServices";

const AddTicketModal = ({ isOpen, onClose, onSave, ticketNumber }) => {
  const [formData, setFormData] = useState({
    interaction: "",
    interactionId: 0,
    ticketFrom: "Call",
    remarks: "",
    expectedCloseDate: "",
    actualCloseDate: "",
    department: "Employee",
    assignTo: "Tarun",
    assignToUserId: 1,
    status: "In Progress",
    createdBy: "Admin",
    comment: "",
    userId: 1,
  });
  const [interactions, setInteractions] = useState([]);
  const [managers, setManagers] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilePath, setUploadedFilePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [loadingInteractions, setLoadingInteractions] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      fetchInteractions();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      fetchManagers();
    }
  }, [isOpen]);
  const fetchManagers = async () => {
    try {
      const response = await Fetchmanager(1);
      const managerData = response?.data?.data?.["userDetails"] || [];
      console.log("managers", managerData);
      setManagers(managerData);
    } catch (err) {
      console.error("Error fetching managers:", err);
    }
  };

  const fetchInteractions = async () => {
    setLoadingInteractions(true);
    try {
      const response = await GetAllInteraction();
      const interactionData =
        response?.data?.data?.["Interaction Details"] || [];
      console.log("inyeraction", interactionData);

      // Filter active interactions
      const activeInteractions = interactionData.filter(
        (item) => item.isActive && !item.isDelete
      );
      setInteractions(activeInteractions);

      // Set default interaction if available
      if (activeInteractions.length > 0 && !formData.interaction) {
        setFormData((prev) => ({
          ...prev,
          interaction: activeInteractions[0].interactionname,
          interactionId: activeInteractions[0].id,
        }));
      }
    } catch (err) {
      console.error("Error fetching interactions:", err);
      setError("Failed to load interactions");
    } finally {
      setLoadingInteractions(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // If interaction is changed, also update the interactionId
    if (name === "interaction") {
      const selectedInteraction = interactions.find(
        (i) => i.interactionname === value
      );
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        interactionId: selectedInteraction?.id || 0,
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);

    try {
      // Map form data to API payload format
      const payload = {
        actualclosedate: formData.actualCloseDate,
        assigntoname: formData.assignTo,
        assigntouserid: formData.assignToUserId,
        clientmsg: formData.remarks,
        documentpath: "",
        expactedclosedate: formData.expectedCloseDate,
        interactionid: formData.interactionId,
        interactionname: formData.interaction,
        interactiontype:
          interactions.find((i) => i.id === formData.interactionId)
            ?.interactiontype || "",
        status: formData.status,
        ticketfrom: formData.ticketFrom,
        userid: formData.userId,
        usermsg: formData.comment,
      };

      const response = await AddTickets(payload);

      // Call the original onSave callback
      onSave(response);

      // Reset form
      setFormData({
        interaction:
          interactions.length > 0 ? interactions[0].interactionname : "",
        interactionId: interactions.length > 0 ? interactions[0].id : 0,
        ticketFrom: "Call",
        remarks: "",
        expectedCloseDate: "",
        actualCloseDate: "",
        department: "Employee",
        assignTo: "Tarun",
        assignToUserId: 1,
        status: "In Progress",
        createdBy: "Admin",
        comment: "",
        userId: 1,
      });
      setSelectedFile(null);
      setUploadedFilePath("");

      onClose();
    } catch (err) {
      setError(err.message || "Failed to save ticket");
      console.error("Error saving ticket:", err);
    } finally {
      setLoading(false);
    }
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

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
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
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Interaction */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Interaction <span className="text-red-500">*</span>
              </label>
              {loadingInteractions ? (
                <div className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 flex items-center justify-center">
                  <span className="text-sm text-gray-500">Loading...</span>
                </div>
              ) : (
                <select
                  name="interaction"
                  value={formData.interaction}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {interactions.length === 0 ? (
                    <option value="">No interactions available</option>
                  ) : (
                    interactions.map((interaction) => (
                      <option
                        key={interaction.id}
                        value={interaction.interactionname}
                      >
                        {interaction.interactionname}
                      </option>
                    ))
                  )}
                </select>
              )}
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
                <option>Web</option>
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
                {managers.length === 0 ? (
                  <option value="">No managers available</option>
                ) : (
                  managers.map((manager) => (
                    <option key={manager.id} value={manager.firstName}>
                      {manager.firstName}
                    </option>
                  ))
                )}
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

            {/* Upload Document */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Document
              </label>

              {!selectedFile ? (
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
                  <input
                    type="file"
                    id="fileUpload"
                    onChange={(e) => {
                      setSelectedFile(e.target.files[0]);
                    }}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.jpg,.jpeg,.png,.xlsx,.xls"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="fileUpload"
                    className={`cursor-pointer flex flex-col items-center ${uploading ? "opacity-50 pointer-events-none" : ""}`}
                  >
                    {uploading ? (
                      <>
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-3"></div>
                        <span className="text-sm text-gray-600 mb-1">
                          Uploading file...
                        </span>
                      </>
                    ) : (
                      <>
                        <svg
                          className="w-12 h-12 text-gray-400 mb-3"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                        <span className="text-sm text-gray-600 mb-1">
                          Click to upload or drag and drop
                        </span>
                        <span className="text-xs text-gray-500">
                          PDF, DOC, DOCX, JPG, PNG, XLSX (MAX. 5MB)
                        </span>
                      </>
                    )}
                  </label>
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-5 h-5 text-blue-600"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-800">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFileSize(selectedFile.size)} • Uploaded
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedFile(null)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                      disabled={loading}
                    >
                      <svg
                        className="w-5 h-5"
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
                </div>
              )}
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
              disabled={loading || uploading}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={loading || uploading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddTicketModal;
