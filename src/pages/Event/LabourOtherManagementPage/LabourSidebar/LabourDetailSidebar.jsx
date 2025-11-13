import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, DatePicker, Spin, message } from "antd";
import dayjs from "dayjs";
import { FormattedMessage } from "react-intl";
import { GetEventLabourBySupplier } from "@/services/apiServices";

const LabourDetailSidebar = ({
  isOpen,
  onClose,
  eventFunctionId,
  eventId,
  contactId,
}) => {
  const [loading, setLoading] = useState(false);
  const [labourData, setLabourData] = useState([]); // array of labour entries for selected contact

  const formatDate = (str) => {
    if (!str) return "";
    const parsed = dayjs(str, ["DD/MM/YYYY hh:mm A", "YYYY-MM-DDTHH:mm:ss"]);
    return parsed.isValid() ? parsed.format("YYYY-MM-DD") : "";
  };

  const fetchLabourData = async () => {
    if (!eventFunctionId || !eventId || !contactId) {
      message.warning("Missing required parameters");
      return;
    }

    try {
      setLoading(true);
      const res = await GetEventLabourBySupplier(
        eventFunctionId,
        eventId,
        contactId
      );

      const labourList = res?.data?.data?.eventLabor || [];
      const filteredLabour = labourList.filter(
        (l) => l.contactid === contactId
      );

      setLabourData(filteredLabour);
      if (filteredLabour.length === 0)
        message.info("No labour data found for this contact");
    } catch (err) {
      console.error("Error fetching labour data:", err);
      message.error("Failed to fetch labour data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) fetchLabourData();
  }, [isOpen, eventFunctionId, eventId, contactId]);

  const calculateTotalQty = () =>
    labourData.reduce((sum, l) => sum + (l.qty || 0), 0);

  const calculateTotalPrice = () =>
    labourData.reduce((sum, l) => sum + (l.price || 0) * (l.qty || 0), 0);

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

          {/* Drawer */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end pr-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto w-[1100px] max-w-[95vw] max-h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-auto flex flex-col"
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
              <div className="p-6">
                {loading ? (
                  <div className="flex justify-center items-center h-[50vh]">
                    <Spin size="large" />
                  </div>
                ) : labourData.length === 0 ? (
                  <p>No labour data found for this contact.</p>
                ) : (
                  <div className="overflow-x-auto">
                    {/* Header Row */}
                    <div className="grid grid-cols-6 gap-2 text-sm font-semibold text-gray-700 border-b pb-2 mb-2">
                      <div>Labour Type</div>
                      <div>Contact</div>
                      <div>Shift</div>
                      <div>Date</div>
                      <div className="text-center">Qty</div>
                      <div className="text-right">Price</div>
                    </div>

                    {/* Data Rows */}
                    {labourData.map((labourRow, idx) => {
                      const formattedDate = labourRow.labordatetime
                        ? dayjs(formatDate(labourRow.labordatetime))
                        : null;

                      return (
                        <div
                          key={idx}
                          className="grid grid-cols-6 gap-2 items-center mb-3 p-2 border rounded hover:bg-gray-50 transition"
                        >
                          <Input value={labourRow.labortypename} readOnly />
                          <Input value={labourRow.contactname} readOnly />
                          <Input value={labourRow.laborshift} readOnly />
                          <DatePicker
                            value={formattedDate}
                            format="MMM D, YYYY"
                            readOnly
                            className="w-full"
                          />
                          <Input
                            value={labourRow.qty}
                            readOnly
                            className="text-center"
                          />
                          <Input
                            value={labourRow.price}
                            readOnly
                            className="text-right"
                          />
                        </div>
                      );
                    })}

                    {/* Totals */}
                    <div className="flex justify-end items-center gap-6 mt-6 border-t pt-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Total Qty:
                        </span>
                        <Input
                          value={calculateTotalQty()}
                          readOnly
                          className="w-20 text-center"
                        />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-700">
                          Total Price:
                        </span>
                        <Input
                          value={calculateTotalPrice().toLocaleString()}
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
