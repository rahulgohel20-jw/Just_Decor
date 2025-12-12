import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete, onStatus) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No#" />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "interaction_name",
    header: (
      <FormattedMessage
        id="USER.MASTER.INTERACTION_NAME"
        defaultMessage="Interaction Name"
      />
    ),
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "interaction_type",
    header: (
      <FormattedMessage
        id="USER.MASTER.INTERACTION_TYPE"
        defaultMessage="Interaction Type"
      />
    ),
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "isActive",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Popconfirm
            title="Are you sure to change this status?"
            onConfirm={() =>
              onStatus(
                row.original.interactionId,
                row.original.isActive ? false : true
              )
            }
            onCancel={() => console.log("Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                defaultChecked={row.original.isActive}
                readOnly
                checked={row.original.isActive}
              />
            </label>
          </Popconfirm>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Interaction">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          {/* <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => onDelete(row.original.interactionId)}
            >
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip> */}
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
  { sr_no: 1, interaction_name: "Phone Call" },
  { sr_no: 2, interaction_name: "Email" },
  { sr_no: 3, interaction_name: "Meeting" },
  { sr_no: 4, interaction_name: "Video Conference" },
  { sr_no: 5, interaction_name: "Chat" },
  { sr_no: 6, interaction_name: "Site Visit" },
  { sr_no: 7, interaction_name: "Follow-up" },
  { sr_no: 8, interaction_name: "Presentation" },
];
