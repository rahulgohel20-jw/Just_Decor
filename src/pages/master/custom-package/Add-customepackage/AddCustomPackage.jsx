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





import { Fragment, useState, useEffect, useMemo } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { useNavigate } from "react-router-dom";
import MenuItemGrid from "../../../Event/EventPreparationPage/components/MenuItemGrid";
import SelectedItemsList from "../../../Event/EventPreparationPage/components/SelectedItemsList";
import SearchInput from "../../../Event/EventPreparationPage/components/SearchInput";
import { useCategories, useMenuItems } from "../../../master/custom-package/Add-customepackage/hook/usePackageData";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import Swal from "sweetalert2";
import { Translateapi, AddCustomPackageapi } from "@/services/apiServices";

const AddCustomPackage = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
const [numberOfItems, setNumberOfItems] = useState("");

  const { categories, fetchCategories } = useCategories();
  const { menuItems, loading, fetchMenuItems, allMenuItems } = useMenuItems();

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  useEffect(() => {
    const initializeData = async () => {
      await fetchCategories();
      await fetchMenuItems(0);
    };
    initializeData();
  }, []);

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    await fetchMenuItems(categoryId);
  };

  const allItemsPool = [...menuItems, ...allMenuItems];

  const toggleChildSelection = (id) => {
    id = Number(id);
    setSelectedItems((prev) => {
      const item = allItemsPool.find((itm) => itm.id === id);
      if (!item) return prev;

      if (prev.includes(id)) {
        return prev.filter((pid) => pid !== id);
      }
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
  const selectedMenuItems = selectedItems.map((id) => mergedMap.get(id)).filter(Boolean);
const selectedItemsByCategory = useMemo(() => {
  const grouped = {};

  // Group normal selected items
  selectedMenuItems.forEach((item) => {
    const category =
      categories.find((cat) => String(cat.id) === String(item.parentId)) || null;
    const categoryName = category ? category.name : "Uncategorized";
    if (!grouped[categoryName]) grouped[categoryName] = [];
    grouped[categoryName].push(item);
  });

  // ✅ Add "Any X Items" static block if number entered
  if (numberOfItems && parseInt(numberOfItems) > 0) {
    const anyCount = parseInt(numberOfItems);
    grouped[`Any ${anyCount} Items`] = [
      {
        id: `any-${anyCount}`,
        name: `Any ${anyCount} items from selected categories`,
        isPlaceholder: true,
      },
    ];
  }

  return grouped;
}, [selectedMenuItems, categories, numberOfItems]);

  const handleRemoveItem = (itemId) => {
    setSelectedItems((prev) => prev.filter((id) => id !== itemId));
  };

  const totalSelectedCount = selectedItems.length;
  const calculateTotalPrice = (packagePrice = 0) => Number(packagePrice || 0);

  /* ─────────────── FORM SETUP ─────────────── */
  const initialFormState = {
    nameEnglish: "",
    nameGujarati: "",
    nameHindi: "",
    price: "",
  };

  const validationSchema = Yup.object().shape({
    nameEnglish: Yup.string().required("Name is required"),
    price: Yup.number().required("Price is required").positive("Must be positive"),
  });

const handleSubmit = async (values, { setSubmitting, resetForm }) => {
  try {
    const storedData = JSON.parse(localStorage.getItem("userData"));
    const userId = storedData?.id || 0;

    // 🧠 Group selected menu items by category
    const groupedItems = {};
    selectedItems.forEach((id, index) => {
      const item = allItemsPool.find((itm) => itm.id === id);
      if (!item) return;

      const categoryId = item.parentId || 0;
      if (!groupedItems[categoryId]) {
        groupedItems[categoryId] = [];
      }

      groupedItems[categoryId].push({
        id: 0,
        menuItemId: item.id,
        itemInstruction: "",
        itemName: item.name || "Unnamed",
        itemPrice: 0,
        itemSortOrder: index + 1,
        userId,
      });
    });

    // 🔧 Build customPackageDetails
    const customPackageDetails = Object.entries(groupedItems).map(([categoryId, items], idx) => {
      const category = categories.find(cat => String(cat.id) === categoryId);
      return {
        anyItem: 0,
        menuId: Number(categoryId),
        menuName: category?.name || "Unknown",
        menuInstruction: "",
        menuSortOrder: idx + 1,
        customPackageMenuItemDetails: items,
      };
    });

    // ➕ Add "Any X Items" mode block if applicable
    if (numberOfItems && parseInt(numberOfItems) > 0) {
      customPackageDetails.push({
        anyItem: parseInt(numberOfItems),
        menuId: 0,
        menuName: `Any ${numberOfItems} Items`,
        menuInstruction: "",
        menuSortOrder: customPackageDetails.length + 1,
        customPackageMenuItemDetails: [],
      });
    }

    // ✅ Final Payload
    const payload = {
      nameEnglish: values.nameEnglish || "",
      nameGujarati: values.nameGujarati || "",
      nameHindi: values.nameHindi || "",
      price: Number(values.price) || 0,
      sequence: 0,
      userId,
      customPackageDetails,
    };

    console.log("✅ Final payload:", payload);

    // 🔽 Send to backend
    await AddCustomPackageapi(payload);

    Swal.fire("Success!", "Custom Package saved successfully.", "success");

    resetForm();
    setSelectedItems([]);
    setNumberOfItems("");
  } catch (err) {
    console.error("Error saving custom package:", err);
    Swal.fire("Error", "Something went wrong.", "error");
  } finally {
    setSubmitting(false);
  }
};




  /* ─────────────── JSX ─────────────── */
  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Add Custom Package" }]} />
        </div>

        <Formik
          initialValues={initialFormState}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ isSubmitting, values, setFieldValue }) => {
            const [debounceTimer, setDebounceTimer] = useState(null);

            useEffect(() => {
              if (!values.nameEnglish?.trim()) return;
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
              <Form className="flex flex-col gap-4">
                {/* 🧾 PACKAGE DETAILS */}
                <div className="border rounded-lg p-4 bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <InputWithFormik label="Name (English)" name="nameEnglish" />
                    <InputWithFormik label="Name (ગુજરાતી)" name="nameGujarati" />
                    <InputWithFormik label="Name (हिन्दी)" name="nameHindi" />
                    <InputWithFormik label="Price" name="price" type="number" />
                  </div>
                </div>

                {/* 🧩 PACKAGE ITEMS */}
                <div className="border rounded-lg p-4 mb-4 bg-white">
                  <h3 className="text-lg font-semibold mb-3">Custom Package Items</h3>
                  <div className="grid grid-cols-1 lg:grid-cols-12">
                    {/* Categories */}
                   {/* Categories Panel */}
<div className="col-span-3">
  <div className="flex flex-col h-[600px] border rounded-lg bg-white relative">
    {/* 🔍 Sticky Top Search */}
    <div className="sticky top-0 z-10 bg-white border-b p-3">
      <SearchInput
        placeholder="Search categories"
        value={search}
        onChange={setSearch}
      />
    </div>

    {/* Scrollable Category List */}
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
              <span className="font-medium text-gray-800">{cat.name}</span>
              {/* ✅ Display (Any X) beside category name */}
             
            </div>
          </div>
        );
      })}
    </div>

    {/* ✅ Sticky Bottom Input */}
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


                    {/* Items Grid */}
                    <div className="col-span-6">
                      <div className="h-full">
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
                            loading={loading}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Selected Items */}
                    <div className="col-span-3">
                      <div className="h-full lg:border-s bg-muted/25">
                        <div className="border-b p-3 bg-muted/15">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-md font-medium text-gray-900">
                              Selected Items
                            </span>
                          </div>
                        </div>

                        <div className="flex-1 p-3 max-h-[516px] overflow-auto bg-white">
                          <SelectedItemsList
                            key={JSON.stringify(Object.keys(selectedItemsByCategory))}
                            selectedItemsByCategory={selectedItemsByCategory}
                            showDetails={showDetails}
                            currentFunctionData={{
                              selectedItems,
                              itemNotes: {},
                              itemRates: {},
                              itemSlogans: {},
                              categoryNotes: {},
                              categorySlogans: {},
                            }}
                            categories={categories }
                            onRemoveItem={handleRemoveItem}
                              numberOfItems={numberOfItems}
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

                {/* Buttons */}
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
                    disabled={isSubmitting || loading || totalSelectedCount === 0}
                  >
                    Save Package
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </Container>
    </Fragment>
  );
};

/* ─────────────── INPUT HELPER ─────────────── */
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
    <ErrorMessage name={name} component="div" className="text-red-500 text-sm mt-1" />
  </div>
);

export default AddCustomPackage;
