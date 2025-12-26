import { useState, useEffect } from "react";
import { Checkbox, Select } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";
import { GetUnitData } from "@/services/apiServices";

const { Option } = Select;

const ChefLabourTable = ({ data = [], onDataChange, onSelectionChange }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);
  const [unitList, setUnitList] = useState([]);

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

  // Fetch units on mount
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
      accessorKey: "menuItem",
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
      cell: ({ row }) => row.original.type || "cheflabour",
    },
    {
      accessorKey: "allocationType",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.TYPE"
          defaultMessage="AllocationType"
        />
      ),
      cell: ({ row }) => (
        <span className="text-sm text-gray-700">Plate Wise</span>
      ),
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
      id: "counter",
      header: () => (
        <div className="text-center">
          <div className="font-semibold">Quantity</div>
          <div className="grid grid-cols-2 text-xs text-gray-500 mt-1">
            <span>No</span>
            <span>Unit</span>
          </div>
        </div>
      ),
      cell: ({ row }) => (
        <div className="grid grid-cols-2 gap-2">
          <input
            className="input w-[120px]"
            type="number"
            placeholder="No"
            value={row.original.counterNo || ""}
            onChange={(e) => {
              const value = e.target.value;
              setTableData((prev) =>
                prev.map((item, index) =>
                  index === row.index ? { ...item, counterNo: value } : item
                )
              );
            }}
          />
          <Select
            showSearch
            className="w-[120px]"
            placeholder="Select unit"
            value={row.original.unit || undefined}
            onChange={(value) => {
              const selectedUnit = unitList.find(
                (u) => u.nameEnglish === value
              );
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
        </div>
      ),
    },
    {
      id: "helper",
      header: () => (
        <div className="text-center">
          <div className="font-semibold">Price</div>
          <div className="grid  text-xs text-gray-500 mt-1"></div>
        </div>
      ),
      cell: ({ row }) => (
        <div className="grid gap-2">
          <input
            className="input"
            type="number"
            placeholder="Price"
            value={row.original.pricePerLabour || ""}
            onChange={(e) => {
              const value = e.target.value;
              setTableData((prev) =>
                prev.map((item, index) =>
                  index === row.index
                    ? { ...item, pricePerLabour: value }
                    : item
                )
              );
            }}
          />
        </div>
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
        const quantity = Number(row.original.counterNo) || 0;
        const price = Number(row.original.pricePerLabour) || 0;
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

export default ChefLabourTable;
