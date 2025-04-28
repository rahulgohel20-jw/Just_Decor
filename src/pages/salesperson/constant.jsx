import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
export const columns = [
    {
        accessorKey: "User",
        
        header: ({ column }) => (
            <DataGridColumnHeader title="User" column={column} />
        ),
        
    },
    {
        accessorKey: "Mobile",
        header: ({ column }) => (
            <DataGridColumnHeader title="Mobile" column={column} />
        ),
    },
    {
        accessorKey: "ReportTo",
        header: ({ column }) => (
            <DataGridColumnHeader title="Report to" column={column} />
        ),
    },
    {
        accessorKey: "LeadAssigned",
        header: ({ column }) => (
            <DataGridColumnHeader title="Lead Assigned" column={column} />
        ),
    },
    {
        accessorKey: "Role",
        header: ({ column }) => (
            <DataGridColumnHeader title="Role" column={column} />
        ),
    },
    
    {
        accessorKey: "action",
        header: "Action",
        cell: ({ cell }) => {
            return (
            
                <div className="flex items-center justify-center gap-1">
                    <Link to="/companydetails"><button
                        className="btn btn-sm btn-icon btn-clear text-blue-600"
                        title="View"
                        
                    >
                        <i className="ki-filled ki-eye"></i>
                    </button></Link>
                    
                    <button
                        className="btn btn-sm btn-icon btn-clear text-gray-600"
                        title="Edit"
                        onClick={() => cell.row.original.handleModalOpen()}
                    >
                        <i className="ki-filled ki-notepad-edit"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-icon btn-clear text-danger"
                        title="Delete"
                    >
                        <i className="ki-filled ki-trash"></i>
                    </button>
                </div>
            );
        },
    },
];
export const defaultData = [
    {
    User: "John Doe",
    Mobile: "9876543210",
    ReportTo: "Sarah Connor",
    LeadAssigned: "Marketing Campaign A",
    Role: "Sales Executive"
  },
  {
    User: "Emma Watson",
    Mobile: "9123456780",
    ReportTo: "John Smith",
    LeadAssigned: "Product Inquiry",
    Role: "Customer Support"
  },
  {
    User: "Liam Brown",
    Mobile: "9988776655",
    ReportTo: "Michael Clark",
    LeadAssigned: "Service Request",
    Role: "Technician"
  },
  {
    User: "Sophia Green",
    Mobile: "9012345678",
    ReportTo: "Sarah Connor",
    LeadAssigned: "Subscription Upgrade",
    Role: "Account Manager"
  },
  {
    User: "William Black",
    Mobile: "8899776655",
    ReportTo: "John Smith",
    LeadAssigned: "New Business Lead",
    Role: "Business Development"
  }
];

