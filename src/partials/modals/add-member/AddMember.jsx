import { useEffect, useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { GetAllRole, AddMember as AddMemberapi, UpdateMember, getUserById } from "@/services/apiServices"; // <-- renamed API fn
import Select from "react-select";
import { fetchCountries, fetchStatesByCountry, fetchCitiesByState } from "@/services/apiServices"; // <-- your APIs

const AddMember = ({ isModalOpen, setIsModalOpen, refreshData, selectedMember }) => {
  const [taskAccess, setTaskAccess] = useState(true);
  const [leaveAccess, setLeaveAccess] = useState(true);
   const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [searchCountry, setSearchCountry] = useState("");
  const [searchState, setSearchState] = useState("");
  const [searchCity, setSearchCity] = useState("");
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


  useEffect(() => {
    if (isModalOpen) {
      fetchCountries(searchCountry)
        .then((res) => setCountries(res?.data?.data?.["Country Details"] || []))
        .catch(() => setCountries([]));
    }
  }, [isModalOpen, searchCountry]);

  // ⬇️ Fetch States when country changes
  useEffect(() => {
    if (formData.countryId) {
      fetchStatesByCountry(formData.countryId, searchState)
        .then((res) => setStates(res?.data?.data?.["state Details"] || []))
        .catch(() => setStates([]));
    }
  }, [formData.countryId, searchState]);

  // ⬇️ Fetch Cities when state changes
  useEffect(() => {
    if (formData.stateId) {
      fetchCitiesByState(formData.stateId, searchCity)
        .then((res) => setCities(res?.data?.data?.["City Details"] || []))
        .catch(() => setCities([]));
    }
  }, [formData.stateId, searchCity]);

  const handleModalClose = () => {
    setIsModalOpen(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

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

useEffect(() => {
  const fetchMember = async () => {
    if (!selectedMember?.id) {
      // Reset form if no member selected
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
      return;
    }

    try {
      const res = await getUserById(selectedMember.id);
      const member = res?.data?.data?.["User Details"][0];
      console.log("User data:", member);

      if (member) {
        const prefilled = {
          memberid: member.id ?? "",
          firstName: member.firstName ??  "",
          lastName: member.lastName ??  "",
          email: member.email ?? "sd",
          companyEmail: member.userBasicDetails.companyEmail ?? "",
          contactNo: member.contactNo ?? "",
          officeEmail: member.userBasicDetails.officeEmail ?? "",
          countryId: member.userBasicDetails.country.id ??  "",
          stateId: member.userBasicDetails.state.id ?? "",
          cityId: member.userBasicDetails.city.id ?? member.city.id ?? "",
          address: member.address ?? "",
          companyName: member.companyName ?? "",
          role: member.userBasicDetails.role?.id ?? "",
        };

        setFormData(prefilled);
       setSelectedRole(member.userBasicDetails.role?.id || "");

        setTaskAccess(member.task_access ?? true);
        setLeaveAccess(
          member.leave_attendence_access === true ||
          member.leave_attendence_access === "true"
        );

        // 🔥 If editing, fetch states & cities immediately
        if (prefilled.countryId) {
          fetchStatesByCountry(prefilled.countryId, "")
            .then((res) => setStates(res?.data?.data?.["state Details"] || []));
        }
        if (prefilled.stateId) {
          fetchCitiesByState(prefilled.stateId, "")
            .then((res) => setCities(res?.data?.data?.["City Details"] || []));
        }
      }
    } catch (err) {
      console.error("Error fetching user:", err);
    }
  };

  if (isModalOpen) fetchMember();
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
      cityId: Number(formData.cityId) ,
      stateId: Number(formData.stateId) ,
      countryId: Number(formData.countryId) ,
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
      res = await UpdateMember(payload.memberId,payload);
       refreshData();
       // <-- your edit API
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
            <Select
              options={countries.map((c) => ({ value: c.id, label: c.name }))}
              value={countries.find((c) => c.id === formData.countryId) ? { value: formData.countryId, label: countries.find((c) => c.id === formData.countryId)?.name } : null}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, countryId: selected?.value || "" }))
              }
              placeholder="Search & select country..."
              isClearable
            />

          </div>
          <div className="flex flex-col">
            <label className="form-label">State </label>
            <Select
              options={states.map((s) => ({ value: s.id, label: s.name }))}
              value={states.find((s) => s.id === formData.stateId) ? { value: formData.stateId, label: states.find((s) => s.id === formData.stateId)?.name } : null}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, stateId: selected?.value || "" }))
              }
              placeholder="Search & select state..."
              isClearable
              isDisabled={!formData.countryId}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-x-4">
          <div className="flex flex-col">
            <label className="form-label">City </label>
            <Select
              options={cities.map((ct) => ({ value: ct.id, label: ct.name }))}
              value={cities.find((ct) => ct.id === formData.cityId) ? { value: formData.cityId, label: cities.find((ct) => ct.id === formData.cityId)?.name } : null}
              onChange={(selected) =>
                setFormData((prev) => ({ ...prev, cityId: selected?.value || "" }))
              }
              placeholder="Search & select city..."
              isClearable
              isDisabled={!formData.stateId}
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
    onChange={(e) => setSelectedRole(e.target.value)}  // ✅ fix handler
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
