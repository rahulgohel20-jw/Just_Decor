import { useState, useRef, useEffect } from "react";
import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

// ─── Avatar ───────────────────────────────────────────────────────────────────
const avatarColors = [
  "bg-violet-500",
  "bg-pink-400",
  "bg-teal-500",
  "bg-amber-400",
  "bg-sky-400",
  "bg-rose-400",
  "bg-indigo-400",
  "bg-lime-500",
];

const Avatar = ({ name = "", index = 0 }) => {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
  return (
    <div
      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0 ${avatarColors[index % avatarColors.length]}`}
    >
      {initials}
    </div>
  );
};

// ─── Status Badge ─────────────────────────────────────────────────────────────
const statusStyles = {
  Paid: {
    text: "text-emerald-600",
    border: "border-emerald-400",
    dot: "bg-emerald-500",
  },
  Pending: {
    text: "text-orange-500",
    border: "border-orange-400",
    dot: "bg-orange-400",
  },
  unpaid: {
    text: "text-blue-600",
    border: "border-blue-400",
    dot: "bg-blue-500",
  },
};

const StatusBadge = ({ status }) => {
  const s = statusStyles[status] || {
    text: "text-gray-500",
    border: "border-gray-300",
    dot: "bg-gray-400",
  };
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-semibold border bg-white ${s.text} ${s.border}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${s.dot}`} />
      {status}
    </span>
  );
};

// ─── Payout Button with inline Yes / No confirm popover ───────────────────────
const PayoutButton = ({ onPayout }) => {
  const [confirm, setConfirm] = useState(false);
  const ref = useRef(null);

  // Close popover on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setConfirm(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Payout Icon Button */}
      <Tooltip title="Payout">
        <button
          type="button"
          onClick={() => setConfirm((v) => !v)}
          className="btn btn-sm btn-icon btn-clear"
        >
          {/* Wallet / payout icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-4 h-4 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
      </Tooltip>

      {/* Yes / No Confirm Popover */}
      {confirm && (
        <div className="absolute right-0 z-50 mt-1 w-44 bg-white rounded-xl shadow-lg border border-gray-100 p-3">
          <p className="text-xs font-semibold text-gray-700 mb-0.5">
            Confirm Payout?
          </p>
          <p className="text-xs text-gray-400 mb-3">
            This action cannot be undone.
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                onPayout?.();
                setConfirm(false);
              }}
              className="flex-1 py-1.5 rounded-lg bg-blue-700 hover:bg-blue-800 text-white text-xs font-semibold border-0 cursor-pointer transition"
            >
              Yes
            </button>
            <button
              type="button"
              onClick={() => setConfirm(false)}
              className="flex-1 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs font-semibold border-0 cursor-pointer transition"
            >
              No
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Columns ──────────────────────────────────────────────────────────────────
export const columns = (
  onEdit,
  onDelete,
  onStatusChange,
  onPayout,
  onUserClick,
) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No#" />,
    cell: ({ row }) => (
      <span className="text-sm text-gray-400 font-medium">
        {row.original.sr_no}
      </span>
    ),
    meta: { headerClassName: "w-[5%]", cellClassName: "w-[5%]" },
  },

  {
    accessorKey: "user",
    header: <FormattedMessage id="EXPENSE.USER" defaultMessage="User" />,
    cell: ({ row, table }) => {
      const index = table
        .getCoreRowModel()
        .rows.findIndex((r) => r.id === row.id);
      const user = row.original.user ?? {};
      return (
        <button
          type="button"
          onClick={() => onUserClick?.(row.original)}
          className="flex items-center gap-3 group bg-transparent border-0 cursor-pointer text-left p-0 w-full"
        >
          <Avatar name={user.name ?? ""} index={index} />
          <div>
            <p className="text-sm font-semibold text-gray-900 leading-tight group-hover:text-blue-600 transition-colors">
              {user.name}
            </p>
          </div>
        </button>
      );
    },
    meta: { headerClassName: "w-[18%]", cellClassName: "w-[18%]" },
  },

  {
    accessorKey: "amount",
    header: <FormattedMessage id="EXPENSE.AMOUNT" defaultMessage="Amount" />,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
        ₹{row.original.amount?.toLocaleString()}/-
      </span>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },

  {
    accessorKey: "status",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
  },

  {
    accessorKey: "remarks",
    header: <FormattedMessage id="EXPENSE.REMARKS" defaultMessage="Remarks" />,
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">{row.original.remarks}</span>
    ),
    meta: { headerClassName: "w-[17%]", cellClassName: "w-[17%]" },
  },

  {
    accessorKey: "startDate",
    header: (
      <FormattedMessage id="EXPENSE.START_DATE" defaultMessage="Start Date" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {row.original.startDate}
      </span>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },

  {
    accessorKey: "dueDate",
    header: (
      <FormattedMessage id="EXPENSE.DUE_DATE" defaultMessage="Due Date" />
    ),
    cell: ({ row }) => (
      <span className="text-sm text-gray-500 whitespace-nowrap">
        {row.original.dueDate}
      </span>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-0.5">
        {/* Edit */}
        <Tooltip title="Edit Expense">
          <button
            type="button"
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onEdit?.(row.original)}
          >
            <i className="ki-filled ki-notepad-edit text-primary" />
          </button>
        </Tooltip>

        {/* Delete */}
        <Tooltip title="Delete Expense">
          <button
            type="button"
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onDelete?.(row.original.id)}
          >
            <i className="ki-filled ki-trash text-danger" />
          </button>
        </Tooltip>

        {/* Payout — icon button with inline Yes/No confirm */}
        <PayoutButton onPayout={() => onPayout?.(row.original.id)} />
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];

