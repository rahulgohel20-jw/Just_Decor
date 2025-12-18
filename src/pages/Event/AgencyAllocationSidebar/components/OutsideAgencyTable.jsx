import { useState, useEffect } from "react";
import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";
import { OutsideContactName } from "@/services/apiServices";

export default function OutsideAgencyTable({
  agencyData,
  agencyIndex,
  onUpdate,
  selectedItems,
  onItemSelect,
}) {
  const [localAgency, setLocalAgency] = useState(agencyData);
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(false);

  useEffect(() => {
    fetchVendor();
  }, []);

  const fetchVendor = async () => {
    try {
      setLoadingVendors(true);
      const data = await OutsideContactName(7, localStorage.getItem("userId"));
      const vendorList = data?.data?.data["Party Details"] || [];

      console.log("Fetched vendors:", vendorList);
      setVendors(vendorList);
    } catch (error) {
      console.error("Error fetching vendors:", error);
      setVendors([]);
    } finally {
      setLoadingVendors(false);
    }
  };

  useEffect(() => {
    console.log(localAgency);

    setLocalAgency(agencyData);
  }, [agencyData]);

  const handleItemChange = (itemIndex, field, value) => {
    const updatedItems = [...localAgency.allocationItems];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      [field]: value,
    };

    const item = updatedItems[itemIndex];
    const qty = parseFloat(item.qty) || 0;
    const price = parseFloat(item.price) || 0;
    updatedItems[itemIndex].itemTotal = qty * price;

    const updatedAgency = {
      ...localAgency,
      allocationItems: updatedItems,
      totalPrice: updatedItems.reduce(
        (sum, item) => sum + (parseFloat(item.itemTotal) || 0),
        0
      ),
    };

    setLocalAgency(updatedAgency);
    onUpdate(agencyIndex, updatedAgency);
  };

  const handleCheckboxChange = (itemIndex, isChecked) => {
    const itemKey = `${agencyIndex}-${itemIndex}`;
    onItemSelect(itemKey, isChecked, agencyIndex, itemIndex);
  };

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    localAgency.allocationItems?.forEach((_, itemIndex) => {
      const itemKey = `${agencyIndex}-${itemIndex}`;
      onItemSelect(itemKey, isChecked, agencyIndex, itemIndex);
    });
  };

  if (!localAgency) return null;

  const allSelected = localAgency.allocationItems?.every((_, itemIndex) => {
    const itemKey = `${agencyIndex}-${itemIndex}`;
    return selectedItems[itemKey];
  });

  return (
    <div className="mt-3 px-6 pb-6 overflow-x-auto">
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-collapse text-sm">
          <colgroup>
            <col className="w-[44px]" />
            <col className="w-[60px]" />
            <col className="w-[160px]" />
            <col className="w-[160px]" />
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
              <th className="p-3 text-left">Item name</th>
              <th className="p-3 text-left">Pax</th>
              <th className="p-3 text-left">Contact Name</th>
              <th className="p-3 text-left">Unit</th>
              <th className="p-3 text-left">Quantity</th>
              <th className="p-3 text-left">Price</th>
              <th className="p-3 text-left border-l">Total Price</th>
            </tr>
          </thead>

          <tbody>
            {localAgency.allocationItems?.map((item, itemIndex) => {
              const qty = parseFloat(item.qty) || 0;
              const price = parseFloat(item.price) || 0;
              const itemTotal = qty * price;
              const itemKey = `${agencyIndex}-${itemIndex}`;
              const contactValue = vendors[0]?.id;
              return (
                <tr
                  key={item.itemId}
                  className="border-b hover:bg-gray-50 align-middle"
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={selectedItems[itemKey] || false}
                      onChange={(e) =>
                        handleCheckboxChange(itemIndex, e.target.checked)
                      }
                    />
                  </td>
                  <td className="p-3">{itemIndex + 1}</td>
                  <td className="p-3">{item.itemName}</td>
                  <td className="p-2">
                    <BaseInput
                      type="number"
                      placeholder="0"
                      value={item.pax || ""}
                      onChange={(e) =>
                        handleItemChange(itemIndex, "pax", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <BaseSelect
                      value={contactValue}
                      onChange={(e) =>
                        handleItemChange(itemIndex, "contactId", e.target.value)
                      }
                      disabled={loadingVendors}
                    >
                      <option value="">Select contact</option>

                      {contactValue &&
                        !vendors.some((v) => String(v.id) === contactValue) && (
                          <option value={contactValue}>
                            {item.contactName || "Selected contact"}
                          </option>
                        )}

                      {vendors.map((vendor) => (
                        <option key={vendor.id} value={String(vendor.id)}>
                          {vendor.nameEnglish}
                        </option>
                      ))}
                    </BaseSelect>
                  </td>

                  <td className="p-2">
                    <BaseSelect
                      value={item.unitId || ""}
                      onChange={(e) =>
                        handleItemChange(itemIndex, "unitId", e.target.value)
                      }
                    >
                      <option value="">Select Unit</option>
                      {item.unitName && (
                        <option value={item.unitId}>{item.unitName}</option>
                      )}
                    </BaseSelect>
                  </td>
                  <td className="p-2">
                    <BaseInput
                      type="number"
                      placeholder="0"
                      value={item.qty || ""}
                      onChange={(e) =>
                        handleItemChange(itemIndex, "qty", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <BaseInput
                      type="number"
                      placeholder="0"
                      value={item.price || ""}
                      onChange={(e) =>
                        handleItemChange(itemIndex, "price", e.target.value)
                      }
                    />
                  </td>
                  <td className="p-2">
                    <BaseInput
                      disabled
                      placeholder="0"
                      value={itemTotal.toFixed(2)}
                      className="bg-gray-100"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
