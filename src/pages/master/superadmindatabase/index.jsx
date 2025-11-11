import { useState } from "react";
import { message, Spin, Input } from "antd";
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { getColumns, defaultData } from "./constant";
import DatabaseSidebar from "../databasesidebar";
import DatabaseAssign from "../databaseassign";
import AddMasterDatabaseFile from "../addmasterdatabasefile";
import { GetAllDb } from "@/services/apiServices";

const Database = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customerDatabase, setCustomerDatabase] = useState(false);
  const [openFile, setOpenFile] = useState(false);

  const handleOpenSidebar = (row) => {
    setSelectedRow(row);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedRow(null);
  };

  const handleOpenCustomer = (row) => {
    setSelectedRow(row);
    setCustomerDatabase(true);
  };

  const handleCloseCustomer = () => {
    setCustomerDatabase(false);
    setSelectedRow(null);
  };

  const handleOpenFile = () => {
    setOpenFile(true);
  };

  const handleCloseFile = () => {
    setOpenFile(false);
  };

  const columns = getColumns(handleOpenSidebar, handleOpenCustomer);

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "Master Database" }]} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input.Search
          placeholder="Search users..."
          allowClear
          style={{ width: 250 }}
        />

        <button
          className="btn btn-primary flex items-center gap-1"
          onClick={handleOpenFile}
        >
          <i className="ki-filled ki-plus"></i> Add Database
        </button>
      </div>

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <TableComponent
          columns={columns}
          data={defaultData}
          paginationSize={10}
        />
      )}

      <DatabaseSidebar open={sidebarOpen} onClose={handleCloseSidebar} />
      <DatabaseAssign open={customerDatabase} onClose={handleCloseCustomer} />
      <AddMasterDatabaseFile open={openFile} onClose={handleCloseFile} />
    </Container>
  );
};

export default Database;
