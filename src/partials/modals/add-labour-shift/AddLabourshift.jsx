import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { useEffect } from "react";
import { AddLabourShift,EditLabourShiftAPI,Translateapi } from "@/services/apiServices";

const AddLabourshift = ({ isOpen, onClose, shiftData, refreshData }) => {
  if (!isOpen) return null;

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    time: "", 
    isActive: true,
  };

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Shift name is required"),
    time: Yup.string()
      .matches(/^([01]\d|2[0-3]):([0-5]\d)$/, "Time must be in HH:mm 24-hour format")
      .required("Shift time is required"),
  });

const handleEdit = (shift) => {
  setSelectedcontactType(shift); 
  setIsContactModalOpen(true);
};

const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) return alert("User data not found");

const payload = {
  nameEnglish: values.nameEnglish,
  nameGujarati: values.nameGujarati,
  nameHindi: values.nameHindi,
  shifttime: values.time, 
  userId: JSON.parse(localStorage.getItem("userData"))?.id || 0
};




    let response;

    if (shiftData) {

      response = await EditLabourShiftAPI(shiftData.id, payload);
    } else {
      
      response = await AddLabourShift(payload);
    }

    if (response?.data?.success) {
      Swal.fire("Success!", response.data.msg || "Operation successful", "success");
      refreshData();
      onClose();
      resetForm();
    } else {
      Swal.fire("Error!", response?.data?.msg || "Something went wrong!", "error");
    }
  } catch (error) {
    console.error("Error saving labour shift:", error);
    Swal.fire("Error!", "Something went wrong!", "error");
  } finally {
    setSubmitting(false);
  }
};



  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 relative overflow-y-auto max-h-[90vh]">
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

        <Formik
 initialValues={
  shiftData
    ? {
        nameEnglish: shiftData.shift_name || "",
        nameGujarati: shiftData.nameGujarati || "",
        nameHindi: shiftData.nameHindi || "",
        time: shiftData.shift_time || "",
        isActive: shiftData.isActive ?? true,
      }
    : initialFormState}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
  enableReinitialize

>

          {({ values, setFieldValue, isSubmitting }) => {
            useEffect(() => {
  if (!values.nameEnglish?.trim()) return;
  if (shiftData) return; 
  const timer = setTimeout(() => {
    Translateapi(values.nameEnglish)
      .then((res) => {
        setFieldValue("nameGujarati", res.data.gujarati || "");
        setFieldValue("nameHindi", res.data.hindi || "");
      })
      .catch(() => console.warn("Translation failed"));
  }, 500);
  return () => clearTimeout(timer);
}, [values.nameEnglish, shiftData]);


            return (
              <Form>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <InputWithFormik label="Name (English)*" name="nameEnglish" />
                  <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
                  <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
                </div>

                <div className="mb-6">
                  <label className="text-gray-700 mb-1 block">Time (HH:mm)*:</label>
                 <Field name="time">
  {({ field, form }) => (
    <input
      {...field}
      type="text"
      placeholder="HH:mm"
      maxLength={5}
      className="border border-gray-300 rounded-md p-2 w-32"
      onChange={(e) => {
        let value = e.target.value.replace(/[^0-9]/g, ""); 

        if (value.length >= 3) {
     
          value = value.slice(0, 2) + ":" + value.slice(2, 4);
        }

        if (value.length > 5) value = value.slice(0, 5);

        form.setFieldValue(field.name, value);
      }}
      value={field.value}
    />
  )}
</Field>

                  <ErrorMessage
                    name="time"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

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
