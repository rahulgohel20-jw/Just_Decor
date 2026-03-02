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
  Tag,
  AlignLeft,
  Trash2,
  ShoppingCart,
  Search,
} from "lucide-react";
import { Select } from "antd";
import { useEffect, useState, useRef } from "react";
import {
  GetStockTypeByUserId,
  GetAllRawmaterial,
  GetEventMaster,
  AddStorePO as AddStorePOApi,
} from "@/services/apiServices";
import { useLocation, useNavigate } from "react-router";
import Swal from "sweetalert2";
import AddContactName from "../../master/MenuItemMaster/components/AddContactName";
import AddRawMaterial from "../../../partials/modals/add-raw-material/AddRawMaterial";

const AddItemSidebar = ({ isOpen, onClose, onAdd }) => {



  const [form, setForm] = useState({
    rawMaterialId: null,
    item_name: "",
    qty: "",
    unit: "",
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
        console.error("Failed to fetch raw materials:", err);
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
      unit: item.unit?.nameEnglish || item.unit || "",
    }));
    setSearchQuery(item.nameEnglish || "");
    setShowDropdown(false);
  };

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAdd = () => {
    if (!form.item_name || !form.qty) return;
    onAdd({ ...form });
    setForm({ rawMaterialId: null, item_name: "", qty: "", unit: "" });
    setSearchQuery("");
    onClose();
  };

  const inputClass =
    "w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm focus:ring-2 focus:ring-blue-400 focus:border-transparent outline-none";
  const labelClass =
    "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black transition-opacity duration-300 ${
          isOpen ? "opacity-30 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full z-50 w-[420px] bg-white shadow-2xl flex flex-col transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 border border-primary flex items-center justify-center">
              <Package size={18} className="text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-base text-gray-700">Add Item</h2>
              <p className="text-gray-500 text-xs">Fill in the item details</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-gray-100"
          >
            <X size={16} />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 px-6 py-6 space-y-5 overflow-y-auto">

          {/* Search Raw Material */}
          <div ref={dropdownRef} className="relative">
            <label className={labelClass}>
              <Search size={11} /> Search Item <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <Search
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
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

            {/* Dropdown */}
            {showDropdown && filteredItems.length > 0 && (
              <ul className="absolute z-50 left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                {filteredItems.map((item, i) => (
                  <li
                    key={i}
                    onMouseDown={() => handleSelectItem(item)}
                    className="px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 cursor-pointer transition-colors border-b border-slate-50 last:border-0"
                  >
                    <span className="font-medium">{item.nameEnglish}</span>
                    {item.unit?.nameEnglish && (
                      <span className="ml-2 text-xs text-slate-400">
                        ({item.unit.nameEnglish})
                      </span>
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

          {/* Qty + Unit */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>
                Qty <span className="text-red-500">*</span>
              </label>
              <input
                name="qty"
                type="number"
                value={form.qty}
                onChange={handleChange}
                placeholder="0"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Unit</label>
              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="GM, KG, PCS"
                className={inputClass}
              />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t flex gap-3 bg-slate-50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border text-slate-600 text-sm font-semibold hover:bg-slate-100"
          >
            Cancel
          </button>
          <button
            onClick={handleAdd}
            className="flex-1 py-2.5 rounded-xl bg-primary text-white text-sm font-bold hover:opacity-90 flex items-center justify-center gap-2"
          >
            <Plus size={16} /> Add Item
          </button>
        </div>
      </div>
    </>
  );
};

const AddStorePO = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAccountModalOpen, setIsAccountModalOpen] = useState(false);
    const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  
  const [items, setItems] = useState([]);
  const [supplier, setSupplier] = useState([]);
  const [stockTypes, setStockTypes] = useState([]);
  const [saving, setSaving] = useState(false);




  const [form, setForm] = useState({
    pocode: "",
    date: "",
    party_id: "",
    party_name: "",
    stock_type_id: "",
    invoice_type: "",
    remark: "",
  });

  const navigate = useNavigate();
  const userId = localStorage.getItem("userId");
const location = useLocation();
const editData = location.state?.editData || null;
const isEdit = !!editData;

  useEffect(() => {
  if (!editData) return;
  setForm({
    pocode: editData.pocode || "",
    date: editData.podate
      ? editData.podate.split("/").reverse().join("-")  
      : "",
    party_id: editData.partyId || "",
party_name: (() => {
  const match = supplier.find((s) => s.id === editData.partyId);
  return match ? `${match.eventNo} - ${match.party.nameEnglish}` : editData.partyName || "";
})(),
    stock_type_id: editData.stockTypeId || "",
    invoice_type: editData.invoicetype || "",
    remark: editData.remarks || "",
  });

  const prefilledItems = (editData.details || []).map((d) => ({
    rawMaterialId: d.rawMaterialId || 0,
    item_name: d.rawMaterialName || "",
    qty: d.qty || "",
    unit: d.unitName || "",
  }));
  setItems(prefilledItems);
}, [editData, supplier]);

  useEffect(() => {
    GetStockTypeByUserId(JSON.parse(userId))
      .then((res) => {
        const data = Array.isArray(res?.data?.data)
          ? res.data.data
          : Array.isArray(res?.data)
          ? res.data
          : [];
        setStockTypes(data);
      })
      .catch((err) => console.error("Failed to fetch stock types:", err));
  }, []);

  useEffect(() => {
    fetchSupplier();
  }, []);

  const fetchSupplier = async () => {
    try {
      const data = await GetEventMaster(userId);
      setSupplier(data?.data?.data["Event Details"] || []);
    } catch (error) {
      console.log(error);
    }
  };

  const typeOptions = stockTypes.map((t) => ({
    label: t.nameEnglish,
    value: t.stocktypeid ?? t.stockTypeId ?? t.id,
  }));

  const handleFormChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleAddItem = (item) => {
    setItems((prev) => [...prev, item]);
  };

  const handleDeleteItem = (index) => {
    setItems((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!form.party_id) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please select a party.", confirmButtonColor: "#3085d6" });
      return;
    }
    if (!form.stock_type_id) {
      Swal.fire({ icon: "warning", title: "Validation", text: "Please select a stock type.", confirmButtonColor: "#3085d6" });
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
        pocode: form.pocode,
        podate: form.date ? form.date.split("-").reverse().join("/") : "",
        partyId: form.party_id,
        stockTypeId: form.stock_type_id,
        invoicetype: form.invoice_type,
        remarks: form.remark,
        details: items.map((item) => ({
          rawMaterialId: item.rawMaterialId || 0,
          qty: parseFloat(item.qty) || 0,
        })),
      };

      await AddStorePOApi(payload);
      await Swal.fire({
        icon: "success",
        title: "Success!",
       text: isEdit ? "Store PO updated successfully." : "Store PO saved successfully.",
        confirmButtonColor: "#16a34a",
      });
      navigate("/stock-management/store-po");
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save Store PO. Please try again.",
        confirmButtonColor: "#d33",
      });
    } finally {
      setSaving(false);
    }
  };

  const fieldClass =
    "w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all";
  const labelClass =
    "text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-100 p-6 font-sans">
      <div className="max-w-6xl mx-auto space-y-5">

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-visible">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 rounded-t-2xl overflow-hidden">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-700">
                <FileText size={17} className="text-white" />
              </div>
