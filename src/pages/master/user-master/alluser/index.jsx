import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";

const AllUser = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://103.1.101.244:9091/v1/api/user/getall");
      const json = await res.json();

      if (json.success) {
        const formattedData = json.data["User Details"].map((user, index) => ({
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
      } else {
        message.error(json.msg || "Failed to fetch users");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Users" }]} />
      </div>

      <Spin spinning={loading}>
        <TableComponent columns={columns} data={tableData} paginationSize={10} />
      </Spin>
    </Container>
  );
};

export default AllUser;
