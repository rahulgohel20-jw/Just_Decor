import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { DataGridColumnHeader } from "@/components";
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
  const [permissions, setPermissions] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [isPermissionModalOpen, setIsPermissionModalOpen] = useState(false);

  const userId = localStorage.getItem("userId");

  const fetchRoles = async () => {
    try {
      setLoading(true);
      const res = await GetAllRole(userId);

      if (res?.data?.success) {
        const formatted = res.data.data["Role Details"].map((item, i) => ({
          sr_no: i + 1,
          roleId: item.id,
          role: item.name,
          created_date: item.createdAt || "N/A",
        }));
        setTableData(formatted);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleOpenPermission = async (role) => {
    setSelectedRole(role);
    setIsPermissionModalOpen(true);
    const istrue = role !== 1;

    try {
      const [pagesRes, rightsRes] = await Promise.all([
        GetPages(istrue),
        GetRightsBYroleId(role.roleId),
      ]);

      const rightsModules = rightsRes?.data?.data?.UserRights || [];

      const rightsMap = {};
      rightsModules.forEach((module) => {
        module.userRights?.forEach((page) => {
          rightsMap[`${module.moduleId}_${page.pageid}`] = page;
        });
      });

      const moduleWisePages = pagesRes?.data?.data?.ModuleWiseUserRights || [];

      const finalPermissions = moduleWisePages.flatMap((module) =>
        (module.userRightsPages || []).map((page) => {
          const key = `${module.moduleId}_${page.pageId}`;
          const right = rightsMap[key];

          return {
            moduleId: module.moduleId,
            moduleName: module.moduleName,
            pageId: page.pageId,
            name: page.pagename,

            add: right ? Boolean(right.add) : false,
            edit: right ? Boolean(right.edit) : false,
            view: right ? Boolean(right.view) : false,
            delete: right ? Boolean(right.delete) : false,

            roleId: role.roleId,
          };
        }),
      );

      setPermissions(finalPermissions);
    } catch (error) {
      console.error("Error loading permissions:", error);
    }
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
        <h1 className="text-xl font-semibold mb-4">User Rights</h1>

        <TableComponent columns={columns} data={tableData} loading={loading} />

        <Addpermission
          isOpen={isPermissionModalOpen}
          onClose={() => setIsPermissionModalOpen(false)}
          role={selectedRole}
          permissions={permissions}
          setPermissions={setPermissions}
          refreshData={fetchRoles}
        />
      </Container>
    </Fragment>
  );
};

export default UserRights;
