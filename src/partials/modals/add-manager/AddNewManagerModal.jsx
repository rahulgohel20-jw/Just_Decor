import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Fetchmanager,
  fetchStatesByCountry,
  fetchCitiesByState,
} from "@/services/apiServices";
export default function AddNewManagerModal({ open, onClose }) {
  const [form, setForm] = useState({
    manager: "",
    role: "",
    mobile: "",
    date: "",
    amount: "",
    paymentType: "",
    description: "",
    remarks: "",
    image: null,
  });
  const [showGST, setShowGST] = useState(false);
  const [managers, setManagers] = useState([]);

  useEffect(() => {
    if (open) {
      FetchManager();
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  useEffect(() => {
    const loadStates = async () => {
      try {
        const stateRes = await fetchStatesByCountry(1);
        const stateArray = stateRes?.data?.data?.["state Details"];
        if (Array.isArray(stateArray)) {
          setStates(stateArray);
        } else {
          setStates([]);
        }
      } catch (err) {
        console.error("Failed to load states:", err);
        setStates([]);
      }
    };
    loadStates();
  }, []);

  const handleStateChange = async (stateId) => {
    const numericStateId = Number(stateId);
    setLeadData((prev) => ({ ...prev, state: numericStateId }));

    try {
      const cityRes = await fetchCitiesByState(numericStateId);
      const cityArray = cityRes?.data?.data?.["City Details"] || [];

      if (Array.isArray(cityArray)) {
        setCities(cityArray);
      } else {
        setCities([]);
      }
    } catch (err) {
      console.error("Failed to load cities:", err);
      setCities([]);
    }
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const FetchManager = () => {
    Fetchmanager(1)
      .then((res) => {
        if (res?.data?.data?.userDetails) {
          const managerList = res.data.data.userDetails.map((man) => ({
            value: man.id,
            label: man.firstName || "-",
          }));
          setManagers(managerList);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch managers:", err);
        setManagers([]);
      });
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200]">
          <motion.div
            className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <div className="absolute inset-0 pointer-events-none flex items-center justify-end p-4">
            <motion.div
              className="pointer-events-auto w-[900px] max-w-[95vw] h-[90vh] bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden flex flex-col"
              initial={{ x: "110%" }}
              animate={{ x: 0 }}
              exit={{ x: "110%" }}
              transition={{ type: "spring", stiffness: 220, damping: 28 }}
            >
              <div className="px-6 py-4 border-b border-gray-200 bg-white flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Add New Manager
                </h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-6">
                <div className="grid grid-cols-2 gap-6">
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-600">
                      Manager Name
                    </label>
                    <select
                      name="manager"
                      value={form.manager}
                      onChange={handleInput}
                      className="input mt-1 w-full appearance-none pr-10 bg-white border border-gray-300 rounded-lg px-3 py-2"
                    >
                      <option value="">Select a manager</option>

                      {managers.map((mgr) => (
                        <option key={mgr.value} value={mgr.value}>
                          {mgr.label}
                        </option>
                      ))}
                    </select>

                    {/* Custom dropdown arrow */}
                    <svg
                      className="w-5 h-5 mt-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Role
                    </label>
                    <input
                      name="role"
                      type="text"
                      value={form.role}
                      onChange={handleInput}
                      placeholder="Enter role"
                      className="input mt-1"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile Number
                    </label>
                    <input
                      name="mobile"
                      type="text"
                      value={form.mobile}
                      onChange={handleInput}
                      placeholder="Enter mobile number"
                      className="input mt-1"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Date
                    </label>
                    <input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={handleInput}
                      className="input mt-1"
                    />
                  </div>
                </div>

                {/* Row 3 */}
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Amount
                    </label>
                    <input
                      name="amount"
                      type="number"
                      value={form.amount}
                      onChange={handleInput}
                      placeholder="₹ 0.00"
                      className="input mt-1"
                    />
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-600">
                      Payment Type
                    </label>
                    <select
                      name="paymentType"
                      value={form.paymentType}
                      onChange={handleInput}
                      className="input mt-1"
                    >
                      <option value="">Select payment type</option>
                      <option value="cash">Cash</option>
                      <option value="online">Online</option>
                      <option value="upi">UPI</option>
                    </select>
                    <svg
                      className="w-5 h-5 mt-4 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Description
                  </label>
                  <textarea
                    name="description"
                    value={form.description}
                    onChange={handleInput}
                    placeholder="Add a description..."
                    className="mt-1 w-full h-24 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>

                {/* Remarks */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Remarks
                  </label>
                  <textarea
                    name="remarks"
                    value={form.remarks}
                    onChange={handleInput}
                    placeholder="Add any notes here..."
                    className="mt-1 w-full h-24 border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
                <div>
                  <button
                    type="button"
                    className="text-blue-600 text-sm underline"
                    onClick={() => setShowGST(!showGST)}
                  >
                    {showGST
                      ? "Hide GST & Address"
                      : "Add GST & Address (Optional)"}
                  </button>

                  {showGST && (
                    <div className="mt-4 space-y-6">
                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          GSTIN
                        </label>
                        <input
                          type="text"
                          name="gst"
                          value={form.gst}
                          onChange={handleInput}
                          placeholder="GSTIN"
                          className="input mt-1 w-full"
                        />
                      </div>

                      <div>
                        <label className="text-sm font-medium text-gray-600">
                          Billing address
                        </label>

                        <div className="grid grid-cols-2 gap-4 mt-2">
                          <input
                            type="text"
                            name="billFlat"
                            value={form.billFlat || ""}
                            onChange={handleInput}
                            placeholder="Flat / Building Number"
                            className="input w-full"
                          />

                          <input
                            type="text"
                            name="billArea"
                            value={form.billArea || ""}
                            onChange={handleInput}
                            placeholder="Area / Locality"
                            className="input w-full"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-4 mt-4">
                          <input
                            type="text"
                            name="billPincode"
                            value={form.billPincode || ""}
                            onChange={handleInput}
                            placeholder="Pincode"
                            className="input w-full"
                          />
                          <input
                            type="text"
                            name="billCity"
                            value={form.billCity || ""}
                            onChange={handleInput}
                            placeholder="City"
                            className="input w-full"
                          />
                        </div>

                        <input
                          type="text"
                          name="billState"
                          value={form.billState || ""}
                          onChange={handleInput}
                          placeholder="State"
                          className="input mt-4 w-full"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          checked={form.sameShipping || false}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setForm((prev) => ({
                              ...prev,
                              sameShipping: checked,
                              ...(checked
                                ? {
                                    shipFlat: prev.billFlat,
                                    shipArea: prev.billArea,
                                    shipPincode: prev.billPincode,
                                    shipCity: prev.billCity,
                                    shipState: prev.billState,
                                  }
                                : {}),
                            }));
                          }}
                        />
                        <span className="text-sm text-gray-700">
                          Shipping address same as billing address?
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Image Upload */}
                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Image
                  </label>

                  <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 transition">
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleFile}
                      id="upload"
                    />
                    <label
                      htmlFor="upload"
                      className="cursor-pointer flex flex-col items-center"
                    >
                      <svg
                        className="w-10 h-10 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16l5-5 5 5M12 11v10"
                        />
                      </svg>

                      <p className="text-blue-600 font-medium mt-2">
                        Upload a file or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PNG, JPG, GIF up to 10MB
                      </p>

                      {form.image && (
                        <p className="mt-2 text-sm text-green-600">
                          {form.image.name}
                        </p>
                      )}
                    </label>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-4 border-t bg-white flex justify-end">
                <button className="btn btn-primary w-half  py-3">
                  Add Manager
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
