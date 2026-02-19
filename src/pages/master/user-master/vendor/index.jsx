import { useEffect, useState } from "react";
import AssignTheme from "../theme";
import { message, Spin, Input } from "antd";
import { Link, useNavigate } from "react-router-dom";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "../vendor/constant";
import { getAllByRoleId, LoginWithOtp } from "@/services/apiServices";
import ApproveOtp from "../approveotp";

const AllVendor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [isThemeModalOpen, setIsThemeModalOpen] = useState(false);
  const [isOtpModalOpen, setIsOtpModalOpen] = useState(false);
  const [selectedThemeUserId, setSelectedThemeUserId] = useState(null);

  const formatUsers = (users) => {
    const managerMap = {};
    users.forEach((u) => {
      managerMap[u.id] = `${u.firstName} ${u.lastName}`;
    });
    return users
      .sort((a, b) => b.id - a.id)
      .map((user) => ({
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
      }));
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
            u.userCode?.toLowerCase().includes(lower),
        ),
      );
    }
  }, [searchText, tableData]);

  const handleEdit = (user) => {
    setEditingUserId(user);
  };

  const handleApprove = async (userId) => {
    try {
      setLoading(true);
      const res = await updateStatusApprove(userId);
      if (res.data.success) {
        message.success("User approved successfully");
        handleFetchByRoleId();
      } else {
        message.error(res.data.msg || "Failed to approve user");
      }
    } catch (err) {
      console.error(err);
      message.error("Error approving user");
    } finally {
      setLoading(false);
    }
  };
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
        <Breadcrumbs items={[{ title: "Vendors" }]} />
      </div>

      <div className="flex items-center justify-between mb-4">
        <Input.Search
          placeholder="Search vendor..."
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 250 }}
        />

        <Link to="/auth/signup">
          <button className="btn btn-primary flex items-center gap-1">
            <i className="ki-filled ki-plus"></i> Add Vendor
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
            handleEdit,
            handleApprove,
            navigate,
            handleThemeClick,
            handleApproveOtp,
          )}
          data={filteredData}
          paginationSize={10}
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

export default AllVendor;
