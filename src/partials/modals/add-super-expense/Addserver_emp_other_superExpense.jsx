import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field, ErrorMessage, FieldArray } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Upload, Trash2, Plus, FileText, X } from "lucide-react";

// ─── Reusable Field Components ───────────────────────────────────────────────

const FormLabel = ({ children, required }) => (
  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
    {children}
    {required && <span className="text-red-400 ml-0.5">*</span>}
  </label>
);

const inputClass =
  "w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-gray-800 bg-white " +
  "placeholder-gray-400 outline-none transition " +
  "focus:border-blue-400 focus:ring-2 focus:ring-blue-50 hover:border-gray-300";

const ErrorMsg = ({ name }) => (
  <ErrorMessage
    name={name}
    component="p"
    className="text-red-400 text-xs mt-1 font-medium"
  />
);

// ─── Section Wrapper ──────────────────────────────────────────────────────────
const Section = ({ title, icon, children }) => (
  <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-5">
    {title && (
      <div className="flex items-center gap-2 mb-4">
        {icon && <span className="text-blue-600">{icon}</span>}
        <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      </div>
    )}
    {children}
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const Addserver_emp_other_superExpense = ({ isOpen, onClose }) => {
  const [filePreview, setFilePreview] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [rowPreviews, setRowPreviews] = useState({});

  const initialValues = {
    tripTitle: "",
    startDate: "",
    endDate: "",
    fromCity: "",
    toCity: "",
    amount: "",
    dueDate: "",
    remarks: "",
    billFile: null,
    expenseRows: [],
  };

  const validationSchema = Yup.object({
    tripTitle: Yup.string().required("Trip title is required"),
    amount: Yup.number()
      .typeError("Must be a number")
      .required("Amount is required"),
  });

  const handleFileChange = (e, setFieldValue) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    setFieldValue("billFile", file);
    setFileName(file.name);
    if (file.type.startsWith("image/")) {
      setFilePreview(URL.createObjectURL(file));
    } else {
      setFilePreview(null);
    }
  };

  const handleRowFile = (e, index, form) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    form.setFieldValue(`expenseRows.${index}.file`, file);
    if (file.type.startsWith("image/")) {
      setRowPreviews((p) => ({ ...p, [index]: URL.createObjectURL(file) }));
    } else {
      setRowPreviews((p) => ({ ...p, [index]: file.name }));
    }
  };

  return (
    <CustomModal
      open={isOpen}
      onClose={onClose}
      title="Add Expense"
      width="960px"
    >
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={(values) => {
          console.log("Form Data:", values);
          onClose();
        }}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form>
            <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-4 pb-1">
              {/* ── Trip Info ── */}
              <Section
                title="Trip Information"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                    />
                  </svg>
                }
              >
                {/* Trip Title */}
                <div className="mb-4">
                  <FormLabel required>Trip Title</FormLabel>
                  <Field
                    name="tripTitle"
                    placeholder="e.g. Q3 Regional Sales Meet"
                    className={inputClass}
                  />
                  <ErrorMsg name="tripTitle" />
                </div>

                {/* Dates row */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <FormLabel>From Date</FormLabel>
                    <Field
                      name="startDate"
                      type="date"
                      className={inputClass}
                    />
                  </div>
                  <div>
                    <FormLabel>To Date</FormLabel>
                    <Field name="endDate" type="date" className={inputClass} />
                  </div>
                </div>

                {/* Cities row */}
              </Section>

              {/* ── Amount & Due Date ── */}
              <Section
                title="Payment Details"
                icon={
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                }
              >
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <FormLabel required>Expense Amount (₹)</FormLabel>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-semibold">
                        ₹
                      </span>
                      <Field
                        name="amount"
                        type="number"
                        placeholder="0.00"
                        className={`${inputClass} pl-7`}
                      />
                    </div>
                    <ErrorMsg name="amount" />
                  </div>
                  <div>
                    <FormLabel>Due Date</FormLabel>
                    <Field name="dueDate" type="date" className={inputClass} />
                  </div>
                </div>
              </Section>

              {/* ── Upload Bill ── */}
              <Section
                title="Upload Bill"
                icon={<FileText className="w-4 h-4" />}
              >
                <input
                  type="file"
                  accept=".png,.jpg,.jpeg,.pdf"
                  className="hidden"
                  id="fileUpload"
                  onChange={(e) => handleFileChange(e, setFieldValue)}
                />

                {!fileName ? (
                  <label
                    htmlFor="fileUpload"
                    className="flex flex-col items-center justify-center border-2 border-dashed border-gray-200 rounded-xl p-8 cursor-pointer hover:border-blue-300 hover:bg-blue-50/30 transition group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center mb-3 group-hover:bg-blue-100 transition">
                      <Upload className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm font-semibold text-blue-600">
                      Click to upload
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      PNG, JPG, PDF — max 10MB
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
                      onClick={() => {
                        setFileName(null);
                        setFilePreview(null);
                        setFieldValue("billFile", null);
                      }}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition border-0 bg-transparent cursor-pointer"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </Section>

              {/* ── Remarks ── */}
              <Section>
                <FormLabel>Remarks</FormLabel>
                <Field
                  as="textarea"
                  name="remarks"
                  rows="3"
                  placeholder="Add any notes or context..."
                  className={`${inputClass} resize-none`}
                />
              </Section>

              {/* ── Dynamic Expense Rows ── */}
              <FieldArray name="expenseRows">
                {({ push, remove, form }) => (
                  <Section
                    title="Expense Details"
                    icon={
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    }
                  >
                    {/* Add row button */}
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            date: "",
                            description: "",
                            paymentMode: "",
                            amount: "",
                            remarks: "",
                            file: null,
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold border-0 cursor-pointer transition"
                      >
                        <Plus className="w-4 h-4" />
                        Add Expense Row
                      </button>
                    </div>

                    {/* Table */}
                    {form.values.expenseRows?.length > 0 && (
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              {[
                                "Date",
                                "Description",
                                "Payment Mode",
                                "Amount (₹)",
                                "Remarks",
                                "Bill",
                                "",
                              ].map((h) => (
                                <th
                                  key={h}
                                  className="px-3 py-2.5 text-left text-xs font-semibold text-gray-500 uppercase tracking-wide whitespace-nowrap border-b border-gray-100"
                                >
                                  {h}
                                </th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {form.values.expenseRows.map((row, index) => (
                              <tr
                                key={index}
                                className="border-t border-gray-50 hover:bg-blue-50/20 transition"
                              >
                                {/* Date */}
                                <td className="px-3 py-2">
                                  <Field
                                    type="date"
                                    name={`expenseRows.${index}.date`}
                                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition"
                                  />
                                </td>

                                {/* Description */}
                                <td className="px-3 py-2">
                                  <Field
                                    name={`expenseRows.${index}.description`}
                                    placeholder="e.g. Taxi fare"
                                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition min-w-[120px]"
                                  />
                                </td>

                                {/* Payment Mode */}
                                <td className="px-3 py-2">
                                  <Field
                                    as="select"
                                    name={`expenseRows.${index}.paymentMode`}
                                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition bg-white cursor-pointer"
                                  >
                                    <option value="">Select</option>
                                    <option value="cash">Cash</option>
                                    <option value="gpay">GPay</option>
                                    <option value="card">Card</option>
                                    <option value="bank">Bank</option>
                                  </Field>
                                </td>

                                {/* Amount */}
                                <td className="px-3 py-2">
                                  <div className="relative">
                                    <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-xs font-semibold">
                                      ₹
                                    </span>
                                    <Field
                                      type="number"
                                      name={`expenseRows.${index}.amount`}
                                      placeholder="0"
                                      className="w-full border border-gray-200 rounded-lg pl-6 pr-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition min-w-[80px]"
                                    />
                                  </div>
                                </td>

                                {/* Remarks */}
                                <td className="px-3 py-2">
                                  <Field
                                    name={`expenseRows.${index}.remarks`}
                                    placeholder="Optional"
                                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-sm outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-100 transition min-w-[100px]"
                                  />
                                </td>

                                {/* Bill Upload */}
                                <td className="px-3 py-2">
                                  <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    id={`fileUpload-${index}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleRowFile(e, index, form)
                                    }
                                  />
                                  <label
                                    htmlFor={`fileUpload-${index}`}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
                                    title="Upload Bill"
                                  >
                                    {rowPreviews[index] ? (
                                      <span className="text-blue-500">
                                        <FileText className="w-4 h-4" />
                                      </span>
                                    ) : (
                                      <Upload className="w-4 h-4 text-gray-400 hover:text-blue-500" />
                                    )}
                                  </label>
                                </td>

                                {/* Delete */}
                                <td className="px-3 py-2">
                                  <button
                                    type="button"
                                    onClick={() => {
                                      remove(index);
                                      setRowPreviews((p) => {
                                        const n = { ...p };
                                        delete n[index];
                                        return n;
                                      });
                                    }}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-transparent hover:border-red-100 hover:bg-red-50 text-gray-400 hover:text-red-500 transition border-0 bg-transparent cursor-pointer"
                                    title="Remove Row"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {form.values.expenseRows.length === 0 && (
                      <div className="flex flex-col items-center justify-center py-8 text-gray-400">
                        <svg
                          className="w-8 h-8 mb-2 opacity-40"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth={1.5}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                          />
                        </svg>
                        <p className="text-sm">
                          No expense rows yet. Click{" "}
                          <span className="font-semibold text-blue-600">
                            Add Expense Row
                          </span>{" "}
                          to begin.
                        </p>
                      </div>
                    )}
                  </Section>
                )}
              </FieldArray>
            </div>

            {/* ── Footer Buttons ── */}
            <div className="flex items-center justify-end gap-3 pt-4 mt-1 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition cursor-pointer bg-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold border-0 cursor-pointer transition disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="w-4 h-4 animate-spin"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit Expense"
                )}
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default Addserver_emp_other_superExpense;
