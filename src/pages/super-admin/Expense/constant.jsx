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

// ─── Payout Button ────────────────────────────────────────────────────────────
const DROPDOWN_W = 176;

const calcPos = (btnEl, dropH) => {
  const rect = btnEl.getBoundingClientRect();
  const vh = window.innerHeight;
  const vw = window.innerWidth;

  // Flip above button if not enough room below
  const top =
    rect.bottom + dropH + 8 > vh ? rect.top - dropH - 4 : rect.bottom + 4;

  // Align to right of button but keep on screen
  const left = Math.min(
    Math.max(rect.right - DROPDOWN_W, 8),
    vw - DROPDOWN_W - 8,
  );

  return { top, left };
};

const PayoutButton = ({ onPayout, rowAmount = 0 }) => {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const [view, setView] = useState("menu"); // "menu" | "pending-input"
  const [pendingAmount, setPendingAmount] = useState("");

  const btnRef = useRef(null);
  const dropRef = useRef(null);

  const reposition = (currentView) => {
    if (!btnRef.current) return;
    const dropH = currentView === "pending-input" ? 116 : 124;
    setPos(calcPos(btnRef.current, dropH));
  };

  const openDropdown = () => {
    const nextOpen = !open;
    if (nextOpen) {
      setView("menu");
      setPendingAmount("");
      reposition("menu");
    }
    setOpen(nextOpen);
  };

  // Reposition when sub-view changes height
  useEffect(() => {
    if (open) reposition(view);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [view]);

  // Close on outside click
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
    if (status === "Paid") {
      onPayout?.(status, rowAmount);
      setOpen(false);
    } else if (status === "Unpaid") {
      onPayout?.(status, 0);
      setOpen(false);
    } else {
      // Switch to amount-input sub-view for Pending
      setView("pending-input");
      setPendingAmount("");
    }
  };

  const handlePendingConfirm = () => {
    const amt = parseFloat(pendingAmount);
    if (!pendingAmount || isNaN(amt) || amt <= 0) return;
    onPayout?.("Pending", amt);
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
            style={{ top: pos.top, left: pos.left, width: DROPDOWN_W }}
            className="fixed z-[9999] bg-white rounded-xl shadow-xl border border-gray-100 p-2"
          >
            {view === "menu" ? (
              <>
                <button
                  onClick={() => handleSelect("Paid")}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-emerald-50 text-emerald-600 font-medium"
                >
                  ✅ Paid
                  <span className="block text-[10px] text-emerald-400 font-normal leading-none mt-0.5">
                    ₹{rowAmount?.toLocaleString()} (full)
                  </span>
                </button>

                <button
                  onClick={() => handleSelect("Pending")}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-orange-50 text-orange-600 font-medium"
                >
                  ⏳ Pending
                  <span className="block text-[10px] text-orange-400 font-normal leading-none mt-0.5">
                    Enter partial amount →
                  </span>
                </button>

                <button
                  onClick={() => handleSelect("Unpaid")}
                  className="w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-red-50 text-red-600 font-medium"
                >
                  ❌ Unpaid
                  <span className="block text-[10px] text-red-400 font-normal leading-none mt-0.5">
                    ₹0
                  </span>
                </button>
              </>
            ) : (
              /* ── Pending amount input sub-view ── */
              <div className="px-1 py-1">
                <button
                  onClick={() => setView("menu")}
                  className="flex items-center gap-1 text-xs text-gray-400 hover:text-gray-600 mb-2 bg-transparent border-0 cursor-pointer p-0"
                >
                  ← Back
                </button>

                <p className="text-xs font-semibold text-orange-600 mb-2">
                  ⏳ Enter Paid Amount
                </p>

                <div className="relative mb-2">
                  <span className="absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-xs">
                    ₹
                  </span>
                  <input
                    type="number"
                    min="0"
                    step="any"
                    autoFocus
                    value={pendingAmount}
                    onChange={(e) => setPendingAmount(e.target.value)}
                    onKeyDown={(e) =>
                      e.key === "Enter" && handlePendingConfirm()
                    }
                    placeholder="0.00"
                    className="w-full pl-5 pr-2 py-1.5 text-sm border border-gray-200 rounded-lg outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 bg-gray-50"
                  />
                </div>

                <button
                  onClick={handlePendingConfirm}
                  disabled={
                    !pendingAmount ||
                    isNaN(parseFloat(pendingAmount)) ||
                    parseFloat(pendingAmount) <= 0
                  }
                  className="w-full py-1.5 text-xs font-semibold rounded-lg bg-orange-500 hover:bg-orange-600 text-white border-0 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed transition"
                >
                  Confirm
                </button>
              </div>
            )}
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
    meta: { headerClassName: "w-[4%]", cellClassName: "w-[4%]" },
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
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },

  {
    accessorKey: "amount",
    header: <FormattedMessage id="EXPENSE.AMOUNT" defaultMessage="Amount" />,
    cell: ({ row }) => (
      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
        ₹{row.original.amount?.toLocaleString()}/-
      </span>
    ),
    meta: { headerClassName: "w-[9%]", cellClassName: "w-[9%]" },
  },

  {
    accessorKey: "paidAmount",
    header: <FormattedMessage id="EXPENSE.PAID_AMOUNT" defaultMessage="Paid" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-emerald-600 whitespace-nowrap">
        ₹{(row.original.paidAmount ?? 0).toLocaleString()}/-
      </span>
    ),
    meta: { headerClassName: "w-[9%]", cellClassName: "w-[9%]" },
  },

  {
    accessorKey: "remainingAmount",
    header: (
      <FormattedMessage id="EXPENSE.REMAINING" defaultMessage="Remaining" />
    ),
    cell: ({ row }) => {
      const remaining =
        (row.original.amount ?? 0) - (row.original.paidAmount ?? 0);
      return (
        <span className="text-sm font-medium text-red-500 whitespace-nowrap">
          ₹{remaining.toLocaleString()}/-
        </span>
      );
    },
    meta: { headerClassName: "w-[9%]", cellClassName: "w-[9%]" },
  },

  {
    accessorKey: "remarks",
    header: <FormattedMessage id="EXPENSE.REMARKS" defaultMessage="Remarks" />,
    cell: ({ row }) => (
      <span className="text-sm text-gray-500">{row.original.remarks}</span>
    ),
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
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
    meta: { headerClassName: "w-[9%]", cellClassName: "w-[9%]" },
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
    meta: { headerClassName: "w-[9%]", cellClassName: "w-[9%]" },
  },

  {
    accessorKey: "status",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
    meta: { headerClassName: "w-[13%]", cellClassName: "w-[13%]" },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-0.5">
        <Tooltip title="Edit Expense">
          <button
            type="button"
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onEdit?.(row.original)}
          >
            <i className="ki-filled ki-notepad-edit text-primary" />
          </button>
        </Tooltip>

        <Tooltip title="Delete Expense">
          <button
            type="button"
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onDelete?.(row.original.id)}
          >
            <i className="ki-filled ki-trash text-danger" />
          </button>
        </Tooltip>

        <PayoutButton
          rowAmount={row.original.amount ?? 0}
          onPayout={(status, payoutAmount) =>
            onPayout?.(row.original.id, status, payoutAmount)
          }
        />
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];
