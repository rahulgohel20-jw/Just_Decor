import { Pencil, Trash2, ChevronUp } from "lucide-react";

export default function PaymentReceived() {

    const payments = [
        {
          date: "02/02/2026",
          totalAmount: "2,00,000",
          status: "Draft",
          mode: "Cash",
          amountPay: "1,00,000",
        },
        {
          date: "02/02/2026",
          totalAmount: "2,00,000",
          status: "Draft",
          mode: "Cash",
          amountPay: "1,00,000",
        },
      ];
      
  return (
    <div className="bg-white rounded-xl shadow-sm border mb-4 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-800">
            Payment Received ({payments.length})
          </span>
        </div>

        <ChevronUp size={18} className="text-gray-500 cursor-pointer" />
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[700px] text-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Date</th>
              <th className="px-4 py-3 text-left font-medium">
                Total Amount #
              </th>
              <th className="px-4 py-3 text-left font-medium">Status</th>
              <th className="px-4 py-3 text-left font-medium">Payment Mode</th>
              <th className="px-4 py-3 text-left font-medium">Amount Pay</th>
              <th className="px-4 py-3 text-center font-medium">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {payments.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="px-4 py-3">{item.date}</td>

                <td className="px-4 py-3 font-medium">
                  ₹ {item.totalAmount}
                </td>

                <td className="px-4 py-3">
                  <span className="px-3 py-1 rounded-full text-xs bg-yellow-100 text-yellow-700">
                    {item.status}
                  </span>
                </td>

                <td className="px-4 py-3">{item.mode}</td>

                <td className="px-4 py-3 font-medium">
                  ₹ {item.amountPay}
                </td>

                <td className="px-4 py-3">
                  <div className="flex justify-center gap-2">
                    <button className="p-1.5 rounded-md border hover:bg-blue-50 text-blue-600">
                      <Pencil size={16} />
                    </button>

                    <button className="p-1.5 rounded-md border hover:bg-red-50 text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {payments.length === 0 && (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-400"
                >
                  No payments found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
