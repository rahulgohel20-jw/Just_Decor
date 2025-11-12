import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import {
  registerUser,
  fetchStatesByCountry,
  fetchCitiesByState,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import "react-phone-input-2/lib/style.css";
import PhoneInput from "react-phone-input-2";
import FloatingSelect from "../../../components/form-inputs/selectinput/FloatingSelect";

function FloatingInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  icon,
  iconImg,
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={(e) => {
          setIsFocused(false);
          onBlur && onBlur(e);
        }}
        onFocus={() => setIsFocused(true)}
        disabled={disabled}
        className={`peer w-full ${
          icon || iconImg ? "pl-10" : "pl-3"
        } pr-3 py-3 border rounded-md text-sm outline-none transition-all ${
          error ? "border-red-500" : "border-gray-300 focus:border-blue-500"
        } ${disabled ? "bg-gray-100 cursor-not-allowed" : "bg-white"}`}
        {...props}
      />

      <label
        className={`absolute transition-all pointer-events-none bg-white px-1 ${
          icon || iconImg ? "left-10" : "left-3"
        } ${
          isFocused || hasValue
            ? "-top-2.5 text-xs text-blue-500"
            : "top-3 text-sm text-gray-500"
        } ${error ? "text-red-500" : ""}`}
      >
        {label}
      </label>

      {icon && (
        <span
          className={`absolute left-3 top-3 text-gray-500 transition-colors duration-200 
          peer-focus:text-blue-500 ${error ? "text-red-500" : ""}`}
        >
          <i className={`ki-filled ${icon}`} />
        </span>
      )}

      {!icon && iconImg && (
        <span className="absolute left-3 top-3">
          <img
            src={iconImg}
            alt="icon"
            className="inline-block w-5 h-5 opacity-100"
          />
        </span>
      )}
    </div>
  );
}

