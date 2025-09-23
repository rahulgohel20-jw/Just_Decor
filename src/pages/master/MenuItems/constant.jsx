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

export const categoryData = [
  { id: 1, category: "LABENESE COUNTER" },
  { id: 2, category: "WELCOME DRINKS AND SPRITZERS" },
  { id: 3, category: "Last" },
  { id: 4, category: "Police" },
  { id: 5, category: "QA" },
];

export const defaultData = [
  {
    sr_no: 1,
    name: "COLLEGIAN BHEL",
    category: "LABENESE COUNTER",
    image: "",
    priority: "5",
    status: 1,
  },
  {
    sr_no: 2,
    name: "WELCOME DRINKS AND SPRITZERS",
    category: "WELCOME DRINKS AND SPRITZERS",
    image: "",
    priority: "38",
    status: 1,
  },
  {
    sr_no: 3,
    name: "FINGER FOOD STARTERS",
    category: "Last",
    image: "",
    priority: "27",
    status: 0,
  },
  {
    sr_no: 4,
    name: "STYLISH BAR BE QUE",
    category: "Police",
    image: "",
    priority: "25",
    status: 1,
  },
  {
    sr_no: 5,
    name: "EXOTIC COUNTER",
    category: "TEST",
    image: "",
    priority: "88",
    status: 0,
  },
];
