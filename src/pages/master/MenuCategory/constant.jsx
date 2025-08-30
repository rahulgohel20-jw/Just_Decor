import { Popconfirm, Tooltip } from "antd";
export const columns = (onEdit, onDelete, onStatus) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "imagePath",
    header: "Image",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "nameEnglish",
    header: "Category",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "price",
    header: "Price",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "sequence",
    header: "Priority",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-1">
          <Popconfirm
              title="Are you sure to change this status?"
              onConfirm={() => onStatus(row.original.id , row.original.isActive ? false: true)
              }
              onCancel={() => console.log('Cancelled')}
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
          <Popconfirm
              title="Are you sure to delete this item?"
              onConfirm={() => onDelete(row.original.id)
              }
              onCancel={() => console.log('Cancelled')}
              okText="Yes"
              cancelText="No"
            >
          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
            >
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
