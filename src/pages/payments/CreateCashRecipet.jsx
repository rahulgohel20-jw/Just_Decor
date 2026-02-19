import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Calendar, ChevronDown, Save, Wallet } from "lucide-react";

const CreateCashRecipet = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    paymentDate: "10/24/2023",
    paymentMode: "Bank Transfer",
    depositTo: "HDFC Bank Account (4492)",
    referenceId: "",
    payAmount: "10000",
  });

  const invoiceData = {
    invoice: "INV-2025-1102",
    date: "Oct 12, 2025",
    invoiceAmount: "₹ 30,000.00",
    due: "₹ 30,000.00",
    payment: "₹ 30,000.00",
  };

  const handleSave = () => {
    console.log("Form data:", formData);
    // Add your save logic here
  };

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

          {/* Modal Container */}
          <div className="absolute inset-0 pointer-events-none flex items-start justify-end p-3 sm:p-6">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto w-full max-w-[800px] h-[calc(100vh-24px)] sm:h-[calc(100vh-48px)] bg-white rounded-xl sm:rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="flex items-center gap-3 px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-200 justify-between">
                <div className="flex  items-center gap-3">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Wallet className="w-6 h-6 text-white" />
                  </div>
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                    Receipt
                  </h2>
                </div>
                <div>
                  <input
                    type="text"
                    placeholder="5000"
                    value={5000}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        referenceId: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto px-4 sm:px-8 py-4 sm:py-6">
                <div className="mb-6">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {/* Reference ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Voucher No
                      </label>
                      <input
                        type="text"
                        placeholder="Vc00112"
                        value={formData.referenceId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referenceId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Account Name
                      </label>
                      <div className="relative">
                        <select
                          value={formData.paymentMode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMode: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option>Mira and sons</option>
                          <option>Krishna Catrers</option>
                          <option>Lala Company</option>
                          <option>Test</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Event Name
                      </label>
                      <div className="relative">
                        <select
                          value={formData.paymentMode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMode: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option>Wedding</option>
                          <option>Demo Catrers</option>
                          <option> Sangeet</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {/* Payment Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={formData.paymentDate}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentDate: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Payment Mode */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Payment Mode
                      </label>
                      <div className="relative">
                        <select
                          value={formData.paymentMode}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              paymentMode: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option>Bank Transfer</option>
                          <option>Cash</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>

                    {/* Deposit To */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bank Name
                      </label>
                      <div className="relative">
                        <select
                          value={formData.depositTo}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              depositTo: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm text-gray-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
                        >
                          <option>HDFC Bank Account (4492)</option>
                          <option>ICICI Bank Account (1234)</option>
                          <option>SBI Account (5678)</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                    {/* Reference ID */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Reference ID
                      </label>
                      <input
                        type="text"
                        placeholder="Enter Reference ID"
                        value={formData.referenceId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referenceId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Remarks
                      </label>
                      <input
                        type="text"
                        placeholder="Remarks"
                        value={formData.referenceId}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            referenceId: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    {/* Pay Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Pay Amount
                      </label>
                      <div className="flex gap-3">
                        <input
                          type="text"
                          value={`₹ ${formData.payAmount} `}
                          readOnly
                          className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm text-gray-900 bg-gray-50 focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      onClick={handleSave}
                      className="px-4 sm:px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium text-sm flex items-center gap-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 whitespace-nowrap"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                  </div>
                </div>

                {/* Apply Payment to Invoices Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <h3 className="text-base font-semibold text-gray-900">
                      Payment Information{" "}
                    </h3>
                  </div>

                  {/* Invoice Table */}
                  <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
                    <table className="w-full min-w-[600px]">
                      <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                            Voucher No
                          </th>
                          <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700">
                            Date
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Amount
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Due
                          </th>
                          <th className="px-4 py-3 text-right text-xs font-semibold text-gray-700">
                            Payment
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-gray-200 last:border-0">
                          <td className="px-4 py-3.5 text-sm text-gray-900">
                            {invoiceData.invoice}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-900">
                            {invoiceData.date}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-900 text-right">
                            {invoiceData.invoiceAmount}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-red-600 text-right font-medium">
                            {invoiceData.due}
                          </td>
                          <td className="px-4 py-3.5 text-sm text-gray-900 text-right font-medium">
                            {invoiceData.payment}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Amount to Credit */}
                  <div className="mt-4 flex justify-end">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        Amount to Credit:
                      </span>
                      <span className="text-lg font-semibold text-blue-600">
                        ₹ 30,000.00
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default CreateCashRecipet;
