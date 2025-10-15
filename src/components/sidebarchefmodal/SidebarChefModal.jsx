import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetMenuAllocation, ContactNameItem } from "@/services/apiServices";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 fill-current"
  >
    <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
  </svg>
);

const BaseInput = (props) => (
  <input
    {...props}
    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
  />
);

const BaseSelect = (props) => (
  <select
    {...props}
    className="h-9 w-full rounded-md border border-gray-300 bg-white px-2 text-[13px] text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500"
  >
    {props.children}
  </select>
);

export default function SidebarChefModal({
  open,
  onClose,
  eventId,
  eventFunctionId,
  row,
  functionName,
  functionDateTime,
}) {
  const [menuAllocations, setMenuAllocations] = useState([]);
  const [contactNames, setContactNames] = useState([]);
  const [loading, setLoading] = useState(false);
  const [extraRows, setExtraRows] = useState([]);

  useEffect(() => {
    const FetchDetails = async () => {
      try {
        setLoading(true);
        const menudata = await GetMenuAllocation(eventId, eventFunctionId);
        const raw =
          menudata?.data?.data["Menu Allocation Details"][0]?.menuAllocation ||
          [];
        setMenuAllocations(raw);
      } catch (error) {
        console.error("Error fetching event details:", error);
      } finally {
        setLoading(false);
      }
    };

    const FetchContactName = async () => {
      try {
        let userData = JSON.parse(localStorage.getItem("userData"));
        let Id = userData.id;
        const res = await ContactNameItem(Id, (name = "CHEF LABOUR"));
        if (res?.data?.data) {
          setContactNames(res.data.data["Party Details"]);
        }
      } catch (error) {
        console.error("Error fetching contact name:", error);
      }
    };

    if (eventId && eventFunctionId && open) {
      FetchDetails();
      FetchContactName();
    }
  }, [eventId, eventFunctionId, open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handleAddRow = () => {
    setExtraRows([
      ...extraRows,
      {
        id: Date.now(),
        partyId: "",
        serviceType: "",
        counterQuantity: "",
        helperQuantity: "",
        counterPrice: "",
        helperPrice: "",
        totalPrice: "",
      },
    ]);
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Drawer */}
          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[1200px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  Agency Order - {row?.itemName}
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                  autoFocus
                >
                  Close
                </button>
              </div>

              <div className="p-4">
                {/* Top Buttons */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 mt-6">
                      <button className="btn btn-sm btn-primary w-[100px] flex justify-center">
                        {functionName}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex flex-col gap-1">
                        <div className="text-[12px] text-gray-600">
                          Date and Time No.
                        </div>
                        <div className="flex gap-3">
                          <input
                            className="input"
                            type="text"
                            value={functionDateTime}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-6">
                      <button className="btn btn-sm btn-primary w-[100px] flex justify-center">
                        Chef Labour
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-6">
                    <button
                      className="btn btn-sm btn-primary w-[100px] flex justify-center"
                      onClick={handleAddRow}
                    >
                      Add
                    </button>
                  </div>
                </div>

                {/* Table */}
                <div className="mt-3 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  {/* Header */}
                  <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_88px] items-center px-4 py-3 bg-[#F9FAFC] text-[14px] font-medium text-black">
                    <div>No.</div>
                    <div className="ml-2">Contact Name</div>
                    <div>Type</div>
                    <div>Quantity</div>
                    <div>Price</div>
                    <div>Total Price</div>
                    <div className="text-center">Action</div>
                  </div>

                  {/* Rows */}
                  {loading ? (
                    <div className="flex justify-center items-center h-32 text-gray-500 text-sm">
                      Loading data...
                    </div>
                  ) : (
                    (() => {
                      // Filter to get only the specific row that was clicked
                      const currentItem = menuAllocations.find(
                        (m) =>
                          m.menuItemId === row?.menuItemId &&
                          m.menuCategoryId === row?.menuCategoryId &&
                          m.chefLabour === true
                      );

                      // If chefLabour is true but no allocations exist yet, show empty row
                      if (
                        !currentItem ||
                        !currentItem.eventFunctionMenuAllocations ||
                        currentItem.eventFunctionMenuAllocations.length === 0
                      ) {
                        return (
                          <div className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_88px] items-start gap-3 px-4 py-3 border-t border-gray-100">
                            <div className="text-[13px] text-gray-700">1.</div>
                            <div>
                              <BaseSelect defaultValue="">
                                <option value="">Select Name</option>
                                {contactNames.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nameEnglish}
                                  </option>
                                ))}
                              </BaseSelect>
                            </div>
                            <div>
                              <BaseSelect defaultValue="">
                                <option value="">Select Options</option>
                                <option>Counter Wise</option>
                                <option>Day Wise</option>
                                <option>Plate Wise</option>
                              </BaseSelect>
                            </div>
                            <div className="flex gap-2">
                              <BaseInput type="number" placeholder="Counter" />
                              <BaseInput type="number" placeholder="Helper" />
                            </div>
                            <div className="flex gap-2">
                              <BaseInput
                                type="number"
                                placeholder="Counter Price"
                              />
                              <BaseInput
                                type="number"
                                placeholder="Helper Price"
                              />
                            </div>
                            <div>
                              <BaseInput type="number" placeholder="Total" />
                            </div>
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                                title="Share on WhatsApp"
                              >
                                <WhatsAppIcon />
                              </button>
                            </div>
                          </div>
                        );
                      }

                      // Show existing allocations for this specific item
                      return currentItem.eventFunctionMenuAllocations.map(
                        (alloc, idx) => (
                          <div
                            key={`${currentItem.id}-${idx}`}
                            className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_88px] items-start gap-3 px-4 py-3 border-t border-gray-100"
                          >
                            <div className="text-[13px] text-gray-700">
                              {idx + 1}.
                            </div>
                            <div>
                              <BaseSelect value={alloc.partyId || ""}>
                                <option value="">Select Name</option>
                                {contactNames.map((c) => (
                                  <option key={c.id} value={c.id}>
                                    {c.nameEnglish}
                                  </option>
                                ))}
                              </BaseSelect>
                            </div>
                            <div>
                              <BaseSelect value={alloc.serviceType || ""}>
                                <option value="">Select Options</option>
                                <option>Counter Wise</option>
                                <option>Day Wise</option>
                                <option>Plate Wise</option>
                              </BaseSelect>
                            </div>
                            <div className="flex gap-2">
                              <BaseInput
                                type="number"
                                placeholder="Counter"
                                value={alloc.counterQuantity || ""}
                              />
                              <BaseInput
                                type="number"
                                placeholder="Helper"
                                value={alloc.helperQuantity || ""}
                              />
                            </div>
                            <div className="flex gap-2">
                              <BaseInput
                                type="number"
                                placeholder="Counter"
                                value={alloc.counterPrice || ""}
                              />
                              <BaseInput
                                type="number"
                                placeholder="Helper"
                                value={alloc.helperPrice || ""}
                              />
                            </div>
                            <div>
                              <BaseInput
                                type="number"
                                placeholder="Total"
                                value={alloc.totalPrice || ""}
                              />
                            </div>
                            <div className="flex items-center justify-center">
                              <button
                                type="button"
                                className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                                title="Share on WhatsApp"
                              >
                                <WhatsAppIcon />
                              </button>
                            </div>
                          </div>
                        )
                      );
                    })()
                  )}

                  {/* Extra rows added by user */}
                  {extraRows.map((extraRow, idx) => (
                    <div
                      key={extraRow.id}
                      className="grid grid-cols-[64px_1fr_1fr_1fr_1fr_1fr_88px] items-start gap-3 px-4 py-3 border-t border-gray-100"
                    >
                      <div className="text-[13px] text-gray-700">
                        {(menuAllocations.find(
                          (m) =>
                            m.menuItemId === row?.menuItemId &&
                            m.menuCategoryId === row?.menuCategoryId
                        )?.eventFunctionMenuAllocations?.length || 0) +
                          idx +
                          1}
                        .
                      </div>
                      <div>
                        <BaseSelect defaultValue="">
                          <option value="">Select Name</option>
                          {contactNames.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nameEnglish}
                            </option>
                          ))}
                        </BaseSelect>
                      </div>
                      <div>
                        <BaseSelect defaultValue="">
                          <option value="">Select Options</option>
                          <option>Counter Wise</option>
                          <option>Day Wise</option>
                          <option>Plate Wise</option>
                        </BaseSelect>
                      </div>
                      <div className="flex gap-2">
                        <BaseInput type="number" placeholder="Counter" />
                        <BaseInput type="number" placeholder="Helper" />
                      </div>
                      <div className="flex gap-2">
                        <BaseInput type="number" placeholder="Counter Price" />
                        <BaseInput type="number" placeholder="Helper Price" />
                      </div>
                      <div>
                        <BaseInput type="number" placeholder="Total" />
                      </div>
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-[#20c964] text-white shadow hover:brightness-95"
                          title="Share on WhatsApp"
                        >
                          <WhatsAppIcon />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-2 mt-3">
                  <button className="h-9 px-4 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50">
                    Cancel
                  </button>
                  <button className="btn btn-sm btn-primary w-[100px] flex justify-center">
                    Save
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
