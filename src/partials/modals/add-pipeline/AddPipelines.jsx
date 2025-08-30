import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { GetAllRole } from "@/services/apiServices"; // <-- adjust path if needed
import { set } from "date-fns";


const AddPipelines = ({ isModalOpen, setIsModalOpen }) => {

  console.log("zxddsdsdsd");
  console.log(isModalOpen);
  
  
  const [taskAccess, setTaskAccess] = useState(true);
  const [leaveAccess, setLeaveAccess] = useState(true);

  const [roles, setRoles] = useState([]); // store roles from API
  const [selectedRole, setSelectedRole] = useState("");

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

   useEffect(() => {
  if (isModalOpen) {
    GetAllRole()
      .then((res) => {
        console.log("Roles API response:", res.data.data["Role Details"]); // 👈 debug
        setRoles(res.data.data["Role Details"]);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setRoles([]);
      });
  }
}, [isModalOpen]);


  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title="Add New Pipeline"
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
            <button key="save" className="btn btn-success" title="Save">
              Save
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Pipeline Name</label>
              <div className="input">
                <i className="ki-filled ki-user"></i>
                <input
                  type="text"
                  className="h-full"
                  placeholder="Pipeline Name"
                />
              </div>
            </div>
            <div className="flex flex-col">
              <label className="form-label">Role</label>
              <select
                className="select pe-7.5"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select Role</option>
                {roles.map((role) => (
                  <option key={role.id} value={role.name}>
                    {role.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </CustomModal>
    )
  );
};
export default AddPipelines;
