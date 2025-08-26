import { Popconfirm, Tooltip, message } from "antd";
import { DeleteFunctionById } from "@/services/apiServices";

export const columns = ({ fetchFunctions, setTableData }) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "function_name",
    header: "Function Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "start_time",
    header: "Start Time",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "end_time",
    header: "End Time",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const handleDelete = () => {
        const id = row.original.id; // ✅ make sure your API data has `id`
        DeleteFunctionById(id)
          .then(() => {
            message.success("Function deleted successfully!");
            fetchFunctions(); // refresh table
          })
          .catch(() => {
            message.error("Failed to delete function");
          });
      };

      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Function">
            <button className="btn btn-sm btn-icon btn-clear" title="Edit">
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Popconfirm
            title="Are you sure to delete this function?"
            onConfirm={handleDelete}
            okText="Yes"
            cancelText="No"
          >
            <Tooltip title="Delete">
              <button className="btn btn-sm btn-icon btn-clear" title="Delete">
                <i className="ki-filled ki-trash text-danger"></i>
              </button>
            </Tooltip>
          </Popconfirm>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
];
