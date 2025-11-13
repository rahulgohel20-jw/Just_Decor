import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { TableComponent } from "@/components/table/TableComponent";
import { getColumns, data } from "./constant";

export default function ViewAssignDatabase({ open, onClose }) {
  const columns = getColumns();
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
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <motion.div
              role="dialog"
              aria-modal="true"
              className="pointer-events-auto w-full max-w-[700px] bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden flex flex-col"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-200">
                <h2 className="text-xl md:text-2xl font-semibold text-gray-800">
                  Assign Database List
                </h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-5 h-5 text-gray-500" />
                </button>
              </div>

              {/* Scrollable Content */}
              <div className="p-4 md:p-6">
                <div className="space-y-4 md:space-y-5">
                  <TableComponent
                    columns={columns}
                    data={data}
                    paginationSize={10}
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
