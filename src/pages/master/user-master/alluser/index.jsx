import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../alluser/constant";
import { fetchAllUsers } from "@/services/apiServices";

const AllUser = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await fetchAllUsers();
        console.log("API response:", response.data);

        if (response.data.success) {
          const users = response.data.data["User Details"]; 
          if (!users || users.length === 0) {
            message.info("No users found");
            setTableData([]);
            setAllUsers([]);
            return;
          }

          const formattedData = users.map((user, index) => ({
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

          setTableData(formattedData);
          setAllUsers(formattedData);
        } else {
          message.error(response.data.msg || "Failed to fetch users");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleSearch = (e) => {
    const value = e.target.value.toLowerCase();
    setSearchText(value);

    const filtered = allUsers.filter((user) =>
      user.first_name.toLowerCase().includes(value) ||
      user.last_name.toLowerCase().includes(value) ||
      user.email.toLowerCase().includes(value) ||
      user.contactNo.toLowerCase().includes(value) ||
      user.companyName.toLowerCase().includes(value) ||
      user.role.toLowerCase().includes(value)
    );

    setTableData(filtered);
  };

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Users" }]} />
      </div>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search Users"
          value={searchText}
          onChange={handleSearch}
          className="border border-gray-300 rounded px-3 py-2 w-full md:w-1/3"
        />
      </div>

      <Spin spinning={loading}>
        <TableComponent columns={columns} data={tableData} paginationSize={10} />
      </Spin>
    </Container>
  );
};

export default AllUser;