function FloatingInputPhone({ label, name, value, onChange, onBlur, error }) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="relative mb-4">
      <PhoneInput
        country={"in"}
        value={value}
        onChange={(phone) => onChange({ target: { name, value: phone } })}
        onFocus={() => setIsFocused(true)}
        onBlur={(e) => {
          setIsFocused(false);
          if (onBlur) onBlur(e);
        }}
        inputClass="!w-full !h-12 !pl-14 !border !border-gray-300 !rounded-lg !text-gray-900 !text-base focus:!border-blue-500 focus:!shadow-sm !bg-transparent placeholder:!text-gray-400 placeholder:!pl-2"
        buttonClass="!border-gray-300 !bg-transparent"
        containerClass="!w-full"
      />
      <label
        className={`absolute left-[100px] transition-all duration-200 pointer-events-none ${
          isFocused || value
            ? "-top-2 text-xs bg-white px-1 text-[#005BA8]"
            : "top-3 text-gray-400 text-sm"
        }`}
      >
        {label}
      </label>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function Signup() {
  const navigate = useNavigate();
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    password: "",
    confirmPassword: "",
    countryId: null,
    stateId: "",
    cityId: "",
    address: "",
    clientId: 0,
    companyEmail: "",
    companyName: "",
    countryCode: "+91",
    isAttendanceLeaveAccess: true,
    isTaskAccess: true,
    officeNo: "",
    remarks: "",
    reportingManagerId: 0,
    roleId: 2,
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  // 🔹 Validation logic
  const validateField = (name, value, allValues = formData) => {
    let error = "";
    switch (name) {
      case "firstName":
        if (!value) error = "First name required";
        break;
      case "lastName":
        if (!value) error = "Last name required";
        break;
      case "email":
        if (!value) error = "Email required";
        else if (!/\S+@\S+\.\S+/.test(value)) error = "Invalid email";
        break;
      case "contactNo":
        if (!value) error = "Phone required";
        break;
      case "password":
        if (!value) {
          error = "Password required";
        } else if (
          !/^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/.test(
            value
          )
        ) {
          error =
            "Password must be at least 6 characters, include 1 uppercase letter, 1 number, and 1 special character.";
        }
        break;

      case "confirmPassword":
        if (!value) error = "Confirm password required";
        else if (value !== allValues.password) error = "Passwords do not match";
        break;
      default:
        break;
    }
    return error;
  };

  useEffect(() => {
    const loadStates = async () => {
      try {
        const response = await fetchStatesByCountry(1);

        const data = response?.data?.data?.["state Details"];
        if (Array.isArray(data)) {
          setStates(
            data.map((s) => ({
              value: s.id,
              label: s.name,
            }))
          );
        } else {
          setStates([]);
        }
      } catch (error) {
        console.error("❌ Error fetching states:", error);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (formData.stateId) {
      const loadCities = async () => {
        try {
          const response = await fetchCitiesByState(formData.stateId);

          const data = response?.data?.data?.["City Details"];
          if (Array.isArray(data)) {
            setCities(
              data.map((c) => ({
                value: c.id,
                label: c.name,
              }))
            );
          } else {
            setCities([]);
          }
        } catch (error) {
          console.error("❌ Error fetching cities:", error);
        }
      };
      loadCities();
    }
  }, [formData.stateId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (touched[name]) {
      const error = validateField(name, value);
      setErrors((prev) => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched((prev) => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    const payload = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      contactNo: formData.contactNo,
      password: formData.password,
      companyEmail: formData.email,
      companyName: formData.companyName,
      confirmPassword: formData.confirmPassword,
      countryId: formData.countryId,
      stateId: formData.stateId,
      cityId: formData.cityId,
      address: formData.address,
      roleId: formData.roleId,
      officeNo: formData.contactNo,
      remarks: formData.remarks,
      reportingManagerId: formData.reportingManagerId,
      countryCode: formData.countryCode,
      isAttendanceLeaveAccess: formData.isAttendanceLeaveAccess,
      isTaskAccess: formData.isTaskAccess,
      clientId: formData.clientId,
    };

    try {
      setLoading(true);

      const res = await registerUser(payload);
      console.log(res);

      if (res?.data?.success === true) {
        await Swal.fire({
          icon: "success",
          title: "Registration Successful!",
          text: "Your account has been created successfully.",
          confirmButtonText: "Okay",
          confirmButtonColor: "#3085d6",
        });
        navigate("/auth/login");
      } else {
        Swal.fire({
          icon: "error",
          title: "Registration Failed",
          text: res?.data?.message || "Something went wrong.",
          confirmButtonColor: "#d33",
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong!",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card max-w-[800px] w-full mx-auto bg-white shadow-md rounded-xl p-8">
        <div className="flex flex-col gap-2">
          <div>
            <h2 className="text-2xl font-semibold text-primary mb-2">Signup</h2>
            <p className="text-gray-600 text-sm">
              Please fill in all required fields to create your account.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-4 border-b pb-2">
              Personal Details
            </h3>

            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* First Name */}
                <div>
                  <FloatingInput
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="ki-user text-primary"
                    error={touched.firstName && errors.firstName}
                  />
                  {touched.firstName && errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                {/* Last Name */}
                <div>
                  <FloatingInput
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="ki-user text-primary"
                    error={touched.lastName && errors.lastName}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
                {/* Email */}
                <div>
                  <FloatingInput
                    type="email"
                    label="Email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="ki-message-text text-primary"
                    error={touched.email && errors.email}
                  />
                  {touched.email && errors.email && (
                    <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                  )}
                </div>
                <div>
                  <FloatingInput
                    label="Company Name"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    icon="ki-user text-primary"
                    error={touched.lastName && errors.lastName}
                  />
                  {touched.lastName && errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <FloatingInputPhone
                label="Phone Number"
                name="contactNo"
                value={formData.mobile}
                onChange={handleChange}
                onBlur={handleBlur}
                error={errors.mobile}
              />

              {/* State & City Selects */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* State */}
                <FloatingSelect
                  label="State"
                  name="stateId"
                  value={formData.stateId}
                  onChange={(e) => {
                    handleChange(e);
                    setFormData((prev) => ({ ...prev, cityId: "" }));
                  }}
                  onBlur={handleBlur}
                  options={states}
                  icon="ki-geo text-primary"
                  error={touched.stateId && errors.stateId}
                />

                {/* City */}
                <FloatingSelect
                  label="City"
                  name="cityId"
                  value={formData.cityId}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={cities}
                  icon="ki-map text-primary"
                  error={touched.cityId && errors.cityId}
                />
              </div>

              {/* Password */}
              <div className="relative">
                <FloatingInput
                  type={showPassword ? "text" : "password"}
                  label="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="ki-lock text-primary"
                  error={touched.password && errors.password}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
                {touched.password && errors.password && (
                  <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                )}
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <FloatingInput
                  type={showConfirmPassword ? "text" : "password"}
                  label="Confirm Password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  icon="ki-lock text-primary"
                  error={touched.confirmPassword && errors.confirmPassword}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={20} />
                  ) : (
                    <Eye size={20} />
                  )}
                </button>
                {touched.confirmPassword && errors.confirmPassword && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              disabled={loading}
              className={`w-full text-white font-semibold py-2.5 px-8 rounded-lg transition-colors ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              }`}
            >
              {loading ? "Please wait..." : "Sign Up"}
            </button>
          </div>

          <span className="flex justify-end gap-1 mt-2">
            Back to
            <Link to="/auth/login" className="text-primary underline">
              Login
            </Link>
          </span>
        </div>
      </div>
    </div>
  );
}
