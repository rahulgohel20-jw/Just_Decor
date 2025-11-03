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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Tooltip title="View">
            <Link to={""}>
              <button
                className="btn btn-sm btn-icon btn-clear text-primary border border-[#E3E3E3]"
                title="View"
              >
                <i className="ki-filled ki-eye text-purple-700"></i>
              </button>
            </Link>
          </Tooltip>
        </div>
      );
    },
  },
];

export const defaultData = [
  {
    Invoice: "0001",
    CustomerName: "John ",
    plan: "E-lite",
    Amount: "₹ 35000",
  },
];
