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
        <div className="flex items-center  gap-1">
          <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                defaultChecked={row.original.status}
                readOnly
                checked={row.original.status}
                // onChange={() => }
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

export const defaultData = [
  { sr_no: 1, category: "BANGALI SWEETS" , status: 1},
  { sr_no: 2, category: "LIVE SWEETS", status:0 },
  { sr_no: 2, category: "NONE", status:1 },
];
