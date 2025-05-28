import { DataGridColumnHeader } from "@/components";
import { Link } from "react-router-dom";
export const columns = [
    {
        accessorKey: "user",
        
        header: ({ column }) => (
            <DataGridColumnHeader title="User" column={column} />
        ),
        
    },
    {
        accessorKey: "email",
        
        header: ({ column }) => (
            <DataGridColumnHeader title="Email" column={column} />
        ),
        
    },
    
    {
        accessorKey: "mobile",
        header: ({ column }) => (
            <DataGridColumnHeader title="Mobile" column={column} />
        ),
    },
    {
        accessorKey: "report_to",
        header: ({ column }) => (
            <DataGridColumnHeader title="Report to" column={column} />
        ),
    },
    {
        accessorKey: "role",
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
                        className="btn btn-sm btn-icon btn-clear"
                        title="View"
                        
                    >
                        <i className="ki-filled ki-eye"></i>
                    </button></Link>
                    
                    <button
                        className="btn btn-sm btn-icon btn-clear"
                        title="Edit"
                        onClick={() => cell.row.original.handleModalOpen()}
                    >
                        <i className="ki-filled ki-notepad-edit"></i>
                    </button>
                    <button
                        className="btn btn-sm btn-icon btn-clear"
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
    user: "John Doe",
    mobile: "+91 9876543210",
    report_to: "Manager A",
    role: "Developer",
    email: "john.doe@example.com"
  },
  {
    user: "Priya Sharma",
    mobile: "+91 9123456789",
    report_to: "Manager B",
    role: "Designer",
    email: "priya.sharma@example.com"
  },
  {
    user: "Amit Verma",
    mobile: "+91 9988776655",
    report_to: "Manager A",
    role: "Tester",
    email: "amit.verma@example.com"
  },
  {
    user: "Sara Khan",
    mobile: "+91 8899776655",
    report_to: "Manager C",
    role: "Project Manager",
    email: "sara.khan@example.com"
  }
];

