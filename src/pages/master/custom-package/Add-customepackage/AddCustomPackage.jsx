import { useState, useMemo, useEffect } from "react";
import CategoryListpackage from "./component/CategoryListpackage";
import MenuItemGridPackage from "./component/MenuItemGridPackage";
import SelectedItemPackage from "./component/SelectedItemPackage";
import { useNavigate } from "react-router-dom";
import AddMenuCategory from "../../../../partials/modals/add-menu-category/AddMenuCategory";
import {
  AddCustomPackageapi,
  GetCustomPackageById,
  UpdateCustomPackage,
} from "@/services/apiServices";
import Swal from "sweetalert2";
import {
  GetAllCategoryformenu,
  Getmenuitemsusingcatid,
} from "@/services/apiServices";
import AddMenuItem from "../../../../partials/modals/add-menu-item/AddMenuItem";
import MenuNotes from "../../../../partials/modals/menu-notes/MenuNotes";
import { useParams, useSearchParams } from "react-router-dom";
import { Translateapi } from "../../../../services/apiServices";
import { useRef } from "react";

function AddCustomPackage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const packageId = searchParams.get("id");

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedItems, setSelectedItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoryItemCounts, setCategoryItemCounts] = useState({});
  const [categoryOrder, setCategoryOrder] = useState([]);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [isAddItemModalOpen, setIsAddItemModalOpen] = useState(false);
  const [isLoadingPackage, setIsLoadingPackage] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  const debounceRef = useRef(null);

  const [notesModal, setNotesModal] = useState({
    isOpen: false,
    itemIndex: null,
    notes: { itemsNotes: "", itemSlogan: "" },
  });

  const [formData, setFormData] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    price: "",
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (packageId) {
      loadPackageData(packageId);
    }
  }, [packageId]);

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSaveNotes = (newNotes) => {
    if (String(notesModal.itemIndex).startsWith("cat-")) {
      const categoryId = notesModal.itemIndex.replace("cat-", "");

      setCategoryItemCounts((prev) => ({
        ...prev,
        [categoryId]: {
          ...prev[categoryId],
          menuInstruction: newNotes.itemsNotes || "",
        },
      }));
    } else {
      setSelectedItems((prev) =>
        prev.map((item, idx) =>
          idx === notesModal.itemIndex
            ? {
                ...item,
                itemsNotes: newNotes.itemsNotes || "",
                itemSlogan: newNotes.itemSlogan || "",
              }
            : item
        )
      );
    }

    // Close modal after saving
    setNotesModal({
      isOpen: false,
      itemIndex: null,
      notes: { itemsNotes: "", itemSlogan: "" },
    });
  };

  const handleOpenCategoryNotes = (categoryId) => {
    setNotesModal({
      isOpen: true,
      itemIndex: `cat-${categoryId}`,
      notes: {
        itemsNotes: categoryItemCounts[categoryId]?.menuInstruction || "",
        itemSlogan: "",
      },
    });
  };

  // ✅ NEW: Load existing package data
  const loadPackageData = async (id) => {
    setIsLoadingPackage(true);
    try {
      const response = await GetCustomPackageById(id);

      if (
        response?.data?.success &&
        response.data.data["Package Details"]?.[0]
      ) {
        const packageData = response.data.data["Package Details"][0];

        // Set form data
        setFormData({
          nameEnglish: packageData.nameEnglish || "",
          nameGujarati: packageData.nameGujarati || "",
          nameHindi: packageData.nameHindi || "",
          price: packageData.price?.toString() || "",
        });

        // Wait for categories to load first
        await fetchCategories();

        // Process package details to reconstruct selected items
        const itemsToSelect = [];
        const counts = {};

        // Sort by menuSortOrder to maintain order
        const sortedDetails = [...packageData.customPackageDetails].sort(
          (a, b) => a.menuSortOrder - b.menuSortOrder
        );
        setCategoryOrder(sortedDetails.map((d) => String(d.menuId)));

        for (const detail of sortedDetails) {
          const categoryId = String(detail.menuId);

          // Set anyItem count for this category
          if (detail.anyItem) {
            counts[categoryId] = detail.anyItem;
          }

          // Sort items by itemSortOrder
          const sortedItems = [...detail.customPackageMenuItemDetails].sort(
            (a, b) => a.itemSortOrder - b.itemSortOrder
          );

          // Fetch full item details for each menu item
          for (const item of sortedItems) {
            try {
              // Fetch the full item data using the menuItemId
              const itemResponse = await Getmenuitemsusingcatid(
                1,
                100,
                localStorage.getItem("userId") || 1,
                detail.menuId
              );

              const fullItem = itemResponse.data?.data?.items?.find(
                (i) => i.id === item.menuItemId
              );

              if (fullItem) {
                itemsToSelect.push({
                  ...fullItem,
                  rate: item.itemPrice || 0,
                  category: categoryId,
                  itemsNotes: item.itemInstruction || "",
                  itemSlogan: "", // Not stored in API, default empty
                });
              } else {
                // Fallback: create item from API data if full item not found
                itemsToSelect.push({
                  id: item.menuItemId,
                  nameEnglish: item.itemName,
                  rate: item.itemPrice || 0,
                  category: categoryId,
                  itemsNotes: item.itemInstruction || "",
                  itemSlogan: "",
                  menuCategory: {
                    id: detail.menuId,
                    nameEnglish: detail.menuName,
                  },
                });
              }
            } catch (err) {
              console.error(`Error fetching item ${item.menuItemId}:`, err);
              // Fallback item
              itemsToSelect.push({
                id: item.menuItemId,
                nameEnglish: item.itemName,
                rate: item.itemPrice || 0,
                category: categoryId,
                itemsNotes: item.itemInstruction || "",
                itemSlogan: "",
                menuCategory: {
                  id: detail.menuId,
                  nameEnglish: detail.menuName,
                },
              });
            }
          }
        }

        setSelectedItems(itemsToSelect);
        setCategoryItemCounts(counts);
      }
    } catch (error) {
      console.error("Error loading package:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to load package data",
      });
    } finally {
      setIsLoadingPackage(false);
    }
  };

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
          counts[key] = categoryItemCounts[key] ?? 0;
        });

        setCategoryItemCounts(counts);
      }
    } catch (err) {
      console.error("Error loading categories:", err);
    }
  };

  const refreshMenuItems = () => {};

  const handleOpenNotes = (index) => {
    const item = selectedItems[index];

    setNotesModal({
      isOpen: true,
      itemIndex: index,
      notes: {
        itemsNotes: item?.itemsNotes || "",
        itemSlogan: item?.itemSlogan || "",
      },
    });
  };

  if (String(notesModal.itemIndex).startsWith("cat-")) {
    const categoryId = notesModal.itemIndex.replace("cat-", "");

    setCategoryItemCounts((prev) => ({
      ...prev,
      [categoryId]: {
        ...prev[categoryId],
        menuInstruction: newNotes.itemsNotes,
      },
    }));
  } else {
    // Item notes logic stays same
  }

  const handleToggleItem = (item) => {
    const existingIndex = selectedItems.findIndex(
      (selectedItem) => selectedItem.id === item.id
    );

    if (existingIndex !== -1) {
      setSelectedItems(selectedItems.filter((_, idx) => idx !== existingIndex));
      return;
    }

    const categoryId = item.menuCategory?.id;

    setSelectedItems([
      ...selectedItems,
      {
        ...item,
        rate: 0,
        category: String(categoryId),
        itemsNotes: "",
        itemSlogan: "",
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

  const handleReorder = (reorderedItems) => {
    setSelectedItems([...reorderedItems]);
  };

  const handleReorderCategories = (fromIndex, toIndex) => {
    setCategoryOrder((prevOrder) => {
      const updated = [...prevOrder];
      const moved = updated.splice(fromIndex, 1)[0];
      updated.splice(toIndex, 0, moved);
      return updated;
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }

    // Translate only English field
    if (name === "nameEnglish") {
      if (debounceRef.current) clearTimeout(debounceRef.current);

      // If empty, clear other fields
      if (!value.trim()) {
        setFormData((prev) => ({
          ...prev,
          nameGujarati: "",
          nameHindi: "",
        }));
        return;
      }

      debounceRef.current = setTimeout(async () => {
        try {
          const res = await Translateapi(encodeURIComponent(value));

          // Handle multiple API shapes
          const data = res?.data?.data || res?.data || res;

          setFormData((prev) => ({
            ...prev,
            nameGujarati: data?.gujarati || prev.nameGujarati,
            nameHindi: data?.hindi || prev.nameHindi,
          }));
        } catch (error) {
          console.error("Translate error:", error);
        }
      }, 500);
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

    // Group items based on their ORDER in selectedItems
    const grouped = {};
    selectedItems.forEach((item) => {
      const cat = String(item.category);
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(item);
    });

    // Use the order of categories as they appear in selectedItems
    const categoryOrder = [
      ...new Set(selectedItems.map((i) => String(i.category))),
    ];

    // Build API payload
    const customPackageDetails = categoryOrder.map((catId, index) => {
      const items = grouped[catId] || [];

      return {
        anyItem: Number(categoryItemCounts[catId] || 0),
        menuId: Number(catId),
        menuName: categoryMap[catId] || "Category",
        menuInstruction: "",
        menuSortOrder: index + 1,

        customPackageMenuItemDetails: items.map((it, i) => ({
          id: it.id || 0,
          itemInstruction: it.itemsNotes || "",
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
      Swal.fire({
        icon: "warning",
        title: "Validation Error",
        text: "Please fix all errors before saving",
      });
      return;
    }

    const payload = buildPackagePayload();

    try {
      let response;

      if (packageId) {
        // UPDATE existing package
        response = await UpdateCustomPackage(packageId, payload);
      } else {
        // CREATE new package
        response = await AddCustomPackageapi(payload);
      }

      if (response?.data?.success === true) {
        Swal.fire({
          icon: "success",
          title: packageId ? "Package Updated!" : "Package Saved!",
          text: response.data.msg,
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/master/custom-package");
        });

        // Optionally redirect back or clear form
        // window.history.back();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response?.data?.msg || "Failed to save package",
        });
      }
    } catch (err) {
      console.error("SAVE ERROR:", err);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving the package",
      });
    }
  };

  const handleCancel = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "All changes will be lost.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, cancel",
      cancelButtonText: "No, stay",
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      reverseButtons: true,
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/master/custom-package");
      }
    });
  };

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

  // Show loading spinner while loading package
  if (isLoadingPackage) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading package data...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold mb-4">
          {packageId ? "Edit Packages" : "Create New Packages"}
        </h2>
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
            onAddCategory={() => setIsAddCategoryModalOpen(true)}
          />

          <MenuItemGridPackage
            selectedCategory={selectedCategory}
            onToggleItem={handleToggleItem}
            selectedItemIds={selectedItemIds}
            Getmenuitemsusingcatid={Getmenuitemsusingcatid}
            onAddMenuItem={() => setIsAddItemModalOpen(true)}
          />

          <SelectedItemPackage
            selectedItems={selectedItems}
            onRemoveItem={handleRemoveItem}
            onUpdateRate={handleUpdateRate}
            categoryMap={categoryMap}
            categoryItemCounts={categoryItemCounts}
            onReorder={handleReorder}
            onOpenNotes={handleOpenNotes}
            categoryOrder={categoryOrder} // ADD THIS
            onReorderCategories={handleReorderCategories} // ADD THIS
            onOpenCategoryNotes={handleOpenCategoryNotes} // FOR CATEGORY NOTES
          />
        </div>

        <div className="bg-white border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
          <button
            onClick={handleCancel}
            className="px-3 py-1 border border-gray-300 rounded text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            {packageId ? "Update Package" : "Save Package"}
          </button>
        </div>
      </div>

      <AddMenuCategory
        isModalOpen={isAddCategoryModalOpen}
        setIsModalOpen={setIsAddCategoryModalOpen}
        refreshData={fetchCategories}
        editData={null}
      />

      <AddMenuItem
        isModalOpen={isAddItemModalOpen}
        setIsModalOpen={setIsAddItemModalOpen}
        refreshData={refreshMenuItems}
        selectedMenuItem={null}
      />

      {notesModal.isOpen && (
        <MenuNotes
          isOpen={notesModal.isOpen}
          notes={notesModal.notes}
          onClose={() =>
            setNotesModal({ isOpen: false, itemIndex: null, notes: null })
          }
          onSave={handleSaveNotes}
        />
      )}
    </div>
  );
}

export default AddCustomPackage;
