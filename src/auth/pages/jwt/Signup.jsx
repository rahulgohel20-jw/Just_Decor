import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { useAuthContext } from "../../useAuthContext";
import { toAbsoluteUrl } from "@/utils";
import { Alert, KeenIcon } from "@/components";
import { useLayout } from "@/providers";
const initialValues = {
  email: "",
  password: "",
  changepassword: "",
  acceptTerms: false,
};
const signupSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  changepassword: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password confirmation is required")
    .oneOf([Yup.ref("password")], "Password and Confirm Password didn't match"),
  acceptTerms: Yup.bool().required("You must accept the terms and conditions"),
});
const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();
  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        if (!register) {
          throw new Error("JWTProvider is required for this form.");
        }
        await register(values.email, values.password, values.changepassword);
        navigate(from, {
          replace: true,
        });
      } catch (error) {
        console.error(error);
        setStatus("The sign up details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    },
  });

  const countries = [
    {
      name: "United States",
      code: "US",
      dialCode: "+1",
      flag: "https://flagcdn.com/w40/us.png",
    },
    {
      name: "India",
      code: "IN",
      dialCode: "+91",
      flag: "https://flagcdn.com/w40/in.png",
    },
    {
      name: "United Kingdom",
      code: "GB",
      dialCode: "+44",
      flag: "https://flagcdn.com/w40/gb.png",
    },
  ];

  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [phone, setPhone] = useState("");

  const handleSelect = (country) => {
    setSelectedCountry(country);
    setDropdownOpen(false);
  };
  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  const toggleConfirmPassword = (event) => {
    event.preventDefault();
    setShowConfirmPassword(!showConfirmPassword);
  };
  return (
    <div className="card max-w-[460px] w-full">
      <form
        className="card-body flex flex-col gap-2 p-5 md:p-7"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <div className="mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2">
            Sign Up
          </h3>
          <span className="text-sm text-gray-600">
            Please fill in all the information required to create your account
            on JW.
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col">
            <label className="form-label text-gray-900">First Name</label>
            <label className="input">
              <input placeholder="First name" type="text" />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="form-label text-gray-900">Last Name</label>
            <label className="input">
              <input placeholder="Last name" type="text" />
            </label>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <div className="flex flex-col">
            <label className="form-label text-gray-900">City</label>
            <label className="input">
              <input placeholder="First name" type="text" />
            </label>
          </div>
          <div className="flex flex-col">
            <label className="form-label text-gray-900">Company</label>
            <label className="input">
              <input placeholder="Enter company name" type="text" />
            </label>
          </div>
        </div>
        <div className="relative max-w-md w-full">
          <label className="form-label text-gray-900">Phone Number</label>
          <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm focus-within:ring-1 focus-within:ring-primary focus-within:border-primary transition">
            {/* Country Selector Button */}
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center px-3 bg-gray-50 hover:bg-gray-100 border-r border-gray-300 text-sm"
            >
              <img
                src={selectedCountry.flag}
                alt="flag"
                className="w-5 h-5 mr-1 rounded"
              />
              {selectedCountry.dialCode}
              <svg
                className="w-4 h-4 ml-1 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={dropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                />
              </svg>
            </button>
            {/* Phone Number Input */}
            <input
              type="tel"
              className="flex-1 px-3 py-2 input text-sm rounded-none border-none"
              placeholder="Phone number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          {/* Dropdown Menu */}
          {dropdownOpen && (
            <div className="absolute z-20 bg-white border border-gray-200 rounded-md shadow-lg mt-2 w-48 max-h-60 overflow-y-auto">
              {countries.map((country, idx) => (
                <div
                  key={idx}
                  className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                  onClick={() => handleSelect(country)}
                >
                  <img
                    src={country.flag}
                    className="w-5 h-5 mr-2 rounded"
                    alt={country.name}
                  />
                  <span className="flex-1">{country.name}</span>
                  <span className="text-gray-500">{country.dialCode}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
        <div className="flex flex-col">
          <label className="form-label text-gray-900">Email Address</label>
          <label className="input">
            <input
              placeholder="Email address"
              type="email"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid": formik.touched.email && formik.errors.email,
                },
                {
                  "is-valid": formik.touched.email && !formik.errors.email,
                }
              )}
            />
          </label>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label text-gray-900">Password</label>
          <label className="input">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Create password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid":
                    formik.touched.password && formik.errors.password,
                },
                {
                  "is-valid":
                    formik.touched.password && !formik.errors.password,
                }
              )}
            />
            <button className="btn btn-icon" onClick={togglePassword}>
              <KeenIcon
                icon="eye"
                className={clsx("text-gray-500", {
                  hidden: showPassword,
                })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx("text-gray-500", {
                  hidden: !showPassword,
                })}
              />
            </button>
          </label>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label text-gray-900">Confirm Password</label>
          <label className="input">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              autoComplete="off"
              {...formik.getFieldProps("changepassword")}
              className={clsx(
                "form-control bg-transparent",
                {
                  "is-invalid":
                    formik.touched.changepassword &&
                    formik.errors.changepassword,
                },
                {
                  "is-valid":
                    formik.touched.changepassword &&
                    !formik.errors.changepassword,
                }
              )}
            />
            <button className="btn btn-icon" onClick={toggleConfirmPassword}>
              <KeenIcon
                icon="eye"
                className={clsx("text-gray-500", {
                  hidden: showConfirmPassword,
                })}
              />
              <KeenIcon
                icon="eye-slash"
                className={clsx("text-gray-500", {
                  hidden: !showConfirmPassword,
                })}
              />
            </button>
          </label>
          {formik.touched.changepassword && formik.errors.changepassword && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.changepassword}
            </span>
          )}
        </div>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <span role="alert" className="text-danger text-xs mt-1">
            {formik.errors.acceptTerms}
          </span>
        )}
        <button
          type="submit"
          className="btn btn-primary flex justify-center grow mt-2"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Sign Up"}
        </button>
        <div className="flex items-center gap-2 my-3">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>
        <a href="#" className="btn btn-light btn-sm justify-center py-5">
          <img
            src={toAbsoluteUrl("/media/brand-logos/google.svg")}
            className="size-3.5 shrink-0"
          />
          Sign up with Google
        </a>
        <div className="flex items-center justify-center font-medium mt-2">
          <span className="text-2sm text-gray-600 me-1.5">
            Already have on account?{" "}
          </span>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/login"
                : "/auth/classic/login"
            }
            className="text-2sm link hover:underline no-underline"
          >
            Sign In
          </Link>
        </div>
      </form>
    </div>
  );
};
export { Signup };
