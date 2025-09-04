import { Tooltip, Popconfirm } from "antd";

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
    const isActive = row.original.isActive;   // from formatted data
    return (
      <div className="flex items-center gap-1">
        <label className="switch switch-lg">
          <input
            type="checkbox"
            checked={!!isActive}   // reflect actual API value
            onChange={() =>
              onToggleStatus(row.original.id, isActive)  // pass current
            }
          />
        </label>
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

          <Popconfirm
            title="Are you sure to delete this kitchen area?"
            onConfirm={() => onDelete(row.original.raw?.id)}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <button className="btn btn-sm btn-icon btn-clear">
                <i className="ki-filled ki-trash text-danger"></i>
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
