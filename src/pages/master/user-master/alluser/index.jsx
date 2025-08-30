import { useEffect, useState } from "react";
import { message, Spin, Input } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../alluser/constant";
import { getAllByRoleId } from "@/services/apiServices";

const AllUser = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);       // full data
  const [filteredData, setFilteredData] = useState([]); // for search results
  const [userId, setUserId] = useState("");
  const [searchText, setSearchText] = useState("");

  // 🔹 Common formatting function
  const formatUsers = (users) =>
    users.map((user, index) => ({
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

  // 🔹 Fetch users by UserId
  const handleFetchByUserId = async (id) => {
    if (!id) {
      message.warning("Please enter a User Id");
      return;
    }
    try {
      setLoading(true);
      const response = await getAllByRoleId(id);
      console.log("🔍 API Response:", response.data);

      if (response.data.success) {
        const users = response.data.data?.["User Details"] || response.data.data || [];
        const formatted = formatUsers(users);
        setTableData(formatted);
        setFilteredData(formatted); // initialize search data
      } else {
        message.error(response.data.msg || "No users found");
      }
    } catch (err) {
      console.error("❌ API Error:", err);
      message.error("Error fetching users by UserId");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Search filter
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

  // 🔹 Load default user list on mount
  useEffect(() => {
    handleFetchByUserId("1"); // load userId=1 initially
  }, []);

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Users" }]} />
      </div>

      {/* Input & Button to fetch */}
      <div className="flex gap-2 mb-4">
        
        <Input.Search
          placeholder="Search users..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />
      </div>

      <Spin spinning={loading}>
        <TableComponent columns={columns} data={filteredData} paginationSize={10} />
      </Spin>
    </Container>
  );
};

export default AllUser;
