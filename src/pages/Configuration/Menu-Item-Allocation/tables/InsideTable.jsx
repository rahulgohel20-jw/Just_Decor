import { useState, useEffect } from "react";
import { Checkbox } from "antd";
import { TableComponent } from "@/components/table/TableComponent";
import { FormattedMessage } from "react-intl";

const InsideTable = ({ data = [], onDataChange, onSelectionChange }) => {
  const [tableData, setTableData] = useState([]);
  const [selectedRows, setSelectedRows] = useState([]);

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
          onChange={(e) =>
            setSelectedRows(
              e.target.checked ? tableData.map((row) => row.id) : []
            )
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
      accessorKey: "remarks",
      header: (
        <FormattedMessage id="RAW_MATERIAL.REMAKS" defaultMessage="Remarks" />
      ),
      cell: ({ row }) => (
        <input
          type="text"
          className="input w-full"
          placeholder="Enter remarks"
          value={row.original.remarks ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setTableData((prev) =>
              prev.map((item, index) =>
                index === row.index ? { ...item, remarks: value } : item
              )
            );
          }}
        />
      ),
    },

    {
      accessorKey: "number",
      header: (
        <FormattedMessage id="RAW_MATERIAL.TYPE_NO" defaultMessage="number" />
      ),
      cell: ({ row }) => (
        <input
          type="number"
          className="input w-[200px]"
          placeholder="Enter number"
          min={0}
          step={1}
          value={row.original.typeNo ?? ""}
          onChange={(e) => {
            const value = e.target.value;
            setTableData((prev) =>
              prev.map((item, index) =>
                index === row.index
                  ? { ...item, typeNo: value === "" ? "" : Number(value) }
                  : item
              )
            );
          }}
        />
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
      accessorKey: "type",
      header: <FormattedMessage id="RAW_MATERIAL.TYPE" defaultMessage="Type" />,
      cell: ({ row }) => row.original.type || "Inside",
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

export default InsideTable;
