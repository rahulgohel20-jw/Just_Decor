import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import * as Yup from "yup";
import { useFormik } from "formik";
import { KeenIcon } from "@/components";
import { useAuthContext } from "@/auth";
import { useLayout } from "@/providers";
import { Alert } from "@/components";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  password: Yup.string()
    .min(6, "Minimum 6 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Password is required"),
  remember: Yup.boolean(),
});
const initialValues = {
  email: "",
  password: "",
  remember: false,
};
const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState(null);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: loginSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      setStatus(null);

      try {
        if (!login) {
          throw new Error("JWTProvider is required for this form.");
        }

        const user = await login(values.email, values.password);

        const roleId = Number(user?.roleId);
        const userPlan = user?.plan ?? null;

        if (roleId === 1) {
          navigate("/super-dashboard", { replace: true });
        } else if (roleId === 2) {
          const userPlan = user?.plan;
          if (!userPlan || userPlan === "") {
            navigate("/price", { replace: true });
            return; // stop further execution
          } else if (user?.isApprove === false) {
            navigate("/approval-pending", { replace: true });
          } else {
            navigate("/", { replace: true });
          }
        } else {
          navigate("/", { replace: true });
        }
      } catch (error) {
        console.error("Login error:", error);
        let errorMessage = "The login details are incorrect";

        if (error.message.includes("Network Error")) {
          errorMessage =
            "Network error. Please check your connection and try again.";
        } else if (error.message.includes("timeout")) {
          errorMessage = "Request timed out. Please try again.";
        } else if (error.message) {
          errorMessage = error.message;
        }

        setStatus(errorMessage);
        setSubmitting(false);
      } finally {
        setLoading(false);
      }
    },
  });

  const togglePassword = (event) => {
    event.preventDefault();
    setShowPassword(!showPassword);
  };
  useState(() => {
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
      formik.setFieldValue("email", rememberedEmail);
      formik.setFieldValue("remember", true);
    }
  });
  return (
    <div className="card max-w-[700px] ">
      <form
        className="card-body flex flex-col gap-2 p-5 md:p-7"
        onSubmit={formik.handleSubmit}
        noValidate
      >
        <div className="mb-2.5">
          <h3 className="text-lg font-semibold text-gray-900 leading-none mb-2.5">
            Sign In
          </h3>
          <span className="text-sm text-gray-700">
            Hey, Enter your details below to sign in and access your account
            securely and easily.
          </span>
        </div>
        {formik.status && <Alert variant="danger">{formik.status}</Alert>}
        <div className="flex flex-col">
          <label className="form-label">Email Address</label>
          <div className="input">
            <i className="ki-filled ki-sms"></i>
            <input
              placeholder="Enter username"
              autoComplete="off"
              {...formik.getFieldProps("email")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.email && formik.errors.email,
              })}
            />
          </div>
          {formik.touched.email && formik.errors.email && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.email}
            </span>
          )}
        </div>
        <div className="flex flex-col">
          <label className="form-label">Password</label>
          <div className="input">
            <i className="ki-filled ki-lock-2"></i>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter Password"
              autoComplete="off"
              {...formik.getFieldProps("password")}
              className={clsx("form-control", {
                "is-invalid": formik.touched.password && formik.errors.password,
              })}
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
          </div>
          {formik.touched.password && formik.errors.password && (
            <span role="alert" className="text-danger text-xs mt-1">
              {formik.errors.password}
            </span>
          )}
        </div>
        <div className="flex items-center justify-between gap-1">
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/otp-login"
                : "/auth/classic/reset-password"
            }
            className="text-sm link shrink-0 hover:underline no-underline"
          >
            Login with OTP instead
          </Link>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/reset-password"
                : "/auth/classic/reset-password"
            }
            className="text-sm link shrink-0 hover:underline no-underline"
          >
            Forgot Password?
          </Link>
        </div>
        <button
          type="submit"
          className="btn btn-primary flex justify-center grow mt-3"
          disabled={loading || formik.isSubmitting}
        >
          {loading ? "Please wait..." : "Login to Your Account"}
        </button>
        <div className="flex items-center gap-2 my-2">
          <span className="border-t border-gray-200 w-full"></span>
          <span className="text-2xs text-gray-500 font-medium uppercase">
            Or
          </span>
          <span className="border-t border-gray-200 w-full"></span>
        </div>

        <div className="flex items-center justify-center ">
          <span className="text-sm text-gray-700 me-1.5">
            Don't have an account?
          </span>
          <Link
            to={
              currentLayout?.name === "auth-branded"
                ? "/auth/signup"
                : "/auth/classic/signup"
            }
            className="text-2sm link hover:underline font-medium no-underline"
          >
            Sign Up
          </Link>
        </div>
      </form>
    </div>
  );
};
export { Login };
