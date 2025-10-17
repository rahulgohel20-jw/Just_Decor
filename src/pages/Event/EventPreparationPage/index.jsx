import { useState, useReducer, useEffect, Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Eye, EyeOff, Mic } from "lucide-react";
import TabComponent from "@/components/tab/TabComponent";
import useStyles from "./style";
import { Tooltip } from "antd";
import SelectedItemsList from "./components/SelectedItemsList";
import MenuItemGrid from "./components/MenuItemGrid";
import CategoryList from "./components/CategoryList";
import SearchInput from "./components/SearchInput";
import { useNavigate } from "react-router-dom";
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";
import CustomPackageModal from "@/partials/modals/customepackagemodal/CustomPackageModal";
import { Layers, Package } from "lucide-react";
import {
  useEventData,
  useCategories,
  useMenuData,
  useSaveMenu,
  functionDataReducer,
} from "./hooks/useEventPreparation";
import { toAbsoluteUrl } from "@/utils";

const EventPreparationPage = () => {
  const navigate = useNavigate();
  const classes = useStyles();

  const {
    eventAllData,
    orderDetails,
    menuPreparationsTabs,
    startDateandtime,
    endDateandtime,
    fetchEventData,
  } = useEventData();

  const { categories, categoriesWithAll, fetchCategories } = useCategories();
  const {
    functionMenuData,
    allMenuItems,
    menuPreparationIds,
    itemSortOrders,
    loading,
    loadFunctionMenuData,
    loadAllMenuDataForFunction,
    clearFunctionCache,
    setAllMenuItems,
  } = useMenuData();

  const [selectedPackageName, setSelectedPackageName] = useState(null);
  const [selectedPackagePrice, setSelectedPackagePrice] = useState(0);
  const [packageItemIds, setPackageItemIds] = useState([]);
  const [functionSelectionData, dispatch] = useReducer(functionDataReducer, {});
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [pax, setPax] = useState(0);
  const [rate, setRate] = useState(0);
  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
  const [currentItemForNotes, setCurrentItemForNotes] = useState(null);
  const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);
  const [activeTab, setActiveTab] = useState("custom");
  const [showCustomPackageModal, setShowCustomPackageModal] = useState(false);
  const [orderedCategoryIds, setOrderedCategoryIds] = useState([]);

  const [itemNotes, setItemNotes] = useState({
    itemsNotes: "",
    itemSlogan: "",
  });
  const [categoryNotes, setCategoryNotes] = useState({
    categoryNotes: "",
    categorySlogan: "",
  });
const userId = Number(localStorage.getItem("userId")) || null;


  const { saveMenu } = useSaveMenu(
    functionSelectionData,
    allMenuItems,
    menuPreparationIds,
    categories,
    startDateandtime,
    endDateandtime,
    clearFunctionCache,
    loadFunctionMenuData,
    dispatch
  );

