import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import AddGrossary from "@/partials/modals/event/add-grossary/AddGrossary";
import {
  GetAllRawMaterialAllocationCategory,
  GetAllRawMaterialAllocationItems,
  GetAllSupllierVendors,
  RawMaterialallocation,
} from "@/services/apiServices";
import { useLocation } from "react-router-dom";
import { Select, DatePicker } from "antd";
import dayjs from "dayjs";
import Swal from "sweetalert2";
import SidebarRawMaterial from "./sidebarrawmaterialmodal/SidebarRawMaterial";
import { FormattedMessage, useIntl } from "react-intl";


const RawMaterialAllocation = () => {
  const location = useLocation();
  const { eventId, eventTypeId } = location.state || {};
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const unitOptions = ["Kilogram", "Gram", "Litre", "NOS"];
  const [isRawSidebar, setIsRawSidebar] = useState();
  const [selectedRow, setSelectedRow] = useState(null);

  const intl = useIntl(); 

  useEffect(() => {
    if (eventTypeId) {
      fetchCategories();
    }
  }, [eventTypeId]);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await GetAllRawMaterialAllocationCategory(eventId);
      const categories =
        res?.data?.data?.["Raw Material Category Details"] || [];

      if (!Array.isArray(categories) || categories.length === 0) {
        console.warn("No categories found");
        setTabs([]);
        return;
      }

      const dynamicTabs = categories.map((category) => ({
        value: category.id?.toString(),
        label: category.nameEnglish || category.name || "Unnamed Category",
        categoryId: category.id,
      }));

      setTabs(dynamicTabs);
      setActiveTab(dynamicTabs[0]?.value);

      if (dynamicTabs[0]?.categoryId) {
        fetchRawMaterialItems(dynamicTabs[0].categoryId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setTabs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchAgencies = async () => {
      setLoading(true);
      try {
        const storedUser = JSON.parse(localStorage.getItem("userData"));
        const userId = storedUser?.id;
        const response = await GetAllSupllierVendors(userId);
        const list = response?.data?.data?.["Party Details"] || [];
        setAgencies(list);
      } catch (error) {
        console.error("Error fetching agencies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAgencies();
  }, []);

  const fetchRawMaterialItems = async (categoryId) => {
  setLoading(true);
  try {
    const response = await GetAllRawMaterialAllocationItems(
      categoryId,
      eventId
    );
    const items =
      response?.data?.data?.["Event_RAW_MATERIAL_ALLOCATION"] || [];
    console.log("Fetched items:", items);

    if (Array.isArray(items)) {
      const formatted = items.map((item, index) => ({
        // ✅ FIX: Add proper IDs
        id: item.id || index + 1,
        rawMaterialId: item.rawMaterialId || item.id || 0,
        material: item.rawMaterialNameEng || "N/A",
        qty: item.qty || 0,
        finalQty: item.finalQty || item.final_qty || item.qty || 0,
        unit: item.unitName || item.unit || "Kilogram",
        unitId: item.unitId || 1,
        agency: item.supplierName || "-",
        supplierId: item.supplierId || 0,
        place: item.place || "NA",
        date: item.date || "",
        total: item.totalprice || 0,
        eventRawMaterialFunctions: item.eventRawMaterialFunctions || [],
      }));
      setData(formatted);
    } else {
      setData([]);
    }
  } catch (error) {
    console.error("Error fetching raw material items:", error);
    setData([]);
  } finally {
    setLoading(false);
  }
};

  const handleChange = (index, field, value) => {
    const updated = [...data];
    updated[index][field] = value;
    setData(updated);
  };

  const handleSave = async () => {
  try {
    if (!eventId) {
      Swal.fire({
        icon: "error",
        title: "Missing Event ID",
        text: "Event ID is required.",
      });
      return;
    }

    if (!data || data.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Data",
        text: "There are no raw materials to save.",
      });
      return;
    }

    const payload = {
      eventId: parseInt(eventId),
      eventRawMaterial: data.map((item) => {
        // Find supplier ID
        const supplierId = agencies.find(
          (a) => a.nameEnglish === item.agency || a.name === item.agency
        )?.id || item.supplierId || 0;

        // Map functions
        const eventRawMatFunctions = (item.eventRawMaterialFunctions || []).map((fn) => ({
          eventFunctionId: fn.eventFunctionId || 0,
          functionId: fn.functionId || 0,
          functiondatetime: fn.functiondatetime || "",
          itemName: fn.itemName || item.material || "",
          place: fn.place || item.place || "",
          price: parseFloat(fn.price) || 0,
          qty: parseFloat(fn.qty) || 0,
          supplierId: fn.supplierId || supplierId,
          unitId: fn.unitId || item.unitId || 1,
        }));

        return {
          eventRawMatFunctions: eventRawMatFunctions,
          finalQty: parseFloat(item.finalQty) || 0,
          place: item.place || "",
          qty: parseFloat(item.qty) || 0,
          rawMaterialId: item.rawMaterialId || 0,
          supplierId: supplierId,
          totalprice: parseFloat(item.total) || 0,
          unitId: item.unitId || 1,
        };
      }),
    };

    console.log("=== SAVE PAYLOAD ===");
    console.log(JSON.stringify(payload, null, 2));
    console.log("===================");

    const response = await RawMaterialallocation(payload);

    console.log("=== API RESPONSE ===");
    console.log(response);
    console.log("===================");

    if (response?.data?.success || response?.status === 200 || response?.status === 201) {
      await Swal.fire({
        icon: "success",
        title: "Saved",
        text: "Raw Material Allocation saved successfully!",
      });
      
      // Refresh data
      const currentTab = tabs.find(tab => tab.value === activeTab);
      if (currentTab?.categoryId) {
        await fetchRawMaterialItems(currentTab.categoryId);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: response?.data?.message || "Something went wrong.",
      });
    }
  } catch (error) {
    console.error("=== ERROR SAVING ===");
    console.error(error);
    console.error("===================");
    
    Swal.fire({
      icon: "error",
      title: "Error",
      text: error?.response?.data?.message || 
            error?.message || 
            "An error occurred while saving data.",
    });
  }
};

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleAllocateAgency = (agency) => {
    const updated = data.map((item) => ({
      ...item,
      agency: agency,
    }));
    setData(updated);
  };

  const handleAllocatePlace = (place) => {
    const updated = data.map((item) => ({
      ...item,
      place: place,
    }));
    setData(updated);
  };

  const handleAllocateDate = (date) => {
    if (!date) return;
    const formatted = dayjs(date).format("MM/DD/YYYY hh:mm A");
    const updated = data.map((item) => ({
      ...item,
      date: formatted,
    }));
    setData(updated);
  };

  const renderModalData = () => {
    const agencyOptions = agencies.map((agency) => ({
      value: agency.nameEnglish || agency.name,
      label: agency.nameEnglish || agency.name,
    }));

    const placeOptions = [
      { value: "At Venue", label: "At venue" },
      { value: "Godown", label: "GoDown" },
    ];

    return (
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700">
          <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
            <tr>
              <th className="px-4 py-3 text-left"><FormattedMessage id="SIDEBAR_MODAL.RAW_MATERIAL" defaultMessage="Raw Material" /></th>
              <th className="px-4 py-3 text-left">
                <FormattedMessage id="SIDEBAR_MODAL.AGENCY" defaultMessage="Agency" />
              </th>
              <th className="px-4 py-3 text-left">
                <FormattedMessage id="SIDEBAR_MODAL.PLACE" defaultMessage="Place" />
              </th>
              <th className="px-4 py-3 text-left">
                <FormattedMessage id="SIDEBAR_MODAL.DATE" defaultMessage="Date & Time" />
              </th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  <FormattedMessage id="COMMON.NO_DATA" defaultMessage="No materials found" />
                </td>
              </tr>
            ) : (
              data.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="px-4 py-3">{item.material}</td>
                  <td className="px-4 py-3">
                    <Select
                      size="small"
                      className="w-full"
                      value={item.agency}
                      options={agencyOptions}
                      onChange={(value) => handleChange(index, "agency", value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <Select
                      size="small"
                      className="w-full"
                      value={item.place}
                      options={placeOptions}
                      onChange={(value) => handleChange(index, "place", value)}
                    />
                  </td>
                  <td className="px-4 py-3">
                    <DatePicker
                      className="input input-sm"
                      showTime
                      format="MM/DD/YYYY hh:mm A"
                      value={
                        item.date && dayjs(item.date).isValid()
                          ? dayjs(item.date)
                          : null
                      }
                      onChange={(date) => handleChange(index, "date", date)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    );
  };
  const handleEditRow = (row) => {
    setSelectedRow(row);
    setIsRawSidebar(true);
  };
  const handleSaveFromSidebar = (updatedRow) => {
  console.log("Saving from sidebar:", updatedRow);
  
  // Update the data array with the modified row
  const updatedData = data.map((item) => {
    if (item.id === updatedRow.id || item.rawMaterialId === updatedRow.rawMaterialId) {
      return {
        ...item,
        ...updatedRow,
        // Ensure these fields are preserved
        rawMaterialId: item.rawMaterialId,
        id: item.id,
      };
    }
    return item;
  });
  
  setData(updatedData);
  
  // Show confirmation
  Swal.fire({
    icon: "success",
    title: "Updated",
    text: "Row updated successfully. Don't forget to click the main Save button!",
    timer: 2000,
    showConfirmButton: false,
  });
};
  const totalPrice = data.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: <FormattedMessage id="SIDEBAR_MODAL.RAW_MATERIAL_ALLOCATION" defaultMessage="Raw Material Allocation" /> }]} />
        </div>

        <div className="card bg-white mb-3">
          <div className="flex flex-wrap items-center justify-between p-4 gap-6">
            <div className="flex flex-wrap items-center justify-between gap-24">
              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs"><FormattedMessage id="COMMON.EVENT_ID" defaultMessage="Event ID:" /></span>
                  <span className="text-sm font-medium text-gray-900">
                    Ev001
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-user text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs"><FormattedMessage id="COMMON.PARTY_NAME" defaultMessage="Party Name:" /></span>
                  <span className="text-sm font-medium text-gray-900">
                    Vivek
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-geolocation-home text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs"><FormattedMessage id="COMMON.EVENT_NAME" defaultMessage="Event Name:" /></span>
                  <span className="text-sm font-medium text-gray-900">
                    Wedding
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs"><FormattedMessage id="RAW_MATERIAL_ALLOCATION.EVENT_VENUE" defaultMessage="Event Venue" /> </span>
                  <span className="text-sm font-medium text-gray-900">
                    Ahmedabad
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs"><FormattedMessage id="RAW_MATERIAL_ALLOCATION.EVENT_DATE_TIME" defaultMessage="Event Date & Time:" /></span>
                  <span className="text-sm font-medium text-gray-900">
                    10/10/2025 10:00AM
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button
                className="bg-primary text-white text-sm px-5 py-2 rounded-md transition"
                title="Save"
              >
                <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-3 border-gray-200 gap-1 rounded-lg">
          {tabs.length === 0 ? (
            <p className="text-gray-500 text-sm px-3"><FormattedMessage id="RAW_MATERIAL_ALLOCATION.NO_CATEGORY_FOUND" defaultMessage="No categories found" /></p>
          ) : (
            tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => {
                  setActiveTab(tab.value);
                  fetchRawMaterialItems(tab.categoryId);
                }}
                className={`px-4 py-2 text-sm font-medium border border-gray-200 ${
                  activeTab === tab.value
                    ? "bg-primary text-white"
                    : "bg-gray-50 text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))
          )}
        </div>

        <div className="flex justify-between mb-4">
          <div className="flex w-fit items-center gap-3">
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({ id: "COMMON.SEARCH", defaultMessage: "Search..." })}
                type="text"
              />
            </div>
          </div>
          <button
            className="bg-primary text-white text-sm px-4 py-2 rounded-lg"
            onClick={handleModalOpen}
          >
            <FormattedMessage id="RAW_MATERIAL_ALLOCATION.ADD_AGENCY_PLACE_DATE" defaultMessage="+ Agency, Place & Date Allocation" />
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                {[
                  <FormattedMessage id="RAW_MATERIAL_ALLOCATION.ID" defaultMessage="ID" />,
                  <FormattedMessage id="COMMON.RAW_MATERIAL" defaultMessage="Raw Material" />,
                  <FormattedMessage id="COMMON.QTY" defaultMessage="Qty" />,
                  <FormattedMessage id="COMMON.FINAL_QTY" defaultMessage="Final Qty" />,
                  <FormattedMessage id="COMMON.UNIT" defaultMessage="Unit" />,
                  <FormattedMessage id="COMMON.AGENCY" defaultMessage="Agency" />,
                  <FormattedMessage id="COMMON.PLACE" defaultMessage="Place" />,
                  <FormattedMessage id="COMMON.TOTAL_PRICE" defaultMessage="Total Price" />,
                  <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
                ].map((head, i) => (
                  <th key={i} className="px-4 py-3 text-left whitespace-nowrap">
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="9" className="text-center py-4">
                    <FormattedMessage id="SIDEBAR_MODAL.LOADING" defaultMessage="Loading..." />
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    <FormattedMessage id="COMMON.NO_MATERIAL_FOUND" defaultMessage="No materials found" />
                  </td>
                </tr>
              ) : (
                data.map((item, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3">{item.id}</td>
                    <td className="px-4 py-3">{item.material}</td>
                    <td className="px-4 py-3">{item.qty}</td>

                    <td className="px-4 py-3">
                      <input
                        type="text"
                        value={item.finalQty}
                        onChange={(e) =>
                          handleChange(index, "finalQty", e.target.value)
                        }
                        className="w-24 border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-100"
                      />
                    </td>

                    <td className="px-4 py-3">
                      <select
                        value={item.unit}
                        onChange={(e) =>
                          handleChange(index, "unit", e.target.value)
                        }
                        className="border border-gray-300 rounded px-2 py-1 text-sm focus:ring focus:ring-blue-100"
                      >
                        {unitOptions.map((unit) => (
                          <option key={unit}>{unit}</option>
                        ))}
                      </select>
                    </td>

                    <td className="px-4 py-3">{item.agency}</td>
                    <td className="px-4 py-3">{item.place}</td>
                    <td className="px-4 py-3 ">{item.total}</td>
                    <td className="px-4 py-3 flex justify-center">
                      <span
                        className="text-black cursor-pointer text-lg"
                        onClick={() => handleEditRow(item)}
                        title="Edit Raw Material"
                      >
                        <i className="ki-filled ki-notepad-edit text-primary"></i>
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>

          <div className="flex flex-col sm:flex-row justify-between items-center gap-3 px-4 py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-sm font-medium text-gray-800">
              <FormattedMessage id="COMMON.TOTAL_PRICE" defaultMessage="Total Price" />{" "}
              <span className="font-semibold text-blue-700">
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary text-white text-sm px-6 py-2 rounded-md transition"
            >
              <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
            </button>
          </div>
        </div>

        <AddGrossary
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          agencies={agencies}
          loading={loading}
          modalData={renderModalData}
          onAllocateAgency={handleAllocateAgency}
          onAllocatePlace={handleAllocatePlace}
          onAllocateDate={handleAllocateDate}
        />

        <SidebarRawMaterial
          open={isRawSidebar}
          onClose={() => setIsRawSidebar(false)}
          selectedRow={selectedRow}
          onSave={handleSaveFromSidebar}
        />
      </Container>
    </Fragment>
  );
};

export default RawMaterialAllocation;
