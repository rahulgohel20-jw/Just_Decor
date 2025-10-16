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
      console.log(items);

      if (Array.isArray(items)) {
        const formatted = items.map((item) => ({
          id: 1,
          material: item.rawMaterialNameEng || "N/A",
          qty: item.qty || 0,
          finalQty: item.final_qty || item.qty || 0,
          unit: item.unit || "Kilogram",
          agency: item.supplierName || "-",
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
      const storedUser = JSON.parse(localStorage.getItem("userData"));
      const userId = storedUser?.id;

      const payload = {
        eventId: eventId,
        eventRawMaterial: data.map((item) => ({
          finalQty: Number(item.finalQty),
          place: item.place,
          qty: Number(item.qty),
          rawMaterialId: item.rawMaterialId || 0,
          supplierId:
            agencies.find(
              (a) => a.nameEnglish === item.agency || a.name === item.agency
            )?.id || 0,
          totalprice: item.total,
          unitId: unitOptions.findIndex((u) => u === item.unit),
          eventRawMatFunctions:
            item.eventRawMaterialFunctions?.map((fn) => ({
              eventFunctionId: fn.eventFunctionId || 0,
              functionId: fn.functionId || 0,
              functiondatetime: fn.functiondatetime || "",
              itemName: fn.itemName || item.material || "",
              place: item.place,
              price: Number(fn.price || 0),
              qty: Number(fn.qty || 0),
              supplierId:
                agencies.find(
                  (a) => a.nameEnglish === item.agency || a.name === item.agency
                )?.id || 0,
              unitId: unitOptions.findIndex((u) => u === item.unit),
            })) || [],
        })),
      };

      const response = await RawMaterialallocation(payload);

      if (response?.data?.success) {
        Swal.fire({
          icon: "success",
          title: "Saved",
          text: "Raw Material Allocation saved successfully!",
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Save Failed",
          text: response?.data?.message || "Something went wrong.",
        });
      }
    } catch (error) {
      console.error("Error saving allocation:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while saving data.",
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
              <th className="px-4 py-3 text-left">Raw Material</th>
              <th className="px-4 py-3 text-left">Agency</th>
              <th className="px-4 py-3 text-left">Place</th>
              <th className="px-4 py-3 text-left">Date & Time</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No materials found
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
    // Find and update the specific row in data
    const updatedData = data.map((item) =>
      item.id === updatedRow.id ? updatedRow : item
    );
    setData(updatedData);
    console.log("Updated data from sidebar:", updatedRow);
  };
  const totalPrice = data.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0
  );

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "Raw Material Allocation" }]} />
        </div>

        <div className="card bg-white mb-3">
          <div className="flex flex-wrap items-center justify-between p-4 gap-6">
            <div className="flex flex-wrap items-center justify-between gap-24">
              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs">Event ID:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Ev001
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-user text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs">Party Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Vivek
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-geolocation-home text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs">Event Name:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Wedding
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs">Event Venue:</span>
                  <span className="text-sm font-medium text-gray-900">
                    Ahmedabad
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-xs">Event Date & Time:</span>
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
                Save
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-3 border-gray-200 gap-1 rounded-lg">
          {tabs.length === 0 ? (
            <p className="text-gray-500 text-sm px-3">No categories found</p>
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
                placeholder="Search item"
                type="text"
              />
            </div>
          </div>
          <button
            className="bg-primary text-white text-sm px-4 py-2 rounded-lg"
            onClick={handleModalOpen}
          >
            + Agency, Place & Date Allocation
          </button>
        </div>

        <div className="overflow-x-auto bg-white rounded-xl shadow border border-gray-200">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold">
              <tr>
                {[
                  "ID",
                  "Raw Material",
                  "Qty",
                  "Final Qty",
                  "Unit",
                  "Agency",
                  "Place",
                  "Total Price",
                  "Action",
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
                    Loading...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan="9" className="text-center py-4 text-gray-500">
                    No materials found
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
              Total Price:{" "}
              <span className="font-semibold text-blue-700">
                {totalPrice.toFixed(2)}
              </span>
            </div>
            <button
              onClick={handleSave}
              className="bg-primary text-white text-sm px-6 py-2 rounded-md transition"
            >
              Save
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
