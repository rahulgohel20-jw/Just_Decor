// ExpenseTable.jsx
import { Eye } from "lucide-react";

export default function ExpenseTable({ activeTab, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              {activeTab === "supplier"
                ? "Supplier Name"
                : activeTab === "customer"
                  ? "Customer Name"
                  : "Manager Name"}
            </th>

            {activeTab === "manager" && (
              <>
                <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                  Role
                </th>
                <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                  Mobile
                </th>
              </>
            )}

            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              Date
            </th>
            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              Amount
            </th>

            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              {activeTab === "manager" ? "Payment Type" : "Status"}
            </th>

            {activeTab === "manager" && (
              <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
                Action
              </th>
            )}
          </tr>
        </thead>

        <tbody>
          {data.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
            >
              <td className="py-4">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full ${expense.bgColor} ${expense.textColor} flex items-center justify-center font-semibold text-sm`}
                  >
                    {expense.initials}
                  </div>
                  <span className="font-medium text-gray-900">
                    {expense.name}
                  </span>
                </div>
              </td>

              {activeTab === "manager" && (
                <>
                  <td className="py-4">{expense.role}</td>
                  <td className="py-4">{expense.mobile}</td>
                </>
              )}

              <td className="py-4">{expense.date}</td>
              <td className="py-4 font-medium">{expense.amount}</td>

              <td className="py-4">
                {activeTab === "manager" ? (
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      expense.paymentType === "Cash"
                        ? "bg-purple-100 text-purple-700"
                        : "bg-green-100 text-green-700"
                    }`}
                  >
                    {expense.paymentType}
                  </span>
                ) : (
                  <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                    Completed
                  </span>
                )}
              </td>

              {activeTab === "manager" && (
                <td className="py-4">
                  <Eye className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer" />
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
