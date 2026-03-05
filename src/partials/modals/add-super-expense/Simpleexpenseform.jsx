import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Upload, FileText, X } from "lucide-react";
import Select from "react-select";
import { AddOrUpdateOfficeExpense, Fetchmanager } from "@/services/apiServices";
import {
  TAB_CONFIG,
  PAYMENT_METHODS,
  inputClass,
  FormLabel,
  ErrorMsg,
  SubmitFooter,
} from "./Expenseconfig";

// ─── Date Helper ──────────────────────────────────────────────────────────────
const toApiDate = (s) => {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
};

// ─── Doc-path sanity check ────────────────────────────────────────────────────
const isValidDocUrl = (url) =>
  !!url && !url.endsWith("null") && !url.endsWith("undefined");

// ─── FormData Builder ─────────────────────────────────────────────────────────
const buildSimpleFormData = (
  values,
  titleKey,
  userId,
  isSuperAdmin,
  expenseType,
) => {
  const fd = new FormData();
  fd.append("id", values.id ?? -1);
  fd.append("userId", values.employeeId ?? userId);
  fd.append("title", values[titleKey] ?? "");
  fd.append("expenseAmount", values.amount ?? 0);
  fd.append("expenseDate", toApiDate(values.expenseDate));
  fd.append("paymentMode", values.paymentMethod ?? "gpay");
  fd.append("remarks", values.remarks ?? "");
  fd.append("expenseType", expenseType);
  if (values.paidDate) fd.append("paidDate", toApiDate(values.paidDate));
  if (isSuperAdmin && values.dueDate)
    fd.append("dueDate", toApiDate(values.dueDate));
  if (values.billFile instanceof File) fd.append("doc", values.billFile);
  return fd;
};

