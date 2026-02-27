import { useState } from "react";
import {
  ArrowLeft,
  Plus,
  Save,
  X,
  Package,
  FileText,
  Hash,
  Calendar,
  User,
  Receipt,
  Tag,
  AlignLeft,
  ChevronRight,
  Trash2,
  ShoppingCart,
  Percent,
  DollarSign,
  BarChart2,
  Edit2,
} from "lucide-react";
import { useNavigate } from "react-router";

// ─── Sidebar Modal for Adding Item ───────────────────────────────────────────
const 

AddItemSidebar = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    item_name: "",
    hsc_sac: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    qty: "",
    unit: "",
    price_per_unit: "",
  });


  
  const total =
    (parseFloat(form.qty) || 0) * (parseFloat(form.price_per_unit) || 0) 

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (!form.item_name || !form.qty || !form.price_per_unit) return;
    onAdd({ ...form, total_price: total.toFixed(2) });
    setForm({ item_name: "", hsc_sac: "", cgst: 0, sgst: 0, igst: 0, qty: "", unit: "", price_per_unit: "",  });
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 ">
          
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-primary flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-gray-700 font-bold text-base tracking-tight">Add Item</h2>
              <p className="text-gray-700 text-xs">Fill in the purchase item details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg bg-gray/20 hover:bg-gray/30 flex items-center justify-center transition-colors border border-gray-300 ">
            <X size={16} className="text-gray-800" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Item Name */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Tag size={11} /> Item Name <span className="text-red-400">*</span>
            </label>
            <input
              name="item_name"
              value={form.item_name}
              onChange={handleChange}
              placeholder="e.g. BAKING POWDER 100 GRAMS"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* HSC/SAC Code */}
          <div>
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
              <Hash size={11} /> HSC / SAC Code
            </label>
            <input
              name="hsc_sac"
              value={form.hsc_sac}
              onChange={handleChange}
              placeholder="Enter HSC/SAC code"
              className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
            />
          </div>

          {/* Tax Row */}
          <div className="grid grid-cols-3 gap-3">
            {["cgst", "sgst", "igst"].map((tax) => (
              <div key={tax}>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                  <Percent size={10} /> {tax.toUpperCase()}
                </label>
                <input
                  name={tax}
                  type="number"
                  value={form[tax]}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
              </div>
            ))}
          </div>

          {/* Qty + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <BarChart2 size={11} /> Qty <span className="text-red-400">*</span>
              </label>
              <input
                name="qty"
                type="number"
                value={form.qty}
                onChange={handleChange}
                placeholder="0"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Tag size={11} /> Unit
              </label>
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="GM, KG, PCS..."
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {/* Price + Other Charges */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <DollarSign size={11} /> Price/Unit <span className="text-red-400">*</span>
              </label>
              <input
                name="price_per_unit"
                type="number"
                value={form.price_per_unit}
                onChange={handleChange}
                placeholder="0.00"
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
              />
            </div>
            
          </div>

          {/* Live Total Preview */}
          <div className="rounded-2xl p-4 mt-2 bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Calculated Total</p>
            <p className="text-2xl font-bold text-blue-800">₹ {total.toFixed(2)}</p>
            
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 bg-primary"
            
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>
    </>
  );
};

