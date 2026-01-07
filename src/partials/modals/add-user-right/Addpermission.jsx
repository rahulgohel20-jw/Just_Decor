import { useState, useEffect } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { FormattedMessage } from "react-intl";
import { AddRights } from "@/services/apiServices";

const AddPermission = ({
  isOpen,
  onClose,
  contactType,
  permissionsData,
  refreshData,
}) => {
  if (!isOpen) return null;

  const [permissions, setPermissions] = useState([]);

  useEffect(() => {
    if (permissionsData?.length > 0) {
      setPermissions(permissionsData);
    }
  }, [permissionsData]);

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
  const handleSubmit = async () => {
    try {
      const payload = {
        roleId: permissionsData[0].roleId,
        rightsList: permissions.map((perm) => ({
          pageid: perm.pageid,
          view: perm.view || false,
          edit: perm.Edit || false,
          delete: perm.Delete || false,
          add: perm.Add || false,
        })),
      };

      const res = await AddRights(payload);

      if (res?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Permissions updated successfully!",
        });

        refreshData();
        onClose(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.data?.message || "Something went wrong!",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "API Failed",
        text: "Unable to update permissions!",
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-5xl p-6 relative overflow-y-auto max-h-[90vh]">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold text-gray-800">
              Permissions - {contactType?.role}
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
          initialValues={{ nameEnglish: contactType?.role || "" }}
          enableReinitialize
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="space-y-6">
              {/* Permissions Table */}
              <div className="rounded-lg overflow-hidden border border-gray-200">
                <div className="grid grid-cols-5 bg-[#005BA8] text-white font-medium text-center py-2">
                  <div>Permission</div>
                  <div className="border-l border-white">Add</div>
                  <div className="border-l border-white">Edit</div>
                  <div className="border-l border-white">View</div>
                  <div className="border-l border-white">Delete</div>
                </div>

                <div className="max-h-96 overflow-y-auto divide-y divide-gray-200">
                  {permissions.map((perm, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-5 items-center text-center py-3 hover:bg-gray-50"
                    >
                      <div className="text-gray-700 font-medium text-left pl-4">
                        {perm?.name}
                      </div>

                      {["Add", "Edit", "view", "Delete"].map((field, i) => (
                        <div
                          key={field}
                          className={`flex justify-center ${
                            i !== 0 ? "border-l border-gray-200" : ""
                          }`}
                        >
                          <input
                            type="checkbox"
                            checked={perm[field] || false}
                            onChange={() =>
                              handlePermissionChange(index, field)
                            }
                            className="w-5 h-5 accent-[#005BA8] cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  ))}
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
