import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useEffect, useState } from "react";
import { AddContactMasterType, EditContactType, Translateapi } from "@/services/apiServices";

const AddLabourshift = ({ isOpen, onClose, shiftData, refreshData }) => {
  if (!isOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    hour: "",
    minute: "",
    period: "AM",
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Shift name is required"),
    hour: Yup.number()
      .typeError("Invalid hour")
      .min(1, "Hour must be 1–12")
      .max(12, "Hour must be 1–12")
      .required("Required"),
    minute: Yup.number()
      .typeError("Invalid minute")
      .min(0, "Minute must be 0–59")
      .max(59, "Minute must be 0–59")
      .required("Required"),
  });

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        alert("User data not found");
        return;
      }

      const timeString = `${values.hour}:${values.minute.toString().padStart(2, "0")} ${values.period}`;
      const payload = {
        nameEnglish: values.nameEnglish,
        nameGujarati: values.nameGujarati,
        nameHindi: values.nameHindi,
        time: timeString,
        userId: userData.id,
      };

      if (shiftData) {
        await EditContactType(shiftData.id, payload);
        Swal.fire("Updated!", "Labour Shift updated successfully.", "success");
      } else {
        await AddContactMasterType(payload);
        Swal.fire("Saved!", "Labour Shift added successfully.", "success");
      }

      refreshData();
      onClose();
      resetForm();
    } catch (error) {
      console.error("Error saving labour shift:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]-w-lg p-6 relative">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {shiftData ? "Edit Labour Shift" : "New Labour Shift"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <Formik
          initialValues={
            shiftData
              ? {
                  nameEnglish: shiftData.nameEnglish || "",
                  nameGujarati: shiftData.nameGujarati || "",
                  nameHindi: shiftData.nameHindi || "",
                  hour: shiftData.time?.split(":")[0] || "",
                  minute: shiftData.time?.split(":")[1]?.slice(0, 2) || "",
                  period: shiftData.time?.includes("PM") ? "PM" : "AM",
                  isActive: shiftData.isActive ?? true,
                }
              : initialFormState
          }
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => {
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
                  .catch(() => console.warn("Translation failed"));
              }, 500);

              setDebounceTimer(timer);
              return () => clearTimeout(timer);
            }, [values.nameEnglish]);

            return (
              <Form>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <InputWithFormik label="Name (English)*" name="nameEnglish" />
                  <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
                  <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
                </div>

                {/* Time Section */}
                <div className="flex items-center gap-2 mb-6">
                  <label className="text-gray-700 w-16">Time:</label>
                  <div className="flex items-center gap-1">
                    <Field
                      type="number"
                      name="hour"
                      placeholder="HH"
                      className="border border-gray-300 rounded-md w-16 p-2 text-center"
                    />
                    <span>:</span>
                    <Field
                      type="number"
                      name="minute"
                      placeholder="MM"
                      className="border border-gray-300 rounded-md w-16 p-2 text-center"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setFieldValue("period", values.period === "AM" ? "PM" : "AM")
                      }
                      className={`rounded-full text-white text-sm px-3 py-1 ml-2 shadow-md ${
                        values.period === "AM" ? "bg-blue-500" : "bg-indigo-600"
                      }`}
                    >
                      {values.period}
                    </button>
                  </div>
                  <ErrorMessage
                    name="hour"
                    component="div"
                    className="text-red-500 text-sm ml-2"
                  />
                  <ErrorMessage
                    name="minute"
                    component="div"
                    className="text-red-500 text-sm ml-2"
                  />
                </div>

                {/* Buttons */}
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => onClose(false)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {shiftData ? "Update" : "Save"}
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </div>
    </div>
  );
};

const InputWithFormik = ({ label, name }) => (
  <div className="flex flex-col">
    <label className="text-gray-600 mb-1">{label}</label>
    <Field
      type="text"
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

export default AddLabourshift;
