import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Checkbox } from "@mui/material";
import AddRoleModal from "../add-role-modal/AddRoleModal";
import { AddRights, GetAllRole } from "@/services/apiServices";
import axios from "axios";
import Swal from "sweetalert2";

const AddRole = ({ isModalOpen, setIsModalOpen, editData, onRoleAdded }) => {
  const [formData, setFormData] = useState({});
  const [openAddRoleModal, setOpenAddRoleModal] = useState(false);
  const [pages, setPages] = useState([]);
  const [roles, setRoles] = useState([]);
  const [rights, setRights] = useState({});
  const [activeTab, setActiveTab] = useState("pages");

  const API_BASE = import.meta.env.VITE_API_BASE_URL;
  const userId = localStorage.getItem("userId");

  /* ---------------- RESET ---------------- */
  const resetForm = () => {
    setFormData({});
    setRights({});
    setActiveTab("pages");
  };

  /* ---------------- FETCH ROLES ---------------- */
  const fetchRoles = async () => {
    try {
      const res = await GetAllRole(userId);
      setRoles(res.data?.data?.["Role Details"] || []);
    } catch {
      setRoles([]);
    }
  };

  /* ---------------- FETCH PAGES ---------------- */
  const fetchPages = async () => {
    try {
      const res = await axios.get(`${API_BASE}/user-rights/getPages`);
      setPages(res.data?.data?.["UserRightsPages"] || []);
    } catch {
      setPages([]);
    }
  };

  /* ---------------- FETCH ROLE RIGHTS (EDIT) ---------------- */
  const fetchRoleRights = async (roleId) => {
    try {
      const res = await axios.get(
        `${API_BASE}/user-rights/getRoleRights/${roleId}`
      );

      const assignedRights = res.data?.data || [];
      const formatted = {};

      assignedRights.forEach((item) => {
        formatted[item.pageid] = {
          pageid: item.pageid,
          view: item.view,
          edit: item.edit,
          delete: item.delete,
          add: item.add,
        };
      });

      setRights(formatted);
    } catch (err) {
      console.error("Error fetching role rights", err);
    }
  };

  /* ---------------- EFFECT ---------------- */
  useEffect(() => {
    if (!isModalOpen) return;

    fetchPages();
    fetchRoles();

    if (editData) {
      setFormData({ role_name: editData.role_name });
      fetchRoleRights(editData.id);
    } else {
      resetForm();
    }
  }, [isModalOpen, editData]);

  /* ---------------- HANDLERS ---------------- */
  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (pageId, action, checked) => {
    setRights((prev) => ({
      ...prev,
      [pageId]: {
        ...prev[pageId],
        pageid: pageId,
        [action]: checked,
      },
    }));
  };

  /* ---------------- HANDLE ROLE ADDED FROM NESTED MODAL ---------------- */
  const handleRoleAddedFromModal = async () => {
    await fetchRoles(); // Update AddRole's own dropdown

    // ✅ Notify parent (AddMember) to update its dropdown
    if (onRoleAdded) {
      onRoleAdded();
    }
  };
  const handleAddRole = async () => {
    const role = roles.find((r) => r.name === formData.role_name);

    if (!role) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Role not selected",
      });
      return;
    }

    const actions = ["view", "edit", "delete", "add"];

    const rightsList = Object.values(rights).map((item) => ({
      pageid: item.pageid,
      ...actions.reduce((acc, action) => {
        acc[action] = !!item[action];
        return acc;
      }, {}),
    }));

    const payload = {
      roleId: role.id,
      rightsList,
    };

    try {
      const res = await AddRights(payload);

      // ✅ Handle both success and failure from backend
      if (res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: res.data.msg, // show BE success message
          position: "top-end",
          timer: 1500,
          showConfirmButton: false,
        });

        resetForm();
        handleModalClose();
        onRoleAdded?.(); // refresh parent's dropdown
      } else {
        // ❌ Backend returned success: false
        Swal.fire({
          icon: "error",
          title: "Error",
          text: res?.data?.msg || "Something went wrong!", // <-- show BE msg
        });
      }
    } catch (err) {
      // ❌ catch network or server errors
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err?.response?.data?.msg || "Server error",
      });
    }
  };

  /* ---------------- UI ---------------- */
  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Assign User Rights"
        width={650}
        footer={[
          <div className="flex justify-between" key="footer">
            <button className="btn btn-light" onClick={handleModalClose}>
              Cancel
            </button>
            <button className="btn btn-success" onClick={handleAddRole}>
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-3 max-h-[500px] overflow-auto">
          {/* ROLE SELECT */}
          <div className="flex flex-col">
            <label className="form-label">Department</label>

            <div className="relative input flex items-center">
              <i className="ki-filled ki-user"></i>

              <select
                className="h-full w-full bg-transparent outline-none pr-10"
                name="role_name"
                value={formData.role_name || ""}
                onChange={handleInputChange}
              >
                <option value="">Select Department</option>
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

          {/* RIGHTS TABLE */}
          <div className="border rounded-lg overflow-hidden">
            <div className="flex border-b bg-gray-200">
              <button className="px-4 py-2 font-bold text-primary border-b-2 border-primary">
                Pages
              </button>
            </div>

            <table className="min-w-full table-auto">
              <thead className="bg-gray-100">
                <tr>
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
                      <td key={action} className="text-center">
                        <Checkbox
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
        </div>

        {/* ADD ROLE MODAL */}
        <AddRoleModal
          isModalOpen={openAddRoleModal}
          setIsModalOpen={setOpenAddRoleModal}
          onRoleAdded={handleRoleAddedFromModal} // ✅ Updated to use new handler
        />
      </CustomModal>
    )
  );
};

AddRole.propTypes = {
  isModalOpen: PropTypes.bool.isRequired,
  setIsModalOpen: PropTypes.func.isRequired,
  editData: PropTypes.object,
  onRoleAdded: PropTypes.func, // ✅ ADD THIS
};

export default AddRole;
