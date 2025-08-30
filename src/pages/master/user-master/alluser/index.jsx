import { useEffect, useState } from "react";
import { message, Spin, Button } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../alluser/constant";
import { 
  getAllByUserId, 
  getAllByRoleId, 
  getUserById, 
  getManagerAndAdminUsersByClient 
} from "@/services/apiServices";

const AllUser = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  // 🔹 Common formatting function
  const formatUsers = (users) =>
    users.map((user, index) => ({
      sr_no: index + 1,
      first_name: user.firstName,
      last_name: user.lastName,
      email: user.email,
      contactNo: user.contactNo,
      companyName: user.userBasicDetails?.companyName || "-",
      role: user.userBasicDetails?.role?.name || "-",
      plan: user.plan?.name || "-",
      isActive: user.isActive,
      isApprove: user.isApprove,
      createdAt: new Date(user.createdAt).toLocaleDateString(),
    }));

  // 🔹 Fetch by UserId (default for initial load)
  const handleFetchByUserId = async (userId) => {
    try {
      setLoading(true);
      const response = await getAllByUserId(userId);
      if (response.data.success) {
        const users = response.data.data["User Details"] || [];
        setTableData(formatUsers(users));
      } else {
        message.error(response.data.msg || "Failed to fetch users by UserId");
      }
    } catch (err) {
      console.error(err);
      message.error("Error fetching by UserId");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch by RoleId
  const handleFetchByRoleId = async (roleId) => {
    try {
      setLoading(true);
      const response = await getAllByRoleId(roleId);
      if (response.data.success) {
        const users = response.data.data["User Details"] || [];
        setTableData(formatUsers(users));
      }
    } catch (err) {
      message.error("Error fetching by RoleId");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch single User by Id
  const handleGetUserById = async (id) => {
    try {
      setLoading(true);
      const response = await getUserById(id);
      if (response.data.success) {
        const user = response.data.data;
        setTableData(formatUsers([user])); // single user in table
      }
    } catch (err) {
      message.error("Error fetching user by Id");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Fetch Manager & Admin by Client
  const handleGetManagerAndAdmin = async (clientUserId) => {
    try {
      setLoading(true);
      const response = await getManagerAndAdminUsersByClient(clientUserId);
      if (response.data.success) {
        const users = response.data.data["User Details"] || [];
        setTableData(formatUsers(users));
      }
    } catch (err) {
      message.error("Error fetching Manager/Admin users");
    } finally {
      setLoading(false);
    }
  };

  // Default load → maybe by a specific userId
  useEffect(() => {
    handleFetchByUserId("123"); // pass a real userId
  }, []);

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Users" }]} />
      </div>

      {/* Buttons to test APIs */}
      <div className="flex gap-2 mb-4">
        <Button onClick={() => handleFetchByUserId("123")}>Get by UserId</Button>
        <Button onClick={() => handleFetchByRoleId("456")}>Get by RoleId</Button>
        <Button onClick={() => handleGetUserById("789")}>Get User by Id</Button>
        <Button onClick={() => handleGetManagerAndAdmin("321")}>
          Get Manager/Admin
        </Button>
      </div>

      <Spin spinning={loading}>
        <TableComponent columns={columns} data={tableData} paginationSize={10} />
      </Spin>
    </Container>
  );
};

export default AllUser;
