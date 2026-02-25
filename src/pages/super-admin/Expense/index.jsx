import { useState } from "react";
import AddSuperExpense from "../../../partials/modals/add-super-expense/AddSuperExpense";
import AddServer_emp_other_superExpense from "../../../partials/modals/add-super-expense/Addserver_emp_other_superExpense";
import UserExpenseDrawer from "../../../partials/modals/add-super-expense/Userexpensedrawer"; // 👈 adjust path
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import { toAbsoluteUrl } from "@/utils";

// ─── Static Data ──────────────────────────────────────────────────────────────
const summaryCards = [
  {
    label: "Total Amount",
    value: "₹ 40,689",
    icon: toAbsoluteUrl("/media/icons/expense2.png"),
    iconBg: "bg-indigo-50",
  },
  {
    label: "Total Expenses",
    value: "₹ 10,293",
    icon: toAbsoluteUrl("/media/icons/expense1.png"),
    iconBg: "bg-amber-50",
  },
  {
    label: "Total Remaining",
    value: "₹ 89,000",
    icon: toAbsoluteUrl("/media/icons/expense3.png"),
    iconBg: "bg-emerald-50",
  },
];

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

// ─── Main Component ───────────────────────────────────────────────────────────
const AllExpense = () => {
  const [activeTab, setActiveTab] = useState("employees");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isServerEmpOtherModalOpen, setIsServerEmpOtherModalOpen] =
    useState(false);
  const [search, setSearch] = useState("");
  const [data, setData] = useState(defaultData);

  // ── User Drawer state ──────────────────────────────────────────────────────
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const currentTab = expenseTabs.find((t) => t.key === activeTab);

  // ── Open correct add-expense modal ────────────────────────────────────────
  const handleNewClick = () => setIsModalOpen(true);

  // ── Open user drawer when clicking a user cell ────────────────────────────
  const handleUserClick = (row) => {
    // Build a user object from the row — adapt fields to match your data shape
    setSelectedUser({
      name: row.user?.name ?? "Unknown",
      role: row.user?.role ?? "Employee",
      username: row.user?.username,
      email: row.user?.email,
      phone: row.user?.phone,
      avatar: row.user?.avatar,
      totalAmount: row.totalAmount ?? row.amount ?? 0,
      paidAmount: row.paidAmount ?? 0,
      transactions: row.transactions ?? [], // array of { date, type, particular, amount, status }
    });
    setDrawerOpen(true);
  };

  // ── Table handlers ─────────────────────────────────────────────────────────
  const handleEdit = (row) => console.log("Edit:", row);
  const handleDelete = (id) =>
    setData((prev) => prev.filter((item) => item.id !== id));

  const handleStatusChange = (id, currentStatus) =>
    setData((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: currentStatus === "Paid" ? "Pending" : "Paid" }
          : item,
      ),
    );

  const handlePayout = (id) => console.log("Payout confirmed for id:", id);

  // ── Filtered rows ──────────────────────────────────────────────────────────
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
    handleUserClick, // 👈 pass this to columns so clicking a user name triggers the drawer
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* ── Summary Cards ─────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-6">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="bg-white rounded-2xl px-6 py-5 shadow-sm flex items-center justify-between
                       hover:-translate-y-0.5 hover:shadow-md transition-all duration-150 cursor-default"
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

      {/* ── Tabs ──────────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl px-4 py-3 shadow-sm mb-5 flex flex-wrap gap-2">
        {expenseTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 border-0 cursor-pointer
              ${
                activeTab === tab.key
                  ? "bg-blue-700 text-white shadow-sm"
                  : "bg-transparent text-gray-500 hover:bg-gray-100"
              }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── Table Card ────────────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm">
        {/* Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-4">
          <h2 className="text-base font-bold text-gray-900">
            {currentTab?.label}
          </h2>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Search */}
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IconSearch />
              </span>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search tasks..."
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm text-gray-600
                           bg-gray-50 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300
                           w-44 transition placeholder-gray-400"
              />
            </div>

            {/* New */}
            <button
              type="button"
              onClick={handleNewClick}
              className="flex items-center gap-1.5 bg-blue-700 hover:bg-blue-800 active:bg-blue-900
                         text-white text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer border-0"
            >
              <IconPlus />
              New
            </button>

            {/* Export PDF */}
            <button
              type="button"
              className="flex items-center gap-1.5 bg-white border border-gray-200 hover:bg-gray-50
                         text-gray-600 text-sm font-semibold px-4 py-2 rounded-xl transition cursor-pointer"
            >
              <IconDoc />
              Export PDF
            </button>
          </div>
        </div>

        <div className="h-px bg-gray-100" />

        {/* Table */}
        <div
          className="[&_table]:border-0 [&_th]:border-0 [&_td]:border-0
                        [&_thead]:bg-gray-50 [&_thead_tr]:border-0
                        [&_tbody_tr]:border-t [&_tbody_tr]:border-gray-100
                        [&_tbody_tr:hover]:bg-gray-50/60
                        [&_th]:text-xs [&_th]:font-semibold [&_th]:text-gray-500
                        [&_th]:uppercase [&_th]:tracking-wide
                        [&_th]:py-3 [&_th]:px-4
                        [&_td]:py-3.5 [&_td]:px-4"
        >
          <TableComponent columns={tableColumns} data={filteredData} />
        </div>

        <div className="h-px bg-gray-100" />
        <div className="px-6 py-3 flex items-center justify-between">
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

      {/* ── Add Expense Modals ─────────────────────────────────────────────────── */}
      <AddSuperExpense
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        expenseType={activeTab}
      />
      <AddServer_emp_other_superExpense
        isOpen={isServerEmpOtherModalOpen}
        onClose={() => setIsServerEmpOtherModalOpen(false)}
        expenseType={activeTab}
      />

      {/* ── User Expense Drawer ────────────────────────────────────────────────── */}
      <UserExpenseDrawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        user={selectedUser}
      />
    </div>
  );
};

export default AllExpense;
