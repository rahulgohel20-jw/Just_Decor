import { toAbsoluteUrl } from "@/utils";

export default function DashboardCards({ activeTab, data = {} }) {
  const {
    totalGiven = 0,
    usedAmount = 0,
    remaining = 0,
    TotalExpenses = 0,
    totalIncome = 0,
    expenseChange = 0,
    incomeChange = 0,
  } = data;

  const getChangeColor = (value) =>
    value >= 0 ? "text-green-600" : "text-red-600";

  // ----------------------
  // ICON MAPPING (CHANGE ICONS HERE)
  // ----------------------
  const icons = {
    totalExpenses: "/media/icons/totalexpen.png",
    totalIncome: "/media/icons/totalincome.png",
    totalGiven: "/media/icons/totalgiven.png",
    usedAmount: "/media/icons/usedamount.png",
    remaining: "/media/icons/remaining.png",
  };
  // ----------------------

  return (
    <div
      className={`grid ${
        activeTab === "manager" ? "grid-cols-3" : "grid-cols-2"
      } gap-8`}
    >
      {/* Card 1 — Total Expenses OR Total Given */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {activeTab === "manager" ? "Total Given" : "Total Expenses"}
          </p>

          <p className="text-4xl font-bold text-gray-900">
            {activeTab === "manager" ? totalGiven : TotalExpenses}
          </p>

          {!activeTab === "manager" && (
            <p className={`text-sm mt-2 ${getChangeColor(expenseChange)}`}>
              {expenseChange >= 0 ? `+${expenseChange}%` : `${expenseChange}%`}{" "}
              from last month
            </p>
          )}
        </div>

        <img
          src={
            activeTab === "manager"
              ? toAbsoluteUrl(icons.totalGiven)
              : toAbsoluteUrl(icons.totalExpenses)
          }
          className={activeTab === "manager" ? "max-h-[80px]" : "max-h-[50px]"} // 👈 smaller for expenses
          alt=""
        />
      </div>

      {/* Card 2 — Total Income OR Used Amount */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {activeTab === "manager" ? "Used Amount" : "Total Income"}
          </p>

          <p className="text-4xl font-bold text-gray-900">
            {activeTab === "manager" ? usedAmount : totalIncome}
          </p>

          {!activeTab === "manager" && (
            <p className={`text-sm mt-2 ${getChangeColor(incomeChange)}`}>
              {incomeChange >= 0 ? `+${incomeChange}%` : `${incomeChange}%`}{" "}
              from last month
            </p>
          )}
        </div>

        <img
          src={
            activeTab === "manager"
              ? toAbsoluteUrl(icons.usedAmount)
              : toAbsoluteUrl(icons.totalIncome)
          }
          className={activeTab === "manager" ? "max-h-[80px]" : "max-h-[50px]"} // 👈 smaller for income
          alt=""
        />
      </div>

      {/* Card 3 — Only For Manager (Remaining) */}
      {activeTab === "manager" && (
        <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
          <div>
            <p className="text-sm text-gray-500 mb-2">Remaining</p>
            <p className="text-4xl font-bold text-gray-900">{remaining}</p>
          </div>

          <img
            src={toAbsoluteUrl(icons.remaining)}
            className="max-h-[80px]"
            alt=""
          />
        </div>
      )}
    </div>
  );
}
