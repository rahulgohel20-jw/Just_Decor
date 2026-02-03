import { useState } from "react";
import { CustomModal } from "@/components/custom-modal/CustomModal";
import { X, User } from "lucide-react";

const RecordPayment = ({ isModalOpen, setIsModalOpen }) => {
  const handleClose = () => {
    setIsModalOpen(false);
  };

  const [form, setForm] = useState({
    date: "2023-10-24",
    mode: "Bank Transfer",
    deposit: "HDFC Business Account (...4492)",
    ref: "",
    amount: "",
  });

  return (
    isModalOpen && (
      <CustomModal open={isModalOpen} onClose={handleClose} width="900px">

        <div className=" rounded-xl">

          {/* Header */}
          <div className="flex items-center justify-between  bg-white rounded-t-xl">

            <div className="flex items-center gap-2 text-xl font-bold">
             Payment
            </div>

            <button onClick={handleClose}>
              <X size={25} className="text-gray-500" />
            </button>
           

          </div>
          <hr className="mt-2 font-bold bg-grey-300"/>

          {/* Content */}
          <div className="flex flex-col gap-3">

            {/* Customer Card */}
            <div className="border rounded-xl mt-2 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

              <div className="flex items-center gap-4">

                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" />
                </div>

                <div>
                  <p className="font-semibold text-gray-900">
                    Acme Corp International
                  </p>

                  <p className="text-sm text-gray-500">
                    Ref: ACC-9921
                  </p>
                </div>

              </div>

              <div className="w-full md:w-[220px]">

                <label className="text-xs font-medium text-gray-500">
                  Amount Received (₹)
                </label>

                <input
                  value="45,000.00"
                  readOnly
                  className="mt-1 w-full border rounded-lg px-3 py-2 text-sm font-medium bg-gray-50"
                />
              </div>

            </div>

            {/* Payment Info */}
            <div className="border rounded-xl p-5">

              <h3 className="font-semibold mb-4">
                Payment Info
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                {/* Date */}
                <div>
                  <label className="label">
                    Payment Date
                  </label>

                  <input
                    type="date"
                    value={form.date}
                    onChange={(e) =>
                      setForm({ ...form, date: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Mode */}
                <div>
                  <label className="label">
                    Payment Mode
                  </label>

                  <select
                    value={form.mode}
                    onChange={(e) =>
                      setForm({ ...form, mode: e.target.value })
                    }
                    className="input"
                  >
                    <option>Bank Transfer</option>
                    <option>UPI</option>
                    <option>Cash</option>
                    <option>Cheque</option>
                  </select>
                </div>

                {/* Deposit */}
                <div>
                  <label className="label">
                    Deposit To
                  </label>

                  <select
                    value={form.deposit}
                    onChange={(e) =>
                      setForm({ ...form, deposit: e.target.value })
                    }
                    className="input"
                  >
                    <option>HDFC Business Account (...4492)</option>
                    <option>ICICI Current Account (...2231)</option>
                    <option>SBI Account (...7789)</option>
                  </select>
                </div>

              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

                {/* Ref */}
                <div>
                  <label className="label">
                    Reference #
                  </label>

                  <input
                    placeholder="Enter transaction reference ID"
                    value={form.ref}
                    onChange={(e) =>
                      setForm({ ...form, ref: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Amount */}
                <div>
                  <label className="label">
                    Pay Amount
                  </label>

                  <input
                    placeholder="₹ 0.00"
                    value={form.amount}
                    onChange={(e) =>
                      setForm({ ...form, amount: e.target.value })
                    }
                    className="input"
                  />
                </div>

                {/* Save */}
                <div className="flex items-end">

                  <button className="w-full md:w-auto ml-auto bg-primary text-white px-5 py-2 rounded-lg text-sm font-medium">
                     Save
                  </button>

                </div>

              </div>

            </div>

            {/* Invoice Table */}
            <div className="border rounded-xl overflow-hidden">

              <h3 className="text-lg font-semibold px-5 py-4 border-b">
                Apply Payment to Invoices
              </h3>

              <div className="overflow-x-auto">

                <table className="w-full text-sm">

                  <thead className="bg-[#F8FAFC] text-xs text-gray-500">

                    <tr>
                      <th className="px-5 py-3 text-left">Invoice</th>
                      <th className="px-5 py-3 text-left">Date</th>
                      <th className="px-5 py-3 text-left">Invoice Amount</th>
                      <th className="px-5 py-3 text-left">Due</th>
                      <th className="px-5 py-3 text-left">Payment</th>
                    </tr>

                  </thead>

                  <tbody className="divide-y">

                    <tr>
                      <td className="px-5 py-3 text-primary">
                        INV-2023-1102
                      </td>

                      <td className="px-5 py-3 text-gray-500">
                        Oct 12, 2023
                      </td>

                      <td className="px-5 py-3">
                        ₹ 30,000.00
                      </td>

                      <td className="px-5 py-3 text-red-600 font-medium">
                        ₹ 30,000.00
                      </td>

                      <td className="px-5 py-3">
                        <input
                          className="input max-w-[140px]"
                          value="₹ 30,000.00"
                        />
                      </td>
                    </tr>

                    <tr>
                      <td className="px-5 py-3 text-primary">
                        INV-2023-1105
                      </td>

                      <td className="px-5 py-3 text-gray-500">
                        Oct 15, 2023
                      </td>

                      <td className="px-5 py-3">
                        ₹ 25,000.00
                      </td>

                      <td className="px-5 py-3 text-red-600 font-medium">
                        ₹ 25,000.00
                      </td>

                      <td className="px-5 py-3">
                        <input
                          className="input max-w-[140px]"
                          value="₹ 15,000.00"
                        />
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              {/* Footer */}
              <div className="bg-[#F8FAFC] px-5 py-4 flex justify-end">

                <p className="text-sm font-semibold text-gray-700">
                  Amount to Credit:{" "}
                  <span className="text-primary text-lg ml-2">
                    ₹ 45,000.00
                  </span>
                </p>

              </div>

            </div>

          </div>

        </div>

      </CustomModal>
    )
  );
};

export default RecordPayment;
