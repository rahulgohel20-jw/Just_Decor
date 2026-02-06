import { Fragment } from "react";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  Printer,
  Trash2,
} from "lucide-react";

const RecivePayment = () => {
  return (
    <Fragment>
        <div className="min-h-screen  ">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-7">

            {/* Total */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl px-6 py-5 flex justify-between">

                <div>
                <p className="text-[13px] text-[#6b7280]">
                    Total Received
                </p>

                <h2 className="text-[26px] font-semibold text-[#111827] mt-2">
                    ₹1,24,500.00
                </h2>

                <p className="text-[12px] text-[#16a34a] mt-1">
                    +12.5% from last month
                </p>
                </div>

                <div className="w-10 h-10 bg-[#dcfce7] rounded-lg flex items-center justify-center text-green-600 text-lg">
                ↗
                </div>

            </div>

            {/* Balance */}
            <div className="bg-white border border-[#e5e7eb] rounded-xl px-6 py-5 flex justify-between">

                <div>
                <p className="text-[13px] text-[#6b7280]">
                    Remaining Balance
                </p>

                <h2 className="text-[26px] font-semibold text-[#111827] mt-2">
                    ₹12,350.00
                </h2>

                <p className="text-[12px] text-[#16a34a] mt-1">
                    +3.2% vs expected
                </p>
                </div>

                <div className="w-10 h-10 bg-[#ffedd5] rounded-lg flex items-center justify-center text-orange-500 text-lg">
                ⏳
                </div>

            </div>

            </div>
            <div className="bg-white border border-[#e5e7eb] rounded-xl overflow-hidden">

            {/* Toolbar */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-5 py-4 border-b border-[#e5e7eb]">

                {/* Search */}
                <div className="relative w-full md:w-[260px]">

                <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9ca3af]"
                />

                <input
                    type="text"
                    placeholder="Filter by Bill #"
                    className="w-full pl-9 pr-3 py-[7px] text-sm border border-[#e5e7eb] rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                />
                </div>

                {/* Actions */}
                <div className="flex gap-3">

                <button className="flex items-center gap-2 px-3 py-[7px] border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-gray-50">
                    <SlidersHorizontal size={15} />
                    Filter
                </button>

                <button className="flex items-center gap-2 px-3 py-[7px] border border-[#e5e7eb] rounded-lg text-sm text-[#374151] hover:bg-gray-50">
                    <Download size={15} />
                    Export
                </button>

                </div>

            </div>

            {/* Table */}
            <div className="overflow-x-auto">

                <table className="w-full text-sm">

                <thead className="bg-[#f9fafb] border-b border-[#e5e7eb]">

                    <tr className="text-[11px] text-[#6b7280] uppercase tracking-wide">
                    <th className="px-5 py-3 text-left">
                        Bill #
                    </th>
                    <th className="px-5 py-3 text-left">
                        Date
                    </th>

                  

                    <th className="px-5 py-3 text-left">
                        Receive Status
                    </th>

                    <th className="px-5 py-3 text-right">
                        Pay Amount
                    </th>

                    <th className="px-5 py-3 text-center">
                        Actions
                    </th>

                    </tr>

                </thead>

                <tbody className="divide-y divide-[#e5e7eb]">

                    {[
                    {
                        date: "Oct 24, 2023",
                        bill: "INV-00124",
                        status: "Completed",
                        color: "green",
                        amount: "₹1,200.00",
                    },
                    {
                        date: "Oct 23, 2023",
                        bill: "INV-00123",
                        status: "Completed",
                        color: "green",
                        amount: "₹4,550.00",
                    },
                    {
                        date: "Oct 22, 2023",
                        bill: "INV-00122",
                        status: "Completed",
                        color: "green",
                        amount: "₹2,100.00",
                    },
                    {
                        date: "Oct 21, 2023",
                        bill: "INV-00121",
                        status: "Completed",
                        color: "green",
                        amount: "₹890.00",
                    },
                    {
                        date: "Oct 21, 2023",
                        bill: "INV-00121",
                        status: "Completed",
                        color: "green",
                        amount: "₹890.00",
                    },
                    {
                        date: "Oct 21, 2023",
                        bill: "INV-00121",
                        status: "Completed",
                        color: "green",
                        amount: "₹890.00",
                    },
                    {
                        date: "Oct 21, 2023",
                        bill: "INV-00121",
                        status: "Completed",
                        color: "green",
                        amount: "₹890.00",
                    },
                    {
                        date: "Oct 21, 2023",
                        bill: "INV-00121",
                        status: "Completed",
                        color: "green",
                        amount: "₹890.00",
                    },
                    ].map((row, i) => (
                    <tr key={i} className="hover:bg-[#f9fafb]">
   <td className="px-5 py-[14px] text-primary font-medium">
                        {row.bill}
                        </td>
                        <td className="px-5 py-[14px] text-[#374151]">
                        {row.date}
                        </td>

                     

                        <td className="px-5 py-[14px]">

                        <span
                            className={`inline-flex items-center gap-1 px-3 py-[2px] rounded-full text-[11px] font-medium
                            ${
                            row.color === "green"
                                ? "bg-green-100 text-green-700"
                                : row.color === "orange"
                                ? "bg-orange-100 text-orange-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
                            ● {row.status}
                        </span>

                        </td>

                        <td className="px-5 py-[14px] text-right font-medium text-[#111827]">
                        {row.amount}
                        </td>

                        <td className="px-5 py-[14px]">

                        <div className="flex justify-center gap-3 text-[#9ca3af]">

                            <Printer size={16} />
                            <Trash2 size={16} />

                        </div>

                        </td>

                    </tr>
                    ))}

                </tbody>

                </table>

            </div>

            {/* Footer */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-[#e5e7eb] text-sm text-[#6b7280]">

                <p>
                Showing 1 to 4 of 42 results
                </p>

                <div className="flex gap-2">

                <button className="px-3 py-1 border border-[#e5e7eb] rounded text-sm">
                    Previous
                </button>

                <button className="px-3 py-1 bg-primary text-white rounded text-sm">
                    1
                </button>

                <button className="px-3 py-1 border border-[#e5e7eb] rounded text-sm">
                    2
                </button>

                <button className="px-3 py-1 border border-[#e5e7eb] rounded text-sm">
                    3
                </button>

                <button className="px-3 py-1 border border-[#e5e7eb] rounded text-sm">
                    Next
                </button>

                </div>

            </div>

            </div>
        </div>
    </Fragment>
  );
};

export default RecivePayment;
