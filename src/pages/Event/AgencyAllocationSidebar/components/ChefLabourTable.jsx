import { useState, useEffect } from "react";
import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";
import { OutsideContactName, GetUnitData } from "@/services/apiServices";

export default function ChefLabourTable({
  menuItems,
  onUpdate,
  selectedItems,
  onItemSelect,
}) {
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);
  const [unit, setUnit] = useState([]);
  useEffect(() => {
    fetchVendor();
    fetchUnit();
  }, []);

  const fetchUnit = async () => {
    try {
      const data = await GetUnitData(localStorage.getItem("userId"));
      const unitData = data?.data?.data["Unit Details"] || [];
      setUnit(unitData);
    } catch {
      console.log("error ", error);
    }
  };

  const fetchVendor = async () => {
    try {
      setLoadingVendors(true);
      const data = await OutsideContactName(5, localStorage.getItem("userId"));
      const vendorList = data?.data?.data["Party Details"] || [];
      setVendors(vendorList);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  const handleAllocationChange = (menuIndex, allocationIndex, field, value) => {
    const menuItem = menuItems[menuIndex];
    const updatedAllocations = [...menuItem.eventFunctionMenuAllocations];
    updatedAllocations[allocationIndex] = {
      ...updatedAllocations[allocationIndex],
      [field]: value,
    };

    // Recalculate total price based on service type
    const allocation = updatedAllocations[allocationIndex];

    if (allocation.serviceType === "plate_wise") {
      const qty = parseFloat(allocation.quantity) || 0;
      const price = parseFloat(allocation.price) || 0;
      updatedAllocations[allocationIndex].totalPrice = qty * price;
    } else if (allocation.serviceType === "counter_wise") {
      const counterQty = parseFloat(allocation.counterQuantity) || 0;
      const helperQty = parseFloat(allocation.helperQuantity) || 0;
      const counterPrice = parseFloat(allocation.counterPrice) || 0;
      const helperPrice = parseFloat(allocation.helperPrice) || 0;
      updatedAllocations[allocationIndex].totalPrice =
        counterQty * counterPrice + helperQty * helperPrice;
    }

    const updatedMenuItem = {
      ...menuItem,
      eventFunctionMenuAllocations: updatedAllocations,
      // Update personCount if pax field is changed
      ...(field === "pax" && { personCount: value }),
    };

    onUpdate(menuIndex, updatedMenuItem);
  };

  const handleContactChange = (menuIndex, allocationIndex, vendorId) => {
    const selectedVendor = vendors.find(
      (v) => String(v.id) === String(vendorId)
    );

    if (selectedVendor) {
      const menuItem = menuItems[menuIndex];
      const updatedAllocations = [...menuItem.eventFunctionMenuAllocations];
      updatedAllocations[allocationIndex] = {
        ...updatedAllocations[allocationIndex],
        partyId: selectedVendor.id || "",
        partyName: selectedVendor.nameEnglish || "",
        number: selectedVendor.mobileno || "",
      };

      const updatedMenuItem = {
        ...menuItem,
        eventFunctionMenuAllocations: updatedAllocations,
      };

      onUpdate(menuIndex, updatedMenuItem);
    }
  };

  const handleCheckboxChange = (menuIndex, allocationIndex, isChecked) => {
    const itemKey = `${menuIndex}-${allocationIndex}`;
    onItemSelect(itemKey, isChecked, menuIndex, allocationIndex);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    menuItems?.forEach((menuItem, menuIndex) => {
      menuItem.eventFunctionMenuAllocations?.forEach((_, allocationIndex) => {
        const itemKey = `${menuIndex}-${allocationIndex}`;
        onItemSelect(itemKey, isChecked, menuIndex, allocationIndex);
      });
    });
  };

  if (!menuItems || menuItems.length === 0) return null;

  // ✅ Check if all items are selected with proper validation
  const allSelected =
    Array.isArray(menuItems) &&
    menuItems.length > 0 &&
    menuItems.every((menuItem, menuIndex) => {
      const allocations = menuItem?.eventFunctionMenuAllocations;

      if (!Array.isArray(allocations) || allocations.length === 0) {
        return false;
      }

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
            <col className="w-[200px]" />
            <col className="w-[120px]" />
            <col className="w-[220px]" />
            <col className="w-[170px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
            <col className="w-[120px]" />
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
              <th className="p-3 text-left">Item Name</th>
              <th className="p-3 text-left">Pax</th>
              <th className="p-3 text-left">Contact Name</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-center border-l" colSpan={2}>
                Quantity
              </th>
              <th className="p-3 text-center border-l" colSpan={2}>
                Price
              </th>
              <th className="p-3 text-left border-l">Total</th>
            </tr>

            <tr className="text-gray-600 text-xs font-semibold bg-gray-50">
              <th colSpan={6}></th>
              <th className="p-3 text-center border-l">Labour/Qty</th>
              <th className="p-3 text-center">Helper/Unit</th>
              <th className="p-3 text-center border-l">Labour/Price</th>
              <th className="p-3 text-center">Helper</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {menuItems.map((menuItem, menuIndex) => (
              <>
                {/* Allocation Rows */}
                {menuItem.eventFunctionMenuAllocations?.map(
                  (allocation, allocationIndex) => {
                    const itemKey = `${menuIndex}-${allocationIndex}`;
                    const isPlateWise = allocation.serviceType === "plate_wise";
                    const isCounterWise =
                      allocation.serviceType === "counter_wise";

                    // Calculate total
                    let totalPrice = 0;
                    if (isPlateWise) {
                      const qty = parseFloat(allocation.quantity) || 0;
                      const price = parseFloat(allocation.price) || 0;
                      totalPrice = qty * price;
                    } else if (isCounterWise) {
                      const counterQty =
                        parseFloat(allocation.counterQuantity) || 0;
                      const helperQty =
                        parseFloat(allocation.helperQuantity) || 0;
                      const counterPrice =
                        parseFloat(allocation.counterPrice) || 0;
                      const helperPrice =
                        parseFloat(allocation.helperPrice) || 0;
                      totalPrice =
                        counterQty * counterPrice + helperQty * helperPrice;
                    }

                    return (
                      <tr
                        key={`${menuIndex}-${allocationIndex}`}
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
                                e.target.checked
                              )
                            }
                          />
                        </td>
                        <td className="p-3">{allocationIndex + 1}</td>
                        <td className="p-3 font-medium text-gray-900">
                          {menuItem.menuItemName || "-"}
                        </td>
                        <td className="p-2">
                          <BaseInput
                            type="number"
                            placeholder="0"
                            value={menuItem.personCount || ""}
                            onChange={(e) =>
                              handleAllocationChange(
                                menuIndex,
                                allocationIndex,
                                "pax",
                                e.target.value
                              )
                            }
                          />
                        </td>
                        <td className="p-2">
                          <BaseSelect
                            value={allocation.partyId || ""}
                            onChange={(e) =>
                              handleContactChange(
                                menuIndex,
                                allocationIndex,
                                e.target.value
                              )
                            }
                            disabled={loadingVendors}
                          >
                            <option value="">
                              {loadingVendors ? "Loading..." : "Select Name"}
                            </option>

                            {allocation.partyId &&
                              !vendors.some(
                                (v) =>
                                  String(v.id) === String(allocation.partyId)
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
                          <BaseSelect
                            value={allocation.serviceType || ""}
                            onChange={(e) =>
                              handleAllocationChange(
                                menuIndex,
                                allocationIndex,
                                "serviceType",
                                e.target.value
                              )
                            }
                          >
                            <option value="">Select Type</option>
                            <option value="counter_wise">Counter Wise</option>
                            <option value="plate_wise">Plate Wise</option>
                          </BaseSelect>
                        </td>

                        {isPlateWise ? (
                          <>
                            <td className="p-2">
                              <BaseInput
                                type="number"
                                placeholder="Quantity"
                                value={allocation.quantity || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "quantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="p-2">
                              <BaseSelect
                                value={allocation.unitId || ""}
                                onChange={(e) => {
                                  const selectedUnit = unit.find(
                                    (u) =>
                                      String(u.id) === String(e.target.value)
                                  );

                                  const menuItem = menuItems[menuIndex];
                                  const updatedAllocations = [
                                    ...menuItem.eventFunctionMenuAllocations,
                                  ];

                                  updatedAllocations[allocationIndex] = {
                                    ...updatedAllocations[allocationIndex],
                                    unitId: selectedUnit?.id || "",
                                    unitName: selectedUnit?.nameEnglish || "",
                                  };

                                  onUpdate(menuIndex, {
                                    ...menuItem,
                                    eventFunctionMenuAllocations:
                                      updatedAllocations,
                                  });
                                }}
                              >
                                <option value="">Select Unit</option>
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
                                placeholder="Price"
                                value={allocation.price || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "price",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="p-2"></td>
                          </>
                        ) : (
                          <>
                            <td className="p-2">
                              <BaseInput
                                type="number"
                                placeholder="Labour"
                                value={allocation.counterQuantity || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "counterQuantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="p-2">
                              <BaseInput
                                type="number"
                                placeholder="Helper"
                                value={allocation.helperQuantity || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "helperQuantity",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="p-2">
                              <BaseInput
                                type="number"
                                placeholder="Labour price"
                                value={allocation.counterPrice || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "counterPrice",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                            <td className="p-2">
                              <BaseInput
                                type="number"
                                placeholder="Helper Price"
                                value={allocation.helperPrice || ""}
                                onChange={(e) =>
                                  handleAllocationChange(
                                    menuIndex,
                                    allocationIndex,
                                    "helperPrice",
                                    e.target.value
                                  )
                                }
                              />
                            </td>
                          </>
                        )}

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
                  }
                )}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
