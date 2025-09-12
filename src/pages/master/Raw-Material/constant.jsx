import { Popconfirm, Tooltip } from "antd";

export const columns = (onEdit, onDelete,onStatus) => [
  {
    accessorKey: "sr_no",
    header: "#",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "raw_material_name",
    header: "Raw Material Name",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "raw_material_category",
    header: "Raw Material Category",
    meta: {
      headerClassName: "w-[8%]",
      cellClassName: "w-[8%]",
    },
  },
  {
    accessorKey: "unit",
    header: "Unit",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "supplier_rate",
    header: "Supplier Rate",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "priority",
    header: "Priority",
    meta: {
      headerClassName: "w-[4%]",
      cellClassName: "w-[4%]",
    },
  },
  {
    accessorKey: "isActive",
    header: "Status",
    cell: ({ row }) => {
      return (
        <div className="flex items-center  gap-1">
          <Popconfirm
            title="Are you sure to change this status?"
            onConfirm={() =>
              onStatus(row.original.id, row.original.isActive ? false : true)
            }
            onCancel={() => console.log("Cancelled")}
            okText="Yes"
            cancelText="No"
          >
            <label className="switch switch-lg">
              <input
                type="checkbox"
                value="1"
                name="check"
                defaultChecked={row.original.isActive}
                readOnly
                checked={row.original.isActive}
              />
            </label>
          </Popconfirm>
        </div>
      );
    },
    meta: {
      headerClassName: "w-[10%]",
      cellClassName: "w-[10%]",
    },
  },
  
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-1">
          <Tooltip className="cursor-pointer" title="Edit Contact">
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
              onClick={() => onDelete(row.original.id)}
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
  { sr_no: 1, contact_name: "Friend",raw_material_name:"Sugar",raw_material_category:"General",unit:"Kg",priority:"1" },
  { sr_no: 2, contact_name: "Colleague",raw_material_name:"Salt",raw_material_category:"General",unit:"Kg",priority:"2" },
  { sr_no: 3, contact_name: "Relative",raw_material_name:"Rice",raw_material_category:"Grains",unit:"Kg",priority:"3" },
  { sr_no: 4, contact_name: "Business Manager",raw_material_name:"Wheat",raw_material_category:"Grains",unit:"Kg",priority:"4" },
  { sr_no: 5, contact_name: "Friend",raw_material_name:"Oil",raw_material_category:"Fats",unit:"Litre",priority:"5" },
  { sr_no: 6, contact_name: "Friend",raw_material_name:"Butter",raw_material_category:"Fats",unit:"Kg",priority:"6" },
  { sr_no: 7, contact_name: "Colleague",raw_material_name:"Cheese",raw_material_category:"Dairy",unit:"Kg",priority:"7" },
  { sr_no: 8, contact_name: "Sales Man",raw_material_name:"Chicken",raw_material_category:"Meat",unit:"Kg",priority:"8" },
];
