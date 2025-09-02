// constant.js
import { Tooltip } from "antd";
import { underConstruction } from "@/underConstruction";

export const columns = (onEdit) => [
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
    accessorKey: "plan",
    header: "Plan",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
 {
  accessorKey: "isActive",
  header: "Active",
  cell: ({ getValue }) => {
    const value = getValue();
    return (
      <span
        className={`font-medium ${
          value ? "text-primary" : "text-danger"
        }`}
      >
        {value ? "Yes" : "No"}
      </span>
    );
  },
  meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
}
,
  {
    accessorKey: "isApprove",
    header: "Approved",
    cell: ({ getValue }) => {
    const value = getValue();
    return (
      <button
        className={`font-medium px-4 py-1  rounded text-white ${
          value ? "bg-success" : "bg-[blue] " 
        } ${
          value ? "bg-green-900" : "bg-blue-900 " 
        }`}
      >
        {value ? "Approved" : "Approve"}
      </button>
    );
  },
    meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  // {
  //   accessorKey: "action",
  //   header: "Action",
  //   cell: ({row}) => (
  //     <div className="flex items-center justify-center gap-1">
  //       {/* <Tooltip title="Edit User">
  //         <button className="btn btn-sm btn-icon btn-clear " onClick={() => onEdit(row.original.id)}>
  //           <i className="ki-filled ki-notepad-edit text-primary"></i>
  //         </button>
  //       </Tooltip> */}
  //       {/* <Tooltip title="Delete User">
  //         <button
  //           className="btn btn-sm btn-icon btn-clear"
  //           onClick={underConstruction}
  //         >
  //           <i className="ki-filled ki-trash text-danger"></i>
  //         </button>
  //       </Tooltip> */}
  //     </div>
  //   ),
  //   meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  // },
];
