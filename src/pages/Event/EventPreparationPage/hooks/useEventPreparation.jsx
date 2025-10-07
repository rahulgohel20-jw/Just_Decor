import { useState, useCallback, useReducer } from "react";
import { useParams } from "react-router-dom";
import {
  GetAllCategoryformenu,
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
} from "@/services/apiServices";
import { errorMsgPopup } from "@/underConstruction";
import Swal from "sweetalert2";

const useEventData = () => {
  const { eventId } = useParams();
  const [eventAllData, setEventAllData] = useState({});
  const [orderDetails, setOrderDetails] = useState({});
  const [menuPreparationsTabs, setMenuPreparationsTabs] = useState([]);
  const [startDateandtime, setStartDateandtime] = useState("");
  const [endDateandtime, setEndDateandtime] = useState("");
  const fetchEventData = useCallback(async () => {
    try {
      const res = await GetEventMasterById(eventId);

      const alleventdata = res?.data?.data["Event Details"].map((item) => ({
        userid: item.user.id,
        party: item.party.nameEnglish,
        eventType: item.eventType.nameEnglish,
        eventStartDateTime: item.eventStartDateTime,
        eventEnddateTime: item.eventEndDateTime,
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
      }));
      console.log(alleventdata);

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
            <div className="cursor-pointer flex flex-col gap-1">
              <div className="flex items-center gap-1">
                <i className="ki-filled ki-disk"></i>
                <span>{fn.name}</span>
              </div>

              <span className="text-xs text-gray-500">
                Time: {fn.startTime}
              </span>
            </div>
          ),
          value: fn.id,
          children: "",
        }));

        setMenuPreparationsTabs(dynamicTabs);
        setStartDateandtime(firstEvent.eventStartDateTime.split(" ")[0] || "");
        setEndDateandtime(firstEvent.eventEnddateTime.split(" ")[0] || "");
        setEventAllData(alleventdata);

        return {
          eventData: alleventdata,
          functions: firstEvent.eventFunctions,
        };
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      throw error;
    }
  }, [eventId]);

  return {
    eventAllData,
    orderDetails,
    menuPreparationsTabs,
    startDateandtime,
    endDateandtime,
    fetchEventData,
  };
};

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;

  const fetchCategories = useCallback(async () => {
    try {
      const res = await GetAllCategoryformenu(userId);
      const categories = res.data.data["Menu Category Details"].map(
        (item, index) => ({
          ...item,
          name: item.nameEnglish,
          sr_no: index + 1,
        })
      );
      setCategories(categories);
      return categories;
    } catch (error) {
      console.error("Error fetching categories:", error);
      throw error;
    }
  }, [userId]);

  const allCategory = { id: 0, name: "All" };
  const categoriesWithAll = [allCategory, ...categories];

  return {
    categories,
    categoriesWithAll,
    fetchCategories,
  };
};

