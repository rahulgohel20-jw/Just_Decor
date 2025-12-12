import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import dayjs from "dayjs";

const FieldLabel = ({ children }) => (
  <div className="text-[16px] text-black leading-none mb-1">{children}</div>
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

export default function SidebarRawMaterial({
  open,
  onClose,
  selectedRow,
  onSave,
}) {
  const [functionRows, setFunctionRows] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [unit, setUnit] = useState([]);

  useEffect(() => {
    if (selectedRow && open) {
      const functions = selectedRow.eventRawMaterialFunctions || [];

      if (functions.length > 0) {
        // 🔥 SIMPLIFIED: Just display ALL rows from API
        const rows = functions.map((func, index) => ({
          id: index + 1,
          functionType: func.functionName || "",
          menuItemName: func.itemName || "",
          agency: func.supplierName || "",
          supplierId: func.supplierId || null,
          qty: func.qty || "",
          unit: func.unitName || "Kilogram",
          unitId: func.unitId || null,
          place: func.place || "",
          dateTime:
            func.functiondatetime && dayjs(func.functiondatetime).isValid()
              ? dayjs(func.functiondatetime)
              : null,
          price: func.price || 0,
          functionId: func.functionId || null,
          eventFunctionId: func.eventFunctionId || null,
          isExtraField: func.isExtraField || false,
        }));

        // 🔥 Sort: Extra rows first
        rows.sort((a, b) => {
          if (a.isExtraField && !b.isExtraField) return -1;
          if (!a.isExtraField && b.isExtraField) return 1;
          return 0;
        });

        // Re-index
        rows.forEach((row, index) => {
          row.id = index + 1;
        });

        setFunctionRows(rows);
      } else {
        setFunctionRows([
          {
            id: 1,
            functionType: "",
            menuItemName: selectedRow.material || "",
            agency: selectedRow.agency || "",
            supplierId: null,
            qty: "",
            unit: selectedRow.unit || "Kilogram",
            unitId: null,
            place: selectedRow.place || "",
            dateTime:
              selectedRow.date && dayjs(selectedRow.date).isValid()
                ? dayjs(selectedRow.date)
                : null,
            price: 0,
            functionId: null,
            eventFunctionId: null,
            isExtraField: false,
          },
        ]);
      }
    }
  }, [selectedRow, open]);

  useEffect(() => {
    if (!open) {
      setFunctionRows([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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
        alert(
          `Please fill all required fields (Agency, Qty, Place) in row ${i + 1}`
        );
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

    const totalQty = enrichedRows.reduce((sum, row) => sum + row.qty, 0);
    const totalPrice = enrichedRows.reduce((sum, row) => sum + row.price, 0);

    const dataToSave = {
      ...selectedRow,
      finalQty: totalQty,
      total: totalPrice,
      eventRawMaterialFunctions: enrichedRows,
      id: selectedRow.id,
      rawMaterialId: selectedRow.rawMaterialId || selectedRow.id,
    };

    console.log("Data to save:", dataToSave);

    if (onSave) {
      onSave(dataToSave);
    }

    onClose();
  };

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

          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
            >
              <div className="px-6 py-4 border-b flex items-center justify-between">
                <div className="text-lg font-semibold">
                  Raw Material Allocation
                </div>
                <button
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                  onClick={onClose}
                >
                  Close
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="border rounded-xl overflow-hidden">
                  <div className="grid grid-cols-9 gap-4 px-4 py-3 bg-gray-50 font-medium text-sm">
                    <div>Sr.</div>
                    <div>Function</div>
                    <div>Item Name</div>
                    <div>Agency</div>
                    <div>Qty</div>
                    <div>Unit</div>
                    <div>Place</div>
                    <div>Date & Time</div>
                    <div>Price</div>
                  </div>

                  {functionRows.map((row, idx) => (
                    <div
                      key={idx}
                      className={`grid grid-cols-9 gap-4 px-4 py-4 border-t ${
                        row.isExtraField ? "bg-yellow-50" : "hover:bg-gray-50"
                      }`}
                    >
                      <div className="flex items-center">{row.id}.</div>
                      <div>
                        <FieldLabel>{row.functionType || "-"}</FieldLabel>
                      </div>
                      <div>
                        <FieldLabel>{row.menuItemName || "-"}</FieldLabel>
                      </div>
                      <div>
                        <BaseSelect
                          value={row.agency}
                          onChange={(e) =>
                            handleInputChange(idx, "agency", e.target.value)
                          }
                        >
                          <option value="">Select Agency</option>
                          <option value="Sahil">Sahil</option>
                          <option value="Agency 2">Agency 2</option>
                        </BaseSelect>
                      </div>
                      <div>
                        <BaseInput
                          type="number"
                          value={row.qty}
                          onChange={(e) =>
                            handleInputChange(idx, "qty", e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <BaseSelect
                          value={row.unit}
                          onChange={(e) =>
                            handleInputChange(idx, "unit", e.target.value)
                          }
                        >
                          <option value="Gram">Gram</option>
                          <option value="Kilogram">Kilogram</option>
                          <option value="Litre">Litre</option>
                        </BaseSelect>
                      </div>
                      <div>
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
                      </div>
                      <div>
                        <DatePicker
                          className="h-9 w-full text-sm"
                          showTime
                          value={row.dateTime}
                          onChange={(date) =>
                            handleInputChange(idx, "dateTime", date)
                          }
                        />
                      </div>
                      <div>
                        <BaseInput
                          type="number"
                          value={row.price}
                          onChange={(e) =>
                            handleInputChange(idx, "price", e.target.value)
                          }
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="px-6 py-4 border-t flex justify-between">
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
        </div>
      )}
    </AnimatePresence>
  );
}
