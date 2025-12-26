import { useState, useEffect } from "react";
import { Checkbox, Select } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";
import { GetUnitData, GetAllContactCategory } from "@/services/apiServices";

const { Option } = Select;

const OutsideTable = ({ data = [], onDataChange, onSelectionChange }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [unitList, setUnitList] = useState([]);
  const [contactCategoryList, setContactCategoryList] = useState([]);

  // Sync prop data into local editable state
  useEffect(() => {
    setTableData(data);
  }, [data]);

  // Notify parent whenever tableData changes
  useEffect(() => {
    if (onDataChange) {
      onDataChange(tableData);
    }
  }, [tableData, onDataChange]);

  // Notify parent whenever selection changes
  useEffect(() => {
    if (onSelectionChange) {
      onSelectionChange(selectedRows);
    }
  }, [selectedRows, onSelectionChange]);

  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await GetUnitData(userId);

        const units =
          response?.data?.data?.["Unit Details"] &&
          Array.isArray(response.data.data["Unit Details"])
            ? response.data.data["Unit Details"]
            : [];

        setUnitList(units);
      } catch (err) {
        console.error("Error fetching units:", err);
        setUnitList([]);
      }
    };

    fetchUnits();
  }, []);

  useEffect(() => {
    const fetchContactCategories = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const response = await GetAllContactCategory(userId);
        const categories =
          response?.data?.data?.["Contact Category Details"] &&
          Array.isArray(response.data.data["Contact Category Details"])
            ? response.data.data["Contact Category Details"]
            : [];

        setContactCategoryList(categories);
      } catch (err) {
        console.error("Error fetching contact categories:", err);
        setContactCategoryList([]);
      }
    };

    fetchContactCategories();
  }, []);

  const columns = [
    {
      id: "select",
      header: (
        <Checkbox
          checked={
            tableData.length > 0 && selectedRows.length === tableData.length
          }
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < tableData.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(tableData.map((row) => row.id));
            } else {
              setSelectedRows([]);
            }
          }}
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={selectedRows.includes(row.original.id)}
          onChange={(e) => {
            const id = row.original.id;
            setSelectedRows((prev) =>
              e.target.checked
                ? [...prev, id]
                : prev.filter((item) => item !== id)
            );
          }}
        />
      ),
    },
    {
      accessorKey: "itemName",
      header: (
        <FormattedMessage id="RAW_MATERIAL.NAME" defaultMessage="Menu Item" />
      ),
    },
    {
      accessorKey: "category",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.CATEGORY"
          defaultMessage="Menu Category"
        />
      ),
    },
    {
      accessorKey: "type",
      header: <FormattedMessage id="RAW_MATERIAL.TYPE" defaultMessage="Type" />,
    },
    {
      accessorKey: "vendorAllocate",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.VENDOR"
          defaultMessage="Vendor Allocate"
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">
          {row.original.vendorAllocate || "-"}
        </span>
      ),
    },
    {
      accessorKey: "contactCategory",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.CONTACT_CATEGORY"
          defaultMessage="Contact Category"
        />
      ),
      cell: ({ row }) => (
        <Select
          showSearch
          className="w-[160px]"
          placeholder="Select contact category"
          value={row.original.contactCategory || undefined}
          onChange={(value) => {
            const selectedCategory = contactCategoryList.find(
              (c) => c.nameEnglish === value
            );

            setTableData((prev) =>
              prev.map((item, index) =>
                index === row.index
                  ? {
                      ...item,
                      contactCategory: value,
                      contactCategoryId: selectedCategory?.id || null,
                    }
                  : item
              )
            );
          }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {contactCategoryList.length > 0 ? (
            contactCategoryList.map((category) => (
              <Select.Option key={category.id} value={category.nameEnglish}>
                {category.nameEnglish}
              </Select.Option>
            ))
          ) : (
            <Select.Option value="" disabled>
              No categories available
            </Select.Option>
          )}
        </Select>
      ),
    },

    {
      accessorKey: "quantity",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.QUANTITY"
          defaultMessage="Quantity"
        />
      ),
      cell: ({ row }) => (
        <input
          type="number"
          className="input w-[120px]"
          value={row.original.quantity || ""}
          onChange={(e) => {
            const value = e.target.value;
            setTableData((prev) =>
              prev.map((item, index) =>
                index === row.index ? { ...item, quantity: value } : item
              )
            );
          }}
        />
      ),
    },

    {
      accessorKey: "price",
      header: (
        <FormattedMessage id="RAW_MATERIAL.PRICE" defaultMessage="Price" />
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-1">
          ₹
          <input
            type="number"
            className="input w-[120px]"
            value={row.original.price || ""}
            onChange={(e) => {
              const value = e.target.value;
              setTableData((prev) =>
                prev.map((item, index) =>
                  index === row.index ? { ...item, price: value } : item
                )
              );
            }}
          />
        </div>
      ),
    },
    {
      accessorKey: "unit",
      header: <FormattedMessage id="RAW_MATERIAL.UNIT" defaultMessage="Unit" />,
      cell: ({ row }) => (
        <Select
          showSearch
          className="w-[120px]"
          placeholder="Select unit"
          value={row.original.unit || undefined}
          onChange={(value) => {
            const selectedUnit = unitList.find((u) => u.nameEnglish === value);
            setTableData((prev) =>
              prev.map((item, index) =>
                index === row.index
                  ? { ...item, unit: value, unitId: selectedUnit?.id || 0 }
                  : item
              )
            );
          }}
          optionFilterProp="children"
          filterOption={(input, option) =>
            option.children.toLowerCase().includes(input.toLowerCase())
          }
        >
          {unitList.length > 0 ? (
            unitList.map((unit) => (
              <Option key={unit.id} value={unit.nameEnglish}>
                {unit.nameEnglish}
              </Option>
            ))
          ) : (
            <Option value="" disabled>
              No units available
            </Option>
          )}
        </Select>
      ),
    },
    {
      accessorKey: "totalPrice",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.TOTAL_PRICE"
          defaultMessage="Total Price"
        />
      ),
      cell: ({ row }) => {
        const quantity = Number(row.original.quantity) || 0;
        const price = Number(row.original.price) || 0;
        const total = quantity * price;

        return <span>₹{total.toFixed(2)}</span>;
      },
    },
  ];

  return (
    <div>
      <TableComponent columns={columns} data={tableData} paginationSize={10} />

      {selectedRows.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {selectedRows.length} row(s) selected
        </div>
      )}
    </div>
  );
};

export default OutsideTable;
