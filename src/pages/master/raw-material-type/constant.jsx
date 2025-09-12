import { Popconfirm, Tooltip, message } from "antd";

export const columns = (onEdit, onDelete, onstatus) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "name",
    header: "Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },

  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <Popconfirm
          title={`Are you sure you want to ${
            row.original.status ? "Deactivate" : "Activate"
          } this menu item?`}
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onstatus(row.original.rawid, row.original.status);
            message.success("Status updated successfully!");
          }}
        >
          <div className="flex items-center gap-1 cursor-pointer">
            <label className="switch switch-lg">
              <input type="checkbox" checked={row.original.status} readOnly />
            </label>
          </div>
        </Popconfirm>
      );
    },

    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },

  {
    accessorKey: "action",
    header: "Action",
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
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => onDelete(row.original.rawid)}
            >
              <i className="ki-filled ki-trash  text-danger"></i>
            </button>
            {/* </Link> */}
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
  { sr_no: 1, name: "Friend" },
  { sr_no: 2, name: "Colleague" },
  { sr_no: 3, name: "Relative" },
  { sr_no: 4, name: "Business Manager" },
  { sr_no: 5, name: "Friend" },
  { sr_no: 6, name: "Friend" },
  { sr_no: 7, name: "Colleague" },
  { sr_no: 8, name: "Sales Man" },
];
