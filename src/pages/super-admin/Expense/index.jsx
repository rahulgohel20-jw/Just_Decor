import { useState, useEffect } from "react";
import SimpleExpenseForm from "../../../partials/modals/add-super-expense/Simpleexpenseform";
import ComplexExpenseForm from "../../../partials/modals/add-super-expense/Complexexpenseform";
import UserExpenseDrawer from "../../../partials/modals/add-super-expense/Userexpensedrawer";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import { toAbsoluteUrl } from "@/utils";
import Swal from "sweetalert2";
import {
  GEtEmployeeExpensebytype,
  GEtEmpofficeExpensebytype,
  DeleteEmployeeExpenseoffice,
  DeleteEmployeeExpenseTrip,
  GETtripexpenseById,
  GETofficeexpenseById,
  updatepayoutforoffice,
  updatepayoutforTrip,
} from "@/services/apiServices";

// ─── Constants ────────────────────────────────────────────────────────────────
const SIMPLE_TYPES = ["employees", "office", "serve"];

const expenseTabs = [
  { key: "trip", label: "Trip Expenses" },
  { key: "employees", label: "Employees Expenses" },
  { key: "office", label: "Office Expenses" },
  { key: "serve", label: "Serve Expenses" },
  { key: "other", label: "Other Expenses" },
];

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconPlus = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    strokeWidth={2.5}
  >
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
  </svg>
);
const IconDoc = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
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
);
const IconSearch = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-4 h-4"
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
);

// ─── Date Utilities ───────────────────────────────────────────────────────────
export const formatDate = (raw) => {
  if (!raw) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) return raw;
  const m = raw.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (m) return `${m[3]}/${m[2]}/${m[1]}`;
  return raw;
};

export const toInputDate = (raw) => {
  if (!raw) return "";
  if (/^\d{2}\/\d{2}\/\d{4}$/.test(raw)) {
    const [d, m, y] = raw.split("/");
    return `${y}-${m}-${d}`;
  }
  const m = raw.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  return "";
};

