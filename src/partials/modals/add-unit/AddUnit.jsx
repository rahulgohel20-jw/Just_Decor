import { useState, useEffect } from "react";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import { AddUnitdata, EditUnit } from "@/services/apiServices";
import Swal from "sweetalert2";
const AddUnit = ({
  isModalOpen,
  setIsModalOpen,
  selectedUnit,
  refreshData,
}) => {
  if (!isModalOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    symbolEnglish: "",
    symbolGujarati: "",
    symbolHindi: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  useEffect(() => {
    if (selectedUnit) {
      console.log(selectedUnit);

      setFormData({
        nameEnglish: selectedUnit.unit || "",
        nameGujarati: selectedUnit.nameGujarati || "",
        nameHindi: selectedUnit.nameHindi || "",
        symbolEnglish: selectedUnit.symbol || "",
        symbolGujarati: selectedUnit.nameGujarati || "",
        symbolHindi: selectedUnit.nameHindi || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [selectedUnit]);
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

    if (selectedUnit) {
      const payload = { ...formData, userId: userData.id };

      EditUnit(selectedUnit.unitId, payload)
        .then((res) => {
          if (res.data?.msg) {
            refreshData();
            setIsModalOpen(false);
            Swal.fire({
              title: "Success!",
              text: res.data?.msg,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error editing meal:", error);
        });
    } else {
      const payload = { ...formData, userId: userData.id };
      AddUnitdata(payload)
        .then((res) => {
          if (res.data?.msg) {
            refreshData();
            setIsModalOpen(false);
            Swal.fire({
              title: "Success!",
              text: res.data?.msg,
              icon: "success",
              timer: 1500,
              showConfirmButton: false,
            });
          }
        })
        .catch((error) => {
          console.error("Error adding meal:", error);
        });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">New Unit</h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Form: Two Rows */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <InputToTextLang
            label="Name (English)"
            name="nameEnglish"
            value={formData.nameEnglish}
            onChange={handleChange}
            lang="en-US"
            required
            showMicIcon
          />
          <InputToTextLang
            label="Name (ગુજરાતી)"
            name="nameGujarati"
            value={formData.nameGujarati}
            onChange={handleChange}
            lng="gu-US"
            required
            showMicIcon
          />
          <InputToTextLang
            label="Name (हिंदी)"
            name="nameHindi"
            value={formData.nameHindi}
            onChange={handleChange}
            lng="hi"
            required
            showMicIcon
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <InputToTextLang
            label="Symbol (English)"
            name="symbolEnglish"
            value={formData.symbolEnglish}
            onChange={handleChange}
            lang="en-US"
            required
            showMicIcon
          />
          <InputToTextLang
            label="Symbol (ગુજરાતી)"
            name="symbolGujarati"
            value={formData.symbolGujarati}
            onChange={handleChange}
            lng="gu-US"
            required
            showMicIcon
          />
          <InputToTextLang
            label="Symbol (हिंदी)"
            name="symbolHindi"
            value={formData.symbolHindi}
            onChange={handleChange}
            lng="hi"
            required
            showMicIcon
          />
        </div>

        {/* Action Buttons */}
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
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddUnit;
