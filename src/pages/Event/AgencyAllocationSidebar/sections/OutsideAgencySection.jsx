import { useState, useEffect } from "react";
import AllocateRowOutside from "../components/AllocateRowOutside";
import OutsideAgencyTable from "../components/OutsideAgencyTable";

export default function OutsideAgencySection({ data, onDataUpdate }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState(data[0].menuAllocation || []);

  useEffect(() => {
    if (data) {
      setMenuItems(data[0].menuAllocation);
    }
  }, [data]);

  const handleItemSelect = (itemKey, isChecked, menuIndex, allocationIndex) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: isChecked,
    }));
  };

  const handleAllocate = (allocationData) => {
    const { partyId, partyName, pax } = allocationData;

    console.log("Allocate called with:", {
      partyId,
      partyName,
      pax,
    });

    if (!partyId || !pax) {
      alert("Vendor and pax are required");
      return;
    }

    // Check if any items are selected
    const hasSelectedItems = Object.values(selectedItems).some(
      (isSelected) => isSelected
    );

    if (!hasSelectedItems) {
      alert("Please select at least one item to allocate");
      return;
    }

    let allocatedCount = 0;

    const updatedMenuItems = menuItems.map((menuItem, menuIndex) => {
      const updatedAllocations = menuItem.eventFunctionMenuAllocations.map(
        (allocation, allocationIndex) => {
          const itemKey = `${menuIndex}-${allocationIndex}`;

          // Only update if this item is selected
          if (selectedItems[itemKey]) {
            allocatedCount++;

            console.log("Updating allocation:", {
              allocationIndex,
              oldPartyId: allocation.partyId,
              newPartyId: partyId,
            });

            return {
              ...allocation,
              partyId: partyId,
              partyName: partyName,
              pax: pax,
            };
          }

          // Return unchanged if not selected
          return allocation;
        }
      );

      // Check if any allocations in this menu item were updated
      const hasUpdatedAllocations = menuItem.eventFunctionMenuAllocations.some(
        (_, allocationIndex) => {
          const itemKey = `${menuIndex}-${allocationIndex}`;
          return selectedItems[itemKey];
        }
      );

      return {
        ...menuItem,
        eventFunctionMenuAllocations: updatedAllocations,
        // Update personCount only if this menu item had selected allocations
        ...(hasUpdatedAllocations && { personCount: pax }),
      };
    });

    console.log("Updated menu items:", updatedMenuItems);

    setMenuItems(updatedMenuItems);

    if (onDataUpdate) {
      onDataUpdate(updatedMenuItems);
    }

    alert(`Allocated to ${allocatedCount} selected item(s) successfully`);
  };

  const handleMenuItemUpdate = (menuIndex, updatedMenuItem) => {
    const updatedData = [...menuItems];
    updatedData[menuIndex] = updatedMenuItem;
    setMenuItems(updatedData);

    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <>
      <AllocateRowOutside onAllocate={handleAllocate} />
      <OutsideAgencyTable
        menuItems={menuItems}
        onUpdate={handleMenuItemUpdate}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />
    </>
  );
}
