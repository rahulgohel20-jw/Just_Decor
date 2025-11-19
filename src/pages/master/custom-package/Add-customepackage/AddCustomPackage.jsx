import { useState, useMemo, useEffect } from "react";
import CategoryListpackage from "./component/CategoryListpackage";
import MenuItemGridPackage from "./component/MenuItemGridPackage";
import SelectedItemPackage from "./component/SelectedItemPackage";
import { AddCustomPackageapi } from "@/services/apiServices";
import Swal from "sweetalert2";

import {
  GetAllCategoryformenu,
  Getmenuitemsusingcatid,
} from "@/services/apiServices";

function AddCustomPackage() {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryItemCounts, setCategoryItemCounts] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);

  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  // ✅ Load Categories on First Render
  useEffect(() => {
    fetchCategories();
  }, []);
  useEffect(() => {
    if (categories.length > 0) {
      setCategoryOrder(categories.map((c) => String(c.id)));
    }
  }, [categories]);

  const fetchCategories = async () => {
    try {
      const userId = localStorage.getItem("userId") || 1;
      const res = await GetAllCategoryformenu(userId);

      if (res?.data) {
        const fetchedCategories = res.data.data["Menu Category Details"] || [];
        setCategories(fetchedCategories);

        const counts = {};

        counts["all"] = categoryItemCounts["all"] ?? 0;

        fetchedCategories.forEach((cat) => {
          const key = String(cat.id);
          counts[key] = categoryItemCounts[key] ?? 0; // ← DO NOT OVERWRITE
        });

        setCategoryItemCounts(counts);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  // ----------------------------------------------
  // FIXED ITEM SELECTION HANDLER
  // ----------------------------------------------
  const handleToggleItem = (item) => {
    const existingIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingIndex !== -1) {
      setSelectedItems(selectedItems.filter((_, idx) => idx !== existingIndex));
      return;
    }

    // FIX: Always use category from API structure
    const categoryId = item.menuCategory?.id;

    setSelectedItems([
      ...selectedItems,
      {
        ...item,
        rate: 0,
        category: String(categoryId), // <-- THIS FIXES YOUR GROUPING
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    setSelectedItems(selectedItems.filter((_, idx) => idx !== index));
  };

  const handleUpdateRate = (index, rate) => {
    const updated = [...selectedItems];
    updated[index] = { ...updated[index], rate };
    setSelectedItems(updated);
  };

  const handleCategoryItemCountChange = (categoryId, count) => {
    setCategoryItemCounts((prev) => ({
      ...prev,
      [String(categoryId)]: Number(count),
    }));
  };

  const handleReorderCategories = (fromIndex, toIndex) => {
    setCategoryOrder((prevOrder) => {
      const updated = [...prevOrder];
      const moved = updated.splice(fromIndex, 1)[0];
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleReorderItems = (fromIndex, toIndex) => {
    const newItems = [...selectedItems];
    const [movedItem] = newItems.splice(fromIndex, 1);
    newItems.splice(toIndex, 0, movedItem);
    setSelectedItems(newItems);
  };

  const handleMoveItemToCategory = (itemIndex, newCategoryId) => {
    const updated = [...selectedItems];
    updated[itemIndex] = { ...updated[itemIndex], category: newCategoryId };
    setSelectedItems(updated);
  };

  // ----------------------------------------------
  // FORM HANDLING
  // ----------------------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nameEnglish.trim()) {
      newErrors.nameEnglish = "English name is required";
    }

    if (!formData.price || parseFloat(formData.price) <= 0) {
      newErrors.price = "Valid price is required";
    }

    if (selectedItems.length === 0) {
      newErrors.items = "Please select at least one item";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const buildPackagePayload = () => {
    const userId = Number(localStorage.getItem("userId"));

    // STEP 1: Group items based on their ORDER in selectedItems
    const grouped = {};
    selectedItems.forEach((item) => {
      const cat = String(item.category);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    // STEP 2: Use the order of categories as they appear in selectedItems
    const categoryOrder = [
      ...new Set(selectedItems.map((i) => String(i.category))),
    ];

    // STEP 3: Build API payload
    const customPackageDetails = categoryOrder.map((catId, index) => {
      const items = grouped[catId] || [];

      return {
        anyItem: Number(categoryItemCounts[catId] || 0),
        menuId: Number(catId),
        menuName: categoryMap[catId] || "Category",
        menuInstruction: "",
        menuSortOrder: index + 1,

        customPackageMenuItemDetails: items.map((it, i) => ({
          id: 0,
          itemInstruction: "",
          itemName: it.itemName || it.nameEnglish,
          itemPrice: Number(it.rate || 0),
          itemSortOrder: i + 1,
          menuItemId: Number(it.id),
          userId,
        })),
      };
    });

    return {
      nameEnglish: formData.nameEnglish,
      nameGujarati: formData.nameGujarati,
      nameHindi: formData.nameHindi,
      price: Number(formData.price),
      sequence: 1,
      userId,
      customPackageDetails,
    };
  };

  const handleSave = async () => {
    if (!validateForm()) {
      alert("Please fix all errors before saving");
      return;
    }

    const payload = buildPackagePayload();

    try {
      const response = await AddCustomPackageapi(payload);

      if (response?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: "Package Saved!",
          text: response.data.msg,
          timer: 2000,
          showConfirmButton: false,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.msg,
        });
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
    }
  };

  const handleCancel = () => {
    if (confirm("Are you sure you want to cancel? All changes will be lost.")) {
      setSelectedItems([]);
      setFormData({
        nameEnglish: "",
        nameGujarati: "",
        nameHindi: "",
        price: "",
      });
      setErrors({});
      setCategoryItemCounts({});
    }
  };

  // ----------------------------------------------
  // MEMOIZED VALUES
  // ----------------------------------------------
  const selectedItemIds = useMemo(() => {
    return new Set(selectedItems.map((item) => item.id));
  }, [selectedItems]);

  const categoryMap = useMemo(() => {
    const map = {};
    map["all"] = "All";
    categories.forEach((cat) => {
      map[cat.id] = cat.nameEnglish;
    });
    return map;
  }, [categories]);

  // ----------------------------------------------
  // RENDER
  // ----------------------------------------------
  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold mb-4">Add Custom Package</h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (English) *
            </label>
            <input
              name="nameEnglish"
              value={formData.nameEnglish}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.nameEnglish ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.nameEnglish && (
              <p className="text-red-500 text-sm mt-1">{errors.nameEnglish}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (ગુજરાતી)
            </label>
            <input
              name="nameGujarati"
              value={formData.nameGujarati}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name (हिंदी)
            </label>
            <input
              name="nameHindi"
              value={formData.nameHindi}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price *
            </label>
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg ${
                errors.price ? "border-red-500" : "border-gray-300"
              }`}
              min="0"
            />
            {errors.price && (
              <p className="text-red-500 text-sm mt-1">{errors.price}</p>
            )}
          </div>
        </div>

        {errors.items && (
          <p className="text-red-500 text-sm mt-2">{errors.items}</p>
        )}
      </div>

      <div className="h-screen flex flex-col p-4">
        <div className="flex-1 flex overflow-hidden">
          <CategoryListpackage
            selectedCategory={selectedCategory}
            onSelectCategory={setSelectedCategory}
            categories={categories}
            setCategories={setCategories}
            categoryItemCounts={categoryItemCounts}
            onCategoryItemCountChange={handleCategoryItemCountChange}
            onReorderCategories={handleReorderCategories}
            GetAllCategoryformenu={GetAllCategoryformenu}
          />

          <MenuItemGridPackage
            selectedCategory={selectedCategory}
            onToggleItem={handleToggleItem}
            selectedItemIds={selectedItemIds}
            Getmenuitemsusingcatid={Getmenuitemsusingcatid}
          />

          <SelectedItemPackage
            selectedItems={selectedItems}
            onRemoveItem={handleRemoveItem}
            onUpdateRate={handleUpdateRate}
            categoryMap={categoryMap}
            categoryItemCounts={categoryItemCounts}
            onReorderItems={handleReorderItems}
            onReorderCategories={handleReorderCategories}
            categoryOrder={categoryOrder}
          />
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddCustomPackage;
