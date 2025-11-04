import { useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  GetAllCategoryformenu,
  GetEventMasterById,
  Getmenuprep,
  AddMenuprep,
} from "@/services/apiServices";
import { errorMsgPopup } from "@/underConstruction";
import Swal from "sweetalert2";
import { AddCustomPackageapi } from "../../../../services/apiServices";

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
      console.log("responed", res);
      const alleventdata = (res?.data?.data?.["Event Details"] || []).map((item) => ({
  userid: item?.user?.id || 0,
  party: item?.party?.nameEnglish?.trim() || item?.party?.name || "Unnamed Party",
  eventType:
    item?.eventType?.nameEnglish?.trim() ||
    item?.eventType?.name ||
    "Unknown Event",
  eventStartDateTime: item?.eventStartDateTime || "",
  eventEnddateTime: item?.eventEndDateTime || "",
  venue: item?.venue || "N/A",
  eventFunctions:
    item?.eventFunctions?.map((f) => ({
      id: f?.id || 0,
      name:
        f?.function?.nameEnglish?.trim() ||
        f?.function?.name ||
        "Unnamed Function",
      startTime: f?.function?.startTime || "",
      endTime: f?.function?.endTime || "",
      pax: f?.pax || 0,
      rate: f?.rate || 0,
      venue: f?.function_venue || "N/A",
    })) || [],
}));

      
      
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
          itemCategories: {},
          categoryOrder: [],
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
          categoryOrder:
            action.categoryOrder ||
            state[action.functionId]?.categoryOrder ||
            [],
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
      return {
        ...state,
        [action.functionId]: {
          ...state[action.functionId],
          categoryOrder: action.newOrder || [],
          isSaved: false,
        },
      };

    case "ADD_PACKAGE_ITEMS": {
      const { functionId, items } = action;
      const existingSelectedItems = state[functionId]?.selectedItems || [];
      const existingItemRates = { ...state[functionId]?.itemRates } || {};

      const newSelectedItems = [...existingSelectedItems];
      items.forEach((item) => {
        if (!newSelectedItems.includes(item.id)) {
          newSelectedItems.push(item.id);
          existingItemRates[item.id] = item.price || 0;
        }
      });

      return {
        ...state,
        [functionId]: {
          ...state[functionId],
          selectedItems: newSelectedItems,
          itemRates: existingItemRates,
          isSaved: false,
        },
      };
    }

    case "CLEAR_SELECTED_ITEMS": {
      const { functionId } = action;
      return {
        ...state,
        [functionId]: {
          ...state[functionId],
          selectedItems: [],
          itemNotes: {},
          itemSlogans: {},
          itemRates: {},
          categoryNotes: {},
          categorySlogans: {},
          categoryOrder: [],
          isSaved: false,
        },
      };
    }

    default:
      return state;
  }
};

