import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, DatePicker, Spin, message } from "antd";
import dayjs from "dayjs";
import { FormattedMessage, useIntl } from "react-intl";
import { GetEventLabourBySupplier } from "@/services/apiServices";

const LabourDetailSidebar = ({ isOpen, onClose, eventFunctionId, eventId, partyId }) => {
  const [loading, setLoading] = useState(false);

  const [labourData, setLabourData] = useState({
    labourType: "",
    contact: "",
    price: 0,
    morningDate: "",
    morningQty: 0,
    eveningDate: "",
    eveningQty: 0,
    nightDate: "",
    nightQty: 0,
  });

  const totalQty =
    Number(labourData.morningQty || 0) +
    Number(labourData.eveningQty || 0) +
    Number(labourData.nightQty || 0);
  const totalPrice = totalQty * (labourData.price || 0);

  // 🔹 Convert "31/10/2025 07:04 PM" → "2025-10-31"
  const formatDate = (str) => {
    if (!str) return "";
    const parsed = dayjs(str, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DDTHH:mm:ss"]);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };

  // 🔹 Fetch labour data from API
  const fetchData = async () => {
    try {
      setLoading(true);

      console.log("🔍 Fetching with params:", { eventFunctionId, eventId, partyId });
      const res = await GetEventLabourBySupplier(eventFunctionId, eventId, partyId);
      console.log("✅ Full API Response:", res);
      console.log("📦 Labor List:", res?.data?.data?.eventLabor);

      // Check for API error or no success
      if (!res?.data?.success) {
        const errorMsg = res?.data?.msg || "Failed to fetch labour details";
        message.error(errorMsg);
        setLoading(false);
        return;
      }

      // ✅ Access eventLabor array directly
      const laborList = res?.data?.data?.eventLabor || [];
      console.log("📊 Labor List Length:", laborList.length);

      if (laborList.length > 0) {
        const morning = laborList.find((l) => l.laborshift === "Morning");
        const evening = laborList.find((l) => l.laborshift === "Evening");
        const night = laborList.find((l) => l.laborshift === "Night");

        console.log("🌅 Morning:", morning);
        console.log("🌆 Evening:", evening);
        console.log("🌃 Night:", night);

        // Get first available record for common fields
        const firstRecord = morning || evening || night;

        setLabourData({
          labourType: firstRecord?.labortypename?.trim() || "",
          contact: firstRecord?.contactname || "",
          price: firstRecord?.price || 0,
          morningDate: morning?.labordatetime ? formatDate(morning.labordatetime) : "",
          morningQty: morning?.qty || 0,
          eveningDate: evening?.labordatetime ? formatDate(evening.labordatetime) : "",
          eveningQty: evening?.qty || 0,
          nightDate: night?.labordatetime ? formatDate(night.labordatetime) : "",
          nightQty: night?.qty || 0,
        });

        message.success(res?.data?.msg || "Labour details loaded successfully");
      } else {
        console.warn("⚠️ Empty labor list returned from API");
        console.warn("💡 Possible reasons:");
        console.warn("   1. No data saved yet for this supplier");
        console.warn("   2. Wrong partyId (should be supplier/contact ID, not party ID)");
        console.warn("   3. Data exists but for different eventFunctionId");
        message.info("No saved labour details found. You can add new details in the main table.");
        
        // Keep empty state so user can see the structure
        setLabourData({
          labourType: "",
          contact: "",
          price: 0,
          morningDate: "",
          morningQty: 0,
          eveningDate: "",
          eveningQty: 0,
          nightDate: "",
          nightQty: 0,
        });
      }
    } catch (err) {
      console.error("❌ Labour fetch error:", err);
      console.error("❌ Error response:", err?.response);
      const errorMsg = err?.response?.data?.msg || err?.response?.data?.message || err?.message || "Failed to fetch labour details";
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const intl = useIntl();

  useEffect(() => {
    if (isOpen) {
      console.log("📋 Sidebar opened with Props:", { 
        eventFunctionId, 
        eventId, 
        partyId,
        allDefined: !!(eventFunctionId && eventId && partyId)
      });
      
      if (eventFunctionId && eventId && partyId) {
        console.log("✅ All params valid, fetching data...");
        fetchData();
      } else {
        console.warn("⚠️ Missing parameters:", { 
          eventFunctionId: eventFunctionId || "❌ missing", 
          eventId: eventId || "❌ missing", 
          partyId: partyId || "❌ missing" 
        });
        message.warning("Missing required parameters to fetch labour details");
      }
    }
  }, [isOpen, eventFunctionId, eventId, partyId]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer container */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto w-[1100px] max-w-[95vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  <FormattedMessage
                    id="COMMON.LABOUR_OVERVIEW"
                    defaultMessage="Labour Overview"
                  />
                  <p className="text-gray-500 text-sm mt-3">
                    <FormattedMessage
                      id="COMMON.REVIEW_MANAGE_LABOR_DETAILS"
                      defaultMessage="Review and manage your labor details"
                    />
                  </p>
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  <FormattedMessage id="COMMON_CLOSE" defaultMessage="Close" /> 
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {loading ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <Spin size="large" />
                  </div>
                ) : (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                    {/* Header Row */}
                    <div className="grid grid-cols-9 text-sm font-semibold text-gray-700 border-b pb-3 mb-3">
                      <div className="col-span-3">
                        <FormattedMessage id="COMMON.LABOUR_DETAILS" defaultMessage="Labour Details" />
                      </div>
                      <div className="col-span-6 text-center">
                        <FormattedMessage id="COMMON.SHIFT_DETAILS" defaultMessage="Shift Details" />
                      </div>
                    </div>

                    {/* Sub Header Row */}
                    <div className="grid grid-cols-9 text-xs font-bold text-dark border-b pb-2 mb-3">
                      <div className="text-center">
                        <FormattedMessage id="COMMON.LABOUR_TYPE" defaultMessage="Labour Type" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.CONTACT" defaultMessage="Contact" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.PRICE" defaultMessage="Price" />
                      </div>
                      <div className="text-center col-span-2">
                        <FormattedMessage id="COMMON.MORNING" defaultMessage="Morning" />
                      </div>
                      <div className="text-center col-span-2">
                        <FormattedMessage id="COMMON.EVENING" defaultMessage="Evening" />
                      </div>
                      <div className="text-center col-span-2">
                        <FormattedMessage id="COMMON.NIGHT" defaultMessage="Night" />
                      </div>
                    </div>

                    {/* Sub-sub header for Date / Qty */}
                    <div className="grid grid-cols-9 text-[11px] text-gray-900 uppercase tracking-wide border-b pb-2 mb-3">
                      <div></div>
                      <div></div>
                      <div></div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.DATE" defaultMessage="Date" />
                      </div>
                      <div className="text-center">
                        <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />
                      </div>
                    </div>

                    {/* Data Row */}
                    <div className="grid grid-cols-9 items-center gap-3 mb-3">
                      <Input value={labourData.labourType} readOnly />
                      <Input value={labourData.contact} readOnly />
                      <Input
                        type="number"
                        value={labourData.price}
                        onChange={(e) =>
                          setLabourData({
                            ...labourData,
                            price: e.target.value,
                          })
                        }
                      />

                      {/* Morning */}
                      <DatePicker
                        value={
                          labourData.morningDate
                            ? dayjs(labourData.morningDate)
                            : null
                        }
                        className="w-full"
                        format="MMM D, YYYY"
                        onChange={(date) =>
                          setLabourData({
                            ...labourData,
                            morningDate: date ? date.format("YYYY-MM-DD") : "",
                          })
                        }
                      />
                      <Input
                        type="number"
                        value={labourData.morningQty}
                        onChange={(e) =>
                          setLabourData({
                            ...labourData,
                            morningQty: e.target.value,
                          })
                        }
                      />

                      {/* Evening */}
                      <DatePicker
                        value={
                          labourData.eveningDate
                            ? dayjs(labourData.eveningDate)
                            : null
                        }
                        className="w-full"
                        format="MMM D, YYYY"
                        onChange={(date) =>
                          setLabourData({
                            ...labourData,
                            eveningDate: date ? date.format("YYYY-MM-DD") : "",
                          })
                        }
                      />
                      <Input
                        type="number"
                        value={labourData.eveningQty}
                        onChange={(e) =>
                          setLabourData({
                            ...labourData,
                            eveningQty: e.target.value,
                          })
                        }
                      />

                      {/* Night */}
                      <DatePicker
                        value={
                          labourData.nightDate
                            ? dayjs(labourData.nightDate)
                            : null
                        }
                        className="w-full"
                        format="MMM D, YYYY"
                        onChange={(date) =>
                          setLabourData({
                            ...labourData,
                            nightDate: date ? date.format("YYYY-MM-DD") : "",
                          })
                        }
                      />
                      <Input
                        type="number"
                        value={labourData.nightQty}
                        onChange={(e) =>
                          setLabourData({
                            ...labourData,
                            nightQty: e.target.value,
                          })
                        }
                      />
                    </div>

                    {/* Totals */}
                    <div className="flex justify-end items-center gap-6 mt-6 border-t pt-4">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          <FormattedMessage id="COMMON.TOTAL_QTY" defaultMessage="Total Qty." />
                        </span>
                        <Input value={totalQty} readOnly className="w-20 text-center" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          <FormattedMessage id="COMMON.TOTAL_PRICE" defaultMessage="Total Price" />
                        </span>
                        <Input
                          value={totalPrice.toLocaleString()}
                          readOnly
                          className="w-32 text-right"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LabourDetailSidebar;