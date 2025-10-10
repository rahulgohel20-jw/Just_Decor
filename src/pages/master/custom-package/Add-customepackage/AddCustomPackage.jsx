import { Fragment, useState, useEffect, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
import { useCategories, useMenuItems } from "../../../master/custom-package/Add-customepackage/hook/usePackageData";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";
import { 
  Translateapi, 
  AddCustomPackageapi, 
  UpdateCustomPackageapi, 
  GetCustomPackageapi 
} from "@/services/apiServices";

const AddCustomPackage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get package ID from URL query params
  const searchParams = new URLSearchParams(location.search);
  const packageId = searchParams.get("id");
  const isEditMode = !!packageId;

  const [search, setSearch] = useState("");
  const [itemNotes, setItemNotes] = useState({});
  const [categoryNotes, setCategoryNotes] = useState({});
  const [childSearch, setChildSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [numberOfItems, setNumberOfItems] = useState("");
  const [loading, setLoading] = useState(false);

  const [showItemNoteModal, setShowItemNoteModal] = useState(false);
  const [currentItemForNotes, setCurrentItemForNotes] = useState(null);

  const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
  const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);

  const { categories, fetchCategories } = useCategories();
  const { menuItems, loading: menuLoading, fetchMenuItems, allMenuItems } = useMenuItems();

  const [initialValues, setInitialValues] = useState({
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    price: "",
  });

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchMenuItems(0);
  }, []);

  // Fetch package details if in edit mode
  useEffect(() => {
    if (packageId && categories.length > 0) {
      fetchPackageDetails(packageId);
    }
  }, [packageId, categories]);

    const fetchPackageDetails = async (id) => {
  try {
    setLoading(true);
    const userData = JSON.parse(localStorage.getItem("userData"));
    const res = await GetCustomPackageapi(userData.id);

    console.log("✅ All menu items loaded:", allMenuItems.length);

    const allPackages = res?.data?.data?.["Package Details"] || [];
    const selectedPackage = allPackages.find((pkg) => pkg.id === parseInt(id));

    if (!selectedPackage) {
      console.warn("⚠️ No package found with ID:", id);
      return;
    }

    // 1️⃣ Set form values
    setInitialValues({
      nameEnglish: selectedPackage.nameEnglish || "",
      nameGujarati: selectedPackage.nameGujarati || "",
      nameHindi: selectedPackage.nameHindi || "",
      price: selectedPackage.price || "",
    });

    console.log("✅ Form values set:", {
      nameEnglish: selectedPackage.nameEnglish,
      price: selectedPackage.price,
    });

    // 2️⃣ Fetch menu items
    console.log("🔄 Fetching all menu items...");
    await fetchMenuItems(0);
    console.log("✅ Menu items fetched");

    // 3️⃣ Extract selected items correctly
    const extractedItems = [];
    const extractedItemNotes = {};
    const extractedCategoryNotes = {};
    let anyItemCount = 0;

    const allDetails = selectedPackage.customPackageDetails || [];
    console.log("📋 Package Details Count:", allDetails.length);

  customPackageMenuItemDetails

    console.log("✅ EXTRACTED DATA FROM BACKEND:");
    console.log("  Selected Item IDs:", extractedItems);
    console.log("  Category Notes:", extractedCategoryNotes);
    console.log("  Item Notes:", extractedItemNotes);
    console.log("  Any Item Count:", anyItemCount);

    // 4️⃣ Update state once
    setSelectedItems(extractedItems);
    setItemNotes(extractedItemNotes);
    setCategoryNotes(extractedCategoryNotes);
    if (anyItemCount > 0) setNumberOfItems(anyItemCount.toString());

    console.log("✅ State updated successfully");

  } catch (err) {
    console.error("❌ Error fetching package:", err);
    Swal.fire("Error", "Failed to load package details.", "error");
  } finally {
    setLoading(false);
  }
};


  const handleItemNoteClick = (itemId) => {
    setCurrentItemForNotes(itemId);
    setItemNotes((prev) => ({
      ...prev,
      [itemId]: prev[itemId] || "",
    }));
    setShowItemNoteModal(true);
  };

  const handleCategoryNoteClick = (categoryName) => {
    setCurrentCategoryForNotes(categoryName);
    setCategoryNotes((prev) => ({
      ...prev,
      [categoryName]: prev[categoryName] || "",
    }));
    setShowCategoryNoteModal(true);
  };

  const handleItemNoteSave = (savedNotes) => {
    if (currentItemForNotes !== null) {
      setItemNotes((prev) => ({
        ...prev,
        [currentItemForNotes]: savedNotes.itemsNotes || "",
      }));
    }
    setShowItemNoteModal(false);
    setCurrentItemForNotes(null);
  };

  const handleCategoryNoteSave = (savedNotes) => {
    if (currentCategoryForNotes !== null) {
      setCategoryNotes((prev) => ({
        ...prev,
        [currentCategoryForNotes]: savedNotes.categoryNotes || "",
      }));
      setShowCategoryNoteModal(false);
      setCurrentCategoryForNotes(null);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    await fetchMenuItems(categoryId);
  };

  const handleUpdateItemNote = (itemId, note) => {
    setItemNotes((prev) => ({
      ...prev,
      [itemId]: note,
    }));
  };

  const handleUpdateCategoryNote = (categoryName, note) => {
    setCategoryNotes((prev) => ({
      ...prev,
      [categoryName]: note,
    }));
  };

  const handleReorder = ({ sourceCategory, destCategory, sourceIndex, destIndex, itemId }) => {
    setSelectedItems((prev) => {
      const newItems = [...prev];
      const itemIndex = newItems.indexOf(Number(itemId));

      if (itemIndex === -1) return prev;

      const [movedItem] = newItems.splice(itemIndex, 1);
      let newIndex = destIndex;
      if (sourceCategory === destCategory && sourceIndex < destIndex) {
        newIndex--;
      }

      newItems.splice(newIndex, 0, movedItem);
      return newItems;
    });
  };

const allItemsPool = useMemo(() => {
  // Combine currently loaded menuItems + allMenuItems
  const combined = [...menuItems, ...allMenuItems];

  // Ensure selected items from edit mode are included
  selectedItems.forEach(id => {
    id = Number(id);
    if (!combined.find(item => Number(item.id) === id)) {
      const storedItem = allMenuItems.find(item => Number(item.id) === id);
      if (storedItem) combined.push(storedItem);
      else console.warn(`⚠️ Selected item ${id} not found in allMenuItems!`);
    }
  });

  // Deduplicate by id
  return [...new Map(combined.map(i => [i.id, i])).values()];
}, [menuItems, allMenuItems, selectedItems]);

 const toggleChildSelection = (id) => {
  id = Number(id);
  setSelectedItems(prev => {
    const exists = prev.includes(id);
    if (exists) return prev.filter(pid => pid !== id);
    return [...prev, id];
  });
};


  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const menuItemsWithSelectionState = menuItems.map((item) => ({
    ...item,
    isSelected: selectedItems.includes(item.id),
  }));

  const filteredChildren = menuItemsWithSelectionState.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  const mergedMap = new Map(allItemsPool.map((item) => [item.id, item]));
  const selectedMenuItems = selectedItems
    .map((id) => {
      const itm = mergedMap.get(id);
      if (!itm) {
        console.warn("⚠️ Selected item missing from pool:", id);
      } else {
        console.log("✅ Found item in pool:", id, itm.name);
      }
      return itm;
    })
    .filter(Boolean);

  console.log("📊 SELECTED MENU ITEMS SUMMARY:");
  console.log("  Total selected IDs:", selectedItems.length);
  console.log("  Found in pool:", selectedMenuItems.length);
  console.log("  Items:", selectedMenuItems.map(i => `${i.id}: ${i.name}`));

  const selectedItemsByCategory = useMemo(() => {
    console.log("🔄 Grouping selected items by category...");
    console.log("  selectedMenuItems count:", selectedMenuItems.length);
    console.log("  categories count:", categories.length);
    
    const grouped = {};

    // Group items by category
    selectedMenuItems.forEach(item => {
      const category = categories.find(cat => cat.id === item.parentId) || { id: 0, name: "Uncategorized" };
      console.log(`  📂 Item "${item.name}" → Category "${category.name}"`);
      
      if (!grouped[category.name]) grouped[category.name] = [];
      grouped[category.name].push(item);
    });

    // Add "Any X Items" block if number entered
    const anyCount = parseInt(numberOfItems) || 0;
    if (anyCount > 0) {
      grouped[`Any ${anyCount} Items`] = [{ 
        id: `any-${anyCount}`, 
        name: `Any ${anyCount} items from selected categories`, 
        isPlaceholder: true 
      }];
      console.log(`  🔢 Added "Any ${anyCount} Items" placeholder`);
    }

    console.log("✅ Grouped categories:", Object.keys(grouped));
    console.log("✅ Full grouped data:", grouped);

    return grouped;
  }, [selectedMenuItems, categories, numberOfItems]);

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
    
    setItemNotes((prev) => {
      const newNotes = { ...prev };
      delete newNotes[itemId];
      return newNotes;
    });
  };

  const totalSelectedCount = selectedItems.length;
  const calculateTotalPrice = (packagePrice = 0) => Number(packagePrice || 0);

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Name is required"),
    price: Yup.number()
      .required("Price is required")
      .positive("Must be positive"),
  });

 const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    setSubmitting(true);
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedData?.id || 0;
    const packageIdNumber = Number(packageId);

    if (selectedItems.length === 0) {
      Swal.fire("Error", "No items selected.", "error");
      return;
    }

    // Filter selected items against allItemsPool
    const validItems = selectedItems
      .map(id => allItemsPool.find(itm => itm.id === id))
      .filter(Boolean);

    if (validItems.length === 0) {
      Swal.fire("Error", "No valid items found.", "error");
      return;
    }

    console.log("🔄 Grouping selected items by category...");
