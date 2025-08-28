import { useState, useEffect } from "react";
import { TimePicker, message } from "antd";
import dayjs from "dayjs"; // ✅ needed for parsing time
import { AddFunction, EditFunctionById } from "@/services/apiServices"; 
import { GetAllFunctionsByUserId } from "@/services/apiServices";

const AddFunctionType = ({ isOpen, onClose, selectedFunction, onSuccess }) => {
  const initialState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    startTime: null,
    endTime: null,
  };

  const [formData, setFormData] = useState(initialState);

  // ✅ Prefill data when editing
  useEffect(() => {
    if (selectedFunction) {
      setFormData({
        nameEnglish: selectedFunction.function_name || "",
        nameGujarati: selectedFunction.nameGujarati || "",
        nameHindi: selectedFunction.nameHindi || "",
        startTime: selectedFunction.start_time
          ? dayjs(selectedFunction.start_time, "HH:mm")
          : null,
        endTime: selectedFunction.end_time
          ? dayjs(selectedFunction.end_time, "HH:mm")
          : null,
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedFunction]);

  if (!isOpen) return null;

  // ✅ update input values
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ handle Save / Update
  const handleSave = async () => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        message.error("User not logged in");
        return;
      }

      const payload = {
        nameEnglish: formData.nameEnglish,
        nameGujarati: formData.nameGujarati,
        nameHindi: formData.nameHindi,
        startTime: formData.startTime ? formData.startTime.format("HH:mm") : "",
        endTime: formData.endTime ? formData.endTime.format("HH:mm") : "",
        userId: userData.id,
      };

      if (selectedFunction) {
        // ✅ EDIT
        await EditFunctionById(selectedFunction.id, payload);
        message.success("Function updated successfully!");
      } else {
        // ✅ ADD
        await AddFunction(payload);
        message.success("Function added successfully!");
      }

      GetAllFunctionsByUserId(); // refresh list
      onClose(false);
      if (onSuccess) onSuccess();

    } catch (err) {
      console.error("Error saving function:", err);
      message.error("Failed to save function");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedFunction ? "Edit Function" : "New Function"}
          </h2>
          <button onClick={() => onClose(false)} className="text-2xl text-gray-600">
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <InputWithIcon
            label="Name (English)*"
            value={formData.nameEnglish}
            onChange={(e) => handleChange("nameEnglish", e.target.value)}
          />
          <InputWithIcon
            label="Name (ગુજરાતી)"
            value={formData.nameGujarati}
            onChange={(e) => handleChange("nameGujarati", e.target.value)}
          />
          <InputWithIcon
            label="Name (हिंदी)"
            value={formData.nameHindi}
            onChange={(e) => handleChange("nameHindi", e.target.value)}
          />
        </div>

        {/* Time Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col">
            <label className="form-label">Start Time<span className="text-red-700 fs-5">  *</span></label>
            <TimePicker
              className="input"
              format="HH:mm"
              value={formData.startTime}
              onChange={(time) => handleChange("startTime", time)}
            />
          </div>
          <div className="flex flex-col">
            <label className="form-label">End Time <span className="text-red-700"> *</span></label>
            <TimePicker
              className="input"
              format="HH:mm"
              value={formData.endTime}
              onChange={(time) => handleChange("endTime", time)}
            />
          </div>
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            {selectedFunction ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, value, onChange }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
      value={value}
      onChange={onChange}
    />
    {/* Mic icon */}
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);

export default AddFunctionType;
