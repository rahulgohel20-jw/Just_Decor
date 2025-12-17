import { Eye, Plus, Trash } from "lucide-react";

export default function ExpenseTable({
  activeTab,
  data,
  onAddExpense,
  onView,
  onDelete,
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              {activeTab === "manager" ? "Manager Name" : "Name"}
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
              Payment Type
            </th>

            <th className="pb-3 text-xs font-semibold text-gray-600 uppercase">
              Action
            </th>
          </tr>
        </thead>

        <tbody>
          {data.map((expense) => (
            <tr
              key={expense.id}
              className="border-b border-gray-100 bg-[#F9FAFC] transition-colors"
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
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    expense.paymentType === "Cash"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-green-100 text-green-700"
                  }`}
                >
                  {expense.paymentType}
                </span>
              </td>
              <td className="py-7 flex gap-2">
                {/* MANAGER ACTIONS */}
                {activeTab === "manager" && (
                  <>
                    <Eye
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => onView(expense)}
                    />

                    <Plus
                      className="w-5 h-5 text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => onAddExpense(expense.name, expense.id)}
                    />
                  </>
                )}

                {/* DELETE FOR ALL (manager, supplier, customer) */}
                <Trash
                  className="w-5 h-5  text-gray-400 hover:text-red-600 cursor-pointer"
                  onClick={() => onDelete(expense.id)}
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
