import { toAbsoluteUrl } from "@/utils";

export default function DashboardCards({ activeTab, totals = {} }) {
  const {
    totalGiven = 0,
    totalUsed = 0,
    remaining = 0,
    TotalExpenses = 0,
  } = totals;

  const icons = {
    totalExpenses: "/media/icons/totalexpen.png",
    totalGiven: "/media/icons/totalgiven.png",
    usedAmount: "/media/icons/usedamount.png",
    remaining: "/media/icons/remaining.png",
  };

  return (
    <div
      className={`grid gap-8 ${activeTab === "manager" ? "grid-cols-3" : "grid-cols-1"}`}
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500 mb-2">
            {activeTab === "manager" ? "Total Given" : "Total Expenses"}
          </p>

          <p className="text-4xl font-bold text-gray-900">
            {totalGiven} {/* Always use totalGiven */}
          </p>
        </div>
        <img
          src={toAbsoluteUrl(
            activeTab === "manager" ? icons.totalGiven : icons.totalExpenses
          )}
          className="max-h-[80px]"
          alt=""
        />
      </div>

      {activeTab === "manager" && (
        <>
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-500 mb-2">Used Amount</p>
              <p className="text-4xl font-bold text-gray-900">{totalUsed}</p>
            </div>
            <img
              src={toAbsoluteUrl(icons.usedAmount)}
              className="max-h-[80px]"
              alt=""
            />
          </div>

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
        </>
      )}
    </div>
  );
}
