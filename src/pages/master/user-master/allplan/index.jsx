import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { planColumns } from "./constant";
import { getAllByRoleId  } from "@/services/apiServices";

const PlanTable = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);

useEffect(() => {
  const fetchAdmins = async () => {
    setLoading(true);

    try {
      const response = await getAllByRoleId(1);
      console.log("API Response:", response.data);

      if (response.data.success) {
        let admins = response?.data?.data?.["User Details"];

        if (!Array.isArray(admins)) {
          admins = [admins];
        }

        

        const planData = admins.map((user) => ({
  id: user.id,
  customerName: `${user.firstName || "-"} ${user.lastName || "-"}`,
  planName: user.plan?.name || "-",
  planPrice: user.plan?.price || "-",
  billingCycle: user.plan?.billingCycle || "-",
  planDescription: user.plan?.description || "-",
  isPopular: user.plan?.isPopular ? "Yes" : "No",
}));


        setPlans(planData);
        setFilteredPlans(planData);
      } else {
        message.error(response.data.msg || "No admins found");
      }
    } catch (err) {
      console.error("❌ Fetch error:", err);
      message.error("Error fetching admins");
    } finally {
      setLoading(false);
    }
  };

  fetchAdmins();
}, []);

  // Handle search
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchText(value);

    const filtered = plans.filter((plan) =>
      plan.customerName.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPlans(filtered);
  };

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "User Plans" }]} />
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
        <TableComponent
          columns={planColumns}
          data={filteredPlans} // ✅ show filtered plans
          paginationSize={10}
        />
      </Spin>
    </Container>
  );
};

export default PlanTable;
