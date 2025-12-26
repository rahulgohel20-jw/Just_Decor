import React, { useEffect, useMemo, useState } from "react";
import InsideTable from "./tables/InsideTable";
import OutsideTable from "./tables/OutsideTable";
import ChefLabourTable from "./tables/ChefLabourTable";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";
import { message } from "antd";
import NoData from "../../../components/Nodata";
import Swal from "sweetalert2";

import {
  Getmenuitemsusingcatidconfig,
  GetMenuCategoryByUserId,
  GetAllCustomer,
  Updatemenuitemallocationconfig,
} from "@/services/apiServices";

const MenuAllocation = ({ chefLabourList = [], agencyList = [] }) => {
  const intl = useIntl();

  const [fromCategory, setFromCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [lastAssignedType, setLastAssignedType] = useState("");

  const [selectedType, setSelectedType] = useState(""); // From Type
  const [vendorList, setVendorList] = useState([]);
  const [toType, setToType] = useState(""); // To Type - determines which table to show
  const [selectedItem, setSelectedItem] = useState("");

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

  // State for different tables
  const [insideTableData, setInsideTableData] = useState([]);
  const [insideSelectedRows, setInsideSelectedRows] = useState([]);

  const [outsideTableData, setOutsideTableData] = useState([]);
  const [outsideSelectedRows, setOutsideSelectedRows] = useState([]);

  const [chefLabourTableData, setChefLabourTableData] = useState([]);
  const [chefLabourSelectedRows, setChefLabourSelectedRows] = useState([]);

  // Fetch categories on mount
  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      try {
        const userId = localStorage.getItem("userId");
        const response = await GetMenuCategoryByUserId(userId);

        const categoriesData =
          response?.data?.data?.["Menu Category Details"] || [];

        setCategoryList(
          categoriesData.map((cat) => ({
            id: cat.id,
            name: cat.nameEnglish?.trim(),
          }))
        );
      } catch (error) {
        console.error("❌ Error fetching menu categories:", error);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Fetch vendors when toType changes
  useEffect(() => {
    setSelectedItem("");

    if (!toType) {
      setVendorList([]);
      return;
    }

    const fetchVendors = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await GetAllCustomer(userId);
        const vendors = response?.data?.data?.["Party Details"] || [];

        let filteredVendors = [];

        if (toType === "Chef Labour") {
          filteredVendors = vendors.filter(
            (v) =>
              v.contact?.contactType?.id === 2 ||
              v.contact?.contactType?.id === 5
          );
        } else if (toType === "Outside") {
          filteredVendors = vendors.filter(
            (v) => v.contact?.contactType?.id === 6
          );
        } else if (toType === "Inside") {
          filteredVendors = vendors.filter(
            (v) => v.contact?.contactType?.id === 7
          );
        }

        setVendorList(filteredVendors);
      } catch (err) {
        console.error("Error fetching vendors", err);
        setVendorList([]);
      }
    };

    fetchVendors();
  }, [toType]);

  // Reset when category changes
  useEffect(() => {
    setSelectedType("");
    setToType("");
    setSelectedItem("");
    setTableData([]);
    setInsideTableData([]);
    setOutsideTableData([]);
    setChefLabourTableData([]);
  }, [fromCategory]);

  // Fetch menu items when category and FROM type are selected
  useEffect(() => {
    if (!fromCategory || !selectedType) {
      setTableData([]);
      return;
    }

    const fetchMenuItems = async () => {
      setLoading(true);
      try {
        const userId = localStorage.getItem("userId");

        const response = await Getmenuitemsusingcatidconfig(
          [fromCategory],
          userId,
          selectedType
        );

        const apiData = response?.data?.darta || [];

        const formattedData = apiData.map((item) => ({
          id: item.id,
          menuItem: item.nameEnglish,
          itemName: item.nameEnglish,
          category: item.menuCategoryNameEnglish,

          // Assigned type
          assignedType: item.chefLabourAgency ? "Chef Labour" : "",

          /* CHEF LABOUR */
          type: "cheflabour", // ✅ IMPORTANT
          allocationType: "Plate Wise",

          // Quantity
          counterNo: item.qtyPer100Person ?? 0, // ✅ qty → No

          // Price
          basePrice: item.base_price ?? 0, // ✅ base_price used as price

          // Vendor
          vendorAllocate: item.supplierNameEnglish ?? "-", // ✅ vendor

          // Unit
          unit: item.unitNameEnglish ?? "",
          unitId: item.unitId ?? 0,
        }));

        setTableData(formattedData);

        // Initialize all table data states with the fetched data
        setInsideTableData(formattedData);
        setOutsideTableData(formattedData);
        setChefLabourTableData(formattedData);
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [fromCategory, selectedType]);

  const dropdownConfig = useMemo(() => {
    if (toType === "Inside") {
      return { label: "Vendor", options: vendorList };
    }
    if (toType === "Outside" || toType === "Chef Labour") {
      return { label: "Vendor", options: vendorList };
    }
    return { label: "Select Assign Type First", options: [] };
  }, [toType, vendorList]);

  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;

    return tableData.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.menuItem?.toLowerCase().includes(query) ||
        item.itemName?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, tableData]);

  const buildAllocationPayload = ({ row, type, partyId, userId }) => {
    const basePayload = {
      menuItemId: row.id || 0,
      partyId: Number(partyId) || 0,
      userId: Number(userId) || 0,
      id: -1,
      selectInsideAgency: false,
      selectOutsideAgency: false,
      selectChefLabourAgency: false,
      allocationType: "",
      basePrice: 0,
      contactCategoryId: 0,
      counterNo: 0,
      number: "",
      pricePerLabour: 0,
      quantityPer100Person: 0,
      remarks: "",
      unitId: 0,
    };

    switch (type) {
      case "Inside":
        return {
          ...basePayload,
          number: row.typeNo || "",
          remarks: row.remarks || "",
          selectInsideAgency: true,
        };

      case "Outside":
        return {
          ...basePayload,
          unitId: row.unitId || 0,
          basePrice: row.price ? Number(row.price) : 0,
          quantityPer100Person: row.quantity ? Number(row.quantity) : 0,
          contactCategoryId: row.contactCategoryId || 0, // ✅ FIXED: Added this line
          selectOutsideAgency: true,
        };

      case "Chef Labour":
        return {
          ...basePayload,
          unitId: row.unitId || 0,
          basePrice: row.basePrice ? Number(row.basePrice) : 0, // Use table value
          pricePerLabour: 0, // Make it empty in payload
          quantityPer100Person: row.counterNo ? Number(row.counterNo) : 0,

          allocationType: "Plate wise",
          selectChefLabourAgency: true,
        };

      default:
        return null;
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem("userId");

    // Determine which data to use
    let dataToSave = [];
    let selectedIds = [];

    // Use TO TYPE if selected, else use FROM TYPE table
    if (toType === "Inside") {
      dataToSave = insideTableData.length > 0 ? insideTableData : tableData;
      selectedIds = insideSelectedRows;
    } else if (toType === "Outside") {
      dataToSave = outsideTableData.length > 0 ? outsideTableData : tableData;
      selectedIds = outsideSelectedRows;
    } else if (toType === "Chef Labour") {
      dataToSave =
        chefLabourTableData.length > 0 ? chefLabourTableData : tableData;
      selectedIds = chefLabourSelectedRows;
    } else {
      // No TO TYPE selected — use tableData as-is
      dataToSave = tableData;
      selectedIds = tableData.map((row) => row.id); // select all rows by default
    }

    // Filter only selected rows
    const rowsToSave =
      selectedIds.length > 0
        ? dataToSave.filter((row) => selectedIds.includes(row.id))
        : [];

    if (rowsToSave.length === 0) {
      message.warning("No items to save.");
      return;
    }

    const payload = rowsToSave
      .map((row) =>
        buildAllocationPayload({
          row,
          type: toType || selectedType, // fallback to FROM TYPE
          partyId: selectedItem || 0,
          userId,
        })
      )
      .filter(Boolean);

    if (payload.length === 0) {
      message.warning("No valid data to save.");
      return;
    }

    /* SweetAlert confirmation */
    const result = await Swal.fire({
      title: "Are you sure?",
      text: `You are about to update ${payload.length} menu item(s).`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, update",
      cancelButtonText: "Cancel",
      reverseButtons: true,
    });

    if (!result.isConfirmed) return;

    try {
      await Updatemenuitemallocationconfig(payload);

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: `Menu items successfully assigned.`,
        timer: 2000,
        showConfirmButton: false,
      });
      setLastAssignedType(toType);
      // Reset inputs
      setToType("");
      setSelectedItem("");
      setVendorList([]);

      // Reset selections
      setInsideSelectedRows([]);
      setOutsideSelectedRows([]);
      setChefLabourSelectedRows([]);

      // Re-fetch menu items
      setLoading(true);
      const response = await Getmenuitemsusingcatidconfig(
        [fromCategory],
        userId,
        selectedType
      );

      const apiData = response?.data?.darta || [];

      const refreshedData = apiData.map((item) => ({
        id: item.id,
        menuItem: item.nameEnglish,
        itemName: item.nameEnglish,
        category: item.menuCategoryNameEnglish,
        assignedType: item.insideAgency
          ? "Inside"
          : item.outsideAgency
            ? "Outside"
            : item.chefLabourAgency
              ? "ChefLabour"
              : "",
        typeNo: item.counterNo ?? "",
        remarks: item.remarks ?? "",
        quantity: item.qtyPer100Person ?? "",
        price: item.base_price ?? "",
        unit: item.unitNameEnglish ?? "",
        unitId: item.unitId ?? 0,
        contactCategoryId: item.contactCategoryId ?? 0, // ✅ Add this
        contactCategory: item.contactCategoryNameEnglish ?? "",
      }));

      setTableData(refreshedData);
      setInsideTableData(refreshedData);
      setOutsideTableData(refreshedData);
      setChefLabourTableData(refreshedData);
    } catch (error) {
      console.error("Update failed", error);
      Swal.fire({
        icon: "error",
        title: "Update Failed",
        text: "Something went wrong while updating menu allocation.",
      });
    } finally {
      setLoading(false);
    }
  };

  const getTableTypeFromData = () => {
    // While user is assigning, always respect TO TYPE
    if (toType) return toType;

    // After save, respect last assigned type
    if (lastAssignedType) return lastAssignedType;

    // Fallback to FROM TYPE
    return selectedType;
  };

  // Determine which table to show - ONLY based on TO TYPE if selected, otherwise FROM TYPE
  const renderTable = () => {
    const displayType = getTableTypeFromData();

    if (!displayType) return null;

    if (displayType === "Inside") {
      return (
        <InsideTable
          data={filteredData}
          onDataChange={setInsideTableData}
          onSelectionChange={setInsideSelectedRows}
        />
      );
    }

    if (displayType === "Outside") {
      return (
        <OutsideTable
          data={filteredData}
          onDataChange={setOutsideTableData}
          onSelectionChange={setOutsideSelectedRows}
        />
      );
    }

    if (displayType === "Chef Labour") {
      return (
        <ChefLabourTable
          data={filteredData}
          onDataChange={setChefLabourTableData}
          onSelectionChange={setChefLabourSelectedRows}
        />
      );
    }

    return null;
  };

  return (
    <Container>
      <div className="mb-4">
        <h1 className="text-xl text-gray-900">
          <FormattedMessage
            id="ALLOCATE_SUPPLIER"
            defaultMessage="Allocate Supplier"
          />
        </h1>
      </div>

      <div className="space-y-6">
        <div className="w-full border rounded-lg bg-white p-4">
          <div className="w-full rounded-lg">
            <div className="grid grid-cols-2 gap-6 w-full">
              {/* LEFT BOX — From Category + From Type */}
              <div className="w-full border rounded-lg bg-white p-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* From Category */}
                  <div>
                    <label className="form-label font-semibold">
                      <FormattedMessage
                        id="FROM_CATEGORY"
                        defaultMessage="From Category"
                      />
                    </label>
                    <select
                      className="input appearance-none pr-10 w-full"
                      value={fromCategory}
                      onChange={(e) => setFromCategory(e.target.value)}
                      disabled={categoriesLoading}
                    >
                      <option value="">
                        {categoriesLoading ? "Loading..." : "Select a category"}
                      </option>
                      {categoryList.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* From Type */}
                  <div>
                    <label className="form-label font-semibold">
                      <FormattedMessage
                        id="FORM.FROM_TYPE"
                        defaultMessage="From Type"
                      />
                    </label>
                    <select
                      className="input w-full"
                      value={selectedType}
                      onChange={(e) => setSelectedType(e.target.value)}
                      disabled={!fromCategory}
                    >
                      <option value="">Select Type</option>
                      <option value="Inside">Inside</option>
                      <option value="Outside">Outside</option>
                      <option value="ChefLabour">Chef Labour</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* RIGHT BOX — To Type + Vendor */}
              <div className="w-full border rounded-lg bg-white p-4">
                <div className="grid grid-cols-1 gap-4">
                  {/* To Type */}
                  <div>
                    <label className="form-label font-semibold">
                      <FormattedMessage
                        id="FORM.TO_TYPE"
                        defaultMessage="Assign Type"
                      />
                    </label>
                    <select
                      className="input w-full"
                      value={toType}
                      onChange={(e) => setToType(e.target.value)}
                      disabled={!selectedType}
                    >
                      <option value="">Select Assign Type</option>
                      <option value="Inside">Inside</option>
                      <option value="Outside">Outside</option>
                      <option value="Chef Labour">Chef Labour</option>
                    </select>
                  </div>

                  {/* Vendor */}
                  <div>
                    <label className="form-label font-semibold">
                      {dropdownConfig.label}
                    </label>
                    <select
                      className="input w-full"
                      value={selectedItem}
                      onChange={(e) => setSelectedItem(e.target.value)}
                      disabled={!toType}
                    >
                      <option value="">
                        {vendorList.length === 0
                          ? "Loading vendors..."
                          : `Select ${dropdownConfig.label}`}
                      </option>
                      {vendorList.map((item) => (
                        <option key={item.id} value={item.id}>
                          {item.nameEnglish} (
                          {item.contact?.contactType?.nameEnglish})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="relative w-full flex items-center justify-end gap-4">
          {/* Search */}
          <div className="relative">
            <i className="ki-filled ki-magnifier text-primary absolute top-1/2 end-3 -translate-y-1/2"></i>
            <input
              className="input pr-8 w-[200px]"
              type="text"
              placeholder={intl.formatMessage({
                id: "RAW_MATERIAL.SEARCH",
                defaultMessage: "To search, type and press Enter.",
              })}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="mt-4">
          {loading && <div className="text-center py-6">Loading...</div>}

          {!loading && !fromCategory && !selectedType && (
            <NoData message="Please select category to view data." />
          )}

          {!loading && fromCategory && !selectedType && (
            <NoData message="Please select type to view data." />
          )}

          {!loading &&
            fromCategory &&
            selectedType &&
            tableData.length === 0 && (
              <NoData message="No data available for the selected category and type." />
            )}

          {!loading && filteredData.length > 0 && renderTable()}
        </div>

        <div className="flex justify-end gap-3 mb-10">
          <button
            className="btn btn-light"
            onClick={() => {
              setFromCategory("");
              setSelectedType("");
              setToType("");
              setSelectedItem("");
              setTableData([]);
              setInsideTableData([]);
              setOutsideTableData([]);
              setChefLabourTableData([]);
              setInsideSelectedRows([]);
              setOutsideSelectedRows([]);
              setChefLabourSelectedRows([]);
            }}
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>

          <button
            className="btn btn-primary"
            onClick={handleSave}
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" />
                <FormattedMessage
                  id="COMMON.SAVING"
                  defaultMessage="Updating..."
                />
              </>
            ) : (
              <FormattedMessage id="COMMON.SAVE" defaultMessage="Update" />
            )}
          </button>
        </div>
      </div>
    </Container>
  );
};

export default MenuAllocation;
