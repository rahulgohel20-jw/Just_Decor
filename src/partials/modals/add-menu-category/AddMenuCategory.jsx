import { useState, useEffect } from "react";
import {
  editCategory,
  AddCategory,
  Translateapi,
  uploadFile,
} from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { formValidation } from "../../../lib/utils";
import Swal from "sweetalert2";
import { FormattedMessage, useIntl } from "react-intl";

const AddMenuCategory = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  editData,
}) => {
  if (!isModalOpen) return null;

  const intl = useIntl();

  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    menuSlogan: "",
    price: "",
    sequence: "",
    file: null,
  };

  const requiredFields = ["nameEnglish"];

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [debounceTimer, setDebounceTimer] = useState(null);

  /* -------------------- INPUT CHANGE -------------------- */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  /* -------------------- AUTO TRANSLATE -------------------- */
  useEffect(() => {
    if (!formData.nameEnglish) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      Translateapi(formData.nameEnglish)
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            nameGujarati: res?.data?.gujarati || "",
            nameHindi: res?.data?.hindi || "",
          }));
        })
        .catch((err) => console.error("Translation error:", err));
    }, 500);

    setDebounceTimer(timer);
  }, [formData.nameEnglish]);

  /* -------------------- FORM VALIDATION -------------------- */
  const checkErrors = () => {
    const errorObject = formValidation(requiredFields, formData);
    if (Object.keys(errorObject).length > 0) {
      setErrors(errorObject);
      return false;
    }
    setErrors({});
    return true;
  };

  /* -------------------- BUILD FORMDATA -------------------- */
  const buildFormData = (data, userId) => {
    const fd = new FormData();

    Object.keys(data).forEach((key) => {
      if (key === "file") {
        if (data.file) fd.append("file", data.file);
      } else {
        fd.append(key, data[key] ?? "");
      }
    });

    fd.append("userId", userId);
    return fd;
  };

  /* -------------------- SUBMIT -------------------- */
  const handleSubmit = () => {
    if (!checkErrors()) return;

    const userId = localStorage.getItem("userId");
    if (!userId) {
      Swal.fire("Error", "User data not found", "error");
      return;
    }

    const payload = buildFormData(
      {
        ...formData,
        slogan: formData.menuSlogan,
      },
      userId
    );

    /* -------- EDIT -------- */
    if (editData) {
      editCategory(editData.id, payload)
        .then((res) => {
          if (res.data?.success === true) {
            Swal.fire("Success", res.data.msg, "success");
            refreshData();
            setIsModalOpen(false);
          }
        })
        .catch((error) => {
          const msg = error?.response?.data?.msg || "Something went wrong";
          Swal.fire("Error", msg, "error");
        });
    } else {
      /* -------- ADD -------- */
      AddCategory(payload)
        .then((res) => {
          if (res.data?.success === true) {
            Swal.fire("Success", res.data.msg, "success");
            refreshData();
            setIsModalOpen(false);
            return;
          }

          Swal.fire("Error", res.data?.msg || "Something went wrong", "error");
        })
        .catch((error) => {
          const msg = error?.response?.data?.msg || "Something went wrong";
          Swal.fire("Error", msg, "error");
        });
    }
  };

  /* -------------------- PREFILL EDIT -------------------- */
  useEffect(() => {
    if (editData) {
      setFormData({
        ...editData,
        file: null,
      });
    } else {
      setFormData(initialFormState);
    }
  }, [isModalOpen]);

  /* -------------------- UI -------------------- */
  return (
    <CustomModal
      open={isModalOpen}
      width={1000}
      title={editData ? "Edit Menu Category" : "Create New Menu Category"}
      onClose={() => setIsModalOpen(false)}
      footer={[
        <button
          key="cancel"
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
        >
          <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
        </button>,
        <button
          key="save"
          type="button"
          onClick={handleSubmit}
          className="btn-success text-white px-5 py-2 rounded-lg"
        >
          {editData ? (
            <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" />
          ) : (
            <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
          )}
        </button>,
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MultiLangInputBox
          formData={formData}
          setFormData={setFormData}
          name="name"
          label={intl.formatMessage({
            id: "COMMON.NAME",
            defaultMessage: "Name",
          })}
          error={errors.nameEnglish}
        />

        <div>
          <label className="block mb-1">
            <FormattedMessage id="COMMON.PRICE" defaultMessage="Price" />
          </label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1">
            <FormattedMessage id="COMMON.PRIORITY" defaultMessage="Sequence" />
          </label>
          <input
            type="number"
            name="sequence"
            value={formData.sequence}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>

        <div>
          <label className="block mb-1">
            <FormattedMessage id="COMMON.IMAGE" defaultMessage="Image" />
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                file: e.target.files[0],
              }))
            }
            className="border p-2 w-full rounded"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block mb-1">
            <FormattedMessage id="COMMON.SLOGAN" defaultMessage="Slogan" />
          </label>
          <textarea
            name="menuSlogan"
            value={formData.menuSlogan}
            onChange={handleChange}
            className="border p-2 w-full rounded"
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default AddMenuCategory;
