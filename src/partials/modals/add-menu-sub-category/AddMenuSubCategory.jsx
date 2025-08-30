import { useState, useEffect } from "react";
import { editSubCategory, AddSubCategory } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
const AddMenuSubCategory = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  editData,
}) => {
  if (!isModalOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
  };
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (editData) {
      setFormData({
        nameEnglish: editData.nameEnglish || "",
        nameGujarati: editData.nameGujarati || "",
        nameHindi: editData.nameHindi || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editData]);

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
    if (editData) {
      const payload = { ...formData, userId: userData.id };

      editSubCategory(editData.id, payload)
        .then((res) => {
          refreshData();
          setIsModalOpen();
          res.data?.msg && successMsgPopup(res.data.msg)
        })
        .catch((error) => {
          console.error("Error editing meal:", error);
          error?.response?.data?.msg && errorMsgPopup(error.response.data.msg)
        });
    } else {
      const payload = { ...formData, userId: userData.id };
      AddSubCategory(payload)
        .then((res) => {
          res.data?.msg && successMsgPopup(res.data.msg)
          refreshData();
          setIsModalOpen();
          console.log("sss",res);
        })
        .catch((error) => {
          error?.response?.data?.msg && errorMsgPopup(error.response.data.msg)
          console.error("Error adding meal:", error);
        });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editData ? "Edit Menu Sub Category" : "New Menu Sub Category"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>
        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          {/* Name fields */}
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
        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={() => setIsModalOpen(false)}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSubmit}
          >
            {editData ? "Update" : "Save"}
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
    {/* Mic icon */}
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);

export default AddMenuSubCategory;
