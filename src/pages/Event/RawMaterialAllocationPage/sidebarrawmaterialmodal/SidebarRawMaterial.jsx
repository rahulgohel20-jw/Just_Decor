import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { GetUnitData, OutsideContactName } from "@/services/apiServices";

/* ---------- UI ATOMS ---------- */

const FieldLabel = ({ children }) => (
  <div className="text-sm text-gray-800 font-medium truncate">{children}</div>
);

const BaseInput = (props) => (
  <input
    {...props}
    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
  />
);

const BaseSelect = (props) => (
  <select
    {...props}
    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
  >
    {props.children}
  </select>
);

/* ---------- MAIN COMPONENT ---------- */

export default function SidebarRawMaterial({
  open,
  onClose,
  selectedRow,
  onSave,
}) {
  const [functionRows, setFunctionRows] = useState([]);
  const [unit, setUnit] = useState([]);
  const [supplier, setSupplier] = useState([]);
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    if (selectedRow && open) {
      const functions = selectedRow.eventRawMaterialFunctions || [];

      if (functions.length > 0) {
        const rows = functions.map((func, index) => ({
          id: index + 1,

          // ✅ FUNCTION LEVEL
          functionType: func.functionName || "",
          menuItemName: func.itemName || "",

          qty: func.qty ?? selectedRow.qty ?? "",
          price: func.price ?? 0,

          // ✅ SUPPLIER (fallback to selectedRow)
          supplierId: func.supplierId ?? selectedRow.supplierId ?? "",
          agency: func.supplierName ?? selectedRow.agency ?? "",

          // ✅ UNIT (fallback)
          unitId: func.unitId ?? selectedRow.unitId ?? "",
          unit: func.unitName ?? selectedRow.unit ?? "",

          // ✅ PLACE (fallback)
          place: func.place || selectedRow.place || "",

          // ✅ DATE
          dateTime:
            func.functiondatetime && dayjs(func.functiondatetime).isValid()
              ? dayjs(func.functiondatetime)
              : null,

          functionId: func.functionId || null,
          eventFunctionId: func.eventFunctionId || null,
          isExtraField: func.isExtraField || false,
        }));

        setFunctionRows(rows);
      }
    }
  }, [selectedRow, open]);

  useEffect(() => {
    if (!open) setFunctionRows([]);
  }, [open]);

  useEffect(() => {
    if (!unit.length || !functionRows.length) return;

    setFunctionRows((prev) =>
      prev.map((row) => {
        if (!row.unitId) return row;

        const matchedUnit = unit.find((u) => u.id === row.unitId);

        if (!matchedUnit) return row;

        return {
          ...row,
          unitId: matchedUnit.id,
          unit: matchedUnit.nameEnglish,
        };
      })
    );
  }, [unit]);

  useEffect(() => {
    FetchUnit();
    FetchSupplier();
  }, []);

  const FetchUnit = async () => {
    try {
      const data = await GetUnitData(userId);

      setUnit(data?.data?.data["Unit Details"] || []);
    } catch (error) {
      console.log(error);
    }
  };

  const FetchSupplier = async () => {
    try {
      const data = await OutsideContactName(3, userId);

      setSupplier(data?.data?.data["Party Details"] || []);
    } catch (error) {
      console.log(error);
    }
  };

  /* ---------- HANDLERS ---------- */

  const handleInputChange = (rowIndex, field, value) => {
    setFunctionRows((prev) =>
      prev.map((row, index) =>
        index === rowIndex ? { ...row, [field]: value } : row
      )
    );
  };

  const handleSave = () => {
    for (let i = 0; i < functionRows.length; i++) {
      const row = functionRows[i];
      if (!row.agency || !row.qty || !row.place) {
        alert(`Please fill all required fields in row ${i + 1}`);
        return;
      }
    }

    const enrichedRows = functionRows.map((row) => ({
      functionId: row.functionId || 0,
      eventFunctionId: row.eventFunctionId || 0,
      functionName: row.functionType || "",
      qty: parseFloat(row.qty) || 0,
      itemName: row.menuItemName || "",
      supplierId: row.supplierId || 0,
      supplierName: row.agency,
      unitId: row.unitId || 1,
      unitName: row.unit,
      place: row.place,
      price: parseFloat(row.price) || 0,
      functiondatetime: row.dateTime
        ? dayjs(row.dateTime).format("YYYY-MM-DD HH:mm:ss.0")
        : "",
      isExtraField: row.isExtraField || false,
    }));

    const dataToSave = {
      ...selectedRow,
      eventRawMaterialFunctions: enrichedRows,
    };

    onSave?.(dataToSave);
    onClose();
  };

  /* ---------- UI ---------- */

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            className="absolute top-6 bottom-6 right-6 w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl flex flex-col"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
          >
            {/* HEADER */}
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Raw Material Allocation</h2>
              <button
                className="px-3 py-1 border rounded hover:bg-gray-50"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            {/* TABLE */}
            <div className="p-2">
              <div className="border rounded-xl overflow-x-auto ">
                <table className="w-full border-collapse ">
                  <thead className="bg-gray-100">
                    <tr className="text-sm font-semibold text-gray-700">
                      <th className="p-3 text-left">Sr.</th>
                      <th className="p-3 text-left">Function</th>
                      <th className="p-3 text-left">Item Name</th>
                      <th className="p-3 text-left">Agency</th>
                      <th className="p-3 text-left">Qty</th>
                      <th className="p-3 text-left">Unit</th>
                      <th className="p-3 text-left">Place</th>
                      <th className="p-3 text-left">Date & Time</th>
                      <th className="p-3 text-left">Price</th>
                    </tr>
                  </thead>

                  <tbody>
                    {functionRows.map((row, idx) => (
                      <tr
                        key={idx}
                        className={`border-t align-top ${
                          row.isExtraField ? "bg-yellow-50" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="p-3">{row.id}.</td>

                        <td className="p-3">{row.functionType || "-"}</td>

                        {/* ✅ FULL ITEM NAME */}
                        <td className="p-3 text-sm text-gray-800 whitespace-normal break-words max-w-[320px]">
                          {row.menuItemName || "-"}
                        </td>

                        <td className="p-3">
                          <BaseSelect
                            value={row.supplierId || ""}
                            onChange={(e) => {
                              const selectedSupplier = supplier.find(
                                (s) => s.id === parseInt(e.target.value)
                              );

                              handleInputChange(
                                idx,
                                "supplierId",
                                selectedSupplier?.id || ""
                              );
                              handleInputChange(
                                idx,
                                "agency",
                                selectedSupplier?.nameEnglish || "" //
                              );
                            }}
                          >
                            <option value="">Select Agency</option>

                            {supplier.map((s) => (
                              <option key={s.id} value={s.id}>
                                {s.nameEnglish}
                              </option>
                            ))}
                          </BaseSelect>
                        </td>

                        <td className="p-3 w-[90px]">
                          <BaseInput
                            type="number"
                            className="text-center"
                            value={row.qty}
                            onChange={(e) =>
                              handleInputChange(idx, "qty", e.target.value)
                            }
                          />
                        </td>

                        <td className="p-3 w-[130px]">
                          <BaseSelect
                            value={row.unitId || ""}
                            onChange={(e) => {
                              const selectedUnit = unit.find(
                                (u) => u.id === parseInt(e.target.value) // ✅ Parse to number
                              );

                              handleInputChange(
                                idx,
                                "unitId",
                                selectedUnit?.id || ""
                              );
                              handleInputChange(
                                idx,
                                "unit",
                                selectedUnit?.nameEnglish || ""
                              );
                            }}
                          >
                            <option value="">Select Unit</option>

                            {unit.map((u) => (
                              <option key={u.id} value={u.id}>
                                {u.nameEnglish}
                              </option>
                            ))}
                          </BaseSelect>
                        </td>

                        <td className="p-3 w-[140px]">
                          <BaseSelect
                            value={row.place}
                            onChange={(e) =>
                              handleInputChange(idx, "place", e.target.value)
                            }
                          >
                            <option value="">Select</option>
                            <option value="At Venue">At Venue</option>
                            <option value="Godown">Godown</option>
                          </BaseSelect>
                        </td>

                        <td className="p-3 w-[200px]">
                          <DatePicker
                            className="h-9 w-full text-sm"
                            showTime
                            value={row.dateTime}
                            onChange={(date) =>
                              handleInputChange(idx, "dateTime", date)
                            }
                          />
                        </td>

                        <td className="p-3 w-[120px]">
                          <BaseInput
                            type="number"
                            className="text-right"
                            value={row.price}
                            onChange={(e) =>
                              handleInputChange(idx, "price", e.target.value)
                            }
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* FOOTER */}
            <div className="px-6 py-4 border-t flex justify-end gap-3">
              <button
                className="px-4 py-2 border rounded hover:bg-gray-50"
                onClick={onClose}
              >
                Cancel
              </button>
              <button
                className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
