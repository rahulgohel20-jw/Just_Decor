import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GetAllCustomer, AddExpensemanagement } from "@/services/apiServices";

export default function AddSupplierCustomerModal({
  open,
  onClose,
  type,
  eventId,
}) {
  const [partyList, setPartyList] = useState([]);
  const [selectedParty, setSelectedParty] = useState("");

  const [form, setForm] = useState({
    type: type || "Supplier",
    name: "",
    amount: "",
    countryCode: "+91",
    mobile: "",
    remarks: "",
    gst: "",
    address: "",
  });

  const userId = Number(localStorage.getItem("userId"));

  const [showGST, setShowGST] = useState(false);
  useEffect(() => {
    setForm((prev) => ({ ...prev, type }));
  }, [type]);

  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, [open, onClose]);

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    if (!open || !userId) return;

    console.log("Calling GetAllCustomer API...");

    GetAllCustomer(userId)
      .then((res) => {
        console.log("API RESPONSE", res);
        const list = res?.data?.data?.["Party Details"] || [];

        // Filter based on type
        const filteredList = list.filter((cust) => {
          const typeName =
            cust.contact?.contactType?.nameEnglish?.toLowerCase();
          if (form.type === "Supplier") {
            return typeName !== "customer"; // exclude customers
          } else if (form.type === "Customer") {
            return typeName === "customer"; // include only customers
          }
          return true;
        });

        setPartyList(filteredList);
        setSelectedParty(""); // reset selection when type changes
        setForm((prev) => ({
          ...prev,
          name: "",
          mobile: "",
          gst: "",
          address: "",
        })); // reset prefilled fields
      })
      .catch((err) => {
        console.error("Failed to fetch parties", err);
      });
  }, [open, userId, form.type]); // re-run when modal opens or type changes
  // ✅ add form.type to dependency so it refetches on type change

  const handlePartySelect = (e) => {
    const id = Number(e.target.value);
    setSelectedParty(id);

    const party = partyList.find((p) => p.id === id);
    if (!party) return;

    setForm((prev) => ({
      ...prev,
      name: party.nameEnglish || "",
      mobile: party.mobileno || "",
      gst: party.gst || "",
      address: party.addressEnglish || "",
      countryCode: "+91",

      roleId: party?.contact?.contactType?.id || null, // ✅ FIX
    }));
  };

  const handleSubmit = async () => {
    try {
      if (!selectedParty || !form.amount) {
        console.warn("Party or amount missing");
        return;
      }

      const formatDate = () => {
        const d = new Date();
        const day = String(d.getDate()).padStart(2, "0");
        const month = String(d.getMonth() + 1).padStart(2, "0");
        const year = d.getFullYear();
        return `${day}/${month}/${year}`;
      };

      const payload = {
        amount: Number(form.amount),
        date: formatDate(),
        description: form.remarks,
        remark: form.remarks,
        paymentType: form.paymentType,
        mobileNo: form.mobile,
        userId: userId,
        roleId: 0,

        gstin: form.gst || "",
        buildingAddress: form.billFlat || "",
        area: form.billArea || "",
        city: form.billCity || "",
        state: form.billState || "",
        pincode: form.billPincode || "",
        countryCode: "+91",

        expenseId: -1,
        eventId: Number(eventId),

        partyId: Number(selectedParty),
        userType: form.type.toUpperCase(), // SUPPLIER / CUSTOMER
      };

      console.log("Submitting payload 👉", payload);

      const res = await AddExpensemanagement(payload);

      console.log("Expense added:", res?.data);

      onClose(res?.data?.data || null);
    } catch (err) {
      console.error("Failed to add supplier/customer expense", err);
    }
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
                  Add New Contact
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
                <div className="ps-3">Type</div>
                <div className="flex items-center gap-2 bg-gray-100 p-1 rounded-2xl w-fit">
                  {["Supplier", "Customer"].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setForm({ ...form, type: t })}
                      className={`
        px-5 py-2 rounded-xl text-sm transition-all duration-200
        ${
          form.type === t
            ? "bg-white font-semibold text-gray-900 shadow-sm"
            : "text-gray-600 hover:text-gray-800"
        }
      `}
                    >
                      {t}
                    </button>
                  ))}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Select Existing {form.type}
                  </label>

                  <select
                    value={selectedParty}
                    onChange={handlePartySelect}
                    className="input mt-1 w-full"
                  >
                    <option value="">Select {form.type}</option>

                    {partyList.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.nameEnglish}
                        {p.mobileno ? ` (${p.mobileno})` : ""}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-600">
                    Amount
                  </label>
                  <input
                    type="number"
                    name="amount"
                    value={form.amount}
                    onChange={handleInput}
                    placeholder="₹ 0.00"
                    className="input mt-1 w-full"
                  />
                </div>

                <div className="grid grid-cols-[200px_1fr_1fr] gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Country Code
                    </label>
                    <input
                      type="text"
                      name="countryCode"
                      value={form.countryCode}
                      onChange={handleInput}
                      className="input mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">
                      Mobile Number
                    </label>
                    <input
                      type="text"
                      name="mobile"
                      value={form.mobile}
                      onChange={handleInput}
                      placeholder="Enter mobile number"
                      className="input mt-1 w-[300px]"
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
              </div>

              <div className="p-4 border-t bg-white flex justify-end">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="btn btn-primary py-3 px-6"
                  disabled={!selectedParty || !form.amount}
                >
                  {`Add ${form.type}`}
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
