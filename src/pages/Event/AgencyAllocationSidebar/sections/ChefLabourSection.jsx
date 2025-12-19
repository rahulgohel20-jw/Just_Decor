import { useState, useEffect, useCallback, useMemo } from "react";
import AllocateRowChef from "../components/AllocateRowChef";
import ChefLabourTable from "../components/ChefLabourTable";

export default function ChefLabourSection({ data, onDataUpdate }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  // ✅ Initialize menu items - extract menuAllocation array directly
  useEffect(() => {
    if (data && Array.isArray(data)) {
      // Extract the menuAllocation array from the first data item
      const allocations = data[0]?.menuAllocation || [];

      console.log("✅ Menu items initialized:", allocations);
      setMenuItems(allocations);
    } else {
      setMenuItems([]);
      console.warn("⚠️ Invalid data structure:", data);
    }
  }, [data]);

  // ✅ Memoized selected items count
  const selectedCount = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean).length;
  }, [selectedItems]);

  // ✅ Handle item selection
  const handleItemSelect = useCallback((itemKey, isChecked) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: isChecked,
    }));
  }, []);

  // ✅ Optimized allocation handler with validation
  const handleAllocate = useCallback(
    (allocationData) => {
      const { partyId, partyName, number, pax, serviceType } = allocationData;

      // Validation
      if (!partyId || !pax) {
        alert("Vendor and PAX are required");
        return false;
      }

      if (!serviceType) {
        alert("Please select a service type (Counter Wise or Plate Wise)");
        return false;
      }

      const hasSelectedItems = Object.values(selectedItems).some(Boolean);
      if (!hasSelectedItems) {
        alert("Please select at least one item to allocate");
        return false;
      }

      let allocatedCount = 0;

      // Update menu items
      const updatedMenuItems = menuItems.map((menuItem, menuIndex) => {
        // Ensure eventFunctionMenuAllocations exists
        if (!Array.isArray(menuItem.eventFunctionMenuAllocations)) {
          return menuItem;
        }

        const updatedAllocations = menuItem.eventFunctionMenuAllocations.map(
          (allocation, allocationIndex) => {
            const itemKey = `${menuIndex}-${allocationIndex}`;

            if (selectedItems[itemKey]) {
              allocatedCount++;
              return {
                ...allocation,
                partyId,
                partyName,
                number: number || "",
                pax,
                serviceType,
              };
            }

            return allocation;
          }
        );

        // Check if any allocations were updated
        const hasUpdatedAllocations =
          menuItem.eventFunctionMenuAllocations.some(
            (_, allocationIndex) =>
              selectedItems[`${menuIndex}-${allocationIndex}`]
          );

        return {
          ...menuItem,
          eventFunctionMenuAllocations: updatedAllocations,
          ...(hasUpdatedAllocations && { personCount: pax }),
        };
      });

      console.log("✅ Allocated to", allocatedCount, "items");

      setMenuItems(updatedMenuItems);

      if (onDataUpdate) {
        onDataUpdate(updatedMenuItems);
      }

      // Clear selections after successful allocation
      setSelectedItems({});

      alert(`Successfully allocated to ${allocatedCount} item(s)`);
      return true;
    },
    [menuItems, selectedItems, onDataUpdate]
  );

  // ✅ Handle individual menu item updates
  const handleMenuItemUpdate = useCallback(
    (menuIndex, updatedMenuItem) => {
      setMenuItems((prev) => {
        const updated = [...prev];
        updated[menuIndex] = updatedMenuItem;
        return updated;
      });

      if (onDataUpdate) {
        const updated = [...menuItems];
        updated[menuIndex] = updatedMenuItem;
        onDataUpdate(updated);
      }
    },
    [menuItems, onDataUpdate]
  );

  // ✅ Show loading state if no data
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
        />
      </div>
    </div>
  );
}
