import { Popconfirm, Tooltip, Checkbox } from "antd";
import { RotateCcw } from "lucide-react";
import { FormattedMessage } from "react-intl";

export const columns = (
  onEdit,
  onDelete,
  onStatus,
  onView,
  onFollowUp,
  selectedRows,
  onSelectRow,
  onSelectAll,
  totalRows,
  navigate,
) => [
  {
    id: "select",
    header: () => (
      <Checkbox
        checked={selectedRows.length > 0 && selectedRows.length === totalRows}
        indeterminate={
          selectedRows.length > 0 && selectedRows.length < totalRows
        }
        onChange={(e) => onSelectAll(e.target.checked)}
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={selectedRows.includes(row.original.leadId)}
        onChange={(e) => onSelectRow(row.original.leadId, e.target.checked)}
      />
    ),
    meta: { headerClassName: "w-[5%]", cellClassName: "w-[5%]" },
  },
  {
    accessorKey: "sr_no",
    header: "Sr No",
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "leadCode",
    header: "Lead Code",
    cell: ({ row }) => {
      const leadCode = row.original.leadCode;
      const leadId = row.original.leadId || row.original.id;

      return (
        <Tooltip title="Click to view lead details">
          <button
            onClick={() => navigate(`/super-leads/lead-details/${leadId}`)}
            className="text-[#005BA8] hover:text-[#005BA8] font-medium hover:underline cursor-pointer transition-colors"
          >
            {leadCode}
          </button>
        </Tooltip>
      );
    },
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
    id: "leadStatus",
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

  {
    accessorKey: "action",
    header: <FormattedMessage id="COMMON.ACTIONS" defaultMessage="Actions" />,
    cell: ({ row }) => {
      const leadStatus = row.original.leadStatus?.toLowerCase();
      const isConfirmed = leadStatus === "confirmed";

      return (
        <div className="flex items-center gap-1">
          <Tooltip title="Follow Up">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onFollowUp && onFollowUp(row.original)}
            >
              <i className="ki-filled ki-calendar text-teal-700"></i>
            </button>
          </Tooltip>

          <Tooltip title="Edit Lead">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => onEdit && onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-blue-700"></i>
            </button>
          </Tooltip>

          {/* Only show Convert button if status is confirmed */}
          {isConfirmed && (
            <Tooltip title="Convert Lead to Member">
              <button
                className="btn btn-sm btn-icon btn-clear"
                onClick={() => {
                  navigate("/auth/signup", {
                    state: { leadData: row.original },
                  });
                }}
              >
                <RotateCcw size={18} className="text-gray-700" />
              </button>
            </Tooltip>
          )}

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
