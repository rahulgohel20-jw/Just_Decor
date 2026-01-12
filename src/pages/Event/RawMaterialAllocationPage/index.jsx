import { Fragment, useState, useEffect, useRef } from "react";
import { Container } from "@/components/container";
import AddGrossary from "@/partials/modals/event/add-grossary/AddGrossary";
import MenuReport from "@/partials/modals/menu-report/MenuReport";
import SelectMenureport from "../../../partials/modals/menu-report/SelectMenureport";
import { useNavigate } from "react-router-dom";
import PlaceSelect from "../../../components/PlaceSelect/PlaceSelect";
import { useParams } from "react-router-dom";
import { GetUnitData } from "@/services/apiServices";
import {
  GetAllRawMaterialAllocationCategory,
  GetAllRawMaterialAllocationItems,
  GetAllSupllierVendors,
  RawMaterialallocation,
  GetEventMasterById,
} from "@/services/apiServices";
import { Spin } from "antd";

import Swal from "sweetalert2";
import SidebarRawMaterial from "./sidebarrawmaterialmodal/SidebarRawMaterial";
import { FormattedMessage, useIntl } from "react-intl";
import dayjs from "dayjs";
import DatePicker from "react-datepicker";

const RawMaterialAllocation = ({ mode }) => {
  let { eventId } = useParams();
  const navigate = useNavigate();
  const [tabs, setTabs] = useState([]);
  const [activeTab, setActiveTab] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState([]);
  const [agencies, setAgencies] = useState([]);
  const [isRawSidebar, setIsRawSidebar] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [menuReportEventId, setMenuReportEventId] = useState(null);
  const [isMenuReport, setIsMenuReport] = useState(false);
  const [isSelectMenureport, setIsSelectMenuReport] = useState(false);
  const [selectedReportType, setSelectedReportType] = useState(null);
  const [unit, setUnit] = useState([]);
  const [eventData, setEventData] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  const intl = useIntl();
  let userId = localStorage.getItem("userId");

  useEffect(() => {
    if (eventId) {
      fetchEventData();
    }
  }, [eventId]);
  useEffect(() => {
    const handler = setTimeout(() => {
      const query = searchTerm.trim().toLowerCase();

      if (!query) {
        setData(originalData);
        return;
      }

      const normalize = (val = "") =>
        val.toString().toLowerCase().replace(/\s+/g, "");

      const filtered = originalData.filter(
        (item) =>
          normalize(item.material).includes(normalize(query)) ||
          normalize(item.agency).includes(normalize(query)) ||
          normalize(item.place).includes(normalize(query))
      );

      setData(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, originalData]);

  const fetchEventData = async () => {
    try {
      const eventData = await GetEventMasterById(eventId);
      const data = eventData.data.data["Event Details"] || [];

      if (data && data.length > 0) {
        const event = eventData.data.data["Event Details"][0];
        setEventData(event);
      } else {
        console.error("error in fetching event data");
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
    }
  };

  const FetchUnit = async () => {
    try {
      const data = await GetUnitData(userId);

      setUnit(data?.data?.data["Unit Details"] || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    FetchUnit();
  }, []);

  const unitSelectOptions = unit.map((u) => ({
    value: u.nameEnglish,
    label: u.nameEnglish,
    unitId: u.id,
  }));

  // ✅ UPDATED: Build unit options from units object first, then fallback to unitHierarchyDto
  const buildUnitOptions = (
    unitsObject,
    unitHierarchyDto,
    currentUnitId,
    currentUnitName
  ) => {
    const options = [];

    // ✅ Priority 1: Use units object if available
    if (unitsObject && unitsObject.id) {
      options.push({
        value: unitsObject.id,
        label: unitsObject.nameEnglish,
      });
    }

    // ✅ Priority 2: Use hierarchy if available
    if (unitHierarchyDto) {
      // Only add if not already added from units object
      if (!options.some((o) => o.value === unitHierarchyDto.unitId)) {
        options.push({
          value: unitHierarchyDto.unitId,
          label: unitHierarchyDto.nameEnglish,
        });
      }

      // Add children
      if (Array.isArray(unitHierarchyDto.children)) {
        unitHierarchyDto.children.forEach((child) => {
          if (!options.some((o) => o.value === child.unitId)) {
            options.push({
              value: child.unitId,
              label: child.nameEnglish,
            });
          }
        });
      }
    }

    // ✅ Fallback if nothing matches current unit
    if (currentUnitId && !options.some((o) => o.value === currentUnitId)) {
      options.unshift({
        value: currentUnitId,
        label: currentUnitName || "Unit",
      });
    }

    return options;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const res = await GetAllRawMaterialAllocationCategory(eventId);
      const categories =
        res?.data?.data?.["Raw Material Category Details"] || [];
      console.log(categories);

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
    fetchAgencies();
  }, []);

  const fetchAgencies = async () => {
    setLoading(true);
    try {
      const response = await GetAllSupllierVendors(userId);
      const list = response?.data?.data?.["Party Details"] || [];
      setAgencies(list);
    } catch (error) {
      console.error("Error fetching agencies:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ UPDATED: Store units object and prioritize it for unit display
  const fetchRawMaterialItems = async (categoryId) => {
    setLoading(true);
    setTableLoading(true);
    try {
      const response = await GetAllRawMaterialAllocationItems(
        eventId,
        categoryId
      );
      const items =
        response?.data?.data?.["Event_RAW_MATERIAL_ALLOCATION"] || [];

      if (Array.isArray(items)) {
        const formatted = items.map((item, index) => {
          const functionDate =
            item.eventRawMaterialFunctions &&
            item.eventRawMaterialFunctions.length > 0
              ? item.eventRawMaterialFunctions[0].functiondatetime
              : null;

          return {
            id: index + 1,
            rawMaterialId: item.rawMaterialId || item.id || 0,
            material: item.rawMaterialNameEng || "N/A",
            qty: item.qty || 0,
            finalQty: item.finalQty || item.qty || 0,
            unitHierarchyDto: item.unitHierarchyDto,
            units: item.units, // ✅ Store the units object
            // ✅ Prioritize units object for display
            unit:
              item.units?.nameEnglish ||
              item.unitHierarchyDto?.nameEnglish ||
              "KILO",
            unitId:
              item.units?.id ||
              item.unitHierarchyDto?.unitId ||
              item.unitId ||
              1,

            agency: item.supplierName || "-",
            supplierId: item.supplierId || 0,
            place: item.place || "NA",
            date:
              functionDate && dayjs(functionDate).isValid()
                ? dayjs(functionDate)
                : null,
            total: item.totalprice || 0,
            eventRawMaterialFunctions: item.eventRawMaterialFunctions || [],
          };
        });

        setData(formatted);
        setOriginalData(formatted);
        setHasUnsavedChanges(false); // Reset unsaved changes flag
      } else {
        setData([]);
      }
    } catch (error) {
      console.error("Error fetching raw material items:", error);
      setData([]);
    } finally {
      setLoading(false);
      setTableLoading(false);
    }
  };

  // ✅ UPDATED: When unit changes, update both unitId and the units object
  const handleChange = (index, field, value) => {
    const updated = [...data];

    if (field === "finalQty") {
      const oldFinalQty = parseFloat(updated[index].finalQty) || 0;
      const newFinalQty = parseFloat(value) || 0;
      const oldQty = parseFloat(updated[index].qty) || 0;
      const difference = newFinalQty - oldFinalQty;

      if (difference > 0) {
        updated[index].extraQty = difference;
        updated[index].needsExtraRow = true;
      } else {
        updated[index].extraQty = 0;
        updated[index].needsExtraRow = false;
      }
    }

    // ✅ Handle unit change - update units object
    if (field === "unitId") {
      const newUnitId = Number(value);
      updated[index].unitId = newUnitId;

      // Find the unit name from available options
      const unitOptions = buildUnitOptions(
        updated[index].units,
        updated[index].unitHierarchyDto,
        updated[index].unitId,
        updated[index].unit
      );

      const selectedUnit = unitOptions.find((u) => u.value === newUnitId);

      if (selectedUnit) {
        // Update the units object with new selection
        updated[index].units = {
          ...updated[index].units,
          id: newUnitId,
          nameEnglish: selectedUnit.label,
        };
        updated[index].unit = selectedUnit.label;
      }
    } else if (field === "date" && value) {
      updated[index][field] = dayjs(value);
    } else {
      updated[index][field] = value;
    }

    setData(updated);
    setHasUnsavedChanges(true);
  };

  const handleAgencyChange = (index, value) => {
    const updated = [...data];
    updated[index].agency = value;
    setData(updated);
    setHasUnsavedChanges(true);
  };

  const autoSave = async (showNotification = false) => {
    try {
      if (!eventId) {
        console.warn("Missing Event ID, skipping auto-save");
        return false;
      }

      if (!data || data.length === 0) {
        console.warn("No data to save, skipping auto-save");
        return false;
      }

      const payload = {
        eventId: parseInt(eventId),
        rawMaterialCategoryId: parseInt(activeTab || 0),
        eventRawMaterial: data.map((item) => {
          const supplierId =
            agencies.find(
              (a) => a.nameEnglish === item.agency || a.name === item.agency
            )?.id ||
            item.supplierId ||
            0;

          const eventRawMatFunctions = (
            item.eventRawMaterialFunctions || []
          ).map((fn) => ({
            eventFunctionId: fn.eventFunctionId || 0,
            functionId: fn.functionId || 0,
            functiondatetime: fn.functiondatetime
              ? dayjs(fn.functiondatetime).isValid()
                ? dayjs(fn.functiondatetime).format("YYYY-MM-DD HH:mm:ss.0")
                : ""
              : item.date && dayjs(item.date).isValid()
                ? dayjs(item.date).format("YYYY-MM-DD HH:mm:ss.0")
                : "",
            isExtraField: fn.isExtraField === true,
            itemName: fn.itemName || item.material || "",
            place: fn.place || item.place || "",
            price: parseFloat(fn.price) || 0,
            qty: parseFloat(fn.qty) || 0,
            supplierId: fn.supplierId || supplierId,
            unitId: fn.unitId || item.unitId || 0,
          }));

          return {
            eventRawMatFunctions: eventRawMatFunctions,
            finalQty: parseFloat(item.finalQty) || 0,
            place: item.place || "",
            qty: parseFloat(item.qty) || 0,
            rawMaterialId: item.rawMaterialId || 0,
            supplierId: supplierId,
            totalprice: parseFloat(item.total) || 0,
            unitId: item.unitId || 0, // ✅ This will now have the updated unit ID
            date:
              item.date && dayjs(item.date).isValid()
                ? dayjs(item.date).format("YYYY-MM-DD HH:mm:ss.0")
                : "",
          };
        }),
      };

      const response = await RawMaterialallocation(payload);

      if (
        response?.data?.success === true ||
        response?.status === 200 ||
        response?.status === 201
      ) {
        setHasUnsavedChanges(false);

        if (showNotification) {
          Swal.fire({
            icon: "success",
            title: "Saved",
            text: "Data saved successfully!",
            timer: 1500,
            showConfirmButton: false,
          });
        }

        return true;
      } else {
        console.error("❌ Auto-save failed:", response);
        return false;
      }
    } catch (error) {
      console.error("❌ Error during auto-save:", error);
      return false;
    }
  };

  const handleDateChange = (index, date) => {
    const updated = [...data];
    updated[index].date = date ? dayjs(date) : null;
    setData(updated);
    setHasUnsavedChanges(true);
  };

  const handleSave = async () => {
    setIsSaving(true); // 🔥 Start loader
    const success = await autoSave(true);

    if (success) {
      const currentTab = tabs.find((tab) => tab.value === activeTab);
      if (currentTab?.categoryId) {
        await fetchRawMaterialItems(currentTab.categoryId);
      }
    } else {
      Swal.fire({
        icon: "error",
        title: "Save Failed",
        text: "Something went wrong while saving.",
      });
    }
    setIsSaving(false); // 🔥 Stop loader
  };

  const handleTabSwitch = async (tab) => {
    // Auto-save current tab data before switching
    if (hasUnsavedChanges && data.length > 0) {
      const success = await autoSave(false);

      if (success) {
      } else {
        console.warn("⚠️ Auto-save failed, but continuing with tab switch");
      }
    }

    // Switch to new tab
    setActiveTab(tab.value);
    fetchRawMaterialItems(tab.categoryId);
  };

  const openMenuReport = () => {
    setIsMenuReport(true);
  };

  function openSelectMenureport() {
    setIsSelectMenuReport(true);
  }

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleAllocateAgency = (agency) => {
    const updated = data.map((item) => ({
      ...item,
      agency: agency,
    }));
    setData(updated);
    setHasUnsavedChanges(true); // 🔥 Mark as changed
  };

  const handleAllocatePlace = (placeName, placeId) => {
    if (!placeName) return;

    const updated = data.map((item) => ({
      ...item,
      place: placeName, // only string
      placeId: Number(placeId) || 0, // for backend
    }));

    setData(updated);
    setOriginalData(updated); // important for search/filter
    setHasUnsavedChanges(true);
  };

  const handleAllocateDate = (date) => {
    if (!date) return;

    const allocatedDate = dayjs(date);

    const updatedData = data.map((item) => ({
      ...item,
      date: allocatedDate,
    }));

    setData(updatedData);
    setOriginalData(updatedData);
    setHasUnsavedChanges(true);
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
      <div className="overflow-x-auto h-[60vh]">
        <div className="inline-block w-full align-middle">
          <div className="overflow-hidden border border-gray-200 rounded-lg shadow-sm">
            <table className="w-full divide-y divide-gray-200 h-[100px] overflow-x-scroll">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr className="">
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ">
                    <FormattedMessage
                      id="SIDEBAR_MODAL.RAW_MATERIAL"
                      defaultMessage="SRNO"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ">
                    <FormattedMessage
                      id="SIDEBAR_MODAL.RAW_MATERIAL"
                      defaultMessage="Raw Material"
                    />
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ">
                    <FormattedMessage
                      id="SIDEBAR_MODAL.AGENCY"
                      defaultMessage="Agency"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ">
                    <FormattedMessage
                      id="SIDEBAR_MODAL.PLACE"
                      defaultMessage="Place"
                    />
                  </th>
                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider ">
                    <FormattedMessage
                      id="SIDEBAR_MODAL.DATE"
                      defaultMessage="Date"
                    />
                  </th>
                </tr>
              </thead>
              {/* ===== TABLE BODY ===== */}
              <tbody>
                {tableLoading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">
                      <Spin />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      No materials found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3">{item.id}</td>
                      <td
                        className="px-4 py-2 text-xs text-gray-700 truncate max-w-[150px]"
                        title={item.material}
                      >
                        {item.material}
                      </td>

                      <td>
                        <select
                          className="select w-[200px]"
                          value={item.agency || ""}
                          onChange={(e) =>
                            handleAgencyChange(index, e.target.value)
                          }
                        >
                          <option value="">Select Agency</option>
                          {agencies.map((agency) => (
                            <option
                              key={agency.id}
                              value={agency.nameEnglish || agency.name}
                            >
                              {agency.nameEnglish || agency.name}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">
                        <PlaceSelect
                          value={item.place || ""}
                          onChange={(value, placeId) => {
                            const updated = [...data];
                            updated[index].place = value;
                            updated[index].placeId = placeId || 0;
                            setData(updated);
                            setHasUnsavedChanges(true);
                          }}
                        />
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <DatePicker
                          selected={
                            item.date ? dayjs(item.date).toDate() : null
                          }
                          onChange={(date) => handleDateChange(index, date)}
                          showTimeSelect
                          timeFormat="hh:mm aa"
                          dateFormat="MM/dd/yyyy hh:mm aa"
                          className="border px-2 py-1 w-[180px]"
                          placeholderText="-"
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  const handleEditRow = (row) => {
    setSelectedRow(row);
    setIsRawSidebar(true);
  };

  // ✅ UPDATED: Handle save from sidebar with quantity calculation
  const handleSaveFromSidebar = (updatedRow) => {
    const updatedData = data.map((item) => {
      if (
        item.id === updatedRow.id ||
        item.rawMaterialId === updatedRow.rawMaterialId
      ) {
        // ✅ If quantity was modified in sidebar, use calculated value
        // Otherwise keep the existing finalQty from backend
        const newFinalQty = updatedRow.qtyWasModified
          ? updatedRow.calculatedFinalQty
          : item.finalQty;

        return {
          ...item,
          ...updatedRow,
          rawMaterialId: item.rawMaterialId,
          id: item.id,
          finalQty: newFinalQty, // ✅ Update finalQty with calculated or original value
        };
      }
      return item;
    });

    setData(updatedData);
    setHasUnsavedChanges(true); // 🔥 Mark as changed

    Swal.fire({
      icon: "success",
      title: "Updated",
      text: updatedRow.qtyWasModified
        ? `Row updated successfully. Final Qty updated to ${updatedRow.calculatedFinalQty}. Changes will be saved when switching tabs or clicking Save.`
        : "Row updated successfully. Changes will be saved when switching tabs or clicking Save.",
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
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-6">
              <h2 className="text-xl text-black font-semibold">
                4. Raw Material Distribution
              </h2>

              {/* ONLY FOR THIS SCREEN */}
              <div className="flex gap-2">
                <button
                  onClick={() => navigate(`/menu-preparation/${eventId}`)}
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                >
                  <i
                    className="ki-filled ki-menu "
                    style={{ color: "white" }}
                  ></i>{" "}
                  2. Menu Planning
                </button>

                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary"
                  onClick={() => navigate(`/menu-allocation/${eventId}`)}
                >
                  <i
                    className="ki-filled ki-gift"
                    style={{ color: "white" }}
                  ></i>{" "}
                  3. Menu Execution
                </button>

                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary "
                  onClick={() =>
                    navigate(`/labour-and-other-management/${eventId}`)
                  }
                >
                  <i
                    className="ki-filled ki-gift hover:!text-gray-400"
                    style={{ color: "white" }}
                  ></i>{" "}
                  5. Agency Distribution
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="card bg-white mb-3">
          <div className="flex flex-wrap items-center justify-between p-4 gap-6">
            <div className="flex flex-wrap items-center justify-between gap-24">
              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <FormattedMessage
                      id="COMMON.EVENT_ID"
                      defaultMessage="Event ID:"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {eventData?.eventNo}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-user text-success"></i>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <FormattedMessage
                      id="COMMON.PARTY_NAME"
                      defaultMessage="Party Name:"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {eventData?.party?.nameEnglish}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-geolocation-home text-success"></i>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <FormattedMessage
                      id="COMMON.EVENT_NAME"
                      defaultMessage="Event Name:"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {eventData?.eventType?.nameEnglish}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <FormattedMessage
                      id="RAW_MATERIAL_ALLOCATION.EVENT_VENUE"
                      defaultMessage="Event Venue"
                    />{" "}
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {eventData?.venue?.nameEnglish}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <i className="ki-filled ki-calendar-tick text-success"></i>
                <div className="flex flex-col">
                  <span className="text-sm">
                    <FormattedMessage
                      id="RAW_MATERIAL_ALLOCATION.EVENT_DATE_TIME"
                      defaultMessage="Event Date & Time:"
                    />
                  </span>
                  <span className="text-sm font-medium text-gray-900">
                    {eventData?.eventStartDateTime}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-row items-end gap-2">
              <button
                onClick={openSelectMenureport}
                className="bg-[#05B723] text-white text-sm px-5 py-2 rounded-md transition"
                title="Report"
              >
                Report
              </button>
              <button
                onClick={handleSave}
                disabled={!hasUnsavedChanges || isSaving} // 🔥 Add isSaving
                className={`text-sm px-5 py-2 rounded-md transition flex items-center gap-2
    ${
      hasUnsavedChanges && !isSaving
        ? "bg-primary text-white"
        : "bg-gray-300 text-gray-500 cursor-not-allowed"
    }`}
                title={hasUnsavedChanges ? "Save" : "No changes to save"}
              >
                {isSaving ? (
                  <>
                    <i className="ki-filled ki-loading animate-spin"></i>
                    <FormattedMessage
                      id="COMMON.SAVING"
                      defaultMessage="Saving..."
                    />
                  </>
                ) : (
                  <FormattedMessage id="COMMON.SAVE" defaultMessage="Save" />
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap mb-3 border-gray-200 gap-1 rounded-lg">
          {tabs.length === 0 ? (
            <p className="text-gray-500 text-sm px-3">
              <FormattedMessage
                id="RAW_MATERIAL_ALLOCATION.NO_CATEGORY_FOUND"
                defaultMessage="No categories found"
              />
            </p>
          ) : (
            tabs.map((tab) => (
              <button
                key={tab.value}
                onClick={() => handleTabSwitch(tab)}
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
                placeholder={intl.formatMessage({
                  id: "COMMON.SEARCH",
                  defaultMessage: "Search...",
                })}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <button
            className="bg-primary text-white text-sm px-4 py-2 rounded-lg"
            onClick={handleModalOpen}
          >
            <FormattedMessage
              id="RAW_MATERIAL_ALLOCATION.ADD_AGENCY_PLACE_DATE"
              defaultMessage="+ Supplier Allocation"
            />
          </button>
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200">
          <div className="max-h-[380px] overflow-y-auto scrollbar-hide">
            <table className="min-w-full table-fixed text-sm text-gray-700">
              {/* ===== TABLE HEADER ===== */}
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-10">
                <tr>
                  <th className="w-12 px-4 py-3 text-left">ID</th>
                  <th className="w-20 px-4 py-3 text-left">Raw Material</th>
                  <th className="w-20 px-4 py-3 text-left">Qty</th>
                  <th className="w-30 px-4 py-3 text-left">Final Qty</th>
                  <th className="w-28 px-4 py-3 text-left">Unit</th>
                  <th className="w-32 px-4 py-3 text-left">Agency</th>
                  <th className="w-24 px-4 py-3 text-left">Place</th>
                  <th className="w-44 px-4 py-3 text-left">Date</th>
                  <th className="w-28 px-4 py-3 text-left">Total</th>
                  <th className="w-16 px-4 py-3 text-center">Action</th>
                </tr>
              </thead>

              {/* ===== TABLE BODY ===== */}
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="10" className="text-center py-8">
                      <Spin />
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan="10" className="text-center py-6 text-gray-500">
                      No materials found
                    </td>
                  </tr>
                ) : (
                  data.map((item, index) => (
                    <tr key={index} className="border-b border-gray-200">
                      <td className="px-4 py-3">{item.id}</td>
                      <td
                        className="px-4 py-2 text-xs text-gray-700 truncate max-w-[150px]"
                        title={item.material}
                      >
                        {item.material}
                      </td>
                      <td className="px-4 py-3">{item.qty}</td>

                      <td className="px-4 py-3">
                        <input
                          type="text"
                          value={item.finalQty}
                          onChange={(e) =>
                            handleChange(index, "finalQty", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>

                      <td className="px-4 py-3">
                        <select
                          value={item.unitId}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "unitId",
                              Number(e.target.value)
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          {buildUnitOptions(
                            item.units,
                            item.unitHierarchyDto,
                            item.unitId,
                            item.unit
                          ).map((u) => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      <td className="px-4 py-3">{item.agency}</td>
                      <td className="px-4 py-3">{item.place}</td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.date
                          ? dayjs(item.date).format("DD/MM/YYYY hh:mm A")
                          : "-"}
                      </td>
                      <td className="px-4 py-3">{item.total}</td>

                      <td className="px-4 py-3 text-center">
                        <i
                          className="ki-filled ki-notepad-edit text-primary cursor-pointer"
                          onClick={() => handleEditRow(item)}
                        ></i>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* ===== FOOTER ===== */}
          <div className="flex justify-between items-center px-4 py-4 border-t bg-gray-50">
            <div className="text-sm font-medium">
              Total Price:{" "}
              <span className="font-semibold text-blue-700">
                {totalPrice.toFixed(2)}
              </span>
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving}
              className="bg-primary text-white px-6 py-2 rounded-md disabled:opacity-50"
            >
              {isSaving ? "Saving..." : "Save"}
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
          FetchSuplier={fetchAgencies}
        />

        <SidebarRawMaterial
          open={isRawSidebar}
          onClose={() => setIsRawSidebar(false)}
          selectedRow={selectedRow}
          onSave={handleSaveFromSidebar}
          sidebarunit={unit}
        />
        <MenuReport
          isModalOpen={isMenuReport}
          setIsModalOpen={setIsMenuReport}
          eventId={eventId}
        />
        <SelectMenureport
          isSelectMenureport={isSelectMenureport}
          setIsSelectMenuReport={setIsSelectMenuReport}
          eventId={eventId}
          onConfirm={(reportType) => {
            setIsSelectMenuReport(false);
            setSelectedReportType(reportType);
            setMenuReportEventId(eventId); // 🔥 ADD THIS LINE
            setIsMenuReport(true);
          }}
          mode={mode}
        />
      </Container>
      {isSaving && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className=" rounded-lg p-8  flex flex-col items-center gap-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
            </div>
            <div className="text-center">
              <p className="text-lg font-semibold text-white">
                <FormattedMessage
                  id="COMMON.SAVING"
                  defaultMessage="Saving..."
                />
              </p>
              <p className="text-sm text-gray-500">
                <FormattedMessage
                  id="COMMON.PLEASE_WAIT"
                  defaultMessage="Please wait"
                />
              </p>
            </div>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default RawMaterialAllocation;
