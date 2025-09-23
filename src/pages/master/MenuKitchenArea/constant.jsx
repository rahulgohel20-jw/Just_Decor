import { Tooltip, Popconfirm, message } from "antd";

export const columns = (onEdit, onDelete, onToggleStatus) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "category",
    header: "Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      const isActive = row.original.isActive; // from formatted data
      return (
        <Popconfirm
          title="Are you sure to change this status?"
          onConfirm={() => {
            onToggleStatus(row.original.id, isActive ? true : false);
            message.success("Status updated successfully!");
          }}
          onCancel={() => console.log("Cancelled")}
          okText="Yes"
          cancelText="No"
        >
          <div className="flex justify-center items-center gap-1 cursor-pointer">
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
          <Tooltip title="Edit Kitchen Area">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onDelete(row.original.raw?.id)}
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
