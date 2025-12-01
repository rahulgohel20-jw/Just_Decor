import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

export const columns = [
  {
    accessorKey: "Invoice",
    header: ({ column }) => (
      <DataGridColumnHeader title="Sr No#" column={column} />
    ),
  },
  {
    accessorKey: "CustomerName",
    header: ({ column }) => (
      <DataGridColumnHeader title="Customer Name" column={column} />
    ),
  },
  {
    accessorKey: "plan",
    header: ({ column }) => (
      <DataGridColumnHeader title="Plan" column={column} />
    ),
  },

  {
    accessorKey: "Amount",
    header: ({ column }) => (
      <DataGridColumnHeader title="Total Paid" column={column} />
    ),
  },
  {
    accessorKey: "BalanceDue",
    header: ({ column }) => (
      <DataGridColumnHeader title="Balance Due" column={column} />
    ),
  },
  {
    header: "Action",
    accessorKey: "action",
    cell: ({ row }) => {
      const id = row.original?.id;

      return (
        <div className="flex gap-2">
          {/* View Button */}
          <Tooltip title="View Invoice">
            <Link to={`/super/invoice-preview/${id}`}>
              <button className="btn btn-sm btn-icon text-primary">
                <i className="ki-filled ki-eye text-purple-700"></i>
              </button>
            </Link>
          </Tooltip>

          {/* Edit Button (opens Add Invoice with invoice id) */}
          <Tooltip title="Edit Invoice">
            <Link to={`/addInvoice?id=${id}`}>
              <button className="btn btn-sm btn-icon text-success">
                <i className="ki-filled ki-pencil text-green-600"></i>
              </button>
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

export const defaultData = [];
