import { useState, useEffect } from "react";
import { Checkbox, Select } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";
import { GetUnitData } from "@/services/apiServices";

const { Option } = Select;

const OutsideTable = ({ data }) => {
  const [selectedRows, setSelectedRows] = useState([]);
  const [unitList, setUnitList] = useState([]);

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
          checked={data.length > 0 && selectedRows.length === data.length}
          indeterminate={
            selectedRows.length > 0 && selectedRows.length < data.length
          }
          onChange={(e) => {
            if (e.target.checked) {
              setSelectedRows(data.map((row) => row.id));
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
          defaultValue={row.original.quantity}
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
            defaultValue={row.original.price.replace("₹", "")}
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
          defaultValue={row.original.unit}
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
        const price = Number(row.original.price.replace("₹", "")) || 0;
        const total = quantity * price;

        return <span>₹{total.toFixed(2)}</span>;
      },
    },
  ];

  console.log("Selected Row IDs:", selectedRows);

  return (
    <div>
      <TableComponent columns={columns} data={data} paginationSize={10} />

      {selectedRows.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {selectedRows.length} row(s) selected
        </div>
      )}
    </div>
  );
};

export default OutsideTable;
