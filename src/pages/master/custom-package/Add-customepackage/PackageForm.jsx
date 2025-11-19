import { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Translateapi } from "@/services/apiServices";

const PackageForm = ({ values, setFieldValue }) => {
  const [debounceTimer, setDebounceTimer] = useState(null);
  const isEnglishNameDirty = values.nameEnglish !== values.nameEnglishInitial; // Simple dirty check

  // This useEffect handles the debounced API call for translation
  useEffect(() => {
    if (!values.nameEnglish) {
      setFieldValue("nameGujarati", "");
      setFieldValue("nameHindi", "");
      return;
    }

    // Clear previous timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new timer
    const timer = setTimeout(() => {
      handleTranslation(values.nameEnglish, setFieldValue);
    }, 800); // 800ms debounce

    setDebounceTimer(timer);

    // Cleanup function
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [values.nameEnglish, setFieldValue]); // Re-run effect when English name changes

  const handleTranslation = async (text, setFieldValue) => {
    if (!text || text.length < 2) return;

    try {
      // Assuming Translateapi takes (text, sourceLang, targetLang) and returns { translatedText: '...' }
      // 1. Translate to Gujarati
      const gujResponse = await Translateapi(text, "en", "gu");
      setFieldValue("nameGujarati", gujResponse.translatedText || "");

      // 2. Translate to Hindi
      const hinResponse = await Translateapi(text, "en", "hi");
      setFieldValue("nameHindi", hinResponse.translatedText || "");
    } catch (error) {
      console.error("Translation failed:", error);
      // Optionally clear the fields or show an error
    }
  };

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">New Custom Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWithFormik
          label="Name (English)"
          name="nameEnglish"
          // Add onChange to trigger translation debounce (optional, Formik handles it fine)
        />
        <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
        <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
        <InputWithFormik label="Price" name="price" type="number" />
      </div>
    </div>
  );
};

// ... InputWithFormik remains the same ...

const InputWithFormik = ({ label, name, type = "text" }) => (
  <div className="flex flex-col">
    <label className="block text-gray-600 mb-1">
      {label}
      {label.includes("English") || label.includes("Price") ? (
        <span className="text-red-500">*</span>
      ) : null}
    </label>
    <Field
      type={type}
      name={name}
      placeholder={label}
      className="border border-gray-300 rounded-lg p-2 w-full"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default PackageForm;
