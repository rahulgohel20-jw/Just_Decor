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
import AddRawMaterial from "./AddRawMaterial";
import AllCustomerToogle from "@/components/modal/AllCustomerToggle";

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
  const [selectedRows, setSelectedRows] = useState([]);
  const [newRowCounter, setNewRowCounter] = useState(0);

  const [isAddMaterialModal, setIsAddMaterialModal] = useState(false);
  const [eventFunctions, setEventFunctions] = useState([]);
  const [isAllCustomerToogleOpen, setIsAllCustomerToogleOpen] = useState(false);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [isNavigating, setIsNavigating] = useState(false);
  
  // ✅ Use ref to track the previous eventId
  const prevEventIdRef = useRef(null);
  // ✅ Track if initial load is complete
  const isInitialLoadRef = useRef(true);

  const intl = useIntl();
  let userId = localStorage.getItem("userId");

  // ✅ REFACTORED: Fetch event data
  const fetchEventData = async () => {
    if (!eventId) return;
    
    try {
      const eventData = await GetEventMasterById(eventId);
      const data = eventData.data.data["Event Details"] || [];

      if (data && data.length > 0) {
        const event = eventData.data.data["Event Details"][0];
        setEventData(event);
      } else {
        console.error("error in fetching event data");
        setEventData([]);
      }
    } catch (error) {
      console.error("Error fetching event data:", error);
      setEventData([]);
    }
  };

  // ✅ REFACTORED: Fetch event functions
  const fetchEventFunctions = async () => {
    if (!eventId) return;
    
    try {
      const response = await GetEventMasterById(eventId);
      const eventDetails = response?.data?.data?.["Event Details"];

      if (eventDetails && eventDetails.length > 0) {
        const functions = eventDetails[0].eventFunctions || [];

        // Transform the data to match the modal's expected format
        const transformedFunctions = functions.map((fn) => ({
          eventFunctionId: fn.id,
          functionId: fn.function.id,
          functionName: fn.function.nameEnglish,
          functiondatetime: fn.functionStartDateTime,
          pax: fn.pax,
          venue: fn.function_venue,
        }));

        setEventFunctions(transformedFunctions);
      } else {
        setEventFunctions([]);
      }
    } catch (error) {
      console.error("Error fetching event functions:", error);
      setEventFunctions([]);
    }
  };

  // ✅ REFACTORED: Fetch categories
  const fetchCategories = async () => {
    if (!eventId) return;
    
    setLoading(true);
    try {
      const res = await GetAllRawMaterialAllocationCategory(eventId);
      const categories =
        res?.data?.data?.["Raw Material Category Details"] || [];

      if (!Array.isArray(categories) || categories.length === 0) {
        console.warn("No categories found");
        setTabs([]);
        setActiveTab(null);
        setData([]);
        setOriginalData([]);
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
        await fetchRawMaterialItems(dynamicTabs[0].categoryId);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setTabs([]);
      setActiveTab(null);
      setData([]);
      setOriginalData([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ REFACTORED: Fetch agencies (only once)
  const fetchAgencies = async () => {
    try {
      const response = await GetAllSupllierVendors(userId);
      const list = response?.data?.data?.["Party Details"] || [];
      setAgencies(list);
    } catch (error) {
      console.error("Error fetching agencies:", error);
      setAgencies([]);
    }
  };

  // ✅ REFACTORED: Fetch units (only once)
  const FetchUnit = async () => {
    try {
      const data = await GetUnitData(userId);
      setUnit(data?.data?.data["Unit Details"] || []);
    } catch (error) {
      console.log(error);
      setUnit([]);
    }
  };

  // ✅ REFACTORED: Main effect for eventId changes
  useEffect(() => {
    const loadEventData = async () => {
      // Skip if no eventId
      if (!eventId) return;

      // Check if this is a new eventId
      const hasEventIdChanged = prevEventIdRef.current !== eventId;
      
      if (hasEventIdChanged || isInitialLoadRef.current) {
        console.log("🔄 Event ID changed or initial load:", eventId);
        
        // Reset state for new event
        setData([]);
        setOriginalData([]);
        setTabs([]);
        setActiveTab(null);
        setHasUnsavedChanges(false);
        setSearchTerm("");
        setSelectedRows([]);
        setIsNavigating(false);
        
        // Fetch all event-specific data
        await Promise.all([
          fetchEventData(),
          fetchEventFunctions(),
          fetchCategories(),
        ]);

        // Update refs
        prevEventIdRef.current = eventId;
        isInitialLoadRef.current = false;
      }
    };

    loadEventData();
  }, [eventId]);

  // ✅ Fetch agencies and units only once on mount
  useEffect(() => {
    fetchAgencies();
    FetchUnit();
  }, []);

  // ✅ Search filter effect (unchanged)
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
          normalize(item.place).includes(normalize(query)),
      );

      setData(filtered);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchTerm, originalData]);

  const handleAddNewRow = () => {
    setIsAddMaterialModal(true);
  };

  const handleSaveNewMaterial = (newRowData) => {
    setData([...data, { ...newRowData, id: data.length + 1 }]);
    setHasUnsavedChanges(true);
  };

  const handleDeleteRow = (index) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You want to delete this row?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updated = data.filter((_, i) => i !== index);
        // Reorder IDs
        const reordered = updated.map((item, idx) => ({
          ...item,
          id: idx + 1,
        }));
        setData(reordered);
        setHasUnsavedChanges(true);
        Swal.fire("Deleted!", "Row has been deleted.", "success");
      }
    });
  };

  const toggleRowSelection = (rawMaterialId) => {
    setSelectedRows((prev) =>
      prev.includes(rawMaterialId)
        ? prev.filter((id) => id !== rawMaterialId)
        : [...prev, rawMaterialId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedRows.length === data.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(data.map((item) => item.rawMaterialId));
    }
  };

  const unitSelectOptions = unit.map((u) => ({
    value: u.nameEnglish,
    label: u.nameEnglish,
    unitId: u.id,
  }));

  const buildUnitOptions = (
    unitsObject,
    unitHierarchyDto,
    currentUnitId,
    currentUnitName,
  ) => {
    const options = [];

    if (unitsObject && unitsObject.id) {
      options.push({
        value: unitsObject.id,
        label: unitsObject.nameEnglish,
      });
    }

    if (unitHierarchyDto) {
      if (!options.some((o) => o.value === unitHierarchyDto.unitId)) {
        options.push({
          value: unitHierarchyDto.unitId,
          label: unitHierarchyDto.nameEnglish,
        });
      }

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

    if (currentUnitId && !options.some((o) => o.value === currentUnitId)) {
      options.unshift({
        value: currentUnitId,
        label: currentUnitName || "Unit",
      });
    }

    return options;
  };

  const fetchRawMaterialItems = async (categoryId) => {
    if (!eventId || !categoryId) return;
    
    setTableLoading(true);
    try {
      const response = await GetAllRawMaterialAllocationItems(
        eventId,
        categoryId,
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

          const originalQty = item.qty || 0;
          const originalTotal = item.totalprice || 0;
          const originalPricePerUnit =
            originalQty > 0 ? originalTotal / originalQty : 0;

          const originalFinalQty = item.finalQty || item.qty || 0;

          const basePricePerUnit =
            originalFinalQty > 0 ? originalTotal / originalFinalQty : 0;

          return {
            id: index + 1,
            rawMaterialId: item.rawMaterialId || item.id || 0,
            material: item.rawMaterialNameEng || item.extraItemName || "N/A",
            qty: item.qty || 0,
            finalQty: originalFinalQty,
            total: originalTotal,
            basePricePerUnit,
            unitHierarchyDto: item.unitHierarchyDto,
            units: item.units,

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

            originalPricePerUnit: originalPricePerUnit,
            eventRawMaterialFunctions: item.eventRawMaterialFunctions || [],
          };
        });

        setData(formatted);
        setOriginalData(formatted);
        setHasUnsavedChanges(false);
      } else {
        setData([]);
        setOriginalData([]);
      }
    } catch (error) {
      console.error("Error fetching raw material items:", error);
      setData([]);
      setOriginalData([]);
    } finally {
      setTableLoading(false);
    }
  };

  const getEquivalentValue = (fromUnitId, toUnitId, unitHierarchyDto) => {
    if (!unitHierarchyDto) return 1;

    if (fromUnitId === toUnitId) return 1;

    const child = unitHierarchyDto.children?.find((c) => c.unitId === toUnitId);
    if (child) return child.equivalentValue;

    const isChild = unitHierarchyDto.children?.some(
      (c) => c.unitId === fromUnitId,
    );
    if (isChild && unitHierarchyDto.unitId === toUnitId) {
      const childUnit = unitHierarchyDto.children.find(
        (c) => c.unitId === fromUnitId,
      );
      return 1 / childUnit.equivalentValue;
    }

    return 1;
  };

  const handleChange = (index, field, value) => {
    const updated = [...data];
    const row = updated[index];

    const basePrice = Number(row.basePricePerUnit) || 0;

    if (field === "finalQty") {
      const newFinalQty = Number(value) || 0;

      row.finalQty = newFinalQty;
      row.total = newFinalQty > 0 ? basePrice * newFinalQty : 0;

      setData(updated);
      setHasUnsavedChanges(true);
      return;
    }

    if (field === "unitId") {
      const newUnitId = Number(value);
      const oldUnitId = row.unitId;

      const factor = getEquivalentValue(
        oldUnitId,
        newUnitId,
        row.unitHierarchyDto,
      );

      const newFinalQty = (Number(row.finalQty) || 0) * factor;

      const newPricePerUnit = factor !== 0 ? basePrice / factor : basePrice;

      row.unitId = newUnitId;
      row.finalQty = newFinalQty;
      row.basePricePerUnit = newPricePerUnit;
      row.total = newFinalQty > 0 ? newFinalQty * newPricePerUnit : 0;

      const unitOptions = buildUnitOptions(
        row.units,
        row.unitHierarchyDto,
        newUnitId,
        row.unit,
      );

      const selectedUnit = unitOptions.find((u) => u.value === newUnitId);
      if (selectedUnit) {
        row.unit = selectedUnit.label;
        row.units = {
          ...row.units,
          id: newUnitId,
          nameEnglish: selectedUnit.label,
        };
      }

      setData(updated);
      setHasUnsavedChanges(true);
      return;
    }

    row[field] = value;
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

      const newRow = data.find((item) => item.isNewRow);
      const payloadEventFunctionId = newRow?.eventFunctionId || 0;

      const payload = {
        eventFunctionId: payloadEventFunctionId,
        eventId: parseInt(eventId),
        rawMaterialCategoryId: parseInt(activeTab || 0),

        eventRawMaterial: data.map((item) => {
          const supplierId =
            agencies.find(
              (a) => a.nameEnglish === item.agency || a.name === item.agency,
            )?.id ||
            item.supplierId ||
            0;

          const eventRawMatFunctions = item.isNewRow
            ? []
            : (item.eventRawMaterialFunctions || []).map((fn) => ({
                menuItemId:fn.menuItemId,
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
                rawMaterialRate: fn.rawMaterialRate || fn.rawMaterialPrice,
                itemName: fn.itemName || item.material || "",
                place: fn.place || item.place || "",
                price: parseFloat(fn.price) || 0,
                qty: parseFloat(fn.qty) || 0,
                supplierId: fn.supplierId || supplierId,
                unitId: fn.unitId || item.unitId || 0,
              }));

          return {
            eventRawMatFunctions: eventRawMatFunctions,
            extraItem: item.isNewRow ? item.material : "",
            finalQty: parseFloat(item.finalQty) || 0,
            place: item.place || "",
            qty: parseFloat(item.qty) || 0,
            rawMaterialId: item.rawMaterialId || null,
            supplierId: supplierId,
            totalprice: parseFloat(item.total) || 0,
            unitId: item.unitId || 0,
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
    setIsSaving(true);
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
    setIsSaving(false);
  };

  const handleTabSwitch = async (tab) => {
    if (hasUnsavedChanges && data.length > 0) {
      const success = await autoSave(false);

      if (success) {
      } else {
        console.warn("⚠️ Auto-save failed, but continuing with tab switch");
      }
    }

    setActiveTab(tab.value);
    await fetchRawMaterialItems(tab.categoryId);
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
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one raw material.",
      });
      return;
    }

    const updated = data.map((item) =>
      selectedRows.includes(item.rawMaterialId) ? { ...item, agency } : item,
    );

    setData(updated);
    setHasUnsavedChanges(true);
  };

  const handleAllocatePlace = (placeName, placeId) => {
    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one raw material.",
      });
      return;
    }

    const updated = data.map((item) =>
      selectedRows.includes(item.rawMaterialId)
        ? {
            ...item,
            place: placeName,
            placeId: Number(placeId) || 0,
          }
        : item,
    );

    setData(updated);
    setHasUnsavedChanges(true);
  };

  const handleAllocateDate = (date) => {
    if (!date) return;

    if (selectedRows.length === 0) {
      Swal.fire({
        icon: "warning",
        title: "No Selection",
        text: "Please select at least one raw material.",
      });
      return;
    }

    const allocatedDate = dayjs(date);

    const updated = data.map((item) =>
      selectedRows.includes(item.rawMaterialId)
        ? { ...item, date: allocatedDate }
        : item,
    );

    setData(updated);
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
                <tr>
                  <th className="px-4 py-4 text-center">
                    <input
                      type="checkbox"
                      checked={
                        selectedRows.length === data.length && data.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    SRNO
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Raw Material
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Agency
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Place
                  </th>

                  <th className="px-4 py-4 text-left text-xs font-bold text-gray-700 uppercase">
                    Date
                  </th>
                </tr>
              </thead>

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
                      <td className="px-4 py-3 text-center">
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(item.rawMaterialId)}
                          onChange={() =>
                            toggleRowSelection(item.rawMaterialId)
                          }
                        />
                      </td>

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

  const handleSaveFromSidebar = (updatedRow) => {
    const updatedData = data.map((item) => {
      if (
        item.id === updatedRow.id ||
        item.rawMaterialId === updatedRow.rawMaterialId
      ) {
        const newFinalQty = updatedRow.qtyWasModified
          ? updatedRow.calculatedFinalQty
          : item.finalQty;

        const newTotal = newFinalQty * (item.basePricePerUnit || 0);

        return {
          ...item,
          ...updatedRow,
          rawMaterialId: item.rawMaterialId,
          id: item.id,
          finalQty: newFinalQty,
          total: newTotal,
        };
      }
      return item;
    });

    setData(updatedData);
    setHasUnsavedChanges(true);

    Swal.fire({
      icon: "success",
      title: "Updated",
      text: updatedRow.qtyWasModified
        ? `Row updated successfully. Final Qty updated to ${updatedRow.calculatedFinalQty.toFixed(2)} (including extra: ${updatedRow.extraQty || 0}). Changes will be saved when switching tabs or clicking Save.`
        : "Row updated successfully. Changes will be saved when switching tabs or clicking Save.",
      timer: 2500,
      showConfirmButton: false,
    });
  };

  const totalPrice = data.reduce(
    (acc, item) => acc + Number(item.total || 0),
    0,
  );

  const handleEventSelect = async (newEventId) => {
    // Check for unsaved changes
    if (hasUnsavedChanges) {
      const result = await Swal.fire({
        title: "Unsaved Changes",
        text: "You have unsaved changes. Do you want to save before switching events?",
        icon: "warning",
        showCancelButton: true,
        showDenyButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        denyButtonColor: "#6c757d",
        confirmButtonText: "Save & Switch",
        denyButtonText: "Switch Without Saving",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const success = await autoSave(false);
        if (!success) {
          Swal.fire({
            icon: "error",
            title: "Save Failed",
            text: "Could not save changes. Please try again.",
          });
          return;
        }
      } else if (result.isDismissed || result.dismiss === Swal.DismissReason.cancel) {
        return;
      }
    }

    // Start navigation
    setIsNavigating(true);
    setSelectedEventId(newEventId);
    setIsAllCustomerToogleOpen(false);
    
    // Navigate to new event
    navigate(`/raw-material-allocation/${newEventId}`);
  };

  // ✅ Show loading state
  if (isNavigating || (loading && !data.length)) {
    return (
      <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            {isNavigating ? "Switching Event..." : "Loading..."}
          </p>
        </div>
      </div>
    );
  }

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
                <button
                  className="btn btn-light text-white bg-primary font-semibold hover:!bg-primary hover:!text-white hover:!border-primary "
                  onClick={() => navigate(`/dish-costing/${eventId}`)}
                >
                  <i
                    className="ki-filled ki-g hover:!text-gray-400"
                    style={{ color: "white" }}
                  ></i>{" "}
                  6. Per Dish-costng
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="card min-w-full rtl:[background-position:right_center] [background-position:right_center] bg-no-repeat bg-[length:500px] user-access-bg mb-5">
          <div className="flex flex-wrap items-center justify-between p-4 gap-3">
            {/* ROW 1 */}
            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_ID"
                    defaultMessage="Event ID:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900 underline cursor-pointer" onClick={() => setIsAllCustomerToogleOpen(true)}>
                  {eventData?.eventNo || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-user text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.PARTY_NAME"
                    defaultMessage="Party Name:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.party?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-geolocation-home text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_NAME"
                    defaultMessage="Event Name:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventType?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_DATE_TIME"
                    defaultMessage="Event Date & Time:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.eventStartDateTime || ""}
                </span>
              </div>
            </div>

            {/* FORCE NEW ROW */}
            <div className="w-full h-0"></div>

            {/* ROW 2 LEFT — Event Venue */}
            <div className="flex items-center gap-3">
              <i className="ki-filled ki-calendar-tick text-success text-lg"></i>
              <div className="flex flex-col">
                <span className="text-sm">
                  <FormattedMessage
                    id="EVENT_MENU_ALLOCATION.EVENT_VENUE"
                    defaultMessage="Event Venue:"
                  />
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {eventData?.venue?.nameEnglish || "-"}
                </span>
              </div>
            </div>

            {/* ROW 2 RIGHT — Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-gray-200">
              {/* Report Button */}
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
          <div className="flex gap-2">
            {/* ADD THIS BUTTON */}
            <button
              className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700 transition flex items-center gap-2"
              onClick={handleAddNewRow}
            >
              <i className="ki-filled ki-plus"></i>
              <FormattedMessage
                id="RAW_MATERIAL_ALLOCATION.ADD_NEW_ROW"
                defaultMessage="Add New Row"
              />
            </button>
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
        </div>

        <div className="bg-white rounded-xl shadow border border-gray-200">
          <div className="max-h-[380px] overflow-y-auto ">
            <table className="min-w-full table-fixed text-sm text-gray-700">
              {/* ===== TABLE HEADER ===== */}
              <thead className="bg-gray-100 text-gray-700 uppercase text-xs font-semibold sticky top-0 z-1">
                <tr>
                  <th className="w-16 px-4 py-3 text-left">ID</th>
                  <th className="w-48 px-4 py-3 text-left">Raw Material</th>
                  <th className="w-24 px-4 py-3 text-left">Qty</th>
                  <th className="w-28 px-4 py-3 text-left">Final Qty</th>
                  <th className="w-32 px-4 py-3 text-left">Unit</th>
                  <th className="w-40 px-4 py-3 text-left">Agency</th>
                  <th className="w-36 px-4 py-3 text-left">Place</th>
                  <th className="w-52 px-4 py-3 text-left">Date</th>
                  <th className="w-28 px-4 py-3 text-left">Total</th>
                  <th className="w-24 px-4 py-3 text-center">Action</th>
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
                    <tr
                      key={index}
                      className={`border-b border-gray-200 ${item.isNewRow ? "bg-green-50" : ""}`}
                    >
                      <td className="px-4 py-3">{item.id}</td>

                      {/* Raw Material - Editable for new rows */}
                      <td className="px-4 py-2 text-xs text-gray-700">
                        {item.isNewRow ? (
                          <input
                            type="text"
                            value={item.material}
                            onChange={(e) =>
                              handleChange(index, "material", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-2 py-2"
                            placeholder="Enter material name"
                          />
                        ) : (
                          <span
                            className="truncate max-w-[150px] block"
                            title={item.material}
                          >
                            {item.material}
                          </span>
                        )}
                      </td>

                      {/* Qty - Editable for new rows */}
                      <td className="px-4 py-3">
                        {item.isNewRow ? (
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              handleChange(index, "qty", e.target.value)
                            }
                            className="w-full border border-gray-300 rounded px-2 py-1"
                            placeholder="0"
                          />
                        ) : (
                          item.qty
                        )}
                      </td>

                      {/* Final Qty - Always editable */}
                      <td className="px-4 py-3">
                        <input
                          type="number"
                          value={item.finalQty}
                          onChange={(e) =>
                            handleChange(index, "finalQty", e.target.value)
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        />
                      </td>

                      {/* Unit - Always editable */}
                      <td className="px-4 py-3">
                        <select
                          value={item.unitId}
                          onChange={(e) =>
                            handleChange(
                              index,
                              "unitId",
                              Number(e.target.value),
                            )
                          }
                          className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
                        >
                          {buildUnitOptions(
                            item.units,
                            item.unitHierarchyDto,
                            item.unitId,
                            item.unit,
                          ).map((u) => (
                            <option key={u.value} value={u.value}>
                              {u.label}
                            </option>
                          ))}
                        </select>
                      </td>

                      {/* Agency - Editable for new rows */}
                      <td className="px-4 py-3">
                        {item.isNewRow ? (
                          <select
                            className="w-full border border-gray-300 rounded px-2 py-1 text-xs"
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
                        ) : (
                          item.agency
                        )}
                      </td>

                      {/* Place - Editable for new rows */}
                      <td className="px-4 py-3">
                        {item.isNewRow ? (
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
                        ) : (
                          item.place
                        )}
                      </td>

                      {/* Date - Editable for new rows */}
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.isNewRow ? (
                          <DatePicker
                            selected={
                              item.date ? dayjs(item.date).toDate() : null
                            }
                            onChange={(date) => handleDateChange(index, date)}
                            showTimeSelect
                            timeFormat="hh:mm aa"
                            dateFormat="MM/dd/yyyy hh:mm aa"
                            className="border px-2 py-1 w-[180px]"
                            placeholderText="Select date"
                          />
                        ) : item.date ? (
                          dayjs(item.date).format("DD/MM/YYYY hh:mm A")
                        ) : (
                          "-"
                        )}
                      </td>

                      {/* Total */}
                      <td className="px-4 py-3">{item.total}</td>

                      {/* Action */}
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <i
                            className="ki-filled ki-notepad-edit text-primary cursor-pointer hover:text-blue-700"
                            onClick={() => handleEditRow(item)}
                            title="Edit"
                          ></i>
                          {item.isNewRow && (
                            <i
                              className="ki-filled ki-trash text-red-500 cursor-pointer hover:text-red-700"
                              onClick={() => handleDeleteRow(index)}
                              title="Delete"
                            ></i>
                          )}
                        </div>
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
         <AllCustomerToogle
        isModalOpen={isAllCustomerToogleOpen}
        setIsModalOpen={setIsAllCustomerToogleOpen}
        onEventSelect={handleEventSelect}
      />

        <AddRawMaterial
          isOpen={isAddMaterialModal}
          onClose={() => setIsAddMaterialModal(false)}
          onSave={handleSaveNewMaterial}
          agencies={agencies}
          unit={unit}
          eventFunctions={eventFunctions}
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