// ─── Default / Mock Data ──────────────────────────────────────────────────────
export const defaultData = [
  {
    id: 1,
    sr_no: 1,
    user: {
      name: "Mayoralven",
      handle: "@mayoralven",
      email: "info@mayoralven.com",
      phone: "+1 234-567-890",
      role: "Senior Field Operations",
    },
    amount: 40689,
    status: "Paid",
    remarks: "info@mayoralven.com",
    startDate: "01/02/2026",
    dueDate: "10/02/2026",
    totalAmount: 40689,
    paidAmount: 28000,
    transactions: [
      {
        date: "12/02/2026",
        type: "Fuel",
        particular: "Shell Station - MH01",
        amount: 2400,
        status: "Paid",
      },
      {
        date: "10/02/2026",
        type: "Travel",
        particular: "Uber Business Trip",
        amount: 650,
        status: "Pending",
      },
      {
        date: "08/02/2026",
        type: "Office",
        particular: "Supplies for Event",
        amount: 1200,
        status: "Unpaid",
      },
      {
        date: "05/02/2026",
        type: "Food",
        particular: "Lunch with Client",
        amount: 3500,
        status: "Paid",
      },
      {
        date: "01/02/2026",
        type: "Misc",
        particular: "Client Gift Hamper",
        amount: 5000,
        status: "Paid",
      },
    ],
  },
  {
    id: 2,
    sr_no: 2,
    user: {
      name: "Lionesse Yami",
      handle: "@l.yami",
      email: "l.yami@emviui.com",
      phone: "+1 555-100-200",
      role: "Account Manager",
    },
    amount: 1000,
    status: "Paid",
    remarks: "l.yami@emviui.com",
    startDate: "01/02/2026",
    dueDate: "10/02/2026",
    totalAmount: 1000,
    paidAmount: 1000,
    transactions: [
      {
        date: "09/02/2026",
        type: "Travel",
        particular: "Flight to Pune",
        amount: 1000,
        status: "Paid",
      },
    ],
  },
  {
    id: 3,
    sr_no: 3,
    user: {
      name: "Christian Chang",
      handle: "@c.chang",
      email: "c.chang@emviui.com",
      phone: "+1 555-300-400",
      role: "Operations Lead",
    },
    amount: 1000,
    status: "Pending",
    remarks: "c.chang@emviui.com",
    startDate: "01/02/2026",
    dueDate: "10/02/2026",
    totalAmount: 1000,
    paidAmount: 0,
    transactions: [
      {
        date: "07/02/2026",
        type: "Office",
        particular: "Printer Cartridges",
        amount: 1000,
        status: "Pending",
      },
    ],
  },
  {
    id: 4,
    sr_no: 4,
    user: {
      name: "Jade Solis",
      handle: "@j.solis",
      email: "j.solis@emviui.com",
      phone: "+1 555-500-600",
      role: "HR Manager",
    },
    amount: 1000,
    status: "unpaid",
    remarks: "j.solis@emviui.com",
    startDate: "01/02/2026",
    dueDate: "10/02/2026",
    totalAmount: 1000,
    paidAmount: 500,
    transactions: [
      {
        date: "06/02/2026",
        type: "Food",
        particular: "Team Lunch",
        amount: 1000,
        status: "Paid",
      },
    ],
  },
  {
    id: 5,
    sr_no: 5,
    user: {
      name: "Claude Bowman",
      handle: "@c.bowman",
      email: "c.bowman@emviui.com",
      phone: "+1 555-700-800",
      role: "Field Executive",
    },
    amount: 1000,
    status: "Pending",
    remarks: "c.bowman@emviui.com",
    startDate: "01/02/2026",
    dueDate: "10/02/2026",
    totalAmount: 1000,
    paidAmount: 0,
    transactions: [
      {
        date: "04/02/2026",
        type: "Fuel",
        particular: "Petrol - MH12",
        amount: 1000,
        status: "Pending",
      },
    ],
  },
  {
    id: 6,
    sr_no: 6,
    user: {
      name: "Aria Thompson",
      handle: "@a.thompson",
      email: "a.thompson@emviui.com",
      phone: "+1 555-900-100",
      role: "Sales Executive",
    },
    amount: 2500,
    status: "Paid",
    remarks: "a.thompson@emviui.com",
    startDate: "03/02/2026",
    dueDate: "12/02/2026",
    totalAmount: 2500,
    paidAmount: 2500,
    transactions: [
      {
        date: "11/02/2026",
        type: "Travel",
        particular: "Cab to Airport",
        amount: 800,
        status: "Paid",
      },
      {
        date: "10/02/2026",
        type: "Food",
        particular: "Client Dinner",
        amount: 1700,
        status: "Paid",
      },
    ],
  },
  {
    id: 7,
    sr_no: 7,
    user: {
      name: "Marcus Reid",
      handle: "@m.reid",
      email: "m.reid@emviui.com",
      phone: "+1 555-200-300",
      role: "Tech Support",
    },
    amount: 750,
    status: "Pending",
    remarks: "m.reid@emviui.com",
    startDate: "05/02/2026",
    dueDate: "15/02/2026",
    totalAmount: 750,
    paidAmount: 0,
    transactions: [
      {
        date: "13/02/2026",
        type: "Office",
        particular: "USB Hub Purchase",
        amount: 750,
        status: "Pending",
      },
    ],
  },
  {
    id: 8,
    sr_no: 8,
    user: {
      name: "Priya Sharma",
      handle: "@p.sharma",
      email: "p.sharma@emviui.com",
      phone: "+1 555-400-500",
      role: "Project Manager",
    },
    amount: 3200,
    status: "paid",
    remarks: "p.sharma@emviui.com",
    startDate: "07/02/2026",
    dueDate: "17/02/2026",
    totalAmount: 3200,
    paidAmount: 1500,
    transactions: [
      {
        date: "14/02/2026",
        type: "Misc",
        particular: "Software License",
        amount: 2000,
        status: "Paid",
      },
      {
        date: "12/02/2026",
        type: "Travel",
        particular: "Metro Pass Monthly",
        amount: 1200,
        status: "Unpaid",
      },
    ],
  },
];
