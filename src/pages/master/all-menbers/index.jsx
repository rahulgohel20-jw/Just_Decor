import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { GetAllMemberByUserId } from "@/services/apiServices";
import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns } from "./constant";
import useStyle from "./style";
import { Link } from "react-router-dom";
import AddMember from "@/partials/modals/add-member/AddMember";
import ViewMemberDetails from "@/partials/modals/view-member-details/ViewMemberDetails";
import { FormattedMessage, useIntl } from "react-intl";

const AllMemberMaster = () => {
  const classes = useStyle();
  const [isViewMemberModalOpen, setIsViewMemberModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [tableData, setTableData] = useState([]);

  const intl = useIntl(); // ✅ fixed

  const Id = localStorage.getItem("userId");

  useEffect(() => {
    FetchMembers();
  }, []);

  // ✅ Fetch all members
  const FetchMembers = () => {
    GetAllMemberByUserId(Id)
      .then((res) => {
        const userDetails = res?.data?.data?.["User Details"];
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

        {/* Filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
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

        <ViewMemberDetails
          isModalOpen={isViewMemberModalOpen}
          setIsModalOpen={setIsViewMemberModalOpen}
          memberData={selectedMember}
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

export default AllMemberMaster;
