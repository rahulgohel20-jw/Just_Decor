import { Form, Popconfirm, Tooltip, message } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete, onstatus) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr. No." />,
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
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
    accessorKey: "createdAt",

    header: <FormattedMessage id="COMMON.NAME" defaultMessage="Theme" />,
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "namePlate",

    header: (
      <FormattedMessage id="COMMON.NAME" defaultMessage="Name Plate Type" />
    ),
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "isDate",

    header: (
      <FormattedMessage id="COMMON.NAME" defaultMessage="Date Type" />
    ),
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
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Contact">
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
              onClick={() => onDelete(row.original.rawid)}
            >
              <i className="ki-filled ki-trash  text-danger"></i>
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
  { sr_no: 1, name: "Friend", CreatedAt: "12-05-2024" },
  { sr_no: 2, name: "Colleague", CreatedAt: "12-05-2024" },
  { sr_no: 3, name: "Relative" },
  { sr_no: 4, name: "Business Manager" },
  { sr_no: 5, name: "Friend" },
  { sr_no: 6, name: "Friend" },
  { sr_no: 7, name: "Colleague" },
  { sr_no: 8, name: "Sales Man" },
];