// ─── Main Component ───────────────────────────────────────────────────────────
const AllExpense = () => {
  const [activeTab, setActiveTab] = useState("trip");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editData, setEditData] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalKey, setModalKey] = useState(0);
  const [summary, setSummary] = useState({
    total_expense: 0,
    paid_expense: 0,
    remaing_expense: 0,
  });

  const userId = Number(localStorage.getItem("mainId"));
  const currentTab = expenseTabs.find((t) => t.key === activeTab);
  const isSimple = SIMPLE_TYPES.includes(activeTab);

  // ── Fetch list ─────────────────────────────────────────────────────────────
  const fetchExpenses = async (tab = activeTab) => {
    setLoading(true);
    setData([]);
    try {
      const simple = SIMPLE_TYPES.includes(tab);
      const res = simple
        ? await GEtEmpofficeExpensebytype(userId, tab)
        : await GEtEmployeeExpensebytype(userId, tab);

      // API shape: { total_expense, paid_expense, remaing_expense, data: [...] }
      const payload = res?.data?.data ?? res?.data ?? {};

      setSummary({
        total_expense: payload.total_expense ?? 0,
        paid_expense: payload.paid_expense ?? 0,
        remaing_expense: payload.remaing_expense ?? 0,
      });

      const raw = payload.data;
      const list = Array.isArray(raw) ? raw : raw ? [raw] : [];

      setData(
        list.map((item, index) => ({
          id: item.id,
          sr_no: index + 1,
          user: {
            name: item.title,
            role: "",
            email: "",
            phone: "",
            avatar: null,
          },
          amount: item.totalAmount ?? item.expenseAmount ?? 0,
          status:
            item.payoutAmount > 0 && item.remaingAmount === 0
              ? "Paid"
              : item.payoutAmount > 0 && item.remaingAmount > 0
                ? "Pending"
                : "Unpaid",
          remarks: item.remark ?? item.remarks ?? "",
          startDate: formatDate(item.fromDate ?? item.expenseDate),
          dueDate: formatDate(item.dueDate),
          totalAmount: item.totalAmount ?? item.expenseAmount ?? 0,
          paidAmount: item.payoutAmount ?? item.paidAmount ?? 0,
          remainingAmount: item.remaingAmount ?? 0,
          transactions: item.detailRequestDtos ?? [],
          fromCityId: item.fromCityId,
          toCityId: item.toCityId,
          toDate: formatDate(item.toDate),
          expenseType: item.expenseType,
          userId: item.userId,
        })),
      );
    } catch (err) {
      console.error("Failed to fetch expenses:", err);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExpenses(activeTab);
  }, [activeTab]);

  // ── Doc-path sanity ────────────────────────────────────────────────────────
  const validDoc = (url) =>
    url && !url.endsWith("null") && !url.endsWith("undefined") ? url : null;

  // ── Edit ───────────────────────────────────────────────────────────────────
  const handleEdit = async (row) => {
    setEditLoading(true);
    try {
      if (isSimple) {
        const res = await GETofficeexpenseById(row.id);
        const d = res?.data?.data ?? {};
        setEditData({
          id: d.id ?? row.id,
          title: d.title ?? "",
          employeeName: d.title ?? "",
          officeName: d.title ?? "",
          serveName: d.title ?? "",
          expenseDate: toInputDate(d.expenseDate),
          amount: d.expenseAmount ?? "",
          dueDate: toInputDate(d.dueDate),
          paymentMethod: d.paymentMode ?? "gpay",
          remarks: d.remarks ?? "",
          billFile: null,
          existingDocUrl: validDoc(d.docPath),
        });
      } else {
        const res = await GETtripexpenseById(row.id);
        const d = res?.data?.data ?? {};
        setEditData({
          id: d.id ?? row.id,
          title: d.title ?? "",
          tripName: d.title ?? "",
          otherName: d.title ?? "",
          startDate: toInputDate(d.fromDate),
          endDate: toInputDate(d.toDate),
          dueDate: toInputDate(d.dueDate),
          fromCity: d.fromCityId ?? null,
          toCity: d.toCityId ?? null,
          amount: d.totalAmount ?? "",
          remarks: d.remarks ?? "",
          expenseRows: (d.detailRequestDtos ?? []).map((tx) => ({
            id: tx.id ?? -1,
            expenseId: tx.expenseId ?? d.id ?? -1,
            date: toInputDate(tx.expenseDate),
            description: tx.perticular ?? "",
            paymentMode: tx.paymentMode ?? "gpay",
            amount: tx.amount ?? "",
            remarks: tx.remarks ?? "",
            file: null,
            existingDocUrl: validDoc(tx.docPath),
          })),
        });
      }
      setIsModalOpen(true);
    } catch (err) {
      console.error("Failed to fetch expense for edit:", err);
      Swal.fire({
        title: "Failed!",
        text: "Could not load expense details. Please try again.",
        icon: "error",
        confirmButtonColor: "#1d4ed8",
        customClass: { popup: "!rounded-2xl", confirmButton: "!rounded-xl" },
      });
    } finally {
      setEditLoading(false);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditData(null);
    fetchExpenses(activeTab);
  };

  // ── Drawer ─────────────────────────────────────────────────────────────────
  const handleUserClick = async (row) => {
    try {
      const simple = SIMPLE_TYPES.includes(activeTab);
      if (simple) {
        const res = await GETofficeexpenseById(row.id);
        const detail = res?.data?.data ?? null;
        setSelectedUser({
          name: detail?.title ?? row.user?.name ?? "Unknown",
          role: detail?.expenseType ?? "",
          username: null,
          email: null,
          phone: null,
          avatar: null,
          totalAmount: detail?.expenseAmount ?? 0,
          paidAmount: detail?.payoutAmount ?? 0,
          remainingAmount: detail?.remaingAmount ?? 0,
          transactions: detail
            ? [
                {
                  date: formatDate(detail.expenseDate),
                  type: detail.paymentMode ?? "",
                  particular: detail.title ?? "",
                  amount: detail.expenseAmount ?? 0,
                  status: detail.status ?? "Pending",
                  docUrl: detail.docPath ?? null,
                },
              ]
            : [],
        });
      } else {
        const res = await GETtripexpenseById(row.id);
        const detail = res?.data?.data ?? null;
        setSelectedUser({
          name: detail?.title ?? row.user?.name ?? "Unknown",
          role: detail?.expenseType ?? "",
          username: null,
          email: null,
          phone: null,
          avatar: null,
          totalAmount: detail?.totalAmount ?? 0,
          paidAmount: detail?.payoutAmount ?? 0,
          remainingAmount: detail?.remaingAmount ?? 0,
          transactions: (detail?.detailRequestDtos ?? []).map((tx) => ({
            date: formatDate(tx.expenseDate),
            type: tx.paymentMode ?? "",
            particular: tx.perticular ?? "",
            amount: tx.amount ?? 0,
            status: tx.status ?? "Pending",
            docUrl: tx.docPath ?? null,
          })),
        });
      }
      setDrawerOpen(true);
    } catch (err) {
      console.error("Failed to fetch expense detail:", err);
      setSelectedUser({
        name: row.user?.name ?? "Unknown",
        role: "",
        username: null,
        email: null,
        phone: null,
        avatar: null,
        totalAmount: row.totalAmount ?? 0,
        paidAmount: row.paidAmount ?? 0,
        transactions: row.transactions ?? [],
      });
      setDrawerOpen(true);
    }
  };

  // ── Delete ─────────────────────────────────────────────────────────────────
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This expense will be permanently deleted.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1d4ed8",
      cancelButtonColor: "#e5e7eb",
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
      customClass: {
        popup: "!rounded-2xl",
        confirmButton: "!rounded-xl",
        cancelButton: "!rounded-xl",
      },
    });
    if (!result.isConfirmed) return;

    try {
      isSimple
        ? await DeleteEmployeeExpenseoffice(id)
        : await DeleteEmployeeExpenseTrip(id);
      setData((prev) => prev.filter((item) => item.id !== id));
      Swal.fire({
        title: "Deleted!",
        text: "Expense deleted successfully.",
        icon: "success",
        confirmButtonColor: "#1d4ed8",
        customClass: { popup: "!rounded-2xl", confirmButton: "!rounded-xl" },
      });
    } catch {
      Swal.fire({
        title: "Failed!",
        text: "Something went wrong.",
        icon: "error",
        confirmButtonColor: "#1d4ed8",
        customClass: { popup: "!rounded-2xl", confirmButton: "!rounded-xl" },
      });
    }
  };

  const handleStatusChange = (id, currentStatus) =>
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: currentStatus === "Paid" ? "Pending" : "Paid" }
          : item,
      ),
    );

  // ── Payout ─────────────────────────────────────────────────────────────────
  const handlePayout = async (id, payoutType, payoutAmount) => {
    try {
      isSimple
        ? await updatepayoutforoffice(id, payoutType, payoutAmount)
        : await updatepayoutforTrip(id, payoutType, payoutAmount);

      // ✅ Update state directly — do NOT call fetchExpenses()
      // Fetching immediately after the API call often returns the OLD
      // status because the backend hasn't committed the change yet.
      setData((prev) =>
        prev.map((item) =>
          item.id === id
            ? {
                ...item,
                status: payoutType,
                paidAmount:
                  payoutType === "Paid"
                    ? item.amount
                    : payoutType === "Unpaid"
                      ? 0
                      : Number(payoutAmount),
              }
            : item,
        ),
      );

      // Fire-and-forget toast (no await) so table updates are visible immediately

      Swal.fire({
        title: "Payout Updated!",
        text: `Status set to ${payoutType} · ₹${Number(payoutAmount ?? 0).toLocaleString()}`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
        customClass: { popup: "!rounded-2xl" },
      });
      fetchExpenses(activeTab); // 👈 add this
    } catch (err) {
      console.error("Payout failed:", err);
      Swal.fire({
        title: "Failed!",
        text: "Payout could not be processed.",
        icon: "error",
        confirmButtonColor: "#1d4ed8",
        customClass: { popup: "!rounded-2xl", confirmButton: "!rounded-xl" },
      });
    }
  };

  const filteredData = data.filter(
    (e) =>
      e.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      e.remarks?.toLowerCase().includes(search.toLowerCase()),
  );

  const tableColumns = columns(
    handleEdit,
    handleDelete,
    handleStatusChange,
    handlePayout,
    handleUserClick,
  );

  // ─── Summary cards from live API ──────────────────────────────────────────
  const summaryCards = [
    {
      label: "Total Expenses",
      value: `₹ ${summary.total_expense.toLocaleString()}`,
      icon: toAbsoluteUrl("/media/icons/expense4.png"),
      iconBg: "bg-red-50",
    },
    {
      label: "Total Paid",
      value: `₹ ${summary.paid_expense.toLocaleString()}`,
      icon: toAbsoluteUrl("/media/icons/expense3.png"),
      iconBg: "bg-emerald-50",
    },
    {
      label: "Total Remaining",
      value: `₹ ${summary.remaing_expense.toLocaleString()}`,
      icon: toAbsoluteUrl("/media/icons/expense2.png"),
      iconBg: "bg-blue-50",
    },
  ];

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-default"
          >
            <div>
              <p className="text-sm text-gray-400 font-medium mb-1">
                {card.label}
              </p>
              <p className="text-2xl font-bold text-gray-900">{card.value}</p>
            </div>
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${card.iconBg}`}
            >
              <img
                src={card.icon}
                alt={card.label}
                className="w-6 h-6 object-contain"
                onError={(e) => {
                  e.target.style.display = "none";
                }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm mb-5 flex flex-wrap gap-2">
        {expenseTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border-0 cursor-pointer
              ${activeTab === tab.key ? "bg-blue-700 text-white shadow-sm" : "bg-transparent text-gray-500 hover:bg-gray-100"}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-2xl shadow-sm h-[700px] flex flex-col">
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {currentTab?.label}
          </h2>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 w-44 transition placeholder-gray-400"
              />
            </div>

            <button
              type="button"
              disabled={editLoading}
              onClick={() => {
                setEditData(null);
                setModalKey((k) => k + 1); // 👈 force fresh key
                setIsModalOpen(false);
                setTimeout(() => setIsModalOpen(true), 0);
              }}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900 text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer border-0 disabled:opacity-60"
            >
              {editLoading ? (
                <svg
                  className="w-4 h-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8z"
                  />
                </svg>
              ) : (
                <IconPlus />
              )}
              New
            </button>

            <button
              type="button"
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <IconDoc /> Export PDF
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {loading ? (
          <div className="flex items-center justify-center py-16 text-gray-400 text-sm">
            <svg
              className="w-5 h-5 animate-spin mr-2"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8z"
              />
            </svg>
            Loading expenses...
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto overflow-x-auto [&_table]:border-0 [&_th]:border-0 [&_td]:border-0 [&_thead]:bg-gray-50 [&_thead_tr]:border-0 [&_tbody_tr]:border-t [&_tbody_tr]:border-gray-100 [&_tbody_tr:hover]:bg-gray-50/60 [&_th]:text-xs [&_th]:font-semibold [&_th]:text-gray-500 [&_th]:uppercase [&_th]:tracking-wide [&_th]:py-3 [&_th]:px-4 [&_td]:py-3.5 [&_td]:px-4">
            <TableComponent columns={tableColumns} data={filteredData} />
          </div>
        )}

        <div className="h-px bg-gray-100" />
        <div className="px-6 py-3">
          <span className="text-sm text-gray-400">
            Showing{" "}
            <span className="font-semibold text-gray-600">
              {filteredData.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-600">{data.length}</span>{" "}
            entries
          </span>
        </div>
      </div>

      {isSimple ? (
        <SimpleExpenseForm
          key={modalKey}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          expenseType={activeTab}
          editData={editData}
        />
      ) : (
        <ComplexExpenseForm
          key={modalKey}
          isOpen={isModalOpen}
          onClose={handleModalClose}
          expenseType={activeTab}
          editData={editData}
          fetchExpenses={fetchExpenses}
        />
      )}
      <UserExpenseDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default AllExpense;
