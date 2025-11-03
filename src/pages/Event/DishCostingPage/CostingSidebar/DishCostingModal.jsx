import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { FormattedMessage } from "react-intl";

const DishCostingModal = ({ isOpen, onClose, viewType: parentViewType }) => {
  const [viewType, setViewType] = useState(parentViewType || "Function Wise");

  const categoryData = [
    { category: "Grocery", amount: "103210.19" },
    { category: "Dairy", amount: "67529.58" },
    { category: "Vegetables", amount: "15287.37" },
    { category: "Fruits", amount: "27853.93" },
    { category: "Ready To Eat", amount: "373.03" },
    { category: "Crockery & Utensils Department", amount: "386873.9" },
  ];

  const totalAmount = "1575471.46";

  // Allow ESC to close
  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

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
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[800px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  <FormattedMessage
  id="COMMON.TOTAL_RAW_MATERIAL_CHARGES"
  defaultMessage="Total Raw Material Charges"
/>

                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                >
                  <FormattedMessage id="COMMON.CLOSE" defaultMessage="Close" /> 
                </button>
              </div>

              {/* Content */}
              <div className="p-6 overflow-y-auto">
                {/* Breadcrumb */}
                

                {/* Customer + View Type */}
                <div className="grid grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                      <FormattedMessage
  id="COMMON.CUSTOMER_NAME"
  defaultMessage="Customer Name"
/>

                    </label>
                    <select className="select w-full border border-gray-300 rounded-md text-sm">
                      <option>
                        1811 - SHREE BRIJBHOG TEASING DEMO - GET TOGATHER -
                      </option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-2">
                     <FormattedMessage
  id="COMMON.VIEW_TYPE"
  defaultMessage="View Type"
/>

                    </label>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setViewType("Function Wise")}
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
                          viewType === "Function Wise"
                            ? "bg-primary text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FormattedMessage
  id="COMMON.FUNCTION_WISE"
  defaultMessage="Function Wise"
/>

                      </button>
                      <button
                        onClick={() => setViewType("Total Wise")}
                        className={`flex-1 py-2.5 rounded-md text-sm font-medium transition ${
                          viewType === "Total Wise"
                            ? "bg-primary text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        <FormattedMessage
  id="COMMON.TOTAL_WISE"
  defaultMessage="Total Wise"
/>

                      </button>
                    </div>
                  </div>
                </div>

                {/* Date & Person Info */}
                <div className="grid grid-cols-3 gap-6 mb-6 pb-6 border-b border-gray-200">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      <FormattedMessage
  id="COMMON.DATE_AND_TIME"
  defaultMessage="Date and Time"
/>

                    </label>
                    <div className="text-sm font-medium text-gray-900">
                      02.10.2025 04:00 PM
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      &nbsp;
                    </label>
                    <div className="text-sm font-medium text-gray-900">
                      29.09.2025 11:00 PM
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      <FormattedMessage id="COMMON.PeRSON" defaultMessage="Person" />
                    </label>
                    <div className="text-sm font-medium text-gray-900">450</div>
                  </div>
                </div>

                {/* Category Table */}
                <motion.div
                  key={viewType}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  {/* Header */}
                  <div className="grid grid-cols-2 gap-4 pb-3 mb-4 border-b-2 border-gray-300">
                    <div className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
  <FormattedMessage id="COMMON.CATEGORY" defaultMessage="Category" />
</div>
<div className="text-sm font-semibold text-gray-600 uppercase tracking-wide text-right">
  <FormattedMessage id="COMMON.AMOUNT" defaultMessage="Amount" />
</div>

                  </div>

                  {/* Rows */}
                  <div className="space-y-3">
                    {categoryData.map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className="grid grid-cols-2 gap-4 py-3 border-b border-gray-200"
                      >
                        <div className="text-sm text-gray-800">
                          {item.category}
                        </div>
                        <div className="text-sm text-gray-800 text-right font-medium tabular-nums">
                          {item.amount}
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Final Total */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.4 }}
                    className="grid grid-cols-2 gap-4 pt-4 mt-4 border-t-2 border-gray-300"
                  >
                    <div className="text-base font-bold text-primary">
                     <FormattedMessage id="COMMON.FINAL_AMOUNT" defaultMessage="Final Amount" />
                    </div>
                    <div className="text-base font-bold text-primary text-right tabular-nums">
                      {totalAmount}
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DishCostingModal;
