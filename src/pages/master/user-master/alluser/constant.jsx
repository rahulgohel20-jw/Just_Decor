// // constant.js
 import { Tooltip } from "antd";
 export const columns = (onEdit, handleApprove) => [
   {
     accessorKey: "userCode",
     header: "User Code",
     meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
   },
  {
    accessorKey: "companyName",
    header: "Company",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "city",
    header: "City",
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
  {
    accessorKey: "contactNo",
    header: "Contact No",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "email",
    header: "Email",
    meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
  },
  {
    accessorKey: "fullName",
    header: "Full Name",
    meta: { headerClassName: "w-[15%]", cellClassName: "w-[15%]" },
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
          className={`font-medium ${value ? "text-primary" : "text-danger"}`}
        >
          {value ? "Yes" : "No"}
        </span>
      );
    },
    meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
  },
  {
    accessorKey: "isApprove",
    header: "Approved",
    cell: ({ row }) => {
      const value = row.original.isApprove;
      const userId = row.original.id;

      if (value) {
        return (
          <span className="font-medium px-4 py-1 rounded text-white bg-green-600">
            Approved
          </span>
        );
      }

      const handleClick = async () => {
        try {
          await handleApprove(userId, true);
        } catch (err) {
          console.error("Approval failed", err);
        }
      };

      return (
        <button
          onClick={handleClick}
          className="font-medium px-4 py-1 rounded text-white bg-blue-600"
        >
          Approve
        </button>
      );
    },
    meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
  },
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => (
      <div className="flex items-center justify-center gap-1">
        <Tooltip title="View User">
          <button
            className="btn btn-sm btn-icon btn-clear"
            onClick={() => onView(row.original.id)}
          >
            <i className="ki-filled ki-eye text-primary"></i>
          </button>
        </Tooltip>
      </div>
    ),
    meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
  },
];




// import { underConstruction } from "@/underConstruction";

// export const columns = (onEdit ,handleApprove) => [
//   {
//     accessorKey: "sr_no",
//     header: "#",
//     meta: { headerClassName: "w-[4%]", cellClassName: "w-[4%]" },
//   },
//   {
//     accessorKey: "first_name",
//     header: "First Name",
//     meta: { headerClassName: "w-[8%]", cellClassName: "w-[8%]" },
//   },
//   {
//     accessorKey: "last_name",
//     header: "Last Name",
//     meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
//   },
//   {
//     accessorKey: "email",
//     header: "Email",
//     meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
//   },
//   {
//     accessorKey: "contactNo",
//     header: "Contact No",
//     meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
//   },
//   {
//     accessorKey: "companyName",
//     header: "Company",
//     meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
//   },
 
//   {
//     accessorKey: "plan",
//     header: "Plan",
//     meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
//   },
//  {
//   accessorKey: "isActive",
//   header: "Active",
//   cell: ({ getValue }) => {
//     const value = getValue();
//     return (
//       <span
//         className={`font-medium ${
//           value ? "text-primary" : "text-danger"
//         }`}
//       >
//         {value ? "Yes" : "No"}
//       </span>
//     );
//   },
//   meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
// }
// ,
// {
//   accessorKey: "isApprove",
//   header: "Approved",
//   cell: ({ row }) => {
//     const value = row.original.isApprove; 
//     const userId = row.original.id;

//     if (value) {

//       return (
//         <span className="font-medium px-4 py-1 rounded text-white bg-green-600">
//           Approved
//         </span>
//       );
//     }

//     const handleClick = async () => {
//       try {
//         await handleApprove(userId, true); 
 
//       } catch (err) {
//         console.error("Approval failed", err);
//       }
//     };

//     return (
//       <button
//         onClick={handleClick}
//         className="font-medium px-4 py-1 rounded text-white bg-blue-600"
//       >
//         Approve
//       </button>
//     );
//   },
//   meta: { headerClassName: "w-[6%]", cellClassName: "w-[6%]" },
// }
// ,

//   {
//     accessorKey: "createdAt",
//     header: "Created At",
//     meta: { headerClassName: "w-[12%]", cellClassName: "w-[12%]" },
//   },
//   {
//     accessorKey: "action",
//     header: "Action",
//     cell: ({row}) => (
//       <div className="flex items-center justify-center gap-1">
//         {/* <Tooltip title="Edit User">
//           <button className="btn btn-sm btn-icon btn-clear " onClick={() => onEdit(row.original.id)}>
//             <i className="ki-filled ki-notepad-edit text-primary"></i>
//           </button>
//         </Tooltip>  */}
//         {/* <Tooltip title="Delete User">
//           <button
//             className="btn btn-sm btn-icon btn-clear"
//             onClick={underConstruction}
//           >
//             <i className="ki-filled ki-trash text-danger"></i>
//           </button>
//         </Tooltip> */}
//         <Tooltip title="View User">
//           <button className="btn btn-sm btn-icon btn-clear" onClick={() => onView(row.original.id)}>
//             <i className="ki-filled ki-eye text-primary"></i>
//           </button>
//         </Tooltip>
//       </div>
//     ),
//     meta: { headerClassName: "w-[10%]", cellClassName: "w-[10%]" },
//   },
// ];
