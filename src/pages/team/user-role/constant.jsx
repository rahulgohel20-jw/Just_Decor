import { DataGridColumnHeader } from "@/components";
import { EyeIcon, KeySquareIcon } from "lucide-react";
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
    cell: ({ cell }) => {
      return (
        <div className="flex items-center gap-2">
          <EyeIcon className="h-4 w-4 text-gray-500 hover:text-gray-700 cursor-pointer" />
          <span>{cell.getValue()}</span>
        </div>
      );
    },
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
            className="btn btn-sm btn-icon btn-clear"
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
    users: "2",
  },
  {
    role: "Designer",
    access: "Design System",
    users: "1",
  },
  {
    role: "Project Manager",
    access: "Reports",
    users: "1",
  },
  {
    role: "Tester",
    access: "Bug Tracking",
    users: "2",
  },
];