const functionDataReducer = (state, action) => {
  switch (action.type) {
    case "INITIALIZE_FUNCTION":
      return {
        ...state,
        [action.functionId]: {
          selectedItems: [],
          itemNotes: {},
          itemSlogans: {},
          itemRates: {},
          categoryNotes: {},
          categorySlogans: {},
          itemCategories: {}, // Track category changes for items
          isSaved: false,
          pax: action.pax || 0,
          rate: action.rate || 0,
        },
      };

    case "UPDATE_SELECTIONS":
      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          selectedItems: action.selectedItems,
          itemNotes: {
            ...state[action.functionId]?.itemNotes,
            ...action.itemNotes,
          },
          itemSlogans: {
            ...state[action.functionId]?.itemSlogans,
            ...action.itemSlogans,
          },
          categoryNotes: {
            ...state[action.functionId]?.categoryNotes,
            ...action.categoryNotes,
          },
          categorySlogans: {
            ...state[action.functionId]?.categorySlogans,
            ...action.categorySlogans,
          },
          itemRates: {
            ...state[action.functionId]?.itemRates,
            ...action.itemRates,
          },
          itemCategories: {
            ...state[action.functionId]?.itemCategories,
            ...action.itemCategories,
          },
          isSaved: action.isSaved,
          pax: action.pax || state[action.functionId]?.pax,
          rate: action.rate || state[action.functionId]?.rate,
        },
      };

    case "TOGGLE_ITEM_SELECTION":
      const currentItems = state[action.functionId]?.selectedItems || [];
      const newItems = currentItems.includes(action.itemId)
        ? currentItems.filter((id) => id !== action.itemId)
        : [...currentItems, action.itemId];

      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          selectedItems: newItems,
          isSaved: false,
        },
      };

    case "UPDATE_ITEM_RATE":
      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          itemRates: {
            ...state[action.functionId]?.itemRates,
            [action.itemId]: action.rate,
          },
          isSaved: false,
        },
      };

    case "UPDATE_NOTES":
      if (action.noteType === "isSaved") {
        return {
          ...state,
          [action.functionId]: {
            ...state[action.functionId],
            isSaved: action.value,
          },
        };
      }

      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          [action.noteType]: {
            ...state[action.functionId]?.[action.noteType],
            [action.id]: action.value,
          },
          isSaved: false,
        },
      };

    case "UPDATE_ITEM_CATEGORY":
      const updatedState = {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          itemCategories: {
            ...state[action.functionId]?.itemCategories,
            [action.itemId]: {
              newCategoryId: action.newCategoryId,
              newCategoryName: action.newCategoryName,
            },
          },
          isSaved: false,
        },
      };

      return updatedState;

    case "MARK_SAVED":
      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          isSaved: true,
        },
      };

    case "UPDATE_CATEGORY_ORDER":
      console.log("Reducer - UPDATE_CATEGORY_ORDER:", {
        functionId: action.functionId,
        fromCategoryId: action.fromCategoryId,
        toCategoryId: action.toCategoryId,
      });

      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          categoryOrder: {
            ...state[action.functionId]?.categoryOrder,
            [`${action.fromCategoryId}-to-${action.toCategoryId}`]: Date.now(),
          },
          isSaved: false,
        },
      };

    default:
      return state;
  }
};

