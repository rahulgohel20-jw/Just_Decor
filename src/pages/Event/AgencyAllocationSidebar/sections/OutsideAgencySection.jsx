import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import AllocateRowOutside from "../components/AllocateRowOutside";
import OutsideAgencyTable from "../components/OutsideAgencyTable";
import { MenuAllocationSave } from "@/services/apiServices";
import Swal from "sweetalert2";

export default function OutsideAgencySection({
  data,
  onDataUpdate,
  close,
  vendorRefreshTrigger,
  isAllFunctions,
}) {
  const [selectedItems, setSelectedItems] = useState({});
  const [menuItems, setMenuItems] = useState([]);
  const [saving, setSaving] = useState(false);

  const changedPaxItemsRef = useRef(new Set());
  const initialMenuItemsRef = useRef([]);

  // ✅ Keep a ref always in sync with menuItems state
  // so callbacks can read latest value without being deps
  const menuItemsRef = useRef([]);
  useEffect(() => {
    menuItemsRef.current = menuItems;
  }, [menuItems]);

  useEffect(() => {
    if (data && Array.isArray(data)) {
      if (isAllFunctions) {
        const allMenuItems = data.flatMap((functionData, functionIndex) => {
          const allocations = functionData?.menuAllocation || [];
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
        initialMenuItemsRef.current = JSON.parse(JSON.stringify(allMenuItems));
      } else {
        const allocations = data[0]?.menuAllocation || [];
        setMenuItems(allocations);
        initialMenuItemsRef.current = JSON.parse(JSON.stringify(allocations));
      }
    } else {
      setMenuItems([]);
      initialMenuItemsRef.current = [];
    }

    changedPaxItemsRef.current.clear();
  }, [data, isAllFunctions]);

  const selectedCount = useMemo(() => {
    return Object.values(selectedItems).filter(Boolean).length;
  }, [selectedItems]);

  const handleItemSelect = useCallback(
    (itemKey, isChecked, menuIndex, allocationIndex) => {
      setSelectedItems((prev) => ({
        ...prev,
        [itemKey]: isChecked,
      }));
    },
    [],
  );

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

      if (!allocationData.partyId && !allocationData.pax) {
        Swal.fire({
          title: "Warning",
          text: "Please provide at least one allocation value (Vendor or Pax)",
          icon: "warning",
        });
        return false;
      }

      let allocatedCount = 0;

      // ✅ Read from ref — no stale closure, no dep needed
      const current = menuItemsRef.current;

      const updatedMenuItems = current.map((menuItem, menuIndex) => {
        const updatedAllocations = menuItem.eventFunctionMenuAllocations.map(
          (allocation, allocationIndex) => {
            const itemKey = `${menuIndex}-${allocationIndex}`;

            if (selectedItems[itemKey]) {
              allocatedCount++;
              const updates = {};

              if (allocationData.partyId !== undefined) {
                updates.partyId = allocationData.partyId;
                updates.partyName = allocationData.partyName || "";
              }

              if (allocationData.pax !== undefined) {
                updates.pax = allocationData.pax;
              }

              return { ...allocation, ...updates };
            }

            return allocation;
          },
        );

        const hasUpdatedAllocations =
          menuItem.eventFunctionMenuAllocations.some((_, allocationIndex) => {
            const itemKey = `${menuIndex}-${allocationIndex}`;
            return selectedItems[itemKey];
          });

        if (hasUpdatedAllocations && allocationData.pax !== undefined) {
          const itemKey = `${menuItem.menuItemId}-${menuItem.menuCategoryId}-${menuItem.eventFunctionId}`;
          const initialItem = initialMenuItemsRef.current[menuIndex];
          if (initialItem && initialItem.personCount !== allocationData.pax) {
            changedPaxItemsRef.current.add(itemKey);
          }
        }

        return {
          ...menuItem,
          eventFunctionMenuAllocations: updatedAllocations,
          ...(hasUpdatedAllocations &&
            allocationData.pax !== undefined && {
              personCount: allocationData.pax,
            }),
        };
      });

      setMenuItems(updatedMenuItems);
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
    // ✅ removed menuItems from deps — reads from ref instead
    [selectedItems],
  );

  // ✅ KEY FIX: Update internal state only, do NOT call onDataUpdate here.
  // onDataUpdate (parent notification) only happens on Save.
  // This prevents the parent from re-rendering and passing a new menuItems
  // prop reference back down, which was resetting the child's local input state.
  const handleMenuItemUpdate = useCallback((menuIndex, updatedMenuItem) => {
    const initialItem = initialMenuItemsRef.current[menuIndex];
    if (
      initialItem &&
      initialItem.personCount !== updatedMenuItem.personCount
    ) {
      const itemKey = `${updatedMenuItem.menuItemId}-${updatedMenuItem.menuCategoryId}-${updatedMenuItem.eventFunctionId}`;
      changedPaxItemsRef.current.add(itemKey);
    }

    // ✅ Use functional update — no stale closure, no menuItems dep needed
    setMenuItems((prev) => {
      const updatedData = [...prev];
      updatedData[menuIndex] = updatedMenuItem;
      return updatedData;
    });

    // ✅ DO NOT call onDataUpdate here — calling it causes parent re-render
    // → new menuItems prop → child useEffect resets inputs.
    // Parent gets latest data via buildPayload() on Save.
  }, []); // ✅ empty deps — stable reference, never recreated

  const buildPayload = useCallback(() => {
    const userId = Number(localStorage.getItem("userId"));

    // ✅ Read from ref for latest data
    return menuItemsRef.current.map((menuItem) => {
      const itemKey = `${menuItem.menuItemId}-${menuItem.menuCategoryId}-${menuItem.eventFunctionId}`;
      const isPaxChange = changedPaxItemsRef.current.has(itemKey);

      return {
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
        oldPersonCount: menuItem.oldPersonCount || 0,
        isPaxChange,
        place: menuItem.place || "",
        menuItemRawMaterials: [],
        userId,
        menuAllocationOrders:
          menuItem.eventFunctionMenuAllocations?.map((allocation) => ({
            id: allocation.id || 0,
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
      };
    });
  }, []); // ✅ reads from ref, no deps needed

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

        changedPaxItemsRef.current.clear();
        initialMenuItemsRef.current = JSON.parse(
          JSON.stringify(menuItemsRef.current),
        );

        // ✅ Notify parent ONLY on successful save
        if (onDataUpdate) {
          onDataUpdate(menuItemsRef.current);
        }

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
      <AllocateRowOutside
        onAllocate={handleAllocate}
        vendorRefreshTrigger={vendorRefreshTrigger}
        selectedCount={selectedCount}
      />
      <div className="flex-1 overflow-auto">
        <OutsideAgencyTable
          menuItems={menuItems}
          onUpdate={handleMenuItemUpdate}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
          vendorRefreshTrigger={vendorRefreshTrigger}
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