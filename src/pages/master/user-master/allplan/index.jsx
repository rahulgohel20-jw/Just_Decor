import { useEffect, useState } from "react";
import { message, Spin } from "antd";
import { fetchAllUsers } from "@/services/apiServices"; 
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { planColumns } from "./constant";

const PlanTable = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState("");
  const [filteredPlans, setFilteredPlans] = useState([]);

  useEffect(() => {
    const getPlans = async () => {
      try {
        const response = await fetchAllUsers();
        if (response.data.success) {
          const users = response.data.data["User Details"];

          // Extract only plan details + customer name
        const planData = users.map((user) => ({
  id: user.id,
  customerName: `${user.firstName} ${user.lastName}`,
  planName: user.plan?.name || "-",
  planPrice: user.plan?.price || "-",
  billingCycle: user.plan?.billingCycle || "-",
  planDescription: user.plan?.description || "-",
  isPopular: user.plan?.isPopular || false,
}));


          setPlans(planData);
          setFilteredPlans(planData); // initial table data
        } else {
          message.error(response.data.msg || "Failed to fetch plans");
        }
      } catch (err) {
        console.error(err);
        message.error("Error fetching plans");
      } finally {
        setLoading(false);
      }
    };

    getPlans();
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
        <TableComponent 
          columns={planColumns} 
          data={filteredPlans}   // ✅ use filteredPlans, not plans
          paginationSize={10} 
        />
      </Spin>
    </Container>
  );
};

export default PlanTable;
