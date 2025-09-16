import { useState, Fragment, useEffect, useCallback } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { Eye, EyeOff, Mic, PanelLeftOpen } from "lucide-react";
import TabComponent from "@/components/tab/TabComponent";
import useStyles from "./style";
import { Tooltip, Popconfirm } from "antd";
import { errorMsgPopup, successMsgPopup } from "../../../underConstruction";
import { useParams } from "react-router-dom";
import AddMenuItem from "@/partials/modals/add-menu-item/AddMenuItem";
import AddMenuCategory from "@/partials/modals/add-menu-category/AddMenuCategory";
import MenuNotes from "@/partials/modals/menu-notes/MenuNotes";
import CategoryNotes from "@/partials/modals/category-note/CategoryNotes";
import { useNavigate } from "react-router-dom";
import {
  GetAllCategoryformenu,
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
  Deleteiteminmenu,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const EventPreparationPage = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const { eventId } = useParams();
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [eventAllData, setEventAllData] = useState({});
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [orderDetails, setOrderDetails] = useState({});
  const [menuPreparationsTabs, setMenuPreparationsTabs] = useState([]);
  const [rate, setRate] = useState(0);
  const [pax, setPax] = useState(0);
  const [dateandtime, setDateandtime] = useState("");
  const [selectedFunctionId, setSelectedFunctionId] = useState(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState(0);
  const [functionMenuData, setFunctionMenuData] = useState({});
  const [functionSelectionData, setFunctionSelectionData] = useState({});
  const [allMenuItems, setAllMenuItems] = useState({});
  const [loading, setLoading] = useState(false);
  const [expandedCategories, setExpandedCategories] = useState({});
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [menuPreparationIds, setMenuPreparationIds] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [currentItemForNotes, setCurrentItemForNotes] = useState(null);
  const [categoryNotes, setCategoryNotes] = useState({
    categoryNotes: "",
    categorySlogan: "",
  });
  const [currentCategoryForNotes, setCurrentCategoryForNotes] = useState(null);
  const [showCategoryNoteModal, setShowCategoryNoteModal] = useState(false);
  const [itemNotes, setItemNotes] = useState({
    itemsNotes: "",
    itemSlogan: "",
  });
  const classes = useStyles();
  const [search, setSearch] = useState("");
  const [childSearch, setChildSearch] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];
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
              <div
                onClick={() => {
                  handleTabChange(fn.id);
                }}
                style={{ cursor: "pointer" }}
              >
                <i className="ki-filled ki-disk"></i> {fn.name}
              </div>
            ),
            value: fn.id,
            children: "",
          }));

          setMenuPreparationsTabs(dynamicTabs);
          const initialFunctionData = {};
          firstEvent.eventFunctions.forEach((fn) => {
            initialFunctionData[fn.id] = {
              selectedItems: [],
              itemNotes: {},
              itemSlogans: {},
              itemRates: {},
              categoryNotes: {},
              categorySlogans: {},
              isSaved: false,
              pax: fn.pax || 0,
              rate: fn.rate || 0,
            };
          });
          setFunctionSelectionData(initialFunctionData);

          if (firstEvent.eventFunctions.length > 0) {
            const firstFnId = firstEvent.eventFunctions[0].id;
            setSelectedFunctionId(firstFnId);
            setPax(firstEvent.eventFunctions[0].pax || 0);
            setRate(firstEvent.eventFunctions[0].rate || 0);

            loadAllMenuDataForFunction(firstFnId).then(() => {
              loadFunctionMenuData(firstFnId, 0);
            });
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
  const toggleCategoryExpand = (categoryName) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [categoryName]: !prev[categoryName],
    }));
  };

  const handleNoteSave = (savedNotes) => {
    if (currentItemForNotes) {
      setFunctionSelectionData((prev) => ({
        ...prev,
        [selectedFunctionId]: {
          ...prev[selectedFunctionId],
          itemNotes: {
            ...prev[selectedFunctionId]?.itemNotes,
            [currentItemForNotes]: savedNotes.itemsNotes || "",
          },
          itemSlogans: {
            ...(prev[selectedFunctionId]?.itemSlogans || {}),
            [currentItemForNotes]: savedNotes.itemSlogan || "",
          },
          isSaved: false,
        },
      }));
    }
    setShowNoteModal(false);
    setCurrentItemForNotes(null);
  };

  const handleCategoryNoteSave = (savedNotes) => {
    if (currentCategoryForNotes !== null) {
      setFunctionSelectionData((prev) => {
        const updated = {
          ...prev,
          [selectedFunctionId]: {
            ...prev[selectedFunctionId],
            categoryNotes: {
              ...(prev[selectedFunctionId]?.categoryNotes || {}),
              [currentCategoryForNotes]: savedNotes.categoryNotes || "",
            },
            categorySlogans: {
              ...(prev[selectedFunctionId]?.categorySlogans || {}),
              [currentCategoryForNotes]: savedNotes.categorySlogan || "",
            },
            isSaved: false,
          },
        };

        return updated;
      });
    }
    setShowCategoryNoteModal(false);
    setCurrentCategoryForNotes(null);
  };

  const loadAllMenuDataForFunction = async (functionId) => {
    try {
      const allCategoriesData = await Promise.all([
        FetchMenuPrep(functionId, 0),
        ...categories.map((category) => FetchMenuPrep(functionId, category.id)),
      ]);

      const combinedMenuItems = [];
      const seenIds = new Set();

      allCategoriesData.forEach((categoryData) => {
        if (categoryData.menuItems) {
          categoryData.menuItems.forEach((item) => {
            if (!seenIds.has(item.id)) {
              combinedMenuItems.push(item);
              seenIds.add(item.id);
            }
          });
        }
      });

      setAllMenuItems((prev) => ({
        ...prev,
        [functionId]: combinedMenuItems,
      }));
    } catch (error) {
      console.error("Error loading all menu data for function:", error);
    }
  };

  const loadFunctionMenuData = async (
    functionId,
    categoryId = selectedCategoryId,
    preserveSelections = false
  ) => {
    setLoading(true);
    try {
      const responseData = await FetchMenuPrep(functionId, categoryId);
      const cacheKey = `${functionId}-${categoryId}`;
      setFunctionMenuData((prev) => ({
        ...prev,
        [cacheKey]: responseData.menuItems || [],
      }));

      if (responseData.responseData?.menuPreparation?.id) {
        setMenuPreparationIds((prev) => ({
          ...prev,
          [functionId]: responseData.responseData.menuPreparation.id,
        }));
      }
      const hasExistingSelections =
        functionSelectionData[functionId]?.selectedItems?.length > 0;

      if (!preserveSelections || !hasExistingSelections) {
        if (
          responseData.selectedItems &&
          responseData.selectedItems.length > 0
        ) {
          setFunctionSelectionData((prev) => ({
            ...prev,
            [functionId]: {
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
                if (item.menuNotes) {
                  acc[item.menuCategoryId] = item.menuNotes;
                }
                return acc;
              }, {}),
              categorySlogans: responseData.selectedItems.reduce(
                (acc, item) => {
                  if (item.menuSlogan) {
                    acc[item.menuCategoryId] = item.menuSlogan;
                  }
                  return acc;
                },
                {}
              ),
              itemRates: responseData.selectedItems.reduce((acc, item) => {
                acc[item.menuItemId] = item.itemPrice || 0;
                return acc;
              }, {}),
              isSaved: true,
              pax: responseData.responseData?.menuPreparation?.pax || pax,
              rate:
                responseData.responseData?.menuPreparation?.defaultPrice ||
                rate,
            },
          }));

          if (functionId === selectedFunctionId) {
            if (responseData.responseData?.menuPreparation?.pax) {
              setPax(responseData.responseData.menuPreparation.pax);
            }
            if (
              responseData.responseData?.menuPreparation?.defaultPrice !==
              undefined
            ) {
              setRate(responseData.responseData.menuPreparation.defaultPrice);
            }
          }
        } else {
          setFunctionSelectionData((prev) => ({
            ...prev,
            [functionId]: {
              selectedItems: [],
              itemNotes: {},
              itemRates: {},
              categoryNotes: {},
              categorySlogans: {},
              isSaved: false,
              pax: prev[functionId]?.pax || 0,
              rate: prev[functionId]?.rate || 0,
            },
          }));
        }
      } else {
        if (
          responseData.selectedItems &&
          responseData.selectedItems.length > 0
        ) {
          setFunctionSelectionData((prev) => {
            const currentSelections = prev[functionId]?.selectedItems || [];
            const currentNotes = prev[functionId]?.itemNotes || {};
            const currentRates = prev[functionId]?.itemRates || {};

            const apiSelections = responseData.selectedItems.map(
              (item) => item.menuItemId
            );
            const mergedSelections = [
              ...new Set([...currentSelections, ...apiSelections]),
            ];
            const mergedNotes = { ...currentNotes };
            const mergedRates = { ...currentRates };
            const mergedSlogans = { ...(prev[functionId]?.itemSlogans || {}) };

            responseData.selectedItems.forEach((item) => {
              if (item.itemNotes) {
                mergedNotes[item.menuItemId] = item.itemNotes;
              }
              if (item.itemPrice) {
                mergedRates[item.menuItemId] = item.itemPrice;
              }
              if (item.itemSlogan) {
                mergedSlogans[item.menuItemId] = item.itemSlogan;
              }
            });

            return {
              ...prev,
              [functionId]: {
                ...prev[functionId],
                selectedItems: mergedSelections,
                itemNotes: mergedNotes,
                itemSlogans: mergedSlogans,
                itemRates: mergedRates,
                isSaved: prev[functionId]?.isSaved !== false ? true : false,
              },
            };
          });
        }
      }
    } catch (error) {
      console.error("❌ Error loading function menu data:", error);
    } finally {
      setLoading(false);
    }
  };

  const clearFunctionCache = (functionId) => {
    setFunctionMenuData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (key.startsWith(`${functionId}-`)) {
          delete newData[key];
        }
      });
      return newData;
    });
  };

  const FetchMenuPrep = (
    eventFunctionId,
    menuCategoryId = null,
    pageNo = 1,
    totalRecord = 50
  ) => {
    return Getmenuprep(eventFunctionId, menuCategoryId, pageNo, totalRecord, Id)
      .then((res) => {
        const responseData = res?.data?.data;

        const menuItems = (responseData["menuPreparationItems"] || []).map(
          (item) => ({
            id: item.menuItemId,
            parentId: item.menuCategoryId,
            name: item.menuItemName,
            image: item.imagePath?.replace("jcupload", "uploads") || "",
            price: item.itemPrice,
            isSelected: false,
          })
        );

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

        const updatedMenuItems = menuItems.map((item) => ({
          ...item,
          isSelected: selectedItems.some(
            (selectedItem) => selectedItem.menuItemId === item.id
          ),
        }));

        return {
          menuItems: updatedMenuItems,
          selectedItems,
          responseData,
        };
      })
      .catch((error) => {
        console.error("❌ Error fetching menu prep data:", error);
        throw error;
      });
  };

  const handleTabChange = async (newFunctionId) => {
    if (selectedFunctionId === newFunctionId) {
      return;
    }

    setLoading(true);

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
        await loadAllMenuDataForFunction(newFunctionId);
      }

      const currentCacheKey = `${newFunctionId}-${selectedCategoryId}`;
      setFunctionMenuData((prev) => {
        const newData = { ...prev };
        delete newData[currentCacheKey];

        return newData;
      });

      await loadFunctionMenuData(newFunctionId, selectedCategoryId);
    } catch (error) {
      console.error("❌ Error in handleTabChange:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);

    if (selectedFunctionId) {
      const cacheKey = `${selectedFunctionId}-${categoryId}`;
      setFunctionMenuData((prev) => {
        const newData = { ...prev };
        delete newData[cacheKey];
        return newData;
      });

      await loadFunctionMenuData(selectedFunctionId, categoryId, true);
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

    const allFunctionMenuItems = allMenuItems[selectedFunctionId] || [];
    const selectedItems = currentFunctionData.selectedItems
      .map((id) => allFunctionMenuItems.find((item) => item.id === id))
      .filter(Boolean);

    const existingId = menuPreparationIds[selectedFunctionId] || 0;

    const payload = {
      defaultPrice: rate || 0,
      eventFunctionId: selectedFunctionId,
      id: existingId,
      menuPreparationDetails: selectedItems.map((item, index) => {
        const category = categories.find((cat) => cat.id === item.parentId);

        return {
          id: 0,
          itemNotes: currentFunctionData.itemNotes[item.id] || "",
          itemSlogan: currentFunctionData.itemSlogans?.[item.id] || "",
          itemPrice:
            Number(currentFunctionData.itemRates[item.id]) || Number(rate) || 0,
          itemSortOrder: index + 1,
          menuNotes: currentFunctionData.categoryNotes?.[item.parentId] || "",
          menuSlogan:
            currentFunctionData.categorySlogans?.[item.parentId] || "",
          menuCategoryId: item.parentId,
          menuCategoryName: category?.name || "",
          menuItemId: item.id,
          menuItemName: item.name,
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
        if (res.data?.msg) {
          Swal.fire({
            title: `${res.data?.msg}`,
            text: "",
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
            showClass: {
              popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
            },
          });
        }

        if (existingId === 0 && res.data?.data?.menuPreparation?.id) {
          setMenuPreparationIds((prev) => ({
            ...prev,
            [selectedFunctionId]: res.data.data.menuPreparation.id,
          }));
        }

        setFunctionSelectionData((prev) => ({
          ...prev,
          [selectedFunctionId]: {
            ...prev[selectedFunctionId],
            isSaved: true,
          },
        }));
        clearFunctionCache(selectedFunctionId);
        loadFunctionMenuData(selectedFunctionId, selectedCategoryId);
      })
      .catch((err) => {
        console.error("❌ Save failed:", err);
        errorMsgPopup("Failed to save menu preparation");
      });
  };

  const filteredCategories = categoriesWithAll.filter(({ name }) =>
    name.toLowerCase().includes(search.toLowerCase())
  );

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

  const filteredChildren = menuItemsWithSelectionState.filter((child) =>
    child.name.toLowerCase().includes(childSearch.toLowerCase())
  );

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
        isSaved: false,
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

  const handlePaxChange = (newPax) => {
    setPax(newPax);
    if (currentFunctionData.selectedItems?.length > 0) {
      setFunctionSelectionData((prev) => ({
        ...prev,
        [selectedFunctionId]: {
          ...prev[selectedFunctionId],
          isSaved: false,
        },
      }));
    }
  };

  const handleRateChange = (newRate) => {
    setRate(newRate);
    if (currentFunctionData.selectedItems?.length > 0) {
      setFunctionSelectionData((prev) => ({
        ...prev,
        [selectedFunctionId]: {
          ...prev[selectedFunctionId],
          isSaved: false,
        },
      }));
    }
  };

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

  const removeSelectedItem = async (itemId, menuCatId, menuPrepId) => {
    try {
      if (!menuPrepId) {
        console.error("❌ Menu Preparation ID is missing");
        errorMsgPopup("Menu preparation not found. Please save first.");
        return;
      }

      const res = await Deleteiteminmenu(itemId, menuCatId, menuPrepId);

      if (res.data?.msg) {
        Swal.fire({
          title: `${res.data?.msg}`,
          text: "",
          icon: "success",
          background: "#f5faff",
          color: "#003f73",
          confirmButtonText: "Okay",
          confirmButtonColor: "#005BA8",
          showClass: {
            popup: `
      animate__animated
      animate__fadeInDown
      animate__faster
    `,
          },
        });
      }

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
    } catch (error) {
      console.error("Error deleting item:", error);
      errorMsgPopup("Failed to delete item");
    }
  };

  const isUpdateOperation = menuPreparationIds[selectedFunctionId] > 0;

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
                        onChange={(e) => handlePaxChange(e.target.value)}
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
                        onChange={(e) => handleRateChange(e.target.value)}
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
                    <div className="border-b p-3 rounded-t-lg sg__inner relative w-full">
                      <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute left-3 top-1/2 -translate-y-1/2"></i>

                      <input
                        type="text"
                        className="input pl-10 pr-12 w-full"
                        placeholder="Search categories"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                      />

                      <Tooltip title="Add menu category">
                        <button
                          type="button"
                          onClick={() => setIsCategoryModalOpen(true)}
                          title="Add"
                          className="absolute top-1/2 right-4 -translate-y-1/2 btn btn-primary w-8 h-8 flex items-center justify-center rounded-full"
                        >
                          <i className="ki-filled ki-plus text-md"></i>
                        </button>
                      </Tooltip>
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
                              onClick={() => setIsItemModalOpen(true)}
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
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4">
                          {filteredChildren.map(
                            ({ parentId, id, name, image, isSelected }) => (
                              <div
                                key={id}
                                className={`flex flex-col items-start border rounded-lg cursor-pointer  transition-all relative ${
                                  isSelected
                                    ? "border-success bg-green-300/10 text-success"
                                    : "hover:bg-blue-500/10 hover:border-blue-500/15"
                                }`}
                                onClick={() => toggleChildSelection(id)}
                              >
                                <div className="w-full h-20 rounded overflow-hidden flex items-center justify-center">
                                  <img
                                    src={image}
                                    alt={name}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <div className="w-full h-12 font-medium px-2 pt-2 pb-1 text-center text-xs flex items-center justify-center">
                                  {name}
                                </div>
                                {isSelected && (
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
                      {categoriesWithAll
                        .map((cat) => cat.name)
                        .filter(
                          (categoryName) =>
                            selectedItemsByCategory[categoryName]?.length
                        )
                        .map((categoryName) => {
                          const items = selectedItemsByCategory[categoryName];
                          return (
                            <div key={categoryName} className="mb-2">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="font-semibold text-xs text-gray-900">
                                  {categoryName}

                                  <Tooltip title="Category Notes">
                                    <button
                                      className="ml-2 text-gray-400 hover:text-gray-500"
                                      title="Info"
                                      onClick={() => {
                                        const firstItem = items[0];
                                        const actualCategoryId = firstItem
                                          ? firstItem.parentId
                                          : 0;

                                        setCurrentCategoryForNotes(
                                          actualCategoryId
                                        );
                                        setCategoryNotes({
                                          categoryNotes:
                                            currentFunctionData.categoryNotes?.[
                                              actualCategoryId
                                            ] || "",
                                          categorySlogan:
                                            currentFunctionData
                                              .categorySlogans?.[
                                              actualCategoryId
                                            ] || "",
                                        });
                                        setShowCategoryNoteModal(true);
                                      }}
                                    >
                                      <i className="ki-filled ki-notepad"></i>
                                    </button>
                                  </Tooltip>
                                </span>
                                <Tooltip title="Expand">
                                  <button
                                    className="p-0 w-6 h-6"
                                    title="Expand"
                                    onClick={() =>
                                      toggleCategoryExpand(categoryName)
                                    }
                                  >
                                    <i
                                      className={`ki-filled ${
                                        expandedCategories[categoryName]
                                          ? "ki-up"
                                          : "ki-down"
                                      } text-md`}
                                    ></i>
                                  </button>
                                </Tooltip>
                              </div>
                              {expandedCategories[categoryName] && (
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
                                          <Tooltip title="Notes">
                                            <button
                                              className="ml-2 text-gray-400 hover:text-gray-500"
                                              title="Info"
                                              onClick={() => {
                                                setCurrentItemForNotes(item.id);
                                                setItemNotes({
                                                  itemsNotes:
                                                    currentFunctionData
                                                      .itemNotes?.[item.id] ||
                                                    "",
                                                  itemSlogan:
                                                    currentFunctionData
                                                      .itemSlogans?.[item.id] ||
                                                    "",
                                                });
                                                setShowNoteModal(true);
                                              }}
                                            >
                                              <i className="ki-filled ki-notepad"></i>
                                            </button>
                                          </Tooltip>
                                          <Popconfirm
                                            title="Are you sure to delete this item?"
                                            onConfirm={() =>
                                              removeSelectedItem(
                                                item.id,
                                                item.parentId,
                                                menuPreparationIds[
                                                  selectedFunctionId
                                                ]
                                              )
                                            }
                                            onCancel={() =>
                                              console.log("Cancelled")
                                            }
                                            okText="Yes"
                                            cancelText="No"
                                          >
                                            <Tooltip title="Remove">
                                              <button
                                                className="ml-2 text-gray-400 hover:text-red-500"
                                                title="Remove"
                                              >
                                                <i className="ki-filled ki-trash"></i>
                                              </button>
                                            </Tooltip>
                                          </Popconfirm>
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
                                                ] ??
                                                item.price ??
                                                rate
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
                                    </li>
                                  ))}
                                </ul>
                              )}
                            </div>
                          );
                        })}
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
          <button
            className="btn btn-light"
            title="Cancel"
            onClick={() => navigate("/event")}
          >
            Cancel
          </button>
          <button
            className={`btn ${isUpdateOperation ? "btn-warning" : "btn-success"}`}
            title={isUpdateOperation ? "Update Menu" : "Save Menu"}
            onClick={handleSave}
            disabled={loading || !currentFunctionData.selectedItems?.length}
          >
            <i
              className={`ki-filled ${isUpdateOperation ? "ki-pencil" : "ki-save-2"}`}
            ></i>
            {isUpdateOperation ? "Update Menu" : "Save Menu"}
            {currentFunctionData.isSaved && (
              <span className="ml-2 text-xs">(Saved)</span>
            )}
          </button>
        </div>
        <AddMenuItem
          isModalOpen={isItemModalOpen}
          setIsModalOpen={(val) => {
            setIsItemModalOpen(val);
          }}
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
