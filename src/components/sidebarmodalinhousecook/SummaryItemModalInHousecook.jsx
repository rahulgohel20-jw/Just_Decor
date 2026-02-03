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

export default function SummaryItemModalInHousecook({
  open,
  onClose,
  insidesummary,
  eventFunctionId,
  eventId,
  type,
}) {
  const [expandedRows, setExpandedRows] = useState({});
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Use the actual eventFunctionId passed to the component
  const isShowingAllFunctions = eventFunctionId === -1;

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
        // Use the actual eventFunctionId prop directly
        const response = await GetOutsideSummary(
          eventFunctionId,
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
  }, [open, eventFunctionId, eventId, type]);

  // Toggle individual row expansion
  const toggleRowExpansion = (index) => {
    setExpandedRows((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  // Prepare data based on whether showing all functions or single function
  const displayData = apiData
    ? isShowingAllFunctions
      ? // Flatten all functions into single array
        apiData.flatMap((functionData) =>
          functionData.agencyResponse.map((contact) => ({
            ...contact,
            functionName:
              functionData.eventFunction?.function?.nameEnglish || "N/A",
            functionStartDateTime:
              functionData.eventFunction?.functionStartDateTime || "N/A",
            functionEndDateTime:
              functionData.eventFunction?.functionEndDateTime || "N/A",
          }))
        )
      : // For single function, just use the first function's agency response
        apiData[0]?.agencyResponse || []
    : [];

  // Get function info for single function view
  const singleFunctionInfo = !isShowingAllFunctions && apiData?.[0]
    ? {
        functionName:
          apiData[0].eventFunction?.function?.nameEnglish || "N/A",
        functionStartDateTime:
          apiData[0].eventFunction?.functionStartDateTime || "N/A",
        functionEndDateTime:
          apiData[0].eventFunction?.functionEndDateTime || "N/A",
      }
    : null;

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
                    Summary Item - InHouse Cook
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
                      {/* Show function info for single function view */}
                      {!isShowingAllFunctions && singleFunctionInfo && (
                        <div className="flex items-center gap-6 ">
                          <button className="btn btn-sm btn-primary w-[100px] flex justify-center mt-3">
                            {singleFunctionInfo.functionName}
                          </button>

                          <div className="flex flex-col mb-4 ">
                            <div className="text-[12px]  text-gray-600">
                              <FormattedMessage
                                id="SIDEBAR_MODAL.DATE_TIME"
                                defaultMessage="Date and Time"
                              />
                            </div>
                            <div>
                              <input
                                className="input"
                                type="text"
                                value={`${singleFunctionInfo.functionStartDateTime} `}
                                readOnly
                              />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="bg-gray-50 rounded-xl p-5 mb-6 border border-gray-200">
                        <div
                          className={`grid ${
                            isShowingAllFunctions
                              ? "grid-cols-7"
                              : "grid-cols-6"
                          } gap-12 mb-3 pb-2 border-b border-gray-300`}
                        >
                          <div className="text-sm font-semibold text-gray-700 ps-3">
                            #
                          </div>
                          {isShowingAllFunctions && (
                            <div className="text-sm font-semibold text-gray-700">
                              Function
                            </div>
                          )}
                          <div className="text-sm font-semibold text-gray-700 ">
                            Contact Name
                          </div>
                          <div className="text-sm font-semibold text-gray-700 flex justify-start ps-3  ">
                            Number
                          </div>
                          <div className="text-sm font-semibold text-gray-700 flex justify-start ps-3 ">
                            Person
                          </div>
                          <div className="text-sm font-semibold text-gray-700 flex justify-start ps-3 ">
                            Remark
                          </div>
                          <div className="text-sm font-semibold text-gray-700">
                            Action
                          </div>
                        </div>

                        {displayData.length > 0 ? (
                          displayData.map((contact, index) => (
                            <div key={index}>
                              <div
                                className={`grid ${
                                  isShowingAllFunctions
                                    ? "grid-cols-7"
                                    : "grid-cols-6"
                                } mt-3 gap-6 items-center bg-white p-3 rounded-lg shadow-sm`}
                              >
                                <div className="text-sm text-gray-800">
                                  {index + 1}
                                </div>
                                {isShowingAllFunctions && (
                                  <div className="text-sm font-medium text-gray-900">
                                    {contact.functionName}
                                  </div>
                                )}
                                <div className="text-sm font-medium text-gray-900">
                                  {contact.contactName || "N/A"}
                                </div>
                                <div className="text-sm text-gray-800 flex justify-start ps-2 ">
                                  {contact.number || "N/A"}
                                </div>
                                <div className="text-sm text-gray-800 flex justify-start ps-8 ">
                                  {contact.totalPax || 0}
                                </div>
                                <div className="text-sm text-gray-800 flex justify-start ps-8 ">
                                  {contact.remarks || "N/A"}
                                </div>
                                <div className="flex justify-start gap-5 p-2 rounded-md transition-all duration-300">
                                  <div className="flex gap-2">
                                    <button
                                      className="p-1.5 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                                      title="Send via WhatsApp"
                                    >
                                      <WhatsAppIcon />
                                    </button>

                                    <button
                                      className="p-1.1 text-white transition-colors flex items-center justify-center"
                                      title="Download PDF"
                                    >
                                      <img
                                        src={toAbsoluteUrl(
                                          "/media/icons/PDFIcon.png"
                                        )}
                                        alt="PDF Icon"
                                        className="w-6 h-6 object-contain"
                                      />
                                    </button>
                                    <button
                                      onClick={() => toggleRowExpansion(index)}
                                      className="text-blue-600 hover:text-gray-600 transition-transform"
                                    >
                                      <motion.svg
                                        className="w-6 h-6"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                        animate={{
                                          rotate: expandedRows[index] ? 180 : 0,
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
                              </div>

                              <AnimatePresence>
                                {expandedRows[index] && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="bg-white rounded-xl border border-gray-200 overflow-hidden mt-7"
                                  >
                                    <div className="grid grid-cols-5 gap-4 bg-gray-50 px-5 py-3  border-[#ffffff]">
                                      <div className="text-sm font-semibold text-gray-700">
                                        #
                                      </div>
                                      <div className="text-sm font-semibold text-gray-700 col-span-2">
                                        Menu Item Name
                                      </div>
                                      <div className="text-sm font-semibold text-gray-700">
                                        Person
                                      </div>
                                      <div className="text-sm font-semibold text-gray-700">
                                        Notes
                                      </div>
                                    </div>
                                    <div
                                      style={{
                                        maxHeight:
                                          contact.allocationItems?.length > 3
                                            ? "150px"
                                            : "auto",
                                        overflowY: "auto",
                                        scrollbarWidth: "none",
                                        msOverflowStyle: "none",
                                      }}
                                      className="scroll-hidden"
                                    >
                                      {contact.allocationItems?.length > 0 ? (
                                        contact.allocationItems.map(
                                          (item, itemIndex) => (
                                            <motion.div
                                              key={itemIndex}
                                              initial={{ opacity: 0, y: 10 }}
                                              animate={{ opacity: 1, y: 0 }}
                                              exit={{ opacity: 0, y: 10 }}
                                              transition={{
                                                delay: itemIndex * 0.05,
                                              }}
                                              className="grid grid-cols-5 gap-4 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors"
                                            >
                                              <div className="text-sm text-gray-700">
                                                {itemIndex + 1}
                                              </div>
                                              <div className="text-sm font-medium text-gray-900 col-span-2">
                                                {item.itemName || "N/A"}
                                              </div>
                                              <div className="text-sm text-gray-700 flex justify-start ps-2">
                                                {item.pax || 0}
                                              </div>
                                              <div className="text-sm text-gray-700">
                                                {item.notes || "N/A"}
                                              </div>
                                            </motion.div>
                                          )
                                        )
                                      ) : (
                                        <div className="px-5 py-8 text-center text-gray-500">
                                          No items found
                                        </div>
                                      )}
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            No data available
                          </div>
                        )}
                      </div>
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