<h2 className="text-green-900 font-bold text-base tracking-tight">
  {isEdit ? "Edit Store PO" : "Store PO Information"}
</h2>            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddItemModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors shadow-sm"
              >
                <User size={16} /> Add item
              </button>
              <button
                onClick={() => navigate("/stock-management/store-po")}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-800 text-white text-xs font-semibold hover:bg-slate-700 transition-colors shadow-sm"
              >
                <ArrowLeft size={16} /> Back
              </button>
            </div>
          </div>

          <div className="p-6 grid grid-cols-3 gap-x-6 gap-y-4">
            {/* Voucher No */}
            <div>
              <label className={labelClass}><Hash size={16} /> PO Code.</label>
              <input
                name="pocode"
                placeholder="PO Code"
                disabled
                value={form.pocode}
                onChange={handleFormChange}
                className={fieldClass}
              />
            </div>

            {/* Date */}
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

            {/* Invoice Type */}
            {/* <div>
              <label className={labelClass}><Tag size={16} /> Invoice Type</label>
              <input
                name="invoice_type"
                value={form.invoice_type}
                onChange={handleFormChange}
                placeholder="Enter invoice type"
                className={fieldClass}
              />
            </div> */}

            {/* Party Name (Supplier Select) */}
            <div className="col-span-2">
              <label className={labelClass}><User size={16} /> Party Name</label>
              <Select
                showSearch
                allowClear
                placeholder="Search party..."
                style={{ width: "100%", height: "38px" }}
                value={form.party_id || undefined}
                onChange={(val, option) => {
  console.log("Selected:", val, option); 
  setForm((prev) => ({
    ...prev,
    party_id: val,
    party_name: option?.label || "",
  }))
}}
                filterOption={(input, option) =>
                  option?.label?.toLowerCase().includes(input.toLowerCase())
                }
