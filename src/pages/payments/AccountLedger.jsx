import { useState } from "react";
import { toAbsoluteUrl } from "@/utils";
import CreatePayment from "./components/CreatePayment";

const AccountLedger = () => {
  const [accountName, setAccountName] = useState("");
  const [fromDate, setFromDate] = useState("02/01/2026");
  const [toDate, setToDate] = useState("02/01/2026");
  const [isCreatePayment, setIsCreatePayment] = useState(false);

  const ledgerData = [
    {
      srNo: 1,
      settelAmt: 0,
      date: "01-02-2026",
      voucherNo: "INV-2023-00124",
      eventName: "Grand Hyatt Wedding - Sharma's",
      type: "CP",
      credit: 12500.0,
      debit: 0.0,
      balance: 57750.0,
    },
    {
      srNo: 2,
      settelAmt: 0,
      date: "01-02-2026",
      voucherNo: "INV-2023-00124",
      eventName: "Grand Hyatt Wedding - Sharma's",
      type: "BP",
      credit: 12500.0,
      debit: 0.0,
      balance: 57750.0,
    },
    {
      srNo: 3,
      settelAmt: 0,
      date: "01-02-2026",
      voucherNo: "INV-2023-00124",
      eventName: "The Grand Bhagwati",
      type: "CP",
      credit: 12500.0,
      debit: 0.0,
      balance: 57750.0,
    },
    {
      srNo: 4,
      settelAmt: 0,
      date: "01-02-2026",
      voucherNo: "INV-2023-00124",
      eventName: "Taj Wedding",
      type: "CP",
      credit: 12500.0,
      debit: 0.0,
      balance: 57750.0,
    },
  ];

  const totalCredit = 22234400.0;
  const totalDebit = 22234400.0;
  const totalBalance = 22234400.0;

  return (
    <div className="w-full ">
      {/* Header Section */}
      <div className="bg-white rounded-lg shadow-sm">
        {/* Title and Actions */}
        <div className="px-6 py-4 border-b border-gray-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">
              General Account Ledger
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              View and manage detailed transaction logs for accounts.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <img
                src={toAbsoluteUrl("/media/icons/export.png")}
                className=" max-h-[50px]"
                alt=""
              />
              Export PDF
            </button>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
              <img
                src={toAbsoluteUrl("/media/icons/print.png")}
                className=" max-h-[50px]"
                alt=""
              />
              Print
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors"
              onClick={() => setIsCreatePayment(true)}
            >
              <img
                src={toAbsoluteUrl("/media/icons/cp.png")}
                className=" max-h-[50px]"
                alt=""
              />
              Create Payment
            </button>
          </div>
        </div>

        {/* Filter Section */}
        <div className="px-6 py-6 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Name
              </label>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter Name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                From Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                To Date
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
                <svg
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                  />
                </svg>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-4 py-2 text-sm font-medium text-white bg-primary rounded-md hover:bg-blue-700 transition-colors">
                Apply Filter
              </button>
              <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                Reset
              </button>
            </div>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="px-6 py-6 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">
                    CR (Credit) Amount
                  </p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{" "}
                    {totalCredit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /-
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">DR (Debit)</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{" "}
                    {totalDebit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /-
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-xs text-gray-600 mb-1">Total Balance</p>
                  <p className="text-lg font-semibold text-gray-900">
                    ₹{" "}
                    {totalBalance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                    /-
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Table Section */}
        <div className="overflow-x-auto ">
          <table className="w-full px-6 py-6">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  SR No.
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Invoice NO
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Account Name
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  {" "}
                  Date
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Type
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Settlement Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Cr (Credit)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  DR (Debit)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider">
                  Total Balance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {ledgerData.map((row, index) => (
                <tr key={index} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {row.srNo}.
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {row.voucherNo}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {row.eventName}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {row.date}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-xs font-medium rounded-full ${
                        row.type === "CP"
                          ? "bg-blue-100 text-blue-700"
                          : "bg-teal-100 text-teal-700"
                      }`}
                    >
                      {row.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900">
                    {row.settelAmt}
                  </td>

                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 text-right">
                    {row.credit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 text-right">
                    {row.debit.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                  <td className="px-6 py-4 text-center whitespace-nowrap text-sm text-gray-900 text-right">
                    {row.balance.toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer Summary */}
        <div className="px-6 py-6 bg-gray-50 border-t border-gray-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="text-sm font-medium text-gray-700">
              Amount to Credit:
            </div>
            <div className="flex flex-wrap gap-[26px] items-center">
              <div className="text-sm">
                <span className="text-primary font-semibold">55,585.00</span>
              </div>
              <div className="text-sm">
                <span className="text-primary font-semibold">55,585.00</span>
              </div>
              <div className="px-4 py-2 bg-primary text-white font-semibold rounded-md">
                23,34,0.00
              </div>
            </div>
          </div>
        </div>
      </div>
      <CreatePayment
        isOpen={isCreatePayment}
        onClose={() => setIsCreatePayment(false)}
      />
    </div>
  );
};

export default AccountLedger;
