import { useState, useEffect, useRef } from "react";
import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";
import { OutsideContactName, GetUnitData } from "@/services/apiServices";

export default function OutsideAgencyTable({
  menuItems,
  onUpdate,
  selectedItems,
  onItemSelect,
  vendorRefreshTrigger = 0,
  isAllFunctions,
}) {
  const [localMenuItems, setLocalMenuItems] = useState(() =>
    initMenuItems(menuItems),
  );
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [unit, setUnit] = useState([]);

  // ✅ Track the last menuItems we synced from, by reference
  const prevMenuItemsRef = useRef(menuItems);

  // ✅ Always-fresh ref for localMenuItems — fixes stale closure in onBlur
  const localMenuItemsRef = useRef([]);

  function initMenuItems(items) {
    return (items || []).map((menuItem) => ({
      ...menuItem,
      eventFunctionMenuAllocations: menuItem.eventFunctionMenuAllocations?.map(
        (allocation) => ({
          ...allocation,
          quantity:
            allocation.quantity && allocation.quantity > 0
              ? allocation.quantity
              : (menuItem.personCount ?? ""),
          isQuantityEdited: allocation.isQuantityEdited ?? false,
        }),
      ),
    }));
  }

  useEffect(() => {
    fetchVendor();
    fetchUnit();
  }, [vendorRefreshTrigger]);

  const fetchUnit = async () => {
    try {
      const data = await GetUnitData(localStorage.getItem("userId"));
      const unitData = data?.data?.data["Unit Details"] || [];
      setUnit(unitData);
    } catch (error) {
      console.error("Error fetching units:", error);
      setUnit([]);
    }
  };

  const fetchVendor = async () => {
    try {
      setLoadingVendors(true);
      const data = await OutsideContactName(6, localStorage.getItem("userId"));
      const vendorList = data?.data?.data["Party Details"] || [];
      setVendors(vendorList);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  // ✅ Only re-sync from parent when menuItems reference actually changes
  // (i.e. new data loaded from API), NOT on every parent render
  useEffect(() => {
    if (menuItems === prevMenuItemsRef.current) return; // same ref = skip
    prevMenuItemsRef.current = menuItems;
    setLocalMenuItems(initMenuItems(menuItems));
  }, [menuItems]);

  // ✅ Keep ref in sync with every localMenuItems update
  useEffect(() => {
    localMenuItemsRef.current = localMenuItems;
  }, [localMenuItems]);

  // ✅ Update local state only — no parent notification while typing
  const handleAllocationChange = (menuIndex, allocationIndex, field, value) => {
    setLocalMenuItems((prev) => {
      const updatedMenuItems = [...prev];
      const updatedAllocations = [
        ...updatedMenuItems[menuIndex].eventFunctionMenuAllocations,
      ];

      updatedAllocations[allocationIndex] = {
        ...updatedAllocations[allocationIndex],
        [field]: value,
      };

      if (field === "pax") {
        updatedMenuItems[menuIndex] = {
          ...updatedMenuItems[menuIndex],
          personCount: value,
        };
      }

      const allocation = updatedAllocations[allocationIndex];
      const qty = parseFloat(allocation.quantity) || 0;
      const price = parseFloat(allocation.price) || 0;
      updatedAllocations[allocationIndex].totalPrice = qty * price;

      updatedMenuItems[menuIndex] = {
        ...updatedMenuItems[menuIndex],
        eventFunctionMenuAllocations: updatedAllocations,
      };

      // ✅ Also update ref immediately so onBlur sees fresh data
      localMenuItemsRef.current = updatedMenuItems;

      return updatedMenuItems;
    });
  };

  // ✅ Read from ref — always has the latest value, never stale
  const handleAllocationBlur = (menuIndex) => {
    onUpdate(menuIndex, localMenuItemsRef.current[menuIndex]);
  };

  const handleCheckboxChange = (menuIndex, allocationIndex, isChecked) => {
    const itemKey = `${menuIndex}-${allocationIndex}`;
    onItemSelect(itemKey, isChecked, menuIndex, allocationIndex);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    localMenuItems?.forEach((menuItem, menuIndex) => {
      menuItem.eventFunctionMenuAllocations?.forEach((_, allocationIndex) => {
        const itemKey = `${menuIndex}-${allocationIndex}`;
        onItemSelect(itemKey, isChecked, menuIndex, allocationIndex);
      });
    });
  };

  if (!localMenuItems || localMenuItems.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        No menu items available
      </div>
    );
  }

  const allSelected =
    Array.isArray(localMenuItems) &&
    localMenuItems.length > 0 &&
    localMenuItems.every((menuItem, menuIndex) => {
      const allocations = menuItem?.eventFunctionMenuAllocations;
      if (!Array.isArray(allocations) || allocations.length === 0) return false;
      return allocations.every((_, allocationIndex) => {
        const itemKey = `${menuIndex}-${allocationIndex}`;
        return selectedItems[itemKey] === true;
      });
    });

  return (
    <div className="mt-3 px-6 pb-6 overflow-x-auto">
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <colgroup>
            <col className="w-[44px]" />
            <col className="w-[60px]" />
            {isAllFunctions && <col className="w-[150px]" />}
            <col className="w-[160px]" />
            <col className="w-[200px]" />
            <col className="w-[160px]" />
            <col className="w-[160px]" />
            <col className="w-[140px]" />
            <col className="w-[140px]" />
            <col className="w-[120px]" />
          </colgroup>

          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-xs font-semibold">
              <th className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected || false}
                  onChange={handleSelectAll}
                />
              </th>
              <th className="p-3 text-left">No.</th>
              {isAllFunctions && <th className="p-3 text-left">Function</th>}
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Contact Name</th>
              <th className="p-3 text-left">Pax</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left border-l">Total Price</th>
            </tr>
          </thead>

          <tbody>
            {localMenuItems?.map((menuItem, menuIndex) =>
              menuItem.eventFunctionMenuAllocations?.map(
                (allocation, allocationIndex) => {
                  const qty = parseFloat(allocation.quantity) || 0;
                  const price = parseFloat(allocation.price) || 0;
                  const totalPrice = qty * price;
                  const itemKey = `${menuIndex}-${allocationIndex}`;
                  const rowNumber =
                    localMenuItems
                      .slice(0, menuIndex)
                      .reduce(
                        (sum, item) =>
                          sum +
                          (item.eventFunctionMenuAllocations?.length || 0),
                        0,
                      ) +
                    allocationIndex +
                    1;

                  return (
                    <tr
                      key={itemKey}
                      className={`border-b hover:bg-gray-50 align-middle ${
                        selectedItems[itemKey] ? "bg-blue-50" : ""
                      }`}
                    >
                      <td className="p-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedItems[itemKey] || false}
                          onChange={(e) =>
                            handleCheckboxChange(
                              menuIndex,
                              allocationIndex,
                              e.target.checked,
                            )
                          }
                        />
                      </td>
                      <td className="p-3">{rowNumber}</td>

                      {isAllFunctions && (
                        <td className="p-3">
                          <div className="text-xs">
                            <div className="font-medium text-gray-900">
                              {menuItem._functionName || "-"}
                            </div>
                            {menuItem._functionPax && (
                              <div className="text-gray-500">
                                PAX: {menuItem._functionPax}
                              </div>
                            )}
                          </div>
                        </td>
                      )}

                      <td className="p-3">
                        <span className="text-gray-700">
                          {menuItem.menuItemName || menuItem.menuName || "N/A"}
                        </span>
                      </td>
                      <td className="p-2">
                        <BaseSelect
                          value={allocation.partyId || ""}
                          onChange={(e) => {
                            handleAllocationChange(
                              menuIndex,
                              allocationIndex,
                              "partyId",
                              e.target.value,
                            );
                            setTimeout(() => handleAllocationBlur(menuIndex), 0);
                          }}
                          disabled={loadingVendors}
                        >
                          <option value="">
                            {loadingVendors ? "Loading..." : "Select contact"}
                          </option>
                          {allocation.partyId &&
                            !vendors.some(
                              (v) =>
                                String(v.id) === String(allocation.partyId),
                            ) && (
                              <option value={allocation.partyId}>
                                {allocation.partyName || "Selected contact"}
                              </option>
                            )}
                          {vendors.map((vendor) => (
                            <option key={vendor.id} value={vendor.id}>
                              {vendor.nameEnglish}
                            </option>
                          ))}
                        </BaseSelect>
                      </td>

                      <td className="p-2">
                        <BaseInput
                          type="number"
                          placeholder=""
                          value={menuItem.personCount || ""}
                          onChange={(e) =>
                            handleAllocationChange(
                              menuIndex,
                              allocationIndex,
                              "pax",
                              e.target.value,
                            )
                          }
                          onBlur={() => handleAllocationBlur(menuIndex)}
                        />
                      </td>
                      <td className="p-2">
                        <BaseSelect
                          value={allocation.unitId || menuItem.unitId || ""}
                          onChange={(e) => {
                            handleAllocationChange(
                              menuIndex,
                              allocationIndex,
                              "unitId",
                              e.target.value,
                            );
                            // selects have no blur delay needed, notify immediately
                            setTimeout(() => handleAllocationBlur(menuIndex), 0);
                          }}
                        >
                          <option value="">Select Unit</option>
                          {(allocation.unitId || menuItem.unitId) &&
                            !unit.some(
                              (u) =>
                                String(u.id) ===
                                String(allocation.unitId || menuItem.unitId),
                            ) && (
                              <option
                                value={allocation.unitId || menuItem.unitId}
                              >
                                {allocation.unitName ||
                                  menuItem.unitName ||
                                  "Selected unit"}
                              </option>
                            )}
                          {unit.map((u) => (
                            <option key={u.id} value={u.id}>
                              {u.nameEnglish}
                            </option>
                          ))}
                        </BaseSelect>
                      </td>
                      <td className="p-2">
                        <BaseInput
                          type="number"
                          placeholder="0"
                          value={allocation.quantity ?? ""}
                          onChange={(e) =>
                            handleAllocationChange(
                              menuIndex,
                              allocationIndex,
                              "quantity",
                              e.target.value,
                            )
                          }
                          onBlur={() => handleAllocationBlur(menuIndex)}
                        />
                      </td>
                      <td className="p-2">
                        <BaseInput
                          type="number"
                          placeholder="0"
                          value={allocation.price || ""}
                          onChange={(e) =>
                            handleAllocationChange(
                              menuIndex,
                              allocationIndex,
                              "price",
                              e.target.value,
                            )
                          }
                          onBlur={() => handleAllocationBlur(menuIndex)}
                        />
                      </td>
                      <td className="p-2">
                        <BaseInput
                          disabled
                          placeholder="0"
                          value={totalPrice.toFixed(2)}
                          className="bg-gray-100"
                        />
                      </td>
                    </tr>
                  );
                },
              ),
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}