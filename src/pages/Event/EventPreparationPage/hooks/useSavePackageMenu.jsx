import { useCallback } from "react";
import Swal from "sweetalert2";
import { AddMenuprep, GetCustomPackageapi } from "@/services/apiServices";
import { errorMsgPopup } from "@/underConstruction";

export const useSavePackageMenu = (
  functionSelectionData,
  clearFunctionCache,
  loadFunctionMenuData
) => {
  const savePackageMenu = useCallback(
    async (selectedFunctionId, packageId, pax = 0) => {
      if (!packageId) {
        errorMsgPopup("Package ID is required");
        return false;
      }

      const currentFunctionData = functionSelectionData[selectedFunctionId];
      if (!currentFunctionData) {
        errorMsgPopup("No function selected");
        return false;
      }

      let packageData;
      try {
        const res = await GetCustomPackageapi(packageId);
        if (!res.data.success) throw new Error("Failed to fetch package");
        packageData = res.data.data["Package Details"][0];
      } catch (err) {
        console.error(err);
        errorMsgPopup("Failed to fetch package data");
        return false;
      }

   const payload = {
  id: isPackage ? packageId || 0 : menuPreparationId || 0,
  isPackage: isPackage,
  packageId: isPackage ? packageId || 0 : 0,
  packageName: isPackage ? packageName : undefined,
  packagePrice: isPackage ? packagePrice : undefined,
  defaultPrice: rate,
  pax: pax,
  eventFunctionId: selectedFunctionId,
  sortorder: 0,
  selectedMenuPreparationItems: categories.map(cat => ({
    menuCategoryId: cat.id,
    menuCategoryName: cat.name,
    menuNotes: categoryNotes[cat.id] || "",
    menuSlogan: categorySlogans[cat.id] || "",
    menuSortOrder: 0,
    startTime: "", // if applicable
    selectedMenuPreparationItems: (selectedItemsByCategory[cat.name] || []).map(item => ({
      id: isPackage ? 0 : item.id,
      menuItemId: item.id,
      menuItemName: item.menuName || item.name,
      itemNotes: item.itemNotes || "",
      itemSlogan: item.itemSlogan || "",
      itemPrice: item.price || rate,
      itemSortOrder: 0,
    }))
  }))
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
        await loadFunctionMenuData(selectedFunctionId, 0);
        return true;
      } catch (err) {
        console.error("Save failed:", err);
        errorMsgPopup("Failed to save package menu");
        return false;
      }
    },
    [functionSelectionData, clearFunctionCache, loadFunctionMenuData]
  );

  return { savePackageMenu };
};
