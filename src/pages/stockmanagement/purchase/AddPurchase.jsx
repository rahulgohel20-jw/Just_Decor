import { useState, useEffect, useRef } from "react";
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
  Trash2,
  ShoppingCart,
  Percent,
  DollarSign,
  BarChart2,
  Search,
} from "lucide-react";
import { Select } from "antd";
import { useLocation, useNavigate } from "react-router";
import { GetAllRawmaterial, OutsideContactName, AddPuchase } from "../../../services/apiServices";
import AddContactName from "../../master/MenuItemMaster/components/AddContactName";
import Swal from "sweetalert2";
import AddRawMaterial from "../../../partials/modals/add-raw-material/AddRawMaterial";

const AddItemSidebar = ({ isOpen, onClose, onAdd }) => {
  const [form, setForm] = useState({
    rawMaterialId: null,
    item_name: "",
    hsc_sac: "",
    cgst: 0,
    sgst: 0,
    igst: 0,
    qty: "",
    unit: "",
    price_per_unit: "",
    other_charges: 0,
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const dropdownRef = useRef(null);

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        setLoadingItems(true);
        const res = await GetAllRawmaterial(userId);
        const dat = res?.data?.data?.["Raw Material Details"];
        setMenuItems(Array.isArray(dat) ? dat : []);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      } finally {
        setLoadingItems(false);
      }
    };
    fetchMenuItems();
  }, []);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredItems([]);
      setShowDropdown(false);
      return;
    }
    const lower = searchQuery.toLowerCase();
    const matches = menuItems.filter((item) =>
      item.nameEnglish?.toLowerCase().includes(lower)
    );
    setFilteredItems(matches);
    setShowDropdown(true);
  }, [searchQuery, menuItems]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelectItem = (item) => {
    setForm((prev) => ({
      ...prev,
      rawMaterialId: item.id || item.rawMaterialId || null,
      item_name: item.nameEnglish || "",
      hsc_sac: item.hsc_sac || item.hsn_sac || "",
      cgst: item.cgst || 0,
      sgst: item.sgst || 0,
      igst: item.igst || 0,
      unit: item.unit?.nameEnglish || item.unit || "",
      price_per_unit: item.supplierRate || item.price || "",
    }));
    setSearchQuery(item.nameEnglish || "");
    setShowDropdown(false);
  };

  const total =
    (parseFloat(form.qty) || 0) * (parseFloat(form.price_per_unit) || 0) +
    (parseFloat(form.other_charges) || 0);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (!form.item_name || !form.qty || !form.price_per_unit) return;
    onAdd({ ...form, total_price: total.toFixed(2) });
    setForm({ rawMaterialId: null, item_name: "", hsc_sac: "", cgst: 0, sgst: 0, igst: 0, qty: "", unit: "", price_per_unit: "", other_charges: 0 });
    setSearchQuery("");
    onClose();
  };

  const inputClass = "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${isOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-primary flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="text-gray-700 font-bold text-base tracking-tight">Add Item</h2>
              <p className="text-gray-700 text-xs">Fill in the purchase item details</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors border border-gray-300">
            <X size={16} className="text-gray-800" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
          {/* Search Item */}
          <div ref={dropdownRef} className="relative">
            <label className={labelClass}>
              <Search size={11} /> Search Item <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setForm((prev) => ({ ...prev, item_name: e.target.value }));
                }}
                placeholder={loadingItems ? "Loading items..." : "Search item name..."}
                disabled={loadingItems}
                className={`${inputClass} pl-9`}
              />
              {loadingItems && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
                </div>
              )}
            </div>
            {showDropdown && filteredItems.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredItems.map((item, i) => (
                  <li key={i} onMouseDown={() => handleSelectItem(item)} className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0">
                    <span className="font-medium">{item.nameEnglish}</span>
                    {item.menuCategory?.nameEnglish && (
                      <span className="ml-2 text-xs text-slate-400">({item.menuCategory.nameEnglish})</span>
                    )}
                  </li>
                ))}
              </ul>
            )}
            {showDropdown && searchQuery && filteredItems.length === 0 && !loadingItems && (
              <div className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg px-4 py-3 text-sm text-slate-400 text-center">
                No items found
              </div>
            )}
          </div>

          {/* HSC/SAC */}
          <div>
            <label className={labelClass}><Hash size={11} /> HSC / SAC Code</label>
            <input name="hsc_sac" value={form.hsc_sac} onChange={handleChange} placeholder="Enter HSC/SAC code" className={inputClass} />
          </div>

          {/* Tax */}
          <div className="grid grid-cols-3 gap-3">
            {["cgst", "sgst", "igst"].map((tax) => (
              <div key={tax}>
                <label className={labelClass}><Percent size={10} /> {tax.toUpperCase()}</label>
                <input name={tax} type="number" value={form[tax]} onChange={handleChange} className={inputClass} />
              </div>
            ))}
          </div>

          {/* Qty + Unit */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}><BarChart2 size={11} /> Qty <span className="text-red-400">*</span></label>
              <input name="qty" type="number" value={form.qty} onChange={handleChange} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><Tag size={11} /> Unit</label>
              <input name="unit" value={form.unit} onChange={handleChange} placeholder="GM, KG, PCS..." className={inputClass} />
            </div>
          </div>

          {/* Price + Other Charges */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className={labelClass}><DollarSign size={11} /> Price/Unit <span className="text-red-400">*</span></label>
              <input name="price_per_unit" type="number" value={form.price_per_unit} onChange={handleChange} placeholder="0.00" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}><Plus size={11} /> Other Charges</label>
              <input name="other_charges" type="number" value={form.other_charges} onChange={handleChange} placeholder="0" className={inputClass} />
            </div>
          </div>

          {/* Total Preview */}
          <div className="rounded-2xl p-4 mt-2 bg-blue-50 border border-blue-100">
            <p className="text-xs font-semibold text-blue-600 uppercase tracking-wider mb-1">Calculated Total</p>
            <p className="text-2xl font-bold text-blue-800">₹ {total.toFixed(2)}</p>
            <p className="text-xs text-blue-500 mt-0.5">{form.qty || 0} × ₹{form.price_per_unit || 0} + ₹{form.other_charges || 0} charges</p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-100 flex gap-3 bg-slate-50">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-sm font-semibold hover:bg-slate-100 transition-colors">
            Cancel
          </button>
          <button onClick={handleAdd} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 transition-all hover:opacity-90 active:scale-95 bg-primary">
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>
    </>
  );
};

