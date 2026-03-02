import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import AllocateRowChef from "../components/AllocateRowChef";
import ChefLabourTable from "../components/ChefLabourTable";
import { MenuAllocationSave } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function ChefLabourSection({
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
      console.warn("⚠️ Invalid data structure:", data);
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
      if (
        !allocationData.partyId &&
        !allocationData.serviceType &&
        !allocationData.pax
      ) {
        Swal.fire({
          title: "Warning",
          text: "Please provide at least one allocation value",
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

              if (allocationData.serviceType !== undefined) {
                updates.serviceType = allocationData.serviceType;
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

        // Check if any allocations were updated
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
          // Only update personCount if pax was provided
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

      // Clear selections after successful allocation
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
        chefLabour: true,
        eventFunctionId: menuItem.eventFunctionId || 0,
        eventId: menuItem.eventId || 0,
        id: menuItem.id || 0,
        inside: false,
        outside: false,
        instructions: menuItem.instructions || "",
        menuCategoryId: menuItem.menuCategoryId || 0,
        menuItemId: menuItem.menuItemId || 0,
        personCount: menuItem.personCount || 0,
        oldPersonCount: menuItem.oldPersonCount || 0,
        isPaxChange: isPaxChange, // ✅ Add isPaxChange flag
        menuItemRawMaterials: [],
        place: menuItem.place || "",
        userId,

        menuAllocationOrders:
          menuItem.eventFunctionMenuAllocations?.map((allocation) => ({
            id: allocation.id || 0,
            partyId: allocation.partyId || 0,
            number: "",
            serviceType: allocation.serviceType || "",
            quantity: allocation.quantity || 0,
            price: allocation.price || 0,
            counterQuantity: allocation.counterQuantity || 0,
            counterPrice: allocation.counterPrice || 0,
            helperQuantity: allocation.helperQuantity || 0,
            helperPrice: allocation.helperPrice || 0,
            totalPrice: allocation.totalPrice || 0,
            unitId: allocation.unitId || 0,
            remarks: "",
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
          text:
            res?.data?.message || "Chef labour allocation saved successfully",
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
      <AllocateRowChef
        onAllocate={handleAllocate}
        selectedCount={selectedCount}
      />
      <div className="flex-1 overflow-auto">
        <ChefLabourTable
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
