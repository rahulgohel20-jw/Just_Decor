import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddSupplierCustomerModal({ open, onClose }) {
  const [form, setForm] = useState({
    type: "Supplier",
    name: "",
    amount: "",
    countryCode: "+91",
    mobile: "",
    remarks: "",
    gst: "",
    address: "",
  });

  const [showGST, setShowGST] = useState(false);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          {/* Background Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Centered Wrapper */}
          <div className="absolute inset-0 pointer-events-none flex items-center justify-end p-4">
            {/* Sliding Panel */}
            <motion.div
              className="pointer-events-auto w-[600px] max-w-[95vw] h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Contact
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
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

              {/* Body */}
              <div className="overflow-y-auto p-6 space-y-6">
                {/* Type Selector */}
                <div className="flex space-x-4">
                  <button
                    onClick={() => setForm({ ...form, type: "Supplier" })}
                    className={`px-4 py-2 rounded ${form.type === "Supplier" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Supplier
                  </button>
                  <button
                    onClick={() => setForm({ ...form, type: "Customer" })}
                    className={`px-4 py-2 rounded ${form.type === "Customer" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
                  >
                    Customer
                  </button>
                </div>

                {/* Name */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    {form.type} Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleInput}
                    placeholder={`Enter ${form.type.toLowerCase()}'s name`}
                    className="input mt-1 w-full"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleInput}
                    placeholder="₹ 0.00"
                    className="input mt-1 w-full"
                  />
                </div>

                {/* Mobile */}
                <div className="grid grid-cols-[80px_1fr] gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Code
                    </label>
                    <input
                      type="text"
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleInput}
                      className="input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleInput}
                      placeholder="Enter mobile number"
                      className="input mt-1 w-full"
                    />
                  </div>
                </div>

                {/* Remarks */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleInput}
                    placeholder="Add any notes here..."
                    className="input mt-1 h-24 w-full"
                  />
                </div>

                {/* Optional GST & Address */}
                <div>
                  <button
                    type="button"
                    className="text-blue-600 text-sm underline"
                    onClick={() => setShowGST(!showGST)}
                  >
                    {showGST
                      ? "Hide GST & Address"
                      : "Add GST & Address (Optional)"}
                  </button>

                  {showGST && (
                    <div className="mt-4 space-y-4">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          GST
                        </label>
                        <input
                          type="text"
                          name="gst"
                          value={form.gst}
                          onChange={handleInput}
                          className="input mt-1 w-full"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Address
                        </label>
                        <textarea
                          name="address"
                          value={form.address}
                          onChange={handleInput}
                          className="input mt-1 h-20 w-full"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-white flex justify-end">
                <button className="btn btn-primary py-3 px-6">{`Add ${form.type}`}</button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
