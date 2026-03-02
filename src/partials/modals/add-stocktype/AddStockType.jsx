import { useState, useEffect } from "react";
import { Package, X, Save, Languages } from "lucide-react";
import { Translateapi, AddStockType as AddStockTypeAPI, UpdateStockType } from "@/services/apiServices";
import Swal from "sweetalert2";

const AddStockType = ({ isOpen, onClose, refreshData, stockType }) => {
  const [nameEnglish, setNameEnglish] = useState("");
  const [nameGujarati, setNameGujarati] = useState("");
  const [nameHindi, setNameHindi] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (stockType) {
      setNameEnglish(stockType.nameEnglish || "");
      setNameGujarati(stockType.nameGujarati || "");
      setNameHindi(stockType.nameHindi || "");
    } else {
      setNameEnglish("");
      setNameGujarati("");
      setNameHindi("");
    }
    setError("");
  }, [stockType, isOpen]);

  if (!isOpen) return null;

  // 🔥 Auto Translate when English changes
  const handleTranslate = async (text) => {
    try {
      if (!text.trim()) return;

      const res = await Translateapi(text);
      const translated = res?.data;

      if (translated) {
        setNameGujarati(translated.gujarati || "");
        setNameHindi(translated.hindi || "");
      }
    } catch (err) {
      console.error("Translation failed", err);
    }
  };

 const handleSave = async () => {
  if (!nameEnglish.trim()) {
    setError("English name is required.");
    return;
  }

  try {
    setLoading(true);

    const payload = {
      nameEnglish,
      nameGujarati,
      nameHindi,
      userId: JSON.parse(localStorage.getItem("userId")),
    };

    if (stockType?.stocktypeid) {
      await UpdateStockType(stockType.stocktypeid, payload);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Stock Type updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    } else {
      await AddStockTypeAPI(payload);

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Stock Type added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });
    }

    refreshData();
    onClose(false);

  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Save Failed",
      text: "Something went wrong. Please try again.",
    });
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
      onClick={() => onClose(false)}
    >
      <div
        className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b">
          <h2 className="text-lg font-bold text-primary flex items-center gap-2">
            <Package size={18} />
            {stockType ? "Edit Stock Type" : "Add Stock Type"}
          </h2>
          <button
            className="text-gray-400 hover:text-gray-600"
            onClick={() => onClose(false)}
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-6 space-y-4">
          
          {/* English */}
          <InputField
            label="Name (English)"
            value={nameEnglish}
            onChange={(e) => {
              setNameEnglish(e.target.value);
              handleTranslate(e.target.value);
            }}
            icon={<Languages size={16} />}
            error={error}
          />

          {/* Gujarati */}
          <InputField
            label="Name (Gujarati)"
            value={nameGujarati}
            onChange={(e) => setNameGujarati(e.target.value)}
            icon={<Languages size={16} />}
          />

          {/* Hindi */}
          <InputField
            label="Name (Hindi)"
            value={nameHindi}
            onChange={(e) => setNameHindi(e.target.value)}
            icon={<Languages size={16} />}
          />
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t bg-gray-50 rounded-b-xl">
          <button
            className="flex items-center gap-2 px-5 py-2 bg-primary text-white text-sm font-semibold rounded-md hover:opacity-90 transition disabled:opacity-60"
            onClick={handleSave}
            disabled={loading}
          >
            <Save size={16} />
            {loading ? "Saving..." : stockType ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddStockType;


const InputField = ({ label, value, onChange, icon, error }) => (
  <div>
    <label className="text-sm font-semibold text-gray-700">{label}</label>
    <div className="relative mt-1">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
        {icon}
      </div>
      <input
        type="text"
        className={`w-full pl-10 pr-3 py-2 border ${
          error ? "border-red-400" : "border-gray-300"
        } rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary`}
        value={value}
        onChange={onChange}
      />
    </div>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);