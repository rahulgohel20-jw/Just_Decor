import { useEffect, useState } from "react";
import { message, Spin, Input } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../alluser/constant";
import { getAllByRoleId } from "@/services/apiServices";
import EditUserModal from "@/partials/modals/edit-user/EditUserModal";

const AllUser = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);       
  const [filteredData, setFilteredData] = useState([]); 
  const [searchText, setSearchText] = useState("");
  const [editingUserId, setEditingUserId] = useState(null); // store user id for modal
  const [isModalOpen, setIsModalOpen] = useState(false);

  const formatUsers = (users) =>
    users.map((user, index) => ({
      id: user.id, // ✅ added id
      sr_no: index + 1,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      contactNo: user.contactNo,
      companyName: user.userBasicDetails?.companyName || "-",
      plan: user.plan?.name || "-",
      isActive: user.isActive,
      isApprove: user.isApprove,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    }));

  const handleFetchByRoleId = async (roleId = 2) => {
    try {
      setLoading(true);
      const response = await getAllByRoleId(roleId);
      if (response.data.success) {
        const users = response.data.data?.["User Details"] || response.data.data || [];
        const formatted = formatUsers(users);
        setTableData(formatted);
        setFilteredData(formatted);
      } else {
        message.error(response.data.msg || "No users found");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleFetchByRoleId();
  }, []);

  useEffect(() => {
    if (!searchText) {
      setFilteredData(tableData);
    } else {
      const lower = searchText.toLowerCase();
      setFilteredData(
        tableData.filter(
          (u) =>
            u.first_name?.toLowerCase().includes(lower) ||
            u.last_name?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower) ||
            u.companyName?.toLowerCase().includes(lower) ||
            u.plan?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, tableData]);

  // 🔹 Open modal and set user id
  const handleEdit = (user) => {
    setEditingUserId(user);
    console.log("Editing user:", user);
    setIsModalOpen(true);
  };

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Users" }]} />
      </div>

      <div className="flex gap-2 mb-4">
        <Input.Search
          placeholder="Search users..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      {loading ? (
        <Spin tip="Loading..." />
      ) : (
        <TableComponent
          columns={columns(handleEdit)}
          data={filteredData}
          paginationSize={10}
        />
      )}

      <EditUserModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        refreshData={handleFetchByRoleId}
        userId={editingUserId} // pass id here
      />
    </Container>
  );
};

export default AllUser;
