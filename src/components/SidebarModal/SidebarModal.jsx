import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WhatsAppIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    className="w-5 h-5 fill-current"
  >
    <path d="M20.52 3.48A11.92 11.92 0 0 0 12.04 0C5.44.03.16 5.32.16 11.93c0 2.1.55 4.14 1.6 5.95L0 24l6.29-1.73a11.9 11.9 0 0 0 5.75 1.48h.01c6.59 0 11.86-5.28 11.89-11.88a11.87 11.87 0 0 0-3.42-8.39ZM12.05 21.2h-.01a9.27 9.27 0 0 1-4.73-1.29l-.34-.2-3.73 1.03 1-3.64-.22-.37A9.25 9.25 0 0 1 2.78 11.9c0-5.11 4.16-9.28 9.29-9.3 2.48 0 4.81.97 6.56 2.72a9.26 9.26 0 0 1 2.72 6.56c-.02 5.12-4.18 9.3-9.3 9.31Zm5.32-6.93c-.29-.15-1.7-.84-1.96-.94-.26-.09-.45-.15-.65.15-.2.29-.74.94-.91 1.13-.17.19-.34.21-.63.08-.29-.14-1.2-.44-2.29-1.41-.85-.76-1.43-1.7-1.6-1.98-.17-.29-.02-.45.13-.6.13-.13.29-.34.43-.51.14-.17.19-.29.29-.48.09-.19.05-.36-.02-.51-.07-.15-.65-1.57-.89-2.15-.24-.58-.48-.5-.65-.5l-.56-.01c-.19 0-.5.07-.76.36-.26.29-.99.97-.99 2.36s1.02 2.74 1.16 2.93c.14.19 2 3.06 4.85 4.29.68.29 1.21.46 1.62.59.68.22 1.3.19 1.79.11.55-.08 1.7-.7 1.94-1.37.24-.68.24-1.25.17-1.37-.07-.12-.26-.19-.55-.34Z" />
  </svg>
);

const FieldLabel = ({ children }) => (
  <div className="text-[12px] text-gray-600 leading-none mb-1">{children}</div>
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

export default function AgencyOrderModal({ open, onClose }) {
  const [tab, setTab] = useState("Dinner");
  const [isOutside, setIsOutside] = useState(false);
  const [startAt, setStartAt] = useState("2025-10-02T16:00");
  const [endAt, setEndAt] = useState("2025-09-29T23:00");
  const [rowCount, setRowCount] = useState(4);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

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

          {/* Drawer in a padded track so gaps are visible */}
          <div className="absolute inset-0 pointer-events-none">
            {/* control the gaps here: top/right/bottom = 24px */}
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-6 w-[950px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
                <div className="text-[18px] font-semibold text-gray-800">
                  Agency Order
                </div>
                <button
                  className="h-9 px-3 text-sm rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
                  onClick={onClose}
                  autoFocus
                >
                  Close
                </button>
              </div>

              <div className="p-6 overflow-y-auto h-[calc(100%-64px)]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    {["Dinner", "Lunch", "Hi Tea"].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTab(t)}
                        className={`h-9 px-4 rounded-md text-sm font-medium ${tab === t ? "bg-blue-600 text-white shadow" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-[12px] text-gray-600">
                      Date and Time No.
                    </div>
                    <BaseInput
                      type="datetime-local"
                      value={startAt}
                      onChange={(e) => setStartAt(e.target.value)}
                      className="w-[210px]"
                    />
                    <BaseInput
                      type="datetime-local"
                      value={endAt}
                      onChange={(e) => setEndAt(e.target.value)}
                      className="w-[210px]"
                    />
                    <button
                      onClick={() => setIsOutside((v) => !v)}
                      className={`h-9 px-4 rounded-md text-sm font-medium ${isOutside ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}
                    >
                      Outside
                    </button>
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="grid grid-cols-[56px_1.2fr_1fr_1fr_1.2fr_100px_80px] items-center px-4 py-3 bg-gray-50 text-[12px] font-medium text-gray-700">
                    <div>No.</div>
                    <div>Contact Name</div>
                    <div>Price</div>
                    <div>Quantity</div>
                    <div>Total Price</div>
                    <div className="text-center">Action</div>
                    <div />
                  </div>

                  {Array.from({ length: rowCount }).map((_, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-[56px_1.2fr_1fr_1fr_1.2fr_100px_80px] items-center gap-3 px-4 py-3 border-t border-gray-100"
                    >
                      <div className="text-[13px] text-gray-700">
                        {idx + 1}.
                      </div>
                      <div>
                        <FieldLabel>Contact Name</FieldLabel>
                        <BaseSelect defaultValue="">
                          <option value="">Input Text</option>
                          <option>Ajay</option>
                          <option>Neha</option>
                          <option>Ravi</option>
                        </BaseSelect>
                        <div className="text-[10px] text-gray-400 mt-1">
                          Help Text
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Price</FieldLabel>
                        <BaseInput type="number" placeholder="Input Number" />
                      </div>
                      <div className="grid grid-cols-[1fr_88px] gap-2">
                        <div>
                          <FieldLabel>Quantity</FieldLabel>
                          <BaseInput type="number" placeholder="Input Number" />
                        </div>
                        <div>
                          <FieldLabel>Unit</FieldLabel>
                          <BaseSelect defaultValue="Nos">
                            {["Nos", "Kg", "Ltr", "Pack"].map((u) => (
                              <option key={u}>{u}</option>
                            ))}
                          </BaseSelect>
                        </div>
                      </div>
                      <div>
                        <FieldLabel>Total Price</FieldLabel>
                        <BaseInput placeholder="Input Number" />
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
                      <div className="flex items-center justify-end">
                        {idx === rowCount - 1 && (
                          <button
                            onClick={() => setRowCount((c) => c + 1)}
                            className="inline-flex items-center gap-2 h-9 px-3 rounded-md bg-blue-50 text-blue-700 text-sm font-medium border border-blue-200 hover:bg-blue-100"
                          >
                            <span className="text-base leading-none">+</span>
                            Add
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
