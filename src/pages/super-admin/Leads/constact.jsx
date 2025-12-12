import { Popconfirm, Tooltip } from "antd";
import { FormattedMessage } from "react-intl";

export const columns = (onEdit, onDelete, onStatus, onView) => [
  {
    accessorKey: "leadCode",
    header: "Lead Code",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "clientName",
    header: "Client Name",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "leadType",
    header: "Lead Type",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "leadAssign",
    header: "Lead Assign",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "productType",
    header: "Product Type",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "leadStatus",
    header: "Lead Status",
    cell: ({ row }) => {
      const status = row.original.leadStatus;

      const getStatusStyle = (status) => {
        switch (status?.toLowerCase()) {
          case "pending":
            return "bg-yellow-100 text-yellow-700 border-yellow-300";
          case "confirmed":
            return "bg-green-100 text-green-700 border-green-300";
          case "cancel":
          case "cancelled":
            return "bg-red-100 text-red-700 border-red-300";
          case "open":
            return "bg-blue-100 text-blue-700 border-blue-300";
          case "closed":
            return "bg-gray-100 text-gray-700 border-gray-300";
          default:
            return "bg-gray-100 text-gray-600 border-gray-300";
        }
      };

      return (
        <span
          className={`px-3 py-1 text-xs font-medium rounded-full border ${getStatusStyle(status)}`}
        >
          {status || "N/A"}
        </span>
      );
    },
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },

  // ACTION BUTTONS
  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          {/* View Lead */}
          <Tooltip title="View Lead">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onView && onView(row.original)}
            >
              <i className="ki-filled ki-eye text-primary"></i>
            </button>
          </Tooltip>

          {/* Edit Lead */}
          <Tooltip title="Edit Lead">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onEdit && onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-success"></i>
            </button>
          </Tooltip>

          {/* Delete Lead */}
          <Tooltip title="Delete Lead">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onDelete && onDelete(row.original.leadId)}
            >
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];
