import { useEffect, useState } from "react";
import { Field, ErrorMessage } from "formik";
import { Translateapi } from "@/services/apiServices";

const PackageForm = ({ values, setFieldValue }) => {
  const [debounceTimer, setDebounceTimer] = useState(null);

  useEffect(() => {
    if (!values.nameEnglish?.trim()) return;
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(values.nameEnglish)
        .then((res) => {
          setFieldValue("nameGujarati", res.data.gujarati || "");
          setFieldValue("nameHindi", res.data.hindi || "");
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);

    setDebounceTimer(timer);
    return () => clearTimeout(timer);
  }, [values.nameEnglish]);

  return (
    <div className="border rounded-lg p-4 bg-white">
      <h3 className="text-lg font-semibold mb-3">New Custom Package</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InputWithFormik label="Name (English)" name="nameEnglish" />
        <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
        <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
        <InputWithFormik label="Price" name="price" type="number" />
      </div>
    </div>
  );
};

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
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default PackageForm;
