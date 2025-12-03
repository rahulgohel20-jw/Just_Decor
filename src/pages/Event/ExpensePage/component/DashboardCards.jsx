export default function DashboardCards({ activeTab, data = {} }) {
  // Percent values from backend
  const {
    totalGiven = 0,
    usedAmount = 0,
    remaining = 0,
    TotalExpenses = 0,
    totalIncome = 0,
    expenseChange = 0, // + or -
    incomeChange = 0, // + or -
  } = data;

  // Determine color based on +
  const getChangeColor = (value) =>
    value >= 0 ? "text-green-600" : "text-red-600";

  return (
    <div
      className={`grid ${
        activeTab === "manager" ? "grid-cols-3" : "grid-cols-2"
      } gap-8`}
    >
      {/* Card 1 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-2">
          {activeTab === "manager" ? "Total Given" : "Total Expenses"}
        </p>

        <p className="text-4xl font-bold text-gray-900">
          {activeTab === "manager" ? totalGiven : TotalExpenses}
        </p>

        {/* % change */}
        {!activeTab === "manager" && (
          <p className={`text-sm mt-2 ${getChangeColor(expenseChange)}`}>
            {expenseChange >= 0 ? `+${expenseChange}%` : `${expenseChange}%`}{" "}
            from last month
          </p>
        )}
      </div>

      {/* Card 2 */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
        <p className="text-sm text-gray-500 mb-2">
          {activeTab === "manager" ? "Used Amount" : "Total Income"}
        </p>

        <p className="text-4xl font-bold text-gray-900">
          {activeTab === "manager" ? usedAmount : totalIncome}
        </p>

        {/* % change */}
        {!activeTab === "manager" && (
          <p className={`text-sm mt-2 ${getChangeColor(incomeChange)}`}>
            {incomeChange >= 0 ? `+${incomeChange}%` : `${incomeChange}%`} from
            last month
          </p>
        )}
      </div>

      {/* Manager Only — Remaining */}
      {activeTab === "manager" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          <p className="text-sm text-gray-500 mb-2">Remaining</p>
          <p className="text-4xl font-bold text-gray-900">{remaining}</p>
        </div>
      )}
    </div>
  );
}
