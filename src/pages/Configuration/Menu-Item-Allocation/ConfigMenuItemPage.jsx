import { Fragment, useEffect, useState, useMemo } from "react";
import { toAbsoluteUrl } from "@/utils";

import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { FormattedMessage, useIntl } from "react-intl";
import InsideTable from "./tables/InsideTable";
import OutsideTable from "./tables/OutsideTable";
import ChefLabourTable from "./tables/ChefLabourTable";
import { Checkbox } from "@/components/ui/checkbox"; // or use native input

import FromCategoryDropdown from "../../../components/form-inputs/FromCategoryDropdown/FromCategoryDropdown";

const ConfigMenuItemPage = () => {
  const intl = useIntl();

  const [fromCategory, setFromCategory] = useState("");
  const [toCategory, setToCategory] = useState("");
  const [TochefLabourType, setToChefLabourType] = useState("");
  const [selectedItem, setSelectedItem] = useState("");

  const [categoryList, setCategoryList] = useState([]);
  const [chefLabourList, setChefLabourList] = useState([]);
  const [agencyList, setAgencyList] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const checkboxColumn = {
    id: "select",
    header: ({ table }) => (
      <input
        type="checkbox"
        className="checkbox"
        checked={table.getIsAllRowsSelected()}
        indeterminate={table.getIsSomeRowsSelected()}
        onChange={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: ({ row }) => (
      <input
        type="checkbox"
        className="checkbox"
        checked={row.getIsSelected()}
        disabled={!row.getCanSelect()}
        onChange={row.getToggleSelectedHandler()}
      />
    ),
  };

  const CATEGORY_TABLE_MAP = {
    "pan asian": "Inside",
    "hot soup counter": "Inside",
    "welcome drink": "Chef Labour",
  };

  const resolvedTableType = useMemo(() => {
    return CATEGORY_TABLE_MAP[fromCategory?.toLowerCase().trim()] || "";
  }, [fromCategory]);

  useEffect(() => {
    // Categories
    // setCategoryList([
    //   { id: "INSIDE", name: "Inside" },
    //   { id: "CHEFLABOUR", name: "Chef Labour" },
    //   { id: "OUTSIDE", name: "Outside" },
    // ]);

    // Chef Labour List

    setChefLabourList([
      { id: "chef1", name: "MONU CHEF" },
      { id: "chef2", name: "MANJU BEN FULKA" },
      { id: "chef3 ", name: "MUSTAFA TANDOOR " },
    ]);

    // Agency List
    setAgencyList([
      { id: "agency1", name: "MATUKI SWEET" },
      { id: "agency2", name: "BHOLA JUICE AND FRUIT" },
      { id: "agency3", name: "NIMESH BHAI STARTER" },
    ]);

    // Table Data with different fields
    setTableData([
      {
        id: 1,
        itemName: "Paneer Tikka",
        category: "Veg Starters",
        quantity: "2kg",
        price: "₹450",
        type: "counter",
        counterNo: 2,
        helperN: 1,
        counterNP: 200,
        unit: "kg",
      },
      {
        id: 2,
        itemName: "Butter Naan",
        category: "Bread",
        quantity: "5kg",
        price: "₹200",
        type: "plate",
        counterNo: 3,
        helperN: 2,
        counterNP: 150,
        unit: "plate",
      },
      {
        id: 3,
        itemName: "Dal Makhani",
        category: "Main Course",
        quantity: "10kg",
        price: "₹600",
        type: "counter",
        counterNo: 4,
        helperN: 1,
        counterNP: 300,
        unit: "ltr",
      },
      {
        id: 4,
        itemName: "Gulab Jamun",
        category: "Desserts",
        quantity: "50 pcs",
        price: "₹720",
        type: "plate",
        counterNo: 1,
        helperN: 0,
        counterNP: 100,
        unit: "pcs",
      },
    ]);
  }, []);

  // Reset dependent dropdown when type changes
  useEffect(() => {
    setSelectedItem("");
  }, [TochefLabourType]);

  const staticCategories = [
    { id: "all", name: "All Categories" },
    { id: "pan Asian", name: "Pan Asian" },
    { id: "welcome drink", name: "welcome drink" },
    { id: "Hot Soup Counter", name: "Hot Soup Counter" },
  ];
  const combinedCategories = [...staticCategories, ...categoryList];

  // Get label and options based on selected type
  const getDependentDropdownConfig = () => {
    switch (TochefLabourType) {
      case "Inside":
        return { label: "Chef Labour", options: chefLabourList };
      case "Outside":
        return { label: "Agency", options: agencyList };
      case "chefLabour":
        return { label: "Chef Labour", options: chefLabourList };
      default:
        return { label: "Select Type First", options: [] };
    }
  };

  const dropdownConfig = getDependentDropdownConfig();

  const filteredData = tableData.filter((item) => {
    return (
      !searchQuery ||
      item.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <Fragment>
      <Container>
        {/* Breadcrumb */}
        <div className="gap-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="RAW_MATERIAL.CHANGE_CATEGORY"
                    defaultMessage="Change Menu Item Allocation"
                  />
                ),
              },
            ]}
          />
        </div>

        {/* Two Cards in Same Row */}
        <div className="card p-4 mb-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* 1️⃣ From Category */}
            <div>
              <label className="form-label font-semibold">
                <FormattedMessage
                  id="FROM_CATEGORY"
                  defaultMessage="From Category"
                />
              </label>
              <select
                className="input w-full"
                value={fromCategory}
                onChange={(e) => setFromCategory(e.target.value)}
              >
                <option value="">Select From Category</option>
                {combinedCategories.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 2️⃣ To Type */}
            <div>
              <label className="form-label font-semibold">To Type</label>
              <select
                className="input w-full"
                value={toCategory}
                onChange={(e) => setToCategory(e.target.value)}
              >
                <option value="">Select To Type</option>
                {categoryList.map((cat) => (
                  <option key={cat.id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 4️⃣ Small / Dependent Type */}
            <div>
              <label className="form-label font-semibold">
                {dropdownConfig.label}
              </label>
              <select
                className="input w-full"
                value={selectedItem}
                onChange={(e) => setSelectedItem(e.target.value)}
                disabled={!TochefLabourType}
              >
                <option value="">
                  {TochefLabourType
                    ? `Select ${dropdownConfig.label}`
                    : "Select Type First"}
                </option>
                {dropdownConfig.options.map((item) => (
                  <option key={item.id} value={item.name}>
                    {item.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="form-label text-xs font-semibold text-gray-600">
                Fliter type
              </label>
              <select
                className="h-8 px-2 text-sm rounded-md border border-gray-300 focus:border-primary focus:ring-1 focus:ring-primary w-full"
                value={TochefLabourType}
                onChange={(e) => setToChefLabourType(e.target.value)}
              >
                <option value="">Select</option>
                <option value="Inside">Inside</option>
                <option value="Outside">Outside</option>
                <option value="chefLabour">Chef Labour</option>
              </select>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="mb-4">
          <input
            className="input w-[200px]"
            type="text"
            placeholder={intl.formatMessage({
              id: "RAW_MATERIAL.SEARCH",
              defaultMessage: "Search items...",
            })}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {resolvedTableType === "Inside" && <InsideTable data={filteredData} />}

        {resolvedTableType === "Outside" && (
          <OutsideTable data={filteredData} />
        )}

        {resolvedTableType === "Chef Labour" && (
          <ChefLabourTable data={filteredData} />
        )}
        {/* Empty state */}
        {/* Empty state */}
        {!fromCategory && (
          <div className="relative p-4 text-center text-gray-500 border rounded h-64 flex items-center justify-center">
            {/* Absolute image */}
            <img
              src={toAbsoluteUrl("/media/icons/pleassle.png")}
              alt="Empty"
              className=" absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2  max-h-[230px] dark:hidden"
            />

            {/* Text */}
            <span className="relative  mt-8 z-20">
              Please select From Category to view table
            </span>
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button className="btn btn-light">Cancel</button>
          <button className="btn btn-primary">Save Changes</button>
        </div>
      </Container>
    </Fragment>
  );
};

export default ConfigMenuItemPage;
