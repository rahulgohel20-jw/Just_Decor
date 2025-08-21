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
    accessorKey: "meal_type",
    header: "Meal Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
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
  
  
   { sr_no: 1, meal_type: "Jain Meal" },
  { sr_no: 2, meal_type: "Vegetarian Meal" },
  { sr_no: 3, meal_type: "Non-Vegetarian Meal" },
  { sr_no: 4, meal_type: "Vegan Meal" },
  { sr_no: 5, meal_type: "Gluten-Free Meal" },
  { sr_no: 6, meal_type: "Keto Meal" },
  { sr_no: 7, meal_type: "Diabetic-Friendly Meal" },
  { sr_no: 8, meal_type: "Kids Special Meal" }



];
