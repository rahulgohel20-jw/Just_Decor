import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
export const columns = [
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataGridColumnHeader title="Role" column={column} />
    ),
  },
  {
    accessorKey: "access",
    header: ({ column }) => (
      <DataGridColumnHeader title="Access" column={column} />
    ),
  },
  {
    accessorKey: "users",
    header: ({ column }) => (
      <DataGridColumnHeader title="Users" column={column} />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <button
            className="btn btn-sm btn-icon btn-clear"
            title="Edit"
            onClick={() => cell.row.original.handleModalOpen()}
          >
            <i className="ki-filled ki-notepad-edit"></i>
          </button>
          <button
            className="btn btn-sm btn-icon btn-clear text-danger"
            title="Delete"
          >
            <i className="ki-filled ki-trash"></i>
          </button>
        </div>
      );
    },
  },
];
export const defaultData = [
  {
    role: "Developer",
    access: "Task Management",
    users: "👁️ 2",
  },
  {
    role: "Designer",
    access: "Design System",
    users: "👁️ 1",
  },
  {
    role: "Project Manager",
    access: "Reports",
    users: "👁️ 1",
  },
  {
    role: "Tester",
    access: "Bug Tracking",
    users: "👁️ 2",
  },
];