const useMenuData = () => {
  const [functionMenuData, setFunctionMenuData] = useState({});
  const [allMenuItems, setAllMenuItems] = useState({});
  const [menuPreparationIds, setMenuPreparationIds] = useState({});
  const [loading, setLoading] = useState(false);
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData.id;

  const fetchMenuPrep = useCallback(
    async (
      eventFunctionId,
      menuCategoryId = null,
      pageNo = 1,
      totalRecord = 50
    ) => {
      try {
        const res = await Getmenuprep(
          eventFunctionId,
          menuCategoryId,
          pageNo,
          totalRecord,
          userId
        );
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

        selectedMenuCategories.forEach((category) => {
          if (category.selectedMenuPreparationItems) {
            selectedItems.push(...category.selectedMenuPreparationItems);
          }
        });

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
      } catch (error) {
        console.error("Error fetching menu prep data:", error);
        throw error;
      }
    },
    [userId]
  );

  const loadFunctionMenuData = useCallback(
    async (functionId, categoryId, categories) => {
      setLoading(true);
      try {
        const responseData = await fetchMenuPrep(functionId, categoryId);
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

        return responseData;
      } catch (error) {
        console.error("Error loading function menu data:", error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [fetchMenuPrep]
  );

  const loadAllMenuDataForFunction = useCallback(
    async (functionId, categories) => {
      try {
        const allCategoriesData = await Promise.all([
          fetchMenuPrep(functionId, 0),
          ...categories.map((category) =>
            fetchMenuPrep(functionId, category.id)
          ),
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
    },
    [fetchMenuPrep]
  );

  const clearFunctionCache = useCallback((functionId) => {
    setFunctionMenuData((prev) => {
      const newData = { ...prev };
      Object.keys(newData).forEach((key) => {
        if (key.startsWith(`${functionId}-`)) {
          delete newData[key];
        }
      });
      return newData;
    });
  }, []);

  return {
    functionMenuData,
    allMenuItems,
    menuPreparationIds,
    loading,
    loadFunctionMenuData,
    loadAllMenuDataForFunction,
    clearFunctionCache,
    setAllMenuItems, // Export this for direct updates
  };
};

const useSaveMenu = (
  functionSelectionData,
  allMenuItems,
  menuPreparationIds,
  categories,
  dateandtime,
  clearFunctionCache,
  loadFunctionMenuData
) => {
  const userData = JSON.parse(localStorage.getItem("userData"));

  const saveMenu = useCallback(
    async (selectedFunctionId, selectedCategoryId, pax, rate) => {
      const currentFunctionData = functionSelectionData[selectedFunctionId];

      if (
        !currentFunctionData ||
        currentFunctionData.selectedItems.length === 0
      ) {
        errorMsgPopup("Please select at least one item");
        return false;
      }

      const allFunctionMenuItems = allMenuItems[selectedFunctionId] || [];
      const selectedItems = currentFunctionData.selectedItems
        .map((id) => {
          let item = allFunctionMenuItems.find((item) => item.id === id);

          // If item category was changed via drag and drop, use the new category
          if (currentFunctionData.itemCategories?.[id]) {
            const categoryChange = currentFunctionData.itemCategories[id];
            item = {
              ...item,
              parentId: categoryChange.newCategoryId,
            };
          }

          return item;
        })
        .filter(Boolean);

      const existingId = menuPreparationIds[selectedFunctionId] || 0;

      const calculateTotalPrice = () => {
        return currentFunctionData.selectedItems.reduce((sum, itemId) => {
          const item = allFunctionMenuItems.find(
            (menuItem) => menuItem.id === itemId
          );

          let itemRate;
          if (currentFunctionData.itemRates?.[itemId] !== undefined) {
            itemRate = Number(currentFunctionData.itemRates[itemId]);
          } else if (rate > 0) {
            itemRate = Number(rate);
          } else {
            itemRate = Number(item?.price) || 0;
          }

          return sum + itemRate;
        }, 0);
      };

      // Group selected items by category for the new payload structure
      const itemsByCategory = {};

      selectedItems.forEach((item, index) => {
        // Use the updated category from drag and drop if available
        let finalCategoryId = item.parentId;
        let finalCategoryName = "";

        if (currentFunctionData.itemCategories?.[item.id]) {
          finalCategoryId =
            currentFunctionData.itemCategories[item.id].newCategoryId;
          finalCategoryName =
            currentFunctionData.itemCategories[item.id].newCategoryName;
        } else {
          const category = categories.find((cat) => cat.id === item.parentId);
          finalCategoryName = category?.name || "";
        }

        let itemPrice;
        if (currentFunctionData.itemRates?.[item.id] !== undefined) {
          itemPrice = Number(currentFunctionData.itemRates[item.id]);
        } else if (rate > 0) {
          itemPrice = Number(rate);
        } else {
          itemPrice = Number(item.price) || 0;
        }

        if (!itemsByCategory[finalCategoryId]) {
          itemsByCategory[finalCategoryId] = {
            menuCategoryId: finalCategoryId,
            menuCategoryName: finalCategoryName,
            menuNotes:
              currentFunctionData.categoryNotes?.[finalCategoryId] || "",
            menuSlogan:
              currentFunctionData.categorySlogans?.[finalCategoryId] || "",
            menuSortOrder: 0,
            startTime: dateandtime,
            selectedMenuPreparationItems: [],
          };
        }

        itemsByCategory[finalCategoryId].selectedMenuPreparationItems.push({
          id: 0,
          itemNotes: currentFunctionData.itemNotes[item.id] || "",
          itemPrice: itemPrice,
          itemSlogan: currentFunctionData.itemSlogans?.[item.id] || "",
          itemSortOrder: index,
          menuItemId: item.id,
          menuItemName: item.name,
        });
      });

      const selectedMenuPreparationItems = Object.values(itemsByCategory).map(
        (categoryGroup, categoryIndex) => ({
          ...categoryGroup,
          menuSortOrder: categoryIndex,
        })
      );

      const payload = {
        defaultPrice: rate || 0,
        eventFunctionId: selectedFunctionId,
        id: existingId,
        pax: Number(pax) || 0,
        price: calculateTotalPrice(),
        selectedMenuPreparationItems: selectedMenuPreparationItems,
        sortorder: 0,
      };

      console.log("New payload structure:", JSON.stringify(payload, null, 2));

      try {
        const res = await AddMenuprep(payload);

        if (res.data?.msg) {
          Swal.fire({
            title: `${res.data?.msg}`,
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
          });
        }

        clearFunctionCache(selectedFunctionId);
        await loadFunctionMenuData(selectedFunctionId, selectedCategoryId);

        return true;
      } catch (err) {
        console.error("Save failed:", err);
        errorMsgPopup("Failed to save menu preparation");
        return false;
      }
    },
    [
      functionSelectionData,
      allMenuItems,
      menuPreparationIds,
      categories,
      dateandtime,
      clearFunctionCache,
      loadFunctionMenuData,
    ]
  );

  return { saveMenu };
};

export {
  useEventData,
  useCategories,
  useMenuData,
  useSaveMenu,
  functionDataReducer,
};
