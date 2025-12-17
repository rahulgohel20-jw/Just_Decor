import { useState } from "react";
import AllocateRowInHouse from "../components/AllocateRowInHouse";
import InHouseCookTable from "../components/InHouseCookTable";

export default function InHouseCookSection({ data }) {
  console.log(data);
  const insideData = data.agencyResponse || [];

  const [tableData, setTableData] = useState(
    insideData?.flatMap((contact) =>
      contact.allocationItems.map((item) => ({
        ...item,
        contactId: contact.contactId,
        contactName: contact.contactName,
        number: contact.number,
        contactRemarks: contact.remarks,
        selected: false,
      }))
    ) || []
  );

  const handleAllocate = (vendorId, vendorName, vendorNumber, paxValue) => {
    const selectedItems = tableData.filter((item) => item.selected);

    if (selectedItems.length === 0) {
      alert("Please select at least one item by checking the checkbox");
      return false;
    }

    setTableData((prev) =>
      prev.map((item) =>
        item.selected
          ? {
              ...item,
              contactId: vendorId,
              contactName: vendorName,
              number: vendorNumber || "",
              pax: paxValue,
            }
          : item
      )
    );

    return true;
  };

  return (
    <>
      <AllocateRowInHouse onAllocate={handleAllocate} />
      <InHouseCookTable
        insidedata={insideData}
        tableData={tableData}
        setTableData={setTableData}
      />
    </>
  );
}
