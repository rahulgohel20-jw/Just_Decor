import clsx from "clsx";
import { useFormik } from "formik";
import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import * as Yup from "yup";
import { registerUser } from "@/services/apiServices";
import PhoneNumber from "@/components/form-inputs/PhoneNumber/PhoneNumber";
import { Alert } from "@/components";

const initialValues = {
  firstName: "",
  lastName: "",
  email: "",
  phoneNumber: "", // Expect a string from PhoneNumber component
  companyName: "",
  companyEmail: "",
  country: "",
  state: "",
  city: "",
  acceptTerms: false,
};

const signupSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  lastName: Yup.string().required("Last Name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .required("Email is required"),
  companyName: Yup.string().required("Company name is required"),
  companyEmail: Yup.string()
    .email("Wrong email format")
    .required("Company email is required"),
  country: Yup.string().required("Country is required"),
  state: Yup.string().required("State is required"),
  city: Yup.string().required("City is required"),
  plan: Yup.string().required("Plan is required"),
  acceptTerms: Yup.bool().oneOf([true], "You must accept the terms and conditions"),
});

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";

  const formik = useFormik({
    initialValues,
    validationSchema: signupSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);
      try {
        // Log values to check payload
        console.log("Submitting:", values);

        const response = await registerUser(values);

        if (response.success) {
          navigate(from, { replace: true });
        } else {
          setStatus(response.msg || "Registration failed");
        }
      } catch (error) {
        console.error("Registration error:", error.response || error.message);
        if (error.response) {
          setStatus(
            error.response.data.message ||
              JSON.stringify(error.response.data) ||
              "Something went wrong"
          );
        } else {
          setStatus(error.message || "Something went wrong");
        }
      } finally {
        setLoading(false);
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="card max-w-[660px] w-full">
      <form
        className="card-body flex flex-col gap-2 p-5 md:p-7"
        noValidate
        onSubmit={formik.handleSubmit}
      >
        <h3 className="text-lg font-semibold mb-2">Sign Up</h3>
        <span className="text-sm text-gray-700 mb-6">
          Please fill in all the information required to create your account.
        </span>

        {/* User Details */}
        <label className="form-label text-base font-semibold mb-2">User Detail</label>
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <label className="form-label">First Name</label>
            <input
              type="text"
              name="firstName"
              placeholder="First name"
              className={clsx("input", {
                "is-invalid": formik.touched.firstName && formik.errors.firstName,
              })}
              {...formik.getFieldProps("firstName")}
            />
            {formik.touched.firstName && formik.errors.firstName && (
              <div className="text-danger text-xs mt-1">{formik.errors.firstName}</div>
            )}
          </div>
          <div>
            <label className="form-label">Last Name</label>
            <input
              type="text"
              name="lastName"
              placeholder="Last name"
              className={clsx("input", {
                "is-invalid": formik.touched.lastName && formik.errors.lastName,
              })}
              {...formik.getFieldProps("lastName")}
            />
            {formik.touched.lastName && formik.errors.lastName && (
              <div className="text-danger text-xs mt-1">{formik.errors.lastName}</div>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            className={clsx("input", {
              "is-invalid": formik.touched.email && formik.errors.email,
            })}
            {...formik.getFieldProps("email")}
          />
          {formik.touched.email && formik.errors.email && (
            <div className="text-danger text-xs mt-1">{formik.errors.email}</div>
          )}
        </div>

        {/* Phone Number */}
        <PhoneNumber
          name="phoneNumber"
          value={formik.values.phoneNumber}
          onChange={(value) => {
            // If PhoneNumber returns object, extract string here
            const phone = typeof value === "string" ? value : value?.number || "";
            formik.setFieldValue("phoneNumber", phone);
          }}
        />
<div>
  <label className="form-label">Phone No</label>
  <input
    type="text"
    name="countryCode"
    placeholder="Country Code"
    className={clsx("input", {
      "is-invalid": formik.touched.countryCode && formik.errors.countryCode,
    })}
    {...formik.getFieldProps("countryCode")}
  />
  {formik.touched.countryCode && formik.errors.countryCode && (
    <div className="text-danger text-xs mt-1">{formik.errors.countryCode}</div>
  )}
</div>
        {/* Company Detail */}
        <label className="form-label text-base font-semibold mt-6 mb-2">Company Detail</label>

        <div className="mb-4">
          <label className="form-label">Company Name</label>
          <input
            type="text"
            name="companyName"
            placeholder="Company name"
            className={clsx("input", {
              "is-invalid": formik.touched.companyName && formik.errors.companyName,
            })}
            {...formik.getFieldProps("companyName")}
          />
          {formik.touched.companyName && formik.errors.companyName && (
            <div className="text-danger text-xs mt-1">{formik.errors.companyName}</div>
          )}
        </div>

        <div className="mb-4">
          <label className="form-label">Company Email</label>
          <input
            type="email"
            name="companyEmail"
            placeholder="Company email"
            className={clsx("input", {
              "is-invalid": formik.touched.companyEmail && formik.errors.companyEmail,
            })}
            {...formik.getFieldProps("companyEmail")}
          />
          {formik.touched.companyEmail && formik.errors.companyEmail && (
            <div className="text-danger text-xs mt-1">{formik.errors.companyEmail}</div>
          )}
        </div>

        {/* Client Address */}
        <label className="form-label text-base font-semibold mt-6 mb-2">Client Address</label>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="form-label">Country</label>
            <input
              type="text"
              name="country"
              placeholder="Country"
              className={clsx("input", {
                "is-invalid": formik.touched.country && formik.errors.country,
              })}
              {...formik.getFieldProps("country")}
            />
            {formik.touched.country && formik.errors.country && (
              <div className="text-danger text-xs mt-1">{formik.errors.country}</div>
            )}
          </div>
          <div>
            <label className="form-label">State</label>
            <input
              type="text"
              name="state"
              placeholder="State"
              className={clsx("input", {
                "is-invalid": formik.touched.state && formik.errors.state,
              })}
              {...formik.getFieldProps("state")}
            />
            {formik.touched.state && formik.errors.state && (
              <div className="text-danger text-xs mt-1">{formik.errors.state}</div>
            )}
          </div>
          <div>
            <label className="form-label">City</label>
            <input
              type="text"
              name="city"
              placeholder="City"
              className={clsx("input", {
                "is-invalid": formik.touched.city && formik.errors.city,
              })}
              {...formik.getFieldProps("city")}
            />
            {formik.touched.city && formik.errors.city && (
              <div className="text-danger text-xs mt-1">{formik.errors.city}</div>
            )}
          </div>
          <div>
            <label className="form-label">Plan</label>
            <input
              type="text"
              name="plan"
              placeholder="Plan"
              className={clsx("input", {
                "is-invalid": formik.touched.plan && formik.errors.plan,
              })}
              {...formik.getFieldProps("plan")}
            />
            {formik.touched.plan && formik.errors.plan && (
              <div className="text-danger text-xs mt-1">{formik.errors.plan}</div>
            )}
          </div>
          <div>
            <label className="form-label">Address</label>
            <textarea
              name="address"
              placeholder="Address"
              className={clsx("input", {
                "is-invalid": formik.touched.address && formik.errors.address,
              })}
              {...formik.getFieldProps("address")}
            />
            {formik.touched.address && formik.errors.address && (
              <div className="text-danger text-xs mt-1">{formik.errors.address}</div>
            )}
          </div>
          <div>
            <label className="form-label">Country Code</label>
            <input
              type="text"
              name="countryCode"
              placeholder="Country Code"
              className={clsx("input", {
                "is-invalid": formik.touched.zipCode && formik.errors.zipCode,
              })}
              {...formik.getFieldProps("zipCode")}
            />
            {formik.touched.zipCode && formik.errors.zipCode && (
              <div className="text-danger text-xs mt-1">{formik.errors.zipCode}</div>
            )}
          </div>
        </div>

        {/* Accept Terms */}
        <div className="mb-4 flex items-center gap-2">
          <input
            type="checkbox"
            name="acceptTerms"
            id="acceptTerms"
            {...formik.getFieldProps("acceptTerms")}
          />
          <label htmlFor="acceptTerms" className="form-label mb-0">
            I accept the terms and conditions
          </label>
        </div>
        {formik.touched.acceptTerms && formik.errors.acceptTerms && (
          <div className="text-danger text-xs mb-2">{formik.errors.acceptTerms}</div>
        )}

        {/* API Error */}
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}

        <button
          type="submit"
          className="btn btn-primary w-full"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Sign Up"}
        </button>
      </form>
    </div>
  );
};

export { Signup };
