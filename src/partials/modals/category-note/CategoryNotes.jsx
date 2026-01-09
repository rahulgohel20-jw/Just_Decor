import { useState, useEffect } from "react";
import { Mic } from "lucide-react";
const CategoryNotes = ({ isOpen, onClose, notes, onSave }) => {
  const [localNotes, setLocalNotes] = useState({
    categoryNotes: "",
    categorySlogan: "",
  });

  useEffect(() => {
    if (isOpen) {
      setLocalNotes({
        categoryNotes: notes?.notes || "",
        categorySlogan: notes?.slogan || "",
      });
    }
  }, [isOpen, notes]);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setLocalNotes((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onSave({
      notes: localNotes.categoryNotes,
      slogan: localNotes.categorySlogan,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Add Notes And Slogan</h2>
          <button onClick={onClose} className="text-2xl text-gray-600">
            &times;
          </button>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <InputWithIcon
            label="Category Notes"
            value={localNotes.categoryNotes}
            onChange={(e) => handleChange("categoryNotes", e.target.value)}
          />
          <InputWithIcon
            label="Category Slogan"
            value={localNotes.categorySlogan}
            onChange={(e) => handleChange("categorySlogan", e.target.value)}
          />
        </div>

        <div className="flex w-full justify-end mt-6 gap-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            type="button"
            className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            onClick={handleSave}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, value, onChange }) => (
  <div className="relative w-full">
    <label className="block text-gray-600 mb-1">{label}</label>
    <input
      type="text"
      className="border border-gray-300 rounded-lg p-2 pr-10 w-full"
      placeholder={label}
      value={value}
      onChange={onChange}
    />
    <button
      type="button"
      onClick={() => console.log("Mic clicked")}
      title="Mic"
      className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8 absolute top-[70%] right-2 transform -translate-y-1/2"
    >
      <Mic size={18} />
    </button>
  </div>
);

export default CategoryNotes;
