import { motion, AnimatePresence } from "framer-motion";

export default function PaymentSuccess({
  open,
  onClose,
  amount = 1299,
  transactionId = "TXN123456789",
  approve = false,
}) {
  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Overlay (click disabled) */}
          <motion.div
            className="absolute inset-0 bg-slate-800/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          {/* Modal */}
          <motion.div
            className="relative z-10 w-full max-w-[440px] bg-white rounded-3xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", duration: 0.5 }}
          >
            {/* Content */}
            <div className="px-8 py-12 text-center">
              {/* Animated Success Icon */}
              <div className="relative mb-8 flex justify-center">
                {[...Array(12)].map((_, i) => {
                  const size = Math.random() * 20 + 10;
                  const delay = Math.random() * 0.5;
                  const x = (Math.random() - 0.5) * 200;
                  const y = (Math.random() - 0.5) * 100;
                  return (
                    <motion.div
                      key={i}
                      className="absolute w-3 h-3 rounded-full border-2 border-gray-300"
                      style={{
                        width: size,
                        height: size,
                        left: `calc(50% + ${x}px)`,
                        top: `calc(50% + ${y}px)`,
                      }}
                      initial={{ opacity: 0, scale: 0 }}
                      animate={{ opacity: 0.4, scale: 1 }}
                      transition={{ delay, duration: 0.6 }}
                    />
                  );
                })}

                {/* Envelope with checkmark */}
                <motion.div
                  className="relative w-32 h-32"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  <svg viewBox="0 0 128 128" className="w-full h-full">
                    <motion.path
                      d="M20 45 L64 70 L108 45 L108 95 C108 98 106 100 103 100 L25 100 C22 100 20 98 20 95 Z"
                      fill="#005BA8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.3, duration: 0.6 }}
                    />
                    <motion.path
                      d="M20 45 L64 70 L108 45 L64 20 Z"
                      fill="#005BA8"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.4, duration: 0.5 }}
                    />
                    <motion.rect
                      x="35"
                      y="35"
                      width="58"
                      height="38"
                      rx="2"
                      fill="white"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 35, opacity: 1 }}
                      transition={{ delay: 0.6, duration: 0.4 }}
                    />
                    <motion.line
                      x1="42"
                      y1="48"
                      x2="86"
                      y2="48"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.8, duration: 0.3 }}
                    />
                    <motion.line
                      x1="42"
                      y1="56"
                      x2="86"
                      y2="56"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                    />
                    <motion.line
                      x1="42"
                      y1="64"
                      x2="75"
                      y2="64"
                      stroke="#E5E7EB"
                      strokeWidth="2"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 1, duration: 0.3 }}
                    />
                    <motion.path
                      d="M20 45 L64 20 L108 45"
                      fill="none"
                      stroke="#005BA8"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ delay: 0.5, duration: 0.4 }}
                    />
                    <motion.path
                      d="M 75 25 L 85 35 L 105 15"
                      fill="none"
                      stroke="#22C55E"
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{
                        delay: 1.1,
                        duration: 0.5,
                        ease: "easeOut",
                      }}
                    />
                  </svg>
                </motion.div>
              </div>

              <motion.h2
                className="text-3xl font-semibold text-gray-700 mb-6"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
              >
                Payment Successful
              </motion.h2>

              <motion.div
                className="space-y-3 mb-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                <p className="text-gray-600 text-base leading-relaxed">
                  Thank you for your submission. Your request is under review by
                  our admin.
                </p>
                <p className="text-gray-600 text-base leading-relaxed">
                  We will contact you once verified.
                </p>
                <p className="text-gray-500 text-sm mt-4">
                  For any questions, reach us at:{" "}
                  <a
                    href="tel:000-000-0000"
                    className="font-semibold text-gray-700 hover:underline"
                  >
                    000-000-0000
                  </a>
                </p>
              </motion.div>

              {/* OK Button: only enabled if approve is true */}
              <motion.button
                onClick={() => approve && onClose()}
                disabled={!approve}
                className={`font-semibold text-lg py-3 px-12 rounded-lg transition-colors
    ${
      approve
        ? "bg-white text-[#005BA8] hover:bg-red-50"
        : "bg-gray-200 text-gray-400 cursor-not-allowed"
    }`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2 }}
                whileHover={approve ? { scale: 1.02 } : {}}
                whileTap={approve ? { scale: 0.98 } : {}}
              >
                {approve ? "OK" : "Waiting for approval..."}
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
