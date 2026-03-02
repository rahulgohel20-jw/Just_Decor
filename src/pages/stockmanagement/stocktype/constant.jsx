import { Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No" />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "type_name",  
    header: (
      <FormattedMessage
        id="USER.MASTER.TYPE_NAME"
        defaultMessage="Type Name"
      />
    ),
    meta: {
      headerClassName: "w-[18%]",
      cellClassName: "w-[18%]",
    },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Stock Type">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => onDelete(row.original.stocktypeid)}  
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

export const defaultData = [
  { sr_no: 1, type_name: "Raw Material", stocktypeid: 1 },
  { sr_no: 2, type_name: "Finished Goods", stocktypeid: 2 },
  { sr_no: 3, type_name: "Semi-Finished", stocktypeid: 3 },
  { sr_no: 4, type_name: "Consumables", stocktypeid: 4 },
  { sr_no: 5, type_name: "Spare Parts", stocktypeid: 5 },
];