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
  accessorKey: "image",
  header: "Document Image",
  meta: {
    headerClassName: "w-[12%]",
    cellClassName: "w-[12%]",
  },
  cell: ({ row }) => {
    // 👇 Suppose images are stored in /public/uploads/
    const fileName = row.original.image;
    const imgUrl = `/uploads/${fileName}`;

    return (
      <img
        src={imgUrl}
        alt="Document"
        className="h-10 w-10 object-cover rounded"
      />
    );
  },
},
  
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ cell }) => {
      return (
        <div className="flex items-center justify-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Event">
            <Link to="/add-event">
              <button className="btn btn-sm btn-icon btn-clear" title="Edit">
                <i className="ki-filled ki-notepad-edit text-primary"></i>
              </button>
            </Link>
          </Tooltip>
        
          
          
          <Tooltip title="Menu Allocation">
            {/* <Link to="/menu-allocation"> */}
            <button
              className="btn btn-sm btn-icon btn-clear"
              title="Menu Allocation"
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
    customer: "Rahul Gohel",
    address: "123 Green Street, Ahmedabad",
    contact_type: "Personal",
    email: "rahul@example.com",
    mobile: "+91 9876543210",
    gst: "27AAACG1234A1Z5",
    birthdate: "1995-08-20",
    document: "PAN Card",
    image: "pan.png"
  },
  {
    sr_no: 2,
    customer: "Anjali Sharma",
    address: "456 Blue Avenue, Mumbai",
    contact_type: "Business",
    email: "anjali@example.com",
    mobile: "+91 9988776655",
    gst: "27BBBCC5678Z1X9",
    birthdate: "1990-04-15",
    document: "Aadhar Card",
    image: "aadhar.png"
  },
  {
    sr_no: 3,
    customer: "Ramesh Patel",
    address: "789 Red Road, Surat",
    contact_type: "Personal",
    email: "ramesh@example.com",
    mobile: "+91 9123456780",
    gst: "27CCCDD9101Q2W3",
    birthdate: "1988-12-05",
    document: "Voter ID",
    image: "voterid.png"
  },
  {
    sr_no: 4,
    customer: "Neha Verma",
    address: "12 Lotus Society, Pune",
    contact_type: "Business",
    email: "neha@example.com",
    mobile: "+91 9812345678",
    gst: "27DDDEE1122R3T4",
    birthdate: "1993-06-11",
    document: "PAN Card",
    image: "pan.png"
  },
  {
    sr_no: 5,
    customer: "Amit Desai",
    address: "21 Palm Residency, Baroda",
    contact_type: "Personal",
    email: "amit@example.com",
    mobile: "+91 9876501234",
    gst: "27EEEFF3344U5I6",
    birthdate: "1985-09-02",
    document: "Aadhar Card",
    image: "aadhar.png"
  },
  {
    sr_no: 6,
    customer: "Priya Mehta",
    address: "89 Lake View, Rajkot",
    contact_type: "Business",
    email: "priya@example.com",
    mobile: "+91 9123409876",
    gst: "27FFFGG4455J6K7",
    birthdate: "1992-11-19",
    document: "Voter ID",
    image: "voterid.png"
  },
  {
    sr_no: 7,
    customer: "Suresh Iyer",
    address: "67 Ocean Park, Chennai",
    contact_type: "Personal",
    email: "suresh@example.com",
    mobile: "+91 9345612789",
    gst: "27GGGHH5566L7M8",
    birthdate: "1980-03-30",
    document: "Aadhar Card",
    image: "aadhar.png"
  },
  {
    sr_no: 8,
    customer: "Kavita Nair",
    address: "45 Rose Villa, Bangalore",
    contact_type: "Business",
    email: "kavita@example.com",
    mobile: "+91 9012345678",
    gst: "27HHHII6677N8O9",
    birthdate: "1987-07-25",
    document: "PAN Card",
    image: "pan.png"
  }


];