const SimpleExpenseForm = ({
  isOpen,
  onClose,
  expenseType = "employees",
  editData = null,
}) => {
  const config = TAB_CONFIG[expenseType] ?? TAB_CONFIG.employees;
  const userId = Number(localStorage.getItem("mainId"));
  const isSuperAdmin = userId === 1;

  const isEmployeeTab = expenseType === "employees";
  const isofficeTab = expenseType === "office";
  const isotherTab = expenseType === "other";
  const isServeTab = expenseType === "serve";

  // Tabs that show the employee dropdown
  const showDropdown = isEmployeeTab || isofficeTab || isotherTab;

  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [apiError, setApiError] = useState("");
  const [managers, setManagers] = useState([]);
  const [managersLoading, setManagersLoading] = useState(false);

  const titleKey = config.titleField.name;
  const isEditing = !!editData?.id;

  // ── Fetch managers — only for employee, office, other tabs (NOT serve) ─────
  useEffect(() => {
    if (!isOpen || !showDropdown) return;
    setManagersLoading(true);
    Fetchmanager(1)
      .then((res) => {
        if (res?.data?.data?.userDetails) {
          setManagers(
            res.data.data.userDetails.map((man) => ({
              value: man.id,
              label: man.firstName || "-",
            })),
          );
        } else {
          setManagers([]);
        }
      })
      .catch(() => setManagers([]))
      .finally(() => setManagersLoading(false));
  }, [isOpen, showDropdown]);

  // ── Sync file-preview state whenever modal opens or editData changes ────────
  useEffect(() => {
    if (!isOpen) return;
    setApiError("");

    const docUrl = editData?.existingDocUrl;
    if (isValidDocUrl(docUrl)) {
      const name = docUrl.split("/").pop() || "Existing Bill";
      setFileName(name);
      setFilePreview(/\.(png|jpe?g|gif|webp)$/i.test(docUrl) ? docUrl : null);
    } else {
      setFileName(null);
      setFilePreview(null);
    }
  }, [isOpen, editData]);

  // ── Build initial values ───────────────────────────────────────────────────
  const buildInitialValues = (data = null) => ({
    id: data?.id ?? null,
    [titleKey]: data?.[titleKey] ?? data?.title ?? "",
    employeeId: data?.employeeId ?? null,
    expenseDate: data?.expenseDate ?? "",
    paidDate: data?.paidDate ?? "",
    amount: data?.amount ?? "",
    ...(isSuperAdmin ? { dueDate: data?.dueDate ?? "" } : {}),
    paymentMethod: data?.paymentMethod ?? "gpay",
    remarks: data?.remarks ?? "",
    billFile: null,
  });

  const handleFile = (file, setFieldValue) => {
    if (!file) return;
    setFieldValue("billFile", file);
    setFileName(file.name);
    setFilePreview(
      file.type.startsWith("image/") ? URL.createObjectURL(file) : null,
    );
  };

  const handleDrop = (e, setFieldValue) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file, setFieldValue);
  };

  const resetFile = (setFieldValue) => {
    setFileName(null);
    setFilePreview(null);
    setFieldValue("billFile", null);
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError("");
    try {
      const fd = buildSimpleFormData(
        values,
        titleKey,
        userId,
        isSuperAdmin,
        expenseType,
      );
      await AddOrUpdateOfficeExpense(fd);
      onClose();
    } catch (err) {
      const msg =
        err?.response?.data?.message ??
        err?.response?.data ??
        err.message ??
        "Something went wrong.";
      setApiError(typeof msg === "string" ? msg : JSON.stringify(msg));
    } finally {
      setSubmitting(false);
    }
  };

  // ── Validation schema ───────────────────────────────────────────────────────
  const validationSchema = Yup.object({
    // Dropdown tabs validate employeeId (optional); serve + others validate titleKey text
    ...(showDropdown
      ? { employeeId: Yup.mixed().nullable() }
      : {
          [titleKey]: Yup.string().required(
            `${config.titleField.label} is required`,
          ),
        }),
    amount: Yup.number()
      .typeError("Must be a number")
      .required("Amount is required"),
  });

  // ───────────────────────────────────────────────────────────────────────────
  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2.5">
          <span
            className={`w-8 h-8 rounded-xl flex items-center justify-center ${config.color}`}
          >
            {config.icon}
          </span>
          <span>
            {isEditing ? "Edit" : "Add"} {config.label}
          </span>
        </div>
      }
      width="500px"
    >
      <Formik
        key={`simple-${expenseType}-${editData?.id ?? "new"}`}
        initialValues={buildInitialValues(editData)}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({
          isSubmitting,
          setFieldValue,
          setFieldTouched,
          values,
          errors,
          touched,
        }) => (
          <Form>
            <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-4 pb-1">
              {/* API Error */}
              {apiError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                  {apiError}
                </div>
              )}

              {/* ── Title / Employee Field ─────────────────────────────── */}
              <div>
                <FormLabel>{config.titleField.label}</FormLabel>

                {isServeTab ? (
                  // ── Serve tab: plain text input, no dropdown ──
                  <>
                    <Field
                      name={titleKey}
                      placeholder={config.titleField.placeholder}
                      className={inputClass}
                    />
                    <ErrorMsg name={titleKey} />
                  </>
                ) : showDropdown ? (
                  // ── Employee / Office / Other: employee dropdown ──
                  <>
                    <Select
                      options={managers}
                      isLoading={managersLoading}
                      placeholder={
                        managersLoading ? "Loading..." : "Search employee..."
                      }
                      value={
                        managers.find((m) => m.value === values.employeeId) ??
                        null
                      }
                      onChange={(sel) => {
                        setFieldValue("employeeId", sel?.value ?? null);
                        setFieldValue(titleKey, sel?.label ?? "");
                        setFieldTouched("employeeId", true);
                      }}
                      onBlur={() => setFieldTouched("employeeId", true)}
                      isClearable
                      noOptionsMessage={() => "No employees found"}
                      styles={{
                        control: (base, state) => ({
                          ...base,
                          borderRadius: "0.75rem",
                          borderColor: state.isFocused
                            ? "#60a5fa"
                            : errors.employeeId && touched.employeeId
                              ? "#f87171"
                              : "#e5e7eb",
                          boxShadow: state.isFocused
                            ? "0 0 0 2px #dbeafe"
                            : "none",
                          fontSize: "0.875rem",
                          minHeight: "42px",
                          "&:hover": { borderColor: "#d1d5db" },
                        }),
                        option: (base, state) => ({
                          ...base,
                          fontSize: "0.875rem",
                          backgroundColor: state.isSelected
                            ? "#1d4ed8"
                            : state.isFocused
                              ? "#eff6ff"
                              : "white",
                          color: state.isSelected ? "white" : "#1f2937",
                        }),
                        placeholder: (base) => ({
                          ...base,
                          color: "#9ca3af",
                        }),
                      }}
                    />
                    {errors.employeeId && touched.employeeId && (
                      <p className="text-red-400 text-xs mt-1 font-medium">
                        {errors.employeeId}
                      </p>
                    )}
                  </>
                ) : (
                  // ── Fallback: plain text ──
                  <>
                    <Field
                      name={titleKey}
                      placeholder={config.titleField.placeholder}
                      className={inputClass}
                    />
                    <ErrorMsg name={titleKey} />
                  </>
                )}
              </div>

              {/* ── Expense Date & Paid Date ───────────────────────────── */}
              <div
                className={`grid gap-4 ${isSuperAdmin ? "grid-cols-2" : "grid-cols-1"}`}
              >
                <div>
                  <FormLabel>Expense Date</FormLabel>
                  <Field
                    name="expenseDate"
                    type="date"
                    className={inputClass}
                  />
                </div>

                {isSuperAdmin && (
                  <div>
                    <FormLabel>Paid Date</FormLabel>
                    <Field name="paidDate" type="date" className={inputClass} />
                  </div>
                )}
              </div>

              {/* ── Due Date — superadmin only ─────────────────────────── */}
              {isSuperAdmin && (
                <div>
                  <FormLabel>Due Date</FormLabel>
                  <Field name="dueDate" type="date" className={inputClass} />
                </div>
              )}

              {/* ── Amount ────────────────────────────────────────────── */}
              <div
                className={`grid gap-4 ${isSuperAdmin ? "grid-cols-2" : "grid-cols-1"}`}
              >
                <div>
                  <FormLabel required>Amount</FormLabel>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                      ₹
                    </span>
                    <Field
                      name="amount"
                      type="number"
                      placeholder="0.00"
                      className={`${inputClass} pl-8`}
                    />
                  </div>
                  <ErrorMsg name="amount" />
                </div>
              </div>

              {/* ── Upload Bill ───────────────────────────────────────── */}
              <div>
                <FormLabel>Upload Bill</FormLabel>
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  id="simpleFileUpload"
                  onChange={(e) =>
                    handleFile(e.currentTarget.files[0], setFieldValue)
                  }
                />

                {!fileName ? (
                  <label
                    htmlFor="simpleFileUpload"
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={(e) => handleDrop(e, setFieldValue)}
                    className={`flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all
                      ${isDragging ? "border-blue-400 bg-blue-50" : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"}`}
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3">
                      <Upload className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-blue-600">
                      Upload a file or drag and drop
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, PDF — up to 10MB
                    </p>
                  </label>
                ) : (
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white">
                    {filePreview ? (
                      <img
                        src={filePreview}
                        alt="Bill preview"
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {fileName}
                      </p>
                      {!values.billFile &&
                      isValidDocUrl(editData?.existingDocUrl) ? (
                        <a
                          href={editData.existingDocUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-blue-500 hover:underline"
                        >
                          View existing bill ↗
                        </a>
                      ) : (
                        <p className="text-xs text-gray-400">Ready to upload</p>
                      )}
                    </div>

                    <button
                      type="button"
                      onClick={() => resetFile(setFieldValue)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition border-0 bg-transparent cursor-pointer shrink-0"
                      title="Remove file"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Remarks ───────────────────────────────────────────── */}
              <div>
                <FormLabel>Remarks</FormLabel>
                <Field
                  as="textarea"
                  name="remarks"
                  rows="3"
                  placeholder="Add any additional details or notes..."
                  className={`${inputClass} resize-none`}
                />
              </div>
            </div>

            <SubmitFooter
              isSubmitting={isSubmitting}
              label={config.label}
              onClose={onClose}
              isEditing={isEditing}
            />
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default SimpleExpenseForm;
