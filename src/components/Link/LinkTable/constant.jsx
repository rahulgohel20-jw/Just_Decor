import { DataGridColumnHeader } from "@/components";
import { Tooltip } from "antd";
export const columns = [
  {
    accessorKey: "link_name",
    header: ({ column }) => (
      <DataGridColumnHeader title="Link Name" column={column} />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataGridColumnHeader title="Description" column={column} />
    ),
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataGridColumnHeader title="Url" column={column} />
    ),
  },
  {
    accessorKey: "attachments",
    header: ({ column }) => (
      <DataGridColumnHeader title="Attachments" column={column} />
    ),
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip title="Copy">
            <button
              className="btn btn-sm btn-icon btn-clear text-success"
              title="Copy"
            >
              <i className="ki-filled ki-copy"></i>
            </button>
          </Tooltip>
          <Tooltip title="Edit">
            <button
              className="btn btn-sm btn-icon btn-clear text-primary"
              title="Edit"
              onClick={() => cell.row.original.handleModalOpen()}
            >
              <i className="ki-filled ki-notepad-edit"></i>
            </button>
          </Tooltip>
          <Tooltip title="Delete">
            <button
              className="btn btn-sm btn-icon btn-clear text-danger"
              title="Delete"
            >
              <i className="ki-filled ki-trash"></i>
            </button>
          </Tooltip>
        </div>
      );
    },
  },
];
