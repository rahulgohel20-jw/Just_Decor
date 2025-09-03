import { useState, useEffect } from "react";
import { editCategory, AddCategory } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { uploadFile } from "../../../services/apiServices";
import { formValidation } from "../../../lib/utils";

const AddMenuCategory = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  editData,
}) => {
  if (!isModalOpen) return null;
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = () => {
    if (checkErrors()) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        alert("User data not found");
        return;
      }
      if (editData) {
        const payload = {
          ...formData,
          userId: userData.id,
          slogan: formData.menuSlogan,
        };

        editCategory(editData.id, payload)
          .then((res) => {
            res.data?.msg && successMsgPopup(res.data.msg);
            uploadImage({
              ModuleId: res.data.ModuleId,
              FileType: res.data.FileType,
              ModuleName: res.data.ModuleName,
            });
          })
          .catch((error) => {
            error?.response?.data?.msg &&
              errorMsgPopup(error.response.data.msg);
            console.error("Error editing meal:", error);
          });
      } else {
        const payload = { ...formData, userId: userData.id };
        AddCategory(payload)
          .then((res) => {
            uploadImage({
              ModuleId: res.data.ModuleId,
              FileType: res.data.FileType,
              ModuleName: res.data.ModuleName,
            });
          })
          .catch((error) => {
            error?.response?.data?.msg &&
              errorMsgPopup(error.response.data.msg);
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
      title={editData ? "Edit Menu Category" : "New Menu Category"}
      onClose={() => setIsModalOpen(false)}
      footer={[
        <button
          type="button"
          onClick={() => setIsModalOpen(false)}
          className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-100 me-2"
        >
          Cancel
        </button>,
        <button
          type="button"
          className="bg-primary text-white px-5 py-2 rounded-lg hover:bg-primary/90 transition"
          onClick={handleSubmit}
        >
          {editData ? "Update" : "Save"}
        </button>,
      ]}
    >
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        {/* Name fields */}
        <MultiLangInputBox
          formData={formData}
          setFormData={setFormData}
          name="name"
          label="Name"
          error={errors.nameEnglish}
        />
        <div className="relative">
          <label className="block text-gray-600 mb-1">{"Slogun"}</label>
          <textarea
            type="text"
            name={"menuSlogan"}
            value={formData.menuSlogan}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={"Slogun"}
          />
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">
            {"Price"}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            name={"price"}
            value={formData.price}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={"price"}
          />
          {errors.price && (
            <span className="text-red-500 text-sm">{errors.price}</span>
          )}
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">
            {"Priority"}
            <span className="text-red-500 ml-1">*</span>
          </label>
          <input
            type="number"
            name={"sequence"}
            value={formData.sequence}
            onChange={handleChange}
            className="border border-gray-300 rounded-lg p-2 w-full"
            placeholder={"Priority"}
            re
          />
          {errors.sequence && (
            <span className="text-red-500 text-sm">{errors.sequence}</span>
          )}
        </div>
        <div className="relative">
          <label className="block text-gray-600 mb-1">{"Image"}</label>
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
            placeholder={"image"}
          />
        </div>
      </div>
    </CustomModal>
  );
};

export default AddMenuCategory;
