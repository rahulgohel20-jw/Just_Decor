import { Tooltip, Popconfirm, message } from "antd";
import { FormattedMessage } from "react-intl";
import { YesNoIcon } from "./YesNoIcon";

export const columns = (setSelectedRow, setIsModalOpen, onDelete) => [
  {
    accessorKey: "sr_no",
    header: "Sr No",
  },
  {
    accessorKey: "mappingName",
    header: "Template Name",
  },
  {
    accessorKey: "moduleName",
    header: "Module Name",
  },

  {
    accessorKey: "isCategorySlogan",
    header: "Category Slogan",
    cell: ({ row }) => <YesNoIcon value={row.original.isCategorySlogan} />,
  },
  {
    accessorKey: "isCategoryInstruction",
    header: "Category Instruction",
    cell: ({ row }) => <YesNoIcon value={row.original.isCategoryInstruction} />,
  },
  {
    accessorKey: "isCategoryImage",
    header: "Category Image",
    cell: ({ row }) => <YesNoIcon value={row.original.isCategoryImage} />,
  },
  {
    accessorKey: "isItemSlogan",
    header: "Item Slogan",
    cell: ({ row }) => <YesNoIcon value={row.original.isItemSlogan} />,
  },
  {
    accessorKey: "isItemInstruction",
    header: "Item Instruction",
    cell: ({ row }) => <YesNoIcon value={row.original.isItemInstruction} />,
  },
  {
    accessorKey: "isItemImage",
    header: "Item Image",
    cell: ({ row }) => <YesNoIcon value={row.original.isItemImage} />,
  },
  {
    accessorKey: "isCompanyLogo",
    header: "Company Logo",
    cell: ({ row }) => <YesNoIcon value={row.original.isCompanyLogo} />,
  },
  {
    accessorKey: "isCompanyDetails",
    header: "Company Details",
    cell: ({ row }) => <YesNoIcon value={row.original.isCompanyDetails} />,
  },
  {
    accessorKey: "isPartyDetails",
    header: "Party Details",
    cell: ({ row }) => <YesNoIcon value={row.original.isPartyDetails} />,
  },
  {
    accessorKey: "isWithQuantity",
    header: "With Quantity",
    cell: ({ row }) => <YesNoIcon value={row.original.isWithQuantity} />,
  },
  {
    accessorKey: "labourType",
    header: "Vendor Type",
    cell: ({ row }) => <span>{row.original.labourType || "-"}</span>,
  },
  {
    accessorKey: "size1",
    header: "Size1 (A4)",
    cell: ({ row }) => <YesNoIcon value={row.original.size1} />,
  },
  {
    accessorKey: "size2",
    header: "Size2 (A6)",
    cell: ({ row }) => <YesNoIcon value={row.original.size2} />,
  },
  {
    accessorKey: "dropdown",
    header: "Dropdown",
    cell: ({ row }) => <YesNoIcon value={row.original.dropdown} />,
  },
  {
    accessorKey: "WithPrice",
    header: "With Price",
    cell: ({ row }) => <YesNoIcon value={row.original.WithPrice} />,
  },
  {
    accessorKey: "date",
    header: "Date",
    cell: ({ row }) => <YesNoIcon value={row.original.date} />,
  },

  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center gap-1">
        {/* EDIT */}
        <Tooltip title="Edit">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => {
              setSelectedRow(row.original);
              setIsModalOpen(true);
            }}
          >
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        </Tooltip>

        {/* DELETE */}
        <Popconfirm
          title="Are you sure you want to delete this configuration?"
          okText="Yes"
          cancelText="No"
          onConfirm={() => {
            onDelete(row.original.rawid); // ✅ FIXED
            message.success("Deleted successfully");
          }}
        >
          <Tooltip title="Delete">
            <button className="btn btn-sm btn-icon btn-clear">
              <i className="ki-filled ki-trash text-danger"></i>
            </button>
          </Tooltip>
        </Popconfirm>
      </div>
    ),
  },
];
