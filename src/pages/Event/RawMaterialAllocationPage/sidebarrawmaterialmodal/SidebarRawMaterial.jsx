import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { GetAllSupllierVendors, Getunit } from "@/services/apiServices";

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
  const [unit, setUnit] = useState();
  const unitOptions = ["Kilogram", "Gram", "Litre", "NOS"];
  const placeOptions = ["At Venue", "Godown"];

  // Fetch agencies when component mounts
  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const userId = storedUser?.id;
        const response = await GetAllSupllierVendors(userId);
        const list = response?.data?.data?.["Party Details"] || [];
        setAgencies(list);
      } catch (error) {
        console.error("Error fetching agencies:", error);
        setAgencies([]);
      } finally {
        setLoading(false);
      }
    };

    const FetchUnits = async () => {
      try {
        const userData = JSON.parse(localStorage.getItem("userData") || "{}");
        const userId = userData.id;

        if (!userId) {
          console.error("User ID not found");
          return;
        }

        const res = await Getunit(userId);

        if (res?.data?.data) {
          const unitData = res.data.data["Unit Details"].map((unit) => ({
            id: unit.id,
            unitName: unit.nameEnglish,
          }));

          setUnit(unitData);
        }
      } catch (error) {
        console.error("Error fetching contact name:", error);
      }
    };
    FetchUnits();

    fetchAgencies();
  }, []);

  useEffect(() => {
    if (selectedRow && open) {
      const functions = selectedRow.eventRawMaterialFunctions || [];

      if (functions.length > 0) {
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
        }));
        setFunctionRows(rows);
      } else {
        // If no functions exist, create one empty row
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
          },
        ]);
      }
    }
  }, [selectedRow, open]);

  // Reset form when closed
  useEffect(() => {
    if (!open) {
      setFunctionRows([]);
    }
  }, [open]);

  // Handle Escape key
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
  // Validate required fields for all rows
  for (let i = 0; i < functionRows.length; i++) {
    const row = functionRows[i];
    if (!row.agency || !row.qty || !row.place) {
      alert(
        `Please fill all required fields (Agency, Qty, Place) in row ${i + 1}`
      );
      return;
    }
  }

  const enrichedRows = functionRows.map((row) => {
    const selectedAgency = agencies.find(
      (a) => (a.nameEnglish || a.name) === row.agency
    );

    const selectedUnit = unit?.find((u) => u.unitName === row.unit);

    return {
      functionId: row.functionId || 0,
      eventFunctionId: row.eventFunctionId || 0,
      functionName: row.functionType || "",
      qty: parseFloat(row.qty) || 0,
      itemName: row.menuItemName || "",
      supplierId: selectedAgency?.id || row.supplierId || 0,
      supplierName: row.agency,
      unitId: selectedUnit?.id || row.unitId || 1,
      unitName: selectedUnit?.unitName || row.unit,
      place: row.place,
      price: parseFloat(row.price) || 0,
      functiondatetime: row.dateTime
        ? dayjs(row.dateTime).format("YYYY-MM-DD HH:mm:ss.0")
        : "",
    };
  });

  const totalQty = enrichedRows.reduce((sum, row) => sum + row.qty, 0);
  const totalPrice = enrichedRows.reduce((sum, row) => sum + row.price, 0);

  const dataToSave = {
    ...selectedRow,
    finalQty: totalQty,
    total: totalPrice,
    eventRawMaterialFunctions: enrichedRows,
    // ✅ FIX: Preserve important IDs
    id: selectedRow.id,
    rawMaterialId: selectedRow.rawMaterialId || selectedRow.id,
  };

  console.log("Data to save from sidebar:", dataToSave);

  if (onSave) {
    onSave(dataToSave);
  }

  onClose();
};

  const handleCancel = () => {
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  Raw Material Allocation - Edit
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                  autoFocus
                >
                  Close
                </button>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto p-6">
                <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_88px] items-center px-4 py-3 bg-[#F9FAFC] text-[13px] font-medium text-gray-700">
                    <div>No.</div>
                    <div className="ml-2">Function Type</div>
                    <div>Menu Item Name</div>
                    <div>Agency</div>
                    <div>Qty</div>
                    <div>Unit</div>
                    <div>Place</div>
                    <div>Date & Time</div>
                    <div className="text-center">Price</div>
                  </div>

                  {/* Form Rows */}
                  {functionRows.length === 0 ? (
                    <div className="px-4 py-8 text-center text-gray-500">
                      No data available
                    </div>
                  ) : (
                    functionRows.map((row, rowIndex) => (
                      <div
                        key={rowIndex}
                        className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_1fr_1fr_88px] items-center gap-3 px-4 py-4 border-t border-gray-100 hover:bg-gray-50"
                      >
                        <div className="text-[13px] text-gray-700 flex items-center gap-1">
                          {rowIndex + 1}.
                        </div>

                        {/* Function Type */}
                        <div>
                          <FieldLabel>{row.functionType || "-"}</FieldLabel>
                        </div>

                        {/* Menu Item Name */}
                        <div>
                          <FieldLabel>{row.menuItemName || "-"}</FieldLabel>
                        </div>

                        {/* Agency */}
                        <div>
                          <BaseSelect
                            value={row.agency}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "agency",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Agency</option>
                            {loading ? (
                              <option disabled>Loading...</option>
                            ) : agencies.length === 0 ? (
                              <option disabled>No agencies found</option>
                            ) : (
                              agencies.map((agency, idx) => (
                                <option
                                  key={idx}
                                  value={agency.nameEnglish || agency.name}
                                >
                                  {agency.nameEnglish || agency.name}
                                </option>
                              ))
                            )}
                          </BaseSelect>
                        </div>

                        {/* Qty */}
                        <div>
                          <BaseInput
                            type="number"
                            placeholder="Qty"
                            value={row.qty}
                            onChange={(e) =>
                              handleInputChange(rowIndex, "qty", e.target.value)
                            }
                          />
                        </div>

                        {/* Unit */}
                        {/* Unit */}
                        <div>
                          <BaseSelect
                            value={row.unit}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "unit",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Unit</option>
                            {unit?.length > 0 ? (
                              unit.map((u) => (
                                <option key={u.id} value={u.unitName}>
                                  {u.unitName}
                                </option>
                              ))
                            ) : (
                              <option disabled>Loading Units...</option>
                            )}
                          </BaseSelect>
                        </div>

                        {/* Place */}
                        <div>
                          <BaseSelect
                            value={row.place}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "place",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Place</option>
                            {placeOptions.map((place) => (
                              <option key={place} value={place}>
                                {place}
                              </option>
                            ))}
                          </BaseSelect>
                        </div>

                        {/* Date & Time */}
                        <div>
                          <DatePicker
                            className="h-9 w-[180px] text-[13px]"
                            showTime
                            format="MM/DD/YYYY hh:mm A"
                            value={row.dateTime}
                            onChange={(date) =>
                              handleInputChange(rowIndex, "dateTime", date)
                            }
                          />
                        </div>

                        {/* Price */}
                        <div>
                          <BaseInput
                            type="number"
                            placeholder="Price"
                            value={row.price}
                            onChange={(e) =>
                              handleInputChange(
                                rowIndex,
                                "price",
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between gap-2">
                <button
                  className="h-9 px-4 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                  onClick={handleCancel}
                >
                  Cancel
                </button>
                <button
                  className="h-9 px-6 rounded-md bg-primary text-white text-sm hover:bg-primary/90"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Save"}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
