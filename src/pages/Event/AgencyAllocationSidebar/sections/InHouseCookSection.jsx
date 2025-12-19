import { useState, useEffect, useCallback, useMemo } from "react";
import AllocateRowInHouse from "../components/AllocateRowInHouse";
import InHouseCookTable from "../components/InHouseCookTable";

export default function InHouseCookSection({ data, onDataUpdate }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);

  // ✅ Initialize menu items properly
  useEffect(() => {
    if (data && Array.isArray(data)) {
      const allocations = data[0]?.menuAllocation || [];
      setMenuItems(allocations);
    }
  }, [data]);

  // ✅ Memoized selected count
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

  // ✅ Handle allocation
  const handleAllocate = useCallback(
    (allocationData) => {
      const { partyId, partyName, number, pax } = allocationData;

      if (!partyId || !pax) {
        alert("Vendor and PAX are required");
        return false;
      }

      const hasSelectedItems = Object.values(selectedItems).some(Boolean);
      if (!hasSelectedItems) {
        alert("Please select at least one item to allocate");
        return false;
      }

      let allocatedCount = 0;

      const updatedMenuItems = menuItems.map((menuItem, menuIndex) => {
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
              };
            }

            return allocation;
          }
        );

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

      setMenuItems(updatedMenuItems);

      if (onDataUpdate) {
        onDataUpdate(updatedMenuItems);
      }

      setSelectedItems({});
      alert(`Successfully allocated to ${allocatedCount} item(s)`);
      return true;
    },
    [menuItems, selectedItems, onDataUpdate]
  );

  // ✅ Handle menu item update
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
        {/* ✅ Single table component for all items */}
        <InHouseCookTable
          menuItems={menuItems}
          onUpdate={handleMenuItemUpdate}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />
      </div>
    </div>
  );
}
