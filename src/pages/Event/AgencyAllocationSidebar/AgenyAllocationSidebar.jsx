import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import ChefLabourSection from "./sections/ChefLabourSection";
import OutsideAgencySection from "./sections/OutsideAgencySection";
import InHouseCookSection from "./sections/InHouseCookSection";
import { MenuAllocationTypeSummary } from "@/services/apiServices";

export default function AgencyAllocationSidebar({
  open,
  onClose,
  eventId,
  eventFunctionId,
}) {
  const [tab, setTab] = useState("chef");
  const [loading, setLoading] = useState(false);
  const [allocationData, setAllocationData] = useState(null);
  const [eventdata, setEventdata] = useState(null);
  const fetchAllocationData = useCallback(async () => {
    if (!open || !eventId || !eventFunctionId) return;

    try {
      setLoading(true);

      const data = await MenuAllocationTypeSummary(
        eventFunctionId,
        eventId,
        tab
      );

      setEventdata(data.data.data["Menu Allocation Details"].eventFunction);
      setAllocationData(data.data.data["Menu Allocation Details"]);
    } catch (error) {
      console.error("Error fetching menu allocation data:", error);
    } finally {
      setLoading(false);
    }
  }, [open, eventId, eventFunctionId, tab]);

  useEffect(() => {
    fetchAllocationData();
  }, [fetchAllocationData]);

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
          />

          {/* Sidebar */}
          <motion.div
            className="absolute top-6 bottom-6 right-6 w-[1300px] max-w-[95vw] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            initial={{ x: "110%" }}
            animate={{ x: 0 }}
            exit={{ x: "110%" }}
          >
            {/* Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b">
              <h2 className="text-lg font-semibold">Agency Allocation</h2>
              <button onClick={onClose} className="btn btn-danger">
                Close
              </button>
            </div>

            {/* Info */}
            <div className="flex gap-20 px-6 py-4 border-b">
              <div>
                <p className="text-gray-500">Function</p>
                <p className="font-semibold">
                  {eventdata?.function?.nameEnglish}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Date & Time</p>
                <p className="font-semibold">
                  {eventdata?.functionStartDateTime}
                </p>
              </div>
            </div>

            <div className="flex gap-3 px-6 py-4 border-b">
              {[
                ["chef", "Chef Labour"],
                ["outside", "Outside Agency"],
                ["inside", "In-House Cook"],
              ].map(([id, label]) => (
                <button
                  key={id}
                  onClick={() => setTab(id)}
                  className={`px-4 py-2 rounded-md text-sm ${
                    tab === id
                      ? "bg-primary text-white"
                      : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-auto">
              {loading && (
                <div className="p-6 text-center text-gray-500">Loading...</div>
              )}

              {!loading && tab === "chef" && (
                <ChefLabourSection data={allocationData} />
              )}

              {!loading && tab === "outside" && (
                <OutsideAgencySection data={allocationData} />
              )}

              {!loading && tab === "inside" && (
                <InHouseCookSection data={allocationData} />
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4 border-t">
              <button className="btn btn-danger" onClick={onClose}>
                Cancel
              </button>
              <button className="btn btn-primary">Save</button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
