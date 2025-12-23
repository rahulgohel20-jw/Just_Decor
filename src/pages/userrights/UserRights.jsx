import { Fragment, useState, useEffect } from "react";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { DataGridColumnHeader } from "@/components";
import AdduserRight from "@/partials/modals/add-user-right/AdduserRight";
import Addpermission from "@/partials/modals/add-user-right/Addpermission";
import {
  GetAllRole,
  GetRightsBYroleId,
  GetPages,
} from "@/services/apiServices";

const UserRights = () => {
  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pages, setPages] = useState([]);

  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [selectedFunction, setSelectedFunction] = useState(null);

  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedPermissions, setSelectedPermissions] = useState(null);

  const userId = localStorage.getItem("userId");

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await GetAllRole(userId);

      if (res?.data?.success && res?.data?.data) {
        const formatted = res.data.data["Role Details"].map((item, index) => ({
          sr_no: index + 1,
          roleId: item.id,
          role: item.name,
          created_date: item.createdAt || "N/A",
          id: item._id,
        }));
        setTableData(formatted);
      } else {
        setTableData([]);
      }
    } catch (error) {
      console.error("Error fetching roles:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleUserModalClose = () => {
    setIsUserModalOpen(false);
    setSelectedFunction(null);
  };

  const handleUserModalSuccess = () => {
    setIsUserModalOpen(false);
    fetchRoles();
  };

  const handleOpenPermission = async (rowData) => {
    setSelectedRow(rowData);
    setIsPermissionModalOpen(true);

    try {
      const [pagesRes, rightsRes] = await Promise.all([
        GetPages(),
        GetRightsBYroleId(rowData.roleId),
      ]);

      if (pagesRes?.data?.success) {
        const pageList = pagesRes.data.data["UserRightsPages"] || [];

        setPages(pageList);

        const rights = rightsRes.data.data["UserRights"];

        let formattedPermissions = rights.map((p) => ({
          name: p.pageName,
          Add: p.add,
          Edit: p.edit,
          view: p.view,
          Delete: p.delete,
          roleId: rowData.roleId,
        }));

        setSelectedPermissions(formattedPermissions);
      }
    } catch (error) {
      console.error("Error fetching pages/rights:", error);
    }
  };

  const handleClosePermission = () => {
    setIsPermissionModalOpen(false);
    setSelectedRow(null);
  };

  const refreshData = () => {
    fetchRoles();
  };

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
      accessorKey: "created_date",
      header: ({ column }) => (
        <DataGridColumnHeader title="Created Date" column={column} />
      ),
    },
    {
      accessorKey: "rights",
      header: "Rights",
      cell: ({ row }) => (
        <button
          className="btn btn-primary"
          onClick={() => handleOpenPermission(row.original)}
        >
          Rights
        </button>
      ),
    },
  ];

  return (
    <Fragment>
      <Container>
        <div className="gap-2 mb-3">
      <h1 className="text-xl text-gray-900">
            User Rights
            </h1>
        </div>

        <div className="w-fit filItems relative mb-4">
          <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
          <input className="input pl-8" type="text" placeholder="Search Role" />
        </div>

        <TableComponent columns={columns} data={tableData} loading={loading} />

        <AdduserRight
          isOpen={isUserModalOpen}
          onClose={handleUserModalClose}
          selectedFunction={selectedFunction}
          onSuccess={handleUserModalSuccess}
        />

        <Addpermission
          isOpen={isPermissionModalOpen}
          onClose={handleClosePermission}
          contactType={selectedRow}
          permissionsData={selectedPermissions}
          pages={pages}
          refreshData={refreshData}
        />
      </Container>
    </Fragment>
  );
};

export default UserRights;
