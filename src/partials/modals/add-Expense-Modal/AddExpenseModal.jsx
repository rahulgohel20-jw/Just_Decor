import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddExpenseModal({ open, onClose, managerName }) {
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    date: "",
    paymentType: "cash",
  });

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="absolute inset-0 flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-[500px] max-w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add Expense for Manager
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

              <div className="p-6 space-y-4">
                <div className="bg-gray-100 rounded-xl px-4 py-2 flex items-center gap-2">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center text-blue-800 font-semibold">
                    {managerName
                      ? managerName
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                      : "NA"}
                  </div>
                  <span>{managerName || "Select Manager"}</span>
                </div>

                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleInput}
                  placeholder="Enter item name"
                  className="input mt-1 w-full"
                />

                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleInput}
                  placeholder="₹ Amount"
                  className="input mt-1 w-full"
                />

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInput}
                  className="input mt-1 w-full"
                />

                <div className="flex justify-between mt-2">
                  {["cash", "online", "card", "upi"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, paymentType: type })}
                      className={`px-4 py-2 rounded-xl border flex-1 mx-1 ${
                        form.paymentType === type
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t flex justify-end gap-2 bg-white">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button className="px-6 py-2 rounded-xl bg-blue-500 text-white">
                  Save Expense
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
