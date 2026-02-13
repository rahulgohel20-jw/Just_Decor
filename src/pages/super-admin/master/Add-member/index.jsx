import { Fragment, useEffect, useState } from "react";
import { GetAllMemberByUserId } from "@/services/apiServices";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import AddMember from "@/partials/modals/add-member/AddMember";
import { FormattedMessage, useIntl } from "react-intl";

import { AlertCircle, Clock, Hourglass, CheckCircle, Bell } from "lucide-react";
import MemberPerformanceSidebar from "./MemberPerformanceSidebar";

const SuperadminMember = () => {
  const [isViewMemberModalOpen, setIsViewMemberModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [tableData, setTableData] = useState([]);

  const intl = useIntl();

  const tickets = [];

  const Id = localStorage.getItem("userId");

  useEffect(() => {
    FetchMembers();
  }, []);

  // ✅ Fetch all members
  const FetchMembers = () => {
    GetAllMemberByUserId(Id)
      .then((res) => {
        console.log();

        const userDetails = res?.data.data.userDetails.userDetails;

        if (userDetails && Array.isArray(userDetails)) {
          const formatted = userDetails.map((member, index) => ({
            id: member.id,
            sr_no: index + 1,
            email: member.email || "-",
            full_name:
              `${member.firstName || ""} ${member.lastName || ""}`.trim() ||
              "-",
            memberid: member.id,
            country: member["userBasicDetails"]?.country?.name || "-",
            contact: member.contactNo || "-",
            role: member["userBasicDetails"]?.role?.name || "-",
            task_access: member["userBasicDetails"]?.isTaskAccess
              ? "Yes"
              : "No",
            leave_attendence_access: member["userBasicDetails"]
              ?.isAttendanceLeaveAccess
              ? "Yes"
              : "No",
            city: member["userBasicDetails"]?.city?.name || "-",
            state: member["userBasicDetails"]?.state?.name || "-",
            companyEmail: member["userBasicDetails"]?.companyEmail || "-",
          }));
          setTableData(formatted);
        } else {
          setTableData([]);
        }
      })
      .catch((error) => {
        console.error("Error fetching members:", error);
      });
  };

  const handleEdit = (member) => {
    setSelectedMember(member);
    setIsMemberModalOpen(true);
  };
  const handleView = (member) => {
    setSelectedMember(member);
    setIsViewMemberModalOpen(true);
  };

  const calculateStats = () => {
    const stats = {
      pending: 10,
      confirm: 40,
      cancel: 70,
      hot: 80,
      cold: 90,
      inquiry: 20,
    };

    tickets.forEach((ticket) => {
      const status = ticket.status?.toLowerCase();
      if (status && stats.hasOwnProperty(status)) {
        stats[status]++;
      }
    });

    return stats;
  };

  const stats = calculateStats();

  const statusCards = [
    {
      id: "pending",
      title: "Pending",
      count: stats.pending,
      icon: Clock,
      bgColor: "bg-gray-50",
      iconColor: "text-gray-600",
      borderColor: "border-gray-200",
      countColor: "text-gray-800",
    },
    {
      id: "confirm",
      title: "Confirm",
      count: stats.confirm,
      icon: CheckCircle,
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
      borderColor: "border-green-200",
      countColor: "text-gray-800",
    },
    {
      id: "cancel",
      title: "Cancel",
      count: stats.cancel,
      icon: AlertCircle,
      bgColor: "bg-red-50",
      iconColor: "text-red-600",
      borderColor: "border-red-200",
      countColor: "text-gray-800",
    },
    {
      id: "hot",
      title: "Hot",
      count: stats.hot,
      icon: Bell,
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
      borderColor: "border-orange-200",
      countColor: "text-gray-800",
    },
    {
      id: "cold",
      title: "Cold",
      count: stats.cold,
      icon: Hourglass,
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
      borderColor: "border-blue-200",
      countColor: "text-gray-800",
    },
    {
      id: "inquiry",
      title: "Inquiry",
      count: stats.inquiry,
      icon: Bell,
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
      borderColor: "border-purple-200",
      countColor: "text-gray-800",
    },
  ];

  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs
            items={[
              {
                title: (
                  <FormattedMessage
                    id="USER.MASTER.ALL_MEMBER_MASTER"
                    defaultMessage="All Member Master"
                  />
                ),
              },
            ]}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {statusCards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.id}
                className={`${card.bgColor} flex justify-between rounded-lg p-4 border ${card.borderColor} hover:shadow-md transition-shadow`}
              >
                <div className="flex items-center">
                  {/* Icon */}
                  <div
                    className={`${card.bgColor} w-12 h-12 rounded-lg flex items-center justify-center `}
                  >
                    <Icon className={`${card.iconColor} w-6 h-6`} />
                  </div>

                  {/* Title */}
                  <h3 className="text-sm font-medium text-gray-600 mb-1">
                    {card.title}
                  </h3>
                </div>

                <div>
                  {/* Count */}
                  <div className="flex items-baseline gap-2">
                    <span className={`text-3xl font-bold ${card.countColor}`}>
                      {card.count.toString().padStart(2, "0")}
                    </span>
                  </div>

                  {/* Subtitle (only for overdue) */}
                  {card.subtitle && (
                    <p className="text-xs text-red-500 mt-1">{card.subtitle}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div className={`flex flex-wrap items-center gap-2`}>
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder={intl.formatMessage({
                  id: "USER.MASTER.SEARCH_MEMBER",
                  defaultMessage: "Search Member...",
                })}
                type="text"
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              className="btn btn-primary"
              onClick={() => {
                setIsMemberModalOpen(true);
                setSelectedMember(null);
              }}
            >
              <i className="ki-filled ki-plus"></i>
              <FormattedMessage
                id="USER.MASTER.ADD_MEMBER"
                defaultMessage="Add Member"
              />
            </button>
          </div>
        </div>

        {/* Modals */}
        <AddMember
          isModalOpen={isMemberModalOpen}
          refreshData={FetchMembers}
          setIsModalOpen={setIsMemberModalOpen}
          selectedMember={selectedMember}
        />

        <MemberPerformanceSidebar
          isOpen={isViewMemberModalOpen}
          onClose={() => setIsViewMemberModalOpen(false)}
          staffData={selectedMember}
        />

        {/* Table */}
        <TableComponent
          columns={columns(handleEdit, handleView)}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};

export default SuperadminMember;
