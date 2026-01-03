import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 fill-current"
  >
    <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
  </svg>
);

const DownloadIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    className="w-5 h-5"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
    />
  </svg>
);

export default function SummaryItemModalOutsideAgency({
  open,
  onClose,
  outsidesummary,
}) {
  const [showItems, setShowItems] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  // Sample data structure matching the API response
  const sampleData = {
    msg: "Menu Allocation Found Successfully",
    data: {
      "Menu Allocation Details": {
        eventFunction: {
          id: 3,
          function: {
            id: 1,
            nameEnglish: "Dinner",
            nameHindi: "डिनर",
            nameGujarati: "ડિનર",
            startTime: "00:00 AM",
            endTime: "02:00 AM",
            createdAt: "2025-12-11T12:07:58",
            userId: null,
          },
          functionStartDateTime: "12/12/2025 12:00 am",
          functionEndDateTime: "12/12/2025 02:00 am",
          pax: 100,
          rate: 0.0,
          function_venue: "Ahmedabad",
          notesEnglish: "",
          notesHindi: "",
          notesGujarati: "",
          eventId: 3,
          sortorder: 1,
          createdAt: "12/12/2025",
        },
        agencyResponse: [
          {
            contactId: 4,
            contactName: "",
            totalPax: 100,
            totalPrice: 1000.0,
            type: "Outside",
            number: "6597445585",
            remarks: null,
            totalQty: null,
            allocationItems: [
              {
                itemId: 2194,
                itemName: "AMRITSARI PARAATHA",
                pax: 100,
                notes: null,
                remarks: "",
                unitId: 81,
                unitName: "PKT(S)",
                price: 1000,
                qty: 10,
                counterQty: 0,
                counterPrice: 0,
                helperQty: 0,
                helperPrice: 0,
              },
            ],
            totalHeplerPrice: 0,
            totalCounterPrice: 0,
            totalHelperQty: 0,
            totalCounterQty: 0,
          },
        ],
      },
    },
    success: true,
  };

  console.log(outsidesummary);

  // Use provided data or sample data
  const responseData = outsidesummary || sampleData;

  // Extract data from API response
  const menuDetails = responseData;
  const eventFunction = menuDetails?.eventFunction;
  const agencyData = menuDetails?.agencyResponse?.[0] || {};

  const summaryData = {
    contactName: agencyData.contactName || "N/A",
    contactNumber: agencyData.number || "N/A",
    totalPax: agencyData.totalPax || 0,
    quantity:
      agencyData.totalQty ||
      agencyData.allocationItems?.reduce(
        (sum, item) => sum + (item.qty || 0),
        0
      ) ||
      0,
    totalPrice: agencyData.totalPrice
      ? `${agencyData.totalPrice.toFixed(2)} `
      : "0.00 INR",
    date: eventFunction?.functionStartDateTime || "N/A",
    functionName: eventFunction?.function?.nameEnglish || "Dinner",
    venue: eventFunction?.function_venue || "N/A",
    items:
      agencyData.allocationItems?.map((item, index) => ({
        id: index + 1,
        itemId: item.itemId,
        name: item.itemName || "N/A",
        person: item.pax || 0,
        quantity: item.qty || 0,
        unit: item.unitName || "N/A",
        price: item.price || 0,
        notes: item.notes || item.remarks || "-",
      })) || [],
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

          <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-4">
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
              <div className="bg-white border-b border-gray-200 px-6 py-4 flex-shrink-0">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Summary Item - Outside Agency
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

              {/* Content */}
              <div className="overflow-y-auto flex-1">
                <div className="p-6">
                  {/* Function Name and Date */}
                  <div className="flex items-center gap-6 mb-6">
                    <div className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold">
                      {summaryData.functionName}
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs text-gray-600 mb-1">
                        Date and Time
                      </div>
                      <div className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        {summaryData.date}
                      </div>
                    </div>

                    <div className="flex flex-col">
                      <div className="text-xs text-gray-600 mb-1">Venue</div>
                      <div className="text-sm font-medium text-gray-800 bg-gray-50 px-4 py-2 rounded-lg border border-gray-200">
                        {summaryData.venue}
                      </div>
                    </div>
                  </div>

                  {/* Summary Table */}
                  <div className="bg-gray-50 rounded-xl p-5 border border-gray-200">
                    {/* Table Header */}
                    <div className="grid grid-cols-6 gap-4 mb-3 pb-3 border-b border-gray-300">
                      <div className="text-sm font-semibold text-gray-700">
                        #
                      </div>
                      <div className="text-sm font-semibold text-gray-700">
                        Contact Name
                      </div>
                      <div className="text-sm font-semibold text-gray-700 text-center">
                        Total Person
                      </div>
                      <div className="text-sm font-semibold text-gray-700 text-center">
                        Total Quantity
                      </div>
                      <div className="text-sm font-semibold text-gray-700 text-center">
                        Total Price
                      </div>
                      <div className="text-sm font-semibold text-gray-700 text-center">
                        Actions
                      </div>
                    </div>

                    {/* Table Row */}
                    <div className="grid grid-cols-6 gap-4 items-center bg-white p-4 rounded-lg shadow-sm">
                      <div className="text-sm text-gray-800 font-medium">1</div>
                      <div className="flex flex-col">
                        <div className="text-sm font-semibold text-gray-900">
                          {summaryData.contactName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {summaryData.contactNumber}
                        </div>
                      </div>
                      <div className="text-sm text-gray-800 text-center font-medium">
                        {summaryData.totalPax}
                      </div>
                      <div className="text-sm text-gray-800 text-center font-medium">
                        {summaryData.quantity}
                      </div>
                      <div className="text-sm font-semibold text-gray-900 text-center">
                        ₹{summaryData.totalPrice}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex justify-center gap-2">
                        <button
                          className="p-2 rounded-full bg-green-500 hover:bg-green-600 text-white transition-colors"
                          title="Send via WhatsApp"
                        >
                          <WhatsAppIcon />
                        </button>

                        <button
                          className="p-2 rounded-full bg-red-500 hover:bg-red-600 text-white transition-colors"
                          title="Download PDF"
                        >
                          <DownloadIcon />
                        </button>

                        <button
                          onClick={() => setShowItems(!showItems)}
                          className="p-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white transition-colors"
                          title="Toggle Items"
                        >
                          <motion.svg
                            className="w-5 h-5"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                            animate={{ rotate: showItems ? 180 : 0 }}
                            transition={{ duration: 0.3 }}
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
                      {showItems && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 overflow-hidden"
                        >
                          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                            {/* Items Header */}
                            <div className="grid grid-cols-8 gap-4 bg-gradient-to-r from-gray-50 to-gray-100 px-5 py-3 border-b border-gray-200">
                              <div className="text-sm font-semibold text-gray-700">
                                #
                              </div>
                              <div className="text-sm font-semibold text-gray-700 col-span-2">
                                Menu Item Name
                              </div>
                              <div className="text-sm font-semibold text-gray-700 text-center">
                                Person
                              </div>
                              <div className="text-sm font-semibold text-gray-700 text-center">
                                Quantity
                              </div>
                              <div className="text-sm font-semibold text-gray-700 text-center">
                                Unit
                              </div>
                              <div className="text-sm font-semibold text-gray-700 text-center">
                                Price
                              </div>
                              <div className="text-sm font-semibold text-gray-700 text-center">
                                Notes
                              </div>
                            </div>

                            {/* Items List */}
                            <div className="max-h-[250px] overflow-y-auto">
                              {summaryData.items.length > 0 ? (
                                summaryData.items.map((item, index) => (
                                  <motion.div
                                    key={item.itemId + "-" + index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="grid grid-cols-8 gap-4 px-5 py-4 border-b border-gray-100 hover:bg-blue-50 transition-colors"
                                  >
                                    <div className="text-sm text-gray-700 font-medium">
                                      {item.id}
                                    </div>
                                    <div className="text-sm font-medium text-gray-900 col-span-2">
                                      {item.name}
                                    </div>
                                    <div className="text-sm text-gray-700 text-center">
                                      {item.person}
                                    </div>
                                    <div className="text-sm text-gray-700 text-center">
                                      {item.quantity}
                                    </div>
                                    <div className="text-sm text-gray-700 text-center">
                                      {item.unit}
                                    </div>
                                    <div className="text-sm text-gray-700 text-center font-semibold">
                                      ₹{item.price}
                                    </div>
                                    <div className="text-sm text-gray-500 text-center">
                                      {item.notes}
                                    </div>
                                  </motion.div>
                                ))
                              ) : (
                                <div className="px-5 py-8 text-center text-gray-500">
                                  No items found
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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
