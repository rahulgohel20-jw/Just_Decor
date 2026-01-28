import { Fragment, useEffect, useState } from "react";
import { Container } from "@/components/container";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import { message } from "antd";
import { GetAllRole, DeleteRole } from "@/services/apiServices";
import AddRole from "@/partials/modals/add-role-master/AddRole";
import { FormattedMessage, useIntl } from "react-intl";

const RoleMaster = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const intl = useIntl();
  const fetchRoles = async (search = "") => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await GetAllRole(userId);
      let roles = res?.data?.data?.["Role Details"] || [];
      
      const roleData = roles.map((role, index) => ({
        sr_no: index + 1,
        role_name: role.name || "",
        roleId: role.id || ""
      }));
      if (search) {
        roles = roles.filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setTableData(roleData);
    } catch (err) {
      console.error("Error fetching roles:", err);
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  useEffect(() => {
    const delay = setTimeout(() => {
      fetchRoles(searchTerm);
    }, 500);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleEdit = (role) => {
    setSelectedRole(role);
    setIsRoleModalOpen(true);
  };

  const handleDelete = (roleId) => {
    DeleteRole(roleId)
      .then((res) => {
        message.success("Role Deleted Successfully");

        fetchRoles();
      })
      .catch((err) => {
        console.error("Error deleting role:", err);
      });
  };

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className=" pb-2 mb-3">
          <h1 className="text-xl text-gray-900">
            <FormattedMessage
              id="COMMON.DEPARTMENT_MASTER"
              defaultMessage="Department Master"
            />
          </h1>
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className="filItems relative">
            <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
            <input
              className="input pl-8"
              placeholder={intl.formatMessage({
                id: "USER.MASTER.SEARCH_ROLE",
                defaultMessage: "Search Role",
              })}
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setSelectedRole(null);
                setIsRoleModalOpen(true);
              }}
            >
              <i className="ki-filled ki-plus"></i>{" "}
              <FormattedMessage
                id="USER.MASTER.ADD_CONTACT_CATEGORY"
                defaultMessage="Create New"
              />
            </button>
          </div>
        </div>

        {/* Modal */}
        <AddRole
          isModalOpen={isRoleModalOpen} 
          setIsModalOpen={setIsRoleModalOpen} 
          editData={selectedRole} 
          onRoleAdded={fetchRoles} 
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleDelete)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default RoleMaster;
