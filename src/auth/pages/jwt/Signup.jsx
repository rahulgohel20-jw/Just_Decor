import { useFormik } from "formik";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import { registerUser, fetchCountries, fetchStatesByCountry, fetchCitiesByState } from "@/services/apiServices";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  // ✅ Load all countries
  // useEffect(() => {
  //   fetchCountries()
  //     .then((res) => {
  //       if (res?.data?.data) setCountries(res.data.data);
  //     })
  //     .catch((err) => console.error("Error fetching countries:", err));
  // }, []);

 const formik = useFormik({
    initialValues: {
      address: "",
      cityId: "",
      clientId: 0,
      companyEmail: "",
      companyName: "",
      contactNo: "",
      countryCode: "+91",
      countryId: "",
      email: "",
      firstName: "",
      isAttendanceLeaveAccess: true,
      isTaskAccess: true,
      lastName: "",
      officeNo: "",
      planId: "",
      reportingManagerId: 0,
      roleId: 2,
      stateId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name required"),
      lastName: Yup.string().required("Last name required"),
      email: Yup.string().email("Invalid email").required("Email required"),
      contactNo: Yup.string().required("Phone required"),
      companyName: Yup.string().required("Company required"),
      companyEmail: Yup.string().email("Invalid email").required("Company email required"),
      officeNo: Yup.string().required("Office number required"),
      address: Yup.string().required("Address required"),
      countryId: Yup.string().required("Select country"),
      stateId: Yup.string().required("Select state"),
      cityId: Yup.string().required("Select city"),
      planId: Yup.string().required("Select plan"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          countryId: Number(values.countryId),
          stateId: Number(values.stateId),
          cityId: Number(values.cityId),
          planId: Number(values.planId),
        };

        const res = await registerUser(payload);
        if (res?.status === 200) {
          alert("Signup successful!");
          navigate("/auth/login");
          console.log("Signup response:", res);
        }
      } catch (err) {
        console.error("Signup error:", err);
        alert("Signup failed!");
      }
    },
  });

  // ✅ Fetch states when country changes
useEffect(() => {
  const loadCountries = async () => {
    try {
      const res = await fetchCountries();
      // safely access Country Details
      const countryList = res?.data?.data?.["Country Details"] || [];
      setCountries(countryList);
    } catch (error) {
      console.error("Error loading countries:", error);
      setCountries([]);
    }
  };
  loadCountries();
}, []);



  // ✅ Fetch cities when state changes
useEffect(() => {
  if (formik.values.countryId) {
    const loadStates = async () => {
      const res = await fetchStatesByCountry(formik.values.countryId);
      if (Array.isArray(res?.data?.data?.["state Details"])) {
        setStates(res?.data?.data?.["state Details"]);
        console.log(states);
      } else if (res.data.data) {
        setStates([res.data.data]);
      } else {
        setStates([]);
      }
    };
    loadStates();
  }
}, [formik.values.countryId]);


// useEffect(() => {
//   if (formik.values.countryId) {
//     const loadStates = async () => {
//       try {
//         const res = await fetchStatesByCountry(formik.values.countryId);
//         const stateList = res?.data?.data?.["State Details"] || [];
//         setStates(stateList);
//         console.log(stateList);
//       } catch (error) {
//         console.error("Error loading states:", error);
//         setStates([]);
//       }
//     };
//     loadStates();
//   }
// }, [formik.values.countryId]);


