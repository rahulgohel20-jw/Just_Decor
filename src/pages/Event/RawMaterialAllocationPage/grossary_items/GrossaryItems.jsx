import { useState, useEffect } from "react";
import AddGrossary from "@/partials/modals/event/add-grossary/AddGrossary";
import { ChevronDown, ChevronUp } from "lucide-react";
import {
  GetAllSupllierVendors,
  GetAllRawMaterialAllocationItems,
  RawMaterialAllocation,
} from "@/services/apiServices";
import Swal from "sweetalert2";

const GrossaryItems = ({ categoryId, eventId, eventTypeId }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [expandedRows, setExpandedRows] = useState({});
  const [agencies, setAgencies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Fetch agencies from API
  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const userId = storedUser?.id;
        const response = await GetAllSupllierVendors(userId);
        if (response?.data?.data?.["Party Details"]) {
          setAgencies(response?.data?.data?.["Party Details"]);
        }
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  // Fetch raw material items when categoryId or eventId changes
  useEffect(() => {
    if (categoryId && eventId) {
      console.log(
        "Fetching raw materials for categoryId:",
        categoryId,
        "eventId:",
        eventId
      );
      fetchRawMaterialItems(categoryId, eventId);
    }
  }, [categoryId, eventId]);

  const fetchRawMaterialItems = async (categoryId, eventId) => {
    setLoading(true);
    setTableData([]);
    setExpandedRows({});
    try {
      const response = await GetAllRawMaterialAllocationItems(
        categoryId,
        eventId
      );
      console.log(
        "Raw Material API Response:",
        response?.data?.data?.["Event_RAW_MATERIAL_ALLOCATION"]
      );

      if (response?.data?.data?.["Event_RAW_MATERIAL_ALLOCATION"]) {
        const rawData = response.data.data["Event_RAW_MATERIAL_ALLOCATION"];
        if (Array.isArray(rawData)) {
          setTableData(rawData);
        } else {
          console.error("API response is not an array:", rawData);
          setTableData([]);
        }
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching raw material items:", error);
      setTableData([]);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const calculateTotalPrice = () => {
    return tableData
      .reduce((total, item) => {
        const qty = parseFloat(item.finalQty) || 0;
        const pricePerUnit = parseFloat(item.totalprice) || 0;
        const itemTotal = qty * pricePerUnit;
        return total + itemTotal;
      }, 0)
      .toFixed(2);
  };

  const calculateRowTotal = (row) => {
    const qty = parseFloat(row.finalQty) || 0;
    const pricePerUnit = parseFloat(row.totalprice) || 0;
    return (qty * pricePerUnit).toFixed(2);
  };

  // Helper function to get supplier ID by name
  const getSupplierIdByName = (supplierName) => {
    if (!supplierName) return 0;
    const agency = agencies.find(
      (a) => (a.nameEnglish || a.name) === supplierName
    );
    return agency?.id || 0;
  };

  // Save function
  // Replace your handleSave function with this corrected version:

  const handleSave = async () => {
    try {
      setSaving(true);

      // Transform tableData to match the API structure
      const eventRawMaterial = tableData.map((item) => {
        // Transform eventRawMaterialFunctions to eventRawMatFunctions
        const eventRawMatFunctions = (item.eventRawMaterialFunctions || []).map(
          (func) => ({
            eventFunctionId: func.eventFunctionId || 0,
            functionId: func.functionId || 0,
            functiondatetime: func.functiondatetime || "", // This is correct - from child row
            itemName: func.itemName || "",
            place: func.place || "",
            price: parseFloat(func.price) || 0,
            qty: parseFloat(func.qty) || 0,
            supplierId: getSupplierIdByName(func.supplierName), // ✅ FIXED: Changed from func.supplierId to func.supplierName
            unitId: func.unitId || 1,
          })
        );

        return {
          eventRawMatFunctions: eventRawMatFunctions,
          finalQty: parseFloat(item.finalQty) || 0,
          place: item.place || "",
          qty: parseFloat(item.qty) || 0,
          rawMaterialId: item.rawMaterialId || item.id || 0,
          supplierId: getSupplierIdByName(item.supplierName), // ✅ FIXED: Changed from item.supplierId to item.supplierName
          totalprice: parseFloat(item.totalprice) || 0,
          unitId: item.unitId || 1,
        };
      });

      const payload = {
        eventId: eventId,
        eventRawMaterial: eventRawMaterial,
      };

      console.log("Payload to send:", JSON.stringify(payload, null, 2));

      // Call the API
      const response = await RawMaterialAllocation(payload);

      console.log("Save response:", response);

      if (response?.data?.success || response?.status === 200) {
        // Optionally refresh the data
        fetchRawMaterialItems(categoryId, eventId);
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Raw material allocation saved successfully!",
        });
      } else {
        toast.error("Failed to save raw material allocation");
      }
    } catch (error) {
      console.error("Error saving raw material allocation:", error);
    } finally {
      setSaving(false);
    }
  };
  const handleAllocateAgency = (agencyName) => {
    const updatedData = tableData.map((item) => ({
      ...item,
      supplierName: agencyName,
      eventRawMaterialFunctions: item.eventRawMaterialFunctions?.map(
        (func) => ({
          ...func,
          agency: agencyName,
        })
      ),
    }));
    setTableData(updatedData);
  };

  const handleAllocatePlace = (placeName) => {
    const updatedData = tableData.map((item) => ({
      ...item,
      place: placeName,
      eventRawMaterialFunctions: item.eventRawMaterialFunctions?.map(
        (func) => ({
          ...func,
          place: placeName,
        })
      ),
    }));
    setTableData(updatedData);
  };

  const handleAllocateDate = (dateTime) => {
    const updatedData = tableData.map((item) => ({
      ...item,
      date_time: dateTime,
      eventRawMaterialFunctions: item.eventRawMaterialFunctions?.map(
        (func) => ({
          ...func,
          date_time: dateTime,
        })
      ),
    }));
    setTableData(updatedData);
  };

  const handleFunctionChange = (main_index, func_index, name, value) => {
    const updatedTableData = [...tableData];
    if (updatedTableData[main_index].eventRawMaterialFunctions) {
      updatedTableData[main_index].eventRawMaterialFunctions[func_index] = {
        ...updatedTableData[main_index].eventRawMaterialFunctions[func_index],
        [name]: value,
      };
      setTableData(updatedTableData);
    }
  };

  const handleRowAgencyChange = (rowIndex, agencyName) => {
    const updatedData = tableData.map((item, index) =>
      index === rowIndex ? { ...item, supplierName: agencyName } : item
    );
    setTableData(updatedData);
  };

  const handleRowPlaceChange = (rowIndex, placeName) => {
    const updatedData = tableData.map((item, index) =>
      index === rowIndex ? { ...item, place: placeName } : item
    );
    setTableData(updatedData);
  };

  const handleRowDateChange = (rowIndex, dateTime) => {
    const updatedData = tableData.map((item, index) =>
      index === rowIndex ? { ...item, date_time: dateTime } : item
    );
    setTableData(updatedData);
  };

  const handleTotalPriceChange = (rowIndex, price) => {
    const updatedData = tableData.map((item, index) =>
      index === rowIndex ? { ...item, totalprice: price } : item
    );
    setTableData(updatedData);
  };

  const handleFinalQtyChange = (rowIndex, qty) => {
    const updatedData = tableData.map((item, index) =>
      index === rowIndex ? { ...item, finalQty: qty } : item
    );
    setTableData(updatedData);
  };

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const expanChildData = (eventRawMaterialFunctions, main_index) => {
    if (!eventRawMaterialFunctions || eventRawMaterialFunctions.length === 0) {
      return (
        <div className="text-center py-4 text-gray-500">
          No functions assigned to this raw material
        </div>
      );
    }

    return (
      <>
        <div className="grid grid-cols-[150px_200px_200px_80px_120px_120px_160px_100px] items-center bg-gray-200 font-bold border-b border-gray-300 py-2 mb-3">
          <div>Function Name</div>
          <div>Menu Item Name</div>
          <div>Agency</div>
          <div>Qty</div>
          <div>Unit</div>
          <div>Place</div>
          <div>Date & Time</div>
          <div>Price</div>
        </div>

        {eventRawMaterialFunctions.map((func, index) => (
          <div
            key={`${func.functionId}-${func.eventFunctionId}-${index}`}
            className="grid grid-cols-[150px_200px_200px_80px_120px_120px_160px_100px] border-b"
          >
            <div className="mr-2 mb-2 font-medium text-gray-700">
              {func.functionName}
            </div>
            <div className="mr-2 mb-2 font-medium text-gray-700">
              {func.itemName}
            </div>
            <div className="mr-2 mb-2">
              <select
                className="select"
                value={func.supplierName || ""}
                onChange={(e) =>
                  handleFunctionChange(
                    main_index,
                    index,
                    "supplierName",
                    e.target.value
                  )
                }
              >
                <option value="">Select Agency</option>
                {loading && <option>Loading...</option>}
                {!loading && agencies.length > 0
                  ? agencies.map((agency) => (
                      <option
                        key={agency.id}
                        value={agency.nameEnglish || agency.name}
                      >
                        {agency.nameEnglish || agency.name}
                      </option>
                    ))
                  : !loading && <option>No agencies found</option>}
              </select>
            </div>
            <div className="mr-2 mb-2">
              <input
                type="number"
                className="input"
                value={func.qty || ""}
                onChange={(e) =>
                  handleFunctionChange(main_index, index, "qty", e.target.value)
                }
                placeholder="Qty"
              />
            </div>
            <div className="mr-2 mb-2">
              <select
                className="select"
                value={func.unitName || ""}
                onChange={(e) =>
                  handleFunctionChange(
                    main_index,
                    index,
                    "unitName",
                    e.target.value
                  )
                }
              >
                <option value="Kilogram">Kilogram</option>
                <option value="Gram">Gram</option>
              </select>
            </div>
            <div className="mr-2 mb-2">
              <select
                className="select"
                value={func.place || ""}
                onChange={(e) =>
                  handleFunctionChange(
                    main_index,
                    index,
                    "place",
                    e.target.value
                  )
                }
              >
                <option value="">Select Place</option>
                <option value="At Venue">At Venue</option>
                <option value="Godown">Godown</option>
              </select>
            </div>
            <div className="mr-2 mb-2">
              <input
                type="datetime-local"
                className="input"
                value={func.functiondatetime || ""}
                onChange={(e) =>
                  handleFunctionChange(
                    main_index,
                    index,
                    "functiondatetime",
                    e.target.value
                  )
                }
              />
            </div>
            <div className="mr-2 mb-2">
              <input
                type="number"
                className="input"
                value={func.price || ""}
                onChange={(e) =>
                  handleFunctionChange(
                    main_index,
                    index,
                    "price",
                    e.target.value
                  )
                }
                placeholder="Price"
              />
            </div>
          </div>
        ))}
      </>
    );
  };

  const modalData = () => {
    return (
      <>
        <div className="grid grid-cols-[100px_200px_200px_150px_200px] items-center bg-gray-200 font-bold border-b border-gray-300 py-2 mb-3">
          <div className="ml-2">#</div>
          <div>Raw Material</div>
          <div>Agency</div>
          <div>Place</div>
          <div>Date & Time</div>
        </div>

        {tableData.map((item, index) => (
          <div
            key={index}
            className="grid grid-cols-[100px_200px_200px_150px_200px] border-b"
          >
            <div className="mr-2 ml-2 mb-2">{index + 1}</div>
            <div className="mr-2 mb-2">{item.rawMaterialNameEng}</div>
            <div className="mr-2 mb-2">
              <select
                className="select"
                value={item.supplierName || ""}
                onChange={(e) => handleRowAgencyChange(index, e.target.value)}
              >
                <option value="">Select Agency</option>
                {loading && <option>Loading...</option>}
                {!loading && agencies.length > 0
                  ? agencies.map((agency) => (
                      <option
                        key={agency.id}
                        value={agency.nameEnglish || agency.name}
                      >
                        {agency.nameEnglish || agency.name}
                      </option>
                    ))
                  : !loading && <option>No agencies found</option>}
              </select>
            </div>
            <div className="mr-2 mb-2">
              <select
                className="select"
                value={item.place || ""}
                onChange={(e) => handleRowPlaceChange(index, e.target.value)}
              >
                <option value="">Select Place</option>
                <option value="At Venue">At Venue</option>
                <option value="Godown">Godown</option>
              </select>
            </div>
            <div className="mr-2 mb-2">
              <input
                type="datetime-local"
                className="input"
                value={item.date_time || ""}
                onChange={(e) => handleRowDateChange(index, e.target.value)}
              />
            </div>
          </div>
        ))}
      </>
    );
  };

  return (
    <>
      <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
        <div className="flex flex-wrap items-end gap-2">
          <button
            className="btn btn-primary"
            onClick={handleModalOpen}
            title="Agency, Place & Date Allocation"
          >
            <i className="ki-filled ki-plus"></i> Agency, Place & Date
            Allocation
          </button>
        </div>
      </div>
      <div className={"flex flex-col gap-1 w-full"}>
        {/* Header */}
        <div
          className={
            "flex items-center bg-gray-200 font-bold border-b border-gray-300 py-2"
          }
        >
          <div className="px-2 w-13"></div>
          <div className="px-2 w-10">#</div>
          <div className="px-2 w-40">Raw Material</div>
          <div className="px-2 w-28">Qty</div>
          <div className="px-2 w-28">Final Qty</div>
          <div className="px-2 w-28">Unit</div>
          <div className="px-2 w-40">Agency</div>
          <div className="px-2 w-40">Place</div>
          <div className="px-2 w-35">Price/Unit</div>
          <div className="px-2 w-35">Total Price</div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-4">Loading raw materials...</div>
        )}

        {/* Empty State */}
        {!loading && tableData.length === 0 && (
          <div className="text-center py-4 text-gray-500">
            No raw materials found for this category
          </div>
        )}

        {/* Data Rows */}
        {!loading &&
          tableData.length > 0 &&
          tableData.map((row, index) => (
            <>
              <div
                className={"flex items-center border-b border-gray-300 py-2"}
                key={row.id || index}
              >
                <div
                  className="px-2 w-13 cursor-pointer flex justify-center"
                  onClick={() => toggleExpand(row.id || index)}
                >
                  {expandedRows[row.id || index] ? (
                    <ChevronUp className="w-5 h-5 text-gray-600" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-gray-600" />
                  )}
                </div>
                <div className="px-2 w-10">{index + 1}</div>
                <div className="px-2 w-40">{row.rawMaterialNameEng}</div>
                <div className="px-2 w-28">{row.qty}</div>
                <div className="px-2 w-28">
                  <input
                    type="number"
                    className="input"
                    value={
                      row.finalQty !== undefined && row.finalQty !== null
                        ? row.finalQty
                        : ""
                    }
                    onChange={(e) =>
                      handleFinalQtyChange(index, e.target.value)
                    }
                  />
                </div>
                <div className="px-2 w-40">
                  <select className="select pe-7.5" defaultValue={row.unitId}>
                    <option>Kilogram</option>
                    <option>Gram</option>
                  </select>
                </div>
                <div className="px-2 w-40">
                  {row.supplierName || "Not Assigned"}
                </div>
                <div className="px-2 w-40">{row.place || "Not Assigned"}</div>
                <div className="px-2 w-35">
                  <input
                    type="number"
                    className="input"
                    value={
                      row.totalprice !== undefined && row.totalprice !== null
                        ? row.totalprice
                        : ""
                    }
                    onChange={(e) =>
                      handleTotalPriceChange(index, e.target.value)
                    }
                    placeholder="Price/Unit"
                  />
                </div>
                <div className="px-2 w-35 font-semibold">
                  ₹{calculateRowTotal(row)}
                </div>
              </div>
              {/* Expanded Details - Show Functions */}
              {expandedRows[row.id || index] && (
                <div className="bg-gray-50 text-sm px-4 py-2 mt-4 border-t border-gray-200">
                  {expanChildData(row.eventRawMaterialFunctions, index)}
                </div>
              )}
            </>
          ))}
      </div>
      {/* Total Price and save button*/}
      {!loading && tableData.length > 0 && (
        <div className="flex items-center justify-center gap-5 bg-gray-200 border-b border-gray-300 py-2">
          <div className="font-bold">Total Price: ₹{calculateTotalPrice()}</div>
          <button
            className="btn btn-primary save-btn"
            onClick={handleSave}
            disabled={saving}
            title="Save"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      )}
      <AddGrossary
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        modalData={modalData}
        onAllocateAgency={handleAllocateAgency}
        onAllocatePlace={handleAllocatePlace}
        onAllocateDate={handleAllocateDate}
        agencies={agencies}
        loading={loading}
      />
    </>
  );
};

export default GrossaryItems;
