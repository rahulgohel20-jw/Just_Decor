// src/pages/Leave/all-leave/leavebalance/index.jsx

import { TableComponent } from "@/components/table/TableComponent";
import { leaveBalanceData, leaveBalanceColumns } from "./constant";
import { useState, useEffect } from "react";

const LeaveBalanceTable = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // Function to handle edit button click
  const handleEdit = (userData) => {
    console.log("Edit clicked for user:", userData);
    setSelectedUser(userData);
    setIsModalOpen(true);
  };

  // Add useEffect to debug modal state
  useEffect(() => {
    console.log("Modal state:", { isModalOpen, selectedUser });
  }, [isModalOpen, selectedUser]);

  // Create columns with action buttons
  const columnsWithActions = [
    ...leaveBalanceColumns.filter(col => col.accessorKey !== "actions"),
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-1">
          <button
            className="btn btn-sm btn-icon btn-clear"
            title="Edit"
            onClick={(e) => {
              e.stopPropagation(); // Prevent row selection
              handleEdit(row.original);
            }}
          >
            <i className="ki-filled ki-notepad-edit"></i>
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="p-4">
      <TableComponent 
        columns={columnsWithActions} 
        data={leaveBalanceData}
        paginationSize={10}
      />

      {/* Update Leave Balance Modal */}
      
    </div>
  );
};

export default LeaveBalanceTable;
