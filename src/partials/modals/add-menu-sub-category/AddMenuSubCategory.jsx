import { useState, useEffect } from "react";
import {
  editSubCategory,
  AddSubCategory,
  Translateapi,
} from "@/services/apiServices";
import { CustomModal } from "../../../components/custom-modal/CustomModal";
import MultiLangInputBox from "../../../components/form-inputs/MultiLangInputbox";
import { formValidation } from "../../../lib/utils";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { useIntl } from "react-intl";

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
  const [debounceTimer, setDebounceTimer] = useState(null);

  const intl = useIntl();

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
      const Userid = localStorage.getItem("userId");
      if (!Userid) {
        Swal.fire("Error", "User data not found", "error");
        return;
      }

      const payload = { ...formData, userId: Userid };

      if (editData) {
        editSubCategory(editData.id, payload)
          .then((res) => {
            refreshData();
            setIsModalOpen();
            Swal.fire(
              "Success",
              res.data?.msg || "Sub Category updated successfully!",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              error?.response?.data?.msg ||
                "Something went wrong while updating",
              "error"
            );
            console.error("Error editing meal:", error);
          });
      } else {
        AddSubCategory(payload)
          .then((res) => {
            refreshData();
            setIsModalOpen();
            Swal.fire(
              "Success",
              res.data?.msg || "Sub Category added successfully!",
              "success"
            );
          })
          .catch((error) => {
            Swal.fire(
              "Error",
              error?.response?.data?.msg || "Something went wrong while adding",
              "error"
            );
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
    <CustomModal
      open={isModalOpen}
      width={1000}
      onClose={() => setIsModalOpen(false)}
      title={
        editData ? (
          <FormattedMessage
            id="EDIT_MENU_SUB_CATEGORY"
            defaultMessage="Edit Menu Sub Category"
          />
        ) : (
          <FormattedMessage
            id="NEW_MENU_SUB_CATEGORY"
            defaultMessage="New Menu Sub Category"
          />
        )
      }
      footer={[
        <div className="flex justify-end" key="footer-buttons">
          <button
            type="button"
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md mr-2"
            onClick={() => setIsModalOpen(false)}
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button
            type="button"
            className="btn-primary text-white px-4 py-2 rounded-md"
            onClick={handleSubmit}
          >
            {editData ? (
              <FormattedMessage id="COMMON.UPDATE" defaultMessage="Update" />
            ) : (
              <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
            )}
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
          label={intl.formatMessage({
            id: "COMMON.NAME",
            defaultMessage: "Name",
          })}
          error={errors.nameEnglish}
          required
        />
      </div>
    </CustomModal>
  );
};

export default AddMenuSubCategory;
