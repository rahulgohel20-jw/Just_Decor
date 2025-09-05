  import { useState, useEffect } from "react";

  import { AddKitchenArea,UpdateKitchenArea} from "@/services/apiServices"; // 👈 API call

  const AddKitchenAreaModal = ({ isModalOpen, setIsModalOpen, refreshData, selectedMenuCategory }) => {
    if (!isModalOpen) return null;

    const initialFormState = {
      nameEnglish: "",
      nameGujarati: "",
      nameHindi: "",
    };
    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
      if (selectedMenuCategory) {
        setFormData({
          nameEnglish: selectedMenuCategory.nameEnglish || "",
          nameGujarati: selectedMenuCategory.nameGujarati || "",
          nameHindi: selectedMenuCategory.nameHindi || "",
        });
      } else {
        setFormData(initialFormState);
      }
    }, [selectedMenuCategory]);

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        alert("User data not found");
        return;
      }

      const payload = { ...formData, userId: userData.id };

      try {
        if (selectedMenuCategory) {
          // TODO: Add edit API call here when backend is ready
                await UpdateKitchenArea(selectedMenuCategory.id, payload);
          console.log("Edit Kitchen Area (not implemented yet)", payload);
        } else {
          await AddKitchenArea(payload); // 👈 call API
          console.log("Kitchen Area added:", payload);
        }

        refreshData();
        setIsModalOpen(false);
      } catch (err) {
        console.error("Error saving kitchen area:", err);
      }
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">
              {selectedMenuCategory ? "Edit Kitchen Area" : "New Kitchen Area"}
            </h2>
            <button
              
              onClick={() => 
                setIsModalOpen(false)}
              className="text-2xl text-gray-600"
            >
              &times;
            </button>
          </div>

          {/* Form */}
          <div className="grid grid-cols-1 gap-4">
            <InputWithIcon label="Name (English)" name="nameEnglish" value={formData.nameEnglish} onChange={handleChange} required />
            <InputWithIcon label="Name (ગુજરાતી)" name="nameGujarati" value={formData.nameGujarati} onChange={handleChange} required />
            <InputWithIcon label="Name (हिंदी)" name="nameHindi" value={formData.nameHindi} onChange={handleChange} required />
          </div>

          {/* Buttons */}
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
              {selectedMenuCategory ? "Update" : "Save"}
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

  export default AddKitchenAreaModal;
