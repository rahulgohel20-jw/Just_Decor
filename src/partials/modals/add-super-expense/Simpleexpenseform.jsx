/**
 * SimpleExpenseForm.jsx
 * Used for: Employee Expense · Office Expense · Serve Expense
 *
 * Features
 *  - Title field (dynamic per type)
 *  - Optional date range (employees only)
 *  - Expense Date (always shown)
 *  - Expense Amount
 *  - Due Date  ← visible ONLY for superadmin (userId === 1)
 *  - Payment Method pills (GPAY / CARD / CASH / BANK)
 *  - Upload Bill (click or drag-and-drop)
 *  - Remarks
 */

import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Upload, FileText, X } from "lucide-react";
import {
  TAB_CONFIG,
  PAYMENT_METHODS,
  inputClass,
  FormLabel,
  ErrorMsg,
  SubmitFooter,
} from "./Expenseconfig";

// ─── SimpleExpenseForm ────────────────────────────────────────────────────────
const SimpleExpenseForm = ({ isOpen, onClose, expenseType = "employees" }) => {
  const config = TAB_CONFIG[expenseType] ?? TAB_CONFIG.employees;

  // Only superadmin (userId === 1) sees the Due Date field
  const userId = Number(localStorage.getItem("userId"));
  const isSuperAdmin = userId === 1;

  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [isDragging, setIsDragging] = useState(false);

  const titleKey = config.titleField.name;

  const initialValues = {
    [titleKey]: "",
    startDate: "",
    endDate: "",
    expenseDate: "",
    amount: "",
    ...(isSuperAdmin ? { dueDate: "" } : {}),
    paymentMethod: "gpay",
    remarks: "",
    billFile: null,
  };

  const validationSchema = Yup.object({
    [titleKey]: Yup.string().required(`${config.titleField.label} is required`),
    amount: Yup.number()
      .typeError("Must be a number")
      .required("Amount is required"),
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
          <span>Add {config.label}</span>
        </div>
      }
      width="500px"
    >
      <Formik
        key={expenseType}
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Submitted:", expenseType, values);
          onClose();
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-4 pb-1">
              {/* ── Title ─────────────────────────────────────────────────── */}
              <div>
                <FormLabel required>{config.titleField.label}</FormLabel>
                <Field
                  name={titleKey}
                  placeholder={config.titleField.placeholder}
                  className={inputClass}
                />
                <ErrorMsg name={titleKey} />
              </div>

              {/* ── Date Range (employees only) ────────────────────────────── */}

              {/* ── Expense Date (always shown) ────────────────────────────── */}
              <div>
                <FormLabel>Expense Date</FormLabel>
                <Field name="expenseDate" type="date" className={inputClass} />
              </div>

              {/* ── Amount  +  Due Date (superadmin only) ──────────────────── */}
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

                {/* Due Date — superadmin only */}
                {isSuperAdmin && (
                  <div>
                    <FormLabel>
                      Due Date
                      {/* <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 text-[10px] font-semibold normal-case tracking-normal">
                        Admin
                      </span> */}
                    </FormLabel>
                    <Field name="dueDate" type="date" className={inputClass} />
                  </div>
                )}
              </div>

              {/* ── Payment Method ─────────────────────────────────────────── */}
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

              {/* ── Upload Bill ────────────────────────────────────────────── */}
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
                      ${
                        isDragging
                          ? "border-blue-400 bg-blue-50"
                          : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/30"
                      }`}
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
                        alt="Preview"
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-blue-500" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800 truncate">
                        {fileName}
                      </p>
                      <p className="text-xs text-gray-400">
                        Uploaded successfully
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => resetFile(setFieldValue)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>

              {/* ── Remarks ───────────────────────────────────────────────── */}
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
            />
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default SimpleExpenseForm;
