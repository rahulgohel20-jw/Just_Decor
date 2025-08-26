// constant.js
import { Tooltip } from "antd";
import { underConstruction } from "@/underConstruction";

export const columns = [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: { headerClassName: "w-[4%]", cellClassName: "w-[4%]" },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "contactNo",
    header: "Contact No",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "companyName",
    header: "Company",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "plan",
    header: "Plan",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "price",
    header: "Price",
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "isActive",
    header: "Active",
    cell: ({ getValue }) => (getValue() ? "✅ Yes" : "❌ No"),
    meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
  },
  {
    accessorKey: "isApprove",
    header: "Approved",
    cell: ({ getValue }) => (getValue() ? "✅ Yes" : "❌ No"),
    meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: () => (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title="Edit User">
          <button className="btn btn-sm btn-icon btn-clear">
            <i className="ki-filled ki-notepad-edit text-primary"></i>
          </button>
        </Tooltip>
        <Tooltip title="Delete User">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={underConstruction}
          >
            <i className="ki-filled ki-trash text-danger"></i>
          </button>
        </Tooltip>
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];
