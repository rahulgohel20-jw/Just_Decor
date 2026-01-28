import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete, onStatus) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "role_name",
    header: <FormattedMessage id="COMMON.ROLE_NAME" defaultMessage="Name" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-1">
          <Tooltip className="cursor-pointer" title="Edit Role">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title=""
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>
          <Popconfirm
            title="Are you sure to delete this item?"
            onConfirm={() => onDelete(row.original.roleId)}
            onCancel={() => console.log("Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <button className="btn btn-sm btn-icon btn-clear" title="">
                <i className="ki-filled ki-trash  text-danger"></i>
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
];
