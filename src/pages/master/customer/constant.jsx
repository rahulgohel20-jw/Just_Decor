import { Tooltip } from "antd";

export const columns = (onEdit, onDelete) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "customer",
    header: "Customer Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "address",
    header: "Address",
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "contact_type",
    header: "Contact Type",
    meta: {
      headerClassName: "w-[18%]",
      cellClassName: "w-[18%]",
    },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "mobile",
    header: "Mobile No",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "gst",
    header: "GST No",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },

  {
    accessorKey: "birthdate",
    header: "Birthdate",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "document",
    header: "Document",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Customer">
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Edit"
              onClick={() => onEdit(row.original)}
            >
              <i className="ki-filled ki-notepad-edit text-primary"></i>
            </button>
          </Tooltip>

          <Tooltip title="Delete">
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={() => onDelete(row.original.customerid)}
            >
              <i className="ki-filled ki-trash  text-danger"></i>
            </button>
            {/* </Link> */}
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
