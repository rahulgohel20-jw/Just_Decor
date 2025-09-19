import { useState, useEffect } from "react";
import { editSubCategory, AddSubCategory } from "@/services/apiServices";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { formValidation } from "../../../lib/utils";
import Swal from "sweetalert2";
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
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      if (editData) {
        const payload = { ...formData, userId: userData.id };

        editSubCategory(editData.id, payload)
          .then((res) => {
            refreshData();
            setIsModalOpen();

            if (res.data?.msg) {
              Swal.fire("Success", res.data.msg, "success");
            } else {
              Swal.fire(
                "Success",
                "Sub Category updated successfully!",
                "success"
              );
            }
          })
          .catch((error) => {
            const errorMsg =
              error?.response?.data?.msg ||
              "Something went wrong while updating";
            Swal.fire("Error", errorMsg, "error");
            console.error("Error editing meal:", error);
          });
      } else {
        const payload = { ...formData, userId: userData.id };

        AddSubCategory(payload)
          .then((res) => {
            refreshData();
            setIsModalOpen();

            if (res.data?.msg) {
              Swal.fire("Success", res.data.msg, "success");
            } else {
              Swal.fire(
                "Success",
                "Sub Category added successfully!",
                "success"
              );
            }
          })
          .catch((error) => {
            const errorMsg =
              error?.response?.data?.msg || "Something went wrong while adding";
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

  useEffect(() => {
    if (editData) {
      setFormData({
        nameEnglish: editData.nameEnglish || "",
        nameGujarati: editData.nameGujarati || "",
        nameHindi: editData.nameHindi || "",
      });
    } else if (isModalOpen) {
      setFormData(initialFormState);
      setErrors({});
    }
  }, [editData, isModalOpen]);

  return (
    <>
      <CustomModal
        open={isModalOpen}
        width={1000}
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
              className="btn-primary text-white px-4 py-2 rounded-md"
              onClick={handleSubmit}
            >
              {editData ? "Update" : "Save"}
            </button>
          </div>,
        ]}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
