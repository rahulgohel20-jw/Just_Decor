/**
 * ComplexExpenseForm.jsx
 * Used for: Trip Expense · Other Expense
 *
 * Features
 *  - Info section (title + conditional dates + cities for trip)
 *  - Payment Details: Expense Amount + Due Date (Due Date → superadmin only)
 *  - Remarks
 *  - Expense Details table (Add Expense Row — date, description, payment mode,
 *    amount, remarks, per-row bill upload, delete)
 *  - NO top-level Upload Bill section
 */

import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useState } from "react";
import { Upload, Trash2, Plus, FileText } from "lucide-react";
import {
  TAB_CONFIG,
  inputClass,
  FormLabel,
  ErrorMsg,
  Section,
  SubmitFooter,
} from "./Expenseconfig";

// ─── ComplexExpenseForm ───────────────────────────────────────────────────────
const ComplexExpenseForm = ({ isOpen, onClose, expenseType = "trip" }) => {
  const config = TAB_CONFIG[expenseType] ?? TAB_CONFIG.trip;

  // Only superadmin (userId === 1) sees Due Date
  const userId = Number(localStorage.getItem("userId"));
  const isSuperAdmin = userId === 1;

  const [rowPreviews, setRowPreviews] = useState({});

  const titleKey = config.titleField.name;

  const initialValues = {
    [titleKey]: "",
    startDate: "",
    endDate: "",
    fromCity: "",
    toCity: "",
    amount: "",
    ...(isSuperAdmin ? { dueDate: "" } : {}),
    remarks: "",
    expenseRows: [],
  };

  const validationSchema = Yup.object({
    [titleKey]: Yup.string().required(`${config.titleField.label} is required`),
    amount: Yup.number()
      .typeError("Must be a number")
      .required("Amount is required"),
  });

  const handleRowFile = (e, index, form) => {
    const file = e.currentTarget.files[0];
    if (!file) return;
    form.setFieldValue(`expenseRows.${index}.file`, file);
    setRowPreviews((p) => ({
      ...p,
      [index]: file.type.startsWith("image/")
        ? URL.createObjectURL(file)
        : file.name,
    }));
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
      width="960px"
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
        {({ isSubmitting, values }) => (
          <Form>
            <div className="max-h-[72vh] overflow-y-auto pr-1 space-y-4 pb-1">
              {/* ── Info Section ───────────────────────────────────────────── */}
              <Section title={config.sectionTitle} icon={config.icon}>
                <div
                  className={
                    config.showDates || config.showCities ? "mb-4" : ""
                  }
                >
                  <FormLabel required>{config.titleField.label}</FormLabel>
                  <Field
                    name={titleKey}
                    placeholder={config.titleField.placeholder}
                    className={inputClass}
                  />
                  <ErrorMsg name={titleKey} />
                </div>

                {/* Date Range */}
                {config.showDates && (
                  <div
                    className={`grid grid-cols-2 gap-4 ${config.showCities ? "mb-4" : ""}`}
                  >
                    <div>
                      <FormLabel>{config.dateLabels.start}</FormLabel>
                      <Field
                        name="startDate"
                        type="date"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FormLabel>{config.dateLabels.end}</FormLabel>
                      <Field
                        name="endDate"
                        type="date"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}

                {/* Cities (trip only) */}
                {config.showCities && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>From City</FormLabel>
                      <Field
                        name="fromCity"
                        placeholder="Mumbai"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <FormLabel>To City</FormLabel>
                      <Field
                        name="toCity"
                        placeholder="Delhi"
                        className={inputClass}
                      />
                    </div>
                  </div>
                )}
              </Section>

              {/* ── Payment Details ─────────────────────────────────────────── */}
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
                {/* Amount always full-width when no due date; side-by-side when superadmin */}
                <div
                  className={`grid gap-4 ${isSuperAdmin ? "grid-cols-2" : "grid-cols-1 max-w-xs"}`}
                >
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

                  {/* Due Date — superadmin only */}
                  {isSuperAdmin && (
                    <div>
                      <FormLabel>
                        Due Date
                        {/* <span className="ml-2 inline-flex items-center px-1.5 py-0.5 rounded-md bg-violet-100 text-violet-600 text-[10px] font-semibold normal-case tracking-normal">
                          Admin
                        </span> */}
                      </FormLabel>
                      <Field
                        name="dueDate"
                        type="date"
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
              </Section>

              {/* ── Remarks ────────────────────────────────────────────────── */}
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

              {/* ── Expense Rows ────────────────────────────────────────────── */}
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
                    {/* Add Row Button */}
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

                    {form.values.expenseRows?.length > 0 ? (
                      <div className="overflow-x-auto rounded-xl border border-gray-100">
                        <table className="w-full text-sm border-collapse">
                          <thead>
                            <tr className="bg-gray-50">
                              {[
                                "Date",
                                "Description",
                                "Payment Mode",
                                "Amount (₹)",

                                "Action",
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

                                {/* Per-row Bill Upload */}
                                <td className="px-3 py-2">
                                  <input
                                    type="file"
                                    accept=".png,.jpg,.jpeg,.pdf"
                                    id={`rowFile-${index}`}
                                    className="hidden"
                                    onChange={(e) =>
                                      handleRowFile(e, index, form)
                                    }
                                  />
                                  <label
                                    htmlFor={`rowFile-${index}`}
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
                                    title="Upload Bill"
                                  >
                                    {rowPreviews[index] ? (
                                      <FileText className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Upload className="w-4 h-4 text-gray-400" />
                                    )}
                                  </label>
                                </td>

                                {/* Delete Row */}
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
                                    className="flex items-center justify-center w-8 h-8 rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 transition border-0 bg-transparent cursor-pointer"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      /* Empty State */
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

export default ComplexExpenseForm;
