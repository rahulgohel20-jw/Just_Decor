import { useState, useReducer, useEffect, Fragment } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Eye, EyeOff, Mic, PanelLeftOpen } from "lucide-react";
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
    loading,
    loadFunctionMenuData,
    loadAllMenuDataForFunction,
    clearFunctionCache,
    setAllMenuItems,
  } = useMenuData();
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
  const [itemNotes, setItemNotes] = useState({
    itemsNotes: "",
    itemSlogan: "",
  });
  const [categoryNotes, setCategoryNotes] = useState({
    categoryNotes: "",
    categorySlogan: "",
  });

  const { saveMenu } = useSaveMenu(
    functionSelectionData,
    allMenuItems,
    menuPreparationIds,
    categories,
    startDateandtime,
    endDateandtime,
    clearFunctionCache,
    loadFunctionMenuData
  );

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
        console.log(eventData, "rate");

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

  const handleTabChange = async (newFunctionId) => {
    if (selectedFunctionId === newFunctionId) return;

    try {
      setSelectedFunctionId(newFunctionId);
      const selectedFunction = eventAllData[0]?.eventFunctions?.find(
        (fn) => fn.id === newFunctionId
      );

      if (selectedFunction) {
        setPax(selectedFunction.pax || 0);
        setRate(selectedFunction.rate || 0);
      }

      if (!allMenuItems[newFunctionId]) {
        await loadAllMenuDataForFunction(newFunctionId, categories);
      }

      const responseData = await loadFunctionMenuData(
        newFunctionId,
        selectedCategoryId,
        categories
      );

      // Load existing selections if any
      if (
        responseData.selectedItems?.length > 0 &&
        !functionSelectionData[newFunctionId]?.selectedItems?.length
      ) {
        dispatch({
          type: "UPDATE_SELECTIONS",
          functionId: newFunctionId,
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
          itemRates: responseData.selectedItems.reduce((acc, item) => {
            acc[item.menuItemId] = item.itemPrice || 0;
            return acc;
          }, {}),
          isSaved: true,
        });
      }
    } catch (error) {
      console.error("Error in handleTabChange:", error);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (selectedFunctionId) {
      await loadFunctionMenuData(selectedFunctionId, categoryId, categories);
    }
  };

  const handleCategoryOrderChange = (fromCategoryId, toCategoryId) => {
    console.log("Reordering categories:", {
      fromCategoryId,
      toCategoryId,
      selectedFunctionId,
    });

    // Update the category order in the reducer
    dispatch({
      type: "UPDATE_CATEGORY_ORDER",
      functionId: selectedFunctionId,
      fromCategoryId: fromCategoryId,
      toCategoryId: toCategoryId,
    });

    // You can also implement API call here to save the category order
    // For now, just marking as unsaved so user knows to save the changes
    if (functionSelectionData[selectedFunctionId]?.selectedItems?.length > 0) {
      dispatch({
        type: "UPDATE_NOTES",
        functionId: selectedFunctionId,
        noteType: "isSaved",
        value: false,
      });
    }
  };

  const handleSave = async () => {
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
    console.log("handleItemCategoryChange called:", {
      itemId,
      newCategoryId,
      newCategoryName,
      selectedFunctionId,
    });

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

  const calculateTotalPrice = () => {
    if (!currentFunctionData.selectedItems) return 0;
    const allFunctionMenuItems = allMenuItems[selectedFunctionId] || [];

    return currentFunctionData.selectedItems.reduce((sum, itemId) => {
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

  const allFunctionMenuItems = allMenuItems[selectedFunctionId] || [];
  const selectedItems = currentFunctionData.selectedItems
    .map((id) => allFunctionMenuItems.find((item) => item.id === id))
    .filter(Boolean);

  const selectedItemsByCategory = selectedItems.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.parentId);
    const categoryName = category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  const isUpdateOperation = menuPreparationIds[selectedFunctionId] > 0;

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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                <div className="border-b p-3 shrink-0  rounded-xl bg-[#f5f5f5]">
                  <div className="flex  gap-4 mb-2">
                    <p className="flex items-center gap-1 mb-1">
                      <div className="flex gap-2">
                        <img
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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
                          className="w-4 h-4  object-cover ring-4 ring-white shadow"
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

              {/* Tabs */}
              <div
                className={`pt-3 px-3 border-b shrink-0 ${classes.customStyle}`}
              >
                <TabComponent
                  tabs={menuPreparationsTabs.map((tab) => ({
                    ...tab,
                    label: (
                      <div
                        onClick={() => handleTabChange(tab.value)}
                        style={{ cursor: "pointer" }}
                        className="flex items-center"
                      >
                        <i className="ki-filled ki-disk pr-2 "></i>
                        {tab.label.props.children[2]}
                      </div>
                    ),
                  }))}
                  onTabChange={handleTabChange}
                />
              </div>

              {/* Main Content */}
              <div
                className={`grid grid-cols-1 lg:grid-cols-9 ${classes.customStyle}`}
              >
                {/* Categories */}
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

                {/* Menu Items */}
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
                        {showDetails ? <Eye size={18} /> : <EyeOff size={18} />}
                      </button>
                    </Tooltip>
                  </div>
                </div>
                <div className="flex-1 p-3 max-h-[516px] h-screen overflow-auto scrollable-y bg-white">
                  <SelectedItemsList
                    rate={rate}
                    selectedItemsByCategory={selectedItemsByCategory}
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
                    onCategoryOrderChange={handleCategoryOrderChange} // Add this line
                  />
                </div>
                <div className="p-3 border-t flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total Items:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      {currentFunctionData.selectedItems?.length || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="font-semibold text-xs text-gray-700">
                      Total:
                    </span>
                    <span className="font-bold text-xs text-gray-900">
                      &#8377; {calculateTotalPrice()}
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
            disabled={loading || !currentFunctionData.selectedItems?.length}
          >
            <i
              className={`ki-filled ${isUpdateOperation ? "ki-pencil" : "ki-save-2"}`}
            ></i>
            {isUpdateOperation ? "Update Menu" : "Save Menu"}
            {currentFunctionData.isSaved}
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
        <CategoryNotes
          isOpen={showCategoryNoteModal}
          onClose={() => {
            setShowCategoryNoteModal(false);
            setCurrentCategoryForNotes(null);
          }}
          categoryId={currentCategoryForNotes}
          notes={categoryNotes}
          onSave={handleCategoryNoteSave}
          categories={categoriesWithAll}
        />
      </Container>
    </Fragment>
  );
};

export default EventPreparationPage;