useEffect(() => {
  if (formik.values.stateId) {
    const loadCities = async () => {
      const res = await fetchCitiesByState(formik.values.stateId);
      if (Array.isArray(res?.data?.data?.["City Details"])) {
        setCities(res?.data?.data?.["City Details"]);
        console.log(cities);
      } else if (res.data.data) {
        setCities([res.data.data]);
      } else {
        setCities([]);
      }
    };
    loadCities();
  }
}, [formik.values.stateId]);


  return (
 <div className="card max-w-[900px] w-full">
  <form onSubmit={formik.handleSubmit} className="card-body flex flex-col gap-6 p-5 md:p-7">

    {/* Header */}
    <div className="mb-2.5">
      <h2 className="text-lg font-semibold text-gray-900 leading-none mb-2">Signup</h2>
      <span className="text-sm text-gray-700">
        Please fill in all the information required to create your account on JW.
      </span>
    </div>

    {/* Personal Details */}
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">Personal Details</h3>
      <div className="grid grid-cols-2 gap-4">

        {/* First Name */}
        <div className="flex flex-col">
          <label className="form-label">First Name</label>
          <label className="input">
            <i className="ki-filled ki-user"></i>
            <input
              name="firstName"
              placeholder="First Name"
              className="border p-2 w-full rounded"
              value={formik.values.firstName}
              onChange={formik.handleChange}
            />
          </label>
          {formik.errors.firstName && <p className="text-red-500 text-sm">{formik.errors.firstName}</p>}
        </div>

        {/* Last Name */}
        <div className="flex flex-col">
          <label className="form-label">Last Name</label>
          <label className="input">
            <i className="ki-filled ki-user"></i>
            <input
              name="lastName"
              placeholder="Last Name"
              className="border p-2 w-full rounded"
              value={formik.values.lastName}
              onChange={formik.handleChange}
            />
          </label>
          {formik.errors.lastName && <p className="text-red-500 text-sm">{formik.errors.lastName}</p>}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <label className="form-label">Email</label>
          <label className="input">
            <i className="ki-filled ki-sms"></i>
            <input
              type="email"
              name="email"
              placeholder="Email"
              className="border p-2 w-full rounded"
              value={formik.values.email}
              onChange={formik.handleChange}
            />
          </label>
          {formik.errors.email && <p className="text-red-500 text-sm">{formik.errors.email}</p>}
        </div>

        {/* Phone */}
        <div className="flex flex-col">
          <label className="form-label">Phone</label>
          <input
            name="contactNo"
            placeholder="Phone Number"
            className="border p-2 w-full rounded"
            value={formik.values.contactNo}
            onChange={formik.handleChange}
          />
          {formik.errors.contactNo && <p className="text-red-500 text-sm">{formik.errors.contactNo}</p>}
        </div>

        {/* Address */}
        <div className="flex flex-col">
          <label className="form-label">Address</label>
          <input
            name="address"
            placeholder="Address"
            className="border p-2 w-full rounded"
            value={formik.values.address}
            onChange={formik.handleChange}
          />
          {formik.errors.address && <p className="text-red-500 text-sm">{formik.errors.address}</p>}
        </div>

        {/* Country */}
        <div className="flex flex-col">
          <label className="form-label">Country</label>
          <select
            name="countryId"
            value={formik.values.countryId}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Country</option>
            {countries.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          {formik.errors.countryId && <p className="text-red-500 text-sm">{formik.errors.countryId}</p>}
        </div>

        {/* State */}
        <div className="flex flex-col">
          <label className="form-label">State</label>
          <select
            name="stateId"
            value={formik.values.stateId}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded"
            disabled={!states.length}
          >
            <option value="">Select State</option>
            {states.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          {formik.errors.stateId && <p className="text-red-500 text-sm">{formik.errors.stateId}</p>}
        </div>

        {/* City */}
        <div className="flex flex-col">
          <label className="form-label">City</label>
          <select
            name="cityId"
            value={formik.values.cityId}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded"
            disabled={!cities.length}
          >
            <option value="">Select City</option>
            {cities.map((ct) => (
              <option key={ct.id} value={ct.id}>{ct.name}</option>
            ))}
          </select>
          {formik.errors.cityId && <p className="text-red-500 text-sm">{formik.errors.cityId}</p>}
        </div>
      </div>
    </div>

    {/* Company Details */}
    <div>
      <h3 className="text-sm font-semibold mb-4 border-b pb-2">Company Details</h3>
      <div className="grid grid-cols-2 gap-4">

        {/* Company Name */}
        <div className="flex flex-col">
          <label className="form-label">Company Name</label>
          <input
            name="companyName"
            placeholder="Company Name"
            className="border p-2 w-full rounded"
            value={formik.values.companyName}
            onChange={formik.handleChange}
          />
          {formik.errors.companyName && <p className="text-red-500 text-sm">{formik.errors.companyName}</p>}
        </div>

        {/* Company Email */}
        <div className="flex flex-col">
          <label className="form-label">Company Email</label>
          <input
            type="email"
            name="companyEmail"
            placeholder="Company Email"
            className="border p-2 w-full rounded"
            value={formik.values.companyEmail}
            onChange={formik.handleChange}
          />
          {formik.errors.companyEmail && <p className="text-red-500 text-sm">{formik.errors.companyEmail}</p>}
        </div>

        {/* Office Number */}
        <div className="flex flex-col">
          <label className="form-label">Office Number</label>
          <input
            name="officeNo"
            placeholder="Office Number"
            className="border p-2 w-full rounded"
            value={formik.values.officeNo}
            onChange={formik.handleChange}
          />
          {formik.errors.officeNo && <p className="text-red-500 text-sm">{formik.errors.officeNo}</p>}
        </div>

        {/* Plan */}
        <div className="flex flex-col">
          <label className="form-label">Plan</label>
          <select
            name="planId"
            value={formik.values.planId}
            onChange={formik.handleChange}
            className="border p-2 w-full rounded"
          >
            <option value="">Select Plan</option>
            <option value="1">Lite</option>
            <option value="4">ELTIT</option>
            <option value="3">Premium</option>
          </select>
          {formik.errors.planId && <p className="text-red-500 text-sm">{formik.errors.planId}</p>}
        </div>
      </div>
    </div>

    {/* Submit */}
    <div className="text-center">
      <button
        type="submit"
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg shadow-md transition"
      >
        Sign Up
      </button>
    </div>
  </form>
</div>

  );
}
