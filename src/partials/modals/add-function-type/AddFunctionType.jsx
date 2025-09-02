import { useState } from "react";
import { TimePicker, message } from "antd";
import { AddFunction } from "@/services/apiServices"; // ✅ your API helper
import { GetAllFunctionsByUserId } from "@/services/apiServices";
import InputToTextLang from "@/components/form-inputs/InputToTextLang"
const AddFunctionType = ({ isOpen, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    startTime: null,
    endTime: null,
  });

  if (!isOpen) return null;

  // update input values
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // handle Save
  const handleSave = async () => {
    try {
      const payload = {
        nameEnglish: formData.nameEnglish,
        nameGujarati: formData.nameGujarati,
        nameHindi: formData.nameHindi,
        startTime: formData.startTime ? formData.startTime.format("HH:mm") : "",
        endTime: formData.endTime ? formData.endTime.format("HH:mm") : "",
        userId: 1, // replace with logged-in user id
      };

      await AddFunction(payload);

      message.success("Function added successfully!");
      GetAllFunctionsByUserId(); // refresh data after adding
      onClose(false);
      if (onSuccess) onSuccess(); // refresh table in parent if needed
    } catch (err) {
      console.error("Error saving function:", err);
      message.error("Failed to add function");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Function</h2>
          <button onClick={() => onClose(false)} className="text-2xl text-gray-600">
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <InputToTextLang
            label="Name (English)*"
            value={formData.nameEnglish}
            onChange={(e) => handleChange("nameEnglish", e.target.value)}
            lng={'en-US'}
          />
          <InputToTextLang
            label="Name (ગુજરાતી)"
            value={formData.nameGujarati}
            onChange={(e) => handleChange("nameGujarati", e.target.value)}
            lng={'gu'}
          />
          <InputToTextLang
            label="Name (हिंदी)"
            value={formData.nameHindi}
            onChange={(e) => handleChange("nameHindi", e.target.value)}
            lng={'hi'}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
          <div className="flex flex-col">
            <label className="form-label ">Start Time</label>
            <TimePicker
              className="input"
              format="HH:mm"
              value={formData.startTime}
              onChange={(time) => handleChange("startTime", time)}
            />
          </div>
          <div className="flex flex-col">
            <label className="form-label">End Time</label>
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFunctionType;
