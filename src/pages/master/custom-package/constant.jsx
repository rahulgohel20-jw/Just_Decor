import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popconfirm, Tooltip } from "antd";

// ✅ TanStack v8 compatible columns
export const columns = (onEdit, onDelete, onStatusChange) => [
  {
    accessorKey: "sr_no",
    header: "#",
    size: 60,
  },
  {
    accessorKey: "package_name",
    header: "Name",
    size: 200,
  },
  {
    accessorKey: "price",
    header: "Price",
    size: 120,
    cell: ({ getValue }) => <span>₹{getValue() ?? 0}</span>,
  },
  {
    accessorKey: "total_items",
    header: "Total Items",
    size: 140,
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => (
      <Switch
        checked={!!row.original.isActive}
        onCheckedChange={(checked) =>
          onStatusChange(row.original.packageid, checked ? 1 : 0)
        }
      />
    ),
    size: 120,
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
              onClick={() => onDelete(row.original.contacttypeid)}
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
