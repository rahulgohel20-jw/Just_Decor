import { Tooltip, Popconfirm, message } from "antd";

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
    accessorKey: "image",
    header: "Image",
    cell: ({ row }) => {
      return (
        <img
          src={row.original.image || "/no-image.png"} // fallback image if empty
          alt={row.original.name}
          className="w-12 h-12 object-cover rounded-md"
        />
      );
    },
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
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
    accessorKey: "category",
    header: "Menu Item Category",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
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
            onstatus(row.original.id, row.original.status);
            message.success("✅ Status updated successfully!");
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
        <div className="flex items-center  gap-1">
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
              onClick={() => onDelete(row.original.id)}
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

export const categoryData = [];

export const defaultData = [];
