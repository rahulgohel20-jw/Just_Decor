import { Addupdateemployeeexpense, GETAllCity } from "@/services/apiServices";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { Formik, Form, Field, FieldArray } from "formik";
import * as Yup from "yup";
import { useState, useEffect } from "react";
import { Upload, Trash2, Plus, FileText } from "lucide-react";
import Select from "react-select";
import {
  TAB_CONFIG,
  inputClass,
  FormLabel,
  ErrorMsg,
  Section,
  SubmitFooter,
} from "./Expenseconfig";

// ─── Date Helper ──────────────────────────────────────────────────────────────

/**
 * "YYYY-MM-DD" (HTML input value) → "DD/MM/YYYY" (what the API expects on submit)
 * Input type="date" ALWAYS gives YYYY-MM-DD, so this is the only conversion needed.
 */
const toApiDate = (dateStr) => {
  if (!dateStr) return "";
  const [y, m, d] = dateStr.split("-");
  if (!y || !m || !d) return "";
  return `${d}/${m}/${y}`;
};

// ─── FormData Builder ─────────────────────────────────────────────────────────
const buildFormData = (
  values,
  titleKey,
  expenseType,
  userId,
  expenseId = null,
) => {
  const fd = new FormData();
  fd.append("title", values[titleKey] ?? "");
  fd.append("userId", userId);
  fd.append("totalAmount", values.amount);
  fd.append("expenseType", expenseType);
  fd.append("id", expenseId ?? -1);

  // ✅ All date fields go through toApiDate → "DD/MM/YYYY" for API
  if (values.startDate) fd.append("fromDate", toApiDate(values.startDate));
  if (values.endDate) fd.append("toDate", toApiDate(values.endDate));
  if (values.dueDate) fd.append("dueDate", toApiDate(values.dueDate));

  if (expenseType === "trip") {
    if (values.fromCity) fd.append("fromCityId", values.fromCity);
    if (values.toCity) fd.append("toCityId", values.toCity);
  }

  (values.expenseRows ?? []).forEach((row, i) => {
    const k = (field) => `detailRequestDtos[${i}].${field}`;
    fd.append(k("perticular"), row.description ?? "");
    fd.append(k("expenseDate"), toApiDate(row.date)); // ✅ DD/MM/YYYY to API
    fd.append(k("paymentMode"), row.paymentMode || "gpay");
    fd.append(k("remarks"), row.remarks ?? "");
    fd.append(k("userId"), userId);
    fd.append(k("amount"), row.amount ?? 0);
    fd.append(k("id"), row.id ?? -1);
    fd.append(k("expenseId"), row.expenseId ?? -1);
    if (row.file instanceof File) fd.append(k("file"), row.file);
  });

  return fd;
};

