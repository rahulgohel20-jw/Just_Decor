import { useState, useEffect } from "react";
import { editSubCategory, AddSubCategory } from "@/services/apiServices";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { formValidation } from "../../../lib/utils";
const AddMenuSubCategory = ({
  isModalOpen,
  setIsModalOpen,
  refreshData,
  editData,
}) => {
  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
  };
  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const requiredFields = ["nameEnglish"];

  const handleSubmit = () => {
    if (checkErrors()) {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        alert("User data not found");
        return;
      }
      if (editData) {
        const payload = { ...formData, userId: userData.id };

        editSubCategory(editData.id, payload)
          .then((res) => {
            refreshData();
            setIsModalOpen();
            res.data?.msg && successMsgPopup(res.data.msg);
          })
          .catch((error) => {
            console.error("Error editing meal:", error);
            error?.response?.data?.msg &&
              errorMsgPopup(error.response.data.msg);
          });
      } else {
        const payload = { ...formData, userId: userData.id };
        AddSubCategory(payload)
          .then((res) => {
            res.data?.msg && successMsgPopup(res.data.msg);
            refreshData();
            setIsModalOpen();
            console.log("sss", res);
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

  useEffect(() => {
    if (editData) {
      setFormData({
        nameEnglish: editData.nameEnglish || "",
        nameGujarati: editData.nameGujarati || "",
        nameHindi: editData.nameHindi || "",
      });
    } else {
      setFormData(initialFormState);
    }
  }, [editData]);

  return (
    <>
      <CustomModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editData ? "Edit Menu Sub Category" : "New Menu Sub Category"}
        footer={[
          <div className="flex justify-end">
            <button
              type="button"
              className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-success text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              {editData ? "Update" : "Create"}
            </button>
          </div>,
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
            required
          />
        </div>
      </CustomModal>
    </>
  );
};

export default AddMenuSubCategory;
