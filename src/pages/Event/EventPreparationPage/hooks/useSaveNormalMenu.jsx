import { useCallback } from "react";
import Swal from "sweetalert2";
import { AddMenuprep } from "@/services/apiServices";
import { errorMsgPopup } from "@/underConstruction";

export const useSaveNormalMenu = (
  functionSelectionData,
  allMenuItems,
  menuPreparationIds,
  categories,
  dateandtime,
  clearFunctionCache,
  loadFunctionMenuData
) => {
  const saveNormalMenu = useCallback(
    async (selectedFunctionId, selectedCategoryId, pax = 0, rate = 0) => {
      const currentFunctionData = functionSelectionData[selectedFunctionId];
      if (!currentFunctionData || currentFunctionData.selectedItems.length === 0) {
        errorMsgPopup("Please select at least one item");
        return false;
      }

      const allItems = allMenuItems[selectedFunctionId] || [];
      const itemsByCategory = {};

      currentFunctionData.selectedItems.forEach((itemId, index) => {
        const item = allItems.find((i) => i.id === itemId);
        if (!item) return;

        const categoryChange = currentFunctionData.itemCategories?.[itemId];
        const finalCategoryId = categoryChange ? categoryChange.newCategoryId : item.parentId;
        const finalCategoryName =
          categoryChange?.newCategoryName ||
          categories.find((c) => c.id === item.parentId)?.name ||
          "";

        const itemPrice = currentFunctionData.itemRates?.[itemId] ?? rate ?? item.price ?? 0;

        if (!itemsByCategory[finalCategoryId]) {
          itemsByCategory[finalCategoryId] = {
            menuCategoryId: finalCategoryId,
            menuCategoryName: finalCategoryName,
            menuNotes: currentFunctionData.categoryNotes?.[finalCategoryId] || "",
            menuSlogan: currentFunctionData.categorySlogans?.[finalCategoryId] || "",
            menuSortOrder: 0,
            startTime: dateandtime,
            selectedMenuPreparationItems: [],
          };
        }

        itemsByCategory[finalCategoryId].selectedMenuPreparationItems.push({
          id: 0,
          itemNotes: currentFunctionData.itemNotes[itemId] || "",
          itemPrice,
          itemSlogan: currentFunctionData.itemSlogans?.[itemId] || "",
          itemSortOrder: index,
          menuItemId: item.id,
          menuItemName: item.name,
        });
      });

      const payload = {
        defaultPrice: rate || 0,
        eventFunctionId: selectedFunctionId,
        id: menuPreparationIds[selectedFunctionId] || 0,
        pax: Number(pax) || 0,
        price: currentFunctionData.selectedItems.reduce(
          (sum, id) =>
            sum +
            (currentFunctionData.itemRates?.[id] ??
              rate ??
              allItems.find((i) => i.id === id)?.price ??
              0),
          0
        ),
        selectedMenuPreparationItems: Object.values(itemsByCategory).map((cat, idx) => ({
          ...cat,
          menuSortOrder: idx,
        })),
        sortorder: 0,
      };

      try {
        const res = await AddMenuprep(payload);
        if (res.data?.msg) {
          Swal.fire({
            title: res.data.msg,
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

  return { saveNormalMenu };
};
