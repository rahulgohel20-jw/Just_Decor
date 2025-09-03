import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { GetAllRole, AddMember as AddMemberapi, UpdateMember } from "@/services/apiServices"; // <-- renamed API fn
import { parse } from "qs";

const AddMember = ({ isModalOpen, setIsModalOpen, refreshData, selectedMember }) => {
  const [taskAccess, setTaskAccess] = useState(true);
  const [leaveAccess, setLeaveAccess] = useState(true);

  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    companyEmail: "",
    contactNo: "",
    officeNo: "",
    countryId: "",
    stateId: "",
    cityId: "",
    address: "",
    companyName: "",
  });

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData?.id;

  useEffect(() => {
  if (isModalOpen) {
    // fetch roles on open
    let userData = JSON.parse(localStorage.getItem("userData"));
    let Id = userData?.id;

    GetAllRole(Id)
      .then((res) => {
        console.log("Roles API response:", res.data.data["Role Details"]);
        setRoles(res.data.data["Role Details"]);
      })
      .catch((err) => {
        console.error("Error fetching roles:", err);
        setRoles([]);
      });
  }
}, [isModalOpen]);

// Prefill form when editing
useEffect(() => {
  if (selectedMember) {
    console.log("Selected member for editing:", selectedMember);
    setFormData({
      firstName: selectedMember.full_name?.split(" ")[0] || "", // split from full_name
      lastName: selectedMember.full_name?.split(" ")[1] || "",  // optional last name
      email: selectedMember.email || "",
      companyEmail: selectedMember.companyEmail || "", // if not present, keep blank
      contactNo: selectedMember.contact || "",
      officeNo: selectedMember.officeNo || "",
      countryId: selectedMember.country || "",
      stateId: selectedMember.state || "",
      cityId: selectedMember.city || "",
      address: selectedMember.address || "",
      role: selectedMember.role || "",
      companyName: selectedMember.companyName || "",
    });
    console.log("Prefilling form with:", formData);

    // role comes as string, match it with roleId if needed
    setSelectedRole(selectedMember.role || "");

    // booleans
    setTaskAccess(selectedMember.task_access ?? true);
    setLeaveAccess(
      selectedMember.leave_attendence_access === true ||
      selectedMember.leave_attendence_access === "true"
    );
  } else {
    // reset for add member
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      companyEmail: "",
      contactNo: "",
      officeNo: "",
      countryId: "",
      stateId: "",
      cityId: "",
      address: "",
      companyName: "",
    });
    setSelectedRole("");
    setTaskAccess(true);
    setLeaveAccess(true);
  }
}, [selectedMember, isModalOpen]);





  const handleSave = async () => {
  try {
    const userData = localStorage.getItem("userData");
    if (!userData) {
      console.error("No userData in localStorage");
      return;
    }

    const parsedData = JSON.parse(userData);

    // Common payload fields
    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      companyEmail: formData.companyEmail,
      contactNo: formData.contactNo,
      address: formData.address || parsedData.userBasicDetails.address,
      officeNo: formData.officeNo || parsedData.userBasicDetails.officeNo,
      companyName: formData.companyName || parsedData.userBasicDetails.companyName,

      // static values
      countryCode: "+91",
      cityId: Number(formData.cityId) || 1,
      stateId: Number(formData.stateId) || 1,
      countryId: Number(formData.countryId) || 1,
      reportingManagerId: 0,

      // localStorage values
      clientId: parsedData.id,
      planId: parsedData.plan.id,

      // role & access toggles
      roleId: Number(selectedRole),
      isTaskAccess: taskAccess,
      isAttendanceLeaveAccess: leaveAccess,
    };

    // 👉 Add memberId if editing
    if (selectedMember?.memberid) {
      payload.memberId = selectedMember.memberid;
    }

    console.log("🚀 Sending payload:", payload);

    let res;
    if (selectedMember?.memberid) {
      // EDIT
      res = await UpdateMember(payload); // <-- your edit API
      console.log("✏️ Member updated:", res.data);
    } else {
      // ADD
      res = await AddMemberapi(payload);
      console.log("✅ Member added:", res.data);
    }

    refreshData();
    handleModalClose();
  } catch (err) {
    console.error("❌ Error saving member:", err.response?.data || err);
  }
};



  return (
    isModalOpen && (
      <CustomModal
        open={isModalOpen}
        onClose={handleModalClose}
        title={selectedMember ? "Edit Member" : "New Member"}
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
              onClick={handleSave}
              title="Save"
            >
              {selectedMember ? "Update" : "Save"}
            </button>
          </div>,
        ]}
      >
        <div className="flex flex-col gap-y-2">
          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="First name"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Last name"
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Country</label>
              <input
                type="text"
                name="countryId"
                value={formData.countryId}
                onChange={handleChange}
                placeholder="Country "
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">State </label>
              <input
                type="text"
                name="stateId"
                value={formData.stateId}
                onChange={handleChange}
                placeholder="State "
                className="input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">City </label>
              <input
                type="text"
                name="cityId"
                value={formData.cityId}
                onChange={handleChange}
                placeholder="City "
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">WhatsApp No</label>
              <input
                type="text"
                name="contactNo"
                value={formData.contactNo}
                onChange={handleChange}
                placeholder="WhatsApp no"
                className="input"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="form-label">Role</label>
            <select
              className="select"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
            >
              <option value="">Select Role</option>
              {roles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-x-4">
            <div className="flex flex-col">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Email address"
                className="input"
              />
            </div>
            <div className="flex flex-col">
              <label className="form-label">Office Email</label>
              <input
                type="email"
                name="companyEmail"
                value={formData.companyEmail}
                onChange={handleChange}
                placeholder="Office email"
                className="input"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 mt-1">
  <label className="form-label">Task Access</label>
  <label className="switch switch-lg">
    <input
      type="checkbox"
      checked={taskAccess}               // bind directly to state
      onChange={() => setTaskAccess(!taskAccess)} // toggle state
    />
  </label>
</div>

<div className="flex items-center gap-2 mt-1">
  <label className="form-label">Leave & Attendance Access</label>
  <label className="switch switch-lg">
    <input
      type="checkbox"
      checked={leaveAccess}
      onChange={() => setLeaveAccess(!leaveAccess)}
    />
  </label>
</div>

        </div>
      </CustomModal>
    )
  );
};

export default AddMember;
