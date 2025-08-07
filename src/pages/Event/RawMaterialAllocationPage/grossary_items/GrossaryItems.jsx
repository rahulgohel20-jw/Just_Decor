// src/pages/Leave/all-leave/leavebalance/index.jsx

import { TableComponent } from "@/components/table/TableComponent";
import { data, columns } from "./constant";
import { useState, useEffect } from "react";

const GrossaryItems = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [tableData, setTableData] = useState(data);

  
  const handleEdit = (userData) => {
    console.log("Edit clicked for user:", userData);
    setSelectedUser(userData);
    setIsModalOpen(true);
  };


  useEffect(() => {
    console.log("Modal state:", { isModalOpen, selectedUser });
  }, [isModalOpen, selectedUser]);


  return (
    <>
      <TableComponent 
        columns={columns} 
        data={tableData}
        paginationSize={10}
      />
    </>
  );
};

export default GrossaryItems;
