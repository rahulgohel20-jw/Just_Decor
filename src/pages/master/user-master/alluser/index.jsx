import { useEffect, useState } from "react";
import AssignTheme from "../theme";
import { message, Spin, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../alluser/constant";
import { getAllByRoleId, LoginWithOtp } from "@/services/apiServices";
import ApproveOtp from "../approveotp";

const AllUser = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedThemeUserId, setSelectedThemeUserId] = useState(null);

  const formatUsers = (users) => {
    return users
      .sort((a, b) => b.id - a.id)
      .map((user) => {
        const planPrice = Number(user.userPlan?.planAmount) || 0;
        const basePrice = Number(user.userPlan?.planBaseAmount) || 0;

        return {
          id: user.id,
          fullName: `${user.firstName} ${user.lastName}`,
          city: user.userBasicDetails?.city?.name || "-",
          contactNo: user.contactNo,
          companyName: user.userBasicDetails?.companyName || "-",
          plan: user.userPlan?.plan?.name || "-",
          isActive: user.isActive,
          isApprove: user.isApprove,
          createdAt: user.createdAt,
          email: user.email,
          userCode: user.userCode || "-",
          remark: user.remarks || "-",
          database: user.database || "-",
          planPrice,
          basePrice,
          dueAmount: planPrice - basePrice, // ✅ Important
        };
      });
  };

  const handleFetchByRoleId = async (roleId = 1) => {
    try {
      setLoading(true);
      const response = await getAllByRoleId(roleId);

      if (response.data.success) {
        const users =
          response.data.data?.["User Details"] || response.data.data || [];

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
            u.fullName?.toLowerCase().includes(lower) ||
            u.email?.toLowerCase().includes(lower) ||
            u.companyName?.toLowerCase().includes(lower) ||
            u.plan?.toLowerCase().includes(lower) ||
            u.userCode?.toLowerCase().includes(lower)
        )
      );
    }
  }, [searchText, tableData]);

  const handleThemeClick = (userId) => {
    setSelectedThemeUserId(userId);
    setIsThemeModalOpen(true);
  };

  const handleApproveOtp = async (userId) => {
    try {
      setLoading(true);
      const mobile = 8866889580;
      const res = await LoginWithOtp(mobile);

      if (res?.data?.success) {
        message.success("OTP sent successfully");
        setSelectedThemeUserId(userId);
        setIsOtpModalOpen(true);
      } else {
        message.error(res?.data?.msg || "Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
      message.error("Something went wrong while sending OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container>
      <div className="gap-2 pb-2 mb-3">
        <Breadcrumbs items={[{ title: "Members" }]} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input.Search
          placeholder="Search users..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <Link to="/auth/signup">
          <button className="btn btn-primary flex items-center gap-1">
            Add User
          </button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-96">
          <Spin size="large" tip="Loading..." />
        </div>
      ) : (
        <TableComponent
          columns={columns(
            navigate,
            handleThemeClick,
            handleApproveOtp
          )}
          data={filteredData}
          paginationSize={10}
          rowClassName={(row) =>
            row.dueAmount > 0
              ? "bg-red-100 border-l-4 border-red-600"
              : ""
          }
        />
      )}

      <ApproveOtp
        isModalOpen={isOtpModalOpen}
        setIsModalOpen={setIsOtpModalOpen}
        userId={selectedThemeUserId}
        refreshData={handleFetchByRoleId}
      />

      <AssignTheme
        isModalOpen={isThemeModalOpen}
        setIsModalOpen={setIsThemeModalOpen}
        userId={selectedThemeUserId}
      />
    </Container>
  );
};

export default AllUser;