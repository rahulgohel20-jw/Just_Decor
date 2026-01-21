import { useState, useEffect, useCallback } from "react";
import AllocateRowOutside from "../components/AllocateRowOutside";
import OutsideAgencyTable from "../components/OutsideAgencyTable";
import { MenuAllocationSave } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function OutsideAgencySection({
  data,
  onDataUpdate,
  close,
  vendorRefreshTrigger,
}) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState(data[0].menuAllocation || []);
  const [saving, setSaving] = useState(false);

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

    if (!partyId || !pax) {
      Swal.fire({
        title: "Success",
        text: "Vendor and pax are required",
        icon: "warning",
      });
      return;
    }

    // Check if any items are selected
    const hasSelectedItems = Object.values(selectedItems).some(
      (isSelected) => isSelected,
    );

    if (!hasSelectedItems) {
      Swal.fire({
        title: "Success",
        text: "Please select at least one item to allocate",
        icon: "warning",
      });
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

            return {
              ...allocation,
              partyId: partyId,
              partyName: partyName,
              pax: pax,
            };
          }

          // Return unchanged if not selected
          return allocation;
        },
      );

      // Check if any allocations in this menu item were updated
      const hasUpdatedAllocations = menuItem.eventFunctionMenuAllocations.some(
        (_, allocationIndex) => {
          const itemKey = `${menuIndex}-${allocationIndex}`;
          return selectedItems[itemKey];
        },
      );

      return {
        ...menuItem,
        eventFunctionMenuAllocations: updatedAllocations,
        // Update personCount only if this menu item had selected allocations
        ...(hasUpdatedAllocations && { personCount: pax }),
      };
    });

    setMenuItems(updatedMenuItems);

    if (onDataUpdate) {
      onDataUpdate(updatedMenuItems);
    }

    Swal.fire({
      title: "Success",
      text: `Allocated to ${allocatedCount} selected item(s) successfully`,
      icon: "success",
      timer: 2000,
      buttons: false,
    });
  };

  const handleMenuItemUpdate = (menuIndex, updatedMenuItem) => {
    const updatedData = [...menuItems];
    updatedData[menuIndex] = updatedMenuItem;
    setMenuItems(updatedData);

    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };
  const buildPayload = useCallback(() => {
    const userId = Number(localStorage.getItem("userId"));

    return menuItems.map((menuItem) => ({
      chefLabour: false,
      eventFunctionId: menuItem.eventFunctionId || 0,
      eventId: menuItem.eventId || 0,
      id: menuItem.id || 0,
      inside: false,
      outside: true,
      instructions: menuItem.instructions || "",
      menuCategoryId: menuItem.menuCategoryId || 0,
      menuItemId: menuItem.menuItemId || 0,
      personCount: menuItem.personCount || 0,
      place: menuItem.place || "",
      userId,

      menuAllocationOrders:
        menuItem.eventFunctionMenuAllocations?.map((allocation) => ({
          id: 0,
          partyId: allocation.partyId || 0,
          number: allocation.number || "",
          serviceType: "",
          quantity: allocation.quantity,
          price: allocation.price || 0,
          counterQuantity: 0,
          counterPrice: 0,
          helperQuantity: 0,
          helperPrice: 0,
          totalPrice: allocation.totalPrice || 0,
          unitId: allocation.unitId || 0,
          remarks: "",
          menuItemRawMaterials: [],
          isOutside: true,
        })) || [],
    }));
  }, [menuItems]);

  const handleSave = async () => {
    try {
      setSaving(true);

      const payload = buildPayload();

      const res = await MenuAllocationSave(payload);

      if (res?.data?.success === true) {
        Swal.fire({
          title: "Success",
          text: res?.data?.message || " allocation saved successfully",
          icon: "success",
          timer: 2000,
          buttons: false,
        });

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
  return (
    <>
      <AllocateRowOutside
        onAllocate={handleAllocate}
        vendorRefreshTrigger={vendorRefreshTrigger}
      />
      <OutsideAgencyTable
        menuItems={menuItems}
        onUpdate={handleMenuItemUpdate}
        selectedItems={selectedItems}
        onItemSelect={handleItemSelect}
      />
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
    </>
  );
}