const handlePackageSelect = (packageData) => {
  if (!selectedFunctionId) {
    console.warn("⚠️ No function selected");
    return;
  }

  let items = [];
  let packageName = "Custom Package";
  let totalPrice = 0;
  let packageId = null;

  // Determine structure of packageData
  if (Array.isArray(packageData)) {
    items = packageData;
    totalPrice = items.reduce((sum, item) => sum + (item.price || 0), 0);
    packageName = selectedPackageName || `Package (${items.length} items)`;
  } else if (packageData.items && Array.isArray(packageData.items)) {
    items = packageData.items;
    packageName = packageData.packageName;
    totalPrice = packageData.totalPrice;
    packageId = packageData.id;
  } else if (packageData.packageInfo && packageData.packageItems) {
    items = packageData.packageItems;
    packageName = packageData.packageInfo.packageName;
    totalPrice = packageData.packageInfo.packagePrice;
    packageId = packageData.packageInfo.id;
  } else {
    console.warn("⚠️ Invalid package data structure", packageData);
    return;
  }

  if (!items || items.length === 0) {
    console.warn("⚠️ No items found in package");
    return;
  }

  // Set selected package info
  setSelectedPackageName(packageName);
  setSelectedPackagePrice(totalPrice || 0);

  // Process items with deterministic IDs
  const processedItems = items.map((item, index) => {
    const categoryName = item.categoryName || item.menuName || "Custom Package Items";
    const categoryId = categories.find((cat) => cat.name === categoryName)?.id ||
      `temp-${categoryName.replace(/\s+/g, "-").toLowerCase()}`;

    const newItemId = `pkg-${packageId || "custom"}-cat-${categoryId}-item-${index}`;

    return {
      ...item,
      id: newItemId,
      parentId: categoryId,
      image: item.image || "",
      price: item.price || item.itemPrice || 0,
      itemNotes: item.instruction || item.itemNotes || "",
      name: item.name || item.itemName || `Item ${index + 1}`,
      isPackageItem: true,
      packageId: packageId,
      packageName: packageName,
    };
  });

  // Update allMenuItems for this function
  setAllMenuItems((prev) => ({
    ...prev,
    [selectedFunctionId]: processedItems,
  }));

  // Update packageItemIds to match processed item IDs
  const newItemIds = processedItems.map((item) => item.id);
  setPackageItemIds(newItemIds);

  // Dispatch to update functionSelectionData
 dispatch({
  type: "UPDATE_SELECTIONS",
  functionId: selectedFunctionId,
  selectedItems: newItemIds,
  itemNotes: processedItems.reduce((acc, item) => {
    acc[item.id] = item.itemNotes || "";
    return acc;
  }, {}),
  itemSlogans: processedItems.reduce((acc, item) => {
    acc[item.id] = item.itemSlogan || "";
    return acc;
  }, {}),
  itemRates: processedItems.reduce((acc, item) => {
    acc[item.id] = item.price || rate || 0;
    return acc;
  }, {}),
  categoryNotes: {},
  categorySlogans: {},
  itemSortOrders: {},
  isSaved: true,
  isPackage: true,          // ✅ mark as package
  packageId: packageId,      // ✅ store package ID
  packageName: packageName,  // ✅ store package name
  packagePrice: totalPrice,  // ✅ store package price
});



  console.log("✅ Package selection complete:", processedItems);
};


  useEffect(() => {
    initializeData();
  }, []);

  const initializeData = async () => {
    try {
      const [categoriesData, eventData] = await Promise.all([
        fetchCategories(),
        fetchEventData(),
      ]);

      if (eventData?.functions?.length > 0) {
        eventData.functions.forEach((fn) => {
          dispatch({
            type: "INITIALIZE_FUNCTION",
            functionId: fn.id,
            pax: fn.pax,
            rate: fn.rate,
          });
        });

        const firstFnId = eventData.functions[0].id;
        setSelectedFunctionId(firstFnId);
        setPax(eventData.functions[0].pax || 0);
        setRate(eventData.functions[0].rate || 0);

        await loadAllMenuDataForFunction(firstFnId, categoriesData);
        const responseData = await loadFunctionMenuData(
          firstFnId,
          0,
          categoriesData
        );

        if (responseData.selectedItems?.length > 0) {
          dispatch({
            type: "UPDATE_SELECTIONS",
            functionId: firstFnId,
            selectedItems: responseData.selectedItems.map(
              (item) => item.menuItemId
            ),
            itemNotes: responseData.selectedItems.reduce((acc, item) => {
              acc[item.menuItemId] = item.itemNotes || "";
              return acc;
            }, {}),
            itemSlogans: responseData.selectedItems.reduce((acc, item) => {
              acc[item.menuItemId] = item.itemSlogan || "";
              return acc;
            }, {}),
            categoryNotes: responseData.selectedItems.reduce((acc, item) => {
              if (item.menuNotes) acc[item.menuCategoryId] = item.menuNotes;
              return acc;
            }, {}),
            categorySlogans: responseData.selectedItems.reduce((acc, item) => {
              if (item.menuSlogan) acc[item.menuCategoryId] = item.menuSlogan;
              return acc;
            }, {}),
            itemRates: responseData.selectedItems.reduce((acc, item) => {
              acc[item.menuItemId] = item.itemPrice || 0;
              return acc;
            }, {}),
            itemSortOrders: responseData.sortOrderMap || {},
            isSaved: true,
            pax:
              responseData.responseData?.menuPreparation?.pax ||
              eventData.functions[0].pax,
            rate:
              responseData.responseData?.menuPreparation?.defaultPrice ||
              eventData.functions[0].rate,
          });
        }
      }
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (selectedFunctionId) {
      await loadFunctionMenuData(selectedFunctionId, categoryId, categories);
    }
  };

  const handleSave = async () => {
    const selectedItemsIds =
      functionSelectionData[selectedFunctionId]?.selectedItems || [];

    if (activeTab === "custom") {
      const hasPackageItems = selectedItemsIds.some((id) =>
        packageItemIds.includes(id)
      );
      if (hasPackageItems) {
        console.warn(
          "⚠️ Cannot save package items in custom tab. Switch to Package tab."
        );
        alert(
          "Cannot save package items in custom tab. Please switch to Package tab."
        );
        return;
      }
    } else if (activeTab === "package") {
      const hasCustomItems = selectedItemsIds.some(
        (id) => !packageItemIds.includes(id)
      );
      if (hasCustomItems) {
        console.warn(
          "⚠️ Cannot save custom items in package tab. Switch to Custom tab."
        );
        alert(
          "Cannot save custom items in package tab. Please switch to Custom tab."
        );
        return;
      }
    }

    const success = await saveMenu(
      selectedFunctionId,
      selectedCategoryId,
      pax,
      rate
    );
    if (success) {
      dispatch({ type: "MARK_SAVED", functionId: selectedFunctionId });
    }
  };

  const getFilteredSelectedItems = () => {
    const selectedItemsIds =
      functionSelectionData[selectedFunctionId]?.selectedItems || [];

    if (activeTab === "custom") {
      return selectedItemsIds.filter((id) => !packageItemIds.includes(id));
    } else if (activeTab === "package") {
      return selectedItemsIds.filter((id) => packageItemIds.includes(id));
    }
    return selectedItemsIds;
  };

  const toggleChildSelection = (id) => {
    dispatch({
      type: "TOGGLE_ITEM_SELECTION",
      functionId: selectedFunctionId,
      itemId: id,
    });
  };

  const handleItemRateChange = (id, value) => {
    dispatch({
      type: "UPDATE_ITEM_RATE",
      functionId: selectedFunctionId,
      itemId: id,
      rate: value,
    });
  };
  

  const handlePaxChange = (newPax) => {
    setPax(newPax);
    if (functionSelectionData[selectedFunctionId]?.selectedItems?.length > 0) {
      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "isSaved",
        value: false,
      });
    }
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (functionSelectionData[selectedFunctionId]?.selectedItems?.length > 0) {
      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "isSaved",
        value: false,
      });
    }
  };

  const handleNoteSave = (savedNotes) => {
    if (currentItemForNotes) {
      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "itemNotes",
        id: currentItemForNotes,
        value: savedNotes.itemsNotes || "",
      });

      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "itemSlogans",
        id: currentItemForNotes,
        value: savedNotes.itemSlogan || "",
      });
    }
    setShowNoteModal(false);
    setCurrentItemForNotes(null);
  };

  const handleCategoryNoteSave = (savedNotes) => {
    if (currentCategoryForNotes !== null) {
      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "categoryNotes",
        id: currentCategoryForNotes,
        value: savedNotes.categoryNotes || "",
      });

      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "categorySlogans",
        id: currentCategoryForNotes,
        value: savedNotes.categorySlogan || "",
      });
    }
    setShowCategoryNoteModal(false);
    setCurrentCategoryForNotes(null);
  };

  const handleItemCategoryChange = (itemId, newCategoryId, newCategoryName) => {
    dispatch({
      type: "UPDATE_ITEM_CATEGORY",
      functionId: selectedFunctionId,
      itemId: itemId,
      newCategoryId: newCategoryId,
      newCategoryName: newCategoryName,
    });

    const updatedAllMenuItems = {
      ...allMenuItems,
      [selectedFunctionId]: allMenuItems[selectedFunctionId].map((item) =>
        item.id === itemId ? { ...item, parentId: newCategoryId } : item
      ),
    };

    setAllMenuItems(updatedAllMenuItems);
  };

  const handleCategoryOrderUpdate = (newOrder) => {
    setOrderedCategoryIds(newOrder);
    dispatch({
      type: "UPDATE_CATEGORY_ORDER",
      functionId: selectedFunctionId,
      newOrder: newOrder,
    });
  };

  // ============ CALCULATIONS SECTION ============

  const cacheKey = `${selectedFunctionId}-${selectedCategoryId}`;
  const currentMenuItems = functionMenuData[cacheKey] || [];

  const currentFunctionData = functionSelectionData[selectedFunctionId] || {
    selectedItems: [],
    itemNotes: {},
    itemRates: {},
  };

  const menuItemsWithSelectionState = currentMenuItems.map((item) => ({
    ...item,
    isSelected: currentFunctionData.selectedItems?.includes(item.id) || false,
  }));

  const allFunctionMenuItems = allMenuItems[selectedFunctionId] || [];

  const calculateTabTotalPrice = () => {
    const filteredIds = getFilteredSelectedItems();
    if (!filteredIds || filteredIds.length === 0) return 0;

    return filteredIds.reduce((sum, itemId) => {
      const item = allFunctionMenuItems.find(
        (menuItem) => menuItem.id === itemId
      );
      const itemRate =
        Number(currentFunctionData.itemRates?.[itemId]) ||
        Number(item?.price) ||
        Number(rate) ||
        0;
      return sum + itemRate;
    }, 0);
  };

  const filteredSelectedItemIds = getFilteredSelectedItems();
  const filteredSelectedItems = filteredSelectedItemIds
    .map((id) => {
      const item = allFunctionMenuItems.find((menuItem) => menuItem.id === id);
      return item;
    })
    .filter(Boolean);

  const selectedItemsByCategory = filteredSelectedItems.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.parentId);
    let categoryName;
    if (category) {
      categoryName = category.name;
    } else if (item.categoryName) {
      categoryName = item.categoryName;
    } else if (item.menuName) {
      categoryName = item.menuName;
    } else if (
      typeof item.parentId === "string" &&
      item.parentId.startsWith("temp-")
    ) {
      categoryName = item.parentId
        .replace("temp-", "")
        .replace(/-/g, " ")
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    } else {
      categoryName = "Uncategorized";
    }

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }
    acc[categoryName].push(item);
    return acc;
  }, {});

  const isUpdateOperation = menuPreparationIds[selectedFunctionId] > 0;

  // ============ END CALCULATIONS ============

  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Planning" }]} />
        </div>

        <div className="border rounded mb-4 flex-1">
          <div className="grid grid-cols-6 lg:grid-cols-12">
            {/* Left Panel */}
            <div className="col-span-9">
              <div className="border-b p-3 shrink-0 bg-white">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex flex-col">
                    <span className=" flex  cursor-pointer text-sm font-semibold mb-2">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4   "
                          src={toAbsoluteUrl("/media/menu/eventno.png")}
                          alt="id"
                        />
                        <span className="text-gray-900 ">Event No:</span>
                      </div>
                      <span className=" text-primary ms-1">
                        {orderDetails.id}
                      </span>
                    </span>
                    <span className="flex cursor-pointer text-sm font-semibold">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  "
                          src={toAbsoluteUrl("/media/menu/partyname.png")}
                          alt="id"
                        />
                        <span className="text-gray-900">Customer:</span>
                      </div>
                      <span className="font-semibold text-sm ms-1 text-primary">
                        {orderDetails.customer}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="border-b p-3 shrink-0  rounded-xl bg-[#FAFAFA]">
                  <div className="flex  gap-6 mb-2">
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  "
                          src={toAbsoluteUrl("/media/menu/eventname.png")}
                          alt="id"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Event Name:
                        </span>
                      </div>
                      <span className="font-semibold text-sm  text-primary">
                        {orderDetails.eventType}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  "
                          src={toAbsoluteUrl("/media/menu/person.png")}
                          alt="id"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Person:
                        </span>
                      </div>

                      <input
                        type="number"
                        min={1}
                        className="input input-sm w-20"
                        value={pax}
                        onChange={(e) => handlePaxChange(e.target.value)}
                      />
                    </p>
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  "
                          src={toAbsoluteUrl("/media/menu/venue.png")}
                          alt="id"
                        />
                        <span className="text-sm font-semibold text-gray-900">
                          Venue:
                        </span>
                      </div>
                      <span className="font-semibold text-sm  text-primary">
                        {orderDetails.venue}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-1">
                        <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                          <span className="text-base text-primary">
                            &#8377;
                          </span>
                        </strong>
                        <span className="text-sm font-medium text-gray-900">
                          Default Rate:
                        </span>
                      </div>

                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => handleRateChange(e.target.value)}
                        className="input input-sm w-20"
                      />
                    </p>
                  </div>
                  <div className="flex  gap-6">
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4 "
                          src={toAbsoluteUrl("/media/menu/eventdate.png")}
                          alt="id"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Event Start Date:
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-primary">
                        {startDateandtime}
                      </span>
                    </p>
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  "
                          src={toAbsoluteUrl("/media/menu/eventdate.png")}
                          alt="id"
                        />
                        <span className="text-sm font-medium text-gray-900">
                          Event End Date:
                        </span>
                      </div>
                      <span className="font-semibold text-sm text-primary">
                        {endDateandtime}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-6">
                <button
                  onClick={() => {
                    setActiveTab("custom");
                    setShowCustomPackageModal(false);
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    activeTab === "custom"
                      ? "bg-primary text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Custom
                </button>

                <button
                  onClick={() => {
                    setActiveTab("package");
                    setShowCustomPackageModal(true);
                  }}
                  className={`px-4 py-2 rounded-md font-medium transition-all duration-300 ${
                    activeTab === "package"
                      ? "bg-primary text-white shadow"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Custom Package
                </button>
              </div>

              {selectedPackageName && selectedPackagePrice > 0 && (
                <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-md transition-all duration-300">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-blue-700 block mb-1">
                        📦 Selected Package: {selectedPackageName}
                      </span>
                      <span className="text-sm text-gray-700">
                        Total Price: ₹{selectedPackagePrice.toLocaleString()}
                      </span>
                    </div>
                    <span className="text-2xl font-bold text-blue-600">
                      {currentFunctionData.selectedItems?.length || 0}
                    </span>
                  </div>
                </div>
              )}

              <CustomPackageModal
                isOpen={showCustomPackageModal}
                onClose={() => {
                  setShowCustomPackageModal(false);
                }}
              userId={userId} 
                onPackageSelect={(data) => {
                  console.log(
                    "🎯 Package selected, data type:",
                    typeof data,
                    "Is Array:",
                    Array.isArray(data)
                  );
                  console.log("🎯 Data:", data);

                  const isValid =
                    (Array.isArray(data) && data.length > 0) ||
                    (data &&
                      data.items &&
                      Array.isArray(data.items) &&
                      data.items.length > 0) ||
                    (data &&
                      data.packageItems &&
                      Array.isArray(data.packageItems) &&
                      data.packageItems.length > 0);

                  if (isValid) {
                    handlePackageSelect(data);
                    setShowCustomPackageModal(false);
                  } else {
                    console.warn("⚠️ Invalid package data:", data);
                  }
                }}
                 
              />

              <div
                className={`pt-3 px-3 border-b shrink-0 ${classes.customStyle}`}
              >
                <TabComponent tabs={menuPreparationsTabs} />
              </div>

              <div
                className={`grid grid-cols-1 lg:grid-cols-9 ${classes.customStyle}`}
              >
                <div className="col-span-3">
                  <div className="h-full lg:border-e lg:border-e-border">
                    <div className="border-b p-3 rounded-t-lg sg__inner relative w-full">
                      <SearchInput
                        placeholder="Search categories"
                        value={search}
                        onChange={setSearch}
                        onAdd={() => setIsCategoryModalOpen(true)}
                        addTooltip="Add menu category"
                      />
                    </div>
                    <CategoryList
                      categories={categoriesWithAll}
                      selectedId={selectedCategoryId}
                      onSelect={handleCategoryChange}
                      searchTerm={search}
                    />
                  </div>
                </div>

                <div className="col-span-6">
                  <div className="h-full">
                    <div className="border-b p-3 bg-light flex items-center gap-3">
                      <div className="select__grp flex flex-col w-full">
                        <div className="sg__inner flex items-center gap-1 relative">
                          <div className="relative w-full">
                            <SearchInput
                              placeholder="Search items"
                              value={childSearch}
                              onChange={setChildSearch}
                            />
                          </div>
                          <Tooltip title="Add menu item">
                            <button
                              type="button"
                              onClick={() => setIsItemModalOpen(true)}
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <i className="ki-filled ki-plus"></i>
                            </button>
                          </Tooltip>
                          <Tooltip title="Start speech to text">
                            <button
                              type="button"
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <Mic size={18} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 max-h-[520px] overflow-auto scrollable-y">
                      <MenuItemGrid
                        items={menuItemsWithSelectionState}
                        searchTerm={childSearch}
                        onToggleSelection={toggleChildSelection}
                        loading={loading}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Panel */}
            <div className="col-span-3">
              <div className="h-full lg:border-s lg:border-s-border shrink-0 bg-muted/25">
                <div className="border-b p-3 bg-muted/15 rounded-t-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-md font-medium text-gray-900">
                      Selected Items
                    </span>
                    <Tooltip title="Show price">
                      <button
                        className="text-primary hover:underline"
                        onClick={() => setShowDetails((prev) => !prev)}
                      >
                        {showDetails ? (
                          <Eye size={18} />
                        ) : (
                          <EyeOff size={18} />
                        )}
                      </button>
                    </Tooltip>
                  </div>
                </div>

                <div className="flex-1 p-3 pr-2  h-auto overflow-auto  ">
                  <SelectedItemsList
                    rate={rate}
                    selectedItemsByCategory={selectedItemsByCategory}
                    itemSortOrders={itemSortOrders[selectedFunctionId] || {}}
                    showDetails={showDetails}
                    currentFunctionData={currentFunctionData}
                    categories={categories}
                    onItemRateChange={handleItemRateChange}
                    onNoteClick={(itemId) => {
                      setCurrentItemForNotes(itemId);
                      setItemNotes({
                        itemsNotes:
                          currentFunctionData.itemNotes?.[itemId] || "",
                        itemSlogan:
                          currentFunctionData.itemSlogans?.[itemId] || "",
                      });
                      setShowNoteModal(true);
                    }}
                    onCategoryNoteClick={(categoryId) => {
                      setCurrentCategoryForNotes(categoryId);
                      setCategoryNotes({
                        categoryNotes:
                          currentFunctionData.categoryNotes?.[categoryId] || "",
                        categorySlogan:
                          currentFunctionData.categorySlogans?.[categoryId] ||
                          "",
                      });
                      setShowCategoryNoteModal(true);
                    }}
                    onRemoveItem={toggleChildSelection}
                    onItemCategoryChange={handleItemCategoryChange}
                    onCategoryOrderChange={handleCategoryOrderUpdate}
                    selectedPackageName={selectedPackageName}
                    selectedPackagePrice={selectedPackagePrice}
                    orderedCategoryIds={orderedCategoryIds}
                  />
                </div>
                <div className="p-3 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total Items:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      {getFilteredSelectedItems().length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      &#8377; {calculateTabTotalPrice()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between gap-2">
          <button className="btn btn-light" onClick={() => navigate("/event")}>
            Cancel
          </button>
          <button
            className={`btn ${isUpdateOperation ? "btn-warning" : "btn-success"}`}
            onClick={handleSave}
            disabled={loading || !getFilteredSelectedItems().length}
          >
            <i
              className={`ki-filled ${
                isUpdateOperation ? "ki-pencil" : "ki-save-2"
              }`}
            ></i>
            {isUpdateOperation ? "Update Menu" : "Save Menu"}
          </button>
        </div>

        <AddMenuItem
          isModalOpen={isItemModalOpen}
          setIsModalOpen={setIsItemModalOpen}
          refreshData={initializeData}
        />
        <AddMenuCategory
          isModalOpen={isCategoryModalOpen}
          setIsModalOpen={setIsCategoryModalOpen}
          refreshData={initializeData}
        />
        <MenuNotes
          isOpen={showNoteModal}
          onClose={() => {
            setShowNoteModal(false);
            setCurrentItemForNotes(null);
          }}
          itemId={currentItemForNotes}
          notes={itemNotes}
          onSave={handleNoteSave}
        />
      </Container>
    </Fragment>
  );
};

export default EventPreparationPage;