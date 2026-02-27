import { Fragment, useState } from "react";
import {
  ArrowLeft,
  FileText,
  Hash,
  Calendar,
  User,
  Receipt,
  Tag,
  AlignLeft,
  Trash2,
  Printer,
  Box,
  View,
  Utensils,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Container } from "@mui/material";
import { columns, defaultData } from "./constant"; // adjust path as needed
import { TableComponent } from "@/components/table/TableComponent";
const StoreLedger = () => {
  const [items, setItems] = useState(defaultData);
  const [form, setForm] = useState({
    item_name: "",
    to_date: "",
    from_date: "",
    
    
    opd: "",
  });
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce(
    (sum, item) => sum + parseFloat(item.total_price || 0),
    0
  );
  const discountAmount = (totalAmount * (parseFloat(discount) || 0)) / 100;
  const finalAmount =
    totalAmount - discountAmount + (parseFloat(adjustment) || 0);

  const tableColumns = columns(handleDeleteItem);

  const fieldClass =
    "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const labelClass =
    "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <Fragment>
      <Container>
        <div className="">
          <div className="max-w-6xl mx-auto space-y-5">

            {/* ── Header Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-700">
                    <FileText size={17} className="text-white" />
                  </div>
                  <h2 className="text-green-900 font-bold text-base tracking-tight">
                    General Stock Ledger
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                    <View size={16} /> Preview
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-primary">
                    <Printer size={16} /> Print
                  </button>
                  <button
                    onClick={() => navigate("/stock-management/purchase")}
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors shadow-sm"
                  >
                    <ArrowLeft size={16} /> Back
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">
                {/* Row 1 */}
                <div>
                  <label className={labelClass}>
                    <Utensils size={16} /> Item Name
                  </label>
                  <input
                    name="item_name"
                    value={form.item_name}
                    onChange={handleFormChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Calendar size={16} />To Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={form.to_date}
                    onChange={handleFormChange}
                    className={fieldClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>
                    <Calendar size={16} />From Date
                  </label>
                  <input
                    name="date"
                    type="date"
                    value={form.from_date}
                    onChange={handleFormChange}
                    className={fieldClass}
                  />
                </div>
                

                {/* Row 2 */}
                
                

                {/* Row 3 */}
                <div className="col">
                  <label className={labelClass}>
                    <AlignLeft size={16} /> OPB
                  </label>
                  <input
                    name="opb"
                    value={form.opb}
                    onChange={handleFormChange}
                    placeholder="OPB"
                    className={fieldClass}
                  />
                </div>
              </div>
            </div>

            {/* ── Stock Details Card ── */}
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              {/* Card Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
                    <Box size={17} className="text-white" />
                  </div>
                  <h2 className="text-blue-900 font-bold text-base tracking-tight">
                    Stock Details
                  </h2>
                </div>
              </div>

              {/* TableComponent */}
              <div className="overflow-x-auto">
                <TableComponent
                  columns={tableColumns}
                  data={items}
                />
              </div>

              {/* Summary Footer */}
              <div className="border-t border-slate-100 bg-slate-50/50 mt-3">
                <div className="flex justify-end">
                  <div className="w-80 divide-y divide-slate-100">
                    <div className="flex items-center justify-between px-6 py-4 bg-primary">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">
                        Closing Stock
                      </span>
                      <span className="text-lg font-black text-white">
                        ₹ {finalAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </Container>
    </Fragment>
  );
};

export default StoreLedger;