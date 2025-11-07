import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import {  Mail, User, Phone, Lock } from "lucide-react";



// Custom Floating Label Input Component
function FloatingInput({
  label,
  type = "text",
  name,
  value,
  onChange,
  onBlur,
  error,
  disabled,
  icon, // ki-filled icon name
  iconImg, // fallback image icon
  ...props
}) {
  const [isFocused, setIsFocused] = useState(false);
  const hasValue = value && value.length > 0;

  return (
    <div className="relative">
      {/* Input Field */}
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

      {/* Floating Label */}
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

      {/* ki-filled Icon */}
      {icon && (
        <span
          className={`absolute left-3 top-3 mb-4 text-gray-500 transition-colors duration-200 
          peer-focus:text-blue-500  ${error ? "text-red-500" : ""}`}
        >
          <i className={`ki-filled ${icon} `} />
        </span>
      )}

      {/* Fallback Image Icon */}
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




export default function Signup() {
  // Static Data
  
const [showConfirmPassword, setShowConfirmPassword] = useState(false); // 👈 Add this here



  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contactNo: "",
    password: "",


    countryId: "",
    stateId: "",
    cityId: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const validateField = (name, value) => {
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
        if (!value) error = "Password required";
        else if (value.length < 6) error = "Min 6 characters";
        break;
      
     
      default:
        break;
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (touched[name]) {
      const error = validateField(name, value);
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    

    const newErrors = {};
    Object.keys(formData).forEach(key => {
      const error = validateField(key, formData[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));
      return;
    }

    console.log("Form submitted:", formData);
    alert("Signup Successful!");
  };



  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-[800px] w-full mx-auto bg-white shadow-md rounded-xl p-8">
        <div className="flex flex-col gap-6">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Signup</h2>
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
    <div>
      <FloatingInput
        label="First Name"
        name="firstName"
        value={formData.firstName}
        onChange={handleChange}
        onBlur={handleBlur}
 icon="ki-user"  
        error={touched.firstName && errors.firstName}
      />
      {touched.firstName && errors.firstName && (
        <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
      )}
    </div>

    <div>
      <FloatingInput
        label="Last Name"
        name="lastName"
        value={formData.lastName}
        onChange={handleChange}
        onBlur={handleBlur}
 icon="ki-user" 
        error={touched.lastName && errors.lastName}
      />
      {touched.lastName && errors.lastName && (
        <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
      )}
    </div>
  </div>

  <div>
    <FloatingInput
      type="email"
      label="Email"
      name="email"
      value={formData.email}
      onChange={handleChange}
      onBlur={handleBlur}
  icon="ki-message-text"    
    error={touched.email && errors.email}
    />
    {touched.email && errors.email && (
      <p className="text-red-500 text-xs mt-1">{errors.email}</p>
    )}
  </div>

  <div>
    <FloatingInput
      label="Phone Number"
      name="contactNo"
      value={formData.contactNo}
      onChange={handleChange}
      onBlur={handleBlur}
icon="ki-phone"      error={touched.contactNo && errors.contactNo}
    />
    {touched.contactNo && errors.contactNo && (
      <p className="text-red-500 text-xs mt-1">{errors.contactNo}</p>
    )}
  </div>

  <div className="relative">
    <FloatingInput
      type={showPassword ? "text" : "password"}
      label="Password"
      name="password"
      value={formData.password}
      onChange={handleChange}
      onBlur={handleBlur}
       icon="ki-lock" 
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

  <div className="relative">
    <FloatingInput
      type={showConfirmPassword ? "text" : "password"}
      label="Confirm Password"
      name="confirmPassword"
      value={formData.confirmPassword}
      onChange={handleChange}
      onBlur={handleBlur}
        icon="ki-lock" 
      error={touched.confirmPassword && errors.confirmPassword}
    />
    <button
      type="button"
      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
      className="absolute right-3 top-4 text-gray-500 hover:text-gray-700"
    >
      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
    </button>
    {touched.confirmPassword && errors.confirmPassword && (
      <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
    )}
  </div>
</div>


          </div>


          {/* Submit Button */}
          <div className="text-center mt-4">
            <button
              type="button"
              onClick={handleSubmit}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-8 rounded-lg transition-colors"
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}