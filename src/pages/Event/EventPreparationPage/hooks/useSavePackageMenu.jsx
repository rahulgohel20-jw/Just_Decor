// Replace your useSavePackageMenu function with this updated version

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
  const savePackageMenu = useCallback(
    async (selectedFunctionId, selectedCategoryId, pax, rate, packageInfo) => {
      const currentFunctionData = functionSelectionData[selectedFunctionId];

      if (
        !currentFunctionData ||
        currentFunctionData.selectedItems.length === 0
      ) {
        errorMsgPopup("Please select at least one item from the package");
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
          finalCategoryName = category?.name || item.categoryName || "";
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
            startTime: startDateandtime,
            selectedMenuPreparationItems: [],
          };
        }

        // ✅ CRITICAL FIX: Extract numeric menuItemId properly
        let apiItemId = item.id;

        // Check if item has menuItemId property (package items)
        if (item.menuItemId !== undefined && item.menuItemId !== null) {
          apiItemId = item.menuItemId;
        }

        // Validate it's not a string "pkg-" ID
        if (typeof apiItemId === 'string' && apiItemId.startsWith('pkg-')) {
          console.error(`❌ Invalid ID detected: ${apiItemId} for item: ${item.name}`);
          apiItemId = item.menuItemId || item.id;
        }

        // Convert to number
        apiItemId = Number(apiItemId);

        // Skip if invalid
        if (isNaN(apiItemId)) {
          console.error(`❌ Could not convert to number: ${item.id} for item: ${item.name}`);
          return;
        }

        itemsByCategory[finalCategoryId].selectedMenuPreparationItems.push({
          id: 0,
          itemNotes: currentFunctionData.itemNotes[item.id] || "",
          itemPrice: itemPrice,
          itemSlogan: currentFunctionData.itemSlogans?.[item.id] || "",
          itemSortOrder: index,
          menuItemId: apiItemId, // ✅ Guaranteed numeric ID
          menuItemName: item.name,
        });
      });

      const categoryOrderArray = currentFunctionData.categoryOrder || [];
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

      const selectedMenuPreparationItems = sortedCategories.map(
        ([categoryId, categoryGroup], categoryIndex) => ({
          ...categoryGroup,
          menuSortOrder: categoryIndex,
        })
      );

      const payload = {
        defaultPrice: rate || 0,
        isPackage: true,
        packageId: packageInfo?.id || null,
        packageName: packageInfo?.packageName || "",
        packagePrice: packageInfo?.packagePrice || calculateTotalPrice(),
        eventFunctionId: selectedFunctionId,
        id: existingId,
        pax: Number(pax) || 0,
        price: calculateTotalPrice(),
        selectedMenuPreparationItems: selectedMenuPreparationItems,
        sortorder: 0,
      };

      // ✅ Log payload for debugging
      console.log("📦 Final Package Payload:", JSON.stringify(payload, null, 2));

      // ✅ Validate no invalid IDs before sending
      const hasInvalidIds = selectedMenuPreparationItems.some(cat => 
        cat.selectedMenuPreparationItems.some(item => 
          typeof item.menuItemId !== 'number' || isNaN(item.menuItemId)
        )
      );

      if (hasInvalidIds) {
        console.error("❌ Payload contains invalid menuItemIds!");
        errorMsgPopup("Error: Invalid item IDs detected. Please try again.");
        return false;
      }

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
        await loadFunctionMenuData(
          selectedFunctionId,
          selectedCategoryId,
          categories
        );

        return true;
      } catch (err) {
        console.error("❌ Save package menu error:", err);
        console.error("Error response:", err?.response?.data);
        errorMsgPopup(
          err?.response?.data?.message || "Failed to save package menu"
        );
        return false;
      }
    },
    [
      functionSelectionData,
      allMenuItems,
      menuPreparationIds,
      categories,
      startDateandtime,
      endDateandtime,
      clearFunctionCache,
      loadFunctionMenuData,
    ]
  );

  return { savePackageMenu };
};