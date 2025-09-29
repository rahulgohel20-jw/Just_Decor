import { useEffect, useState } from "react";
import {
  AddMealType,
  EditMealType,
  Translateapi,
} from "@/services/apiServices";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  nameEnglish: Yup.string().required("Name is required"),
});

const AddMeal = ({ isOpen, onClose, refreshData, selectedMeal }) => {
  if (!isOpen) return null;
  const [debounceTimer, setDebounceTimer] = useState(null);

  const initialValues = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
  };

  const triggerTranslate = (text) => {
    if (!text?.trim()) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(text)
        .then((res) => {
          formik.setFieldValue("nameGujarati", res.data.gujarati || "");
          formik.setFieldValue("nameHindi", res.data.hindi || "");
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);

    setDebounceTimer(timer);
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: async (values) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      try {
        const payload = { ...values, userId: userData.id };

        if (selectedMeal) {
          const res = await EditMealType(selectedMeal.mealid, payload);
          if (res?.data.success === false) {
            Swal.fire("Error", res.data.msg || "Something went wrong", "error");
            return;
          }
          Swal.fire("Success", "Meal updated successfully", "success");
        } else {
          const res = await AddMealType(payload);
          if (res?.data.success === false) {
            Swal.fire("Error", res.data.msg || "Something went wrong", "error");
            return;
          }
          Swal.fire("Success", "Meal added successfully", "success");
        }

        refreshData();
        onClose();
      } catch (err) {
        console.error("Error submitting meal:", err);
        Swal.fire("Error", "Something went wrong", "error");
      }
    },
    enableReinitialize: true,
  });

  useEffect(() => {
    if (formik.values.nameEnglish) {
      triggerTranslate(formik.values.nameEnglish);
    }
  }, [formik.values.nameEnglish]);

  useEffect(() => {
    if (selectedMeal) {
      formik.setValues({
        nameEnglish: selectedMeal.meal_type || "",
        nameGujarati: selectedMeal.nameGujarati || "",
        nameHindi: selectedMeal.nameHindi || "",
      });
    } else {
      formik.resetForm();
    }
  }, [selectedMeal, isOpen]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedMeal ? "Edit Meal" : "New Meal"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Form */}
        <form onSubmit={formik.handleSubmit}>
          {/* 2-column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <InputToTextLang
                label="Name (English)"
                name="nameEnglish"
                value={formik.values.nameEnglish}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="en-US"
                required
                error={formik.touched.nameEnglish && formik.errors.nameEnglish}
              />
            </div>
            <div>
              <InputToTextLang
                label="Name (ગુજરાતી)"
                name="nameGujarati"
                value={formik.values.nameGujarati}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="gu"
                required
                error={
                  formik.touched.nameGujarati && formik.errors.nameGujarati
                }
              />
            </div>
            <div>
              <InputToTextLang
                label="Name (हिंदी)"
                name="nameHindi"
                value={formik.values.nameHindi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="hi"
                required
                error={formik.touched.nameHindi && formik.errors.nameHindi}
              />
            </div>
          </div>

          {/* Buttons */}
          <div className="flex w-full justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={() => onClose(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              {selectedMeal ? "Update" : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddMeal;
