import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Checkbox } from "@mui/material";
import AddRoleModal from "../add-role-modal/AddRoleModal";
import { AddRights, GetAllRole } from "@/services/apiServices";
import axios from "axios";
import Swal from "sweetalert2";

const AddRole = ({ isModalOpen, setIsModalOpen }) => {
  const [formData, setFormData] = useState({});
  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
  const [pages, setPages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState({});
  const resetForm = () => {
    setFormData({});
    setRights({});
    setActiveTab("pages");
  };

  useEffect(() => {
    if (!isModalOpen) return;
    const API_BASE = import.meta.env.VITE_API_BASE_URL;

    axios.get(`${API_BASE}/user-rights/getPages`).then((res) => {
      console.log("Pages response:", res.data);
      setPages(res.data?.data["UserRightsPages"] || []);
    });

    const userid = localStorage.getItem("userId");

    GetAllRole(userid)
      .then((res) => {
        console.log("Roles:", res.data);
        const list = res.data?.data["Role Details"] || [];
        setRoles(list);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
      });
  }, [isModalOpen]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleCheckboxChange = (pageId, action, checked) => {
    setRights((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        [action]: checked,
        pageid: pageId,
      },
    }));
  };

  const handleAddRole = () => {
    const role = roles.find((r) => r.name === formData.role_name);

    const payload = {
      roleId: role?.id || 0,
      rightsList: Object.values(rights),
    };

    console.log("FINAL PAYLOAD:", payload);

    AddRights(payload)
      .then((res) => {
        if (res.success == true) {
          Swal.fire({
            icon: "success",
            title: "Success",
            text: "User rights added successfully!",
            confirmButtonColor: "#3085d6",
          });
          resetForm();
          handleModalClose();
        } else {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: err?.response?.data?.message || "Something went wrong!",
            confirmButtonColor: "#d33",
          });
          resetForm();
        }
      })
      .catch((err) => {
        console.error("Error:", err);

        Swal.fire({
          icon: "error",
          title: "Error",
          text: err?.response?.data?.message || "Something went wrong!",
          confirmButtonColor: "#d33",
        });
      });
  };

  const [activeTab, setActiveTab] = useState("pages");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add Rights"
        width={650}
        footer={[
          <div className="flex justify-between" key={"footer-buttons"}>
            <button
              key="cancel"
              className="btn btn-light"
              onClick={handleModalClose}
              title="Cancel"
            >
              Cancel
            </button>
            <button
              key="save"
              className="btn btn-success"
              title="Save"
              onClick={handleAddRole}
            >
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-2 max-h-[500px] overflow-auto scrollable-y">
          <div className="flex flex-col">
            <label className="form-label"> Role</label>

            <div className="relative input flex items-center">
              <i className="ki-filled ki-user"></i>

              <select
                className="h-full w-full bg-transparent outline-none pr-10"
                name="role_name"
                value={formData.role_name || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Role</option>

                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOpenAddRoleModal(true)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center"
              >
                <i className="ki-filled ki-plus text-xs"></i>
              </button>
            </div>
          </div>

          <div className="flex flex-col border mt-2 rounded-lg overflow-hidden">
            <div className="flex border-b pt-3 mb-3 bg-gray-200">
              <button
                onClick={() => setActiveTab("pages")}
                className={`px-4 py-2 text-sm font-medium ${
                  activeTab === "pages"
                    ? "border-b-2 border-primary text-primary font-bold"
                    : "text-gray-700 border-b-2 border-gray-200"
                }`}
              >
                <i className="ki-filled ki-notepad-bookmark me-2"></i>
                Pages
              </button>
            </div>

            {activeTab === "pages" && (
              <div className="w-full overflow-x-auto">
                <table className="min-w-full table-auto">
                  <thead>
                    <tr className="bg-gray-100 text-left">
                      <th className="p-3">Page Name</th>
                      <th className="p-3 text-center">View</th>
                      <th className="p-3 text-center">Edit</th>
                      <th className="p-3 text-center">Delete</th>
                      <th className="p-3 text-center">Add</th>
                    </tr>
                  </thead>

                  <tbody>
                    {pages.map((page) => (
                      <tr key={page.pageId} className="border-t">
                        <td className="p-3">{page.pagename}</td>

                        {["view", "edit", "delete", "add"].map((action) => (
                          <td key={action} className="p-4 text-center">
                            <Checkbox
                              size="medium"
                              checked={rights[page.pageId]?.[action] || false}
                              onChange={(e) =>
                                handleCheckboxChange(
                                  page.pageId,
                                  action,
                                  e.target.checked
                                )
                              }
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
        <AddRoleModal
          isModalOpen={openAddRoleModal}
          setIsModalOpen={setOpenAddRoleModal}
        />
      </CustomModal>
    )
  );
};
AddRole.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
};

export default AddRole;
