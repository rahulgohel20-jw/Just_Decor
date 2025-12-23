import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import { message } from "antd";
import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import { GetAllRole, DeleteRole } from "@/services/apiServices";
import AddRole from "@/partials/modals/add-role-master/AddRole";
import { FormattedMessage, useIntl } from "react-intl";

const RoleMaster = () => {
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [selectedRole, setSelectedRole] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const intl = useIntl();

  const formatData = (apiData) =>
    apiData.map((item, index) => ({
      sr_no: index + 1,
      id: item.id,
      role_name: item.name,
      created_at: item.createdAt,
      proforma_invoice: (
        <Tooltip className="cursor-pointer" title="Proforma Invoice">
          <div
            className="flex justify-center items-center w-full"
            onClick={underConstruction}
          >
            <FileText className="w-5 h-5 text-primary" />
          </div>
        </Tooltip>
      ),
      invoice: (
        <Link to="/invoice-dashboard">
          <Tooltip className="cursor-pointer" title="Invoice">
            <div className="flex justify-center items-center w-full">
              <Receipt className="w-5 h-5 text-success" />
            </div>
          </Tooltip>
        </Link>
      ),
      quotation: (
        <Link to="/quotation">
          <Tooltip className="cursor-pointer" title="Quotation">
            <div className="flex justify-center items-center w-full">
              <BadgeDollarSign className="w-5 h-5 text-blue-600" />
            </div>
          </Tooltip>
        </Link>
      ),
    }));

  const fetchRoles = async (search = "") => {
    try {
      const userId = localStorage.getItem("userId");

      const res = await GetAllRole(userId);
      let roles = res?.data?.data?.["Role Details"] || [];

      if (search) {
        roles = roles.filter((r) =>
          r.name.toLowerCase().includes(search.toLowerCase())
        );
      }

      setTableData(formatData(roles));
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
    console.log("Delete role with ID:", roleId);
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
          isModalOpen={isRoleModalOpen} // ✅ Changed from isOpen
          setIsModalOpen={setIsRoleModalOpen} // ✅ Changed from onClose
          editData={selectedRole} // ✅ Changed from selectedRole
          successFunction={fetchRoles} // ✅ Changed from refreshData
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
