import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Plus, Search } from "lucide-react";
import DashboardCards from "./component/DashboardCards";
import ExpenseTabs from "./component/ExpenseTabs";
import ExpenseTable from "./component/ExpenseTable";
import AddNewManagerModal from "@/partials/modals/add-manager/AddNewManagerModal";
import AddSupplierCustomerModal from "@/partials/modals/add-supplier-customer-modal/AddSupplierCustomerModal";
import AddExpenseModal from "../../../partials/modals/add-Expense-Modal/AddExpenseModal";
import ViewExpenseDetailsModal from "@/partials/modals/view-expense-modal/ViewExpenseDetailsModal";
import Swal from "sweetalert2";

import {
  GETExpenseBYUserType,
  GetEventMasterById,
  DeleteByExpenseID,
} from "@/services/apiServices";

export default function ExpenseDetails() {
  const { eventId } = useParams();

  const [activeTab, setActiveTab] = useState("manager");
  const [searchQuery, setSearchQuery] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [eventDataLoading, setEventDataLoading] = useState(false);
  const [error, setError] = useState(null);

  const [openSupplierModal, setOpenSupplierModal] = useState(false);
  const [contactType, setContactType] = useState("Supplier");
  const [openExpenseModal, setOpenExpenseModal] = useState(false);
  const [selectedManager, setSelectedManager] = useState("");

  const [viewOpen, setViewOpen] = useState(false);
  const [viewData, setViewData] = useState(null);

  const [openManagerModal, setOpenManagerModal] = useState(false);
  const [eventData, setEventData] = useState(null);

  const userId = localStorage.getItem("userId");

  const [cards, setCards] = useState([]);

  const [totals, setTotals] = useState({
    totalGiven: 0,
    totalUsed: 0,
    remaining: 0,
  });

  useEffect(() => {
    const fetchEventData = async () => {
      if (!eventId) {
        console.log("No eventId provided");
        return;
      }

      setEventDataLoading(true);
      setError(null);

      try {
        console.log("Fetching event data for eventId:", eventId);

        const response = await GetEventMasterById(eventId);
        let data = response?.data?.data || response?.data || response;
        // Extract data from response - adjust based on your API structure
        if (data["Event Details"]?.length) {
          data = data["Event Details"][0]; // pick the first object
        }
        console.log("Event data fetched:", data);

        setEventData(data);
      } catch (err) {
        console.error("Error fetching event data:", err);
        setError(err?.message || "Failed to load event data");
      } finally {
        setEventDataLoading(false);
      }
    };

    fetchEventData();
  }, [eventId]);

  useEffect(() => {
    setTotals({
      totalGiven: 0,
      totalUsed: 0,
      remaining: 0,
    });

    // Reset table also (optional but recommended)
    setExpenses([]);
    console.log("CARD TOTALS:", totals, "TAB:", activeTab);
  }, [activeTab]);

  useEffect(() => {
    if (!eventId || !userId) {
      return;
    }

    const fetchExpenses = async () => {
      setLoading(true);
      const userType = activeTab.toUpperCase();

      try {
        const res = await GETExpenseBYUserType({
          eventId,

          userId,
          userType,
        });

        const apiData = res?.data?.data || {};
        const list = apiData.data || [];

        const normalized = list.map((e) => ({
          id: e.expenseId,
          name: e.partyNameEnglish || "-",
          role: e.roleName || "-",
          mobile: e.mobileNo || "-",
          date: e.date,
          amount: e.amount,
          paymentType: e.paymentType === "cash" ? "Cash" : "Online",
          initials: (e.partyNameEnglish || "U")[0],
          bgColor: "bg-blue-100",
          textColor: "text-blue-700",
        }));

        setExpenses(normalized);

        if (activeTab === "manager") {
          setTotals({
            totalGiven: Number(apiData.total_given_amount) || 0,
            totalUsed:
              activeTab === "manager"
                ? Number(apiData.total_used_amount) || 0
                : 0,
            remaining:
              activeTab === "manager"
                ? Number(apiData.remaining_amount) || 0
                : 0,
          });
        } else {
          // Customer or Supplier — only totalGiven
          setTotals({
            totalGiven: Number(apiData.total_given_amount) || 0,
            totalUsed: 0,
            remaining: 0,
          });
        }
      } catch (err) {
        console.error(err);
        setExpenses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExpenses();
  }, [activeTab, eventId, userId]);

  const handleView = (expense) => {
    setViewData({
      eventId,
      eventNo: eventData?.eventNo,
      manager: expense.name,
      role: expense.role,
      contact: expense.mobile,
      totalAmount: expense.amount,
      paymentMethod: expense.paymentType,
      items: expense.items ?? [],
    });
    setViewOpen(true);
  };

  const getTitle = () => {
    if (eventData) {
      return `${eventData.eventNo} - ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Expense Details`;
    }
    return `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Expense Usage Details`;
  };

  const getAddButtonText = () =>
    `Add ${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`;

  const handleModalClose = (newExpense) => {
    setOpenManagerModal(false);
    setOpenSupplierModal(false);
    setOpenExpenseModal(false);

    if (newExpense) {
      console.log("New expense received from modal:", newExpense);

      setExpenses((prev) => [newExpense, ...prev]);

      // Update partyId after BE saves it
      if (newExpense?.partyId) {
        setPartyId(newExpense.partyId); // ✅ store it here
      }

      // Optionally update eventData for UI
      setEventData((prev) => ({
        ...prev,
        party: {
          id: newExpense.partyId,
          nameEnglish: newExpense.partyNameEnglish,
        },
      }));
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (!expenseId) return;

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await DeleteByExpenseID(expenseId); // call API
        // Remove from local state to immediately update UI
        setExpenses((prev) => prev.filter((e) => e.id !== expenseId));

        Swal.fire({
          title: "Deleted!",
          text: "Expense has been deleted.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });
      } catch (err) {
        console.error("Failed to delete expense:", err);
        Swal.fire({
          title: "Error!",
          text: "Failed to delete expense. Please try again.",
          icon: "error",
        });
      }
    }
  };

  if (eventDataLoading) {
    return (
      <div className="min-h-screen p-8 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading event data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Error Banner */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <svg
              className="w-6 h-6 text-yellow-600 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
            <div>
              <p className="font-semibold text-yellow-900">
                Unable to load event data
              </p>
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        )}

        <h1 className="text-2xl font-bold text-gray-900 mb-8">{getTitle()}</h1>

        {/* Event Info Card */}
        {eventData && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Event No</p>
                <p className="font-semibold text-gray-900">
                  {eventData.eventNo}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Event Type</p>
                <p className="font-semibold text-gray-900">
                  {eventData.eventType?.nameEnglish}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Venue</p>
                <p className="font-semibold text-gray-900">
                  {eventData.venue?.nameEnglish}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Party</p>
                <p className="font-semibold text-gray-900">
                  {eventData.party?.nameEnglish}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Dashboard Cards */}
        <div className="bg-gray-100 rounded-lg shadow-lg p-6 mb-8">
          <DashboardCards activeTab={activeTab} totals={totals} />
        </div>

        {/* Expense Table */}
        <div className="bg-white rounded-lg shadow-lg p-6">
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

          <ExpenseTabs activeTab={activeTab} setActiveTab={setActiveTab} />

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <ExpenseTable
              activeTab={activeTab}
              data={expenses}
              onAddExpense={(managerName) => {
                setSelectedManager(managerName);
                setOpenExpenseModal(true);
              }}
              onView={handleView}
              onDelete={handleDeleteExpense}
            />
          )}
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            if (activeTab === "manager") setOpenManagerModal(true);
            else if (activeTab === "supplier") {
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

        {/* Modals */}
        <AddNewManagerModal
          open={openManagerModal}
          onClose={handleModalClose}
          eventId={eventId}
          eventData={eventData}
        />
        <AddSupplierCustomerModal
          open={openSupplierModal}
          type={contactType}
          onClose={handleModalClose}
          eventId={eventId}
          eventData={eventData}
        />
        <AddExpenseModal
          open={openExpenseModal}
          onClose={handleModalClose}
          managerName={selectedManager}
          eventId={eventId}
          eventData={eventData}
        />
        <ViewExpenseDetailsModal
          open={viewOpen}
          onClose={() => setViewOpen(false)}
          data={viewData}
        />
      </div>
    </div>
  );
}
