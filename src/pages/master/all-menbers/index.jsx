import { Fragment, useEffect, useState } from "react";
import { BadgeDollarSign, FileText, Receipt } from "lucide-react";
import { GetAllMemberByUserId } from "@/services/apiServices"; // ✅ your API

import { Tooltip } from "antd";
import { Container } from "@/components/container";
import { Breadcrumbs } from "@/layouts/demo1/breadcrumbs/Breadcrumbs";
import { TableComponent } from "@/components/table/TableComponent";
import { columns, defaultData } from "./constant";
import useStyle from "./style";

import { Link } from "react-router-dom";
import { underConstruction } from "@/underConstruction";
import AddMember from "@/partials/modals/add-member/AddMember";
import ViewMemberDetails from "@/partials/modals/view-member-details/ViewMemberDetails";

const AllMemberMaster = () => {
  const classes = useStyle();
  const [isViewMemberModalOpen, setIsViewMemberModalOpen] = useState(false);
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;
  console.log("User ID:", Id);

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
            country: member["userBasicDetails"].country.name || "-",
            contact: member.contactNo || "-",
            role: member["userBasicDetails"].role.name || "-",
            task_access: member["userBasicDetails"].isTaskAccess || "-",
            leave_attendence_access:
              member["userBasicDetails"].isAttendanceLeaveAccess || "-",
            city: member["userBasicDetails"].city.name || "-",
            state: member["userBasicDetails"].state.name || "-",
            companyEmail: member["userBasicDetails"].companyEmail || "-",
          }));
          console.log("Formatted Member Data:", formatted);
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

//   const handleDelete = (memberId) => {
//   DeleteMember(memberId)  // direct API call
//     .then(() => {
//       FetchMembers();
//     })
//     .catch((error) => {
//       console.error("Error deleting member:", error);
//     });
// };


  const responseFormate = () => {
    const data = defaultData.map((item) => {
      return {
        ...item,
        proforma_invoice: (
          // <Link to="/proforma-invoice">
          <Tooltip className="cursor-pointer" title="Proforma Invoice">
            <div
              className="flex justify-center items-center w-full"
              onClick={underConstruction}
            >
              <FileText className="w-5 h-5 text-primary" />
            </div>
          </Tooltip>
          // </Link>
        ),
        invoice: (
          <Link to="/invoice-dashboard">
            <Tooltip className="cursor-pointer" title="Invoice">
              <div className="flex justify-center items-center w-full">
                <Receipt className="w-5 h-5 text-success" />
              </div>
            </Tooltip>
          </Link>
        ),
        quotation: (
          <Link to="/quotation">
            <Tooltip className="cursor-pointer" title="Quotation">
              <div className="flex justify-center items-center w-full">
                <BadgeDollarSign className="w-5 h-5 text-blue-600" />
              </div>
            </Tooltip>
          </Link>
        ),
        handleModalOpen: handleModalOpen,
      };
    });
    return data;
  };
  useEffect(() => {
    setTableData(responseFormate());
  }, []);
  return (
    <Fragment>
      <Container>
        {/* Breadcrumbs */}
        <div className="gap-2 pb-2 mb-3">
          <Breadcrumbs items={[{ title: "All Member Master" }]} />
        </div>
        {/* filters */}
        <div className="filters flex flex-wrap items-center justify-between gap-2 mb-3">
          <div
            className={`flex flex-wrap items-center gap-2 ${classes.customStyle}`}
          >
            <div className="filItems relative">
              <i className="ki-filled ki-magnifier leading-none text-md text-primary absolute top-1/2 start-0 -translate-y-1/2 ms-3"></i>
              <input
                className="input pl-8"
                placeholder="Search Member"
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
              title="Add Member"
            >
              <i className="ki-filled ki-plus"></i> Add Member
            </button>
          </div>
        </div>
        <AddMember
          isModalOpen={isMemberModalOpen}
          refreshData={FetchMembers}
          setIsModalOpen={setIsMemberModalOpen}
          selectedMember={selectedMember} // ✅ pass selected member
        />

        <ViewMemberDetails
          isModalOpen={isViewMemberModalOpen}
          setIsModalOpen={setIsViewMemberModalOpen}
          memberData={selectedMember}
        />

        <TableComponent
          columns={columns( handleEdit, handleView )}
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default AllMemberMaster;
