import { useState, useEffect } from "react";
import BaseInput from "../ui/BaseInput";
import BaseSelect from "../ui/BaseSelect";
import { OutsideContactName } from "@/services/apiServices";

export default function InHouseCookTable({
  insidedata,
  tableData,
  setTableData,
}) {
  const [vendors, setVendors] = useState([]);
  const [loadingVendors, setLoadingVendors] = useState(true);

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

  // Handle input changes
  const handleInputChange = (index, field, value) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        [field]: value,
      };
      return updated;
    });
  };

  // Handle contact name change with vendor data
  const handleContactChange = (index, vendorId) => {
    const selectedVendor = vendors.find(
      (v) => String(v.id || v.contactId) === String(vendorId)
    );

    if (selectedVendor) {
      setTableData((prev) => {
        const updated = [...prev];
        updated[index] = {
          ...updated[index],
          contactId: selectedVendor.id || "",
          contactName:
            selectedVendor.name ||
            selectedVendor.nameEnglish ||
            selectedVendor.partyName,
          number: selectedVendor.mobileno || selectedVendor.number || "",
        };
        return updated;
      });
    }
  };

  // Handle checkbox change for individual row
  const handleRowCheckbox = (index) => {
    setTableData((prev) => {
      const updated = [...prev];
      updated[index] = {
        ...updated[index],
        selected: !updated[index].selected,
      };
      return updated;
    });
  };

  // Handle select all checkbox
  const allSelected =
    tableData.length > 0 && tableData.every((item) => item.selected);
  const handleSelectAll = () => {
    setTableData((prev) =>
      prev.map((item) => ({
        ...item,
        selected: !allSelected,
      }))
    );
  };

  console.log("Updated table data:", tableData);

  return (
    <div className="mt-3 px-6 pb-6 overflow-x-auto">
      <div className="border rounded-xl bg-white overflow-hidden">
        <table className="w-full border-collapse text-sm">
          {/* COLUMN WIDTH CONTROL */}
          <colgroup>
            <col className="w-[44px]" />
            <col className="w-[60px]" />
            <col className="w-[160px]" />
            <col className="w-[100px]" />
            <col className="w-[220px]" />
            <col className="w-[160px]" />
            <col className="w-[140px]" />
            <col className="w-[140px]" />
          </colgroup>

          {/* HEADER */}
          <thead className="bg-gray-50 border-b">
            <tr className="text-gray-600 text-xs font-semibold">
              <th rowSpan={2} className="p-3 text-center">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleSelectAll}
                />
              </th>
              <th rowSpan={2} className="p-3 text-left">
                No.
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Item Name
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Pax
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Contact Name
              </th>
              <th rowSpan={2} className="p-3 text-left">
                Number
              </th>
              <th colSpan={1} className="p-3 text-center border-l">
                Person
              </th>
              <th colSpan={1} className="p-3 text-center border-l">
                Remarks
              </th>
            </tr>
          </thead>

          {/* BODY */}
          <tbody>
            {tableData.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center text-gray-500">
                  No data available
                </td>
              </tr>
            ) : (
              tableData.map((item, index) => (
                <tr
                  key={`${item.contactId}-${item.itemId}-${index}`}
                  className={`border-b hover:bg-gray-50 align-middle ${
                    item.selected ? "bg-blue-50" : ""
                  }`}
                >
                  <td className="p-3 text-center">
                    <input
                      type="checkbox"
                      checked={item.selected || false}
                      onChange={() => handleRowCheckbox(index)}
                    />
                  </td>
                  <td className="p-3">{index + 1}</td>
                  <td className="p-3">{item.itemName}</td>
                  <td className="p-2">
                    <BaseInput
                      placeholder="0"
                      value={item.pax || ""}
                      onChange={(e) =>
                        handleInputChange(index, "pax", e.target.value)
                      }
                      type="number"
                    />
                  </td>
                  <td className="p-2">
                    <BaseSelect
                      value={item.contactId || ""}
                      onChange={(e) =>
                        handleContactChange(index, e.target.value)
                      }
                      disabled={loadingVendors}
                    >
                      <option value="">
                        {loadingVendors ? "Loading..." : "Select Name"}
                      </option>
                      {vendors.map((vendor) => (
                        <option
                          key={vendor.id || vendor.contactId}
                          value={vendor.id || vendor.contactId}
                        >
                          {vendor.name || vendor.nameEnglish}
                        </option>
                      ))}
                    </BaseSelect>
                  </td>

                  <td className="p-2">
                    <BaseInput
                      placeholder="0"
                      value={item.number || ""}
                      onChange={(e) =>
                        handleInputChange(index, "number", e.target.value)
                      }
                    />
                  </td>

                  <td className="p-2">
                    <BaseInput
                      placeholder="0"
                      value={item.qty || ""}
                      onChange={(e) =>
                        handleInputChange(index, "qty", e.target.value)
                      }
                      type="number"
                    />
                  </td>

                  <td className="p-2">
                    <BaseInput
                      placeholder="Enter Remarks"
                      value={item.remarks || ""}
                      onChange={(e) =>
                        handleInputChange(index, "remarks", e.target.value)
                      }
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
