import { useState, useEffect, useCallback, useMemo } from "react";
import AllocateRowInHouse from "../components/AllocateRowInHouse";
import InHouseCookTable from "../components/InHouseCookTable";
import { MenuAllocationSave } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function InHouseCookSection({ data, onDataUpdate, close }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      const allocations = data[0]?.menuAllocation || [];
      setMenuItems(allocations);
    }
  }, [data]);

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
      const { partyId, partyName, number, pax } = allocationData;

      if (!partyId || !pax) {
        Swal.fire({
          title: "Success",
          text: "Vendor and pax are required",
          icon: "warning",
        });
        return false;
      }

      const hasSelectedItems = Object.values(selectedItems).some(Boolean);
      if (!hasSelectedItems) {
        Swal.fire({
          title: "Success",
          text: "Please select at least one item to allocate",
          icon: "warning",
        });
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
      Swal.fire({
        title: "Success",
        text: `Allocated to ${allocatedCount} selected item(s) successfully`,
        icon: "success",
        timer: 2000,
        buttons: false,
      });
      return true;
    },
    [menuItems, selectedItems, onDataUpdate]
  );

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

  const buildPayload = useCallback(() => {
    const userId = Number(localStorage.getItem("userId"));

    return menuItems.map((menuItem) => ({
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
      place: menuItem.place || "",
      userId,

      menuAllocationOrders:
        menuItem.eventFunctionMenuAllocations?.map((allocation) => ({
          id: 0,
          partyId: allocation.partyId || 0,
          number: allocation.number || "",
          serviceType: "",
          quantity: 0,
          price: 0,
          counterQuantity: 0,
          counterPrice: 0,
          helperQuantity: 0,
          helperPrice: 0,
          totalPrice: 0,
          unitId: 0,
          remarks: allocation.remarks || "",
          menuItemRawMaterials: [],
          isOutside: false,
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
