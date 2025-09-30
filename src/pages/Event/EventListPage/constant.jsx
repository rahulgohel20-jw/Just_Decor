import { Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import { useNavigate } from "react-router-dom";

export const columns = (onDelete, viewEvent, openMenuReport) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "event_id",
    header: "Event Code",
    meta: {
      headerClassName: "w-[9%]",
      cellClassName: "w-[9%]",
    },
  },
  {
    accessorKey: "event_type",
    header: "Event Name",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "event_date",
    header: "Event Date & Time",
    meta: {
      headerClassName: "w-[20%]",
      cellClassName: "w-[20%]",
    },
  },

  {
    accessorKey: "customer",
    header: "Customer",
    meta: {
      headerClassName: "w-[18%]",
      cellClassName: "w-[18%]",
    },
  },
  {
    accessorKey: "invoice",
    header: "Invoice",
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },
  {
    accessorKey: "quotation",
    header: "Quotation",
    cell: ({ cell }) => cell.getValue(),
    meta: {
      headerClassName: "w-[6%] text-center",
      cellClassName: "w-[6%] text-center",
    },
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const navigate = useNavigate();
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="View Event">
            <button
              className="btn btn-sm btn-icon btn-clear"
              onClick={() => viewEvent(row.original.eventid)}
              title="View"
            >
              <i className="ki-filled ki-eye text-success"></i>
            </button>
          </Tooltip>
          <Tooltip className="cursor-pointer" title="Edit Event">
            <Link to={`/edit-event/${row.original.eventid}`}>
              <button className="btn btn-sm btn-icon btn-clear" title="Edit">
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Link>
          </Tooltip>
          <Popconfirm
            title="Are you sure to copy this event?"
            onConfirm={() =>
              navigate(`/edit-event/${row.original.eventid}/copy`)
            }
            onCancel={() => console.log("Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <button className="btn btn-sm btn-icon btn-clear" title="Copy">
              <i className="ki-filled ki-copy text-success"></i>
            </button>
          </Popconfirm>
          <Tooltip title="Delete Event">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Remove"
              onClick={() => onDelete(row.original.eventid)}
            >
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>

          <Tooltip title="Menu Preparation">
            <Link to={`/menu-preparation/${row.original.eventid}`}>
              <button
                className="btn btn-sm btn-icon btn-clear"
                title="Menu Preparation"
              >
                <i className="ki-filled ki-notepad text-warning"></i>
              </button>
            </Link>
          </Tooltip>

          <Tooltip title="Menu Allocation">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Menu Allocation"
              onClick={underConstruction}
            >
              <i className="ki-filled ki-grid  text-info"></i>
            </button>
          </Tooltip>
          <Tooltip title="Menu Report">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Menu Report"
              onClick={() => openMenuReport(row.original.eventid)}
            >
              <i className="ki-filled ki-notepad text-gray-500"></i>
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
