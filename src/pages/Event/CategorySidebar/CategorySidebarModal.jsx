import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip, DatePicker, Form } from "antd";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  GetAllSupllierVendors,
  GetUnitData,
  SelectedRawMenuallocation,
} from "@/services/apiServices";

import { FormattedMessage, useIntl } from "react-intl";

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
  eventFunctionId,
  eventId,
  onSave,
}) {
  const [suppliers, setSuppliers] = useState([]);
  const [unit, setUnit] = useState([]);
  const [rawMaterials, setRawMaterials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState("");
  const [selectedPlace, setSelectedPlace] = useState("");
  const intl = useIntl();

  const FetchAllSuplier = async () => {
    setLoading(true);
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    FetchAllSuplier();
  }, []);

  useEffect(() => {
    if (selectedRowData) {
      console.log(selectedRowData);

      const details =
        selectedRowData?.["MenuItem RawMaterial Details"]?.map(
          (item, index) => ({
            id: `row-${Date.now()}-${index}`, // Unique ID for React key and operations
            itemId: item.id || 0, // Store the original item ID from API
            name: item.rawMaterialName || "",
            menuItemName: item.menuItemName || "-",
            agency: item.partyName || "",
            dateTime: item.dateTime
              ? dayjs(item.dateTime, "DD/MM/YYYY hh:mm a")
              : null,
            weight: item.weight || "",
            unit: item.unitName || "",
            place: item.place || "",
            rawMaterialId: item.rawMaterialId || 0,
            menuItemId: item.menuItemId || 0,
            rate: item.rate || 0,
            rawmaterial_rate: item.rawmaterial_rate || 0,
            rawmaterial_weight: item.rawmaterial_weight || 0,
          })
        ) || [];

      setRawMaterials(details.length ? details : []);
    }
  }, [selectedRowData]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleRemoveRow = (id) => {
    setRawMaterials((prev) => prev.filter((r) => r.id !== id));
  };

  const handleChange = (id, field, value) => {
    setRawMaterials((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  // Bulk Allocate Agency to all rows
  const handleAllocateAgency = () => {
    if (!selectedAgency) {
      Swal.fire({
        icon: "warning",
        title: intl.formatMessage({
          id: "COMMON.WARNING",
          defaultMessage: "Warning",
        }),
        text: intl.formatMessage({
          id: "SIDEBAR_MODAL.SELECT_AGENCY_FIRST",
          defaultMessage: "Please select an agency first",
        }),
      });
      return;
    }

    setRawMaterials((prev) =>
      prev.map((r) => ({ ...r, agency: selectedAgency }))
    );

    Swal.fire({
      icon: "success",
      title: intl.formatMessage({
        id: "COMMON.SUCCESS",
        defaultMessage: "Success",
      }),
      text: intl.formatMessage({
        id: "SIDEBAR_MODAL.AGENCY_ALLOCATED",
        defaultMessage: "Agency allocated to all items successfully",
      }),
      timer: 1500,
      showConfirmButton: false,
    });

    // Reset selected agency after allocation
    setSelectedAgency("");
  };

  // Bulk Allocate Place to all rows
  const handleAllocatePlace = () => {
    if (!selectedPlace) {
      Swal.fire({
        icon: "warning",
        title: intl.formatMessage({
          id: "COMMON.WARNING",
          defaultMessage: "Warning",
        }),
        text: intl.formatMessage({
          id: "SIDEBAR_MODAL.SELECT_PLACE_FIRST",
          defaultMessage: "Please select a place first",
        }),
      });
      return;
    }

    setRawMaterials((prev) =>
      prev.map((r) => ({ ...r, place: selectedPlace }))
    );

    Swal.fire({
      icon: "success",
      title: intl.formatMessage({
        id: "COMMON.SUCCESS",
        defaultMessage: "Success",
      }),
      text: intl.formatMessage({
        id: "SIDEBAR_MODAL.PLACE_ALLOCATED",
        defaultMessage: "Place allocated to all items successfully",
      }),
      timer: 1500,
      showConfirmButton: false,
    });

    // Reset selected place after allocation
    setSelectedPlace("");
  };

  const handleSubmit = async () => {
    try {
      if (
        !selectedRowData ||
        !selectedRowData["MenuItem RawMaterial Details"]
      ) {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Missing required data. Please try again.",
        });
        return;
      }

      const payload = rawMaterials.map((item) => {
        const partyId =
          suppliers.find((s) => s.nameEnglish === item.agency)?.id || 0;
        const unitId = unit.find((u) => u.nameEnglish === item.unit)?.id || 0;

        return {
          id: item.itemId || 0, // Use the original item ID, or 0 for new items
          eventId: eventId || 0,
          eventFunctionId: eventFunctionId || 0,
          menuItemId: item.menuItemId || 0,
          rawMaterialId: item.rawMaterialId || 0,
          partyId: partyId,
          unitId: unitId,
          dateTime: item.dateTime
            ? dayjs(item.dateTime).format("YYYY-MM-DD HH:mm:ss")
            : "",
          weight: Number(item.weight) || 1,
          rawmaterial_weight: Number(item.rawmaterial_weight) || 0,
          rate: item.rate || 0,
          rawmaterial_rate: item.rawmaterial_rate || 0,
          place: item.place || "",
        };
      });
      console.log("payload", payload);

      const hasInvalidData = payload.some(
        (item) =>
          !item.eventId ||
          !item.eventFunctionId ||
          !item.menuItemId ||
          !item.rawMaterialId
      );

      if (hasInvalidData) {
        Swal.fire({
          icon: "warning",
          title: "Incomplete Data",
          text: "Please ensure all required fields are filled.",
        });
        return;
      }

      const res = await SelectedRawMenuallocation(payload);

      if (res?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Saved!",
          text: "Raw material data saved successfully.",
        });

        if (onSave) {
          onSave({
            menuItemId: payload[0]?.menuItemId,
            eventFunctionId,
            eventId,
            rawMaterials: payload,
            response: res.data,
          });
        }

        onClose();
      } else {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: res?.data?.message || "Something went wrong.",
        });
      }
    } catch (err) {
      console.error("Submit Error:", err);
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
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1300px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 flex flex-col overflow-hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between flex-shrink-0">
                <div className="flex items-center justify-between gap-4">
                  <div className="text-[18px] font-semibold text-gray-800">
                    {rawMaterials.length > 0
                      ? rawMaterials[0].menuItemName || "—"
                      : "—"}
                  </div>
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                  autoFocus
                >
                  <FormattedMessage id="COMMON.CLOSE" defaultMessage="Close" />
                </button>
              </div>

              <div className="flex flex-col flex-1 min-h-0">
                <div className="p-5 flex-shrink-0">
                  {/* Header Section - Show menu item name */}

                  {/* Bulk Allocate Section - Centered */}
                  <div className="flex items-start justify-start gap-4 mt-4">
                    {/* Bulk Allocate Agency */}
                    <div className="flex items-end gap-2">
                      <select
                        className="select pe-7.5"
                        value={selectedAgency}
                        onChange={(e) => setSelectedAgency(e.target.value)}
                      >
                        <option value="">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.SELECT_AGENCY"
                            defaultMessage="Select Agency"
                          />
                        </option>
                        {loading && (
                          <option>
                            <FormattedMessage
                              id="SIDEBAR_MODAL.LOADING"
                              defaultMessage="Loading..."
                            />
                          </option>
                        )}
                        {!loading && suppliers.length > 0
                          ? suppliers.map((agency) => (
                              <option
                                key={agency.id}
                                value={agency.nameEnglish}
                              >
                                {agency.nameEnglish}
                              </option>
                            ))
                          : !loading && (
                              <option>
                                <FormattedMessage
                                  id="COMMON.NO_AGENCY_FOUND"
                                  defaultMessage="No agencies found"
                                />
                              </option>
                            )}
                      </select>
                      <button
                        className="btn btn-primary"
                        onClick={handleAllocateAgency}
                        disabled={!selectedAgency}
                      >
                        <FormattedMessage
                          id="COMMON.ALLOCATE"
                          defaultMessage="Allocate"
                        />
                      </button>
                    </div>

                    {/* Bulk Allocate Place */}
                    <div className="flex items-end gap-2">
                      <select
                        className="select pe-7.5"
                        value={selectedPlace}
                        onChange={(e) => setSelectedPlace(e.target.value)}
                      >
                        <option value="">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.SELECT_PLACE"
                            defaultMessage="Select Place"
                          />
                        </option>
                        <option value="At Venue">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.AT_VENUE"
                            defaultMessage="At Venue"
                          />
                        </option>
                        <option value="GoDown">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.GO_DOWN"
                            defaultMessage="GoDown"
                          />
                        </option>
                      </select>
                      <button
                        className="btn btn-primary"
                        onClick={handleAllocatePlace}
                        disabled={!selectedPlace}
                      >
                        <FormattedMessage
                          id="COMMON.ALLOCATE"
                          defaultMessage="Allocate"
                        />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Scrollable Table Section */}
                <div className="flex-1 overflow-y-auto px-5 min-h-0">
                  {/* Table */}
                  <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                    {/* Head */}
                    <div
                      className={`${GRID} items-center px-5 py-3 bg-[#F9FAFC] text-[13px] font-medium text-gray-900`}
                    >
                      <div>
                        <FormattedMessage
                          id="SIDEBAR_MODAL.NO"
                          defaultMessage="No."
                        />
                      </div>
                      <div className="pl-6">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.ITEM_NAME"
                          defaultMessage="Item Name"
                        />
                      </div>
                      <div className="pl-4">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.AGENCY"
                          defaultMessage="Agency"
                        />
                      </div>
                      <div className="pl-4">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.DATE_TIME"
                          defaultMessage="Date &amp; Time"
                        />
                      </div>
                      <div className="pl-3">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.WEIGHT"
                          defaultMessage="Weight"
                        />
                      </div>
                      <div className="pl-2">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.UNIT"
                          defaultMessage="Unit"
                        />
                      </div>
                      <div className="pl-2">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.PLACE"
                          defaultMessage="Place"
                        />
                      </div>
                      <div className="text-center">
                        <FormattedMessage
                          id="SIDEBAR_MODAL.ACTIONS"
                          defaultMessage="Action"
                        />
                      </div>
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
                            <option value="">
                              <FormattedMessage
                                id="SIDEBAR_MODAL.SELECT_AGENCY"
                                defaultMessage="Select Agency"
                              />
                            </option>
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
                            placeholder={intl.formatMessage({
                              id: "SIDEBAR_MODAL.WEIGHT_PLACEHOLDER",
                              defaultMessage: "Enter weight",
                            })}
                          />
                        </div>

                        <div>
                          <BaseSelect
                            value={row.unit || ""}
                            onChange={(e) =>
                              handleChange(row.id, "unit", e.target.value)
                            }
                          >
                            <option value="">
                              <FormattedMessage
                                id="SIDEBAR_MODAL.SELECT_UNIT"
                                defaultMessage="Select Unit"
                              />
                            </option>
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
                            <option value="">
                              <FormattedMessage
                                id="SIDEBAR_MODAL.SELECT_PLACE"
                                defaultMessage="Select Place"
                              />
                            </option>
                            <option>
                              <FormattedMessage
                                id="SIDEBAR_MODAL.AT_VENUE"
                                defaultMessage="At Venue"
                              />
                            </option>
                            <option>
                              <FormattedMessage
                                id="SIDEBAR_MODAL.GO_DOWN"
                                defaultMessage="GoDown"
                              />
                            </option>
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
                </div>

                {/* Footer with Save/Cancel buttons - Fixed at bottom */}
                <div className="flex-shrink-0 p-5 border-t border-gray-200 bg-white">
                  <div className="flex items-center justify-between gap-3">
                    <button
                      onClick={onClose}
                      className="h-9 px-4 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <FormattedMessage
                        id="COMMON.CANCEL"
                        defaultMessage="Cancel"
                      />
                    </button>
                    <button
                      onClick={handleSubmit}
                      className="h-9 px-4 rounded-md bg-primary text-white text-sm hover:bg-blue-700"
                    >
                      <FormattedMessage
                        id="COMMON.SAVE"
                        defaultMessage="Save"
                      />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
