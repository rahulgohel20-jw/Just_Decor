import { useState, useEffect } from "react";
import AllocateRowOutside from "../components/AllocateRowOutside";
import OutsideAgencyTable from "../components/OutsideAgencyTable";

export default function OutsideAgencySection({ data, onDataUpdate }) {
  const [selectedItems, setSelectedItems] = useState({});
  const [agencyData, setAgencyData] = useState(data?.agencyResponse || []);

  // Sync agencyData when data prop changes
  useEffect(() => {
    if (data?.agencyResponse) {
      setAgencyData(data.agencyResponse);
    }
  }, [data]);

  const handleItemSelect = (itemKey, isChecked, agencyIndex, itemIndex) => {
    setSelectedItems((prev) => ({
      ...prev,
      [itemKey]: isChecked,
    }));
  };

  const handleAllocate = (allocationData) => {
    const { contactId, pax } = allocationData;

    console.log("Allocate called with:", {
      contactId,
      pax,
      type: typeof contactId,
    });

    if (!contactId || !pax) {
      alert("Vendor and pax are required");
      return;
    }

    const updatedAgencyData = agencyData.map((agency, agencyIndex) => {
      const updatedItems = agency.allocationItems.map((item, itemIndex) => {
        // Auto-check all items
        const itemKey = `${agencyIndex}-${itemIndex}`;
        setSelectedItems((prev) => ({
          ...prev,
          [itemKey]: true,
        }));

        console.log("Updating item:", {
          itemIndex,
          oldContactId: item.contactId,
          newContactId: contactId,
          stringContactId: String(contactId),
        });

        return {
          ...item,
          contactId: contactId, // Keep as-is from vendor select
          pax: pax,
        };
      });

      // Recalculate agency total price after allocation
      const totalPrice = updatedItems.reduce(
        (sum, item) => sum + (parseFloat(item.itemTotal) || 0),
        0
      );

      return {
        ...agency,
        allocationItems: updatedItems,
        totalPrice: totalPrice,
      };
    });

    console.log("Updated agency data:", updatedAgencyData);

    setAgencyData(updatedAgencyData);

    if (onDataUpdate) {
      onDataUpdate(updatedAgencyData);
    }

    alert("Allocated to all items successfully");
  };

  const handleAgencyUpdate = (agencyIndex, updatedAgency) => {
    const updatedData = [...agencyData];
    updatedData[agencyIndex] = updatedAgency;
    setAgencyData(updatedData);

    if (onDataUpdate) {
      onDataUpdate(updatedData);
    }
  };

  return (
    <>
      <AllocateRowOutside
        eventFunction={data?.eventFunction}
        onAllocate={handleAllocate}
      />
      {agencyData?.map((agency, index) => (
        <OutsideAgencyTable
          key={index}
          agencyData={agency}
          agencyIndex={index}
          onUpdate={handleAgencyUpdate}
          selectedItems={selectedItems}
          onItemSelect={handleItemSelect}
        />
      ))}
    </>
  );
}
