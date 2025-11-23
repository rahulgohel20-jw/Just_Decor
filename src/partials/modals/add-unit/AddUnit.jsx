import { useEffect, useState } from "react";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import { AddUnitdata, EditUnit, Translateapi } from "@/services/apiServices";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const AddUnit = ({
  isModalOpen,
  setIsModalOpen,
  selectedUnit,
  refreshData,
}) => {
  if (!isModalOpen) return null;

  const [debounceTimer, setDebounceTimer] = useState(null);

  const validationSchema = Yup.object({
    nameEnglish: Yup.string().required("Name is required"),
    symbolEnglish: Yup.string().required("Symbol is required"),
    decimalLimit: Yup.string().required(
      "Decimal Limit For Quantity is required"
    ),
  });

  const handleTranslate = (text, fields) => {
    if (!text?.trim()) return;
    if (debounceTimer) clearTimeout(debounceTimer);
    const timer = setTimeout(() => {
      Translateapi(text)
        .then((res) => {
          formik.setFieldValue(fields.gujarati, res.data.gujarati || "");
          formik.setFieldValue(fields.hindi, res.data.hindi || "");
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);
    setDebounceTimer(timer);
  };

  const formik = useFormik({
    initialValues: {
      nameEnglish: "",
      nameGujarati: "",
      nameHindi: "",
      symbolEnglish: "",
      symbolGujarati: "",
      symbolHindi: "",
      isParentUnit: false,
      decimalLimit: "",
      parentUnit: "",
      equivalent: "",
      rangeType: "Range",
      ranges: [{ min: "", max: "", roundOff: "" }],
      stepWiseRange: "",
    },
    validationSchema,
    onSubmit: async (values) => {
      const Id = localStorage.getItem("userId");
      if (!Id) return Swal.fire("Error", "User data not found", "error");

      const payload = { ...values, userId: Id };
      try {
        const res = selectedUnit
          ? await EditUnit(selectedUnit.unitId, payload)
          : await AddUnitdata(payload);

        if (res?.data.success === false)
          return Swal.fire(
            "Error",
            res.data.msg || "Something went wrong",
            "error"
          );

        Swal.fire(
          "Success",
          selectedUnit
            ? "Unit updated successfully"
            : "Unit added successfully",
          "success"
        );
        refreshData();
        setIsModalOpen(false);
      } catch (error) {
        Swal.fire(
          "Error",
          error.response?.data?.msg || "Something went wrong",
          "error"
        );
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.nameEnglish)
      handleTranslate(formik.values.nameEnglish, {
        gujarati: "nameGujarati",
        hindi: "nameHindi",
      });
  }, [formik.values.nameEnglish]);

  useEffect(() => {
    if (formik.values.symbolEnglish)
      handleTranslate(formik.values.symbolEnglish, {
        gujarati: "symbolGujarati",
        hindi: "symbolHindi",
      });
  }, [formik.values.symbolEnglish]);

  useEffect(() => {
    if (selectedUnit) {
      formik.setValues({
        nameEnglish: selectedUnit.unit || "",
        nameGujarati: selectedUnit.nameGujarati || "",
        nameHindi: selectedUnit.nameHindi || "",
        symbolEnglish: selectedUnit.symbol || "",
        symbolGujarati: selectedUnit.symbolGujarati || "",
        symbolHindi: selectedUnit.symbolHindi || "",
        isParentUnit: selectedUnit.isParentUnit || false,
        decimalLimit: selectedUnit.decimalLimit || "",
        parentUnit: selectedUnit.parentUnit || "",
        equivalent: selectedUnit.equivalent || "",
        rangeType: selectedUnit.rangeType || "Range",
        ranges: selectedUnit.ranges || [{ min: "", max: "", roundOff: "" }],
        stepWiseRange: selectedUnit.stepWiseRange || "",
      });
    }
  }, [selectedUnit]);

  const addRangeRow = () =>
    formik.setFieldValue("ranges", [
      ...formik.values.ranges,
      { min: "", max: "", roundOff: "" },
    ]);

  const removeRangeRow = (index) =>
    formik.setFieldValue(
      "ranges",
      formik.values.ranges.filter((_, i) => i !== index)
    );

  const renderSelect = (name, label, options) => (
    <div>
      <label className="text-sm text-gray-600 mb-1 block">{label}</label>
      <select
        name={name}
        value={formik.values[name]}
        onChange={formik.handleChange}
        onBlur={formik.handleBlur}
        className="w-full border text-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="">Select</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {formik.touched[name] && formik.errors[name] && (
        <p className="text-red-500 text-sm mt-1">{formik.errors[name]}</p>
      )}
    </div>
  );

  /** ---- Dynamic Range Info Section ---- **/
  const RangeInfoSection = () => {
    const type = formik.values.rangeType;
    if (type === "Precision Range") {
      return (
        <div className="bg-[#F7FAFF] border rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
          <p className="text-black font-medium">
            This range works on the child unit (decimal part) of the
            measurement. If it falls between Minimum and Maximum, it is rounded
            to the Round Value.
          </p>
          <p className="mt-2">
            <strong className="text-black">Example:</strong> If the measurement
            value is 1.150, and the minimum value is 100, and the maximum value
            is 200, and the round off value is 200, then the measurement value
            will be rounded to 1.200.
          </p>
        </div>
      );
    }

    if (type === "Step Wise Range") {
      return (
        <div className="bg-[#F7FAFF] border rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
          <p className="text-black font-medium">
            This range adjusts values in fixed steps based on the defined step
            size. Values are rounded to the nearest step.
          </p>
          <p className="mt-2">
            <strong className="text-black">Example:</strong> If the step size is
            0.5, then values from 0.1–0.5 round to 0.5, and 0.6–1.0 round to
            1.0.
          </p>

          <div className="mt-4">
            <label className="block text-gray-700 text-sm mb-1">
              Step Wise Range*
            </label>
            <input
              type="text"
              name="stepWiseRange"
              value={formik.values.stepWiseRange}
              onChange={formik.handleChange}
              className=" border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="Enter Step Wise Range"
            />
            {!formik.values.stepWiseRange && (
              <p className="text-red-500 text-sm mt-1">
                Step Wise Range is required.
              </p>
            )}
          </div>
        </div>
      );
    }

    // Default "Range"
    return (
      <div className="bg-[#F7FAFF] border rounded-lg p-4 text-sm text-gray-700 leading-relaxed">
        <p className="text-black font-medium">
          This range checks the full measurement value. If it falls between
          Minimum and Maximum, it is rounded to the Round Value.
        </p>
        <p className="mt-2">
          <strong className="text-black">Example:</strong> If the measurement
          value is 150, and the minimum value is 100, and the maximum value is
          200, and the round off value is 200, then the measurement value will
          be rounded to 200.
        </p>
      </div>
    );
  };

  const RangeTable = () => {
    const handleChange = (index, field, value) => {
      const updated = [...formik.values.ranges];
      updated[index][field] = value;
      if (field === "max" && value) {
        updated[index].roundOff = value;
      }
      formik.setFieldValue("ranges", updated);
    };

    const handleRemove = (index) => {
      formik.setFieldValue(
        "ranges",
        formik.values.ranges.filter((_, i) => i !== index)
      );
    };

    return (
      formik.values.rangeType !== "Step Wise Range" && (
        <div className="border rounded-lg overflow-hidden">
          <table className="w-full text-sm text-black">
            <thead className="bg-[#F7FAFF]">
              <tr>
                {[
                  "#",
                  "Minimum Value*",
                  "Maximum Value*",
                  "Round Off Value*",
                  "Action",
                ].map((header) => (
                  <th
                    key={header}
                    className={`py-2 px-3 ${header === "Action" ? "text-center" : "text-left"}`}
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {formik.values.ranges.map((range, index) => {
                const prevMax =
                  index > 0
                    ? parseFloat(formik.values.ranges[index - 1].max)
                    : null;
                const currMin = parseFloat(range.min);
                const validationError =
                  prevMax !== null && !isNaN(currMin) && currMin <= prevMax
                    ? `Min must be greater than the ${index} record's Max (${prevMax}).`
                    : "";

                return (
                  <tr key={index} className="border-t align-top">
                    <td className="py-2 px-3">{index + 1}</td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        className="w-full border rounded-md px-2 py-1 h-10 text-gray-600"
                        defaultValue={range.min}
                        onBlur={(e) =>
                          handleChange(index, "min", e.target.value)
                        }
                      />
                      {validationError && (
                        <p className="text-red-500 text-xs mt-1">
                          {validationError}
                        </p>
                      )}
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        className="w-full border text-gray-600 rounded-md px-2 py-1 h-10"
                        defaultValue={range.max}
                        onBlur={(e) =>
                          handleChange(index, "max", e.target.value)
                        }
                      />
                    </td>
                    <td className="py-2 px-3">
                      <input
                        type="number"
                        className="w-full border text-gray-600 rounded-md px-2 py-1 h-10 bg-gray-50"
                        value={range.roundOff}
                        onChange={(e) =>
                          handleChange(index, "roundOff", e.target.value)
                        }
                        readOnly
                      />
                    </td>
                    <td className="text-center align-middle">
                      <button
                        type="button"
                        onClick={() => handleRemove(index)}
                        className="text-red-500 hover:text-red-700 text-lg"
                      >
                        <i className="ki-filled ki-trash text-danger"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )
    );
  };

  const RangeTypeRadios = () => (
    <div className="flex gap-6">
      {["Range", "Precision Range", "Step Wise Range"].map((type) => (
        <label key={type} className="flex items-center gap-2">
          <input
            type="radio"
            name="rangeType"
            value={type}
            checked={formik.values.rangeType === type}
            onChange={formik.handleChange}
            className="accent-blue-600"
          />
          <span className="text-gray-700">{type}</span>
        </label>
      ))}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-6xl p-8 relative overflow-y-auto max-h-[90vh] border border-gray-100">
        <div className="flex justify-between items-center border-b pb-3 mb-6">
          <h2 className="text-2xl font-semibold text-gray-800">
            {selectedUnit ? "Edit Unit" : "New Unit"}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <form onSubmit={formik.handleSubmit} className="space-y-8">
          {/* Names */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { label: "Name (English*)", name: "nameEnglish", lang: "en-US" },
              { label: "Name (ગુજરાતી*)", name: "nameGujarati", lang: "gu" },
              { label: "Name (हिंदी*)", name: "nameHindi", lang: "hi" },
            ].map((f) => (
              <InputToTextLang
                key={f.name}
                {...f}
                value={formik.values[f.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                showMicIcon
              />
            ))}
          </div>

          {/* Symbols */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                label: "Symbol (English*)",
                name: "symbolEnglish",
                lang: "en-US",
              },
              {
                label: "Symbol (ગુજરાતી*)",
                name: "symbolGujarati",
                lang: "gu",
              },
              { label: "Symbol (हिंदी*)", name: "symbolHindi", lang: "hi" },
            ].map((f) => (
              <InputToTextLang
                key={f.name}
                {...f}
                value={formik.values[f.name]}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                required
                showMicIcon
              />
            ))}
          </div>

          {/* Is Parent Unit */}
          <div className="flex items-center gap-3">
            <label className="inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="isParentUnit"
                checked={formik.values.isParentUnit}
                onChange={formik.handleChange}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-blue-600 relative after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:h-5 after:w-5 after:rounded-full after:transition-all peer-checked:after:translate-x-5"></div>
            </label>
            <span className="text-gray-700 font-medium">Is Parent Unit</span>
          </div>

          {/* Conditional fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {renderSelect("decimalLimit", "Decimal Limit For Quantity*", [
              "0",
              "1",
              "2",
            ])}
            {!formik.values.isParentUnit && (
              <>
                {renderSelect("parentUnit", "Parent Unit", [])}
                <div>
                  <label className="text-sm text-gray-600 mb-1 block">
                    Equivalent
                  </label>
                  <input
                    name="equivalent"
                    type="text"
                    value={formik.values.equivalent}
                    onChange={formik.handleChange}
                    className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    placeholder="Enter Equivalent"
                  />
                </div>
              </>
            )}
          </div>

          {/* Dynamic Range Info */}
          <RangeTypeRadios />
          <RangeInfoSection />
          <RangeTable />

          {formik.values.rangeType !== "Step Wise Range" && (
            <button
              type="button"
              onClick={addRangeRow}
              className="p-2 rounded-lg flex items-center gap-2 bg-primary text-white font-medium mt-2"
            >
              <span className="text-xl">＋</span> Add Range
            </button>
          )}

          {/* Buttons */}
          <div className="flex justify-end gap-4 pt-4 border-t">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="bg-danger hover:bg-red-600 text-white px-6 py-2.5 rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg flex items-center gap-2"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnit;
