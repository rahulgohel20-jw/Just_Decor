import { Fragment, useState, useEffect, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useNavigate, useLocation } from "react-router-dom";
import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
import Selecteditemscustomepackage from "../../../Event/EventPreparationPage/components/Selecteditemcustomepackage";
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
  const [globalAnyItems, setGlobalAnyItems] = useState(0);
  const [categoryAnyItems, setCategoryAnyItems] = useState({});

  const [loading, setLoading] = useState(false);
  const [editModeItems, setEditModeItems] = useState([]);

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



  useEffect(() => {
    fetchCategories();
    fetchMenuItems(0);
  }, []);

  useEffect(() => {
    if (packageId && categories.length > 0) {
      fetchPackageDetails(packageId);
    }
  }, [packageId, categories]);
{categories
  .filter(cat => selectedItems.some(sel => sel.categoryId === cat.id))
  .map(cat => (
    <Category key={cat.id} cat={cat} />
))}

  const fetchPackageDetails = async (id) => {
    try {
      setLoading(true);
      const userData = JSON.parse(localStorage.getItem("userData"));
      const res = await GetCustomPackageapi(userData.id);

      const allPackages = res?.data?.data?.["Package Details"] || [];
      const selectedPackage = allPackages.find((pkg) => pkg.id === parseInt(id));
      if (!selectedPackage) return;

      setInitialValues({
        nameEnglish: selectedPackage.nameEnglish || "",
        nameGujarati: selectedPackage.nameGujarati || "",
        nameHindi: selectedPackage.nameHindi || "",
        price: selectedPackage.price || "",
      });

      const extractedItemIds = [];
      const extractedItemNotes = {};
      const extractedCategoryNotes = {};
      const extractedCategoryAnyItems = {};
      const itemsForPool = [];
      const seenItemIds = new Set();

      const allDetails = selectedPackage.customPackageDetails || [];

      allDetails.forEach((categoryDetail) => {
        const categoryId = categoryDetail.menuId;
        const categoryName = categoryDetail.menuName;

        if (categoryDetail.anyItem > 0) {
          extractedCategoryAnyItems[categoryId] = categoryDetail.anyItem;
        }
        
        extractedCategoryNotes[categoryId] = categoryDetail.menuInstruction || "";

        (categoryDetail.customPackageMenuItemDetails || []).forEach((item) => {
          const itemId = Number(item.menuItemId);
          
          if (seenItemIds.has(itemId)) {
            console.warn(`Duplicate item detected: ${itemId}`);
            return;
          }
          
          seenItemIds.add(itemId);
          extractedItemIds.push(itemId);

          itemsForPool.push({
            id: itemId,
            name: item.itemName,
            parentId: categoryId,
            price: item.itemPrice,
            dbRowId: item.id,
          });

          extractedItemNotes[itemId] = item.itemInstruction || "";
        });
      });

      setEditModeItems(itemsForPool);
      setSelectedItems(extractedItemIds);
      setItemNotes(extractedItemNotes);
      setCategoryNotes(extractedCategoryNotes);
      setCategoryAnyItems(extractedCategoryAnyItems);

    } catch (err) {
      console.error(err);
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

  const handleCategoryNoteClick = (categoryId) => {
    setCurrentCategoryForNotes(categoryId);
    setCategoryNotes((prev) => ({
      ...prev,
      [categoryId]: prev[categoryId] || "",
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

  const handleCategoryChange = async (categoryId, e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    setSelectedCategoryId(categoryId);
    await fetchMenuItems(categoryId);
  };

const handleGlobalAnyItemsChange = (value) => {
  const numValue = parseInt(value) || 0;
  setGlobalAnyItems(numValue);

  if (selectedCategoryId === 0) {
    // If "All" selected → apply to all selected categories
    const updated = {};
    const selectedCategoryIds = selectedMenuItems.map(item => item.parentId);
    selectedCategoryIds.forEach(catId => {
      updated[catId] = numValue;
    });
    setCategoryAnyItems(prev => ({ ...prev, ...updated }));
  } else {
    // Apply only to the currently selected category
    setCategoryAnyItems(prev => ({
      ...prev,
      [selectedCategoryId]: numValue
    }));
  }
};



  const handleCategoryAnyItemsChange = (categoryId, value) => {
    const numValue = parseInt(value) || 0;
    setCategoryAnyItems(prev => ({
      ...prev,
      [categoryId]: numValue
    }));
  };

  const handleUpdateItemNote = (itemId, note) => {
    setItemNotes((prev) => ({
      ...prev,
      [itemId]: note,
    }));
  };

  const handleUpdateCategoryNote = (categoryId, note) => {
    setCategoryNotes((prev) => ({
      ...prev,
      [categoryId]: note,
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
    const combined = [...menuItems, ...allMenuItems, ...editModeItems];
    
    const uniqueMap = new Map();
    combined.forEach(item => {
      const id = Number(item.id);
      if (!uniqueMap.has(id)) {
        uniqueMap.set(id, item);
      }
    });
    
    return Array.from(uniqueMap.values());
  }, [menuItems, allMenuItems, editModeItems]);

 const toggleChildSelection = (id) => {
  id = Number(id);

  const item = allItemsPool.find(i => Number(i.id) === id);
  const parentId = item?.parentId;

  setSelectedItems((prev) => {
    const exists = prev.includes(id);
    if (exists) {
      return prev.filter(pid => pid !== id);
    } else {
      // ✅ If category has no manual value yet, apply current global any items
      setCategoryAnyItems((prevCatAny) => {
        if (parentId && prevCatAny[parentId] === undefined && globalAnyItems > 0) {
          return {
            ...prevCatAny,
            [parentId]: globalAnyItems,
          };
        }
        return prevCatAny;
      });

      return [...prev, id];
    }
  });
};


  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  const menuItemsWithSelectionState = menuItems.map((item) => ({
    ...item,
    isSelected: selectedItems.includes(Number(item.id)),
  }));

  const filteredChildren = menuItemsWithSelectionState.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  const selectedMenuItems = useMemo(() => {
    return selectedItems
      .map((id) => {
        const numId = Number(id);
        const item = allItemsPool.find(i => Number(i.id) === numId);
        return item;
      })
      .filter(Boolean);
  }, [selectedItems, allItemsPool]);

 const selectedItemsByCategory = useMemo(() => {
  const grouped = {};
  selectedMenuItems.forEach(item => {
    const parentCategory = categories.find(cat => cat.id === item.parentId);
    const category = parentCategory || { id: item.parentId, name: "Uncategorized" };
    if (!grouped[category.name]) {
      grouped[category.name] = [];
    }
    grouped[category.name].push(item);
  });
  return grouped;
}, [selectedMenuItems, categories]);


const handleRemoveItem = (itemId) => {
  const numId = Number(itemId);

  // Find the parent category of this item
  const removedItem = allItemsPool.find(i => Number(i.id) === numId);
  const parentId = removedItem?.parentId;

  setSelectedItems(prev => {
    const newSelected = prev.filter(id => Number(id) !== numId);

    // 🧼 If no items left in that category, clean up category state
    const hasOtherItemsInCategory = newSelected.some(id => {
      const item = allItemsPool.find(i => Number(i.id) === id);
      return item?.parentId === parentId;
    });

    if (!hasOtherItemsInCategory && parentId) {
      setCategoryAnyItems(prev => {
        const updated = { ...prev };
        delete updated[parentId];
        return updated;
      });

      setCategoryNotes(prev => {
        const updated = { ...prev };
        delete updated[parentId];
        return updated;
      });
    }

    return newSelected;
  });

  setItemNotes(prev => {
    const newNotes = { ...prev };
    delete newNotes[numId];
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

      const validItems = selectedItems
        .map(id => {
          const numId = Number(id);
          const item = allItemsPool.find(itm => Number(itm.id) === numId);
          return item;
        })
        .filter(Boolean);

      if (validItems.length === 0) {
        Swal.fire("Error", "No valid items found.", "error");
        return;
      }

      const categoryMap = new Map();
      validItems.forEach(item => {
        const parentId = Number(item.parentId);
        const category = categories.find(cat => cat.id === parentId);

        const catId = category?.id || parentId || 0;
        const catName = category?.name || item.categoryName || "Uncategorized";

        if (!categoryMap.has(catId)) {
          categoryMap.set(catId, { catName, items: [] });
        }
        categoryMap.get(catId).items.push(item);
      });

      const customPackageDetails = Array.from(categoryMap.entries()).map(
        ([catId, { catName, items }], idx) => {
          const menuItems = items.map((item, itemIdx) => ({
            id: isEditMode ? (item.dbRowId || 0) : 0,
            menuItemId: Number(item.id),
            itemName: item.name || "Unnamed",
            itemInstruction: itemNotes[item.id] || "",
            itemPrice: Number(item.price || 0),
            itemSortOrder: itemIdx + 1,
            userId,
          }));

          // Use category-specific value if set, otherwise use global value
          const anyItemCount = categoryAnyItems[catId] !== undefined
            ? categoryAnyItems[catId]
            : globalAnyItems || 0;

          return {
            menuId: Number(catId),
            menuName: catName,
            menuInstruction: categoryNotes[catId] || categoryNotes[catName] || "",
            menuSortOrder: idx + 1,
            anyItem: anyItemCount,
            customPackageMenuItemDetails: menuItems,
          };
        }
      );

      const payload = {
        id: isEditMode ? packageIdNumber : 0,
        nameEnglish: values.nameEnglish,
        nameGujarati: values.nameGujarati || "",
        nameHindi: values.nameHindi || "",
        price: Number(values.price),
        sequence: 1,
        userId,
        customPackageDetails,
      };

      if (isEditMode) {
        const res = await UpdateCustomPackageapi(packageIdNumber, payload);
        Swal.fire("Success", "Custom Package updated successfully.", "success");
        navigate(-1);
      } else {
        const res = await AddCustomPackageapi(payload);
        Swal.fire("Success", "Custom Package created successfully.", "success");
        resetForm();
        setSelectedItems([]);
        setItemNotes({});
        setCategoryNotes({});
        setGlobalAnyItems(0);
        setCategoryAnyItems({});
        setEditModeItems([]);
      }
    } catch (err) {
      console.error(err);
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
  
  {/* Search bar */}
  <div className="sticky top-0 z-10 bg-white border-b p-3">
    <SearchInput
      placeholder="Search categories"
      value={search}
      onChange={setSearch}
    />
  </div>

  {/* Category list */}
  <div className="flex-1 overflow-auto p-2">
    {filteredCategories.map((cat) => {
      const isSelected = selectedCategoryId === cat.id;
      const anyItemsCount = categoryAnyItems[cat.id] ?? "";

      return (
        <div
         key={cat.id}
  className={`mb-2 border-2 rounded-md transition-all duration-300 ${
    isSelected
      ? "border-primary bg-primary/5 shadow-sm"
      : "border-gray-200"
  }`}
>
          <button
    type="button"
    onClick={(e) => handleCategoryChange(cat.id, e)}
    className="p-2 cursor-pointer flex justify-between items-center w-full text-left hover:bg-gray-50"
  >
    <span className="font-medium text-gray-800">{cat.name}</span>
  </button>

          <div
            className={`transition-all duration-300 ${
              isSelected ? "max-h-20 opacity-100 p-2" : "max-h-0 opacity-0 p-0"
            } overflow-hidden bg-gray-50`}
          >
          
          </div>
        </div>
      );
    })}
  </div>

  {/* ✅ Global Any Items Input at Bottom */}
  <div className="sticky bottom-0 z-10 bg-blue-50 border-t-2 border-blue-200 p-3">
    <label className="block text-sm font-semibold text-gray-700 mb-2">
       Any Items 
    </label>
    <input
      type="number"
      min="0"
      placeholder="Set Any item for Category"
      className="border-2 border-blue-300 rounded-md px-2 py-2 w-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
      value={globalAnyItems || ""}
      onChange={(e) => handleGlobalAnyItemsChange(e.target.value)}
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
                              <span className="text-md font-medium text-gray-900">
                                Selected Items
                              </span>
                            </div>

                            <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
                              <Selecteditemscustomepackage
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
                                categoryAnyItems={categoryAnyItems}
                                onRemoveItem={handleRemoveItem}
                                onReorder={handleReorder}
                                onUpdateItemNote={handleUpdateItemNote}
                                onNoteClick={handleItemNoteClick}
                                onCategoryNoteClick={handleCategoryNoteClick}
                                onUpdateCategoryNote={handleUpdateCategoryNote}
                                onItemCategoryChange={() => {}}
                                onCategoryOrderChange={() => {}}
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
// import { useNavigate, useLocation } from "react-router-dom";
// import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
// import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
// import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
// import { useCategories, useMenuItems } from "../../../master/custom-package/Add-customepackage/hook/usePackageData";
// import { Formik, Form, Field, ErrorMessage } from "formik";
// import * as Yup from "yup";
// import Swal from "sweetalert2";
// import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
// import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";
// import { 
//   Translateapi, 
//   AddCustomPackageapi, 
//   UpdateCustomPackageapi, 
//   GetCustomPackageapi 
// } from "@/services/apiServices";

// const AddCustomPackage = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
  
//   const searchParams = new URLSearchParams(location.search);
//   const packageId = searchParams.get("id");
//   const isEditMode = !!packageId;

//   const [search, setSearch] = useState("");
//   const [itemNotes, setItemNotes] = useState({});
//   const [categoryNotes, setCategoryNotes] = useState({});
//   const [childSearch, setChildSearch] = useState("");
//   const [selectedCategoryId, setSelectedCategoryId] = useState(0);
//   const [selectedItems, setSelectedItems] = useState([]);
//   const [showDetails, setShowDetails] = useState(false);

  
//   // Changed from single numberOfItems to per-category object
//   const [categoryAnyItems, setCategoryAnyItems] = useState({}); // { categoryId: count }
  
//   const [loading, setLoading] = useState(false);
//   const [editModeItems, setEditModeItems] = useState([]);

//   const [showItemNoteModal, setShowItemNoteModal] = useState(false);
//   const [currentItemForNotes, setCurrentItemForNotes] = useState(null);

//   const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
//   const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);

//   const { categories, fetchCategories } = useCategories();
//   const { menuItems, loading: menuLoading, fetchMenuItems, allMenuItems } = useMenuItems();

//   const [initialValues, setInitialValues] = useState({
//     nameEnglish: "",
//     nameGujarati: "",
//     nameHindi: "",
//     price: "",
//   });

//   const allCategory = { id: 0, name: "All" };
//   const categoriesWithAll = [allCategory, ...categories];

//   useEffect(() => {
//     fetchCategories();
//     fetchMenuItems(0);
//   }, []);

//   useEffect(() => {
//     if (packageId && categories.length > 0) {
//       fetchPackageDetails(packageId);
//     }
//   }, [packageId, categories]);

//   const fetchPackageDetails = async (id) => {
//     try {
//       setLoading(true);
//       const userData = JSON.parse(localStorage.getItem("userData"));
//       const res = await GetCustomPackageapi(userData.id);

//       const allPackages = res?.data?.data?.["Package Details"] || [];
//       const selectedPackage = allPackages.find((pkg) => pkg.id === parseInt(id));
//       if (!selectedPackage) return;

//       setInitialValues({
//         nameEnglish: selectedPackage.nameEnglish || "",
//         nameGujarati: selectedPackage.nameGujarati || "",
//         nameHindi: selectedPackage.nameHindi || "",
//         price: selectedPackage.price || "",
//       });

//       const extractedItemIds = [];
//       const extractedItemNotes = {};
//       const extractedCategoryNotes = {};
//       const extractedCategoryAnyItems = {}; // NEW: Store per-category any items
//       const itemsForPool = [];
//       const seenItemIds = new Set();

//       const allDetails = selectedPackage.customPackageDetails || [];

//       allDetails.forEach((categoryDetail) => {
//         const categoryId = categoryDetail.menuId;
//         const categoryName = categoryDetail.menuName;

//         // Store per-category any items
//         if (categoryDetail.anyItem > 0) {
//           extractedCategoryAnyItems[categoryId] = categoryDetail.anyItem;
//         }
        
//         extractedCategoryNotes[categoryId] = categoryDetail.menuInstruction || "";

//         (categoryDetail.customPackageMenuItemDetails || []).forEach((item) => {
//           const itemId = Number(item.menuItemId);
          
//           if (seenItemIds.has(itemId)) {
//             console.warn(`⚠️ Duplicate item detected: ${itemId} - ${item.itemName}`);
//             return;
//           }
          
//           seenItemIds.add(itemId);
//           extractedItemIds.push(itemId);

//           itemsForPool.push({
//             id: itemId,
//             name: item.itemName,
//             parentId: categoryId,
//             price: item.itemPrice,
//             dbRowId: item.id,
//           });

//           extractedItemNotes[itemId] = item.itemInstruction || "";
//         });
//       });

//       console.log("📦 Loaded package - unique items:", extractedItemIds.length);
//       console.log("🔢 Category Any Items:", extractedCategoryAnyItems);

//       setEditModeItems(itemsForPool);
//       setSelectedItems(extractedItemIds);
//       setItemNotes(extractedItemNotes);
//       setCategoryNotes(extractedCategoryNotes);
//       setCategoryAnyItems(extractedCategoryAnyItems); // NEW: Set per-category any items

//     } catch (err) {
//       console.error(err);
//       Swal.fire("Error", "Failed to load package details.", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleItemNoteClick = (itemId) => {
//     setCurrentItemForNotes(itemId);
//     setItemNotes((prev) => ({
//       ...prev,
//       [itemId]: prev[itemId] || "",
//     }));
//     setShowItemNoteModal(true);
//   };

//   const handleCategoryNoteClick = (categoryName) => {
//     setCurrentCategoryForNotes(categoryName);
//     setCategoryNotes((prev) => ({
//       ...prev,
//       [categoryName]: prev[categoryName] || "",
//     }));
//     setShowCategoryNoteModal(true);
//   };

//   const handleItemNoteSave = (savedNotes) => {
//     if (currentItemForNotes !== null) {
//       setItemNotes((prev) => ({
//         ...prev,
//         [currentItemForNotes]: savedNotes.itemsNotes || "",
//       }));
//     }
//     setShowItemNoteModal(false);
//     setCurrentItemForNotes(null);
//   };

//   const handleCategoryNoteSave = (savedNotes) => {
//     if (currentCategoryForNotes !== null) {
//       setCategoryNotes((prev) => ({
//         ...prev,
//         [currentCategoryForNotes]: savedNotes.categoryNotes || "",
//       }));
//       setShowCategoryNoteModal(false);
//       setCurrentCategoryForNotes(null);
//     }
//   };

//   const handleCategoryChange = async (categoryId, e) => {
//     if (e) {
//       e.preventDefault();
//       e.stopPropagation();
//     }
//     setSelectedCategoryId(categoryId);
//     await fetchMenuItems(categoryId);
//   };

//   // NEW: Handle per-category any items change
//   const handleCategoryAnyItemsChange = (categoryId, value) => {
//     const numValue = parseInt(value) || 0;
//     setCategoryAnyItems(prev => {
//       if (numValue <= 0) {
//         const newState = { ...prev };
//         delete newState[categoryId];
//         return newState;
//       }
//       return { ...prev, [categoryId]: numValue };
//     });
//   };

//   const handleUpdateItemNote = (itemId, note) => {
//     setItemNotes((prev) => ({
//       ...prev,
//       [itemId]: note,
//     }));
//   };

//   const handleUpdateCategoryNote = (categoryName, note) => {
//     setCategoryNotes((prev) => ({
//       ...prev,
//       [categoryName]: note,
//     }));
//   };

//   const handleReorder = ({ sourceCategory, destCategory, sourceIndex, destIndex, itemId }) => {
//     setSelectedItems((prev) => {
//       const newItems = [...prev];
//       const itemIndex = newItems.indexOf(Number(itemId));

//       if (itemIndex === -1) return prev;

//       const [movedItem] = newItems.splice(itemIndex, 1);
//       let newIndex = destIndex;
//       if (sourceCategory === destCategory && sourceIndex < destIndex) {
//         newIndex--;
//       }

//       newItems.splice(newIndex, 0, movedItem);
//       return newItems;
//     });
//   };

//   const allItemsPool = useMemo(() => {
//     console.log("🔨 Building item pool...");
//     const combined = [...menuItems, ...allMenuItems, ...editModeItems];
    
//     const uniqueMap = new Map();
//     combined.forEach(item => {
//       const id = Number(item.id);
//       if (!uniqueMap.has(id)) {
//         uniqueMap.set(id, item);
//       }
//     });
    
//     const uniqueItems = Array.from(uniqueMap.values());
//     console.log("✅ Total unique items in pool:", uniqueItems.length);
//     return uniqueItems;
//   }, [menuItems, allMenuItems, editModeItems]);

//   const toggleChildSelection = (id) => {
//     id = Number(id);
//     setSelectedItems(prev => {
//       const exists = prev.includes(id);
//       console.log(exists ? `❌ Removing item ${id}` : `✅ Adding item ${id}`);
//       if (exists) return prev.filter(pid => Number(pid) !== id);
      
//       const newItems = [...prev, id];
//       const uniqueItems = [...new Set(newItems.map(Number))];
//       console.log(`📊 Total unique selected: ${uniqueItems.length}`);
//       return uniqueItems;
//     });
//   };

//   const filteredCategories = categoriesWithAll.filter(({ name }) =>
//     name.toLowerCase().includes(search.toLowerCase())
//   );

//   const menuItemsWithSelectionState = menuItems.map((item) => ({
//     ...item,
//     isSelected: selectedItems.includes(Number(item.id)),
//   }));

//   const filteredChildren = menuItemsWithSelectionState.filter((child) =>
//     child.name.toLowerCase().includes(childSearch.toLowerCase())
//   );

//   const selectedMenuItems = useMemo(() => {
//     console.log("🔍 Getting selected items from pool...");
//     const items = selectedItems
//       .map((id) => {
//         const numId = Number(id);
//         const item = allItemsPool.find(i => Number(i.id) === numId);
//         if (!item) {
//           console.warn(`⚠️ Item ${id} not found in pool`);
//         }
//         return item;
//       })
//       .filter(Boolean);
    
//     console.log("✅ Found items:", items.length);
//     return items;
//   }, [selectedItems, allItemsPool]);

//   // MODIFIED: Group items by category with per-category any items
//   const selectedItemsByCategory = useMemo(() => {
//     console.log("📊 Grouping items by category...");
//     const grouped = {};

//     selectedMenuItems.forEach(item => {
//       const category = categories.find(cat => cat.id === item.parentId) || { 
//         id: 0, 
//         name: "Uncategorized" 
//       };
      
//       if (!grouped[category.name]) grouped[category.name] = [];
//       grouped[category.name].push(item);
//     });

//     console.log("✅ Grouped categories:", Object.keys(grouped));
//     return grouped;
//   }, [selectedMenuItems, categories]);

//   const handleRemoveItem = (itemId) => {
//     const numId = Number(itemId);
//     console.log("🗑️ Removing item:", numId);
    
//     setSelectedItems((prev) => prev.filter((id) => Number(id) !== numId));
    
//     setItemNotes((prev) => {
//       const newNotes = { ...prev };
//       delete newNotes[numId];
//       return newNotes;
//     });
//   };

//   const totalSelectedCount = selectedItems.length;
//   const calculateTotalPrice = (packagePrice = 0) => Number(packagePrice || 0);

//   const validationSchema = Yup.object().shape({
//     nameEnglish: Yup.string().required("Name is required"),
//     price: Yup.number()
//       .required("Price is required")
//       .positive("Must be positive"),
//   });

//   const handleSubmit = async (values, { setSubmitting, resetForm }) => {
//     try {
//       setSubmitting(true);
//       const storedData = JSON.parse(localStorage.getItem("userData"));
//       const userId = storedData?.id || 0;
//       const packageIdNumber = Number(packageId);

//       if (selectedItems.length === 0) {
//         Swal.fire("Error", "No items selected.", "error");
//         return;
//       }

//       const validItems = selectedItems
//         .map(id => {
//           const numId = Number(id);
//           const item = allItemsPool.find(itm => Number(itm.id) === numId);
//           if (!item) {
//             console.warn(`⚠️ Item not found in pool: ${numId}`);
//           }
//           return item;
//         })
//         .filter(Boolean);

//       if (validItems.length === 0) {
//         Swal.fire("Error", "No valid items found.", "error");
//         return;
//       }

//       console.log("📤 Preparing payload with items:", validItems);

//       const categoryMap = new Map();
//       validItems.forEach(item => {
//         const parentId = Number(item.parentId);
//         const category = categories.find(cat => cat.id === parentId);

//         const catId = category?.id || parentId || 0;
//         const catName = category?.name || item.categoryName || "Uncategorized";

//         if (!categoryMap.has(catId)) {
//           categoryMap.set(catId, { catName, items: [] });
//         }
//         categoryMap.get(catId).items.push(item);
//       });

//       console.log("📊 Grouped by category:", Object.fromEntries(categoryMap));

//       // MODIFIED: Build customPackageDetails with per-category any items
//       const customPackageDetails = Array.from(categoryMap.entries()).map(
//         ([catId, { catName, items }], idx) => {
//           const menuItems = items.map((item, itemIdx) => ({
//             id: isEditMode ? (item.dbRowId || 0) : 0,
//             menuItemId: Number(item.id),
//             itemName: item.name || "Unnamed",
//             itemInstruction: itemNotes[item.id] || "",
//             itemPrice: Number(item.price || 0),
//             itemSortOrder: itemIdx + 1,
//             userId,
//           }));

//           return {
//             menuId: Number(catId),
//             menuName: catName,
//             menuInstruction: categoryNotes[catId] || categoryNotes[catName] || "",
//             menuSortOrder: idx + 1,
//             anyItem: categoryAnyItems[catId] || 0, // NEW: Per-category any items
//             customPackageMenuItemDetails: menuItems,
//           };
//         }
//       );

//       const payload = {
//         id: isEditMode ? packageIdNumber : 0,
//         nameEnglish: values.nameEnglish,
//         nameGujarati: values.nameGujarati || "",
//         nameHindi: values.nameHindi || "",
//         price: Number(values.price),
//         sequence: 1,
//         userId,
//         customPackageDetails,
//       };

//       console.log("📤 Final Payload:", JSON.stringify(payload, null, 2));

//       if (isEditMode) {
//         const res = await UpdateCustomPackageapi(packageIdNumber, payload);
//         console.log("✅ Update API response:", res.data);
//         Swal.fire("Success", "Custom Package updated successfully.", "success");
//         navigate(-1);
//       } else {
//         const res = await AddCustomPackageapi(payload);
//         console.log("✅ Add API response:", res.data);
//         Swal.fire("Success", "Custom Package created successfully.", "success");
//         resetForm();
//         setSelectedItems([]);
//         setItemNotes({});
//         setCategoryNotes({});
//         setCategoryAnyItems({}); // NEW: Reset per-category any items
//         setEditModeItems([]);
//       }
//     } catch (err) {
//       console.error("❌ Error saving package:", err.response?.data || err.message);
//       Swal.fire("Error", err.response?.data?.message || "Something went wrong.", "error");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <Fragment>
//       <Container className="flex flex-col min-h-screen">
//         <div className="gap-2 pb-2 mb-3">
//           <Breadcrumbs 
//             items={[{ 
//               title: isEditMode ? "Edit Custom Package" : "Add Custom Package" 
//             }]} 
//           />
//         </div>

//         {loading ? (
//           <div className="flex justify-center items-center h-64">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading package details...</p>
//             </div>
//           </div>
//         ) : (
//           <Formik
//             initialValues={initialValues}
//             enableReinitialize
//             validationSchema={validationSchema}
//             onSubmit={handleSubmit}
//           >
//             {({ isSubmitting, values, setFieldValue }) => {
//               const [debounceTimer, setDebounceTimer] = useState(null);

//               useEffect(() => {
//                 if (!values.nameEnglish?.trim() || isEditMode) return;
//                 if (debounceTimer) clearTimeout(debounceTimer);

//                 const timer = setTimeout(() => {
//                   Translateapi(values.nameEnglish)
//                     .then((res) => {
//                       setFieldValue("nameGujarati", res.data.gujarati || "");
//                       setFieldValue("nameHindi", res.data.hindi || "");
//                     })
//                     .catch(() => {});
//                 }, 500);

//                 setDebounceTimer(timer);
//                 return () => clearTimeout(timer);
//               }, [values.nameEnglish]);

//               return (
//                 <>
//                   <Form className="flex flex-col gap-4">
//                     <div className="border rounded-lg p-4 bg-white">
//                       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <InputWithFormik label="Name (English)" name="nameEnglish" />
//                         <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
//                         <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
//                         <InputWithFormik label="Price" name="price" type="number" />
//                       </div>
//                     </div>

//                     <div className="border rounded-lg p-4 mb-4 bg-white">
//                       <h3 className="text-lg font-semibold mb-3">
//                         Custom Package Items
//                       </h3>
//                       <div className="grid grid-cols-1 lg:grid-cols-12 gap-2">
//                         <div className="col-span-3">
//                           <div className="flex flex-col h-[600px] border rounded-lg bg-white relative">
//                             <div className="sticky top-0 z-10 bg-white border-b p-3">
//                               <SearchInput
//                                 placeholder="Search categories"
//                                 value={search}
//                                 onChange={setSearch}
//                               />
//                             </div>

//                            <div className="flex-1 overflow-auto p-2">
//   {filteredCategories.map((cat) => {
//   const isSelected = selectedCategoryId === cat.id;
//   const anyItemsCount = categoryAnyItems[cat.id] || "";

//   return (
//     <div
//       key={cat.id}
//       className={`mb-2 border rounded-md transition-all duration-300 overflow-hidden ${
//         isSelected
//           ? "border-primary bg-primary/5 shadow-sm"
//           : "border-gray-200"
//       }`}
//     >
//       {/* Category Button */}
//       <button
//         type="button"
//         onClick={(e) => handleCategoryChange(cat.id, e)}
//         className="p-2 cursor-pointer flex justify-between items-center w-full text-left"
//       >
//         <span className="font-medium text-gray-800">{cat.name}</span>
//       </button>

//       {/* Input shows ONLY when selected */}
//       <div
//         className={`transition-all duration-300 ${
//           isSelected ? "max-h-20 opacity-100 p-2" : "max-h-0 opacity-0 p-0"
//         } overflow-hidden`}
//       >
//         {isSelected && (
//           <input
//             type="number"
//             min="0"
//             placeholder={`Number of items for ${cat.name}`}
//             className="w-full border rounded-md px-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:border-primary outline-none"
//             value={anyItemsCount}
//             onChange={(e) =>
//               handleCategoryAnyItemsChange(cat.id, e.target.value)
//             }
//             onClick={(e) => e.stopPropagation()}
//           />
//         )}
//       </div>
//     </div>
//   );
// })}

// </div>


//                           </div>
//                         </div>

//                         <div className="col-span-6">
//                           <div className="h-full flex flex-col">
//                             <div className="border-b p-3 bg-light">
//                               <SearchInput
//                                 placeholder="Search items"
//                                 value={childSearch}
//                                 onChange={setChildSearch}
//                               />
//                             </div>
//                             <div className="flex-1 p-3 max-h-[520px] overflow-auto">
//                               <MenuItemGrid
//                                 items={filteredChildren}
//                                 searchTerm={childSearch}
//                                 onToggleSelection={toggleChildSelection}
//                                 loading={menuLoading}
//                               />
//                             </div>
//                           </div>
//                         </div>

//                         <div className="col-span-3">
//                           <div className="h-full lg:border-s bg-muted/25 flex flex-col">
//                             <div className="border-b p-3 bg-muted/15">
//                               <div className="flex items-center justify-between mb-2">
//                                 <span className="text-md font-medium text-gray-900">
//                                   Selected Items
//                                 </span>
//                               </div>
//                             </div>

//                             <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
//                               <SelectedItemsList
//                                 selectedItemsByCategory={selectedItemsByCategory}
//                                 showDetails={showDetails}
//                                 currentFunctionData={{
//                                   selectedItems,
//                                   itemNotes,
//                                   itemRates: {},
//                                   itemSlogans: {},
//                                   categoryNotes,
//                                   categorySlogans: {},
//                                 }}
//                                 categories={categories}
//                                 categoryAnyItems={categoryAnyItems} // NEW: Pass per-category any items
//                                 onRemoveItem={handleRemoveItem}
//                                 onReorder={handleReorder}
//                                 onUpdateItemNote={handleUpdateItemNote}
//                                 onNoteClick={handleItemNoteClick}
//                                 onCategoryNoteClick={handleCategoryNoteClick}
//                                 onUpdateCategoryNote={handleUpdateCategoryNote}
//                               />
//                             </div>

//                             <div className="p-3 border-t flex items-center justify-between">
//                               <span className="text-xs text-gray-700">
//                                 Total Items: {totalSelectedCount}
//                               </span>
//                               <span className="text-xs text-gray-700">
//                                 ₹ {calculateTotalPrice(values.price).toFixed(2)}
//                               </span>
//                             </div>
//                           </div>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="flex items-center justify-end gap-2">
//                       <button
//                         type="button"
//                         className="btn btn-light"
//                         onClick={() => navigate(-1)}
//                       >
//                         Cancel
//                       </button>
//                       <button
//                         type="submit"
//                         className="btn btn-success"
//                         disabled={isSubmitting || menuLoading || totalSelectedCount === 0}
//                       >
//                         {isEditMode ? "Update Package" : "Save Package"}
//                       </button>
//                     </div>
//                   </Form>

//                   <MenuNotes
//                     isOpen={showItemNoteModal}
//                     onClose={() => setShowItemNoteModal(false)}
//                     itemId={currentItemForNotes}
//                     notes={{ itemsNotes: itemNotes[currentItemForNotes] || "" }}
//                     onSave={handleItemNoteSave}
//                   />

//                   <CategoryNotes
//                     isOpen={showCategoryNoteModal}
//                     onClose={() => setShowCategoryNoteModal(false)}
//                     categoryId={currentCategoryForNotes}
//                     notes={{ categoryNotes: categoryNotes[currentCategoryForNotes] || "" }}
//                     onSave={handleCategoryNoteSave}
//                     categories={categoriesWithAll}
//                   />
//                 </>
//               );
//             }}
//           </Formik>
//         )}
//       </Container>
//     </Fragment>
//   );
// };

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























