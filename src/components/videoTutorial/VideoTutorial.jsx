import { motion, AnimatePresence } from "framer-motion";
import { toAbsoluteUrl } from "@/utils/Assets";
import { ChevronDown, Play } from "lucide-react";

export default function SidebarModal({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100]">
          <motion.div
            className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto absolute top-6 bottom-6 right-12 w-[1300px] max-w-[95vw] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 260, damping: 26 }}
            >
              <div className="w-[320px] bg-[#F7F9FC] border-r px-6 py-8 relative overflow-y-auto no-scrollbar ">
                {/* Header */}
                <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-primary">
                  Just Catering X Tutorial
                  <img
                    src={toAbsoluteUrl("/media/images/cap2.png")}
                    className="w-5 h-5"
                  />
                </h2>

                {/* Accordion */}
                <div className="space-y-4">
                  {/* Item 1 */}
                  <Accordion title="How to create event?" defaultOpen />

                  {/* Item 2 with submenu */}
                  <Accordion title="How to prepare menu or menu planning?">
                    <div className="mt-3 ml-2 space-y-2">
                      <SubItem index="1" title="Create Menu" />
                      <SubItem index="2" title="Custom Menu" />
                    </div>
                  </Accordion>

                  <Accordion title="How to generate invoice?" />
                  <Accordion title="How to make quotation?" />
                </div>

                {/* Footer */}
                <button className="absolute bottom-6 left-6 text-gray-500 text-sm hover:text-black transition">
                  Support Center
                </button>
              </div>

              {/* Main content */}
              <div className="flex-1 px-10 py-10 overflow-y-auto">
                {/* Welcome Section */}
                <div className="flex flex-col items-center mt-8 mb-10">
                  <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                    <img
                      src={toAbsoluteUrl(`/media/images/jccap.png`)}
                      alt="JC Tutorial"
                      className="w-18 h-18"
                    />
                  </div>
                  <h1 className="text-3xl font-semibold mt-4 text-black">
                    Welcome!
                  </h1>
                  <p className="text-[#646464] text-lg mt-1">
                    What can we help you with?
                  </p>
                </div>

                {/* Video Cards Grid */}
                <div className="grid grid-cols-2 gap-6">
                  {[
                    "How to create event?",
                    "How to generate invoice?",
                    "How to make quotation?",
                    "How to generate menu report?",
                  ].map((title, i) => (
                    <div
                      key={i}
                      className="p-6 border rounded-2xl shadow-md hover:shadow-lg transition cursor-pointer flex flex-col items-center"
                    >
                      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                        ▶
                      </div>
                      <p className="text-gray-700 font-medium text-center">
                        {title}
                      </p>
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
function Accordion({ title, children, defaultOpen = false }) {
  return (
    <details
      className="group bg-white rounded-xl p-4 shadow-sm border border-gray-200"
      open={defaultOpen}
    >
      <summary className="flex items-center justify-between cursor-pointer text-gray-700 font-medium">
        {title}
        <ChevronDown className="w-4 h-4 transition group-open:rotate-180" />
      </summary>

      {children}
    </details>
  );
}

function SubItem({ index, title }) {
  return (
    <div className="flex items-center justify-between bg-[#F3F6FA] px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-50 transition">
      <span className="text-sm text-gray-700">
        {index}. {title}
      </span>
      <Play className="w-4 h-4 text-gray-600" />
    </div>
  );
}
