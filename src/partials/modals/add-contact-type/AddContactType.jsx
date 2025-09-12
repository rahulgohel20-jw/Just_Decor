import React, { useState, useEffect } from "react";
import { GetAllContactType,AddContactMasterType,EditContactType } from "@/services/apiServices";

const AddContactType = ({
  isOpen,
  onClose,
  contactType, // If editing, this will have the existing data
  refreshData,
}) => {
  if (!isOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    isActive: true,
    
  };

  const [formData, setFormData] = useState(initialFormState);
  const [contactTypes, setContactTypes] = useState([]); // ✅ state for dropdown

  useEffect(() => {
    // ✅ Fetch Contact Types
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (userData?.id) {
      GetAllContactType(userData.id)
        .then((res) => {
          // Assuming API returns res.data as array
          setContactTypes(res?.data?.data?.["Contact Type Details"] || []);
        })
        .catch((err) => {
          console.error("Error fetching contact types:", err);
        });
    }
  }, []);

  useEffect(() => {
    if (contactType) {
      setFormData({
        nameEnglish: contactType.contact_type || "",
        nameGujarati: contactType.nameGujarati || "",
        nameHindi: contactType.nameHindi || "",
        isActive: contactType.isActive || false,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [contactType]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) {
      alert("User data not found");
      return;
    }

    const payload = { ...formData, userId: userData.id };
    console.log("Payload:", payload);

    if (contactType) {
      EditContactType(contactType.contacttypeid, payload)
        .then(() => {
          refreshData();
          onClose();
        })
        .catch((error) => {
          console.error("Error editing category:", error);
        });
    } else {
      AddContactMasterType(payload)
        .then(() => {
          refreshData();
          onClose();
        })
        .catch((error) => {
          console.error("Error adding category:", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {contactType ? "Edit Contact Type" : "New Contact Type"}
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
          <InputWithIcon
            label="Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (ગુજરાતી)"
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            required
          />
          <InputWithIcon
            label="Name (हिंदी)"
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            required
          />

          


          
        </div>

        {/* Actions */}
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
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {contactType ? "Update" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, name, value, onChange, required }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      value={value}
      onChange={onChange}
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
      required={required}
    />
  </div>
);

export default AddContactType;
