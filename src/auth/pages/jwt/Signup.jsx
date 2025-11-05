import { useFormik } from "formik";
import Swal from "sweetalert2";
import * as Yup from "yup";
import { useEffect, useState } from "react";
import {
  registerUser,
  fetchCountries,
  fetchStatesByCountry,
  fetchCitiesByState,
} from "@/services/apiServices";
import { useNavigate } from "react-router-dom";

export default function Signup() {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const formik = useFormik({
    initialValues: {
      address: "",
      cityId: "",
      clientId: 0,
      companyEmail: "",
      contactNo: "",
      countryCode: "+91",
      countryId: "",
      email: "",
      firstName: "",
      isAttendanceLeaveAccess: true,
      isTaskAccess: true,
      lastName: "",
      officeNo: "",
      stateId: "",
    },
    validationSchema: Yup.object({
      firstName: Yup.string().required("First name required"),
      lastName: Yup.string().required("Last name required"),
      email: Yup.string().email("Invalid email").required("Email required"),
      contactNo: Yup.string().required("Phone required"),
      address: Yup.string().required("Address required"),
      countryId: Yup.string().required("Select country"),
      stateId: Yup.string().required("Select state"),
      cityId: Yup.string().required("Select city"),
    }),
    onSubmit: async (values) => {
      try {
        const payload = {
          ...values,
          countryId: Number(values.countryId),
          stateId: Number(values.stateId),
          cityId: Number(values.cityId),
          roleId: 2,
          companyName: " ",
          remarks: " ",
          reportingManagerId: 0,

          companyEmail:
            values.email ||
            `${values.firstName}.${values.lastName}@example.com`,
          officeNo: values.contactNo || "N/A",
        };

        console.log("Submitting signup with payload:", payload);

        const res = await registerUser(payload);
        if (res?.status === 200) {
          Swal.fire({
            title: "Signup Successful!",
            text: "Your account has been created successfully.",
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            customClass: {
              popup: "rounded-2xl shadow-xl",
              title: "text-2xl font-bold",
              confirmButton: "px-6 py-2 text-white font-semibold rounded-lg",
            },
          });
        }
      } catch (err) {
        console.error("Signup error:", err);
        Swal.fire({
          title: "Error!",
          text: "Signup failed! Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    },
  });

  useEffect(() => {
    const loadCountries = async () => {
      try {
        const res = await fetchCountries();
        const countryList = res?.data?.data?.["Country Details"] || [];
        setCountries(countryList);

        // Optional: Set default country as "India"
        const defaultCountry = countryList.find(
          (c) => c.name.toLowerCase() === "india"
        );
        if (defaultCountry) {
          formik.setFieldValue("countryId", defaultCountry.id);
        }
      } catch (error) {
        console.error("Error loading countries:", error);
        setCountries([]);
      }
    };
    loadCountries();
  }, []);

  // ✅ Load states when country changes
  useEffect(() => {
    if (formik.values.countryId) {
      const loadStates = async () => {
        try {
          const res = await fetchStatesByCountry(formik.values.countryId);
          const stateList = res?.data?.data?.["state Details"] || [];
          setStates(Array.isArray(stateList) ? stateList : []);
        } catch (error) {
          console.error("Error loading states:", error);
          setStates([]);
        }
      };
      loadStates();
    }
  }, [formik.values.countryId]);

  // ✅ Load cities when state changes
  useEffect(() => {
    if (formik.values.stateId) {
      const loadCities = async () => {
        try {
          const res = await fetchCitiesByState(formik.values.stateId);
          const cityList = res?.data?.data?.["City Details"] || [];
          setCities(Array.isArray(cityList) ? cityList : []);
        } catch (error) {
          console.error("Error loading cities:", error);
          setCities([]);
        }
      };
      loadCities();
    }
  }, [formik.values.stateId]);

  return (
    <div className="card max-w-[900px] w-full">
      <form
        onSubmit={formik.handleSubmit}
        className="card-body flex flex-col gap-6 p-5 md:p-7 overflow-y-scroll max-h-[90vh] scrollbar-hide"
      >
        {/* Header */}
        <div className="mb-2.5">
          <h2 className="text-lg font-semibold text-gray-900 leading-none mb-2">
            Signup
          </h2>
          <span className="text-sm text-gray-700">
            Please fill in all required information to create your account.
          </span>
        </div>

        {/* Personal Details */}
        <div>
          <h3 className="text-sm font-semibold mb-4 border-b pb-2">
            Personal Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            {/* First Name */}
            <div className="flex flex-col">
              <label className="form-label">First Name</label>
              <label className="input">
                <input
                  name="firstName"
                  placeholder="First Name"
                  className="border p-2 w-full rounded"
                  value={formik.values.firstName}
                  onChange={formik.handleChange}
                />
              </label>
              {formik.errors.firstName && (
                <p className="text-red-500 text-sm">
                  {formik.errors.firstName}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div className="flex flex-col">
              <label className="form-label">Last Name</label>
              <label className="input">
                <input
                  name="lastName"
                  placeholder="Last Name"
                  className="border p-2 w-full rounded"
                  value={formik.values.lastName}
                  onChange={formik.handleChange}
                />
              </label>
              {formik.errors.lastName && (
                <p className="text-red-500 text-sm">{formik.errors.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div className="flex flex-col">
              <label className="form-label">Email</label>
              <label className="input">
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="border p-2 w-full rounded"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                />
              </label>
              {formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>

            {/* Phone */}
            <div className="flex flex-col">
              <label className="form-label">Phone</label>
              <label className="input">
                <input
                  name="contactNo"
                  placeholder="Phone Number"
                  className="border p-2 w-full rounded"
                  value={formik.values.contactNo}
                  onChange={formik.handleChange}
                />
              </label>
              {formik.errors.contactNo && (
                <p className="text-red-500 text-sm">
                  {formik.errors.contactNo}
                </p>
              )}
            </div>

            {/* Address */}
            <div className="flex flex-col">
              <label className="form-label">Address</label>
              <label className="input">
                <input
                  name="address"
                  placeholder="Address"
                  className="border p-2 w-full rounded"
                  value={formik.values.address}
                  onChange={formik.handleChange}
                />
              </label>
              {formik.errors.address && (
                <p className="text-red-500 text-sm">{formik.errors.address}</p>
              )}
            </div>

            {/* Country */}
            <div className="flex flex-col">
              <label className="form-label">Country</label>
              <label className="input">
                <select
                  name="countryId"
                  value={formik.values.countryId}
                  onChange={formik.handleChange}
                  className="border p-2 w-full rounded"
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </label>
              {formik.errors.countryId && (
                <p className="text-red-500 text-sm">
                  {formik.errors.countryId}
                </p>
              )}
            </div>

            {/* State */}
            <div className="flex flex-col">
              <label className="form-label">State</label>
              <label className="input">
                <select
                  name="stateId"
                  value={formik.values.stateId}
                  onChange={formik.handleChange}
                  className="border p-2 w-full rounded"
                  disabled={!states.length}
                >
                  <option value="">Select State</option>
                  {states.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </label>
              {formik.errors.stateId && (
                <p className="text-red-500 text-sm">{formik.errors.stateId}</p>
              )}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="form-label">City</label>
              <label className="input">
                <select
                  name="cityId"
                  value={formik.values.cityId}
                  onChange={formik.handleChange}
                  className="border p-2 w-full rounded"
                  disabled={!cities.length}
                >
                  <option value="">Select City</option>
                  {cities.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </label>
              {formik.errors.cityId && (
                <p className="text-red-500 text-sm">{formik.errors.cityId}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit */}
        <div className="text-center">
          <button type="submit" className="btn btn-primary">
            Sign Up
          </button>
        </div>
      </form>
    </div>
  );
}
