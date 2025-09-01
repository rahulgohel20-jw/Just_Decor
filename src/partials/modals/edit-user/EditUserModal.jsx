import { useState, useEffect } from "react";
import { Modal } from "antd";
import { fetchCountries, fetchStatesByCountry, fetchCitiesByState, getUserById, updateusermaster } from "@/services/apiServices";

const EditUserModal = ({ isOpen, onClose, refreshData, userId }) => {
  if (!isOpen) return null;

  const initialFormState = {
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    companyName: "",
    companyEmail: "",
    officeNo: "",
    address: "",
    countryId: "",
    stateId: "",
    cityId: "",
    planId: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // 🔹 Prefill form by fetching user by ID
  useEffect(() => {
    const fetchUser = async () => {
      if (!userId) return;
      try {
        const res = await getUserById(userId);
        const user = res?.data?.data?.["User Details"]?.[0] || res?.data?.data;
        if (user) {
          setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            contactNo: user.contactNo || "",
            companyName: user["userBasicDetails"].companyName || "",
            companyEmail: user["userBasicDetails"].companyEmail || "",
            officeNo: user["userBasicDetails"].officeNo || "",
            address: user["userBasicDetails"].address || "",
            countryId: user["userBasicDetails"].country.id || "",
            stateId: user["userBasicDetails"].state.id || "",
            cityId: user["userBasicDetails"].city.id || "",
            planId: user.plan.id || "",
          });
        }
      } catch (err) {
        console.error("Error fetching user by ID:", err);
      }
    };
    fetchUser();
  }, [userId]);

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetchCountries();
        setCountries(res?.data?.data?.["Country Details"] || []);
      } catch {
        setCountries([]);
      }
    };
    loadCountries();
  }, []);

  useEffect(() => {
    if (formData.countryId) {
      const loadStates = async () => {
        try {
          const res = await fetchStatesByCountry(formData.countryId);
          setStates(res?.data?.data?.["state Details"] || []);
        } catch {
          setStates([]);
        }
      };
      loadStates();
    }
  }, [formData.countryId]);

  useEffect(() => {
    if (formData.stateId) {
      const loadCities = async () => {
        try {
          const res = await fetchCitiesByState(formData.stateId);
          setCities(res?.data?.data?.["City Details"] || []);
        } catch {
          setCities([]);
        }
      };
      loadCities();
    }
  }, [formData.stateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
  if (!userId) {
    alert("User not found");
    return;
  }

  try {
    const payload = {
      id: userId,
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNo: formData.contactNo,
      address: formData.address,
      planId: formData.planId,
      userBasicDetails: {
        companyName: formData.companyName,
        companyEmail: formData.companyEmail,
        officeNo: formData.officeNo,
        countryId: formData.countryId,
        stateId: formData.stateId,
        cityId: formData.cityId,
      },
    };

    await updateusermaster(userId, payload); // send structured payload
    refreshData();
    onClose();
  } catch (err) {
    console.error("Error updating user:", err);
    alert("Update failed");
  }
};


  return (
    <Modal
      title="Edit User"
      open={isOpen}
      onCancel={onClose}
      footer={
        <div className="flex justify-end gap-3">
          <button className="border px-4 py-2 rounded hover:bg-gray-100" onClick={onClose}>
            Cancel
          </button>
          <button className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700" onClick={handleSubmit}>
            Update
          </button>
        </div>
      }
    >
      <div className="grid grid-cols-1 gap-4">
        <InputField label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} />
        <InputField label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} />
        <InputField label="Email" name="email" value={formData.email} onChange={handleChange} />
        <InputField label="Phone" name="contactNo" value={formData.contactNo} onChange={handleChange} />
        <InputField label="Company Name" name="companyName" value={formData.companyName} onChange={handleChange} />
        <InputField label="Company Email" name="companyEmail" value={formData.companyEmail} onChange={handleChange} />
        <InputField label="Office No" name="officeNo" value={formData.officeNo} onChange={handleChange} />
        <InputField label="Address" name="address" value={formData.address} onChange={handleChange} />
        <SelectField label="Country" name="countryId" value={formData.countryId} onChange={handleChange} options={countries} />
        <SelectField label="State" name="stateId" value={formData.stateId} onChange={handleChange} options={states} />
        <SelectField label="City" name="cityId" value={formData.cityId} onChange={handleChange} options={cities} />
        <SelectField label="Plan" name="planId" value={formData.planId} onChange={handleChange} options={[
          { id: 1, name: "Lite" },
          { id: 3, name: "Premium" },
          { id: 4, name: "ELTIT" },
        ]} />
      </div>
    </Modal>
  );
};

const InputField = ({ label, name, value, onChange }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <input type="text" name={name} value={value} onChange={onChange} className="border p-2 w-full rounded" />
  </div>
);

const SelectField = ({ label, name, value, onChange, options }) => (
  <div>
    <label className="block text-gray-600 mb-1">{label}</label>
    <select name={name} value={value} onChange={onChange} className="border p-2 w-full rounded">
      <option value="">Select {label}</option>
      {options.map((opt) => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
    </select>
  </div>
);

export default EditUserModal;