const AddPurchase = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [supplier, setSupplier] = useState([]);
  const [items, setItems] = useState([
    
  ]);
  const [form, setForm] = useState({
    voucher_no: "",
    date: "",
    bill_no: "",
    supplier_id: "",
    account_name: "",
    invoice_type: "Tax Invoice",
    remark: "",
  });

  const navigate = useNavigate();
  const [discount, setDiscount] = useState(0);
  const [adjustment, setAdjustment] = useState(0);
  const userId = localStorage.getItem("userId");

  const location = useLocation();
const editData = location.state?.editData || null;
const isEdit = !!editData;

useEffect(() => {
  if (!editData) return;
  setForm({
    voucher_no: editData.voucher || "",
    date: editData.podate
      ? editData.podate.split("/").reverse().join("-")  // dd/mm/yyyy → yyyy-mm-dd
      : "",
    bill_no: editData.billno || "",
    supplier_id: editData.supplierId || "",
    account_name: editData.supplierName || "",
    invoice_type: editData.invoicetype || "Tax Invoice",
    remark: editData.remarks || "",
  });
  setDiscount(editData.discountper || 0);
  setAdjustment(editData.adjustamount || 0);

  // Pre-fill items from details
  const prefilledItems = (editData.details || []).map((d) => ({
    rawMaterialId: d.rawMaterialId || 0,
    item_name: d.rawMaterialName || "",
    hsc_sac: d.hsccode || "",
    cgst: d.cgst || 0,
    sgst: d.sgst || 0,
    igst: d.igst || 0,
    qty: d.qty || "",
    unit: d.unitName || "",
    price_per_unit: d.price || "",
    other_charges: d.othercharge || 0,
    total_price: String(d.total || 0),
  }));
  setItems(prefilledItems);
}, [editData]);

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const data = await OutsideContactName(3, userId);
      setSupplier(data?.data?.data["Party Details"] || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = (item) => {
    setItems((prev) => [...prev, item]);
    setIsAddItemModalOpen(false)
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const totalAmount = items.reduce((sum, item) => sum + parseFloat(item.total_price || 0), 0);
  const discountAmount = (totalAmount * (parseFloat(discount) || 0)) / 100;
  const finalAmount = totalAmount - discountAmount + (parseFloat(adjustment) || 0);

  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!form.supplier_id) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please select a supplier.", confirmButtonColor: "#3085d6" });
      return;
    }
    if (items.length === 0) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please add at least one item.", confirmButtonColor: "#3085d6" });
      return;
    }
    try {
      setSaving(true);
      const payload = {
        id: isEdit ? editData.id : 0,
        userId: parseInt(userId),
        voucher: form.voucher_no,
        podate: form.date
          ? form.date.split("-").reverse().join("/")
          : "",
        billno: form.bill_no,
        supplierId: form.supplier_id,
        invoicetype: form.invoice_type,
        remarks: form.remark,
        subamount: totalAmount,
        discountper: parseFloat(discount) || 0,
        discountval: discountAmount,
        adjustamount: parseFloat(adjustment) || 0,
        finalamount: finalAmount,
        details: items.map((item) => ({
          rawMaterialId: item.rawMaterialId || 0,
          hsccode: item.hsc_sac || "",
          cgst: parseFloat(item.cgst) || 0,
          sgst: parseFloat(item.sgst) || 0,
          igst: parseFloat(item.igst) || 0,
          qty: parseFloat(item.qty) || 0,
          price: parseFloat(item.price_per_unit) || 0,
          othercharge: parseFloat(item.other_charges) || 0,
          total: parseFloat(item.total_price) || 0,
        })),
      };
      await AddPuchase(payload);
await Swal.fire({
  icon: "success",
  title: "Success!",
  text: isEdit ? "Purchase updated successfully." : "Purchase saved successfully.",
  confirmButtonColor: "#16a34a"
});      navigate("/stock-management/purchase");
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire({ icon: "error", title: "Error", text: "Failed to save purchase. Please try again.", confirmButtonColor: "#d33" });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass = "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const labelClass = "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        {/* ── Purchase Information Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-700">
                <FileText size={17} className="text-white" />
              </div>
<h2 className="text-green-900 font-bold text-base tracking-tight">
  {isEdit ? "Edit Purchase" : "Purchase Information"}
</h2>            </div>
            <div className="flex items-center gap-2">
                <button onClick={() => setIsAccountModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm">
                <User size={16} /> Add Account
              </button>
              <button onClick={() => setIsAddItemModalOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-primary">
                <Plus size={16} /> Add Item
              </button>
              <button onClick={() => navigate('/stock-management/purchase')} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors shadow-sm">
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">
            <div>
              <label className={labelClass}><Hash size={16} /> Voucher No.</label>
              <input name="voucher_no" value={form.voucher_no} onChange={handleFormChange} className={fieldClass} />
            </div>
            <div>
              <label className={labelClass}><Calendar size={16} /> Date</label>
              <input
                name="date"
                type="date"
                value={form.date}
                onChange={handleFormChange}
                className={fieldClass}
              />
            </div>
            <div>
              <label className={labelClass}><Receipt size={16} /> Bill No.</label>
              <input name="bill_no" value={form.bill_no} onChange={handleFormChange} placeholder="Enter bill number" className={fieldClass} />
            </div>

            {/* ── Account Name (Supplier) ── */}
            <div className="col-span-2">
              <label className={labelClass}>
                <User size={16} /> Account Name (Supplier)
              </label>
              <Select
                showSearch
                allowClear
                placeholder="Search supplier..."
                style={{ width: "100%", height: "38px" }}
                value={form.supplier_id || undefined}
                onChange={(val, option) =>
                  setForm((prev) => ({
                    ...prev,
                    supplier_id: val,
                    account_name: option?.label || "",
                  }))
                }
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
                options={supplier.map((s) => ({ value: s.id, label: s.nameEnglish }))}
                dropdownRender={(menu) => (
                  <>
                    {menu}
                    
                  </>
                )}
              />
            </div>

            <div>
              <label className={labelClass}><Tag size={16} /> Invoice Type</label>
              <select name="invoice_type" value={form.invoice_type} onChange={handleFormChange} className={fieldClass}>
                <option>Tax Invoice</option>
                <option>Retail Invoice</option>
              </select>
            </div>

            <div className="col-span-3">
              <label className={labelClass}><AlignLeft size={16} /> Remark</label>
              <input name="remark" value={form.remark} onChange={handleFormChange} placeholder="Optional remark..." className={fieldClass} />
            </div>
          </div>
        </div>

        {/* ── Purchase Details Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
                <ShoppingCart size={17} className="text-white" />
              </div>
              <h2 className="text-blue-900 font-bold text-base tracking-tight">Purchase Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm disabled:opacity-60" style={{ background: "linear-gradient(135deg, #16a34a, #15803d)" }}>
                <Save size={16} />{saving ? "Saving..." : isEdit ? "Update" : "Save"}
              </button>
              <button onClick={() => setIsSidebarOpen(true)} className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-primary">
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Item Name", "HSC/SAC", "CGST", "SGST", "IGST", "Qty", "Unit", "Price/Unit", "Other Charges", "Total Price", ""].map((h) => (
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
                      <td className="px-4 py-3 text-slate-600">{item.other_charges}</td>
                      <td className="px-4 py-3 font-bold text-blue-700">₹ {item.total_price}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDeleteItem(i)} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100">
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
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Amount</span>
                  <span className="text-sm font-bold text-slate-800">₹ {totalAmount.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1.5"><Percent size={10} /> Discount (%)</span>
                  <div className="flex items-center gap-2">
                    <input type="number" value={discount} onChange={(e) => setDiscount(e.target.value)} className="w-16 px-2 py-1 text-xs text-right rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                    <span className="text-sm font-semibold text-red-500">- ₹ {discountAmount.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-between px-6 py-3">
                  <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Adjustment</span>
                  <input type="number" value={adjustment} onChange={(e) => setAdjustment(e.target.value)} className="w-24 px-2 py-1 text-xs text-right rounded-lg border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
                <div className="flex items-center justify-between px-6 py-4" style={{ background: "linear-gradient(135deg, #0f766e 0%, #0d9488 100%)" }}>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">Final Amount</span>
                  <span className="text-lg font-black text-white">₹ {finalAmount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add New Supplier Modal */}
      <AddContactName
        isModalOpen={isAccountModalOpen}
        setIsModalOpen={setIsAccountModalOpen}
        contactTypeId={3}
        onClose={() => setIsAccountModalOpen(false)}
        refreshData={fetchSupplier}
        concatId={3}
      />

      <AddRawMaterial isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} setIsModalOpen={setIsAddItemModalOpen} refreshData={handleAddItem} />
      <AddItemSidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} onAdd={handleAddItem} />
    </div>
  );
};

export default AddPurchase;