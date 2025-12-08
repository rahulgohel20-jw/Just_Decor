import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";

export default function ViewExpenseDetailsModal({ open, onClose, data }) {
  if (!data) return null;

  const {
    manager = "",
    role = "",
    contact = "",
    totalAmount = "",
    paymentMethod = "",
  } = data;

  const items = [
    {
      item: "Chair",
      date: "23rd Oct, 2023",
      price: "Rs. 1200",
      paymentType: "Online",
    },
    {
      item: "Table",
      date: "24th Oct, 2023",
      price: "Rs. 4500",
      paymentType: "Card",
    },
    {
      item: "Laptop Stand",
      date: "25th Oct, 2023",
      price: "Rs. 850",
      paymentType: "Cash",
    },
  ];

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

          <div className="absolute inset-0 flex items-start justify-center mt-20 p-4 pointer-events-none">
            <motion.div
              className="pointer-events-auto w-[650px] max-w-full bg-white rounded-2xl shadow-2xl overflow-hidden"
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-900">
                  View Details
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 grid grid-cols-3 gap-6 text-sm items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center">
                    <User className="w-6 h-6 text--500" />
                  </div>

                  <div>
                    <p className="font-semibold text-gray-800">Manager</p>
                    <p className="text-gray-700 mt-1">{manager}</p>
                  </div>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Role</p>
                  <p className="text-gray-700 mt-1">{role}</p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Contact</p>
                  <p className="text-gray-700 mt-1">{contact}</p>
                </div>
              </div>

              <div className="px-6 pb-6 grid grid-cols-3 gap-6 text-sm">
                <div>
                  <p className="font-semibold text-gray-800">Total Amount</p>
                  <p className="text-gray-700 mt-1 font-medium text-blue-600">
                    {totalAmount}
                  </p>
                </div>

                <div>
                  <p className="font-semibold text-gray-800">Payment Method</p>
                  <p className="text-gray-700 mt-1">{paymentMethod}</p>
                </div>
              </div>

              {/* TABLE */}
              <div className="px-6 pb-6">
                <h3 className="text-md font-semibold text-gray-800 mb-3">
                  Item Details
                </h3>

                <table className="w-full border-collapse text-sm text-gray-700">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Date</th>
                      <th className="pb-2">Price</th>
                      <th className="pb-2">Payment Type</th>
                    </tr>
                  </thead>

                  <tbody>
                    {items.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-3">{item.item}</td>
                        <td>{item.date}</td>
                        <td>{item.price}</td>
                        <td>{item.paymentType}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-4 border-t flex justify-end bg-white">
                <button
                  onClick={onClose}
                  className="px-6 py-2 rounded-xl bg-blue-500 text-white"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
