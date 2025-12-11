import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (
  handleEditRow,
  handleDeleteRow,
  selectionHandlers = {}
) => {
  const {
    onSelectAll = () => {},
    onRowSelect = () => {},
    isRowSelected = () => false,
    isAllSelected = false,
  } = selectionHandlers;

  return [
    {
      accessorKey: "select",
      header: () => (
        <input
          type="checkbox"
          checked={isAllSelected}
          onChange={(e) => onSelectAll(e.target.checked)}
          className="cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <input
          type="checkbox"
          checked={isRowSelected(row.original)}
          onChange={(e) => onRowSelect(row.original, e.target.checked)}
          className="cursor-pointer"
        />
      ),
      meta: {
        headerClassName: "w-[4%]",
        cellClassName: "w-[4%]",
      },
    },
    {
      accessorKey: "sr_no",
      header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
      meta: {
        headerClassName: "w-[4%]",
        cellClassName: "w-[4%]",
      },
    },
    {
      accessorKey: "category",
      header: (
        <FormattedMessage id="COMMON.CATEGORY" defaultMessage="Category" />
      ),
      meta: {
        headerClassName: "w-[8%]",
        cellClassName: "w-[8%]",
      },
    },
    {
      accessorKey: "name",
      header: <FormattedMessage id="COMMON.NAME" defaultMessage="Name" />,
      meta: {
        headerClassName: "w-[8%]",
        cellClassName: "w-[8%]",
      },
    },
    {
      accessorKey: "weight",
      header: (
        <FormattedMessage
          id="MASTER.MENU_ITEM_WEIGHT"
          defaultMessage="Weight"
        />
      ),
      meta: {
        headerClassName: "w-[8%]",
        cellClassName: "w-[8%]",
      },
    },
    {
      accessorKey: "unit",
      header: <FormattedMessage id="COMMON.UNIT" defaultMessage="Unit" />,
      meta: {
        headerClassName: "w-[8%]",
        cellClassName: "w-[8%]",
      },
    },
    {
      accessorKey: "rate",
      header: <FormattedMessage id="COMMON.RATE" defaultMessage="Rate" />,
      meta: {
        headerClassName: "w-[8%]",
        cellClassName: "w-[8%]",
      },
    },
    {
      accessorKey: "action",
      header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
      cell: ({ row }) => {
        const rowData = row.original;
        return (
          <div className="flex items-center gap-1">
            <Tooltip title="Edit" className="cursor-pointer">
              <button
                className="btn btn-sm btn-icon btn-clear"
                onClick={() => handleEditRow(rowData)}
              >
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Tooltip>

            <Tooltip title="Delete">
              <button
                className="btn btn-sm btn-icon btn-clear"
                onClick={() => handleDeleteRow(rowData)}
              >
                <i className="ki-filled ki-trash text-danger"></i>
              </button>
            </Tooltip>
          </div>
        );
      },
      meta: {
        headerClassName: "w-[10%]",
        cellClassName: "w-[10%]",
      },
    },
  ];
};

export const defaultData = [];
