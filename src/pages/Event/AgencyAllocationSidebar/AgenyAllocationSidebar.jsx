import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback, useMemo } from "react";
import ChefLabourSection from "./sections/ChefLabourSection";
import OutsideAgencySection from "./sections/OutsideAgencySection";
import InHouseCookSection from "./sections/InHouseCookSection";
import AddContactName from "../../master/MenuItemMaster/components/AddContactName";
import { Plus } from "lucide-react";

import { GetAllItemByType } from "@/services/apiServices";

// Tab configuration
const TABS = [
  { id: "chef", label: "Chef Labour" },
  { id: "outside", label: "Outsource Agency" },
  { id: "inside", label: "Inside Kitchen" },
];

export default function AgencyAllocationSidebar({
  open,
  onClose,
  eventId,
  eventFunctionId,
}) {
  const [tab, setTab] = useState("chef");
  const [loading, setLoading] = useState(false);
  const [allocationData, setAllocationData] = useState(null);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [concatId, setConcatId] = useState(null);
  const [contactTypeId, setContactTypeId] = useState(null);

  // ✅ Extract event function data from first allocation
  const eventFunctionData = useMemo(() => {
    if (!allocationData?.[0]?.eventFunction) return null;

    const {
      function: func,
      functionStartDateTime,
      functionEndDateTime,
    } = allocationData[0].eventFunction;

    return {
      eventFunctionName: func?.nameEnglish || "-",
      functionStartDateTime: functionStartDateTime || "-",
      functionEndDateTime: functionEndDateTime || "-",
      pax: allocationData[0].eventFunction.pax,
    };
  }, [allocationData]);

  // ✅ Optimized API call with better error handling
  const fetchAllocationData = useCallback(
    async (selectedTab) => {
      if (!eventId || !eventFunctionId) {
        console.warn("⏳ Missing required IDs:", { eventId, eventFunctionId });
        return;
      }

      try {
        setLoading(true);
        console.log("🚀 Fetching data:", {
          eventId,
          eventFunctionId,
          tab: selectedTab,
        });

        const res = await GetAllItemByType(
          eventFunctionId,
          eventId,
          selectedTab
        );

        const details = res?.data?.data?.["Menu Allocation Details"];

        if (!details || details.length === 0) {
          console.warn("⚠️ No allocation data found");
          setAllocationData(null);
          return;
        }

        setAllocationData(details);
        console.log("✅ Data loaded:", details.length, "items");
      } catch (error) {
        console.error("❌ API Error:", error?.message || error);
        setAllocationData(null);
      } finally {
        setLoading(false);
      }
    },
    [eventId, eventFunctionId]
  );

  // ✅ Reset and fetch on modal open
  useEffect(() => {
    if (open) {
      setTab("chef");
      setAllocationData(null);
      fetchAllocationData("chef");
    }
  }, [open, fetchAllocationData]);

  // ✅ Handle tab change with optimistic update
  const handleTabClick = useCallback(
    (selectedTab) => {
      if (selectedTab === tab) return;

      setTab(selectedTab);
      fetchAllocationData(selectedTab);
    },
    [tab, fetchAllocationData]
  );

  // ✅ Memoized section component renderer
  const renderSection = useMemo(() => {
    if (loading) {
      return (
        <div className="flex items-center justify-center p-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-2"></div>
            <p className="text-gray-500">Loading allocation data...</p>
          </div>
        </div>
      );
    }

    if (!allocationData) {
      return (
        <div className="flex items-center justify-center p-12">
          <p className="text-gray-500">No data available</p>
        </div>
      );
    }

    switch (tab) {
      case "chef":
        return <ChefLabourSection data={allocationData} close={onClose} />;
      case "outside":
        return <OutsideAgencySection data={allocationData} close={onClose} />;
      case "inside":
        return <InHouseCookSection data={allocationData} close={onClose} />;
      default:
        return null;
    }
  }, [tab, loading, allocationData]);

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Overlay */}
          <motion.div
            className="absolute inset-0 bg-black/50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          />

          {/* Sidebar */}
          <motion.div
            className="absolute top-6 bottom-6 right-6 w-[1300px] max-w-[95vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800">
                Agency Allocation
              </h2>
              <button
                onClick={onClose}
                className="btn btn-danger"
                aria-label="Close sidebar"
              >
                Close
              </button>
            </div>

            {/* Event Info */}
            <div className="flex items-center justify-between px-6 py-4 border-b bg-white">
              <div className="flex gap-20">
                <div>
                  <p className="text-sm text-gray-500">Function</p>
                  <p className="font-semibold text-gray-900">
                    {eventFunctionData?.eventFunctionName || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Date & Time</p>
                  <p className="font-semibold text-gray-900">
                    {eventFunctionData?.functionStartDateTime || "-"}
                  </p>
                </div>

                {eventFunctionData?.pax && (
                  <div>
                    <p className="text-sm text-gray-500">PAX</p>
                    <p className="font-semibold text-gray-900">
                      {eventFunctionData.pax}
                    </p>
                  </div>
                )}
              </div>

              {eventFunctionData?.pax && (
                <button
                  onClick={() => {
                    let typeId = null;

                    if (tab === "chef") typeId = 5;
                    if (tab === "outside") typeId = 6;
                    if (tab === "inside") typeId = 7;

                    setConcatId(typeId);
                    setContactTypeId(typeId);
                    setIsMemberModalOpen(true);
                  }}
                  className="flex items-center gap-1 p-2 rounded-lg bg-[#005BA8] text-md text-white font-semibold "
                >
                  <span>Add Vendor</span>
                  <Plus className="w-5 h-5  text-white rounded-full" />
                </button>
              )}
            </div>

            {/* Tabs */}
            <div className="flex gap-3 px-6 py-4 border-b bg-gray-50">
              {TABS.map(({ id, label }) => (
                <button
                  key={id}
                  onClick={() => handleTabClick(id)}
                  disabled={loading}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    tab === id
                      ? "bg-primary text-white shadow-sm"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  } ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                  aria-selected={tab === id}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-auto bg-gray-50">
              {renderSection}
            </div>
          </motion.div>
        </div>
      )}
      <AddContactName
        isModalOpen={isMemberModalOpen}
        setIsModalOpen={setIsMemberModalOpen}
        concatId={concatId}
        contactTypeId={contactTypeId}
        refreshData={() => fetchAllocationData(tab)}
      />
    </AnimatePresence>
  );
}
