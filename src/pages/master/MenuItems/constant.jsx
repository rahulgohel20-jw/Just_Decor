import { Tooltip } from "antd";

export const columns = (onEdit, onDelete) => [
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
    header: "Category",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "item",
    header: "Item",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
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
              onClick={() => onDelete(row.original.mealid)}
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
  { id: 1, category: "Main" },
  { id: 2, category: "Middel" },
  { id: 3, category: "Last" },
  { id: 4, category: "Police" },
  { id: 5, category: "QA" },
];

export const defaultData = [
  { sr_no: 1, category: "Main", item: 'Dashboard'},
  { sr_no: 2, category: "Middel", item: 'TEST'},
  { sr_no: 3, category: "Last", item: "day"},
  { sr_no: 4, category: "Police", item:"SP"},
  { sr_no: 5, category: "QA", item: "Test JC" },
];