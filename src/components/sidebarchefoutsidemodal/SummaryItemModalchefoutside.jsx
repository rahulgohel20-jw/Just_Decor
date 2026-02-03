import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormattedMessage } from "react-intl";
import { toAbsoluteUrl } from "@/utils";
import { GetOutsideSummary } from "@/services/apiServices";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 fill-current"
  >
    <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
  </svg>
);

const FunctionSection = ({ functionData, index }) => {
  const [expandedItems, setExpandedItems] = useState({});

  const eventFunction = functionData?.eventFunction || {};
  const functionName = eventFunction?.function?.nameEnglish || "N/A";
  const functionDateTime = eventFunction?.functionStartDateTime || "N/A";
  const agencyResponse = functionData?.agencyResponse || [];

  const toggleItems = (itemIndex) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemIndex]: !prev[itemIndex],
    }));
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-6">
        <button className="btn btn-sm btn-primary w-[100px] flex justify-center mt-3">
          {functionName}
        </button>

        <div className="flex flex-col mb-4">
          <div className="text-[12px] text-gray-600">
            <FormattedMessage
              id="SIDEBAR_MODAL.DATE_TIME"
              defaultMessage="Date and Time"
            />
          </div>
          <div>
            <input
              className="input"
              type="text"
              value={functionDateTime}
              readOnly
            />
          </div>
        </div>
      </div>

      <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
        {/* Table Header */}
        <div className="grid grid-cols-[40px_1.5fr_1.5fr_2fr_2fr_1fr_1.5fr_140px] mt-3 items-center">
          <div className="text-sm font-semibold text-gray-700 text-center">
            #
          </div>
          <div className="text-sm font-semibold text-gray-700 ps-3">
            Contact Name
          </div>
          <div className="text-sm font-semibold text-gray-700 ps-3">
            Type
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-700">
              Counter
            </span>
            <div className="grid grid-cols-2 gap-4 mt-1 text-xs text-gray-600">
              <span>Quantity</span>
              <span>Price</span>
            </div>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-sm font-semibold text-gray-700">
              Helper
            </span>
            <div className="grid grid-cols-2 gap-4 mt-1 text-xs text-gray-600">
              <span>Quantity</span>
              <span>Price</span>
            </div>
          </div>
          <div className="text-sm font-semibold text-gray-700 text-center">
            Total Pax
          </div>
          <div className="text-sm font-semibold text-gray-700 text-center">
            Total Price
          </div>
          <div className="text-sm font-semibold text-gray-700 text-center">
            Action
          </div>
        </div>

        {/* Data Rows */}
        {agencyResponse.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No data available
          </div>
        ) : (
          agencyResponse.map((item, itemIndex) => (
            <div key={itemIndex}>
              <div className="grid grid-cols-[40px_1.5fr_1.5fr_2fr_2fr_1fr_1.5fr_140px] mt-3 items-center bg-white p-3 rounded-lg shadow-sm border">
                {/* No. */}
                <div className="text-sm text-gray-800 text-center flex justify-start ps-1">
                  {itemIndex + 1}
                </div>

                {/* Contact Name */}
                <div className="text-sm font-medium text-gray-900">
                  {item.contactName || "N/A"}
                </div>

                {/* Type */}
                <div className="text-sm text-gray-800">
                  {item.type || "N/A"}
                </div>

                {/* Counter Quantity & Price */}
                <div className="flex justify-center space-x-2 gap-9 text-gray-700">
                  <span>{item.totalCounterQty || 0}</span>
                  <span>{item.totalCounterPrice || 0}</span>
                </div>

                {/* Helper Quantity & Price */}
                <div className="flex justify-center space-x-2 gap-9 text-gray-700">
                  <span>{item.totalHelperQty || 0}</span>
                  <span>{item.totalHeplerPrice || 0}</span>
                </div>

                {/* Total Pax */}
                <div className="text-gray-700 text-center">
                  {item.totalPax || 0}
                </div>

                {/* Total Price */}
                <div className="text-sm font-semibold text-gray-900 text-center ps-7">
                  {item.totalPrice || 0}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-center space-x-2">
                  <button className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white">
                    <WhatsAppIcon />
                  </button>

                  <button className="p-2 flex items-center justify-center">
                    <img
                      src={toAbsoluteUrl("/media/icons/PDFIcon.png")}
                      className="w-6 h-6 object-contain"
                      alt="PDF Icon"
                    />
                  </button>

                  <button
                    onClick={() => toggleItems(itemIndex)}
                    className="text-blue-600 hover:text-gray-600 transition-transform"
                  >
                    <motion.svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      animate={{
                        rotate: expandedItems[itemIndex] ? 180 : 0,
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </motion.svg>
                  </button>
                </div>
              </div>

              {/* Expandable Items Section */}
              <AnimatePresence>
                {expandedItems[itemIndex] && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-7"
                  >
                    {/* Items Table Header */}
                    <div className="grid grid-cols-7 gap-4 bg-gray-50 px-5 py-3 border-[#ffffff]">
                      <div className="text-sm font-semibold text-gray-700">
                        #
                      </div>
                      <div className="text-sm font-semibold text-gray-700 col-span-2">
                        Menu Item Name
                      </div>
                      <div className="flex flex-col items-center justify-start">
                        <span className="text-sm font-semibold text-gray-700">
                          Quantity
                        </span>
                        <div className="grid grid-cols-2 gap-4 mt-1 text-xs text-gray-600">
                          <span>Counter</span>
                          <span>Helper</span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center">
                        <span className="text-sm font-semibold text-gray-700">
                          Price
                        </span>
                        <div className="grid grid-cols-2 gap-4 mt-1 text-xs text-gray-600">
                          <span>Counter</span>
                          <span>Helper</span>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-gray-700 flex justify-center">
                        Pax
                      </div>
                      <div className="text-sm font-semibold text-gray-700 flex justify-center">
                        Notes
                      </div>
                    </div>

                    {/* Items List */}
                    <div
                      style={{
                        maxHeight:
                          item.allocationItems?.length > 3 ? "150px" : "auto",
                        overflowY: "auto",
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                      }}
                      className="scroll-hidden"
                    >
                      {item.allocationItems?.map((allocItem, allocIndex) => (
                        <motion.div
                          key={allocIndex}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{
                            delay: allocIndex * 0.05,
                          }}
                          className="grid grid-cols-7 gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                        >
                          <div className="text-sm text-gray-700">
                            {allocIndex + 1}
                          </div>
                          <div className="text-sm font-medium text-gray-900 col-span-2">
                            {allocItem.itemName || "N/A"}
                          </div>
                          <div className="flex justify-center space-x-2 gap-9 text-gray-700">
                            <span>{allocItem.counterQty || 0}</span>
                            <span>{allocItem.helperQty || 0}</span>
                          </div>
                          <div className="flex justify-center space-x-2 gap-9 text-gray-700">
                            <span>{allocItem.counterPrice || 0}</span>
                            <span>{allocItem.helperPrice || 0}</span>
                          </div>
                          <div className="text-sm text-gray-700 flex justify-center">
                            {allocItem.pax || 0}
                          </div>
                          <div className="text-sm text-gray-700 flex justify-center">
                            {allocItem.notes || "N/A"}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function SummaryItemModalchefoutside({
  open,
  onClose,
  chefsummary,
  eventFunctionId,
  eventId,
  type,
}) {
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  let eventFunctionid = eventFunctionId || -1;

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await GetOutsideSummary(
          eventFunctionid,
          eventId,
          type
        );

        // Extract the data from the response
        const menuAllocationDetails =
          response.data.data["Menu Allocation Details"];

        if (menuAllocationDetails && menuAllocationDetails.length > 0) {
          setApiData(menuAllocationDetails);
        }
      } catch (error) {
        console.error("Error fetching summary data:", error);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [open, eventFunctionid, eventId, type]);

  // Determine if we should show all functions or just one
  const isShowingAllFunctions = eventFunctionid === -1;
  const functionsToDisplay = isShowingAllFunctions
    ? apiData || []
    : apiData
    ? [apiData[0]]
    : [];

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

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="bg-white border-b border-gray-200 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Summary Item - Chef Labour
                    {isShowingAllFunctions && " (All Functions)"}
                  </h2>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
                <div className="p-6">
                  {loading && (
                    <div className="flex justify-center items-center py-8">
                      <div className="text-gray-600">Loading...</div>
                    </div>
                  )}

                  {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                      <p className="text-red-600">{error}</p>
                    </div>
                  )}

                  {!loading && !error && (
                    <>
                      {functionsToDisplay.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                          No data available
                        </div>
                      ) : (
                        functionsToDisplay.map((functionData, index) => (
                          <FunctionSection
                            key={index}
                            functionData={functionData}
                            index={index}
                          />
                        ))
                      )}
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}