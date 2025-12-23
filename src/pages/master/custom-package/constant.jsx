import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";


// ✅ Use onEdit callback instead of navigate
export const columns = (onEdit, onDelete, onStatusChange) => [
  {
    accessorKey: "sr_no",
    header: <FormattedMessage id="COMMON.SR_NO" defaultMessage="Sr No" />,
    size: 60,
  },
  {
    accessorKey: "package_name",
    header: (
      <FormattedMessage id="USER.MASTER.EVENT_TYPE" defaultMessage="Name" />
    ),
    size: 200,
  },
  {
    accessorKey: "price",
    header: <FormattedMessage id="PACKAGE.PRICE" defaultMessage="price" />,
    size: 120,
    cell: ({ getValue }) => <span>₹{getValue() ?? 0}</span>,
  },
  {
    accessorKey: "total_items",
    header: (
      <FormattedMessage id="PACKAGE.TOTAL_ITEMS" defaultMessage="Total Item" />
    ),
    size: 140,
  },
  {
    accessorKey: "isActive",
    header: <FormattedMessage id="COMMON.STATUS" defaultMessage="Status" />,

    size: 120,
    cell: ({ row }) => (
      <Switch
        checked={!!row.original.isActive}
        onCheckedChange={(checked) =>
          onStatusChange(row.original.packageid, checked ? 1 : 0)
        }
      />
    ),
  },

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Action" />,
    cell: ({ row }) => {
      // ✅ Comprehensive debugging

      const packageId = row.original.packageid;

      return (
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Package">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => {
                console.log("📝 Edit clicked! packageId:", packageId);
                console.log("📝 Type of packageId:", typeof packageId);
                if (packageId === undefined || packageId === null) {
                  console.error("❌ Package ID is undefined/null!");
                  console.error(
                    "Full row.original:",
                    JSON.stringify(row.original, null, 2)
                  );
                  alert(
                    "Error: Package ID is missing. Check console for details."
                  );
                  return;
                }
                onEdit(packageId);
              }}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => {
                console.log("🗑️ Delete clicked! packageId:", packageId);
                if (packageId === undefined || packageId === null) {
                  console.error("❌ Package ID is undefined/null!");
                  alert(
                    "Error: Package ID is missing. Check console for details."
                  );
                  return;
                }
                onDelete(packageId);
              }}
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