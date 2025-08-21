import { Popconfirm, Tooltip } from "antd";
import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import { useEffect, useRef, useState } from "react";

export const columns = [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "first_name",
    header: "First Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "last_name",
    header: "Last Name",
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "country",
    header: "Country",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "whatsapp",
    header: "WhatsApp No",
    meta: {
      headerClassName: "w-[16%]",
      cellClassName: "w-[16%]",
    },
  },
  {
    accessorKey: "role",
    header: "Role",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
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
    accessorKey: "password",
    header: "Password",
    meta: {
      headerClassName: "w-[12%]",
      cellClassName: "w-[12%]",
    },
  },
  {
    accessorKey: "task_access",
    header: "Tast Access",
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  {
    accessorKey: "leave_attendence_access",
    header: "Leave Attendance Access",
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Member">
            
              <button className="btn btn-sm btn-icon btn-clear" title="Edit">
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            
          </Tooltip>
        
          
          
          <Tooltip title="Delete">
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Delete"
              onClick={underConstruction}
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
  // {
  //   accessorKey: "action_menu",
  //   header: "Actions (Menu)",
  //   cell: ({ row }) => {
  //     const [open, setOpen] = useState(false);
  //     const menuRef = useRef(null);

  //     const toggleMenu = () => setOpen((prev) => !prev);
  //     const closeMenu = () => setOpen(false);

  //     // Detect click outside
  //     useEffect(() => {
  //       const handleClickOutside = (event) => {
  //         if (menuRef.current && !menuRef.current.contains(event.target)) {
  //           closeMenu();
  //         }
  //       };

  //       document.addEventListener("mousedown", handleClickOutside);
  //       return () => {
  //         document.removeEventListener("mousedown", handleClickOutside);
  //       };
  //     }, []);

  //     return (
  //       <div className="relative" ref={menuRef}>
  //         <button
  //           onClick={toggleMenu}
  //           className="btn btn-sm btn-icon btn-clear"
  //           title="More Actions"
  //         >
  //           <i className="ki-filled ki-dots-horizontal text-gray-600"></i>
  //         </button>

  //         {open && (
  //           <div className="absolute z-50 flex flex-col bg-white border rounded shadow-lg right-0 mt-2 min-w-[160px] text-sm">
  //             <Link
  //               to="/add-event"
  //               className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
  //               onClick={closeMenu}
  //             >
  //               <i className="ki-filled ki-notepad-edit text-primary"></i> Edit
  //             </Link>
  //             <Popconfirm
  //             title="Are you sure to copy this item?"
  //             onConfirm={() => console.log('confirm')
  //             }
  //             onCancel={() => console.log('Cancelled')}
  //             okText="Yes"
  //             cancelText="No"
  //           >
  //             <button
  //               className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-start"
  //               // onClick={closeMenu}
  //             >
  //               <i className="ki-filled ki-copy text-success"></i> Copy
  //             </button>
  //             </Popconfirm>
  //             <Popconfirm
  //             title="Are you sure to delete this item?"
  //             onConfirm={() => closeMenu
  //             }
  //             onCancel={() => console.log('Cancelled')}
  //             okText="Yes"
  //             cancelText="No"
  //           >
  //             <button
  //               className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2 text-start"
  //               // onClick={closeMenu}
  //             >
  //               <i className="ki-filled ki-trash text-danger"></i> Remove
  //             </button>
  //             </Popconfirm>
  //             <Link
  //               to="/menu-preparation"
  //               className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
  //               onClick={closeMenu}
  //             >
  //               <i className="ki-filled ki-notepad text-warning"></i> Menu Prep
  //             </Link>
  //             <Link
  //               to="/menu-allocation"
  //               className="px-4 py-2 hover:bg-gray-100 flex items-center gap-2"
  //               onClick={closeMenu}
  //             >
  //               <i className="ki-filled ki-grid text-info"></i> Menu Allocate
  //             </Link>
  //           </div>
  //         )}
  //       </div>
  //     );
  //   },
  //   meta: {
  //     headerClassName: "w-[5%] text-center",
  //     cellClassName: "w-[5%] text-center",
  //   },
  // },
];

export const defaultData = [
  
  
   {
    sr_no: 1,
    first_name: "Rahul",
    last_name: "Gohel",
    country: "India",
    whatsapp: "+91 9876543210",
    role: "Admin",
    email: "rahul.gohel@example.com",
    password: "Admin@123",
    task_access: true,
    leave_attendence_access: true
  },
  {
    sr_no: 2,
    first_name: "Anjali",
    last_name: "Sharma",
    country: "India",
    whatsapp: "+91 9988776655",
    role: "Team Member",
    email: "anjali.sharma@example.com",
    password: "Team@456",
    task_access: true,
    leave_attendence_access: false
  },
  {
    sr_no: 3,
    first_name: "Ramesh",
    last_name: "Patel",
    country: "India",
    whatsapp: "+91 9123456780",
    role: "Manager",
    email: "ramesh.patel@example.com",
    password: "Manager@789",
    task_access: true,
    leave_attendence_access: true
  },
  {
    sr_no: 4,
    first_name: "Neha",
    last_name: "Verma",
    country: "India",
    whatsapp: "+91 9812345678",
    role: "Team Member",
    email: "neha.verma@example.com",
    password: "Team@321",
    task_access: false,
    leave_attendence_access: true
  },
  {
    sr_no: 5,
    first_name: "Amit",
    last_name: "Desai",
    country: "India",
    whatsapp: "+91 9876501234",
    role: "Admin",
    email: "amit.desai@example.com",
    password: "Admin@654",
    task_access: true,
    leave_attendence_access: true
  },
  {
    sr_no: 6,
    first_name: "Priya",
    last_name: "Mehta",
    country: "India",
    whatsapp: "+91 9123409876",
    role: "Manager",
    email: "priya.mehta@example.com",
    password: "Manager@987",
    task_access: true,
    leave_attendence_access: false
  },
  {
    sr_no: 7,
    first_name: "Suresh",
    last_name: "Iyer",
    country: "India",
    whatsapp: "+91 9345612789",
    role: "Team Member",
    email: "suresh.iyer@example.com",
    password: "Team@159",
    task_access: false,
    leave_attendence_access: true
  },
  {
    sr_no: 8,
    first_name: "Kavita",
    last_name: "Nair",
    country: "India",
    whatsapp: "+91 9012345678",
    role: "Manager",
    email: "kavita.nair@example.com",
    password: "Manager@753",
    task_access: true,
    leave_attendence_access: true
  }




];
