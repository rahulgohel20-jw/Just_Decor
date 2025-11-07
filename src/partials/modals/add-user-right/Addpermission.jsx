import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import {
  AddContactMasterType,
  EditContactType,
} from "@/services/apiServices";

const AddPermission = ({ isOpen, onClose, contactType, refreshData }) => {
  if (!isOpen) return null;

  const [permissions, setPermissions] = useState([
    { name: "Dashboard", create: true, update: false, view: false },
    { name: "Master", create: true, update: false, view: false },
    { name: "Raw Material Master", create: true, update: false, view: false },
    { name: "Dish Costing", create: true, update: false, view: false },
    { name: "User Master", create: true, update: false, view: false },
    { name: "Settings", create: true, update: false, view: false },
  ]);

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Group name is required"),
  });

  const handlePermissionChange = (index, field) => {
    setPermissions((prev) =>
      prev.map((item, i) =>
        i === index ? { ...item, [field]: !item[field] } : item
      )
    );
  };

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const userData = JSON.parse(localStorage.getItem("userData"));
      if (!userData?.id) {
        Swal.fire("Error", "User not found", "error");
        return;
      }

      const payload = {
        ...values,
        permissions,
        userId: userData.id,
      };

      if (contactType) {
        await EditContactType(contactType.contacttypeid, payload);
        Swal.fire("Updated!", "Security group updated successfully.", "success");
      } else {
        await AddContactMasterType(payload);
        Swal.fire("Saved!", "Security group added successfully.", "success");
      }

      refreshData?.();
      onClose(false);
    } catch (error) {
      console.error("Error saving permissions:", error);
      Swal.fire("Error", "Something went wrong!", "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              {contactType ? (
                <FormattedMessage
                  id="USER.MASTER.EDIT_CONTACT_TYPE"
                  defaultMessage="Security Groups"
                />
              ) : (
                <FormattedMessage
                  id="USER.MASTER.NEW_CONTACT_TYPE"
                  defaultMessage="Security Groups"
                />
              )}
            </h2>
            <p className="text-gray-500 text-sm">
              Manage Rights. Maintain Security.
            </p>
          </div>
          <button
            onClick={() => onClose(false)}
            className="text-2xl text-gray-600 hover:text-gray-800"
          >
            &times;
          </button>
        </div>

        {/* Form */}
       <Formik
  initialValues={{ nameEnglish: "" }}
  validationSchema={validationSchema}
  onSubmit={handleSubmit}
>
  {({ isSubmitting }) => (
    <Form className="space-y-6">
      {/* Permission Table */}
      <div className="rounded-lg overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-4 bg-[#005BA8] text-white font-medium text-center py-2">
         <div className="flex items-center justify-center gap-2">
    
     Permission<input
      type="checkbox"
      className="w-5 h-5 accent-white cursor-pointer"
      onChange={() => {
        // Optional: add select-all logic here
        const allChecked = permissions.every((p) => p.permission);
        setPermissions((prev) =>
          prev.map((p) => ({ ...p, permission: !allChecked }))
        );
      }}
    />
   </div>
          <div className="border-l border-white">Create</div>
          <div className="border-l border-white">Update</div>
          <div className="border-l border-white">View</div>
        </div>

        {/* Member Section */}
        <div className="max-h-96 overflow-y-auto border-t border-b border-gray-200">
          <div className="bg-[#F7FAFF] text-gray-700 font-semibold text-center py-2 sticky top-0">
            Member
          </div>

          {/* Permission Rows */}
          <div className="divide-y divide-gray-200">
            {permissions.map((perm, index) => (
              <div
                key={index}
                className="grid grid-cols-4 items-center text-center py-3 hover:bg-gray-50"
              >
                <div className="text-gray-700 font-medium text-left pl-4">
                  {perm.name}
                </div>

                {["create", "update", "view"].map((field, i) => (
                  <div
                    key={field}
                    className={`flex justify-center ${
                      i !== 0 ? "border-l border-gray-200" : ""
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={perm[field]}
                      onChange={() => handlePermissionChange(index, field)}
                      className="w-5 h-5 accent-[#005BA8] cursor-pointer"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Buttons */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          type="button"
          onClick={() => onClose(false)}
          className="px-5 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-5 py-2 bg-[#005BA8] text-white rounded-md hover:bg-[#004a8a]"
        >
          {contactType ? "Update" : "Save"}
        </button>
      </div>
    </Form>
  )}
</Formik>

      </div>
    </div>
  );
};

export default AddPermission;
