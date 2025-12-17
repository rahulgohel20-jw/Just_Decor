import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AddExpenseItem } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function AddExpenseModal({
  open,
  onClose,
  managerName,
  expenseId,
  eventId,
  userId,
  userType = "MANAGER",
}) {
  const [form, setForm] = useState({
    itemName: "",
    amount: "",
    date: "",
    paymentType: "cash",
    remarks: "",
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

  const formatDateToDDMMYYYY = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}/${month}/${year}`;
  };

  const handleSave = async () => {
    if (!expenseId) {
      Swal.fire({
        icon: "warning",
        title: "Missing Expense ID",
        text: "Please select a valid expense row.",
      });
      return;
    }

    const payload = {
      amount: Number(form.amount),
      eventId: Number(eventId),
      expenseId: Number(expenseId),
      expenseItemId: -1,
      itemName: form.itemName,
      document: form.document || "",
      itemPurchaseDate: formatDateToDDMMYYYY(form.date),
      paymentType: form.paymentType,
      remarks: form.remarks,
      userId: Number(userId),
      userType: userType,
    };

    try {
      await AddExpenseItem(payload);

      Swal.fire({
        icon: "success",
        title: "Expense Added",
        text: "Expense item added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      onClose(true); // refresh parent table
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Failed to add expense item. Please try again.",
      });
      console.error("Failed to add expense item", error);
    }
  };

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
                {/* Manager */}
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

                {/* Item Name */}
                <input
                  type="text"
                  name="itemName"
                  value={form.itemName}
                  onChange={handleInput}
                  placeholder="Enter item name"
                  className="input mt-1 w-full"
                />

                {/* Amount */}
                <input
                  type="number"
                  name="amount"
                  value={form.amount}
                  onChange={handleInput}
                  placeholder="₹ Amount"
                  className="input mt-1 w-full"
                />

                {/* Date */}
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleInput}
                  className="input mt-1 w-full"
                />

                {/* Payment Types — 3 top, 2 bottom */}
                <div className="grid grid-cols-3 gap-2 mt-3">
                  {["cash", "online", "card"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setForm({ ...form, paymentType: type })}
                      className={`px-4 py-2 rounded-xl border ${
                        form.paymentType === type
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 mt-2">
                  {["Net Banking", "upi"].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() =>
                        setForm({ ...form, paymentType: type.toLowerCase() })
                      }
                      className={`px-4 py-2 rounded-xl border ${
                        form.paymentType === type.toLowerCase()
                          ? "bg-blue-500 text-white border-blue-500"
                          : "bg-gray-100 text-gray-700 border-gray-200"
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>

                {/* Remarks (textarea) */}
                <textarea
                  name="remarks"
                  value={form.remarks}
                  onChange={handleInput}
                  placeholder="Remarks"
                  className="mt-1 w-full h-24 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                ></textarea>
              </div>

              <div className="p-4 border-t flex justify-end gap-2 bg-white">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl border border-gray-300 text-gray-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-blue-500 text-white"
                >
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
