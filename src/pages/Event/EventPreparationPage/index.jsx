import { useState, Fragment, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { menuCategories, menuCategoryChildren } from "./constant";
import { Eye, EyeOff, LogIn, Mic, PanelLeftOpen } from "lucide-react";
import TabComponent from "@/components/tab/TabComponent";
import useStyles from "./style";
import { Tooltip } from "antd";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { useParams } from "react-router-dom";
import {
  GetAllCategoryformenu,
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
} from "@/services/apiServices";

const EventPreparationPage = () => {
  const [categories, setCategories] = useState([]);
  const { eventId } = useParams();
  const [eventAllData, setEventAllData] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [menuPreparationsTabs, setMenuPreparationsTabs] = useState([]);
  const [rate, setRate] = useState(0);
  const [pax, setPax] = useState(0);
  const [dateandtime, setDateandtime] = useState("");
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);

  // Optimized state management
  const [functionMenuData, setFunctionMenuData] = useState({}); // Store menu items per function
  const [functionSelectionData, setFunctionSelectionData] = useState({}); // Store selections per function
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    initializeData();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;

  const initializeData = async () => {
    try {
      await Promise.all([FetchCategoryData(), FetchEventData()]);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  };

  const FetchCategoryData = () => {
    return GetAllCategoryformenu(Id)
      .then((res) => {
        const categories = res.data.data["Menu Category Details"].map(
          (item, index) => ({
            ...item,
            name: item.nameEnglish,
            sr_no: index + 1,
          })
        );
        setCategories(categories);
        return categories;
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
        throw error;
      });
  };

  const FetchEventData = () => {
    return GetEventMasterById(eventId)
      .then((res) => {
        const alleventdata = res?.data?.data["Event Details"].map((item) => {
          return {
            userid: item.user.id,
            party: item.party.nameEnglish,
            eventType: item.eventType.nameEnglish,
            eventStartDateTime: item.eventStartDateTime,
            venue: item.venue,
            eventFunctions: item.eventFunctions.map((f) => ({
              id: f.id,
              name: f.function.nameEnglish,
              startTime: f.function.startTime,
              endTime: f.function.endTime,
              pax: f.pax,
              rate: f.rate,
              venue: f.function_venue,
            })),
          };
        });

        if (alleventdata.length > 0) {
          const firstEvent = alleventdata[0];

          setOrderDetails({
            id: eventId,
            customer: firstEvent.party,
            eventType: firstEvent.eventType,
            eventDate: firstEvent.eventStartDateTime,
            venue: firstEvent.venue,
          });

          const dynamicTabs = firstEvent.eventFunctions.map((fn) => ({
            label: (
              <>
                <i className="ki-filled ki-disk"></i> {fn.name}
              </>
            ),
            value: fn.id,
            children: "",
          }));
          setMenuPreparationsTabs(dynamicTabs);

          // Initialize function selection data
          const initialFunctionData = {};
          firstEvent.eventFunctions.forEach((fn) => {
            initialFunctionData[fn.id] = {
              selectedItems: [],
              itemNotes: {},
              itemRates: {},
              isSaved: false,
              pax: fn.pax,
              rate: fn.rate,
            };
          });
          setFunctionSelectionData(initialFunctionData);

          if (firstEvent.eventFunctions.length > 0) {
            const firstFnId = firstEvent.eventFunctions[0].id;
            setSelectedFunctionId(firstFnId);
            setPax(firstEvent.eventFunctions[0].pax || 0);
            setRate(firstEvent.eventFunctions[0].rate || 0);
            // Load menu data for first function
            loadFunctionMenuData(firstFnId, 0);
          }
        }

        setDateandtime(alleventdata[0]?.eventStartDateTime || "");
        setEventAllData(alleventdata);
        return alleventdata;
      })
      .catch((error) => {
        console.error("Error fetching event data:", error);
        throw error;
      });
  };

  const loadFunctionMenuData = async (
    functionId,
    categoryId = selectedCategoryId
  ) => {
    setLoading(true);
    try {
      const cacheKey = `${functionId}-${categoryId}`;

      // Check if data is already cached
      if (functionMenuData[cacheKey]) {
        setLoading(false);
        return;
      }

      const responseData = await FetchMenuPrep(functionId, categoryId);

      // Cache the menu items
      setFunctionMenuData((prev) => ({
        ...prev,
        [cacheKey]: responseData.menuItems || [],
      }));

      // Process selected items if they exist
      if (responseData.selectedItems && responseData.selectedItems.length > 0) {
        setFunctionSelectionData((prev) => ({
          ...prev,
          [functionId]: {
            ...prev[functionId],
            selectedItems: responseData.selectedItems.map(
              (item) => item.menuItemId
            ),
            itemNotes: responseData.selectedItems.reduce((acc, item) => {
              acc[item.menuItemId] = item.itemNotes || "";
              return acc;
            }, {}),
            itemRates: responseData.selectedItems.reduce((acc, item) => {
              acc[item.menuItemId] = item.itemPrice || rate;
              return acc;
            }, {}),
            isSaved: true,
          },
        }));
      }
    } catch (error) {
      console.error("Error loading function menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const FetchMenuPrep = (
    eventFunId,
    menuCatId,
    pageNo = 1,
    totalRecord = 50
  ) => {
    return Getmenuprep(eventFunId, menuCatId, pageNo, totalRecord, Id)
      .then((res) => {
        const responseData = res?.data?.data;
        const menuItems = (responseData["menuPreparationItems"] || []).map(
          (item) => ({
            id: item.menuItemId,
            parentId: item.menuCategoryId,
            name: item.menuItemName,
            image: item.imagePath,
            price: item.itemPrice,
            isSelected: item.isSelected || false,
          })
        );

        // Process selected menu preparation items
        const selectedMenuCategories =
          responseData["selectedMenuPreparationItems"] || [];
        let selectedItems = [];

        if (selectedMenuCategories.length > 0) {
          selectedMenuCategories.forEach((category) => {
            if (category.selectedMenuPreparationItems) {
              selectedItems.push(...category.selectedMenuPreparationItems);
            }
          });
        }

        return {
          menuItems,
          selectedItems,
          responseData,
        };
      })
      .catch((error) => {
        console.error("Error fetching menu prep data:", error);
        throw error;
      });
  };

  const handleTabChange = async (newFunctionId) => {
    if (selectedFunctionId === newFunctionId) return;

    setLoading(true);

    // Update selected function
    setSelectedFunctionId(newFunctionId);

    // Update pax and rate based on selected function
    const selectedFunction = eventAllData[0]?.eventFunctions?.find(
      (fn) => fn.id === newFunctionId
    );
    if (selectedFunction) {
      setPax(selectedFunction.pax || 0);
      setRate(selectedFunction.rate || 0);
    }

    // Load menu data for the new function
    await loadFunctionMenuData(newFunctionId, selectedCategoryId);

    setLoading(false);
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    if (selectedFunctionId) {
      await loadFunctionMenuData(selectedFunctionId, categoryId);
    }
  };

  const handleSave = () => {
    const currentFunctionData = functionSelectionData[selectedFunctionId];
    if (
      !currentFunctionData ||
      currentFunctionData.selectedItems.length === 0
    ) {
      errorMsgPopup("Please select at least one item");
      return;
    }

    const cacheKey = `${selectedFunctionId}-${selectedCategoryId}`;
    const allMenuItems = functionMenuData[cacheKey] || [];

    const selectedItems = currentFunctionData.selectedItems
      .map((id) => allMenuItems.find((item) => item.id === id))
      .filter(Boolean);

    const payload = {
      defaultPrice: rate || 0,
      eventFunctionId: selectedFunctionId,
      id: 0,
      menuPreparationDetails: selectedItems.map((item, index) => {
        const category = categories.find((cat) => cat.id === item.parentId);
        return {
          id: 0,
          itemNotes: currentFunctionData.itemNotes[item.id] || "",
          itemPrice:
            Number(currentFunctionData.itemRates[item.id]) || Number(rate) || 0,
          itemSortOrder: index + 1,
          menuCategoryId: item.parentId,
          menuCategoryName: category?.name || "",
          menuItemId: item.id,
          menuItemName: item.name,
          menuNotes: "",
          menuSortOrder: index + 1,
          startTime: dateandtime,
        };
      }),
      pax: Number(pax) || 0,
      price: calculateTotalPrice(),
      sortorder: 0,
    };

    AddMenuprep(payload)
      .then((res) => {
        console.log("✅ Saved:", res.data);
        if (res.data?.msg) {
          successMsgPopup(res.data.msg);
        }

        // Mark this function as saved
        setFunctionSelectionData((prev) => ({
          ...prev,
          [selectedFunctionId]: {
            ...prev[selectedFunctionId],
            isSaved: true,
          },
        }));

        // Refresh data to get the latest selectedMenuPreparationItems
        loadFunctionMenuData(selectedFunctionId, selectedCategoryId);
      })
      .catch((err) => {
        console.error("❌ Save failed:", err);
        errorMsgPopup("Failed to save menu preparation");
      });
  };

  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

  // Get current function's menu items
  const cacheKey = `${selectedFunctionId}-${selectedCategoryId}`;
  const currentMenuItems = functionMenuData[cacheKey] || [];

  const filteredChildren = currentMenuItems.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

  // Get current function's selection data
  const currentFunctionData = functionSelectionData[selectedFunctionId] || {
    selectedItems: [],
    itemNotes: {},
    itemRates: {},
  };

  const toggleChildSelection = (id) => {
    setFunctionSelectionData((prev) => ({
      ...prev,
      [selectedFunctionId]: {
        ...prev[selectedFunctionId],
        selectedItems: prev[selectedFunctionId]?.selectedItems?.includes(id)
          ? prev[selectedFunctionId].selectedItems.filter(
              (itemId) => itemId !== id
            )
          : [...(prev[selectedFunctionId]?.selectedItems || []), id],
        isSaved: false, // Mark as unsaved when making changes
      },
    }));
  };

  const handleNoteChange = (id, note) => {
    setFunctionSelectionData((prev) => ({
      ...prev,
      [selectedFunctionId]: {
        ...prev[selectedFunctionId],
        itemNotes: {
          ...prev[selectedFunctionId]?.itemNotes,
          [id]: note,
        },
        isSaved: false,
      },
    }));
  };

  const handleItemRateChange = (id, value) => {
    setFunctionSelectionData((prev) => ({
      ...prev,
      [selectedFunctionId]: {
        ...prev[selectedFunctionId],
        itemRates: {
          ...prev[selectedFunctionId]?.itemRates,
          [id]: value,
        },
        isSaved: false,
      },
    }));
  };

  const calculateTotalPrice = () => {
    if (!currentFunctionData.selectedItems) return 0;

    return currentFunctionData.selectedItems.reduce((sum, itemId) => {
      const itemRate =
        Number(currentFunctionData.itemRates[itemId]) || Number(rate) || 0;
      return sum + itemRate * pax;
    }, 0);
  };

  const selectedItems = currentFunctionData.selectedItems
    .map((id) => currentMenuItems.find((item) => item.id === id))
    .filter(Boolean);

  const selectedItemsByCategory = selectedItems.reduce((acc, item) => {
    const category = categories.find((cat) => cat.id === item.parentId);
    const categoryName = category?.name || "Uncategorized";
    if (!acc[categoryName]) acc[categoryName] = [];
    acc[categoryName].push(item);
    return acc;
  }, {});

  const removeSelectedItem = (itemId) => {
    setFunctionSelectionData((prev) => ({
      ...prev,
      [selectedFunctionId]: {
        ...prev[selectedFunctionId],
        selectedItems: prev[selectedFunctionId].selectedItems.filter(
          (id) => id !== itemId
        ),
        isSaved: false,
      },
    }));
  };

  return (
    <Fragment>
      <Container className="flex flex-col min-h-screen">
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "Menu Preparations" }]} />
        </div>
        <div className="border rounded mb-4 flex-1">
          <div className="grid grid-cols-6 lg:grid-cols-12">
            {/* left */}
            <div className="col-span-9">
              <div className="border-b p-3 shrink-0 bg-muted/25">
                <div className="flex items-center justify-between">
                  <Tooltip
                    placement="right"
                    color="white"
                    overlayInnerStyle={{
                      padding: "12px",
                      borderRadius: "8px",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                      minWidth: "220px",
                    }}
                    title={
                      <div className="text-gray-800 text-sm space-y-1">
                        <p className="font-semibold text-base mb-2">
                          Order Details
                        </p>
                        <p>
                          <span className="text-gray-700">ID:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.id}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Customer:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.customer}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Event Type:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.eventType}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Event Date:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.eventDate}
                          </span>
                        </p>
                        <p>
                          <span className="text-gray-700">Venue:</span>
                          <span className="font-medium text-gray-900 ms-1">
                            {orderDetails.venue}
                          </span>
                        </p>
                      </div>
                    }
                  >
                    <span className="cursor-pointer text-sm font-semibold">
                      <span className="text-gray-900 uppercase">Order ID:</span>
                      <span className="text-primary ms-1">
                        {orderDetails.id}
                      </span>
                    </span>
                  </Tooltip>
                  <div className="flex flex-row gap-8">
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Person:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <i className="ki-filled ki-user text-sm text-primary"></i>
                      </strong>
                      <input
                        type="number"
                        min={1}
                        className="input input-sm w-20"
                        value={pax}
                        onChange={(e) => setPax(e.target.value)}
                      />
                    </p>
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Date &amp; Time:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <i className="ki-filled ki-calendar-tick text-sm text-primary"></i>
                      </strong>
                      <input
                        type="text"
                        className="input input-sm w-36"
                        disabled
                        value={dateandtime}
                        onChange={(e) => setDateandtime(e.target.value)}
                      />
                    </p>
                    <p className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-gray-900">
                        Default Rate:
                      </span>
                      <strong className="w-[15px] text-center text-sm font-medium text-gray-900">
                        <span className="text-sm text-primary">&#8377;</span>
                      </strong>
                      <input
                        type="number"
                        value={rate}
                        onChange={(e) => setRate(e.target.value)}
                        className="input input-sm w-20"
                      />
                    </p>
                  </div>
                  <Tooltip title="Collapse">
                    <button
                      type="button"
                      title="Collapse"
                      className="sga__btn flex items-center justify-center rounded-full p-0"
                    >
                      <PanelLeftOpen
                        className="text-primary stroke-2"
                        style={{ width: "24px" }}
                      />
                    </button>
                  </Tooltip>
                </div>
              </div>
              <div
                className={`pt-3 px-3 border-b shrink-0 ${classes.customStyle}`}
              >
                <TabComponent
                  tabs={menuPreparationsTabs}
                  onTabChange={handleTabChange}
                />
              </div>
              <div
                className={`grid grid-cols-1 lg:grid-cols-9 ${classes.customStyle}`}
              >
                <div className="col-span-3">
                  <div className="h-full lg:border-e lg:border-e-border">
                    <div className="border-b p-3 rounded-t-lg">
                      <div className="relative">
                        <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                        <input
                          type="text"
                          className="input pl-8"
                          placeholder="Search categories"
                          value={search}
                          onChange={(e) => setSearch(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="flex-1 max-h-[520px] overflow-auto scrollable-y">
                      <div className="h-full">
                        {filteredCategories.length === 0 ? (
                          <div className="p-2 text-gray-400 text-xs text-center">
                            No categories found
                          </div>
                        ) : (
                          filteredCategories.map(({ name, id }) => (
                            <button
                              key={id}
                              onClick={() => handleCategoryChange(id)}
                              className={`w-full text-left py-3 px-4 border-b last:border-b-0 transition-colors font-semibold text-sm ${
                                selectedCategoryId === id
                                  ? "bg-blue-50 text-primary"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              {name}
                            </button>
                          ))
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-6">
                  <div className="h-full">
                    <div className="border-b p-3 bg-light flex items-center gap-3">
                      <div className="select__grp flex flex-col w-full">
                        <div className="sg__inner flex items-center gap-1 relative">
                          <div className="relative w-full">
                            <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
                            <input
                              type="text"
                              className="input pl-8"
                              placeholder="Search items"
                              value={childSearch}
                              onChange={(e) => setChildSearch(e.target.value)}
                            />
                          </div>
                          <Tooltip title="Add menu item">
                            <button
                              type="button"
                              onClick={() => console.log("Add clicked")}
                              title="Add"
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <i className="ki-filled ki-plus"></i>
                            </button>
                          </Tooltip>
                          <Tooltip title="Start speech to text">
                            <button
                              type="button"
                              onClick={() => console.log("Mic clicked")}
                              title="Mic"
                              className="sga__btn me-1 btn btn-primary flex items-center justify-center rounded-full p-0 w-8 h-8"
                            >
                              <Mic size={18} />
                            </button>
                          </Tooltip>
                        </div>
                      </div>
                    </div>
                    <div className="flex-1 p-3 max-h-[520px] overflow-auto scrollable-y">
                      {loading ? (
                        <div className="p-4 text-center text-gray-500">
                          Loading menu items...
                        </div>
                      ) : filteredChildren.length === 0 ? (
                        <div className="p-2 text-gray-400 text-xs text-center">
                          No items found
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                          {filteredChildren.map(
                            ({ parentId, id, name, image }) => (
                              <div
                                key={id}
                                className={`flex flex-col items-start border rounded-lg cursor-pointer aspect-square transition-all relative ${
                                  currentFunctionData.selectedItems?.includes(
                                    id
                                  )
                                    ? "border-success bg-green-300/10 text-success"
                                    : "hover:bg-blue-500/10 hover:border-blue-500/15"
                                }`}
                                onClick={() => toggleChildSelection(id)}
                              >
                                <div className="w-full h-16 rounded overflow-hidden flex items-center justify-center">
                                  <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="w-full h-12 font-medium px-2 pt-2 pb-1 text-center text-xs flex items-center justify-center">
                                  {name}
                                </div>
                                {currentFunctionData.selectedItems?.includes(
                                  id
                                ) && (
                                  <span className="bg-success w-5 h-5 rounded-full shadow-lg shadow-green-500/50 absolute top-1 right-1 flex items-center justify-center">
                                    <i className="ki-filled ki-check text-sm text-light"></i>
                                  </span>
                                )}
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* right */}
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
                <div className="flex-1 p-3 max-h-[516px] h-full overflow-auto scrollable-y bg-white">
                  {currentFunctionData.selectedItems?.length === 0 ? (
                    <div className="text-xs text-gray-400 p-2 text-center">
                      No items selected
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {Object.entries(selectedItemsByCategory).map(
                        ([categoryName, items]) => (
                          <div key={categoryName} className="mb-2">
                            <div className="flex items-center justify-between gap-2 mb-1">
                              <span className="font-semibold text-xs text-gray-900">
                                {categoryName}
                              </span>
                              <Tooltip title="Expand">
                                <button className="p-0 w-6 h-6" title="Expand">
                                  <i className="ki-filled ki-down text-md"></i>
                                </button>
                              </Tooltip>
                            </div>
                            <ul className="bg-white rounded border shadow-sm">
                              {items.map((item) => (
                                <li
                                  key={item.id}
                                  className="flex flex-col border-b last:border-0 p-3"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                      <span
                                        className="w-8 h-8 rounded overflow-hidden"
                                        style={{ flex: "0 0 2rem" }}
                                      >
                                        <img
                                          src={item.image}
                                          alt={item.name}
                                          className="w-full h-full object-cover"
                                        />
                                      </span>
                                      <span className="text-xs font-medium">
                                        {item.name}
                                      </span>
                                    </div>
                                    <div>
                                      <button
                                        className="ml-2 text-gray-400 hover:text-gray-500"
                                        title="Info"
                                      >
                                        <i className="ki-filled ki-information-1"></i>
                                      </button>
                                      <Tooltip title="Remove">
                                        <button
                                          className="ml-2 text-gray-400 hover:text-red-500"
                                          title="Remove"
                                          onClick={() =>
                                            removeSelectedItem(item.id)
                                          }
                                        >
                                          <i className="ki-filled ki-trash"></i>
                                        </button>
                                      </Tooltip>
                                    </div>
                                  </div>

                                  {showDetails && (
                                    <div className="flex items-center justify-between mt-1 gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-500">
                                          Rate:
                                        </span>
                                        <input
                                          type="number"
                                          value={
                                            currentFunctionData.itemRates?.[
                                              item.id
                                            ] ?? rate
                                          }
                                          onChange={(e) =>
                                            handleItemRateChange(
                                              item.id,
                                              e.target.value
                                            )
                                          }
                                          min={0}
                                          className="input input-sm w-20"
                                        />
                                      </div>
                                    </div>
                                  )}

                                  {showDetails && (
                                    <div className="mt-2">
                                      <textarea
                                        placeholder="Add notes..."
                                        value={
                                          currentFunctionData.itemNotes?.[
                                            item.id
                                          ] || ""
                                        }
                                        onChange={(e) =>
                                          handleNoteChange(
                                            item.id,
                                            e.target.value
                                          )
                                        }
                                        className="textarea textarea-sm w-full text-xs"
                                        rows="2"
                                      />
                                    </div>
                                  )}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )}
                    </div>
                  )}
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
          <button className="btn btn-light" title="Cancel">
            Cancel
          </button>
          <button
            className="btn btn-success"
            title="Save Menu"
            onClick={handleSave}
            disabled={loading || !currentFunctionData.selectedItems?.length}
          >
            <i className="ki-filled ki-save-2"></i>
            Save Menu
            {currentFunctionData.isSaved && (
              <span className="ml-2 text-xs">(Saved)</span>
            )}
          </button>
        </div>
      </Container>
    </Fragment>
  );
};

export default EventPreparationPage;
