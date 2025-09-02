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
import { FetchAllUser } from "@/services/apiServices";
import AddMember from "@/partials/modals/add-member/AddMember";

const AllMemberMaster = () => {
  const classes = useStyle();
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false);
const [selectedMember, setSelectedMember] = useState(null);
  const [tableData, setTableData] = useState([]);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };
  useEffect(() => {
    Fetchalluser();
  }, []);

  let userData = JSON.parse(localStorage.getItem("userData"));
  let Id = userData.id;


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
          sr_no: index + 1,
          email: member.email || "-",
          full_name: `${member.firstName || ""} ${member.lastName || ""}`.trim() || "-",
          memberid: member.id,
          country: member["userBasicDetails"].country.name || "-",
          contact: member.contactNo || "-",
          role: member["userBasicDetails"].role.name || "-",
          task_access: member["userBasicDetails"].isTaskAccess || "-",
          leave_attendence_access: member["userBasicDetails"].isAttendanceLeaveAccess || "-",
          city: member["userBasicDetails"].city.name || "-",
          state: member["userBasicDetails"].state.name || "-",
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



  const Fetchalluser = () => {
    FetchAllUser(Id)
      .then((res) => {
        const formatted = res.data.data["User Details"].map((cust, index) => ({
          sr_no: index + 1,
          first_name: cust.firstName,
          last_name: cust.lastName,
          country: cust.userBasicDetails.country.name,
          whatsapp: cust.contactNo,
          role: cust.userBasicDetails.role.name,
          email: cust.email,
          task_access: cust.userBasicDetails.isTaskAccess,
          leave_attendence_access:
            cust.userBasicDetails.isAttendanceLeaveAccess,
          eventid: cust.id,
        }));

        setTableData(formatted);
      })
      .catch((error) => {
        console.error("Error deleting customer:", error);
      });
  };
  const DeleteUser = (id) => {
    DeleteCategoryId(id)
      .then((res) => {
        Fetchalluser();
        res.data?.msg && successMsgPopup(res.data.msg);
      })
      .catch((error) => {
        console.error("Error deleting Event type:", error);
      });
  };

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
              onClick={() => setIsMemberModalOpen(true)}
              title="Add Member"
            >
              <i className="ki-filled ki-plus"></i> Add Member
            </button>
          </div>
        </div>
        <AddMember
          isModalOpen={isMemberModalOpen}
          setIsModalOpen={setIsMemberModalOpen}
        />
        <TableComponent
          columns={columns} // just edit
          data={tableData}
          paginationSize={10}
        />
      </Container>
    </Fragment>
  );
};
export default AllMemberMaster;