options={supplier.map((s) => ({ 
  value: s.party.id, 
  label: `${s.party.nameEnglish}` 
}))}                dropdownRender={(menu) => (
                  <>
                    {menu}
                    {/* <div
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => setIsAccountModalOpen(true)}
                      className="px-3 py-2 border-t border-slate-100 cursor-pointer text-blue-600 text-xs font-semibold hover:bg-blue-50 flex items-center gap-1.5"
                    >
                      <Plus size={13} /> Add New Party
                    </div> */}
                  </>
                )}
              />
            </div>

            {/* Stock Type */}
            <div>
              <label className={labelClass}><Tag size={16} /> Type</label>
              <Select
                showSearch
                allowClear
                placeholder="Select Type"
                style={{ width: "100%", height: "38px" }}
                options={typeOptions}
                value={form.stock_type_id || undefined}
                onChange={(value) =>
                  setForm((prev) => ({ ...prev, stock_type_id: value }))
                }
                filterOption={(input, option) =>
                  (option?.label ?? "").toLowerCase().includes(input.toLowerCase())
                }
              />
            </div>

            {/* Remark */}
            <div className="col-span-3">
              <label className={labelClass}><AlignLeft size={16} /> Remark</label>
              <input
                name="remark"
                value={form.remark}
                onChange={handleFormChange}
                placeholder="Optional remark..."
                className={fieldClass}
              />
            </div>
          </div>
        </div>

        {/* ── Store PO Details Card ── */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-primary">
                <ShoppingCart size={17} className="text-white" />
              </div>
              <h2 className="text-blue-900 font-bold text-base tracking-tight">Store PO Details</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-2 px-5 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-green-700 disabled:opacity-60"
              >
                <Save size={16} /> {saving ? "Saving..." : isEdit ? "Update" : "Save"}              </button>
              <button
                onClick={() => setIsSidebarOpen(true)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-white text-xs font-bold transition-all hover:opacity-90 shadow-sm bg-primary"
              >
                <Plus size={16} /> Add
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-100">
                  {["Item Name", "Qty", "Unit", ""].map((h) => (
                    <th
                      key={h}
                      className="px-4 py-3 text-left text-xs font-bold text-slate-500 uppercase tracking-wider whitespace-nowrap"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-slate-400 text-sm">
                      <div className="flex flex-col items-center gap-2">
                        <Package size={32} className="text-slate-300" />
                        <p>No items added yet.</p>
                        <button
                          onClick={() => setIsSidebarOpen(true)}
                          className="text-primary font-semibold text-xs flex items-center gap-1 hover:underline"
                        >
                          <Plus size={12} /> Add your first item
                        </button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  items.map((item, i) => (
                    <tr
                      key={i}
                      className="border-b border-slate-50 hover:bg-blue-50/30 transition-colors group"
                    >
                      <td className="px-4 py-3 font-semibold text-slate-800">{item.item_name}</td>
                      <td className="px-4 py-3 font-medium text-slate-700">{item.qty}</td>
                      <td className="px-4 py-3 text-slate-500">{item.unit}</td>
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
        </div>
      </div>

      {/* Add New Party Modal */}
      <AddContactName
        isModalOpen={isAccountModalOpen}
        setIsModalOpen={setIsAccountModalOpen}
        contactTypeId={3}
        onClose={() => setIsAccountModalOpen(false)}
        refreshData={fetchSupplier}
        concatId={3}
      />
            <AddRawMaterial isOpen={isAddItemModalOpen} onClose={() => setIsAddItemModalOpen(false)} setIsModalOpen={setIsAddItemModalOpen} refreshData={handleAddItem} />
      

      {/* Add Item Sidebar */}
      <AddItemSidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
};

export default AddStorePO;