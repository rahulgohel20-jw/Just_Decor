import { useState, useRef, useEffect } from "react";
import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";
import ReactDOM from "react-dom";

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
  Unpaid: {
    // ✅ FIXED (capital U)
    text: "text-red-600",
    border: "border-red-400",
    dot: "bg-red-500",
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
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const dropRef = useRef(null);

  // Position the dropdown relative to the button using fixed coords
  const openDropdown = () => {
    if (btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.bottom + 4,
        left: rect.right - 160, // 160 = dropdown width (w-40)
      });
    }
    setOpen((v) => !v);
  };

  useEffect(() => {
    const handler = (e) => {
      if (
        dropRef.current &&
        !dropRef.current.contains(e.target) &&
        btnRef.current &&
        !btnRef.current.contains(e.target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (status) => {
    onPayout?.(status);
    setOpen(false);
  };

  return (
    <>
      <Tooltip title="Update Payout Status">
        <button
          ref={btnRef}
          type="button"
          onClick={openDropdown}
          className="btn btn-sm btn-icon btn-clear"
        >
          <i className="ki-filled ki-wallet text-blue-600" />
        </button>
      </Tooltip>

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropRef}
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-[9999] w-40 bg-white rounded-xl shadow-lg border border-gray-100 p-2"
          >
            <button
              onClick={() => handleSelect("Paid")}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 text-emerald-600 font-medium"
            >
              ✅ Paid
            </button>
            <button
              onClick={() => handleSelect("Pending")}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-orange-50 text-orange-600 font-medium"
            >
              ⏳ Pending
            </button>
            <button
              onClick={() => handleSelect("Unpaid")}
              className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 font-medium"
            >
              ❌ Unpaid
            </button>
          </div>,
          document.body,
        )}
    </>
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
    accessorKey: "status",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
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
        <PayoutButton
          onPayout={(status) => onPayout?.(row.original.id, status)}
        />{" "}
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];
