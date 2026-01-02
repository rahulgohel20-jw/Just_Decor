import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Tooltip } from "antd"; // Keep only Tooltip from antd
import DatePicker from "react-datepicker"; // Add react-datepicker
import "react-datepicker/dist/react-datepicker.css"; // Add CSS
import Swal from "sweetalert2";
import dayjs from "dayjs";
import {
  OutsideContactName,
  GetUnitData,
  SelectedRawMenuallocation,
  DeleteRawMaterialItem,
  SelectedItemNameMenuAllocation,
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
      const userId = localStorage.getItem("userId");
      const res = await OutsideContactName(5, userId);
      console.log(res);

      const supplierData = res?.data?.data?.["Party Details"] || [];
      console.log(supplierData, "data");

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

  // Helper function to parse date from various formats to Date object
  const parseDateToObject = (dateValue) => {
    if (!dateValue) return null;
    if (dateValue instanceof Date) return dateValue;

    // Try dayjs parsing
    const parsed = dayjs(dateValue, "DD/MM/YYYY hh:mm a", true);
    if (parsed.isValid()) return parsed.toDate();

    // Try ISO parsing
    const isoDate = new Date(dateValue);
    if (!isNaN(isoDate.getTime())) return isoDate;

    return null;
  };

  useEffect(() => {
    if (!open) {
      return;
    }

    if (!selectedRowData) {
      setRawMaterials([]);
      return;
    }

    const rawMaterialDetails = selectedRowData["MenuItem RawMaterial Details"];

    if (rawMaterialDetails && rawMaterialDetails.length > 0) {
      const details = rawMaterialDetails.map((item, index) => ({
        id: `row-${Date.now()}-${index}`,
        itemId: item.id || 0,
        name: item.rawMaterialName || "",
        menuItemName: item.menuItemName || "-",
        agency: item.partyName || "",
        dateTime: parseDateToObject(item.dateTime), // Convert to Date object
        weight: item.weight || "",
        unit: item.unitName || "",
        place: item.place || "",
        rawMaterialId: item.rawMaterialId || 0,
        menuItemId: item.menuItemId || 0,
        rate: item.rate || 0,
        rawmaterial_rate: item.rawmaterial_rate || 0,
        rawmaterial_weight: item.rawmaterial_weight || 0,
      }));

      setRawMaterials(details);
    } else {
      console.log("⚠️ No raw materials found, resetting to empty array");
      setRawMaterials([]);
    }
  }, [selectedRowData, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleRemoveRow = async (id) => {
    const rowToDelete = rawMaterials.find((r) => r.id === id);

    if (rowToDelete?.itemId && rowToDelete.itemId !== 0) {
      const result = await Swal.fire({
        title: intl.formatMessage({
          id: "COMMON.ARE_YOU_SURE",
          defaultMessage: "Are you sure?",
        }),
        text: intl.formatMessage({
          id: "SIDEBAR_MODAL.DELETE_RAW_MATERIAL_WARNING",
          defaultMessage:
            "This will permanently delete this raw material item.",
        }),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: intl.formatMessage({
          id: "COMMON.YES_DELETE",
          defaultMessage: "Yes, delete it!",
        }),
        cancelButtonText: intl.formatMessage({
          id: "COMMON.CANCEL",
          defaultMessage: "Cancel",
        }),
      });

      if (!result.isConfirmed) {
        return;
      }

      try {
        console.log("Deleting raw material item with ID:", rowToDelete.itemId);
        const response = await DeleteRawMaterialItem(rowToDelete.itemId);

        if (response?.data?.success) {
          setRawMaterials((prev) => prev.filter((r) => r.id !== id));

          Swal.fire({
            title: intl.formatMessage({
              id: "COMMON.DELETED",
              defaultMessage: "Deleted!",
            }),
            text: intl.formatMessage({
              id: "SIDEBAR_MODAL.RAW_MATERIAL_DELETED",
              defaultMessage: "Raw material item has been deleted.",
            }),
            icon: "success",
            timer: 1500,
            showConfirmButton: false,
          });
        } else {
          throw new Error(response?.data?.message || "Delete failed");
        }
      } catch (error) {
        console.error("Error deleting raw material:", error);
        Swal.fire({
          title: intl.formatMessage({
            id: "COMMON.ERROR",
            defaultMessage: "Error",
          }),
          text:
            error.message ||
            intl.formatMessage({
              id: "SIDEBAR_MODAL.DELETE_FAILED",
              defaultMessage: "Failed to delete raw material item.",
            }),
          icon: "error",
        });
      }
    } else {
      setRawMaterials((prev) => prev.filter((r) => r.id !== id));
    }
  };

  const handleChange = (id, field, value) => {
    setRawMaterials((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

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

    setSelectedAgency("");
  };

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
          id: item.itemId || 0,
          eventId: eventId || 0,
          eventFunctionId: eventFunctionId || 0,
          menuItemId: item.menuItemId || 0,
          rawMaterialId: item.rawMaterialId || 0,
          partyId: partyId,
          unitId: unitId,
          dateTime: item.dateTime
            ? dayjs(item.dateTime).format("DD/MM/YYYY hh:mm a")
            : "",
          weight: Number(item.weight) || 0,
          rawmaterial_weight: Number(item.rawmaterial_weight) || 1,
          rate: item.rate || 0,
          rawmaterial_rate: item.rawmaterial_rate || 0,
          place: item.place || "",
        };
      });

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

        let freshData = [];

        try {
          const refresh = await SelectedItemNameMenuAllocation(
            eventFunctionId,
            payload[0]?.menuItemId
          );

          if (refresh?.data?.success) {
            freshData =
              refresh.data.data["MenuItem RawMaterial Details"] ||
              refresh.data.data.menuItemRawMaterials ||
              [];

            setRawMaterials(
              freshData.map((item, index) => ({
                id: `row-${Date.now()}-${index}`,
                itemId: item.id || 0,
                name: item.rawMaterialName || "",
                menuItemName: item.menuItemName || "-",
                agency: item.partyName || "",
                dateTime: parseDateToObject(item.dateTime),
                weight: item.weight || "",
                unit: item.unitName || "",
                place: item.place || "",
                rawMaterialId: item.rawMaterialId || 0,
                menuItemId: item.menuItemId || 0,
                rate: item.rate || 0,
                rawmaterial_rate: item.rawmaterial_rate || 0,
                rawmaterial_weight: item.rawmaterial_weight || 0,
              }))
            );
          }
        } catch (err) {
          console.error("Error refresh raw materials:", err);
        }

        if (onSave) {
          onSave({
            menuItemId: payload[0]?.menuItemId,
            eventFunctionId,
            eventId,
            rawMaterials: freshData,
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
                      : selectedRowData?.menuItemName || "—"}
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
                  <div className="flex items-start justify-start gap-4 mt-4">
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

                <div className="flex-1 overflow-y-auto px-5 min-h-0">
                  {rawMaterials.length === 0 ? (
                    <div className="flex items-center justify-center h-full p-8">
                      <div className="text-center">
                        <i className="ki-filled ki-information-2 text-6xl text-gray-300 mb-4"></i>
                        <p className="text-lg font-medium text-gray-700 mb-2">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.NO_RAW_MATERIALS"
                            defaultMessage="No raw materials found for this item"
                          />
                        </p>
                        <p className="text-sm text-gray-500">
                          <FormattedMessage
                            id="SIDEBAR_MODAL.NO_RAW_MATERIALS_DESC"
                            defaultMessage="This menu item doesn't have any raw materials allocated yet."
                          />
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-gray-200 overflow-hidden shadow-sm">
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
                              selected={row.dateTime}
                              onChange={(date) =>
                                handleChange(row.id, "dateTime", date)
                              }
                              showTimeSelect
                              timeFormat="hh:mm aa"
                              timeIntervals={15}
                              dateFormat="MM/dd/yyyy hh:mm aa"
                              className={baseField}
                              placeholderText="Select date & time"
                              popperPlacement="bottom-start"
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
                  )}
                </div>

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
                      disabled={rawMaterials.length === 0}
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
