import { useState, useEffect } from "react";
import {
  editCategory,
  AddCategory,
  Translateapi,
} from "@/services/apiServices"; // ✅ added Translateapi
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { uploadFile } from "@/services/apiServices";
import { formValidation } from "../../../lib/utils";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

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
    file: "",
  };
  const requiredFields = ["nameEnglish", "price", "sequence"];
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [debounceTimer, setDebounceTimer] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Auto-translate English → Gujarati & Hindi
  useEffect(() => {
    if (formData.nameEnglish) {
      if (debounceTimer) clearTimeout(debounceTimer);

      const timer = setTimeout(() => {
        Translateapi(formData.nameEnglish)
          .then((res) => {
            setFormData((prev) => ({
              ...prev,
              nameGujarati: res.data.gujarati || "",
              nameHindi: res.data.hindi || "",
            }));
          })
          .catch((err) => console.error("Translation error:", err));
      }, 500);

      setDebounceTimer(timer);
    }
  }, [formData.nameEnglish]);

  const handleSubmit = () => {
    if (checkErrors()) {
      const Id = localStorage.getItem("userId");
      if (!Id) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      if (editData) {
        const payload = {
          ...formData,
          userId: Id,
          slogan: formData.menuSlogan,
        };

        editCategory(editData.id, payload)
          .then((res) => {
            if (res.data?.status === true) {
              Swal.fire("Success", res.data.msg, "success");
            }
            uploadImage({
              ModuleId: res.data.ModuleId,
              FileType: res.data.FileType,
              ModuleName: res.data.ModuleName,
            });
          })
          .catch((error) => {
            const errorMsg =
              error?.response?.data?.msg || "Something went wrong";
            Swal.fire("Error", errorMsg, "error");
            console.error("Error editing meal:", error);
          });
      } else {
        const payload = { ...formData, userId: Id };
        AddCategory(payload)
          .then((res) => {
            Swal.fire("Success", "Category added successfully!", "success");
            uploadImage({
              ModuleId: res.data.ModuleId,
              FileType: res.data.FileType,
              ModuleName: res.data.ModuleName,
            });
          })
          .catch((error) => {
            const errorMsg =
              error?.response?.data?.msg || "Something went wrong";
            Swal.fire("Error", errorMsg, "error");
            console.error("Error adding meal:", error);
          });
      }
    }
  };

  const checkErrors = () => {
    let errorObject = formValidation(requiredFields, formData);

    if (Object.keys(errorObject).length > 0) {
      setErrors(errorObject);
      return false;
    }
    setErrors({});
    return true;
  };

  const uploadImage = (uploadRequest) => {
    if (!formData.file) {
      refreshData();
      setIsModalOpen();
      return;
    }

    const request = new FormData();
    request.append("moduleId", uploadRequest.ModuleId);
    request.append("moduleName", uploadRequest.ModuleName);
    request.append("fileType", uploadRequest.FileType);
    request.append("file", formData.file);

    uploadFile(request)
      .then((res) => {
        res.data?.msg && successMsgPopup(res.data.msg);
        refreshData();
        setIsModalOpen();
      })
      .catch((error) => {
        error?.response?.data?.msg && errorMsgPopup(error.response.data.msg);
        console.error("Error uploading image:", error);
      });
  };

  useEffect(() => {
    if (editData) {
      setFormData(editData);
    } else {
      setFormData(initialFormState);
    }
  }, [isModalOpen]);

  return (
    <CustomModal
      open={isModalOpen}
      width={1000}
      title={editData ? "Edit Menu Category" : "New Menu Category"}
      onClose={() => setIsModalOpen(false)}
      footer={[
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
        >
          <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
        </button>,
        <button
          type="button"
          className="btn-success text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          onClick={handleSubmit}
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
        {/* Name fields */}
        <MultiLangInputBox
          formData={formData}
          setFormData={setFormData}
          name="name"
          label={intl.formatMessage({
            id: "COMMON.NAME",
            defaultMessage: "Name",
          })}
          placeholder={intl.formatMessage({
            id: "COMMON.NAME",
            defaultMessage: "Name",
          })}
          error={errors.nameEnglish}
        />

        <div className="relative">
          <label className="block text-gray-600 mb-1">
            <FormattedMessage id="COMMON.PRICE" defaultMessage="Price" />
            <span className="mandatory ms-0.5 text-base text-red-500 font-medium ml-1">
              *
            </span>
          </label>
          <input
            type="number"
            name={"price"}
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={intl.formatMessage({
              id: "COMMON.PRICE",
              defaultMessage: "Price",
            })}
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price}</span>
          )}
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">
            <FormattedMessage id="COMMON.PRIORITY" defaultMessage="Priority" />
            <span className="mandatory ms-0.5 text-base text-red-500 font-medium ml-1">
              *
            </span>
          </label>
          <input
            type="number"
            name={"sequence"}
            value={formData.sequence}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={intl.formatMessage({
              id: "COMMON.PRIORITY",
              defaultMessage: "Priority",
            })}
          />
          {errors.sequence && (
            <span className="text-red-500 text-sm">{errors.sequence}</span>
          )}
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">
            <FormattedMessage id="COMMON.IMAGE" defaultMessage="Image" />
          </label>
          <input
            type="file"
            name={"file"}
            accept="image/*"
            onChange={(e) => {
              const file = e.target.files[0];
              setFormData((prev) => ({
                ...prev,
                file: file,
              }));
            }}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={intl.formatMessage({
              id: "COMMON.IMAGE",
              defaultMessage: "Image",
            })}
          />
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">
            <FormattedMessage id="COMMON.SLOGAN" defaultMessage="Slogan" />
          </label>
          <textarea
            type="text"
            name={"menuSlogan"}
            value={formData.menuSlogan}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={intl.formatMessage({
              id: "COMMON.SLOGAN",
              defaultMessage: "Slogan",
            })}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default AddMenuCategory;
