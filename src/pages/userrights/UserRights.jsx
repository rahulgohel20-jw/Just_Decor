import { Fragment, useState } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { Tooltip } from "antd";
import { DataGridColumnHeader } from "@/components";
import AdduserRight from "@/partials/modals/add-user-right/AdduserRight";
import Addpermission from "@/partials/modals/add-user-right/Addpermission";

const UserRights = () => {
  // === Data State ===
  const [tableData, setTableData] = useState([
    { sr_no: "0001", role: "Team Member", created_date: "01 Jan 2024" },
    { sr_no: "0002", role: "Manager", created_date: "02 Jan 2024" },
    { sr_no: "0003", role: "Team Member", created_date: "03 Jan 2024" },
    { sr_no: "0004", role: "Team Member", created_date: "04 Jan 2024" },
    { sr_no: "0005", role: "Team Member", created_date: "05 Jan 2024" },
  ]);

  // === Modal State for Add/Edit User Rights ===
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);

  // === Modal State for Permission Modal ===
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);

  // === Handlers for User Modal ===
  const handleAdd = () => {
    setSelectedFunction(null);
    setIsUserModalOpen(true);
  };

  const handleEdit = (record) => {
    setSelectedFunction(record);
    setIsUserModalOpen(true);
  };

  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setSelectedFunction(null);
  };

  const handleUserModalSuccess = () => {
    // Refresh table data if needed
    setIsUserModalOpen(false);
  };

  // === Handlers for Permission Modal ===
  const handleOpenPermission = (rowData) => {
    setSelectedRow(rowData);
    setIsPermissionModalOpen(true);
  };

  const handleClosePermission = () => {
    setIsPermissionModalOpen(false);
    setSelectedRow(null);
  };

  const refreshData = () => {
    // TODO: reload data if backend integration
  };

  // === Table Columns ===
  const columns = [
    {
      accessorKey: "sr_no",
      header: ({ column }) => (
        <DataGridColumnHeader title="Sr No#" column={column} />
      ),
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataGridColumnHeader title="Role" column={column} />
      ),
    },
    {
      accessorKey: "active_status",
      header: "Active Status",
      cell: () => (
        <div className="flex items-center gap-2">
          <button className="btn bg-green-200 text-green-700">Active</button>
        </div>
      ),
    },
    {
      accessorKey: "created_date",
      header: ({ column }) => (
        <DataGridColumnHeader title="Created Date" column={column} />
      ),
    },
    {
      accessorKey: "rights",
      header: "Rights",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <button
            className="btn btn-primary"
            onClick={() => handleOpenPermission(row.original)}
          >
            Rights
          </button>
        </div>
      ),
    },
    {
      accessorKey: "action",
      header: "Action",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Tooltip title="Edit">
            <button
              className="btn btn-sm btn-icon btn-clear text-primary border border-[#E3E3E3]"
              onClick={() => handleEdit(row.original)}
            >
              <i className="ki-filled ki-user-edit text-blue-600"></i>
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 mb-3">
          <Breadcrumbs items={[{ title: "User Rights" }]} />
        </div>

        <div className="w-fit filItems relative mb-4">
          <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
          <input className="input pl-8" type="text" placeholder="Search Role" />
        </div>
        <TableComponent columns={columns} data={tableData} />

        {/* Add/Edit User Rights Modal */}
        <AdduserRight
          isOpen={isUserModalOpen}
          onClose={handleUserModalClose}
          selectedFunction={selectedFunction}
          onSuccess={handleUserModalSuccess}
        />

        {/* Permission Modal */}
        <Addpermission
          isOpen={isPermissionModalOpen}
          onClose={handleClosePermission}
          contactType={selectedRow}
          refreshData={refreshData}
        />
      </Container>
    </Fragment>
  );
};

export default UserRights;