// ─── ComplexExpenseForm ───────────────────────────────────────────────────────
// editData: null = new  |  object = edit (all date fields already "YYYY-MM-DD")
const ComplexExpenseForm = ({
  isOpen,
  onClose,
  expenseType = "trip",
  editData = null,
}) => {
  const config = TAB_CONFIG[expenseType] ?? TAB_CONFIG.trip;
  const userId = Number(localStorage.getItem("userId"));
  const isSuperAdmin = userId === 1;

  const [rowPreviews, setRowPreviews] = useState({});
  const [apiError, setApiError] = useState("");
  const [cityOptions, setCityOptions] = useState([]);

  const citySelectOptions = cityOptions.map((c) => ({
    value: c.id,
    label: c.name,
  }));
  const titleKey = config.titleField.name;
  const isEditing = !!editData?.id;

  // ── Build initial values ───────────────────────────────────────────────────
  // editData dates are already "YYYY-MM-DD" (toInputDate was applied in AllExpense)
  // so we pass them straight into Formik — no conversion needed here.
  const buildInitialValues = (data = null) => ({
    id: data?.id ?? null,
    [titleKey]: data?.[titleKey] ?? data?.title ?? "",
    startDate: data?.startDate ?? "", // "YYYY-MM-DD" or ""
    endDate: data?.endDate ?? "", // "YYYY-MM-DD" or ""
    fromCity: data?.fromCity ?? null,
    toCity: data?.toCity ?? null,
    amount: data?.amount ?? "",
    ...(isSuperAdmin ? { dueDate: data?.dueDate ?? "" } : {}),
    remarks: data?.remarks ?? "",
    expenseRows: (data?.expenseRows ?? []).map((r) => ({
      id: r.id ?? -1,
      expenseId: r.expenseId ?? data?.id ?? -1,
      date: r.date ?? "", // "YYYY-MM-DD" or ""
      description: r.description ?? "",
      paymentMode: r.paymentMode ?? "gpay",
      amount: r.amount ?? "",
      remarks: r.remarks ?? "",
      file: null,
      existingDocUrl: r.existingDocUrl ?? null,
    })),
  });

  // ── Fetch cities when modal opens ──────────────────────────────────────────
  useEffect(() => {
    if (isOpen && config.showCities) {
      GETAllCity()
        .then((res) => setCityOptions(res?.data?.data?.["city Details"] ?? []))
        .catch(() => setCityOptions([]));
    }
  }, [isOpen, config.showCities]);

  // ── Sync row previews when editData changes ────────────────────────────────
  useEffect(() => {
    if (isOpen) {
      setApiError("");
      const previews = {};
      (editData?.expenseRows ?? []).forEach((row, i) => {
        if (row.existingDocUrl) {
          previews[i] = /\.(png|jpe?g|gif|webp)$/i.test(row.existingDocUrl)
            ? row.existingDocUrl
            : row.existingDocUrl.split("/").pop() || "Existing Bill";
        }
      });
      setRowPreviews(previews);
    }
  }, [isOpen, editData]);

  // ── Per-row file handler ───────────────────────────────────────────────────
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

  // ── Submit ─────────────────────────────────────────────────────────────────
  const handleSubmit = async (values, { setSubmitting }) => {
    setApiError("");
    try {
      const fd = buildFormData(
        values,
        titleKey,
        expenseType,
        userId,
        values.id ?? null,
      );
      await Addupdateemployeeexpense(fd);
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

  // ──────────────────────────────────────────────────────────────────────────
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
      width="960px"
    >
      <Formik
        // ✅ key forces clean remount on new vs edit, or switching between records
        key={`complex-${expenseType}-${editData?.id ?? "new"}`}
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
        {({ isSubmitting, values, setFieldValue }) => (
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

                {/* Date range — browser renders YYYY-MM-DD as locale date (DD/MM/YYYY in India) */}
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

                {/* Cities */}
                {config.showCities && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <FormLabel>From City</FormLabel>
                      <Select
                        options={citySelectOptions}
                        placeholder="Search city..."
                        value={
                          citySelectOptions.find(
                            (opt) => opt.value === values.fromCity,
                          ) ?? null
                        }
                        onChange={(sel) =>
                          setFieldValue("fromCity", sel?.value ?? null)
                        }
                        isClearable
                      />
                    </div>
                    <div>
                      <FormLabel>To City</FormLabel>
                      <Select
                        options={citySelectOptions}
                        placeholder="Search city..."
                        value={
                          citySelectOptions.find(
                            (opt) => opt.value === values.toCity,
                          ) ?? null
                        }
                        onChange={(sel) =>
                          setFieldValue("toCity", sel?.value ?? null)
                        }
                        isClearable
                      />
                    </div>
                  </div>
                )}
              </Section>

              {/* ── Payment Details ────────────────────────────────────────── */}
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
                  {isSuperAdmin && (
                    <div>
                      <FormLabel>Due Date</FormLabel>
                      <Field
                        name="dueDate"
                        type="date"
                        className={inputClass}
                      />
                    </div>
                  )}
                </div>
              </Section>

              {/* ── Remarks ───────────────────────────────────────────────── */}
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

              {/* ── Expense Rows ───────────────────────────────────────────── */}
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
                    <div className="flex justify-end mb-4">
                      <button
                        type="button"
                        onClick={() =>
                          push({
                            id: -1,
                            expenseId: editData?.id ?? -1,
                            date: "",
                            description: "",
                            paymentMode: "gpay",
                            amount: "",
                            remarks: "",
                            file: null,
                            existingDocUrl: null,
                          })
                        }
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white text-sm font-semibold border-0 cursor-pointer transition"
                      >
                        <Plus className="w-4 h-4" /> Add Expense Row
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
                                {/* Date — browser shows DD/MM/YYYY in India locale; value is YYYY-MM-DD */}
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
                                    <option value="gpay">GPay</option>
                                    <option value="cash">Cash</option>
                                    <option value="card">Card</option>
                                    <option value="netbanking">
                                      Net Banking
                                    </option>
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

                                {/* Bill Upload */}
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
                                    title={
                                      rowPreviews[index]
                                        ? String(rowPreviews[index])
                                        : "Upload Bill"
                                    }
                                    className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition cursor-pointer"
                                  >
                                    {rowPreviews[index] ? (
                                      <FileText className="w-4 h-4 text-blue-500" />
                                    ) : (
                                      <Upload className="w-4 h-4 text-gray-400" />
                                    )}
                                  </label>
                                  {/* ✅ View link for existing doc when editing */}
                                  {!form.values.expenseRows[index]?.file &&
                                    row.existingDocUrl && (
                                      <a
                                        href={row.existingDocUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="block text-[10px] text-blue-500 hover:underline mt-0.5 max-w-[60px] truncate"
                                      >
                                        View
                                      </a>
                                    )}
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
              isEditing={isEditing}
            />
          </Form>
        )}
      </Formik>
    </CustomModal>
  );
};

export default ComplexExpenseForm;
