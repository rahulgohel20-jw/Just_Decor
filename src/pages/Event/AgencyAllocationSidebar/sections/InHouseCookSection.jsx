import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import AllocateRowInHouse from "../components/AllocateRowInHouse";
import InHouseCookTable from "../components/InHouseCookTable";
import { MenuAllocationSave } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function InHouseCookSection({
  data,
  onDataUpdate,
  close,
  isAllFunctions,
}) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [saving, setSaving] = useState(false);

  // ✅ Track which items had PAX changes
  const changedPaxItemsRef = useRef(new Set());
  const initialMenuItemsRef = useRef([]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      if (isAllFunctions) {
        // For all functions, flatten all menuAllocation arrays from all functions
        const allMenuItems = data.flatMap((functionData, functionIndex) => {
          const allocations = functionData?.menuAllocation || [];

          // Add function metadata to each menu item
          return allocations.map((allocation) => ({
            ...allocation,
            _functionIndex: functionIndex,
            _functionId: functionData.eventFunction?.id,
            _functionName: functionData.eventFunction?.function?.nameEnglish,
            _functionPax: functionData.eventFunction?.pax,
            eventFunctionId: functionData.eventFunction?.id,
            eventFunctionName:
              functionData.eventFunction?.function?.nameEnglish,
          }));
        });

        setMenuItems(allMenuItems);
        // ✅ Store initial state
        initialMenuItemsRef.current = JSON.parse(JSON.stringify(allMenuItems));
        console.log("📊 All Functions - Total items:", allMenuItems.length);
      } else {
        // For single function, use existing logic
        const allocations = data[0]?.menuAllocation || [];
        setMenuItems(allocations);
        // ✅ Store initial state
        initialMenuItemsRef.current = JSON.parse(JSON.stringify(allocations));
      }
    } else {
      setMenuItems([]);
      initialMenuItemsRef.current = [];
    }

    // ✅ Clear PAX change tracking when data changes
    changedPaxItemsRef.current.clear();
  }, [data, isAllFunctions]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean).length;
  }, [selectedItems]);

  const handleItemSelect = useCallback((itemKey, isChecked) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: isChecked,
    }));
  }, []);

  const handleAllocate = useCallback(
    (allocationData) => {
      // Check if items are selected
      const hasSelectedItems = Object.values(selectedItems).some(Boolean);

      if (!hasSelectedItems) {
        Swal.fire({
          title: "Warning",
          text: "Please select at least one item to allocate",
          icon: "warning",
        });
        return false;
      }

      // Check if at least one field is provided
      if (!allocationData.partyId && !allocationData.pax) {
        Swal.fire({
          title: "Warning",
          text: "Please provide at least one allocation value (Vendor or Pax)",
          icon: "warning",
        });
        return false;
      }

      let allocatedCount = 0;

      // Update menu items with only the fields that were provided
      const updatedMenuItems = menuItems.map((menuItem, menuIndex) => {
        if (!Array.isArray(menuItem.eventFunctionMenuAllocations)) {
          return menuItem;
        }

        const updatedAllocations = menuItem.eventFunctionMenuAllocations.map(
          (allocation, allocationIndex) => {
            const itemKey = `${menuIndex}-${allocationIndex}`;

            if (selectedItems[itemKey]) {
              allocatedCount++;

              // Only update fields that were provided
              const updates = {};

              if (allocationData.partyId !== undefined) {
                updates.partyId = allocationData.partyId;
                updates.partyName = allocationData.partyName || "";
                updates.number = allocationData.number || "";
              }

              if (allocationData.pax !== undefined) {
                updates.pax = allocationData.pax;
              }

              return {
                ...allocation,
                ...updates,
              };
            }

            return allocation;
          },
        );

        const hasUpdatedAllocations =
          menuItem.eventFunctionMenuAllocations.some(
            (_, allocationIndex) =>
              selectedItems[`${menuIndex}-${allocationIndex}`],
          );

        // ✅ Track PAX change if pax was updated
        if (hasUpdatedAllocations && allocationData.pax !== undefined) {
          const itemKey = `${menuItem.menuItemId}-${menuItem.menuCategoryId}-${menuItem.eventFunctionId}`;

          // Check if PAX actually changed
          const initialItem = initialMenuItemsRef.current[menuIndex];
          if (initialItem && initialItem.personCount !== allocationData.pax) {
            changedPaxItemsRef.current.add(itemKey);
          }
        }

        return {
          ...menuItem,
          eventFunctionMenuAllocations: updatedAllocations,
          // Only update personCount if pax was provided and this menu item had selected allocations
          ...(hasUpdatedAllocations &&
            allocationData.pax !== undefined && {
              personCount: allocationData.pax,
            }),
        };
      });

      setMenuItems(updatedMenuItems);

      if (onDataUpdate) {
        onDataUpdate(updatedMenuItems);
      }

      setSelectedItems({});

      Swal.fire({
        title: "Success",
        text: `Updated ${allocatedCount} selected item(s) successfully`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });

      return true;
    },
    [menuItems, selectedItems, onDataUpdate],
  );

  const handleMenuItemUpdate = useCallback(
    (menuIndex, updatedMenuItem) => {
      setMenuItems((prev) => {
        const updated = [...prev];

        // ✅ Track PAX change if personCount changed
        const initialItem = initialMenuItemsRef.current[menuIndex];
        if (
          initialItem &&
          initialItem.personCount !== updatedMenuItem.personCount
        ) {
          const itemKey = `${updatedMenuItem.menuItemId}-${updatedMenuItem.menuCategoryId}-${updatedMenuItem.eventFunctionId}`;
          changedPaxItemsRef.current.add(itemKey);
        }

        updated[menuIndex] = updatedMenuItem;
        return updated;
      });

      if (onDataUpdate) {
        const updated = [...menuItems];
        updated[menuIndex] = updatedMenuItem;
        onDataUpdate(updated);
      }
    },
    [menuItems, onDataUpdate],
  );

  const buildPayload = useCallback(() => {
    const userId = Number(localStorage.getItem("userId"));

    return menuItems.map((menuItem) => {
      // ✅ Check if this item had a PAX change
      const itemKey = `${menuItem.menuItemId}-${menuItem.menuCategoryId}-${menuItem.eventFunctionId}`;
      const isPaxChange = changedPaxItemsRef.current.has(itemKey);

      return {
        chefLabour: false,
        eventFunctionId: menuItem.eventFunctionId || 0,
        eventId: menuItem.eventId || 0,
        id: menuItem.id || 0,
        inside: true,
        outside: false,
        instructions: menuItem.instructions || "",
        menuCategoryId: menuItem.menuCategoryId || 0,
        menuItemId: menuItem.menuItemId || 0,
        personCount: menuItem.personCount || 0,
        oldPersonCount: menuItem.oldPersonCount || 0,
        isPaxChange: isPaxChange, // ✅ Add isPaxChange flag
        place: menuItem.place || "",
        menuItemRawMaterials: [],
        userId,

        menuAllocationOrders:
          menuItem.eventFunctionMenuAllocations?.map((allocation) => ({
            id: allocation.id || 0,
            partyId: allocation.partyId || 0,
            number: allocation.number || "",
            serviceType: "",
            quantity: 0,
            price: 0,
            counterQuantity: allocation.counterQuantity || 0,
            counterPrice: 0,
            helperQuantity: 0,
            helperPrice: 0,
            totalPrice: 0,
            unitId: 0,
            remarks: allocation.remarks || "",
            menuItemRawMaterials: [],
            isOutside: false,
          })) || [],
      };
    });
  }, [menuItems]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = buildPayload();

      const res = await MenuAllocationSave(payload);

      if (res?.data?.success === true) {
        Swal.fire({
          title: "Success",
          text: res?.data?.message || "Allocation saved successfully",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        });

        // ✅ Clear PAX change tracking after successful save
        changedPaxItemsRef.current.clear();

        // ✅ Update initial state to current state
        initialMenuItemsRef.current = JSON.parse(JSON.stringify(menuItems));

        close?.();
      } else {
        Swal.fire({
          title: "Error",
          text: res?.data?.message || "Failed to save allocation",
          icon: "error",
        });
      }
    } catch (error) {
      console.error("❌ Save failed:", error);
      Swal.fire({
        title: "Error",
        text: "Failed to save allocation",
        icon: "error",
      });
    } finally {
      setSaving(false);
    }
  };

  if (!menuItems || menuItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        <p>No menu items available for allocation</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <AllocateRowInHouse
        onAllocate={handleAllocate}
        selectedCount={selectedCount}
      />
      <div className="flex-1 overflow-auto">
        <InHouseCookTable
          menuItems={menuItems}
          onUpdate={handleMenuItemUpdate}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          isAllFunctions={isAllFunctions}
        />
      </div>
      <div className="flex justify-end gap-3 px-6 py-4 border-t bg-white">
        <button className="btn btn-danger" aria-label="Cancel" onClick={close}>
          Cancel
        </button>
        <button
          className="btn btn-primary"
          aria-label="Save changes"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving..." : "Save"}
        </button>
      </div>
    </div>
  );
}
