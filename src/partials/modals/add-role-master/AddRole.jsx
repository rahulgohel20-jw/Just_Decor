import { useState, useEffect } from "react";
import { message } from "antd";
import { AddRole as AddRoleApi } from "@/services/apiServices"; 
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import { FormattedMessage } from "react-intl";

const AddRole = ({ isOpen, onClose, selectedRole, refreshData, onSuccess }) => {
  const initialState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
  };

  const [formData, setFormData] = useState(initialState);

  // ✅ Prefill when editing
  useEffect(() => {
    if (selectedRole) {
      console.log("Selected Role for editing:", selectedRole);
      setFormData({
        name: selectedRole.name || "",
        nameGujarati: selectedRole.nameGujarati || "",
        nameHindi: selectedRole.nameHindi || "",
      });
    } else {
      setFormData(initialState);
    }
  }, [selectedRole]);

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
        name: formData.nameEnglish, // ✅ API requires "name"
        userId: userData.id,
      };

      if (selectedRole) {
        await EditRole(selectedRole.id, payload);
        message.success("Role updated successfully!");
      } else {
        await AddRoleApi(payload);
        message.success("Role added successfully!");
      }

      refreshData?.(); // refresh list
      onClose(false);
      onSuccess?.();
    } catch (err) {
      console.error("Error saving role:", err);
      message.error("Failed to save role");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedRole ? <FormattedMessage id="USER.MASTER.EDIT_ROLE" defaultMessage="Edit Role" /> : <FormattedMessage id="USER.MASTER.NEW_ROLE" defaultMessage="New Role" />}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <InputToTextLang
            label={<FormattedMessage id="COMMON.ROLE_NAME" defaultMessage="Role Name*" />}
            value={formData.nameEnglish}
            onChange={(e) => handleChange("name", e.target.value)}
            lng="en-US"
          />
          {/* Optional: Gujarati & Hindi if needed */}
          {/* 
          <InputToTextLang
            label="Name (Gujarati)"
            value={formData.nameGujarati}
            onChange={(e) => handleChange("nameGujarati", e.target.value)}
            lng="gu-IN"
          />
          <InputToTextLang
            label="Name (Hindi)"
            value={formData.nameHindi}
            onChange={(e) => handleChange("nameHindi", e.target.value)}
            lng="hi-IN"
          />
          */}
        </div>

        {/* Buttons */}
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => onClose(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          >
            {selectedRole ? <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" /> : <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;
