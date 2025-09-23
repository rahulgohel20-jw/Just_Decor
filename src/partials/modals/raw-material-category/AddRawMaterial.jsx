import { useEffect, useState } from "react";
import {
  AddRawMaterialCat,
  EditRawMaterialCat,
  GetRawType,
} from "@/services/apiServices";
import RawMaterialDropdown from "@/components/dropdowns/MealTypeDropdown";
import { Checkbox } from "antd";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";

// ✅ Validation schema
const validationSchema = Yup.object().shape({
  nameEnglish: Yup.string().required("Name (English) is required"),
  nameGujarati: Yup.string().required("Name (ગુજરાતી) is required"),
  nameHindi: Yup.string().required("Name (हिंदी) is required"),
  sequence: Yup.number()
    .typeError("Sequence must be a number")
    .required("Sequence is required"),
  rawMaterialCatTypeId: Yup.string().required("Type is required"),
});

const AddRawMaterial = ({
  isOpen,
  onClose,
  rawMaterialCategory,
  refreshData,
}) => {
  if (!isOpen) return null;

  const [options, setOptions] = useState([]);

  // Fetch dropdown options
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("userData"));
    if (!userData?.id) return;

    GetRawType(userData.id)
      .then((res) => {
        const rawData =
          res?.data?.data?.["Raw Material Category Type Details"] || [];
        setOptions(
          rawData.map((item) => ({
            label: item.nameEnglish,
            value: item.id,
          }))
        );
      })
      .catch((error) => console.error("Error fetching raw type:", error));
  }, []);

  // Initial values
  const initialValues = {
    nameEnglish: rawMaterialCategory?.name || "",
    nameGujarati: rawMaterialCategory?.nameGujarati || "",
    nameHindi: rawMaterialCategory?.nameHindi || "",
    sequence: rawMaterialCategory?.priority || "",
    rawMaterialCatTypeId: rawMaterialCategory?.rawCatid || "",
    isDirect: rawMaterialCategory?.isDirect || false,
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      const payload = { ...values, userId: userData.id };

      let response;
      if (rawMaterialCategory) {
        response = await EditRawMaterialCat(
          rawMaterialCategory.rawCatid,
          payload
        );
      } else {
        response = await AddRawMaterialCat(payload);
      }

      if (
        response?.data?.msg?.toLowerCase().includes("successfully") ||
        response?.status === 200
      ) {
        Swal.fire({
          title: response?.data?.msg || "Success",
          icon: "success",
          background: "#f5faff",
          color: "#003f73",
          confirmButtonText: "Okay",
          confirmButtonColor: "#005BA8",
        });
        refreshData();
        onClose(false);
      } else {
        Swal.fire(
          "Error",
          response?.data?.msg || "Something went wrong",
          "error"
        );
      }
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.msg || "Something went wrong",
        "error"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {rawMaterialCategory
              ? "Edit Raw Material Category"
              : "New Raw Material Category"}
          </h2>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        {/* Formik Form */}
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ values, setFieldValue, isSubmitting }) => (
            <Form className="space-y-6">
              {/* ✅ Name fields in 1 row (3 columns) */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InputWithIcon label="Name (English)" name="nameEnglish" />

                <InputWithIcon label="Name (हिंदी)" name="nameHindi" />
                <InputWithIcon label="Name (ગુજરાતી)" name="nameGujarati" />
              </div>

              {/* ✅ Rest in 2-column grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Type */}
                <div>
                  <label className="block text-gray-600 font-medium mb-1">
                    Type <span className="text-red-500">*</span>
                  </label>
                  <RawMaterialDropdown
                    value={values.rawMaterialCatTypeId}
                    onChange={(val) =>
                      setFieldValue("rawMaterialCatTypeId", val)
                    }
                    options={options}
                    createBtn={true}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                  />
                  <ErrorMessage
                    name="rawMaterialCatTypeId"
                    component="div"
                    className="text-red-500 text-sm mt-1"
                  />
                </div>

                {/* Sequence */}
                <InputWithIcon label="Sequence" name="sequence" type="number" />

                {/* Checkbox full row */}
                <div className="flex items-center gap-2 mt-2 col-span-2">
                  <Checkbox
                    checked={values.isDirect}
                    onChange={(e) =>
                      setFieldValue("isDirect", e.target.checked)
                    }
                  >
                    Direct Order
                  </Checkbox>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex justify-end mt-6 gap-3">
                <button
                  type="button"
                  onClick={() => onClose(false)}
                  className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
                >
                  {rawMaterialCategory ? "Update" : "Save"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

const InputWithIcon = ({ label, name, type = "text" }) => (
  <div className="relative">
    <label className="block text-gray-600 mb-1">
      {label}
      <span className="text-red-500">*</span>
    </label>
    <Field
      type={type}
      name={name}
      className="border border-gray-300 rounded-lg p-2 w-full"
      placeholder={label}
    />

    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
    {/* Mic icon */}
    <span className="absolute right-2 top-9 text-blue-500 cursor-pointer">
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path d="M10 14a4 4 0 004-4V5a4 4 0 10-8 0v5a4 4 0 004 4zm1 2.93a7 7 0 01-5.2-2.11A1 1 0 104.8 16.8 9 9 0 0010 19a9 9 0 005.2-2.2 1 1 0 00-1.4-1.4A7 7 0 0111 16.93z" />
      </svg>
    </span>
  </div>
);

export default AddRawMaterial;
