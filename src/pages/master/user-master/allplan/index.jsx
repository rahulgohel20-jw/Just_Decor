import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { planColumns } from "./constant";

const AllPlan = () => {
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://103.1.101.244:9091/v1/api/user/getall");
      const json = await res.json();

      if (json.success) {
        const formattedData = json.data["User Details"].map((user, index) => ({
          sr_no: index + 1,
          name: user.plan?.name || "-",
          price: user.plan?.price || "-",
        }));
        setTableData(formattedData);
      } else {
        message.error(json.msg || "Failed to fetch plans");
      }
    } catch (error) {
      console.error(error);
      message.error("Error fetching plans");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlans();
  }, []);

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "All Plans" }]} />
      </div>

      <Spin spinning={loading}>
        <TableComponent
          columns={planColumns}
          data={tableData}
          paginationSize={10}
        />
      </Spin>
    </Container>
  );
};

export default AllPlan;
