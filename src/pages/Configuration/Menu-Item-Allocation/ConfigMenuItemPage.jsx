import React, { useEffect, useMemo, useState } from "react";
import InsideTable from "./tables/InsideTable";
import OutsideTable from "./tables/OutsideTable";
import ChefLabourTable from "./tables/ChefLabourTable";
import { FormattedMessage, useIntl } from "react-intl";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import NoData from "../../../components/Nodata";

import {
  Getmenuitemsusingcatidconfig,
  GetMenuCategoryByUserId,
  GetAllCustomer,
} from "@/services/apiServices";

const MenuAllocation = ({ chefLabourList = [], agencyList = [] }) => {
  const intl = useIntl();

  const [fromCategory, setFromCategory] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [selectedType, setSelectedType] = useState("");
  const [vendorList, setVendorList] = useState([]);
  const [toType, setToType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const [categoriesLoading, setCategoriesLoading] = useState(false);
  const [categoryList, setCategoryList] = useState([]);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  useEffect(() => {
    setSelectedItem("");
    if (toType === "Outside" || toType === "Chef Labour") {
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
          }

          console.log("Filtered Vendors:", filteredVendors);

          setVendorList(filteredVendors);
        } catch (err) {
          console.error("Error fetching vendors", err);
          setVendorList([]);
        }
      };
      fetchVendors();
    } else {
      setVendorList([]);
    }
  }, [toType]);

  useEffect(() => {
    setSelectedItem("");
  }, [toType]);

  useEffect(() => {
    setSelectedType("");
    setToType("");
    setSelectedItem("");
    setTableData([]);
  }, [fromCategory]);

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

        setTableData(
          apiData.map((item) => ({
            id: item.id,

            // Common
            menuItem: item.nameEnglish,
            itemName: item.nameEnglish,
            category: item.menuCategoryNameEnglish,

            // INSIDE
            typeNo:
              selectedType === "Inside"
                ? (item.insideAgency?.typeNo ?? "Inside")
                : "-",

            // OUTSIDE
            type: "Outside",
            quantity: item.outsideAgency?.quantity ?? "",
            price: item.outsideAgency?.price ?? "",
            unit: item.outsideAgency?.unit ?? "kg",

            // CHEF LABOUR
            allocationType: item.chefLabourAgency ? "Chef Labour" : "counter",
            counterNo: item.chefLabourAgency?.counterNo ?? "",
            pricePerLabour: item.chefLabourAgency?.pricePerLabour ?? "",
            qtyPer100Person: item.chefLabourAgency?.qtyPer100Person ?? "",
            pricePerHelper: item.chefLabourAgency?.pricePerHelper ?? "",
          }))
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, [fromCategory, selectedType]);

  const dropdownConfig = useMemo(() => {
    if (toType === "Inside") {
      return { label: "Vendor / Chef", options: [] };
    }
    if (toType === "Outside" || toType === "Chef Labour") {
      return { label: "Vendor / Chef", options: vendorList };
      t;
    }
    return { label: "Select To Type First", options: [] };
  }, [toType, vendorList]);

  // Inside MenuAllocation component
  const filteredData = useMemo(() => {
    if (!searchQuery) return tableData;

    return tableData.filter((item) => {
      const query = searchQuery.toLowerCase();
      return (
        item.menuItem?.toLowerCase().includes(query) ||
        item.itemName?.toLowerCase().includes(query) ||
        item.category?.toLowerCase().includes(query) ||
        item.type?.toLowerCase().includes(query)
      );
    });
  }, [searchQuery, tableData]);

  return (
    <Container>
      {/* Breadcrumb / Fragment Name */}
      <div className="mb-4">
        <Breadcrumbs
          items={[
            {
              title: (
                <FormattedMessage
                  id="MENU.ALLOCATE_SUPPLIER"
                  defaultMessage="Allocate Supplier"
                />
              ),
            },
          ]}
        />
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="form-label font-semibold">
              <FormattedMessage
                id="FROM_CATEGORY"
                defaultMessage="From Category"
              />
            </label>
            <select
              className="input appearance-none pr-10"
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

          {/* Type */}
          <div>
            <label className="form-label font-semibold"> From Type</label>
            <select
              className="input w-full"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              disabled={!fromCategory}
            >
              <option value="">Select Type</option>
              <option value="Inside">Inside</option>
              <option value="Outside">Outside</option>
              <option value="Chef Labour">Chef Labour</option>
            </select>
          </div>

          {/* To Type */}
          <div>
            <label className="form-label font-semibold">To Type</label>
            <select
              className="input w-full"
              value={toType}
              onChange={(e) => setToType(e.target.value)}
              disabled={!selectedType}
            >
              <option value="">Select To Type</option>
              <option value="Inside">Inside</option>
              <option value="Outside">Outside</option>
              <option value="Chef Labour">Chef Labour</option>
            </select>
          </div>

          {/* Vendor / Chef */}
          <div>
            <label className="form-label font-semibold">
              {dropdownConfig.label}
            </label>
            <select
              className="input w-full"
              value={selectedItem}
              onChange={(e) => setSelectedItem(e.target.value)}
              disabled={toType === "Inside" || !toType}
            >
              <option value="">
                {vendorList.length === 0
                  ? "Loading vendors..."
                  : `Select ${dropdownConfig.label}`}
              </option>
              {vendorList.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.nameEnglish} ({item.contact?.contactType?.nameEnglish})
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="relative text-right w-full flex justify-end">
          <div className="relative">
            <i className="ki-filled ki-magnifier text-primary absolute top-1/2 end-0 -translate-y-1/2 me-3"></i>
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

          {!loading && selectedType === "Inside" && filteredData.length > 0 && (
            <InsideTable data={tableData} />
          )}

          {!loading &&
            selectedType === "Outside" &&
            filteredData.lengthh > 0 && <OutsideTable data={tableData} />}

          {!loading &&
            selectedType === "Chef Labour" &&
            filteredData.length > 0 && <ChefLabourTable data={tableData} />}
        </div>
        <div className="flex justify-end gap-3 mb-10">
          <button
            className="btn btn-light"
            onClick={() => {
              setSelectedRows([]);
              setFromCategory("");
              setToCategory("");
            }}
          >
            <FormattedMessage id="COMMON.CANCEL" defaultMessage="Cancel" />
          </button>
          <button className="btn btn-primary">
            <>
              <span className="spinner-border spinner-border-sm me-2" />
              <FormattedMessage id="COMMON.SAVING" defaultMessage="Saving..." />
            </>
          </button>
        </div>
      </div>
    </Container>
  );
};

export default MenuAllocation;
