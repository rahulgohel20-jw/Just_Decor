import { useState } from "react";
import { Checkbox } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";

const InsideTable = ({ data }) => {
  const [selectedRows, setSelectedRows] = useState([]);

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
      accessorKey: "quantity",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.QUANTITY"
          defaultMessage="Quantity"
        />
      ),
      cell: ({ row }) => (
        <input className="input w-full" defaultValue={row.original.quantity} />
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
            className="input w-full"
            defaultValue={row.original.price.replace("₹", "")}
          />
        </div>
      ),
    },
  ];

  // Optional: Log selected rows for debugging
  console.log("Selected Row IDs:", selectedRows);

  return (
    <div>
      <TableComponent columns={columns} data={data} paginationSize={10} />

      {/* Optional: Display selected count */}
      {selectedRows.length > 0 && (
        <div className="mt-2 text-sm text-gray-600">
          {selectedRows.length} row(s) selected
        </div>
      )}
    </div>
  );
};

export default InsideTable;
