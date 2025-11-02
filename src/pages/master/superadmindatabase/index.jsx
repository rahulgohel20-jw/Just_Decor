import { useEffect, useState } from "react";
import { message, Spin, Input } from "antd";
import { Link } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { getColumns, defaultData } from "./constant";
import DatabaseSidebar from "../databasesidebar";

const Database = () => {
  const [loading, setLoading] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  const handleOpenSidebar = (row) => {
    setSelectedRow(row);
    setSidebarOpen(true);
  };

  const handleCloseSidebar = () => {
    setSidebarOpen(false);
    setSelectedRow(null);
  };

  const columns = getColumns(handleOpenSidebar);

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

        {/* Right side → Add User button */}
        <Link to="">
          <button className="btn btn-primary flex items-center gap-1">
            <i className="ki-filled ki-plus"></i> Add Database
          </button>
        </Link>
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
    </Container>
  );
};

export default Database;
