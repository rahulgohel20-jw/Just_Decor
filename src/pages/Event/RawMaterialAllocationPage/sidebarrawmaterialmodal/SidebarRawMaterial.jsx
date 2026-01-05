import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import { OutsideContactName } from "@/services/apiServices";
import PlaceSelect from "../../../../components/PlaceSelect/PlaceSelect";

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
  sidebarunit, // ✅ Unit data from parent
}) {
  const [functionRows, setFunctionRows] = useState([]);
  const [unit, setUnit] = useState([]);
  const [supplier, setSupplier] = useState([]);
  let userId = localStorage.getItem("userId");

  // ✅ Set unit from parent prop
  useEffect(() => {
    if (sidebarunit && Array.isArray(sidebarunit) && sidebarunit.length > 0) {
      setUnit(sidebarunit);
    }
  }, [sidebarunit]);

  useEffect(() => {
    if (selectedRow && open) {
      const functions = selectedRow.eventRawMaterialFunctions || [];

      if (functions.length > 0) {
        const rows = functions.map((func, index) => {
          // ✅ Get unitHierarchyDto from func or construct from unit object
          const unitHierarchy =
            func.unitHierarchyDto ||
            (func.unit
              ? {
                  unitId: func.unit.id,
                  nameEnglish: func.unit.nameEnglish,
                  nameHindi: func.unit.nameHindi || null,
                  nameGujarati: func.unit.nameGujarati || null,
                  symbolEnglish: func.unit.symbolEnglish || null,
                  symbolHindi: func.unit.symbolHindi || null,
                  symbolGujarati: func.unit.symbolGujarati || null,
                  children: func.unit.children || [],
                }
              : null);

          return {
            id: index + 1,
            functionType: func.functionName || "",
            menuItemName: func.itemName || "",
            qty: func.qty ?? selectedRow.qty ?? "",
            price: func.price ?? 0,
            supplierId: func.supplierId ?? selectedRow.supplierId ?? "",
            agency: func.supplierName ?? selectedRow.agency ?? "",

            // ✅ Use unitHierarchyDto for unitId
            unitId: Number(
              unitHierarchy?.unitId ??
                func.unitId ??
                selectedRow.unitHierarchyDto?.unitId ??
                selectedRow.unitId ??
                1
            ),

            unit:
              unitHierarchy?.nameEnglish ??
              func.unitName ??
              selectedRow.unit ??
              "KILO",

            // ✅ Store complete unit objects
            unitObject: func.unit || null,
            unitHierarchyDto: unitHierarchy,

            place: func.place || selectedRow.place || "",

            dateTime:
              func.functiondatetime && dayjs(func.functiondatetime).isValid()
                ? dayjs(func.functiondatetime)
                : null,

            functionId: func.functionId || null,
            eventFunctionId: func.eventFunctionId || null,
            isExtraField: func.isExtraField || false,
          };
        });

        setFunctionRows(rows);
      }
    }
  }, [selectedRow, open]);

  useEffect(() => {
    if (!open) setFunctionRows([]);
  }, [open]);

  useEffect(() => {}, [unit]);

  useEffect(() => {
    FetchSupplier();
  }, []);

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
      // if (!row.agency || !row.qty || !row.place) {
      //   alert(`Please fill all required fields in row ${i + 1}`);
      //   return;
      // }
    }

    // ✅ Calculate total quantity from all function rows
    const totalFunctionQty = functionRows.reduce((sum, row) => {
      return sum + (parseFloat(row.qty) || 0);
    }, 0);

    const enrichedRows = functionRows.map((row) => ({
      functionId: row.functionId || 0,
      eventFunctionId: row.eventFunctionId || 0,
      functionName: row.functionType || "",
      qty: parseFloat(row.qty) || 0,
      itemName: row.menuItemName || "",

      supplierId: row.supplierId || 0,
      supplierName: row.agency || "",

      unitId: row.unitId || 1,
      unitName: row.unit || "KILO",

      // ✅ FULL UNIT OBJECT
      unit: row.unitObject || null,

      // ✅ REQUIRED BY BACKEND
      unitHierarchyDto: row.unitHierarchyDto
        ? {
            unitId: row.unitHierarchyDto.unitId,
            nameEnglish: row.unitHierarchyDto.nameEnglish,
            nameHindi: row.unitHierarchyDto.nameHindi || null,
            nameGujarati: row.unitHierarchyDto.nameGujarati || null,
            symbolEnglish: row.unitHierarchyDto.symbolEnglish || null,
            symbolHindi: row.unitHierarchyDto.symbolHindi || null,
            symbolGujarati: row.unitHierarchyDto.symbolGujarati || null,
            children: row.unitHierarchyDto.children || [],
          }
        : null,

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
      // ✅ Add the calculated total quantity to update finalQty in parent
      calculatedFinalQty: totalFunctionQty,
      qtyWasModified: true, // Flag to indicate quantity was changed in sidebar
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
            <div className="p-2 flex-1 overflow-auto">
              <div className="border rounded-xl overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead className="bg-gray-100 sticky top-0">
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
                    {functionRows.length === 0 ? (
                      <tr>
                        <td
                          colSpan="9"
                          className="p-8 text-center text-gray-500"
                        >
                          No function data available
                        </td>
                      </tr>
                    ) : (
                      functionRows.map((row, idx) => (
                        <tr
                          key={idx}
                          className={`border-t align-top ${
                            row.isExtraField
                              ? "bg-yellow-50"
                              : "hover:bg-gray-50"
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
                                  selectedSupplier?.nameEnglish || ""
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

                          {/* ✅ UNIT DROPDOWN - ONLY HIERARCHY */}
                          <td className="p-3 w-[130px]">
                            <BaseSelect
                              value={row.unitId || ""}
                              onChange={(e) => {
                                const selectedUnitId = parseInt(e.target.value);

                                // ✅ Find unit from hierarchy OR fallback to main unit list
                                let selectedUnit = null;

                                // First try to find in unitHierarchyDto
                                if (row.unitHierarchyDto) {
                                  if (
                                    row.unitHierarchyDto.unitId ===
                                    selectedUnitId
                                  ) {
                                    selectedUnit = {
                                      id: row.unitHierarchyDto.unitId,
                                      nameEnglish:
                                        row.unitHierarchyDto.nameEnglish,
                                      nameHindi: row.unitHierarchyDto.nameHindi,
                                      nameGujarati:
                                        row.unitHierarchyDto.nameGujarati,
                                      symbolEnglish:
                                        row.unitHierarchyDto.symbolEnglish,
                                      symbolHindi:
                                        row.unitHierarchyDto.symbolHindi,
                                      symbolGujarati:
                                        row.unitHierarchyDto.symbolGujarati,
                                      children:
                                        row.unitHierarchyDto.children || [],
                                    };
                                  } else if (row.unitHierarchyDto.children) {
                                    const childUnit =
                                      row.unitHierarchyDto.children.find(
                                        (c) => c.unitId === selectedUnitId
                                      );
                                    if (childUnit) {
                                      selectedUnit = {
                                        id: childUnit.unitId,
                                        nameEnglish: childUnit.nameEnglish,
                                        nameHindi: childUnit.nameHindi,
                                        nameGujarati: childUnit.nameGujarati,
                                        symbolEnglish: childUnit.symbolEnglish,
                                        symbolHindi: childUnit.symbolHindi,
                                        symbolGujarati:
                                          childUnit.symbolGujarati,
                                        children: [],
                                      };
                                    }
                                  }
                                }

                                // Fallback to main unit list if not found in hierarchy
                                if (!selectedUnit) {
                                  selectedUnit = unit.find(
                                    (u) => u.id === selectedUnitId
                                  );
                                }

                                if (selectedUnit) {
                                  handleInputChange(
                                    idx,
                                    "unitId",
                                    selectedUnit.id
                                  );
                                  handleInputChange(
                                    idx,
                                    "unit",
                                    selectedUnit.nameEnglish
                                  );
                                  handleInputChange(
                                    idx,
                                    "unitObject",
                                    selectedUnit
                                  );

                                  // ✅ Create proper unitHierarchyDto
                                  handleInputChange(idx, "unitHierarchyDto", {
                                    unitId: selectedUnit.id,
                                    nameEnglish: selectedUnit.nameEnglish,
                                    nameHindi: selectedUnit.nameHindi || null,
                                    nameGujarati:
                                      selectedUnit.nameGujarati || null,
                                    symbolEnglish:
                                      selectedUnit.symbolEnglish || null,
                                    symbolHindi:
                                      selectedUnit.symbolHindi || null,
                                    symbolGujarati:
                                      selectedUnit.symbolGujarati || null,
                                    children: selectedUnit.children || [],
                                  });
                                }
                              }}
                            >
                              <option value="">Select Unit</option>

                              {/* ✅ Show parent unit from hierarchy */}
                              {row.unitHierarchyDto && (
                                <option
                                  key={row.unitHierarchyDto.unitId}
                                  value={row.unitHierarchyDto.unitId}
                                >
                                  {row.unitHierarchyDto.nameEnglish}
                                </option>
                              )}

                              {/* ✅ Show children units from hierarchy */}
                              {row.unitHierarchyDto?.children?.map(
                                (childUnit) => (
                                  <option
                                    key={childUnit.unitId}
                                    value={childUnit.unitId}
                                  >
                                    {childUnit.nameEnglish}
                                  </option>
                                )
                              )}

                              {/* ✅ Fallback: Show current unit if not in hierarchy */}
                              {row.unitId &&
                                row.unitHierarchyDto?.unitId !== row.unitId &&
                                !row.unitHierarchyDto?.children?.some(
                                  (c) => c.unitId === row.unitId
                                ) && (
                                  <option value={row.unitId}>{row.unit}</option>
                                )}
                            </BaseSelect>
                          </td>

                          <td className="p-3 w-[140px]">
                            <PlaceSelect
                              value={row.place}
                              onChange={(value) =>
                                handleInputChange(idx, "place", value)
                              }
                            />
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
                      ))
                    )}
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
