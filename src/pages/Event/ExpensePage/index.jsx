import React, { useState } from "react";
import { Plus, Search } from "lucide-react";
import DashboardCards from "./component/DashboardCards";
import ExpenseTabs from "./component/ExpenseTabs";
import ExpenseTable from "./component/ExpenseTable";
import { dashboardData, expensesData } from "./component/data";
import AddNewManagerModal from "@/partials/modals/add-manager/AddNewManagerModal";
import AddSupplierCustomerModal from "@/partials/modals/add-supplier-customer-modal/AddSupplierCustomerModal";
import AddExpenseModal from "../../../partials/modals/add-Expense-Modal/AddExpenseModal";
export default function ExpenseDetails() {
  const [activeTab, setActiveTab] = useState("manager");
  const [searchQuery, setSearchQuery] = useState("");
  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [contactType, setContactType] = useState("Supplier");
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState(""); // to know which manager clicked

  const [openManagerModal, setOpenManagerModal] = useState(false);

  const getTitle = () => {
    return `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Expense Usage Details`;
  };

  const getAddButtonText = () => {
    return `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;
  };

  return (
    <div className="min-h-screen  p-8">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-8">{getTitle()}</h1>

        {/* Dashboard Cards */}
        <div className="bg-gray-100 rounded-lg bg-gray-50 shadow-lg p-6 mb-8">
          <DashboardCards
            activeTab={activeTab}
            data={dashboardData[activeTab]}
          />
        </div>

        {/* Table Section */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          {/* Search & Tabs */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">
              Recent Expense Reports
            </h2>

            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search..."
                className="pl-10 pr-4 py-2 border rounded-lg w-64"
              />
            </div>
          </div>

          {/* Tabs */}
          <ExpenseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Table */}
          <ExpenseTable
            activeTab={activeTab}
            data={expensesData[activeTab]}
            onAddExpense={(managerName) => {
              setSelectedManager(managerName);
              setOpenExpenseModal(true);
            }}
          />
        </div>

        <button
          onClick={() => {
            if (activeTab === "manager") {
              setOpenManagerModal(true);
            } else if (activeTab === "supplier") {
              setContactType("Supplier");
              setOpenSupplierModal(true);
            } else if (activeTab === "customer") {
              setContactType("Customer");
              setOpenSupplierModal(true);
            }
          }}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-3xl flex items-center gap-2 shadow-lg"
        >
          <Plus className="w-5 h-5" />
          {getAddButtonText()}
        </button>

        {/* Add Manager Modal */}
        <AddNewManagerModal
          open={openManagerModal}
          onClose={() => setOpenManagerModal(false)}
        />
        <AddSupplierCustomerModal
          open={openSupplierModal}
          type={contactType}
          onClose={() => setOpenSupplierModal(false)}
        />

        <AddExpenseModal
          open={openExpenseModal}
          onClose={() => setOpenExpenseModal(false)}
          managerName={selectedManager}
        />
      </div>
    </div>
  );
}