// ─── Main Add Purchase Page ───────────────────────────────────────────────────
const AddPurchaseReturn = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [items, setItems] = useState([
    { item_name: "BAKING POWDER 100 GRAMS", hsc_sac: "", cgst: 0, sgst: 0, igst: 0, qty: 90, unit: "GM", price_per_unit: 0.4, total_price: "36.00" },
  ]);
  const [form, setForm] = useState({
    voucher_no: "",
    date: "",
    bill_no: "",
    account_name: "",
    invoice_type: "Tax Invoice",
    remark: "",
  });
  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);


  const handleAccountSave = (account) => {
    setForm((prev) => ({ ...prev, account_name: account.account_name }));
  };


  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
  const discountAmount = (totalAmount * (parseFloat(discount) || 0)) / 100;
  const finalAmount = totalAmount - discountAmount + (parseFloat(adjustment) || 0);

  const fieldClass = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 font-sans">
      <style>{`@import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap'); * { font-family: 'DM Sans', sans-serif; }`}</style>

      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Purchase Information Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
            >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-700" >
                <FileText size={17} className="text-white" />
              </div>
              <h2 className="text-green-900 font-bold text-base tracking-tight">Purchase Information</h2>
            </div>
            <div className="flex items-center gap-2">
              
              <button onClick={()=>{
                navigate('/stock-management/purchase-return')
              }} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors shadow-sm">
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          </div>

          {/* Form Fields */}
          <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">
            {/* Row 1 */}
            <div>
              <label className={labelClass}><Hash size={16} /> Voucher No.</label>
              <input name="voucher_no" placeholder="Voucher No" value={form.voucher_no} onChange={handleFormChange} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}><Calendar size={16} /> Date</label>
              <input name="date" type="date" value={form.date} onChange={handleFormChange} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}><Receipt size={16} /> Bill No.</label>
              <input name="bill_no" value={form.bill_no} onChange={handleFormChange} placeholder="Enter bill number" className={fieldClass} />
            </div>

            {/* Row 2 */}
            <div className="col-span-2">
              <label className={labelClass}><User size={16} /> Account Name</label>
              <input name="account_name" value={form.account_name} onChange={handleFormChange} placeholder="Select or enter account name" className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}><Tag size={16} /> Invoice Type</label>
              <select name="invoice_type" value={form.invoice_type} onChange={handleFormChange} className={fieldClass}>
                <option>Tax Invoice</option>
                <option>Bill of Supply</option>
                <option>Proforma Invoice</option>
                <option>Challan</option>
              </select>
            </div>

            {/* Row 3 */}
            <div className="col-span-3">
              <label className={labelClass}><AlignLeft size={16} /> Remark</label>
              <input name="remark" value={form.remark} onChange={handleFormChange} placeholder="Optional remark..." className={fieldClass} />
            </div>
          </div>
        </div>

        {/* ── Purchase Details Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          {/* Card Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100"
            >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary" >
                <ShoppingCart size={17} className="text-white" />
              </div>
              <h2 className="text-blue-900 font-bold text-base tracking-tight">Purchase Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-green-700"
                
              >
                <Save size={16} /> Save
              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-primary"
                
              >
                <Plus size={16} />Add
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Item Name", "HSC/SAC", "CGST", "SGST", "IGST", "Qty", "Unit", "Price/Unit", "Total Price", ""].map((h) => (
                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="px-4 py-12 text-center text-slate-400 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={32} className="text-slate-300" />
                        <p>No items added yet.</p>
                        <button onClick={() => setIsSidebarOpen(true)} className="text-blue-600 font-semibold text-xs flex items-center gap-1 hover:underline">
                          <Plus size={12} /> Add your first item
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr key={i} className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group">
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.item_name}</td>
                      <td className="px-4 py-3 text-slate-500">{item.hsc_sac || "—"}</td>
                      <td className="px-4 py-3 text-slate-600">{item.cgst}</td>
                      <td className="px-4 py-3 text-slate-600">{item.sgst}</td>
                      <td className="px-4 py-3 text-slate-600">{item.igst}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{item.qty}</td>
                      <td className="px-4 py-3 text-slate-500">{item.unit}</td>
                      <td className="px-4 py-3 text-slate-600">{item.price_per_unit}</td>
                      <td className="px-4 py-3 font-bold text-primary">₹ {item.total_price}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeleteItem(i)}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                        >
                          <Trash2 size={13} className="text-red-500" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Summary Footer */}
          <div className="border-t border-slate-100 bg-slate-50/50">
            <div className="flex justify-end">
              <div className="w-80 divide-y divide-slate-100">
                
                
                
                <div className="flex items-center justify-between px-6 py-4 mt-3"
                  style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Total Amount</span>
                  <span className="text-lg font-black text-white">₹ {finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>


      
      {/* Sidebar Modal */}
      <AddItemSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default AddPurchaseReturn;