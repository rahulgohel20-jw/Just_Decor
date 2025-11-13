import { useEffect, useState } from "react";
import { message, Spin, Input } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { getColumns } from "./constant";
import DatabaseSidebar from "../databasesidebar";
import DatabaseAssign from "../databaseassign";
import AddMasterDatabaseFile from "../addmasterdatabasefile";
import ViewAssignDatabase from "../viewassigndatabase";
import { GetAllDb } from "@/services/apiServices";

const Database = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [customerDatabase, setCustomerDatabase] = useState(false);
  const [openFile, setOpenFile] = useState(false);
  const [tabledata, setTabledata] = useState([]);
  const [viewAssignOpen, setViewAssignOpen] = useState(false);

  useEffect(() => {
    FetchAllDb();
  }, []);

  const FetchAllDb = async () => {
    try {
      setLoading(true);
      const res = await GetAllDb();

      if (!res?.data?.data) {
        message.error("No data found!");
        setTabledata([]);
        return;
      }

      const data = res.data.data.map((db, index) => ({
        sr_no: index + 1,
        database_name: db.dbName || "",
        state: db.state || "",
        version: db.version || "1.0",
      }));

      setTabledata(data);
    } catch (error) {
      console.error("Error fetching databases:", error);
      message.error("Failed to load databases");
    } finally {
      setLoading(false);
    }
  };

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

  const handleOpenViewAssign = () => {
    setViewAssignOpen(true);
  };

  const handleCloseViewAssign = () => {
    setViewAssignOpen(false);
  };

  const handleViewDatabase = (row) => {
    setSelectedRow(row);
    setViewAssignOpen(true);
  };

  const columns = getColumns(
    handleOpenSidebar,
    handleOpenCustomer,
    handleViewDatabase
  );

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

        <div className="flex items-center gap-2">
          <button
            className="btn btn-outline-secondary"
            onClick={handleOpenViewAssign}
          >
            View Assigned
          </button>

          <button
            className="btn btn-primary flex items-center gap-1"
            onClick={handleOpenFile}
          >
            <i className="ki-filled ki-plus"></i> Add Database
          </button>
        </div>
      </div>
      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <TableComponent
          columns={columns}
          data={tabledata}
          paginationSize={10}
        />
      )}
      <DatabaseSidebar open={sidebarOpen} onClose={handleCloseSidebar} />
      <DatabaseAssign open={customerDatabase} onClose={handleCloseCustomer} />
      <AddMasterDatabaseFile open={openFile} onClose={handleCloseFile} />
      <ViewAssignDatabase
        open={viewAssignOpen}
        onClose={handleCloseViewAssign}
      />
    </Container>
  );
};

export default Database;
