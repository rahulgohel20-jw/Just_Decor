import { useState } from "react";
import { Checkbox } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";

const InsideTable = ({ data = [] }) => {
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
          onChange={(e) =>
            setSelectedRows(e.target.checked ? data.map((row) => row.id) : [])
          }
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
      id: "menuItem",
      accessorKey: "menuItem",
      header: (
        <FormattedMessage id="RAW_MATERIAL.NAME" defaultMessage="Menu Item" />
      ),
    },

    {
      id: "category",
      accessorKey: "category",
      header: (
        <FormattedMessage
          id="RAW_MATERIAL.CATEGORY"
          defaultMessage="Menu Category"
        />
      ),
    },

    {
      id: "typeNo",
      accessorKey: "typeNo",
      header: (
        <FormattedMessage id="RAW_MATERIAL.TYPE_NO" defaultMessage="Type" />
      ),
      cell: ({ getValue }) => (
        <span className="text-sm text-gray-700">{getValue() ?? "-"}</span>
      ),
    },
  ];

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

export default InsideTable;
