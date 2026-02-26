import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Upload, FileText, X } from "lucide-react";
import { AddOrUpdateOfficeExpense } from "@/services/apiServices";
import {
  TAB_CONFIG,
  PAYMENT_METHODS,
  inputClass,
  FormLabel,
  ErrorMsg,
  SubmitFooter,
} from "./Expenseconfig";

// ─── Date Helper ──────────────────────────────────────────────────────────────
// "YYYY-MM-DD" → "DD/MM/YYYY"  (for API submit only)
// HTML <input type="date"> always gives "YYYY-MM-DD", so this is safe.
const toApiDate = (s) => {
  if (!s) return "";
  const [y, m, d] = s.split("-");
  return y && m && d ? `${d}/${m}/${y}` : "";
};

// ─── Doc-path sanity check ────────────────────────────────────────────────────
// API sometimes returns "http://host/pathnull" when doc is absent — treat as no file.
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
  fd.append("userId", userId);
  fd.append("title", values[titleKey] ?? "");
  fd.append("expenseAmount", values.amount ?? 0);
  fd.append("expenseDate", toApiDate(values.expenseDate));
  fd.append("paymentMode", values.paymentMethod ?? "gpay");
  fd.append("remarks", values.remarks ?? "");
  fd.append("expenseType", expenseType);
  if (isSuperAdmin && values.dueDate)
    fd.append("dueDate", toApiDate(values.dueDate));
  if (values.billFile instanceof File) fd.append("doc", values.billFile);
  return fd;
};

// ─── SimpleExpenseForm ────────────────────────────────────────────────────────
const SimpleExpenseForm = ({
  isOpen,
  onClose,
  expenseType = "employees",
  editData = null,
}) => {
  const config = TAB_CONFIG[expenseType] ?? TAB_CONFIG.employees;
  const userId = Number(localStorage.getItem("userId"));
  const isSuperAdmin = userId === 1;

  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [apiError, setApiError] = useState("");

  const titleKey = config.titleField.name;
  const isEditing = !!editData?.id;

  // ── Build initial values ────────────────────────────────────────────────────
  // editData dates arrive as "YYYY-MM-DD" (toInputDate was called in AllExpense)
  // — pass straight into Formik, no extra conversion needed.
  const buildInitialValues = (data = null) => ({
    id: data?.id ?? null,
    [titleKey]: data?.[titleKey] ?? data?.title ?? "",
    expenseDate: data?.expenseDate ?? "",
    amount: data?.amount ?? "",
    ...(isSuperAdmin ? { dueDate: data?.dueDate ?? "" } : {}),
    paymentMethod: data?.paymentMethod ?? "gpay",
    remarks: data?.remarks ?? "",
    billFile: null,
  });

  // ── Sync file-preview state whenever modal opens or editData changes ────────
  useEffect(() => {
    if (!isOpen) return;
    setApiError("");

    const docUrl = editData?.existingDocUrl;
    if (isValidDocUrl(docUrl)) {
      // Show the filename extracted from the URL
      const name = docUrl.split("/").pop() || "Existing Bill";
      setFileName(name);
      // Only show image preview if the URL actually points to an image
      setFilePreview(/\.(png|jpe?g|gif|webp)$/i.test(docUrl) ? docUrl : null);
    } else {
      // No doc attached (or broken URL like "…null") — reset
      setFileName(null);
      setFilePreview(null);
    }
  }, [isOpen, editData]);

  // ── File handlers ───────────────────────────────────────────────────────────
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
        validationSchema={Yup.object({
          [titleKey]: Yup.string().required(
            `${config.titleField.label} is required`,
          ),
          amount: Yup.number()
            .typeError("Must be a number")
            .required("Amount is required"),
        })}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-4 pb-1">
              {/* API Error */}
              {apiError && (
                <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-600 font-medium">
                  {apiError}
                </div>
              )}

              {/* Edit badge */}
              {isEditing && (
                <div className="rounded-xl bg-blue-50 border border-blue-200 px-4 py-2.5 text-sm text-blue-700 font-medium flex items-center gap-2">
                  <svg
                    className="w-4 h-4 shrink-0"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Editing existing expense — changes will update the record.
                </div>
              )}

              {/* Title */}
              <div>
                <FormLabel required>{config.titleField.label}</FormLabel>
                <Field
                  name={titleKey}
                  placeholder={config.titleField.placeholder}
                  className={inputClass}
                />
                <ErrorMsg name={titleKey} />
              </div>

              {/* Expense Date */}
              <div>
                <FormLabel>Expense Date</FormLabel>
                <Field name="expenseDate" type="date" className={inputClass} />
              </div>

              {/* Amount + Due Date */}
              <div
                className={`grid gap-4 ${isSuperAdmin ? "grid-cols-2" : "grid-cols-1"}`}
              >
                <div>
                  <FormLabel required>Expense Amount</FormLabel>
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
                {isSuperAdmin && (
                  <div>
                    <FormLabel>Due Date</FormLabel>
                    <Field name="dueDate" type="date" className={inputClass} />
                  </div>
                )}
              </div>

              {/* Payment Method */}
              <div>
                <FormLabel>Payment Method</FormLabel>
                <div className="grid grid-cols-4 gap-2">
                  {PAYMENT_METHODS.map((method) => {
                    const isSelected = values.paymentMethod === method.value;
                    return (
                      <button
                        key={method.value}
                        type="button"
                        onClick={() =>
                          setFieldValue("paymentMethod", method.value)
                        }
                        className={`flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl border-2 text-xs font-bold transition-all cursor-pointer
                          ${
                            isSelected
                              ? "border-blue-600 bg-blue-600 text-white shadow-md shadow-blue-100"
                              : "border-gray-200 bg-white text-gray-500 hover:border-blue-200 hover:bg-blue-50/50"
                          }`}
                      >
                        <span
                          className={
                            isSelected ? "text-white" : "text-gray-400"
                          }
                        >
                          {method.icon}
                        </span>
                        {method.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Upload Bill */}
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
                  /* ── Drop Zone ── */
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
                  /* ── File Preview ── */
                  <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-4 py-3 bg-white">
                    {filePreview ? (
                      /* Image thumbnail */
                      <img
                        src={filePreview}
                        alt="Bill preview"
                        className="w-12 h-12 rounded-lg object-cover border border-gray-100"
                        onError={(e) => {
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      /* PDF / unknown file icon */
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {fileName}
                      </p>
                      {/* Show "View" link for existing server doc; "Uploaded" for newly chosen file */}
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

                    {/* Remove / replace */}
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

              {/* Remarks */}
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