const useMenuData = () => {
  const [functionMenuData, setFunctionMenuData] = useState({});
  const [allMenuItems, setAllMenuItems] = useState({});
  const [menuPreparationIds, setMenuPreparationIds] = useState({});
  const [itemSortOrders, setItemSortOrders] = useState({});
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
            image: item.imagePath || "",
            price: item.itemPrice,
            isSelected: false,
          })
        );

        const selectedMenuCategories =
          responseData["selectedMenuPreparationItems"] || [];
        let selectedItems = [];
        const sortOrderMap = {};

        selectedMenuCategories.forEach((category) => {
          if (category.selectedMenuPreparationItems) {
            category.selectedMenuPreparationItems.forEach((item) => {
              selectedItems.push(item);
              sortOrderMap[item.menuItemId] = item.itemSortOrder;
            });
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
          sortOrderMap,
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

        if (responseData.sortOrderMap) {
          setItemSortOrders((prev) => ({
            ...prev,
            [functionId]: responseData.sortOrderMap,
          }));
        }

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
        const combinedSortOrderMap = {};

        allCategoriesData.forEach((categoryData) => {
          if (categoryData.menuItems) {
            categoryData.menuItems.forEach((item) => {
              if (!seenIds.has(item.id)) {
                combinedMenuItems.push(item);
                seenIds.add(item.id);
              }
            });
          }
          if (categoryData.sortOrderMap) {
            Object.assign(combinedSortOrderMap, categoryData.sortOrderMap);
          }
        });

        setAllMenuItems((prev) => ({
          ...prev,
          [functionId]: combinedMenuItems,
        }));

        setItemSortOrders((prev) => ({
          ...prev,
          [functionId]: combinedSortOrderMap,
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
    itemSortOrders,
    loading,
    loadFunctionMenuData,
    loadAllMenuDataForFunction,
    clearFunctionCache,
    setAllMenuItems,
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

      const itemsByCategory = {};

      selectedItems.forEach((item, index) => {
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
      const categoryOrderArray = currentFunctionData.categoryOrder || [];

      const sortedCategories = Object.entries(itemsByCategory).sort((a, b) => {
        const categoryIdA = parseInt(a[0]);
        const categoryIdB = parseInt(b[0]);

        const indexA = categoryOrderArray.indexOf(categoryIdA);
        const indexB = categoryOrderArray.indexOf(categoryIdB);

        if (indexA !== -1 && indexB !== -1) {
          return indexA - indexB;
        }
        if (indexA !== -1) return -1;
        if (indexB !== -1) return 1;
        return 0;
      });

      const selectedMenuPreparationItems = sortedCategories.map(
        ([categoryId, categoryGroup], categoryIndex) => ({
          ...categoryGroup,
          menuSortOrder: categoryIndex,
        })
      );

      const payload = {
        defaultPrice: rate || 0,
        isPackage: false,
        packageId: null,
        packageName: "",
        packagePrice: 0,
        eventFunctionId: selectedFunctionId,
        id: existingId,
        pax: Number(pax) || 0,
        price: calculateTotalPrice(),
        selectedMenuPreparationItems: selectedMenuPreparationItems,
        sortorder: 0,
      };
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

const useSavePackageMenu = (
  functionSelectionData,
  allMenuItems,
  menuPreparationIds,
  categories,
  startDateandtime,
  endDateandtime,
  clearFunctionCache,
  loadFunctionMenuData,
  dispatch
) => {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const userId = userData?.id || 0;

  const savePackageMenu = useCallback(
    async (functionId, categoryId, pax, rate, packageInfo) => {
      try {
        const currentFunction = functionSelectionData[functionId];
        
        if (!currentFunction?.selectedItems?.length) {
          errorMsgPopup("No items selected");
          return false;
        }

        const allFunctionMenuItems = allMenuItems[functionId] || [];
        
        // Group items by category
        const itemsByCategory = {};
        let itemIndex = 0;
        
        currentFunction.selectedItems.forEach((itemId) => {
          const item = allFunctionMenuItems.find((i) => i.id === itemId);
          if (!item) {
            console.warn(`Item not found for ID: ${itemId}`);
            return;
          }

          // Extract numeric menu item ID
          let numericItemId;
          
          // Check if item has menuItemId property (from package items)
          if (item.menuItemId) {
            numericItemId = Number(item.menuItemId);
          } else if (typeof item.id === 'number') {
            // Regular menu item with numeric ID
            numericItemId = item.id;
          } else if (typeof item.id === 'string') {
            // Try to parse numeric ID from string
            const parsed = parseInt(item.id);
            if (!isNaN(parsed)) {
              numericItemId = parsed;
            } else {
              console.warn(`Cannot extract numeric ID from: ${item.id}`);
              return;
            }
          } else {
            console.warn(`Invalid item ID type: ${typeof item.id}`);
            return;
          }

          // Validate numeric ID
          if (isNaN(numericItemId) || numericItemId === 0) {
            console.warn(`Invalid numeric ID: ${numericItemId} for item:`, item);
            return;
          }

          let finalCategoryId = item.parentId || item.menuCategoryId;
          let finalCategoryName = "";

          // Check if category was changed
          if (currentFunction.itemCategories?.[itemId]) {
            finalCategoryId = currentFunction.itemCategories[itemId].newCategoryId;
            finalCategoryName = currentFunction.itemCategories[itemId].newCategoryName;
          } else {
            const category = categories.find((cat) => cat.id === finalCategoryId);
            finalCategoryName = category?.name || category?.nameEnglish || "";
          }

          // Ensure category ID is numeric
          const numericCategoryId = Number(finalCategoryId);
          if (isNaN(numericCategoryId)) {
            console.warn(`Invalid category ID: ${finalCategoryId}`);
            return;
          }

          if (!itemsByCategory[numericCategoryId]) {
            itemsByCategory[numericCategoryId] = {
              menuId: numericCategoryId,
              menuName: finalCategoryName,
              menuInstruction: currentFunction.categoryNotes?.[finalCategoryId] || "",
              menuSortOrder: 0,
              anyItem: 1, // Default to 1, will be updated based on category item count
              customPackageMenuItemDetails: [],
            };
          }

          const itemPrice = currentFunction.itemRates?.[itemId] !== undefined 
            ? Number(currentFunction.itemRates[itemId])
            : (rate > 0 ? Number(rate) : Number(item.price) || 0);

          itemsByCategory[numericCategoryId].customPackageMenuItemDetails.push({
            id: 0,
            menuItemId: numericItemId,
            itemName: item.name || item.menuItemName || "",
            itemPrice: itemPrice,
            itemInstruction: currentFunction.itemNotes?.[itemId] || "",
            itemSortOrder: itemIndex++,
            userId: userId,
          });
        });

        // Validate that we have at least one valid item after filtering
        if (Object.keys(itemsByCategory).length === 0) {
          errorMsgPopup("No valid menu items to save. Please ensure items have valid IDs.");
          return false;
        }

        // Sort categories based on category order
        const categoryOrderArray = currentFunction.categoryOrder || [];
        const sortedCategories = Object.entries(itemsByCategory).sort((a, b) => {
          const categoryIdA = parseInt(a[0]);
          const categoryIdB = parseInt(b[0]);
          const indexA = categoryOrderArray.indexOf(categoryIdA);
          const indexB = categoryOrderArray.indexOf(categoryIdB);

          if (indexA !== -1 && indexB !== -1) return indexA - indexB;
          if (indexA !== -1) return -1;
          if (indexB !== -1) return 1;
          return 0;
        });

        const customPackageDetails = sortedCategories.map(
          ([categoryId, categoryGroup], categoryIndex) => ({
            ...categoryGroup,
            menuSortOrder: categoryIndex,
            // Set anyItem to number of items in this category
            anyItem: categoryGroup.customPackageMenuItemDetails.length,
          })
        );

        // Calculate total price from valid items only
        let totalPrice = 0;
        customPackageDetails.forEach(category => {
          category.customPackageMenuItemDetails.forEach(item => {
            totalPrice += item.itemPrice || 0;
          });
        });

        const payload = {
          nameEnglish: packageInfo?.packageName || `Custom Package ${functionId}`,
          nameGujarati: packageInfo?.packageNameGujarati || "",
          nameHindi: packageInfo?.packageNameHindi || "",
          price: packageInfo?.packagePrice || totalPrice,
          sequence: packageInfo?.sequence || 0,
          userId: userId,
          customPackageDetails: customPackageDetails,
        };

        console.log("📦 Sending package payload:", JSON.stringify(payload, null, 2));

        const response = await AddCustomPackageapi(payload);
        
        if (response.data?.msg || response.data?.status === "success") {
          Swal.fire({
            title: response.data?.msg || "Package saved successfully!",
            icon: "success",
            background: "#f5faff",
            color: "#003f73",
            confirmButtonText: "Okay",
            confirmButtonColor: "#005BA8",
          });

          clearFunctionCache(functionId);
          await loadFunctionMenuData(functionId, categoryId);
          return true;
        }
        
        return false;
      } catch (error) {
        console.error("Error saving package menu:", error);
        errorMsgPopup(error?.response?.data?.msg || "Failed to save package menu");
        return false;
      }
    },
    [
      functionSelectionData,
      allMenuItems,
      categories,
      userId,
      clearFunctionCache,
      loadFunctionMenuData,
    ]
  );

  return { savePackageMenu };
};

export {
  useEventData,
  useCategories,
  useMenuData,
  useSaveMenu,
  useSavePackageMenu,
  functionDataReducer,
};