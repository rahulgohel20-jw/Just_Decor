import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, DatePicker } from "antd";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  GetAllSupllierVendors,
  GetUnitData,
  SelectedRawMenuallocation,
} from "@/services/apiServices";

const baseField =
  "h-10 w-full rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500";

const BaseInput = (props) => <input {...props} className={baseField} />;
const BaseSelect = ({ children, ...props }) => (
  <select {...props} className={baseField}>
    {children}
  </select>
);

const GRID = "grid grid-cols-[64px_repeat(6,minmax(0,1fr))_80px]";

export default function CategorySidebarModal({
  open,
  onClose,
  selectedRowData,
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [unit, setUnit] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);

  const FetchAllSuplier = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("userData"));
      const userId = user?.id || 0;
      const res = await GetAllSupllierVendors(userId);
      const supplierData = res?.data?.data?.["Party Details"] || [];
      setSuppliers(supplierData);

      const unitRes = await GetUnitData(userId);
      const unitData = unitRes?.data?.data?.["Unit Details"] || [];
      setUnit(unitData);
    } catch (err) {
      console.error("Error fetching suppliers:", err);
    }
  };

  useEffect(() => {
    FetchAllSuplier();
  }, []);

  useEffect(() => {
    console.log(selectedRowData);

    if (selectedRowData) {
      const details =
        selectedRowData?.["MenuItem RawMaterial Details"]?.map((item) => ({
          id: item.id || Date.now(),
          name: item.rawMaterialName || "",
          menuItemName: item.menuItemName || "-",
          agency: item.partyName || "",
          dateTime: item.dateTime
            ? dayjs(item.dateTime, "DD/MM/YYYY hh:mm a")
            : null,
          weight: item.weight || "",
          unit: item.unitName || "",
          place: item.place || "",
        })) || [];

      setRawMaterials(details.length ? details : [{ id: Date.now() }]);
    }
  }, [selectedRowData]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAddRow = () => {
    setRawMaterials((prev) => [...prev, { id: Date.now() }]);
  };

  const handleRemoveRow = (id) => {
    setRawMaterials((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRawMaterials((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const handleSubmit = async () => {
    try {
      const payload = rawMaterials.map((item) => ({
        dateTime: item.dateTime
          ? dayjs(item.dateTime).format("YYYY-MM-DD HH:mm:ss")
          : "",
        eventFunctionId: selectedRowData?.eventFunctionId || 0,
        eventId: selectedRowData?.eventId || 0,
        id: item.id || 0,
        menuItemId: selectedRowData?.menuItemId || 0,
        partyId: suppliers.find((s) => s.nameEnglish === item.agency)?.id || 0,
        place: item.place || "",
        rate: 0,
        rawMaterialId:
          selectedRowData?.["MenuItem RawMaterial Details"]?.find(
            (r) => r.rawMaterialName === item.name
          )?.rawMaterialId || 0,
        rawmaterial_rate: 0,
        rawmaterial_weight: Number(item.weight) || 0,
        unitId: unit.find((u) => u.nameEnglish === item.unit)?.id || 0,
        weight: Number(item.weight) || 0,
      }));

      console.log("Payload:", payload);

      const res = await SelectedRawMenuallocation(payload);

      if (res?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Raw material data saved successfully.",
        });
        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An unexpected error occurred.",
      });
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1300px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-end">
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                  autoFocus
                >
                  Close
                </button>
              </div>

              <div className="p-5">
                {rawMaterials.map((row, idx) => (
                  <div
                    key={row.id}
                    className="flex items-center justify-between"
                  >
                    <div className="text-[18px] font-semibold text-gray-800">
                      {row.menuItemName || "—"}
                    </div>
                    <button
                      onClick={handleAddRow}
                      className="h-9 px-4 rounded-md bg-primary text-white text-sm hover:bg-blue-700"
                    >
                      Add Raw Material
                    </button>
                  </div>
                ))}

                {/* Table */}
                <div className="mt-4 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Head */}
                  <div
                    className={`${GRID} items-center px-5 py-3 bg-[#F9FAFC] text-[13px] font-medium text-gray-900`}
                  >
                    <div>No.</div>
                    <div className="pl-6">Item Name</div>
                    <div className="pl-4">Agency</div>
                    <div className="pl-4">Date &amp; Time</div>
                    <div className="pl-3">Weight</div>
                    <div className="pl-2">Unit</div>
                    <div className="pl-2">Place</div>
                    <div className="text-center">Action</div>
                  </div>

                  {/* Rows */}
                  {rawMaterials.map((row, idx) => (
                    <div
                      key={row.id}
                      className={`${GRID} items-center gap-4 px-5 py-3 border-t border-gray-100 hover:bg-gray-50/60`}
                    >
                      <div className="text-[13px] text-gray-700">
                        {idx + 1}.
                      </div>
                      <div className="pl-2 text-[13px] text-gray-800">
                        {row.name || "—"}
                      </div>

                      <div>
                        <BaseSelect
                          value={row.agency || ""}
                          onChange={(e) =>
                            handleChange(row.id, "agency", e.target.value)
                          }
                        >
                          <option value="">Select Agency</option>
                          {suppliers.map((s, i) => (
                            <option key={i} value={s.nameEnglish}>
                              {s.nameEnglish}
                            </option>
                          ))}
                        </BaseSelect>
                      </div>

                      <div>
                        <DatePicker
                          className="input "
                          showTime
                          value={row.dateTime}
                          format="MM/DD/YYYY hh:mm A"
                          onChange={(val) =>
                            handleChange(row.id, "dateTime", val)
                          }
                        />
                      </div>

                      <div>
                        <BaseInput
                          type="text"
                          value={row.weight || ""}
                          onChange={(e) =>
                            handleChange(row.id, "weight", e.target.value)
                          }
                          placeholder="Enter weight"
                        />
                      </div>

                      <div>
                        <BaseSelect
                          value={row.unit || ""}
                          onChange={(e) =>
                            handleChange(row.id, "unit", e.target.value)
                          }
                        >
                          <option value="">Select Unit</option>
                          {unit.map((u, i) => (
                            <option key={i} value={u.nameEnglish}>
                              {u.nameEnglish}
                            </option>
                          ))}
                        </BaseSelect>
                      </div>

                      <div>
                        <BaseSelect
                          value={row.place || ""}
                          onChange={(e) =>
                            handleChange(row.id, "place", e.target.value)
                          }
                        >
                          <option value="">Select Place</option>
                          <option>At Venue</option>
                          <option>GoDown</option>
                        </BaseSelect>
                      </div>

                      <div className="flex items-center justify-center">
                        <Tooltip title="Remove">
                          <button
                            type="button"
                            onClick={() => handleRemoveRow(row.id)}
                            className="btn btn-sm btn-icon btn-danger btn-clear"
                          >
                            <i className="ki-filled ki-trash"></i>
                          </button>
                        </Tooltip>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 mt-4">
                  <button
                    onClick={onClose}
                    className="h-9 px-4 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="h-9 px-4 rounded-md bg-primary text-white text-sm hover:bg-blue-700"
                  >
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
