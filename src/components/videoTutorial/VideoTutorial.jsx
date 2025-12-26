import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Play, X } from "lucide-react";

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
              <div className="relative flex w-full">
                {/* Blurred Content */}
                <div
                  className="w-full flex"
                  style={{
                    filter: "blur(3px)",
                    WebkitFilter: "blur(3px)",
                  }}
                >
                  {/* Sidebar */}
                  <div className="w-[320px] bg-[#F7F9FC] border-r px-6 py-8 relative overflow-y-auto no-scrollbar">
                    <h2 className="text-xl font-semibold flex items-center gap-2 mb-6 text-blue-600">
                      Just Catering X Tutorial
                      <span className="w-5 h-5 bg-blue-500 rounded-full" />
                    </h2>

                    <div className="space-y-4">
                      <Accordion title="How to create event?" defaultOpen />
                      <Accordion title="How to prepare menu or menu planning?">
                        <div className="mt-3 ml-2 space-y-2">
                          <SubItem index="1" title="Create Menu" />
                          <SubItem index="2" title="Custom Menu" />
                        </div>
                      </Accordion>
                      <Accordion title="How to generate invoice?" />
                      <Accordion title="How to make quotation?" />
                    </div>

                    <button className="absolute bottom-6 left-6 text-gray-500 text-sm hover:text-black transition">
                      Support Center
                    </button>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 px-10 py-10 overflow-y-auto">
                    <div className="flex flex-col items-center mt-8 mb-10">
                      <div className="w-20 h-20 rounded-full bg-blue-100 flex items-center justify-center text-4xl">
                        🎓
                      </div>
                      <h1 className="text-3xl font-semibold mt-4 text-black">
                        Welcome!
                      </h1>
                      <p className="text-[#646464] text-lg mt-1">
                        What can we help you with?
                      </p>
                    </div>

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
                </div>

                {/* Coming Soon Overlay */}
                <div
                  className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center"
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    backdropFilter: "blur(2px)",
                    zIndex: 100,
                  }}
                >
                  <div className="text-center px-8 py-6 rounded-2xl bg-white shadow-2xl border border-gray-200">
                    <div className="mb-3">
                      <div className="w-16 h-16 mx-auto rounded-full bg-blue-100 flex items-center justify-center">
                        <Play className="w-8 h-8 text-blue-600" />
                      </div>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">
                      Coming Soon
                    </h3>
                    <p className="text-sm text-gray-600 max-w-xs">
                      Video tutorials are under development and will be
                      available soon.
                    </p>
                  </div>
                </div>

                {/* Close Button on top */}
                <button
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white shadow-md hover:shadow-lg flex items-center justify-center transition"
                  style={{ zIndex: 101 }}
                  onClick={onClose}
                >
                  <X className="w-4 h-4 text-gray-600" />
                </button>
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

// Demo wrapper
function Demo() {
  const [open, setOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <button
        onClick={() => setOpen(true)}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
      >
        Open Tutorial Modal
      </button>
      <SidebarModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
