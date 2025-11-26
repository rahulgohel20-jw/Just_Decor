import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
import { Tooltip } from "antd";

export const columns = [
  {
    accessorKey: "sr_no",
    header: ({ column }) => (
      <DataGridColumnHeader title="Sr No#" column={column} />
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataGridColumnHeader title="Role" column={column} />
    ),
  },

  {
    accessorKey: "created_date",
    header: ({ column }) => (
      <DataGridColumnHeader title="Created Date" column={column} />
    ),
  },
  {
    accessorKey: "Rights",
    headerKey: "Rights",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <button
            className=" btn btn-primary"
            onClick={() => handleOpenPermission(row.original)}
          >
            Rights
          </button>
        </div>
      );
    },
  },
];

export const defaultData = [
  {
    sr_no: "0001",
    role: "Team Member ",
    created_date: "01 Jan 2024",
  },
  {
    sr_no: "0002",
    role: "Manager ",
    created_date: "02 Jan 2024",
  },
  {
    sr_no: "0003",
    role: "Team Member ",
    created_date: "03 Jan 2024",
  },
  {
    sr_no: "0004",
    role: "Team Member ",
    created_date: "04 Jan 2024",
  },

  {
    sr_no: "0005",
    role: "Team Member ",
    created_date: "05 Jan 2024",
  },
];
