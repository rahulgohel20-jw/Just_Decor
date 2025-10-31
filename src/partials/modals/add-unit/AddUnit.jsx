import { useEffect, useState } from "react";
import InputToTextLang from "@/components/form-inputs/InputToTextLang";
import { AddUnitdata, EditUnit, Translateapi } from "@/services/apiServices";
import Swal from "sweetalert2";
import { useFormik } from "formik";
import * as Yup from "yup";
import { FormattedMessage } from "react-intl";

const AddUnit = ({
  isModalOpen,
  setIsModalOpen,
  selectedUnit,
  refreshData,
}) => {
  if (!isModalOpen) return null;
  const [debounceTimer, setDebounceTimer] = useState(null);

  const validationSchema = Yup.object({
    nameEnglish: Yup.string().required("Name  is required"),
    symbolEnglish: Yup.string().required("Symbol  is required"),
  });

  // Separate translate functions
  const triggerTranslateName = (text) => {
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

  const triggerTranslateSymbol = (text) => {
    if (!text?.trim()) return;
    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(text)
        .then((res) => {
          formik.setFieldValue("symbolGujarati", res.data.gujarati || "");
          formik.setFieldValue("symbolHindi", res.data.hindi || "");
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
    },
    validationSchema,
    onSubmit: async (values) => {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      const payload = { ...values, userId: userData.id };

      try {
        if (selectedUnit) {
          const res = await EditUnit(selectedUnit.unitId, payload);
          if (res?.data.success === false) {
            Swal.fire("Error", res.data.msg || "Something went wrong", "error");
            return;
          }
          Swal.fire("Success", "unit updated successfully", "success");
        } else {
          const res = await AddUnitdata(payload);
          if (res?.data.success === false) {
            Swal.fire("Error", res.data.msg || "Something went wrong", "error");
            return;
          }
          Swal.fire("Success", "unit added successfully", "success");
        }
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
    if (formik.values.nameEnglish) {
      triggerTranslateName(formik.values.nameEnglish);
    }
  }, [formik.values.nameEnglish]);

  useEffect(() => {
    if (formik.values.symbolEnglish) {
      triggerTranslateSymbol(formik.values.symbolEnglish);
    }
  }, [formik.values.symbolEnglish]);

  useEffect(() => {
    if (selectedUnit) {
      formik.setValues({
        nameEnglish: selectedUnit.unit || "",
        nameGujarati: selectedUnit.nameGujarati || "",
        nameHindi: selectedUnit.nameHindi || "",
        symbolEnglish: selectedUnit.symbol || "",
        symbolGujarati: selectedUnit.nameGujarati || "",
        symbolHindi: selectedUnit.nameHindi || "",
      });
    }
  }, [selectedUnit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {selectedUnit ? <FormattedMessage id="USER.MASTER.EDIT_UNIT" defaultMessage="Edit Unit" /> : <FormattedMessage id="USER.MASTER.NEW_UNIT" defaultMessage="New Unit" />}
          </h2>
          <button
            onClick={() => setIsModalOpen(false)}
            className="text-2xl text-gray-600"
          >
            &times;
          </button>
        </div>

        <form onSubmit={formik.handleSubmit}>
          {/* Row 1: Name fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.NAME_ENGLISH" defaultMessage="Name (English)" />}
                name="nameEnglish"
                value={formik.values.nameEnglish}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lang="en-US"
                required
                showMicIcon
              />
              {formik.touched.nameEnglish && formik.errors.nameEnglish && (
                <p className="text-red-500 text-sm">
                  {formik.errors.nameEnglish}
                </p>
              )}
            </div>
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.NAME_GUJARATI" defaultMessage="Name (ગુજરાતી)" />}
                name="nameGujarati"
                value={formik.values.nameGujarati}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="gu-US"
                required
                showMicIcon
              />
              {formik.touched.nameGujarati && formik.errors.nameGujarati && (
                <p className="text-red-500 text-sm">
                  {formik.errors.nameGujarati}
                </p>
              )}
            </div>
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.NAME_HINDI" defaultMessage="Name (हिंदी)" />}
                name="nameHindi"
                value={formik.values.nameHindi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="hi"
                required
                showMicIcon
              />
              {formik.touched.nameHindi && formik.errors.nameHindi && (
                <p className="text-red-500 text-sm">
                  {formik.errors.nameHindi}
                </p>
              )}
            </div>
          </div>

          {/* Row 2: Symbol fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.SYMBOL_ENGLISH" defaultMessage="Symbol (English)" />}
                name="symbolEnglish"
                value={formik.values.symbolEnglish}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lang="en-US"
                required
                showMicIcon
              />
              {formik.touched.symbolEnglish && formik.errors.symbolEnglish && (
                <p className="text-red-500 text-sm">
                  {formik.errors.symbolEnglish}
                </p>
              )}
            </div>
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.SYMBOL_GUJARATI" defaultMessage="Symbol (ગુજરાતી)" />}
                name="symbolGujarati"
                value={formik.values.symbolGujarati}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="gu-US"
                required
                showMicIcon
              />
              {formik.touched.symbolGujarati &&
                formik.errors.symbolGujarati && (
                  <p className="text-red-500 text-sm">
                    {formik.errors.symbolGujarati}
                  </p>
                )}
            </div>
            <div>
              <InputToTextLang
                label={<FormattedMessage id="COMMON.SYMBOL_HINDI" defaultMessage="Symbol (हिंदी)" />}
                name="symbolHindi"
                value={formik.values.symbolHindi}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                lng="hi"
                required
                showMicIcon
              />
              {formik.touched.symbolHindi && formik.errors.symbolHindi && (
                <p className="text-red-500 text-sm">
                  {formik.errors.symbolHindi}
                </p>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex w-full justify-end mt-6 gap-3">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100"
            >
              <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
            >
              {selectedUnit ? <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" /> : <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddUnit;