console.log("  selectedItems:", selectedItems);
console.log("  allItemsPool:", allItemsPool.map(i => ({ id: i.id, name: i.name, parentId: i.parentId })));

console.log("🟢 VALID ITEMS FOUND:", validItems.map(v => ({ id: v.id, name: v.name, parentId: v.parentId })));

;


// Map items by their parent (menuId)
const categoryMap = new Map();
validItems.forEach(item => {
  // if parentId is missing, fallback to menuItemId (used in edit mode)
  const parentId = item.parentId || item.menuItemId;
  const category = categories.find(cat => cat.id === parentId);

  const catId = category?.id || 0;
  const catName = category?.name || "Uncategorized";

  if (!categoryMap.has(catId)) {
    categoryMap.set(catId, { catName, items: [] });
  }
  categoryMap.get(catId).items.push(item);
});

console.log("✅ Grouped Categories:", Array.from(categoryMap.keys()));
console.log("✅ Full Grouped Data:", Object.fromEntries(categoryMap));


    // Build customPackageDetails
    const customPackageDetails = Array.from(categoryMap.entries()).map(
      ([catId, { catName, items }], idx) => {
        const menuItems = items.map((item, itemIdx) => ({
          id: item.id || 0 , // Backend may ignore this for new entries
          menuItemId: Number(item.id),
          itemName: item.name || "Unnamed",
          itemInstruction: itemNotes[item.id] || "",
          itemPrice: Number(item.price || 0),
          itemSortOrder: itemIdx + 1,
          userId,
        }));

        return {
          menuId: Number(catId),
          menuName: catName,
          menuInstruction: categoryNotes[catName] || "",
          menuSortOrder: idx + 1,
          anyItem: parseInt(numberOfItems) || 0,
          customPackageMenuItemDetails: menuItems,
        };
      }
    );

    // Final payload
    const payload = {
      id: packageIdNumber || 0,
      nameEnglish: values.nameEnglish,
      nameGujarati: values.nameGujarati || "",
      nameHindi: values.nameHindi || "",
      price: Number(values.price),
      sequence: 1,
      userId,
      customPackageDetails,
    };

    console.log("📤 Payload to API:", JSON.stringify(payload, null, 2));

    // API call
    if (isEditMode) {
      const res = await UpdateCustomPackageapi(packageIdNumber, payload);
      console.log("✅ Update API response:", res.data);
      Swal.fire("Success", "Custom Package updated successfully.", "success");
      navigate(-1);
    } else {
      const res = await AddCustomPackageapi(payload);
      console.log("✅ Add API response:", res.data);
      Swal.fire("Success", "Custom Package created successfully.", "success");
      resetForm();
      setSelectedItems([]);
      setItemNotes({});
      setCategoryNotes({});
      setNumberOfItems("");
    }
  } catch (err) {
    console.error("❌ Error saving package:", err.response?.data || err.message);
    Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
  } finally {
    setSubmitting(false);
  }
};


  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs 
            items={[{ 
              title: isEditMode ? "Edit Custom Package" : "Add Custom Package" 
            }]} 
          />
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading package details...</p>
            </div>
          </div>
        ) : (
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting, values, setFieldValue }) => {
              const [debounceTimer, setDebounceTimer] = useState(null);

              useEffect(() => {
                if (!values.nameEnglish?.trim() || isEditMode) return;
                if (debounceTimer) clearTimeout(debounceTimer);

                const timer = setTimeout(() => {
                  Translateapi(values.nameEnglish)
                    .then((res) => {
                      setFieldValue("nameGujarati", res.data.gujarati || "");
                      setFieldValue("nameHindi", res.data.hindi || "");
                    })
                    .catch(() => {});
                }, 500);

                setDebounceTimer(timer);
                return () => clearTimeout(timer);
              }, [values.nameEnglish]);

              return (
                <>
                  <Form className="flex flex-col gap-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <InputWithFormik label="Name (English)" name="nameEnglish" />
                        <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
                        <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
                        <InputWithFormik label="Price" name="price" type="number" />
                      </div>
                    </div>

                    <div className="border rounded-lg p-4 mb-4 bg-white">
                      <h3 className="text-lg font-semibold mb-3">
                        Custom Package Items
                      </h3>
                      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
                        <div className="col-span-3">
                          <div className="flex flex-col h-[600px] border rounded-lg bg-white relative">
                            <div className="sticky top-0 z-10 bg-white border-b p-3">
                              <SearchInput
                                placeholder="Search categories"
                                value={search}
                                onChange={setSearch}
                              />
                            </div>

                            <div className="flex-1 overflow-auto p-2">
                              {filteredCategories.map((cat) => {
                                const isSelected = selectedCategoryId === cat.id;
                                return (
                                  <div
                                    key={cat.id}
                                    className={`mb-2 border rounded-md ${
                                      isSelected
                                        ? "border-primary bg-primary/5"
                                        : "border-gray-200"
                                    }`}
                                  >
                                    <div
                                      onClick={() => handleCategoryChange(cat.id)}
                                      className="p-2 cursor-pointer flex justify-between items-center"
                                    >
                                      <span className="font-medium text-gray-800">
                                        {cat.name}
                                      </span>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>

                            <div className="sticky bottom-0 z-20 bg-white border-t p-3">
                              <label className="block text-xs font-medium text-gray-700 mb-1">
                                Number of Items (Any X mode)
                              </label>
                              <input
                                type="number"
                                min="1"
                                className="w-full border rounded-md px-2 py-1 text-sm"
                                placeholder="Enter number"
                                value={numberOfItems || ""}
                                onChange={(e) => setNumberOfItems(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-6">
                          <div className="h-full flex flex-col">
                            <div className="border-b p-3 bg-light">
                              <SearchInput
                                placeholder="Search items"
                                value={childSearch}
                                onChange={setChildSearch}
                              />
                            </div>
                            <div className="flex-1 p-3 max-h-[520px] overflow-auto">
                              <MenuItemGrid
                                items={filteredChildren}
                                searchTerm={childSearch}
                                onToggleSelection={toggleChildSelection}
                                loading={menuLoading}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="col-span-3">
                          <div className="h-full lg:border-s bg-muted/25 flex flex-col">
                            <div className="border-b p-3 bg-muted/15">
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-md font-medium text-gray-900">
                                  Selected Items
                                </span>
                              </div>
                            </div>

                            <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
                              <SelectedItemsList
                                selectedItemsByCategory={selectedItemsByCategory}
                                showDetails={showDetails}
                                currentFunctionData={{
                                  selectedItems,
                                  itemNotes,
                                  itemRates: {},
                                  itemSlogans: {},
                                  categoryNotes,
                                  categorySlogans: {},
                                }}
                                categories={categories}
                                numberOfItems={numberOfItems}
                                onRemoveItem={handleRemoveItem}
                                onReorder={handleReorder}
                                onUpdateItemNote={handleUpdateItemNote}
                                onNoteClick={handleItemNoteClick}
                                onCategoryNoteClick={handleCategoryNoteClick}
                                onUpdateCategoryNote={handleUpdateCategoryNote}
                              />
                            </div>

                            <div className="p-3 border-t flex items-center justify-between">
                              <span className="text-xs text-gray-700">
                                Total Items: {totalSelectedCount}
                              </span>
                              <span className="text-xs text-gray-700">
                                ₹ {calculateTotalPrice(values.price).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => navigate(-1)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="btn btn-success"
                        disabled={isSubmitting || menuLoading || totalSelectedCount === 0}
                      >
                        {isEditMode ? "Update Package" : "Save Package"}
                      </button>
                    </div>
                  </Form>

                  <MenuNotes
                    isOpen={showItemNoteModal}
                    onClose={() => setShowItemNoteModal(false)}
                    itemId={currentItemForNotes}
                    notes={{ itemsNotes: itemNotes[currentItemForNotes] || "" }}
                    onSave={handleItemNoteSave}
                  />

                  <CategoryNotes
                    isOpen={showCategoryNoteModal}
                    onClose={() => setShowCategoryNoteModal(false)}
                    categoryId={currentCategoryForNotes}
                    notes={{ categoryNotes: categoryNotes[currentCategoryForNotes] || "" }}
                    onSave={handleCategoryNoteSave}
                    categories={categoriesWithAll}
                  />
                </>
              );
            }}
          </Formik>
        )}
      </Container>
    </Fragment>
  );
};

const InputWithFormik = ({ label, name, type = "text" }) => (
  <div className="flex flex-col">
    <label className="block text-gray-600 mb-1">
      {label}
      {label.includes("English") || label.includes("Price") ? (
        <span className="text-red-500">*</span>
      ) : null}
    </label>
    <Field
      type={type}
      name={name}
      placeholder={label}
      className="border border-gray-300 rounded-lg p-2 w-full"
    />
    <ErrorMessage
      name={name}
      component="div"
      className="text-red-500 text-sm mt-1"
    />
  </div>
);

export default AddCustomPackage;




































// import { Fragment, useState, useEffect, useMemo } from "react";
// import { Container } from "@/components/container";
// import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
// import { useNavigate } from "react-router-dom";
// import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
// import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
// import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
// import { useCategories, useMenuItems } from "../../../master/custom-package/Add-customepackage/hook/usePackageData";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import { Translateapi, AddCustomPackageapi } from "@/services/apiServices";

// const AddCustomPackage = () => {
//   const navigate = useNavigate();

//   const [search, setSearch] = useState("");
//   const [childSearch, setChildSearch] = useState("");
//   const [selectedCategoryId, setSelectedCategoryId] = useState(0);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);
//   const [numberOfItems, setNumberOfItems] = useState("");
//   const [categoryAnyItems, setCategoryAnyItems] = useState({});

//   const { categories, fetchCategories } = useCategories();
//   const { menuItems, loading, fetchMenuItems, allMenuItems } = useMenuItems();

//   const allCategory = { id: 0, name: "All" };
//   const categoriesWithAll = [allCategory, ...categories];

//   useEffect(() => {
//     const initializeData = async () => {
//       await fetchCategories();
//       await fetchMenuItems(0);
//     };
//     initializeData();
//   }, []);

// const handleCategoryChange = async (categoryId) => {
//   setSelectedCategoryId(categoryId);
  
//   // 🧹 Reset the "Any X" input field when category changes
//   setNumberOfItems(""); 
  
//   await fetchMenuItems(categoryId);

//   setCategoryAnyItems((prev) => {
//     if (prev[categoryId]) return prev;
//     return { ...prev, [categoryId]: { count: 1, items: [] } };
//   });
// };


//   const allItemsPool = [...menuItems, ...allMenuItems];

//   const toggleChildSelection = (id) => {
//     id = Number(id);

//     setSelectedItems((prev) => {
//       const item = allItemsPool.find((itm) => itm.id === id);
//       if (!item) return prev;

//       if (prev.includes(id)) {
//         return prev.filter((pid) => pid !== id);
//       }

//       return [...prev, id];
//     });
//   };

//   const getAllSelectedItemIds = () => {
//     const anyItemIds = Object.values(categoryAnyItems).flatMap(
//       (cat) => cat.items || []
//     );
//     return [...new Set([...selectedItems, ...anyItemIds])];
//   };

//   const filteredCategories = categoriesWithAll.filter(({ name }) =>
//     name.toLowerCase().includes(search.toLowerCase())
//   );

//   const allSelectedIds = getAllSelectedItemIds();
//   const menuItemsWithSelectionState = menuItems.map((item) => ({
//     ...item,
//     isSelected: allSelectedIds.includes(item.id),
//   }));

//   const filteredChildren = menuItemsWithSelectionState.filter((child) =>
//     child.name.toLowerCase().includes(childSearch.toLowerCase())
//   );

//   const mergedMap = new Map(allItemsPool.map((item) => [item.id, item]));
//   const selectedMenuItems = getAllSelectedItemIds()
//     .map((id) => mergedMap.get(id))
//     .filter(Boolean);

// const selectedItemsByCategory = useMemo(() => {
//   const grouped = {};

//   selectedMenuItems.forEach((item) => {
//     const category =
//       categories.find((cat) => String(cat.id) === String(item.parentId)) ||
//       null;
//     const categoryName = category ? category.name : "Uncategorized";
//     if (!grouped[categoryName]) grouped[categoryName] = [];
//     grouped[categoryName].push(item);
//   });


// // ✅ Always show static "Any X Items" group
// if (numberOfItems && parseInt(numberOfItems) > 0) {
//   const anyCount = parseInt(numberOfItems);

//   // Even if no category or items are selected, show it
//   grouped[`Any ${anyCount} Items`] = [
//     {
//       id: `any-${anyCount}`,
//       name: `Any ${anyCount} Items`,
//       isPlaceholder: true,
//     },
//   ];
// } else {
//   // Optional: show default placeholder even when number is not set
//   grouped["Any Items"] = [
//     {
//       id: "any-default",
//       name: "Any X Items (enter number below)",
//       isPlaceholder: true,
//     },
//   ];
// }



//   // 🧠 Console log for debugging
//   console.group("🧾 Selected Items by Category");
//   Object.entries(grouped).forEach(([catName, items]) => {
//     console.log(
//       `📂 Category: ${catName}`,
//       items.map((i) => i.name)
//     );
//   });
//   console.groupEnd();

//   return grouped;
// }, [selectedMenuItems, categories, categoryAnyItems, numberOfItems]);

//   const handleRemoveItem = (itemId) => {
//     setSelectedItems((prev) => prev.filter((id) => id !== itemId));
//     setCategoryAnyItems((prev) => {
//       const updated = { ...prev };
//       for (const categoryId in updated) {
//         const current = updated[categoryId];
//         if (!current?.items) continue;
//         const newItems = current.items.filter((id) => id !== itemId);
//         if (newItems.length > 0) {
//           updated[categoryId] = { ...current, items: newItems };
//         } else {
//           delete updated[categoryId];
//         }
//       }
//       return updated;
//     });
//   };

//   const totalSelectedCount = getAllSelectedItemIds().length;

//   const calculateTotalPrice = (packagePrice = 0) => {
//     return Number(packagePrice || 0);
//   };

//   /* ─────────────── FORM SETUP ─────────────── */
//   const initialFormState = {
//     nameEnglish: "",
//     nameGujarati: "",
//     nameHindi: "",
//     price: "",
//   };

//   const validationSchema = Yup.object().shape({
//     nameEnglish: Yup.string().required("Name is required"),
//     price: Yup.number()
//       .required("Price is required")
//       .positive("Must be positive"),
//   });

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       const payload = {
//         nameEnglish: values.nameEnglish,
//         nameGujarati: values.nameGujarati,
//         nameHindi: values.nameHindi,
//         price: Number(values.price),
//         sequence: 0,
//         userId: 0,
//         customPackageDetails: [
//           {
//             anyItem: Number(numberOfItems) || 0,
//             menuId: 0,
//             menuName:
//               numberOfItems > 0
//                 ? `Any ${numberOfItems} Items`
//                 : "Selected Items",
//             menuInstruction: "",
//             menuSortOrder: 0,
//             customPackageMenuItemDetails: getAllSelectedItemIds().map(
//               (id, i) => ({
//                 id: 0,
//                 menuItemId: id,
//                 itemInstruction: "",
//                 itemPrice: 0,
//                 itemSortOrder: i + 1,
//                 userId: 0,
//                 itemName:
//                   allItemsPool.find((itm) => itm.id === id)?.name ||
//                   "Unknown Item",
//               })
//             ),
//           },
//         ],
//       };

//       // ✅ Keep only this log
//       console.log("📦 Final payload for API:", payload);

//       // await AddCustomPackageapi(payload);
//       Swal.fire("Saved!", "Custom package saved successfully.", "success");
//       resetForm();
//       setNumberOfItems("");
//     } catch (error) {
//       console.error("Error saving package:", error);
//       Swal.fire("Error", "Something went wrong!", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   /* ─────────────── JSX ─────────────── */
//   return (
//     <Fragment>
//       <Container className="flex flex-col min-h-screen">
//         <div className="gap-2 pb-2 mb-3">
//           <Breadcrumbs items={[{ title: "Add Custom Package" }]} />
//         </div>

//         <Formik
//           initialValues={initialFormState}
//           validationSchema={validationSchema}
//           onSubmit={handleSubmit}
//         >
//           {({ isSubmitting, values, setFieldValue }) => {
//             const [debounceTimer, setDebounceTimer] = useState(null);

//             useEffect(() => {
//               if (!values.nameEnglish?.trim()) return;
//               if (debounceTimer) clearTimeout(debounceTimer);

//               const timer = setTimeout(() => {
//                 Translateapi(values.nameEnglish)
//                   .then((res) => {
//                     setFieldValue("nameGujarati", res.data.gujarati || "");
//                     setFieldValue("nameHindi", res.data.hindi || "");
//                   })
//                   .catch(() => {});
//               }, 500);

//               setDebounceTimer(timer);
//               return () => clearTimeout(timer);
//             }, [values.nameEnglish]);

//             return (
//               <Form className="flex flex-col gap-4">
//                 {/* 🧾 PACKAGE DETAILS */}
//                 <div className="border rounded-lg p-4 bg-white">
//                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                     <InputWithFormik label="Name (English)" name="nameEnglish" />
//                     <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
//                     <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
//                     <InputWithFormik label="Price" name="price" type="number" />
//                   </div>
//                 </div>

//                 {/* 🧩 PACKAGE ITEMS */}
//                 <div className="border rounded-lg p-4 mb-4 bg-white">
//                   <h3 className="text-lg font-semibold mb-3">
//                     Custom Package Items
//                   </h3>
//                   <div className="grid grid-cols-1 lg:grid-cols-12">
//                     {/* Categories */}
//                     <div className="col-span-3">
//                       <div className="flex flex-col h-[600px] border rounded-lg bg-white relative">
//                         {/* 🔍 Sticky Top Search */}
//                         <div className="sticky top-0 z-10 bg-white border-b p-3">
//                           <SearchInput
//                             placeholder="Search categories"
//                             value={search}
//                             onChange={setSearch}
//                           />
//                         </div>

//                         {/* Scrollable Category List */}
//                         <div className="flex-1 overflow-auto p-2 pb-20">
//                           {filteredCategories.map((cat) => {
//                             const isSelected = selectedCategoryId === cat.id;
//                             return (
//                               <div
//                                 key={cat.id}
//                                 className={`mb-2 border rounded-md ${
//                                   isSelected
//                                     ? "border-primary bg-primary/5"
//                                     : "border-gray-200"
//                                 }`}
//                               >
//                                 <div
//                                   onClick={() => handleCategoryChange(cat.id)}
//                                   className="p-2 cursor-pointer flex justify-between items-center"
//                                 >
//                                   <span className="font-medium text-gray-800">
//                                     {cat.name}
//                                   </span>
//                                 </div>
//                               </div>
//                             );
//                           })}
//                         </div>

//                         {/* 🔢 Sticky Bottom Input */}
//                         <div className="sticky bottom-0 z-20 bg-white border-t p-3 shadow-sm">
//                           <label className="block text-xs font-medium text-gray-700 mb-1">
//                             Number of Items (Any X mode)
//                           </label>
//                           <input
//                             type="number"
//                             min="1"
//                             className="w-full border rounded-md px-2 py-1 text-sm"
//                             placeholder="Enter number"
//                             value={numberOfItems || ""}
//                             onChange={(e) =>
//                               setNumberOfItems(parseInt(e.target.value) || "")
//                             }
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Items Grid */}
//                     <div className="col-span-6">
//                       <div className="h-full">
//                         <div className="border-b p-3 bg-light">
//                           <SearchInput
//                             placeholder="Search items"
//                             value={childSearch}
//                             onChange={setChildSearch}
//                           />
//                         </div>
//                         <div className="flex-1 p-3 max-h-[520px] overflow-auto">
//                           <MenuItemGrid
//                             items={filteredChildren}
//                             searchTerm={childSearch}
//                             onToggleSelection={toggleChildSelection}
//                             loading={loading}
//                           />
//                         </div>
//                       </div>
//                     </div>

//                     {/* Selected Items */}
//                     <div className="col-span-3">
//                       <div className="h-full lg:border-s bg-muted/25">
//                         <div className="border-b p-3 bg-muted/15">
//                           <div className="flex items-center justify-between mb-2">
//                             <span className="text-md font-medium text-gray-900">
//                               Selected Items
//                             </span>
//                           </div>
//                         </div>

//                         <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
//                           <SelectedItemsList
//                             key={JSON.stringify(
//                               Object.keys(selectedItemsByCategory)
//                             )}
//                             selectedItemsByCategory={selectedItemsByCategory}
//                             showDetails={showDetails}
//                             currentFunctionData={{
//                               selectedItems: getAllSelectedItemIds(),
//                               itemNotes: {},
//                               itemRates: {},
//                               itemSlogans: {},
//                               categoryNotes: {},
//                               categorySlogans: {},
//                             }}
//                             categories={categories}
//                             categoryAnyItems={categoryAnyItems}
//                             onRemoveItem={handleRemoveItem}
//                           />
//                         </div>

//                         <div className="p-3 border-t flex items-center justify-between">
//                           <span className="text-xs text-gray-700">
//                             Total Items: {totalSelectedCount}
//                           </span>
//                           <span className="text-xs text-gray-700">
//                             ₹ {calculateTotalPrice(values.price).toFixed(2)}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Buttons */}
//                 <div className="flex items-center justify-end gap-2">
//                   <button
//                     type="button"
//                     className="btn btn-light"
//                     onClick={() => navigate(-1)}
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     type="submit"
//                     className="btn btn-success"
//                     disabled={
//                       isSubmitting || loading || totalSelectedCount === 0
//                     }
//                   >
//                     Save Package
//                   </button>
//                 </div>
//               </Form>
//             );
//           }}
//         </Formik>
//       </Container>
//     </Fragment>
//   );
// };

// /* ─────────────── INPUT HELPER ─────────────── */
// const InputWithFormik = ({ label, name, type = "text" }) => (
//   <div className="flex flex-col">
//     <label className="block text-gray-600 mb-1">
//       {label}
//       {label.includes("English") || label.includes("Price") ? (
//         <span className="text-red-500">*</span>
//       ) : null}
//     </label>
//     <Field
//       type={type}
//       name={name}
//       placeholder={label}
//       className="border border-gray-300 rounded-lg p-2 w-full"
//     />
//     <ErrorMessage
//       name={name}
//       component="div"
//       className="text-red-500 text-sm mt-1"
//     />
//   </div>
// );

// export default AddCustomPackage;


