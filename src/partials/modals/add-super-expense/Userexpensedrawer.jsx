import { useState } from "react";
import { X, CheckCircle2, Mail, Phone } from "lucide-react";
import { toAbsoluteUrl } from "@/utils";

// ─── Status Badge ─────────────────────────────────────────────────────────────
const StatusBadge = ({ status }) => {
  const map = {
    Paid: "bg-green-50 text-green-600 border-green-100",
    Pending: "bg-yellow-50 text-yellow-600 border-yellow-100",
    Unpaid: "bg-red-50 text-red-500 border-red-100",
  };
  const dot = {
    Paid: "bg-green-500",
    Pending: "bg-yellow-500",
    Unpaid: "bg-red-500",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${map[status] ?? "bg-gray-50 text-gray-500 border-gray-100"}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${dot[status] ?? "bg-gray-400"}`}
      />
      {status}
    </span>
  );
};

// ─── Main Drawer ──────────────────────────────────────────────────────────────
const UserExpenseDrawer = ({ isOpen, onClose, user }) => {
  const [search, setSearch] = useState("");

  if (!user) return null;

  const transactions = user.transactions ?? [];

  const filteredTx = transactions.filter(
    (t) =>
      t.particular?.toLowerCase().includes(search.toLowerCase()) ||
      t.type?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      {/* ── Backdrop ── */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-[2px] z-40 transition-opacity duration-300
          ${isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* ── Drawer Panel ── */}
      <div
        className={`fixed top-0 right-0 h-full w-[680px] max-w-full bg-white shadow-2xl z-50
          flex flex-col transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* ── Header: User Profile ── */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="relative">
                <img
                  src={
                    user.avatar ?? toAbsoluteUrl("/media/avatars/default.jpg")
                  }
                  alt={user.name}
                  className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100"
                  onError={(e) => {
                    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=e0e7ff&color=4f46e5&size=56`;
                  }}
                />
                <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 border-2 border-white rounded-full" />
              </div>

              {/* Info */}
              <div>
                <h2 className="text-base font-bold text-gray-900">
                  {user.name}
                </h2>
              </div>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition border-0 bg-transparent cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Tab bar */}
          <div className="mt-4">
            <button className="text-sm font-semibold text-blue-600 border-b-2 border-blue-600 pb-2 pr-1">
              Expense Overview
            </button>
          </div>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {/* ── Summary Cards ── */}
          <div className="grid grid-cols-3 gap-4">
            {/* Total Amount */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-indigo-50 flex items-center justify-center">
                <img
                  src={toAbsoluteUrl("/media/icons/expense2.png")}
                  alt="Total Amount"
                  className="w-5 h-5 object-contain"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              </div>
              <p className="text-xs text-gray-400 font-medium">Total Amount</p>
              <p className="text-xl font-bold text-gray-900">
                ₹ {(user.totalAmount ?? 0).toLocaleString("en-IN")}
              </p>
            </div>

            {/* Paid */}
            <div className="rounded-2xl border border-gray-100 bg-gray-50/60 px-5 py-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-emerald-50 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
              </div>
              <p className="text-xs text-gray-400 font-medium">Paid</p>
              <p className="text-xl font-bold text-gray-900">
                ₹ {(user.paidAmount ?? 0).toLocaleString("en-IN")}
              </p>
            </div>
            <div className="rounded-2xl border border-red-100 bg-red-50/40 px-5 py-4 flex flex-col items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <p className="text-xs text-gray-400 font-medium">Remaining</p>
              <p className="text-xl font-bold text-red-500">
                ₹ {(user.remainingAmount ?? 0).toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          {/* ── Recent Transactions ── */}
          <div className="rounded-2xl border border-gray-100 bg-white overflow-hidden">
            {/* Toolbar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
              <h3 className="text-sm font-bold text-gray-800">
                Recent Transactions
              </h3>
              <div className="relative">
                <svg
                  className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z"
                  />
                </svg>
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search entries..."
                  className="pl-7 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs text-gray-600 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-36 transition"
                />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100">
                    {[
                      "Date",
                      "Payment Mode",
                      "Particular",
                      "Amount",
                      "Status",
                      "km",
                      "View Document",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-2.5 text-left text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredTx.length > 0 ? (
                    filteredTx.map((tx, i) => (
                      <tr
                        key={i}
                        className="border-t border-gray-50 hover:bg-gray-50/60 transition"
                      >
                        {/* Date */}
                        <td className="px-4 py-3 text-xs text-gray-500 whitespace-nowrap">
                          {tx.date}
                        </td>

                        {/* Payment Mode */}
                        <td className="px-4 py-3 text-xs font-medium text-gray-700 whitespace-nowrap">
                          {tx.type}
                        </td>

                        {/* Particular */}
                        <td className="px-4 py-3 text-xs text-blue-600 font-medium">
                          {tx.particular}
                        </td>

                        {/* Amount */}
                        <td className="px-4 py-3 text-xs font-semibold text-gray-800 whitespace-nowrap">
                          ₹ {Number(tx.amount).toLocaleString("en-IN")}
                        </td>

                        {/* Status */}
                        <td className="px-4 py-3">
                          <StatusBadge status={tx.status} />
                        </td>
                        <td className="px-4 py-3 text-xs font-semibold text-gray-800 whitespace-nowrap">
                          {tx.km}
                        </td>
                        {/* View Document */}
                        <td className="px-4 py-3">
                          {tx.docUrl &&
                          !tx.docUrl.endsWith("null") &&
                          !tx.docUrl.endsWith("undefined") ? (
                            <a
                              href={tx.docUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline transition"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-3.5 h-3.5 shrink-0"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  d="M9 12h6m-6 4h6m2 4H7a2 2 0 01-2-2V6a2 2 0 012-2h7l5 5v11a2 2 0 01-2 2z"
                                />
                              </svg>
                              View Doc
                            </a>
                          ) : (
                            <span className="text-xs text-gray-300 italic">
                              No doc
                            </span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-xs text-gray-400"
                      >
                        No transactions found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Footer Actions ── */}
      </div>
    </>
  );
};

export default UserExpenseDrawer;
